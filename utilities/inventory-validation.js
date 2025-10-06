const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
    validate.addClassificationRules = () => {
        return [
            // classification_name is required and must be string
            body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a valid classification name."), // on error this message is sent.
        ]
    }

    /* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name,
        })
        return
    }
    next()
}

/* ******************************
 * Add Inventory Data Validation Rules
 * ***************************** */
    validate.addInventoryRules = () => {
        return [
            // classification_id is required and must be string
            body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please select a classification."), // on error this message is sent.

            // inv_make is required and must be string
            body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a valid make."), // on error this message is sent.

            // inv_model is required and must be string
            body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a valid model."), // on error this message is sent.

            // inv_year is required and must be a number
            body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1886, max: 2024 })
            .withMessage("Please provide a valid year."), // on error this message is sent.

            // inv_description is required and must be string
            body("inv_description")
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a valid description."), // on error this message is sent.

            // inv_image is required and must be string
            body("inv_image")
            .trim()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a valid image URL."), // on error this message is sent.

            // inv_thumbnail is required and must be string
            body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a valid thumbnail URL."), // on error this message is sent.

            // inv_price is required and must be a number
            body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."), // on error this message is sent.

            // inv_miles is required and must be a number
            body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a valid mileage."), // on error this message is sent.

            // inv_color is required and must be string
            body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid color."), // on error this message is sent.
        ]
    }

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors,
            classList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

/* ******************************
* Edit Inventory Data Validation Rules
* ***************************** */
validate.editInventoryRules = () => {
    return [
        // classification_id is required and must be string
        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please select a classification."), // on error this message is sent.

        // inv_make is required and must be string
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a valid make."), // on error this message is sent.

        // inv_model is required and must be string
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a valid model."), // on error this message is sent.

        // inv_year is required and must be a number
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min: 1886, max: 2024 })
        .withMessage("Please provide a valid year."), // on error this message is sent.

        // inv_description is required and must be string
        body("inv_description")
        .escape()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide a valid description."), // on error this message is sent.

        // inv_image is required and must be string
        body("inv_image")
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide a valid image URL."), // on error this message is sent.

        // inv_thumbnail is required and must be string
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide a valid thumbnail URL."), // on error this message is sent.

        // inv_price is required and must be a number
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."), // on error this message is sent.

        // inv_miles is required and must be a number
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Please provide a valid mileage."), // on error this message is sent.

        // inv_color is required and must be string
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid color."), // on error this message is sent.

        // inv_id is required
        body("inv_id")
        .trim()
        .escape()
        .notEmpty()
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkEditInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            title: "Edit Inventory",
            nav,
            errors,
            classList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate