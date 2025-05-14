const express = require('express');

const router = express.Router();
const symptomControllers = require('../controllers/symptomControllers');
const checkAuthentication = require('../middleware/checkAuthentication');

router.post('/', checkAuthentication, symptomControllers.create);
router.get('/', checkAuthentication, symptomControllers.listForUser);
router.delete('/:id', checkAuthentication, symptomControllers.remove);

module.exports = router;
