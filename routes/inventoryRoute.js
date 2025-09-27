// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to process the add classification form
router.post("/addClass", validate.addClassificationRules(), validate.checkAddClassificationData, utilities.handleErrors(invController.addClassification));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to error page
router.get("/error", utilities.handleErrors(invController.buildByInvIdError));

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to add classification view
router.get("/addClass", utilities.handleErrors(invController.buildAddClassification));
// Rpute to process add classification view
router.post("/addClass", validate.addClassificationRules(), validate.checkAddClassificationData, utilities.handleErrors(invController.addClassification));

// Route to add inventory view
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory));
// Route to process add inventory view
router.post("/addInventory", validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.addInventory));


module.exports = router;