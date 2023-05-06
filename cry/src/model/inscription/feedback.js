module.exports = class extends think.Model {
  get tableName() {
    return 'feedback_card';
  }

  async getFeedback(feedback_id) {
    const get_res = await this.query(`
      SELECT feedback_id, feedback_name, feedback_forbidden_days, feedback_downright, feedback_downright_count, feedback_downright_days
      FROM feedback_card
      WHERE feedback_id='${feedback_id}' AND feedback_status <> -1;
    `);

    if (!get_res[0]) {
      throw new Error(think.config('errors').empty_record);
    }

    return get_res[0];
  }

  async postFeedback(feedback, username, timekey, isnew) {
    const feedback_id = feedback.feedback_id ? feedback.feedback_id : timekey;

    if (isnew) {
      await this.add({ ...feedback, feedback_id, feedback_creator: username, create_timekey: timekey });
    } else {
      await this.where(`feedback_id=${feedback_id}`).update({ ...feedback });
    }
    await this.execute(`
      INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
      VALUES ('${feedback_id}', 'feedback', '${feedback.feedback_name}', '${isnew ? 'add' : 'update'}', '${username}', '${JSON.stringify(feedback)}', '${timekey}');
    `);

    return feedback_id;
  }

  // feedback列表不提供分页
  async listFeedback(query) {
    const { feedback_name, page, pageCount } = query;

    let list_query = 'feedback_status <> -1';

    if (feedback_name) {
      list_query += `AND feedback_name LIKE ${feedback_name}% `;
    }

    const list_res = await this.query(`
      SELECT feedback_id, feedback_name, feedback_creator, create_timekey, feedback_forbidden_days, feedback_downright, feedback_downright_count, feedback_downright_days
      FROM feedback_card
      WHERE ${list_query}
      ORDER BY create_timekey DESC
      LIMIT ${pageCount} OFFSET ${pageCount * (page - 1)};
    `);

    const total_res = await this.query(`
      SELECT count(*) total
      FROM feedback_card
      WHERE '${list_query}';
    `);

    return { list: list_res, total: total_res[0] };
  }

  async deleteFeedback(feedback_id, username, timekey) {
    const del_res = await this.where(`feedback_id = '${feedback_id}' AND feedback_status <> -1`).update({ feedback_status: -1 });

    if (!del_res) {
      throw new Error("删除失败");
    }

    await this.execute(`
    INSERT INTO history_log (target_id, target_type, target_title, operation_type, operation_creator, operation_detail, create_timekey)
    VALUES ('${feedback_id}', 'feedback', '', 'delete', '${username}', '${JSON.stringify({ feedback_id })}', '${timekey}');
  `);
    return true;
  }

  async getFbOptions (name) {
    return await this.query(` SELECT feedback_name label, feedback_id value FROM feedback_card WHERE feedback_name LIKE '${name}%' AND feedback_status <> -1; `);
  };
}
