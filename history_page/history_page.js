document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
});

function loadHistory() {
    const userId = getUserId();
    const token = getAccessToken();

    handleAuthFetch(fetch(`${API_BASE_URL}/api/transactions/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }))
    .then(res => res.json())
    .then(data => {
        const borrowed = data.filter(item => item.status === 'borrowed');
        const returned = data.filter(item => item.status === 'returned');

        renderSection(borrowed, 'borrowed-section', false);
        renderSection(returned, 'returned-section', true);
    })
    .catch(err => {
        console.error(err);
        alert("Failed to load history.");
    });
}

function renderSection(items, sectionId, isReturned) {
    const container = document.getElementById(sectionId);
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p>No records found.</p>';
        return;
    }

    items.forEach(item => {
        fetchBookDetails(item.book_id).then(book => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <img src="${book.cover_image}" alt="Book Cover">
                <h3>${book.title}</h3>
                <p>Borrowed: ${formatDate(item.borrow_date)}</p>
                ${isReturned 
                    ? `<p>Returned: ${formatDate(item.return_date)}</p>` 
                    : `<p>Due: ${formatDate(item.due_date)}</p>`}
            `;

            container.appendChild(card);
        });
    });
}

function fetchBookDetails(bookId) {
    const token = getAccessToken();

    return handleAuthFetch(fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }))
    .then(res => res.json())
    .catch(err => {
        console.error(`Failed to fetch book ${bookId}`, err);
        return {
            title: "Unknown",
            cover_image: "https://via.placeholder.com/120x160?text=No+Image"
        };
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}
