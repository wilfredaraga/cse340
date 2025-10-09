// Enable the edit button when a change is made to the form
const editForm = document.getElementById("account-edit-form");
editForm.addEventListener("change", function () {
  const editBtn = document.getElementById("editAccBtn");
  editBtn.removeAttribute("disabled");
});
