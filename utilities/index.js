const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='navigation'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(data){
  let detail
  if(data.length > 0){

    detail = '<div id="vehicleDetail">'
    detail += '<img src="' + data[0].inv_image + '" alt="Image of ' + data[0].inv_make + ' ' + data[0].inv_model + ' on CSE Motors">'
    detail += '<section class="vehicleInfo">'
    detail += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + ' Details </h2>' 
    detail += '<table><tr><td><strong>Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</strong></td></tr>'
    detail += '<tr><td><strong>Description: </strong>' + data[0].inv_description + '</td></tr>'
    detail += '<tr><td><strong>Color: </strong>' + data[0].inv_color + '</td></tr>' 
    detail += '<tr><td><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</td></tr>'
    detail += '<tr><td><strong>Year: </strong>' + data[0].inv_year + '</td></tr></table>'
    detail += '</section>'
    detail += '</div>'
  } else {
    detail += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util