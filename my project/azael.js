const quoteForm = document.getElementById('quoteForm');
const formMessage = document.getElementById('formMessage');

quoteForm.addEventListener('submit', event => {
  event.preventDefault();

  const company = document.getElementById('company').value.trim();
  const email = document.getElementById('email').value.trim();
  const details = document.getElementById('details').value.trim();

  if (!company || !email || !details) {
    formMessage.textContent = 'Please fill in all fields to receive a quote.';
    return;
  }

  formMessage.textContent = 'Thank you! Your inquiry has been recorded. We will contact you shortly.';
  quoteForm.reset();
});