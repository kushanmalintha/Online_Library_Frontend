// Utility to navigate to a different page
function goToPage(path) {
    window.location.href = path;
}

// Toggle search menu functionality
let menu = document.getElementById("menu-wrap");
function toggleMenu(){
    menu.classList.toggle("open-menu");
}

// Function to check admin status
function checkAdminStatus(callback) {
    const userId = getUserId();
    const token = getAccessToken();

    fetch('http://localhost:2000/api/admincheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: userId })
    })
    .then(res => res.json())
    .then(data => {
        callback(data);
    })
    .catch(err => {
        console.error("Error during admin check:", err);
        alert("Unable to verify admin status. Please try again later.");
    });
}

// Display settings container if the user is an admin
document.addEventListener("DOMContentLoaded", () => {
    const settingContainer = document.getElementById("setting-container");
    checkAdminStatus(data => {
        if (data.isAdmin) {
            settingContainer.style.display = "flex";
        }
    });
    displayAnnouncements();
});

// Handle form submission for settings button
const formSetting = document.querySelector('.form');
formSetting.addEventListener('submit', event => {
    event.preventDefault();
    checkAdminStatus(data => {
        if (data.isAdmin) {
            goToPage('../library_page/library_page.html');
        } else {
            alert(data.message || "You do not have admin privileges.");
        }
    });
});

// Function to display announcements
function displayAnnouncements() {
    const token = getAccessToken();

    fetch('http://localhost:2000/api/announcement/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
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
        console.error("Error during announcement fetch:", err);
        updateAnnouncements([]);
    });
}

// Function to update announcements in the HTML
function updateAnnouncements(announcements) {
    const container = document.querySelector('.container-announcement');
    container.innerHTML = '<h3>Announcement:</h3>'; // Clear existing content

    if (announcements.length === 0) {
        container.innerHTML += '<label>No announcements at this time.</label>';
    } else {
        const p = document.createElement('p');
        const formattedText = announcements.join(', ').replace(/(.{50})/g, '$1<br>');
        p.innerHTML = formattedText;
        container.appendChild(p);
    }
}

// Function to write feedback
function feedback() {
    const token = getAccessToken();
    const feedbackContent = document.querySelector('.feedback').value;

    if (!feedbackContent) {
        alert("Please enter your feedback before submitting.");
        return;
    }

    fetch('http://localhost:2000/api/feedback/write', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            feedback: feedbackContent
        })
    })
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
        console.error("Error during feedback submission:", err);
        alert("An error occurred. Please try again later.");
    });
}

let selectedType = '';
let searchName = '';

// Toggle menu visibility
function toggleMenu() {
    menu.classList.toggle("open-menu");
}

// Handle menu selection and set type
function selectType(type) {
    selectedType = type;
    toggleMenu();
}

// Handle search bar input
document.getElementById('search-bar').addEventListener('input', function(event) {
    searchName = event.target.value;
});

// Handle search request on icon click
function handleSearch() {
    if (!searchName || !selectedType) {
        alert("Please enter a search term and select the type that you want to select.");
        return;
    }
    getSearchBooks(searchName, selectedType); 
    window.location.href = '../book_page/book_page.html';
}

// Fetch books based on name and type
function getSearchBooks(name, type) {
    const token = getAccessToken();

    fetch('http://localhost:2000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type })
    })
    .then(res => res.json())
    .then(data => {
        // Store the search results in local storage
        localStorage.setItem('searchResults', JSON.stringify(data.bookDetails));
    })
    .catch(err => {
        console.error("Error during search:", err);
        alert("Error searching books. Please try again.");
    });
}
