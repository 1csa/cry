// 统一使用strat_id来作为修改的id，id仅作为数据库的主key，不参与任何逻辑操作----脑子瓦特了答应新生用strat_id来做业务逻辑
// TODO 思考：是否有必要使用事务来做日志的统一
module.exports = class extends think.Model {
  get tableName() {
    return 'card_strat';
  }

  async getStratById(strat_id) {
    const get_res = await this.query(` SELECT * FROM card_strat WHERE strat_id='${strat_id}' AND strat_status <> 0;`);

    if (!get_res || get_res.length !== 1) {
      throw new Error(think.config('errors').empty_record);
    }

    return get_res[0];
  }

  // 新增也需要返回id
  async postStrat(strat_item, username, timekey, isnew) {
    const strat_id = isnew ? timekey : strat_item.strat_id;

    return await this.transaction(async () => {
      if (isnew) {
        await this.add({ ...strat_item, strat_id: timekey, create_timekey: timekey, strat_creator: username });
      } else {
        if (!strat_item.strat_id) {
          throw new Error(think.config('errors').param_value);
        }
        await await this.where(`strat_id = ${strat_id}`).update({ ...strat_item, strat_updater: username, update_timekey: timekey });
      }

      await this.execute(`
        INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
        VALUES ('${strat_id}', 'strategy', '${strat_item.strat_title}', '${isnew ? 'add' : 'update'}', '${username}', '${JSON.stringify(strat_item)}', '${timekey}');
      `);

      return strat_id;
    });
  }

  // 停用策略时需要同步停用关联的投放, 需关联的投放当前自身状态为待投放或者投放中
  async stopStrat(strat_id, username, timekey) {
    const relate_launch = await this.relateList(strat_id);

    if (relate_launch.length > 0) {
      await this.execute(`UPDATE card_launch SET launch_status = 4 WHERE strat_id='${strat_id}' AND launch_status IN (1,2);`);
    }

    return await this.transaction(async () => {
      await this.where({ strat_id: strat_id }).update({ strat_status: 2, strat_updater: username, update_timekey: timekey });
      await this.execute(`
        INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
        VALUES ('${timekey}', 'strategy', '', 'stop', '${username}', '${JSON.stringify({ strat_id, relate_launch })}', '${timekey}');
      `);

      return true;
    })
  }

  // 启用策略时，仅修改策略自身的状态
  async reuseStrat(strat_id, username, timekey) {
    await this.where({ strat_id }).update({ strat_status: 1, strat_updater: username, update_timekey: timekey });
    await this.execute(`
      INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
      VALUES ('${timekey}', 'strategy', '', 'reuse', '${username}', '${JSON.stringify({strat_id})}', '${timekey}');
    `)

    return true
  }

  // 获取策略关联到的id，做二次确认用
  async relateList(strat_id) {
    return await this.query(`SELECT launch_id launch_name FROM card_launch WHERE strat_id='${strat_id}' AND launch_status IN (1, 2);`);
  }

  // 获取策略列表
  async getStratList(query) {
    const { strat_id, strat_appid, strat_title, strat_status, create_start, create_end, page, pageCount } = query;

    let query_where = '1=1 ';

    if (strat_id) {
      query_where += `AND strat_id LIKE '${strat_id}%' `;
    }

    if (strat_title) {
      query_where += `AND strat_title LIKE '${strat_title}%' `;
    }

    if (strat_appid) {
      query_where += `AND strat_appid LIKE '%${strat_appid}%' `;
    }

    if (strat_status && strat_status != 0) {
      query_where += `AND strat_status ='${strat_status}' `;
    } else {
      query_where += `AND strat_status <> -1 `;
    }

    if (create_start && create_end) {
      query_where += `AND create_timekey >= '${create_start}' AND create_timekey <= '${create_end}' `;
    }

    const list_res = await this.query(`
      SELECT strat_id, strat_appid, strat_title, strat_remark, strat_status, create_timekey, strat_creator, update_timekey, strat_updater
      FROM card_strat strat
      WHERE ${query_where}
      ORDER BY create_timekey DESC
      LIMIT ${pageCount} OFFSET ${pageCount * (page - 1)};
    `);
    const total_res = await this.query(`
      SELECT COUNT(*) total
      FROM card_strat strat
      WHERE ${query_where};
    `);

    return {
      list: list_res,
      total: total_res[0].total
    }
  }

  // 删除策略
  async deleteStrat(strat_id, username, timekey) {
    const effected_rows = await this.execute(`UPDATE card_strat SET strat_status = -1 WHERE strat_id='${strat_id}' AND strat_status <> -1;`);

    if (effected_rows === 0) {
      throw new Error("删除失败");
    }

    await this.execute(`
      INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
      VALUES ('${strat_id}', 'strategy', '', 'delete', '${username}', '${JSON.stringify({ strat_id })}', '${timekey}');
    `)

    return true;
  }

  async getStratOptions(id) {
    return await this.query(` SELECT strat_title label, strat_id value FROM card_strat WHERE strat_id LIKE '${id}%' AND strat_status = 1; `);
  };
}
