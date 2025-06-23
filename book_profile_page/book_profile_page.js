function goToPage(path) {
    window.location.href = path;
}


// Popup elements
let popupAvailable = document.getElementById("popup-available");
let popupNotAvailable = document.getElementById("popup-not-available");

// Functions to open and close availability popups
function openPopupAvailable() {
    popupAvailable.classList.add("open-popup");

    // Attach event listener to reserve button when the popup opens
    attachReserveListener();
}

function closePopupAvailable() {
    popupAvailable.classList.remove("open-popup");
}

function openPopupNotAvailable() {
    popupNotAvailable.classList.add("open-popup");
}

function closePopupNotAvailable() {
    popupNotAvailable.classList.remove("open-popup");
}


// Function to check availability
const formCheckAvailability = document.querySelector('.form');
formCheckAvailability.addEventListener('submit', event => {
    event.preventDefault();

    const token = getAccessToken();
    const book = JSON.parse(sessionStorage.getItem('selectedBook'));
    const bookId = book.book_id;

    handleAuthFetch(fetch(`http://localhost:2000/api/availability/${bookId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }))
    .then(res => res.json())
    .then(responseData => {
        if (responseData.message === 'available') {
            openPopupAvailable();
        } else {
            openPopupNotAvailable();
        }
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.log("Error:", error);
            alert(error.message);
        }
    });
});


// Function to attach the reserve event listener when the popup opens
function attachReserveListener() {
    const formReserve = document.querySelector('.form-reserve');

    if (formReserve) {
        formReserve.addEventListener('submit', event => {
            event.preventDefault();

            const token = getAccessToken();
            const userId = getUserId();
            const book = JSON.parse(sessionStorage.getItem('selectedBook'));
            const bookId = book.book_id;

            // Disable the button to prevent multiple submissions
            const reserveButton = document.querySelector('.reserve');
            reserveButton.disabled = true;

            handleAuthFetch(fetch(`http://localhost:2000/api/reserve/${userId}/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }))
            .then(res => res.json())
            .then(responseData => {
                console.log(responseData);
                if (responseData.success) {
                    sessionStorage.setItem('reservationId', responseData.reservationId);
                    goToPage('../book_reserve_page/book_reserve_page.html');
                } else {
                    alert(responseData.message);
                    reserveButton.disabled = false;
                }
            })
            .catch(error => {
                if (error !== 'Unauthorized') {
                    console.log("Error:", error);
                    alert(error.message);
                }
                reserveButton.disabled = false;
            });
        });
    }
}

function bookDetails() {
    const book = JSON.parse(sessionStorage.getItem('selectedBook'));
    
    if (!book) {
        alert('No book details found.');
        window.location.href = '../book_page/book_page.html';
        return;
    }

    // Populate the book profile page with book details
    document.getElementById('Title').textContent = book.title || 'N/A';
    document.getElementById('Author').textContent = book.author || 'N/A';
    document.getElementById('Genre').textContent = book.genre || 'N/A';
    document.getElementById('ISBN10').textContent = book.isbn_10 || 'N/A';
    document.getElementById('ISBN13').textContent = book.isbn_13 || 'N/A';
    document.getElementById('Summary').textContent = book.summary || 'No summary available';

    // Update book image
    const bookImageDiv = document.querySelector('.book_image');
    bookImageDiv.style.backgroundImage = `url(${book.cover_image})`;
    bookImageDiv.style.backgroundSize = 'cover';
    bookImageDiv.style.backgroundPosition = 'center';
}

// Call the function when the page loads
window.onload = bookDetails;
