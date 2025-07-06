function goToPage(path) {
    window.location.href = path;
}

let popup = document.getElementById("popup");

function openPopup() {
    popup.classList.add("open-popup");
}

function closePopup() {
    popup.classList.remove("open-popup");
}

// Set member name and ID properly
document.getElementById("member_name").innerText = getUsername();
document.getElementById("member_id").innerText = getUserId();
document.getElementById("reservationId").innerHTML = getReservationId();

const formTransaction = document.querySelector('.form');

formTransaction.addEventListener('submit', function(event) {
    event.preventDefault();
    submitTransaction();
});

function submitTransaction() {
    const formData = new FormData(formTransaction);
    const data = Object.fromEntries(formData.entries());
    data.loan_days = Number(data.loan_days);
    data.status = "borrowed";

    const userId = getUserId();
    const book = JSON.parse(sessionStorage.getItem('selectedBook'));
    const bookId = book.book_id;
    const token = getAccessToken();

    handleAuthFetch(fetch(`${API_BASE_URL}/api/transaction/${userId}/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }))
    .then(res => res.json())
    .then(responseData => {
        if (responseData.success) {
            goToPage('../home_page/home_page.html');
        } else {
            alert(responseData.message);
        }
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.log("Error:", error);
            alert(error.message);
        }
    });

    closePopup();
}

function cancelReservation() {
    const reservationId = getReservationId();
    const token = getAccessToken();
    const book = JSON.parse(sessionStorage.getItem('selectedBook'));
    const bookId = book.book_id;

    handleAuthFetch(fetch(`${API_BASE_URL}/api/reservation/delete/${reservationId}/${bookId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }))
    .then(res => res.json())
    .then(responseData => {
        if (responseData.success) {
            goToPage('../home_page/home_page.html');
        } else {
            alert(responseData.message);
        }
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.log("Error:", error);
            alert(error.message);
        }
    });
}
