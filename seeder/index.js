require('dotenv').config({ path: './.env' });

const Promise = require('bluebird');
const { MongoContext } = require('node-common');

const { mongodb: MongoConfig } = require('../src/config/database');
const { MODELS_PATH } = require('../src/utils/constants');

const admins = [
    { name: 'admin', username: 'admin', password: 'admin' },
    { name: 'archie isdiningrat', username: 'archsidi', password: 'archsidi' }
];

const users = [
    {
        username: 'archisdi', email: 'archisdiningrat@gmail.com', account_number: 'JNS-0012324-DBA', identity_number: '166232991277289'
    }
];

function initMongo() {
    MongoContext.initialize({ path: MODELS_PATH.MONGO, config: MongoConfig });
}

async function seedAdminData() {
    const mongo = await MongoContext.getInstance();
    return Promise.map(admins, admin => mongo.Admin.findOne({ username: admin.username })
        .then(res => (!res ? mongo.Admin.create(admin) : null)), { concurrency: 5 });
}

async function seedUserData() {
    const mongo = await MongoContext.getInstance();
    return Promise.map(users, user => mongo.User.findOne({ identity_number: user.identity_number })
        .then(res => (!res ? mongo.User.create(user) : null)), { concurrency: 5 });
}

/** Main function */
(async () => {
    initMongo();
    await seedAdminData();
    await seedUserData();
    console.log('Seeding data completed'); // eslint-disable-line
    process.exit();
})();
