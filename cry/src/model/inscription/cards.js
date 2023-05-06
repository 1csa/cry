// TODO 代码里thinkjs的model方案和sql语句混合在一起，需要尽可能的做统一
// TODO 添加sql注入的防范代码
module.exports = class extends think.Model {
  get tableName() {
    return 'card_basic';
  }

  // TODO: 需要优化成修改时仅update更改的字段
  async postIntoTable(cardItem, username, timekey, card_id, card_pid, card_root_id) {
    const { card_temp, card_title, card_remark, card_actions = {}, card_content = {}, card_style = {} } = cardItem;

    const card_action = card_actions.card_action || card_actions.card_more_action || '';
    const item_id = card_actions.card_itemid || '';

    const json_styles = JSON.stringify(card_style);
    const json_content = JSON.stringify(card_content);
    const json_actions = JSON.stringify(card_actions);

    let hasCardId = await this.where(`card_id='${cardItem.card_id}'`).select(); // 查询表中是否存在card_id 存在就update 否则add
    if (cardItem.card_id && hasCardId && hasCardId.length > 0) {
      await this.where(`card_id='${cardItem.card_id}'`).update({
        ...cardItem,
        item_id,
        card_action,
        card_actions: json_actions,
        card_content: json_content,
        card_style: json_styles,
        card_updater: username,
        update_timekey: timekey
      });
    } else {
      await this.add({
        card_id,
        item_id,
        card_pid,
        card_root_id,
        card_temp,
        card_title,
        card_remark,
        card_action,
        card_creator: username,
        card_style: json_styles,
        card_actions: json_actions,
        card_content: json_content,
        create_timekey: timekey
      });
    }

    return card_id;
  }

  // 大概是自己也会晕掉的逻辑。
  async postCard(cardItem, cards_delete, username, timekey, isnew) {
    const root_id = cardItem.card_id ? cardItem.card_id : timekey + this.random();

    const addFunc = async (cardItem, username, timekey, cid, pid) => {
      pid = await this.postIntoTable(cardItem, username, timekey, cid, pid, root_id);

      if (cardItem.card_items && cardItem.card_items.length > 0) {
        await Promise.all(cardItem.card_items.map(async (child) => {
          const child_id = child.card_id || timekey + this.random();
          return await addFunc(child, username, timekey, child_id, pid, root_id);
        }))
      }
    }

    return await this.transaction(async () => {
      await addFunc(cardItem, username, timekey, root_id, 0)

      if (cards_delete && cards_delete.length > 0) {
        for (let card of cards_delete.split(',')) {
          await this.execute(`UPDATE card_basic SET card_status = -1 WHERE card_id='${+card}' AND card_status <> -1;`);
        }
      }

      await this.execute(`
        INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
        VALUES ('${root_id}', 'card', '${cardItem.card_title}', '${isnew ? 'add' : 'update'}', '${username}', '${JSON.stringify({...cardItem, cards_delete})}', '${timekey}');
      `);

      return root_id;
    });
  }

  // 这里的逻辑是由加入逻辑，返回需要去掉pid和root_id信息，否则会一起提交
  async getCardById(card_id) {
    const query_res = await this.query(`
      SELECT card_id, card_pid, card_temp, card_title, card_remark, card_style, card_content, card_actions
      FROM card_basic
      WHERE card_root_id = '${card_id}' AND card_status <> -1;
    `);

    if (query_res.length === 0) {
      throw new Error(think.config('errors').empty_record);
    }

    let cid_map = {};
    let root_item; // pid和cid的索引

    for (let i = 0; i < query_res.length; i++) {
      const card_item = this.parseCardItem(query_res[i]);

      const cid = card_item.card_id;
      const pid = card_item.card_pid;

      if (pid == 0) {
        root_item = card_item
      }
      cid_map[cid] = card_item;
    }

    for (let j = 0; j < query_res.length; j++) {
      const pid = query_res[j].card_pid;
      const cid = query_res[j].card_id;

      if (pid == 0) {
        continue;
      }

      cid_map[pid].card_items.push(cid_map[cid]);
    }

    return this.cancelRelateId(root_item);
  }

  async getCardList(query, username) {
    const { card_id, card_title, card_temp, card_status, create_start, create_end, page, pageCount } = query;

    let query_where = `1=1 AND card_temp in ('1','2','3','1002','1003')`;

    if (card_id) {
      query_where += `AND card_id LIKE '${card_id}%' `;
    }

    if (card_title) {
      query_where += `AND card_title LIKE '${card_title}%' `;
    }

    if (card_temp) {
      query_where += `AND card_temp='${card_temp}' `;
    }

    if (card_status && card_status != 0) {
      query_where += `AND card_status='${card_status}' `;
    } else {
      query_where += `AND card_status <> -1 `;
    }

    if (create_start && create_end) {
      query_where += `AND create_timekey >= '${create_start}' AND create_timekey <= '${create_end}'`;
    }

    const query_list = await this.query(`
      SELECT card_id, card_temp, card_title, card_remark, card_status, card_creator, card_updater, create_timekey, update_timekey
      FROM card_basic card
      WHERE ${query_where}
      ORDER BY FIELD( card_updater, '${username}' ) DESC, create_timekey DESC, update_timekey DESC
      LIMIT ${pageCount} OFFSET ${pageCount * (page - 1)};
    `);
    const query_total = await this.query(`
      SELECT COUNT(*) total
      FROM card_basic card
      WHERE ${query_where};
    `)

    return {
      list: query_list,
      total: query_total[0].total
    };
  }

  // 关联事务，必须是卡片和投放一起修改才能生效
  async stopCard(card_id, username, timekey) {
    const relate_launch = await this.query(`SELECT * FROM card_launch WHERE card_id = '${card_id}' AND launch_status IN (1, 2);`);

    return await this.transaction(async () => {
      if (relate_launch.length > 0) {
        await this.execute(`UPDATE card_launch SET launch_status = 4 WHERE card_id = '${card_id}' AND launch_status IN (1, 2);`);
      }

      await this.execute(`UPDATE card_basic SET card_status = 2, card_updater='${username}', update_timekey='${timekey}' WHERE card_id = '${card_id}'  AND card_status = 1;`);
      await this.execute(`
        INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
        VALUES ('${card_id}', 'card', '', 'stop', '${username}', '${JSON.stringify({ card_id, relate_launch })}', '${timekey}');
      `);

      return true;
    })
  }

  // 仅恢复投放卡片的状态，关联投放不管
  async reuseCard(card_id, username, timekey) {
    const reuse_res = await this.execute(`UPDATE card_basic SET card_status = 1 WHERE card_id = '${card_id}' AND card_status = 2;`);

    if (reuse_res === 0) {
      throw new Error("启用卡片失败");
    }

    await this.execute(`
      INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
      VALUES ('${card_id}', 'card', '', 'reuse', '${username}', '${JSON.stringify({ card_id })}', '${timekey}');
    `);
    return true;
  }

  async deleteCard(card_id, username, timekey) {
    // 删除单条卡片会同时将关联的子卡片删除
    const effected_rows = await this.execute(`UPDATE card_basic SET card_status = -1 WHERE card_root_id='${card_id}' AND card_status <> -1;`);

    if (effected_rows === 0) {
      throw new Error("删除失败");
    }

    await this.execute(`
      INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
      VALUES ('${card_id}', 'card', '', 'delete', '${username}', '${JSON.stringify({ card_id })}', '${timekey}');
    `)

    return true;
  }

  async getCardOptions(id) {
    return await this.query(` SELECT card_title label, card_id value FROM card_basic WHERE card_id LIKE '${id}%' AND card_pid = 0 AND card_status <> -1; `);
  }

  // 解析卡片内容
  parseCardItem(cardItem) {
    const { card_content, card_actions, card_style, ...card_item } = cardItem;

    const json_content = card_content ? JSON.parse(card_content) : {};
    const json_actions = card_actions ? JSON.parse(card_actions) : {};
    const json_style = card_style ? JSON.parse(card_style) : {};

    return { ...card_item, card_content: json_content, card_actions: json_actions, card_style: json_style, card_items: [] };
  }

  // 去掉关联id
  cancelRelateId(card) {
    delete card.card_pid;

    if (card.card_items) {
      for (let item of card.card_items) {
        this.cancelRelateId(item);
      }
    }

    return card;
  }

  random() {
    return Math.floor(1000 * Math.random(0, 1));
  }
}
