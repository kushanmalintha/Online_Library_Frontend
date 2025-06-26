let originalData = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
});

function fetchUserData() {
    const token = getAccessToken();
    const userId = getUserId();

    handleAuthFetch(fetch(`http://localhost:2000/api/users/getuser/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }))
    .then(res => res.json())
    .then(data => {
        originalData = data;
        populateFields(data);
    })
    .catch(err => {
        console.error(err);
        alert("Failed to fetch user data.");
    });
}

function populateFields(data) {
    document.getElementById('username').value = data.username;
    document.getElementById('email').value = data.email;
    document.getElementById('phone').value = data.phone_no;
    // Format membership date to YYYY-MM-DD
    let date = data.membership_date;
    if (date && date.length >= 10) {
        date = date.slice(0, 10);
    }
    document.getElementById('membership').value = date;
}

function enableEdit() {
    document.getElementById('username').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('phone').disabled = false;

    document.getElementById('save-btn').style.display = 'inline-block';
}

function saveChanges() {
    const token = getAccessToken();
    const userId = getUserId();

    const updatedData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone_no: document.getElementById('phone').value
    };

    handleAuthFetch(fetch(`http://localhost:2000/api/users/updateuser/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    }))
    .then(res => res.json())
    .then(data => {
        alert("Profile updated successfully!");
        originalData = data;
        populateFields(data);
        disableEdit();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to update profile.");
    });
}

function cancelChanges() {
    populateFields(originalData);
    disableEdit();
}

function disableEdit() {
    document.getElementById('username').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('phone').disabled = true;

    document.getElementById('save-btn').style.display = 'none';
}
