document.querySelectorAll<HTMLElement>('[data-scu-form]').forEach((el) => {
  el.addEventListener('submit', (ev) => {
    if (!window.confirm(el.dataset.prompt)) {
      ev.preventDefault();
    }
  });
});
