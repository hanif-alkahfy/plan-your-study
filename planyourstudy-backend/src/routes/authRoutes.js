const express = require('express');
const { registerUser, loginUser, editUser } = require('../controllers/userController');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/edit/:id', editUser);

module.exports = router;
