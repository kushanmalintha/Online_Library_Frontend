// Function to display search results
function displaySearchResults() {
    // Get the search results from session storage
    const data = sessionStorage.getItem('searchResults');
    console.log(data);

    // Check if data is null or empty string
    if (data === null || data === undefined || data.trim() === "") {
        alert("No search results found.");
        return;
    }

    try {
        const parsedData = JSON.parse(data);

        if (!parsedData || parsedData.length === 0) {
            alert("No books found or no search results available.");
            return;
        }

        const container = document.querySelector('.container');

        parsedData.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const img = document.createElement('img');
            img.src = book.cover_image;
            img.alt = book.title;

            bookDiv.onclick = () => {
                sessionStorage.setItem('selectedBook', JSON.stringify(book));  // Store only the clicked book
                window.location.href = '../book_profile_page/book_profile_page.html';
            };

            bookDiv.appendChild(img);

            const title = document.createElement('h3');
            title.textContent = book.title;
            bookDiv.appendChild(title);

            container.appendChild(bookDiv);
        });
    } catch (e) {
        alert("No search results found.");
        window.location.href = '../home_page/home_page.html';
        return;
    }
}

displaySearchResults();
