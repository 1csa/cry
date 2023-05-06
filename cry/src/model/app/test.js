module.exports = class extends think.Mongo {
    constructor(...args) {
        super(...args);
        // set database name
        this.config.database = 'tools';
    }
    async getTopics () {
        const data = await this.table('topic').limit(3).select();
        return data;
    }
};
