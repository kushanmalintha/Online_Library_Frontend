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

// Helper function to handle fetch responses and redirect on 401
function handleAuthFetch(fetchPromise) {
    return fetchPromise.then(res => {
        if (res.status === 401) {
            // Token is invalid or expired, redirect to login
            window.location.href = '../login_page/login_page.html';
            return Promise.reject('Unauthorized');
        }
        return res;
    });
}

function deleteUser() {
    const formData = new FormData(formDeleteUser);
    const userId = formData.get('userId');
    const token = getAccessToken();
    const performedBy = getUserId();
    console.log(token);

    handleAuthFetch(fetch(`http://localhost:2000/api/user/delete/${userId}?performedBy=${performedBy}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }))
    .then(res => res.json())
    .then(response => {
        alert('User deleted successfully');
        console.log(response);
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.error("Error:", error);
            alert('Failed to delete user: ' + error.message);
        }
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
    const performedBy = getUserId();
    data.performedBy = performedBy;

    handleAuthFetch(fetch(`http://localhost:2000/api/addbooknew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }))
    .then(res => res.json())
    .then(response => {
        alert('Book added successfully!');
        console.log(response);
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.error("Error:", error);
            alert('Failed to add book: ' + error.message);
        }
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
    const performedBy = getUserId();

    const payload = { count, performedBy };

    handleAuthFetch(fetch(`http://localhost:2000/api/addbookexist/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    }))
    .then(res => res.json())
    .then(response => {
        alert('Book added successfully!');
        console.log(response);
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.error("Error:", error);
            alert('Failed to add book: ' + error.message);
        }
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
    const performedBy = getUserId();

    const payload = { announcement, performedBy };

    handleAuthFetch(fetch(`http://localhost:2000/api/announcement/write`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    }))
    .then(res => res.json())
    .then(response => {
        alert('Announcement added successfully!');
        console.log(response);
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.error("Error:", error);
            alert('Failed to add book: ' + error.message);
        }
    });
}

// --- Make Admin ---
const formMakeAdmin = document.querySelector('.make-admin');
if (formMakeAdmin) {
    formMakeAdmin.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formMakeAdmin);
        const userId = formData.get('adminUserId');
        const token = getAccessToken();
        const performedBy = getUserId();
        handleAuthFetch(fetch(`http://localhost:2000/api/user/makeadmin/${userId}?performedBy=${performedBy}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }))
        .then(res => res.json())
        .then(response => {
            alert('User promoted to admin!');
            console.log(response);
        })
        .catch(error => {
            if (error !== 'Unauthorized') {
                alert('Failed to promote user: ' + error.message);
            }
        });
    });
}

// --- Reservation Lookup ---
const formReservationLookup = document.querySelector('.reservation-lookup');
const reservationDetailsDiv = document.querySelector('.reservation-details');
if (formReservationLookup) {
    formReservationLookup.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formReservationLookup);
        const reservationId = formData.get('reservationId');
        const token = getAccessToken();
        const performedBy = getUserId();
        handleAuthFetch(fetch(`http://localhost:2000/api/reservation/${reservationId}?performedBy=${performedBy}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }))
        .then(res => res.json())
        .then(data => {
            if (data && data.bookName && data.userId) {
                document.getElementById('reserved-book-name').textContent = data.bookName;
                document.getElementById('reserved-user-id').textContent = data.userId;
                reservationDetailsDiv.style.display = 'block';
            } else {
                reservationDetailsDiv.style.display = 'none';
                alert('Reservation not found');
            }
        })
        .catch(error => {
            if (error !== 'Unauthorized') {
                reservationDetailsDiv.style.display = 'none';
                alert('Error fetching reservation');
            }
        });
    });
}

// --- Book Return ---
const formReturnLookup = document.querySelector('.return-lookup');
const borrowedBooksListDiv = document.querySelector('.borrowed-books-list');
const borrowedBooksUl = document.getElementById('borrowed-books');
const fineInfoDiv = document.querySelector('.fine-info');
let currentReturnUserId = null;
let currentFineRate = 0;

if (formReturnLookup) {
    formReturnLookup.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formReturnLookup);
        const userId = formData.get('returnUserId');
        const token = getAccessToken();
        const performedBy = getUserId();
        handleAuthFetch(fetch(`http://localhost:2000/api/borrowedbooks/${userId}?performedBy=${performedBy}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }))
        .then(res => res.json())
        .then(data => {
            borrowedBooksUl.innerHTML = '';
            if (Array.isArray(data.books) && data.books.length > 0) {
                data.books.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = `Name: ${book.name} | Book ID: ${book.id}`;
                    borrowedBooksUl.appendChild(li);
                });
                borrowedBooksListDiv.style.display = 'block';
                fineInfoDiv.style.display = 'none';
                currentReturnUserId = userId;
            } else {
                borrowedBooksListDiv.style.display = 'none';
                alert('No borrowed books found for this user');
            }
        })
        .catch(error => {
            if (error !== 'Unauthorized') {
                borrowedBooksListDiv.style.display = 'none';
                alert('Error fetching borrowed books');
            }
        });
    });
}

const formReturnBook = document.querySelector('.return-book-form');
if (formReturnBook) {
    formReturnBook.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formReturnBook);
        const returnDate = formData.get('returnDate');
        const returnBookId = formData.get('returnBookId');
        const token = getAccessToken();
        const performedBy = getUserId();
        if (!currentReturnUserId) {
            alert('Please search for a user first.');
            return;
        }
        if (!returnBookId) {
            alert('Please enter the Book ID to return.');
            return;
        }
        handleAuthFetch(fetch(`http://localhost:2000/api/returnbook/${currentReturnUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ returnDate, bookId: returnBookId, performedBy })
        }))
        .then(res => res.json())
        .then(data => {
            if (data.fineDue !== undefined) {
                document.getElementById('fine-amount').textContent = data.fineDue;
                fineInfoDiv.style.display = 'block';
            } else {
                fineInfoDiv.style.display = 'none';
                alert('Book returned successfully!');
            }
        })
        .catch(error => {
            if (error !== 'Unauthorized') {
                fineInfoDiv.style.display = 'none';
                alert('Error processing return');
            }
        });
    });
}

// --- Fine Rate Update ---
const formFineRate = document.querySelector('.fine-rate-form');
const currentFineRateSpan = document.getElementById('current-fine-rate');

function fetchCurrentFineRate() {
    fetch('http://localhost:2000/api/finerate')
        .then(res => res.json())
        .then(data => {
            if (data.fineRate !== undefined) {
                currentFineRate = data.fineRate;
                currentFineRateSpan.textContent = data.fineRate;
            }
        });
}

if (formFineRate) {
    formFineRate.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(formFineRate);
        const fineRate = formData.get('fineRate');
        const token = getAccessToken();
        const performedBy = getUserId();
        fetch('http://localhost:2000/api/finerate', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fineRate, performedBy })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                currentFineRateSpan.textContent = fineRate;
                alert('Fine rate updated!');
            } else {
                alert('Failed to update fine rate');
            }
        })
        .catch(() => {
            alert('Error updating fine rate');
        });
    });
    fetchCurrentFineRate();
}
