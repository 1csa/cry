const { defaultTo } = require("lodash");

module.exports = class extends think.Model {
  get tableName() {
    return 'card_launch';
  }

  // 获取单条投放数据
  async getLaunchById(id) {
    const query_res = await this.query(` SELECT * FROM card_launch WHERE launch_id='${id}' AND launch_status <> 0;`);

    if (!query_res || query_res.length !== 1) {
      throw new Error(think.config('errors').empty_record);
    }

    return query_res[0];
  }

  // TODO 添加或者修改投放，修改需要卡一下时间
  async postLaunch(form, username, timekey, isnew) {
    const strat_id = form.strat_id;
    const card_id = form.card_id;
    const launch_id = isnew ? timekey : form.launch_id;

    if (!strat_id || !card_id) {
      throw new Error(think.config('errors').param_value);
    }

    const card = await this.query(`SELECT card_status status FROM card_basic WHERE card_id = '${card_id}';`);
    const strat = await this.query(`SELECT strat_status status FROM card_strat WHERE strat_id = '${strat_id}';`);

    if (card.length === 0 || card[0].status === -1) {
      throw new Error("未找到关联卡片或者关联卡片已停用");
    }

    if (strat.length === 0 || strat[0].status === -1) {
      throw new Error('未找到关联策略或者关联策略已停用');
    }

    return await this.transaction(async () => {
      if (isnew) {
        await this.add({ ...form, create_timekey: timekey, launch_id: timekey, launch_creator: username });
      } else {
        // 这里注意啊 投放中的卡片 无法修改！！！ 必须停用后再修改
        await this.where(`launch_id='${form.launch_id}' AND launch_status <> 2`).update({ ...form, launch_updater: username, update_timekey: timekey });
      }
      // 插入日志
      await this.execute(`
        INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
        VALUES ('${launch_id}', 'launch', '${form.launch_name}', '${isnew ? 'add' : 'update'}', '${username}', '${JSON.stringify(form)}', '${timekey}');
      `);

      return launch_id;
    })
  }

  // 获取投放列表
  // TODO 投放状态筛选目前只支持了单种状态的筛选，需要修改成多种状态
  async getLaunchList(query) {
    const { launch_id, launch_appid, launch_card, launch_name, launch_status, create_start, create_end, launch_start, launch_end, page, pageCount } = query;

    let query_where = '1=1 ';

    console.log(query_where, 'query before')

    if (launch_id) {
      query_where += `AND l.launch_id LIKE '${launch_id}%' `;
    }

    if (launch_card) {
      query_where += `AND l.card_id = '${launch_card}' `;
    }

    if (launch_name) {
      query_where += `AND l.launch_name LIKE '${launch_name}%' `;
    }

    if (create_start && create_end) {
      query_where += `AND l.create_timekey BETWEEN '${create_start}' AND '${create_end}' `;
    }

    if (launch_start && launch_end) {
      query_where += `AND l.launch_start > '${launch_start}' AND l.launch_end < '${launch_end}' `;
    }

    if (launch_appid) {
      query_where += `AND s.strat_appid = '${launch_appid}' `
    }

    const list_res = await this.query(`
      SELECT l.id, l.launch_id, l.card_id, l.strat_id, l.launch_name, l.launch_remark, l.launch_status, l.create_timekey, l.launch_creator, l.launch_start, l.launch_end, s.strat_appid launch_appid
      FROM card_launch l
      JOIN card_strat s ON l.strat_id = s.strat_id
      WHERE ${query_where}
      ORDER BY create_timekey DESC
      LIMIT ${pageCount} OFFSET ${pageCount * (page - 1)};
    `);
    const total_res = await this.query(`
      SELECT COUNT(*) total
      FROM card_launch l
      JOIN card_strat s ON l.strat_id = s.strat_id
      WHERE ${query_where}
    `);

    return { list: list_res, total: total_res[0].total }
  }

  // 停用投放
  async stopLaunch(launch_id, username, timekey) {
    const stop_res = await this.where(`launch_id='${launch_id}' AND launch_status IN (1, 2)`).update({ launch_status: 4 });

    if (!stop_res) {
      throw new Error('停止投放失败，或者当前投放已停止');
    }

    await this.execute(`
      INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
      VALUES ('${launch_id}', 'launch', '', 'stop', '${username}', '${JSON.stringify({ launch_id })}', '${timekey}');
    `);
    return true;
  }

  // 复制投放
  // async copyLaunch(launch_id, username, timekey) {
  //   const target_data = await this.query(`
  //     SELECT card_id, strat_id, launch_name, launch_remark, launch_start, launch_end
  //     FROM card_launch
  //     WHERE launch_id='${launch_id} AND lauch_status <> -1';
  //   `);

  //   if (!target_data[0]) {
  //     throw new Error(think.config('errors').empty_record);
  //   }

  //   return await this.transaction(async () => {
  //     const copy_res = await this.add({ ...target_data[0], launch_id: timekey, launch_creator: username, create_timekey: timekey });

  //     await this.execute(`
  //         INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
  //         VALUES ('${timekey}', 'launch', '${target_data[0].launch_name}', 'copy', '${username}', '${JSON.stringify({launch_id, copy_id: copy_res})}', '${timekey}');
  //       `)

  //     return copy_res;
  //   })
  // }

  async getLaunchOptions(id) {
    return await this.query(` SELECT launch_name label, launch_id value FROM card_launch WHERE launch_id LIKE '${id}%' AND launch_status <> -1; `);
  }

  async updateLaunchStatus() {
    const now = Date.now();
    await this.where(`launch_status = 1 AND launch_end < '${now}'`).update({ launch_status: 3 });
    await this.where(`launch_status = 1 AND launch_start < '${now}' AND launch_end > '${now}' `).update({ launch_status: 2 });
  }
}
