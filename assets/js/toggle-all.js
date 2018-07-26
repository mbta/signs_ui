const toggleOn = document.querySelector('#toggle-on');
if (toggleOn) {
  toggleOn.addEventListener('click', (event) => {
    const checkboxes = document.querySelectorAll('.js-sign-toggle');
    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].checked = 'checked';
    }
    event.preventDefault();
  }, false);
}

const toggleOff = document.querySelector('#toggle-off');
if (toggleOff) {
  toggleOff.addEventListener('click', (event) => {
    const checkboxes = document.querySelectorAll('.js-sign-toggle');
    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].checked = null;
    }
    event.preventDefault();
  }, false);
}
