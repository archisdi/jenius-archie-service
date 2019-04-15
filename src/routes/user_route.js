'use strict';

const router = require('express').Router();
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');
const Validator = require('../middlewares/request_validator');

/** Methods */
const {
    createUser, getUserList, getUserDetail, updateUser, deleteUser
} = require('../methods/users');

/** User Routes */
router.post('/', Validator('userCreate'), Logic(createUser));
router.get('/', Validator('userList'), Logic(getUserList));
router.get('/:id', Logic(getUserDetail));
router.put('/:id', Validator('userUpdate'), Logic(updateUser));
router.delete('/:id', Logic(deleteUser));

module.exports = router;
