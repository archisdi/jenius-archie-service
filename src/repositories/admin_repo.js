const BaseRepository = require('./base_repository');

class AdminRepo extends BaseRepository {
    async create(data) {
        const mongo = await this.getMongoInstance();
        return mongo.Admin.create(data);
    }

    async find(id) {
        const mongo = await this.getMongoInstance();
        return mongo.Admin.findOne({ id });
    }

    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.Admin.findOne(conditions);
    }
}

module.exports = AdminRepo;
