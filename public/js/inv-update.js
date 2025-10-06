const form = document.querySelector("#editForm")
    form.addEventListener("change", function () {
      const editBtn = document.querySelector("input[type='submit']")
      editBtn.removeAttribute("disabled")
    })