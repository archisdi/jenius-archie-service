const BaseRepository = require('./base_repository');

class UserRepo extends BaseRepository {
    async create(data) {
        const mongo = await this.getMongoInstance();
        return mongo.User.create(data);
    }

    async findAll(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.User.find(conditions);
    }

    async findOne(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.User.findOne(conditions);
    }
}

module.exports = UserRepo;
