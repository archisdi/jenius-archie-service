'use strict';

const router = require('express').Router();
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

/** Methods */
const {
    createUser, getUserList, getUserDetail, updateUser, deleteUser
} = require('../methods/users');

/** User Routes */
router.post('/', Logic(createUser));
router.get('/', Logic(getUserList));
router.get('/:id', Logic(getUserDetail));
router.put('/:id', Logic(updateUser));
router.delete('/:id', Logic(deleteUser));

module.exports = router;
