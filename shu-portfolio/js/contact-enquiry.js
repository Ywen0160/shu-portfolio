(() => {
  const options = [...document.querySelectorAll('[data-enquiry]')];
  const form = document.querySelector('[data-enquiry-form]');
  const formType = document.querySelector('[data-form-type]');
  const message = form?.elements.message;

  if (!form || !message) return;

  let enquiryType = '';

  options.forEach((option) => {
    option.addEventListener('click', () => {
      enquiryType = option.dataset.enquiry || 'Enquiry';
      options.forEach((button) => button.classList.toggle('is-selected', button === option));
      form.hidden = false;
      formType.textContent = enquiryType;
      message.value = option.dataset.message || '';
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      form.elements.name.focus({ preventScroll: true });
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `${enquiryType || 'Website'} enquiry from ${data.get('name')}`;
    const body = [
      `Enquiry type: ${enquiryType || 'Website enquiry'}`,
      '',
      `Name: ${data.get('name')}`,
      `Company: ${data.get('company') || 'Not provided'}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone')}`,
      '',
      data.get('message')
    ].join('\n');

    window.location.href = `mailto:shuyi0084@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
