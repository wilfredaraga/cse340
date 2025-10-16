const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Check for existing email for editing account
* ***************************** */
async function checkExistingEmailEdit(account_email, account_id){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2"
    const email = await pool.query(sql, [account_email, account_id])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No account found")
  }
}

/* *****************************
* Edit account data
* ***************************** */
async function editAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Edit password
* ***************************** */
async function editPassword(account_password, account_id){
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return comments by account_id
* ***************************** */
async function getCommentsByAccountId (account_id) {
  try {
    const result = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.comment_date, i.inv_make, i.inv_model, i.inv_year
       FROM comments c
       JOIN inventory i ON c.inv_id = i.inv_id
        WHERE c.account_id = $1
        ORDER BY c.comment_date DESC`,
      [account_id])
    return result.rows
  } catch (error) {
    return new Error("No comments found")
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, editAccount, editPassword, checkExistingEmailEdit, getCommentsByAccountId }