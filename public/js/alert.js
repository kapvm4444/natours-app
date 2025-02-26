export const showAlert = (type, message) => {
  hideAlert();
  const alertElement = `<div class='alert alert--${type}'>${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', alertElement);
  window.setTimeout(() => hideAlert(), 4000);
};

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
