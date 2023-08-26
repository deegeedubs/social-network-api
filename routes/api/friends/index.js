const router = require('express').Router();
const friendRoutes = require('./friendRoutes');

router.use('/:userId/friends', friendRoutes);

module.exports = router;