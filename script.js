document.getElementById('quote-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const status = document.getElementById('form-message');

  fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.style.display = 'block';
      status.innerHTML = "Teşekkürler! Form başarıyla gönderildi.";
      status.style.color = 'green';
      form.reset();
    } else {
      response.json().then(data => {
        status.style.display = 'block';
        status.innerHTML = "Bir hata oluştu. Lütfen tekrar deneyin.";
        status.style.color = 'red';
      });
    }
  }).catch(error => {
    status.style.display = 'block';
    status.innerHTML = "Bağlantı hatası. Lütfen daha sonra tekrar deneyin.";
    status.style.color = 'red';
  });
});
