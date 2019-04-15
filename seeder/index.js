require('dotenv').config({ path: './.env' });

const Promise = require('bluebird');
const { MongoContext } = require('node-common');

const { mongodb: MongoConfig } = require('../src/config/database');
const { MODELS_PATH } = require('../src/utils/constants');

const admins = [
    { name: 'admin', username: 'admin', password: 'admin' },
    { name: 'archie isdiningrat', username: 'archsidi', password: 'archsidi' }
];

function initMongo() {
    MongoContext.initialize({ path: MODELS_PATH.MONGO, config: MongoConfig });
}

async function seedAdminData() {
    const mongo = await MongoContext.getInstance();
    return Promise.map(admins, admin => mongo.Admin.findOne({ username: admin.username })
        .then(res => (!res ? mongo.Admin.create(admin) : null)), { concurrency: 5 });
}

/** Main function */
(async () => {
    initMongo();
    await seedAdminData();
    console.log('Seeding data completed'); // eslint-disable-line
    process.exit();
})();
