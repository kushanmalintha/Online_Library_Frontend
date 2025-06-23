// Function to get user ID from sessionStorage
function getUserId() {
    return sessionStorage.getItem('user_id');
}

// Function to get accessToken from sessionStorage
function getAccessToken() {
    return sessionStorage.getItem('accessToken');
}

function getUsername() {
    return sessionStorage.getItem('username');
}

function getReservationId() {
    return sessionStorage.getItem('reservationId');
}

// Helper function to handle fetch responses and redirect on 401
function handleAuthFetch(fetchPromise) {
    return fetchPromise.then(res => {
        if (res.status === 401) {
            alert('Your session has expired or is invalid. Please login again.');
            // Save the current page path for redirect after login
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            window.location.href = '../login_page/login_page.html';
            return Promise.reject('Unauthorized');
        }
        return res;
    });
}
