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
router.get("/", utilities.checkAdmin, utilities.handleErrors(invController.buildManagement));

// Route to add classification view
router.get("/addClass", utilities.checkAdmin , utilities.handleErrors(invController.buildAddClassification));
// Rpute to process add classification view
router.post("/addClass", validate.addClassificationRules(), validate.checkAddClassificationData, utilities.handleErrors(invController.addClassification));

// Route to add inventory view
router.get("/addInventory", utilities.checkAdmin , utilities.handleErrors(invController.buildAddInventory));
// Route to process add inventory view
router.post("/addInventory", validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.addInventory));

// Route to get inventory by classification_id and return it as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit inventory view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAdmin , utilities.handleErrors(invController.buildEditInventory));
// Route to process edit inventory view
router.post("/edit/", validate.editInventoryRules(), validate.checkEditInventoryData, utilities.handleErrors(invController.editInventory))

// Route to delete confirmation view
router.get("/delete/:inv_id", utilities.checkAdmin , utilities.handleErrors(invController.buildDeleteInventory));
// Route to delete the vehicle
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

// Route to add comment view
router.get("/addComment/:inv_id", utilities.checkLogin, utilities.handleErrors(invController.buildAddComment));
// Route to add a comment
router.post("/addComment", validate.addCommentRules(), validate.checkAddCommentData, utilities.handleErrors(invController.addComment));

module.exports = router;