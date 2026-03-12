function buildInput(labelText, id, type = 'text', required = false) {
  const field = document.createElement('div');
  field.className = 'contact-form-field';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.id = id;
  input.name = id;
  input.type = type;
  if (required) input.required = true;

  const error = document.createElement('div');
  error.className = 'contact-form-error';
  error.setAttribute('aria-live', 'polite');

  field.append(label, input, error);
  return { field, input, error };
}

function buildTextArea(labelText, id, required = false) {
  const field = document.createElement('div');
  field.className = 'contact-form-field';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.name = id;
  textarea.rows = 4;
  if (required) textarea.required = true;

  const error = document.createElement('div');
  error.className = 'contact-form-error';
  error.setAttribute('aria-live', 'polite');

  field.append(label, textarea, error);
  return { field, textarea, error };
}

function buildTermsField() {
  const wrapper = document.createElement('div');
  wrapper.className = 'contact-form-field contact-form-terms';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'cf-terms';
  checkbox.name = 'cf-terms';
  checkbox.required = true;

  const label = document.createElement('label');
  label.setAttribute('for', 'cf-terms');
  label.innerHTML = 'I have read and agree to the <button type="button" class="contact-form-terms-link">terms and conditions</button>.';

  const error = document.createElement('div');
  error.className = 'contact-form-error';
  error.setAttribute('aria-live', 'polite');

  wrapper.append(checkbox, label, error);
  return { wrapper, checkbox, error };
}

function buildModal() {
  const overlay = document.createElement('div');
  overlay.className = 'contact-form-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'cf-terms-title');

  const dialog = document.createElement('div');
  dialog.className = 'contact-form-modal';

  const title = document.createElement('h3');
  title.id = 'cf-terms-title';
  title.textContent = 'Terms and Conditions';

  const body = document.createElement('div');
  body.className = 'contact-form-modal-body';
  body.innerHTML = `
    <p>Please review the trek terms and conditions before submitting the form.</p>
    <ul>
      <li>Ensure you are medically fit for the selected trek.</li>
      <li>All bookings are subject to confirmation and availability.</li>
      <li>Cancellation and refund policies apply as per company guidelines.</li>
    </ul>
  `;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'contact-form-modal-close';
  close.textContent = 'Close';

  dialog.append(title, body, close);
  overlay.append(dialog);

  close.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  return overlay;
}

function getConfig(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const firstRowCell = rows[0]?.querySelector(':scope > div');
  const secondRowCell = rows[1]?.querySelector(':scope > div');

  const endpoint = firstRowCell ? firstRowCell.textContent.trim() : '';
  const successMessage = secondRowCell ? secondRowCell.textContent.trim() : '';

  return {
    endpoint,
    successMessage: successMessage || 'Thank you. Your request has been submitted.',
  };
}

export default function decorate(block) {
  const { endpoint, successMessage } = getConfig(block);

  block.innerHTML = '';

  const formWrapper = document.createElement('div');
  formWrapper.className = 'contact-form-wrapper';

  const form = document.createElement('form');
  form.className = 'contact-form';
  form.noValidate = true;

  const heading = document.createElement('h2');
  heading.className = 'contact-form-title';
  heading.textContent = 'Contact for Trek Enquiry';

  const description = document.createElement('p');
  description.className = 'contact-form-description';
  description.textContent = 'Share your details and we will get back to you with trek information and availability.';

  const nameField = buildInput('Name', 'cf-name', 'text', true);
  const emailField = buildInput('Email', 'cf-email', 'email', true);
  const phoneField = buildInput('Contact Number', 'cf-phone', 'tel', true);
  const trekField = buildInput('Trek Name', 'cf-trek', 'text', true);
  const commentsField = buildTextArea('Queries / Comments', 'cf-comments', true);
  const termsField = buildTermsField();

  const status = document.createElement('div');
  status.className = 'contact-form-status';
  status.setAttribute('aria-live', 'polite');

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'contact-form-submit button';
  submit.textContent = 'Submit';

  form.append(
    heading,
    description,
    nameField.field,
    emailField.field,
    phoneField.field,
    trekField.field,
    commentsField.field,
    termsField.wrapper,
    submit,
    status,
  );

  formWrapper.append(form);
  block.append(formWrapper);

  // terms modal
  const termsButton = termsField.wrapper.querySelector('.contact-form-terms-link');
  termsButton.addEventListener('click', () => {
    const modal = buildModal();
    document.body.append(modal);
  });

  function clearErrors() {
    [nameField, emailField, phoneField, trekField, commentsField, { error: termsField.error }].forEach((f) => {
      if (f.error) f.error.textContent = '';
    });
    status.textContent = '';
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!nameField.input.value.trim()) {
      nameField.error.textContent = 'Please enter your name.';
      valid = false;
    }

    const email = emailField.input.value.trim();
    if (!email) {
      emailField.error.textContent = 'Please enter your email.';
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      emailField.error.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    const phone = phoneField.input.value.trim();
    if (!phone) {
      phoneField.error.textContent = 'Please enter your contact number.';
      valid = false;
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      phoneField.error.textContent = 'Please enter a valid contact number.';
      valid = false;
    }

    if (!trekField.input.value.trim()) {
      trekField.error.textContent = 'Please enter the trek name.';
      valid = false;
    }

    if (!commentsField.textarea.value.trim()) {
      commentsField.error.textContent = 'Please add your queries or comments.';
      valid = false;
    }

    if (!termsField.checkbox.checked) {
      termsField.error.textContent = 'You must agree to the terms and conditions.';
      valid = false;
    }

    return valid;
  }

  async function submitForm(event) {
    event.preventDefault();
    if (!validate()) return;

    if (!endpoint) {
      status.textContent = 'Form endpoint is not configured.';
      status.classList.remove('success');
      status.classList.add('error');
      return;
    }

    submit.disabled = true;
    status.textContent = 'Submitting...';
    status.classList.remove('success', 'error');

    const payload = {
      name: nameField.input.value.trim(),
      email: emailField.input.value.trim(),
      phone: phoneField.input.value.trim(),
      trekName: trekField.input.value.trim(),
      comments: commentsField.textarea.value.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      // With no-cors the response is opaque; assume success if the
      // network request did not fail at the browser level.
      status.textContent = successMessage;
      status.classList.remove('error');
      status.classList.add('success');
      form.reset();
    } catch (e) {
      status.textContent = 'Something went wrong while submitting the form. Please try again.';
      status.classList.remove('success');
      status.classList.add('error');
    } finally {
      submit.disabled = false;
    }
  }

  form.addEventListener('submit', submitForm);
}

