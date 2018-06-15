document.querySelector("#toggle-on").addEventListener("click", function(event) {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = "checked";
  }
  event.preventDefault();
}, false);

document.querySelector("#toggle-off").addEventListener("click", function(event) {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = null;
  }
  event.preventDefault();
}, false);
