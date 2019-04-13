const BaseRepository = require('./base_repository');

class CacheRepo extends BaseRepository {
    async create(key) {
        const redis = await this.getRedisInstance();
        return redis.get(key);
    }
}

module.exports = CacheRepo;
