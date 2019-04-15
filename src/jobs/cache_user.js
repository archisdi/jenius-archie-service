'use strict';

const CacheRepository = require('../repositories/cache_repo');

module.exports = async (user) => {
    try {
        const CacheRepo = new CacheRepository();
        await CacheRepo.set(`user::${user.id}`, JSON.stringify(user));
    } catch (err) {
        console.error(`an error occured while sync user cache, ${err.message}`); // eslint-disable-line
    }
};
