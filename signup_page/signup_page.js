function goToPage(path) {
    window.location.href = path;
}

const formSignup = document.querySelector('.form');

formSignup.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(formSignup);
    const data = Object.fromEntries(formData.entries());

    fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(responseData => {
        if (responseData.success) {
            goToPage('../login_page/login_page.html');
        } else {
            alert(responseData.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
        alert(error.message);
    });
});
