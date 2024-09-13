const form = document.getElementById('uploadForm');
const statusDiv = document.getElementById('status');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            statusDiv.innerHTML = `<a href="${data.downloadUrl}">تنزيل التطبيق الموقع</a>`;
        } else {
            statusDiv.textContent = 'فشل التوقيع. يرجى المحاولة مرة أخرى.';
        }
    })
    .catch(err => {
        console.error(err);
        statusDiv.textContent = 'حدث خطأ أثناء التوقيع.';
    });
});