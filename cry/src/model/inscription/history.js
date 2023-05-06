module.exports = class extends think.Model {
  get tableName() {
    return 'history_log';
  }

  async getHistoryList(query) {
    const { target_type, operation_type, operation_creator, create_start, create_end, page, pageCount } = query;

    let query_where = '1=1 ';

    if (target_type) {
      query_where += `AND target_type='${target_type}' `;
    }

    if (operation_type) {
      query_where += `AND operation_type='${operation_type}' `;
    }

    if (operation_creator) {
      query_where += `AND operation_creator LIKE '${operation_creator}%' `;
    }

    if (create_start && create_end) {
      query_where += `AND create_timekey BETWEEN '${create_start}' AND '${create_end}' `;
    }

    const list_res = await this.query(`
      SELECT id, operation_type, target_type, target_title, target_id,  operation_creator, create_timekey
      FROM history_log
      WHERE ${query_where}
      ORDER BY create_timekey DESC
      LIMIT ${pageCount} OFFSET ${pageCount * (page - 1)};
    `);
    const total_res = await this.query(`
      SELECT COUNT(*) total
      FROM history_log
      WHERE ${query_where};
    `);

    return { list: list_res, total: total_res[0].total }
  }
}
