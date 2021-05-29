const auth = require('../middleware/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    // const user = await (req.user._id);
    res.send(req.user);
});

module.exports = router;