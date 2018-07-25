const toggleOn = document.querySelector("#toggle-on");
if (toggleOn) {
  toggleOn.addEventListener("click", function(event) {
    var checkboxes = document.querySelectorAll('.js-sign-toggle');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = "checked";
    }
    event.preventDefault();
  }, false);
}

const toggleOff = document.querySelector("#toggle-off");
if (toggleOff) {
  toggleOff.addEventListener("click", function(event) {
    var checkboxes = document.querySelectorAll('.js-sign-toggle');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = null;
    }
    event.preventDefault();
  }, false);
}
