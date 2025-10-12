const express = require("express");
const router = express.Router();
const generic = require("../controllers/generic.controller.js");

// Create entity
router.post("/create", generic.create);

// Unified get route — works for both findAll and findOne based on query params
router.get("/entity", generic.getEntities);

// Delete a single entity with id
router.delete("/delete", generic.delete);

// Update an entity with id
router.put("/update/:id", generic.update);

// Delete all entities
router.delete("/delete-all", generic.deleteAll);

module.exports = router;
