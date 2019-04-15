'use strict';

/** Routes */
const AuthRoutes = require('../routes/auth_route');
const UserRoutes = require('../routes/user_route');

/** Middlewares */
const AuthGuard = require('../middlewares/auth_guard');

module.exports = (app) => {
    app.use('/auth', AuthRoutes);
    app.use('/users', AuthGuard, UserRoutes);
};
