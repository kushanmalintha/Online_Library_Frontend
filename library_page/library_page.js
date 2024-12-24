function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.classList.add("open-popup");
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.classList.remove("open-popup");
}

function clearInputs() {
    // Find the active form-group based on the clicked button
    const activeFormGroup = document.activeElement.closest('.form-group');

    // Clear all input fields within the active form group
    const inputs = activeFormGroup.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.value = '';
    });

    // Additionally, clear all textareas within the active form group
    const textareas = activeFormGroup.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
    });
}


const formDeleteUser = document.querySelector('.delete-user');

formDeleteUser.addEventListener('submit', function(event) {
    event.preventDefault();
    deleteUser();
});

function deleteUser() {
    const formData = new FormData(formDeleteUser);
    const userId = formData.get('userId');
    const token = getAccessToken();
    console.log(token);

    fetch(`http://localhost:2000/api/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(res => res.json())
    .then(response => {
        alert('User deleted successfully');
        console.log(response);
    })
    .catch(error => {
        console.error("Error:", error);
        alert('Failed to delete user: ' + error.message);
    });

    closePopup('delete-popup');
}


const formAddBook1 = document.querySelector('.add-book1');

formAddBook1.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook1();
});

function addBook1() {
    const formData = new FormData(formAddBook1);
    const data = Object.fromEntries(formData.entries());
    const token = getAccessToken();

    fetch(`http://localhost:2000/api/addbooknew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        alert('Book added successfully!');
        console.log(response);
    })
    .catch(error => {
        console.error("Error:", error);
        alert('Failed to add book: ' + error.message);
    });
}


const formAddBook2 = document.querySelector('.add-book2');

formAddBook2.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook2();
});

function addBook2() {
    const formData = new FormData(formAddBook2);
    const bookId = formData.get('bookId');
    const count = formData.get('count');
    const token = getAccessToken();

    const payload = { count };

    fetch(`http://localhost:2000/api/addbookexist/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(response => {
        alert('Book added successfully!');
        console.log(response);
    })
    .catch(error => {
        console.error("Error:", error);
        alert('Failed to add book: ' + error.message);
    });
}


const formAddAnnouncement = document.querySelector('.add-announcement');

formAddAnnouncement.addEventListener('submit', function(event) {
    event.preventDefault();
    addAnnouncement();
});

function addAnnouncement() {
    const formData = new FormData(formAddAnnouncement);
    const announcement = formData.get('announcement');
    const token = getAccessToken();

    const payload = { announcement };

    fetch(`http://localhost:2000/api/announcement/write`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(response => {
        alert('Announcement added successfully!');
        console.log(response);
    })
    .catch(error => {
        console.error("Error:", error);
        alert('Failed to add book: ' + error.message);
    });
}
