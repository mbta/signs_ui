document.querySelectorAll<HTMLElement>('[data-scu-form]').forEach((el) => {
  el.addEventListener('submit', (ev) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(el.dataset.prompt)) {
      ev.preventDefault();
    }
  });
});
