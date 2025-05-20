const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');

// Route to add a medication
router.post('/', medicationController.addMedication);

// Route to get all medications
router.get('/', medicationController.getMedications);

// Route to delete a medication
router.delete('/:id', medicationController.deleteMedication);

module.exports = router;
