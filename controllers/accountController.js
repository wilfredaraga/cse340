const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_type, account_id } = res.locals.accountData
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    account_firstname,
    account_type,
    account_id,
    errors: null,
  })
}

async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  if (res.locals.accountData.account_id !== account_id) {
    req.flash("notice", "You can only edit your own account.")
    return res.redirect("/account/")
  }
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
    errors: null,
  })
}

/* ****************************************
 *  Process Edit Account
 * ************************************ */
async function editAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  const editResult = await accountModel.editAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  if (editResult) {
    req.flash("notice", `Congratulations, you\'ve successfully updated your account ${account_firstname}.`)
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      account_firstname,
      account_type: res.locals.accountData.account_type,
      account_id,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      errors: null,
    })
  }
}

/* ****************************************
 *  Edit Password
 * ************************************ */
async function editPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/edit-account", {
      title: "Edit Account",
      nav,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      errors: null,
      account_id,
    })
  }
  const editResult = await accountModel.editPassword(
    hashedPassword,
    account_id
  )
  if (editResult) {
    req.flash("notice", `Congratulations, you\'ve successfully updated your password.`)
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      account_firstname: res.locals.accountData.account_firstname,
      account_type: res.locals.accountData.account_type,
      account_id,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      errors: null,
      account_id,
    })
  }
}

/* ****************************************
 *  Process Logout
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildEditAccount, editAccount, editPassword, accountLogout }