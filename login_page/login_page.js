function goToPage(path) {
    window.location.href = path;
}

const formLogin = document.querySelector('.form');

formLogin.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(formLogin);
    const data = Object.fromEntries(formData.entries());

    fetch('http://localhost:2000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(responseData => {
        if (responseData.success) {
            sessionStorage.setItem('user_id', responseData.user_id);
            sessionStorage.setItem('accessToken', responseData.accessToken);
            sessionStorage.setItem('username', responseData.username);
            // Check for redirectAfterLogin and redirect if present
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPath;
            } else {
                goToPage('../home_page/home_page.html');
            }
        } else {
            alert(responseData.message);
        }
    })
    .catch(error => {
        console.log("Error:", error);
        alert(error.message);
    });
});
