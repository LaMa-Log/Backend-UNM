// routes/typeProduitRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');
const typeProduitController = require('../Controllers/typesProduit');

// CRUD avec upload
router.post('/', upload.single('photoProduit'), typeProduitController.createTypeProduit);
router.get('/', typeProduitController.getAllTypeProduits);
router.get('/:id', typeProduitController.getTypeProduitById);
router.put('/:id', upload.single('photoProduit'), typeProduitController.updateTypeProduit);
router.delete('/:id', typeProduitController.deleteTypeProduit);

module.exports = router;
