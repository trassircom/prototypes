'use strict';
const form = document.getElementById('registration-form');
const noManager = document.getElementById('no-manager');
const manager = document.getElementById('manager');
const statusBox = document.getElementById('form-status');
function setError(field, message) {
  const error = document.getElementById(field.id + '-error');
  if (error) { error.textContent = message; field.setAttribute('aria-describedby', error.id); }
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}
noManager.addEventListener('change', () => {
  manager.disabled = noManager.checked;
  manager.required = !noManager.checked;
  document.getElementById('manager-star').hidden = noManager.checked;
  setError(manager, '');
  statusBox.hidden = true;
});
const inn = document.getElementById('inn');
inn.addEventListener('input', () => { inn.value = inn.value.replace(/\D/g, '').slice(0, 12); });
const phone = document.getElementById('phone');
phone.addEventListener('input', () => {
  let digits = phone.value.replace(/\D/g, '');
  if (!digits) { phone.value = ''; return; }
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);
  let value = '+7';
  if (digits.length > 1) value += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) value += ')';
  if (digits.length > 4) value += ' ' + digits.slice(4, 7);
  if (digits.length > 7) value += '-' + digits.slice(7, 9);
  if (digits.length > 9) value += '-' + digits.slice(9, 11);
  phone.value = value;
});
form.addEventListener('input', (event) => {
  if (event.target.matches('input')) setError(event.target, '');
  statusBox.hidden = true;
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  let firstInvalid = null;
  for (const field of form.querySelectorAll('input')) {
    let error = '';
    if (field.disabled) continue;
    if (field.type === 'checkbox') {
      if (field.required && !field.checked) error = 'Подтвердите согласие на обработку персональных данных.';
    } else if (field.required && !field.value.trim()) error = 'Заполните это поле.';
    else if (field.type === 'email' && !field.validity.valid) error = 'Укажите корректный e-mail.';
    else if (field.id === 'inn' && !/^(\d{10}|\d{12})$/.test(field.value)) error = 'ИНН должен содержать 10 или 12 цифр.';
    else if (field.id === 'phone' && !/^7\d{10}$/.test(field.value.replace(/\D/g, ''))) error = 'Укажите номер в формате +7 (000) 000-00-00.';
    setError(field, error);
    if (error && !firstInvalid) firstInvalid = field;
  }
  statusBox.hidden = true;
  if (firstInvalid) { firstInvalid.focus(); return; }
  statusBox.hidden = false;
  statusBox.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest'});
});
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
  document.getElementById(button.dataset.dialog).showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
});

const quickForm = document.getElementById('quick-form');
const quickInn = document.getElementById('quick-inn');
quickInn.addEventListener('input', () => {
  quickInn.value = quickInn.value.replace(/\D/g, '').slice(0, 12);
  setError(quickInn, '');
});
quickForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!/^(\d{10}|\d{12})$/.test(quickInn.value)) {
    setError(quickInn, 'ИНН должен содержать 10 или 12 цифр.');
    quickInn.focus();
    return;
  }
  setError(quickInn, '');
  inn.value = quickInn.value;
  setError(inn, '');
  statusBox.hidden = true;
  document.getElementById('registration').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
  document.getElementById('first-name').focus({preventScroll:true});
});
