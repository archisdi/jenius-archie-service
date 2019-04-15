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

    async count(conditions) {
        const mongo = await this.getMongoInstance();
        return mongo.User.count(conditions);
    }

    async paginate(conditions, page = 1, limit = 5) {
        const mongo = await this.getMongoInstance();
        return mongo.User
            .find(conditions)
            .skip((limit * page) - limit)
            .limit(limit)
            .sort({ occurs_at: -1 });
    }
}

module.exports = UserRepo;
