// Toggle search menu functionality
let menu = document.getElementById("menu-wrap");
function toggleMenu() {
    menu.classList.toggle("open-menu");
}

// Handle menu selection
let selectedType = '';
let searchName = '';

function selectType(type) {
    selectedType = type;
    toggleMenu();
}

document.getElementById('search-bar').addEventListener('input', function (event) {
    searchName = event.target.value;
});

function handleSearch() {
    if (!searchName || !selectedType) {
        alert("Please enter a search term and select the type that you want to search.");
        return;
    }
    getSearchBooks(searchName, selectedType);
    window.location.href = '../book_page/book_page.html';
}

function getSearchBooks(name, type) {
    const token = getAccessToken();

    handleAuthFetch(fetch('http://localhost:2000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type })
    }))
        .then(res => res.json())
        .then(data => {
            sessionStorage.setItem('searchResults', JSON.stringify(data.bookDetails));
        })
        .catch(err => {
            if (err !== 'Unauthorized') {
                console.error("Error during search:", err);
                alert("Error searching books. Please try again.");
            }
        });
}

// ================= USER MENU ===================

function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('open');
}

function goToUserDetails() {
    window.location.href = '../user_details_page/user_details_page.html';
}

function goToHistory() {
    window.location.href = '../history_page/history_page.html';
}

function signOut() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '../login_page/login_page.html';
}

function goToSettings() {
    checkAdminStatus(data => {
        if (data.isAdmin) {
            window.location.href = '../library_page/library_page.html';
        } else {
            alert("You do not have admin privileges.");
        }
    });
}

// Check if user is admin
function checkAdminStatus(callback) {
    const userId = getUserId();
    const token = getAccessToken();

    handleAuthFetch(fetch('http://localhost:2000/api/admincheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: userId })
    }))
    .then(res => res.json())
    .then(data => {
        callback(data);
    })
    .catch(err => {
        if (err !== 'Unauthorized') {
            console.error("Error during admin check:", err);
            alert("Unable to verify admin status. Please try again later.");
        }
    });
}


// ================= ADMIN CHECK =================

document.addEventListener("DOMContentLoaded", () => {
    const settingsItem = document.getElementById('settings-item');
    checkAdminStatus(data => {
        if (data.isAdmin) {
            settingsItem.style.display = 'block';
        } else {
            settingsItem.style.display = 'none';
        }
    });
    displayAnnouncements();
});

// ================== ANNOUNCEMENTS ====================

function displayAnnouncements() {
    const token = getAccessToken();

    handleAuthFetch(fetch('http://localhost:2000/api/announcement/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }))
        .then(res => {
            if (!res.ok) {
                throw new Error('No announcements found');
            }
            return res.json();
        })
        .then(data => {
            updateAnnouncements(data);
        })
        .catch(err => {
            if (err !== 'Unauthorized') {
                console.error("Error during announcement fetch:", err);
                updateAnnouncements([]);
            }
        });
}

function updateAnnouncements(announcements) {
    const container = document.querySelector('.container-announcement');
    container.innerHTML = '<h3>Announcement:</h3>';

    if (announcements.length === 0) {
        container.innerHTML += '<label>No announcements at this time.</label>';
    } else {
        const p = document.createElement('p');
        const formattedText = announcements.join(', ').replace(/(.{50})/g, '$1<br>');
        p.innerHTML = formattedText;
        container.appendChild(p);
    }
}

// ================== FEEDBACK ====================

function feedback() {
    const token = getAccessToken();
    const feedbackContent = document.querySelector('.feedback').value;

    if (!feedbackContent) {
        alert("Please enter your feedback before submitting.");
        return;
    }

    handleAuthFetch(fetch('http://localhost:2000/api/feedback/write', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            feedback: feedbackContent
        })
    }))
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to submit feedback');
            }
            return res.json();
        })
        .then(data => {
            if (data) {
                alert("Thank you for your feedback!");
                document.querySelector('.feedback').value = '';
            } else {
                alert("Error submitting feedback. Please try again later.");
            }
        })
        .catch(err => {
            if (err !== 'Unauthorized') {
                console.error("Error during feedback submission:", err);
                alert("An error occurred. Please try again later.");
            }
        });
}
