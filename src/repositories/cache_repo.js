const BaseRepository = require('./base_repository');

class CacheRepo extends BaseRepository {
    async get(key) {
        const redis = await this.getRedisInstance();
        return redis.get(key);
    }

    async set(key, data) {
        const redis = await this.getRedisInstance();
        return redis.set(key, data);
    }
}

module.exports = CacheRepo;
