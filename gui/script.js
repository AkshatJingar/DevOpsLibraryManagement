const API_BASE_URL = 'http://18.212.242.79:5000/api';

let allBooks = [];
let filteredBooks = [];

const addBookForm = document.getElementById('addBookForm');
const editBookForm = document.getElementById('editBookForm');
const booksList = document.getElementById('booksList');
const loadingMessage = document.getElementById('loadingMessage');
const noBooksMessage = document.getElementById('noBooksMessage');
const searchInput = document.getElementById('searchInput');
const filterAvailable = document.getElementById('filterAvailable');
const clearFiltersBtn = document.getElementById('clearFilters');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');

document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    setupEventListeners();
});


function setupEventListeners() {
    addBookForm.addEventListener('submit', handleAddBook);

    editBookForm.addEventListener('submit', handleEditBook);
    
    searchInput.addEventListener('input', handleSearch);
    filterAvailable.addEventListener('change', handleFilter);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeEditModal();
            closeDeleteModal();
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
    
    // Confirm delete
    confirmDeleteBtn.addEventListener('click', handleDeleteBook);
}

async function loadBooks() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/books`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allBooks = await response.json();
        filteredBooks = [...allBooks];
        displayBooks();
        showMessage('Books loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading books:', error);
        showMessage('Failed to load books. Please check if the server is running.', 'error');
    } finally {
        showLoading(false);
    }
}

function displayBooks() {
    if (filteredBooks.length === 0) {
        booksList.innerHTML = '';
        noBooksMessage.style.display = 'block';
        return;
    }
    
    noBooksMessage.style.display = 'none';
    
    booksList.innerHTML = filteredBooks.map(book => `
        <div class="book-card" data-id="${book.id}">
            <h3>${escapeHtml(book.title)}</h3>
            <div class="book-info">
                <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
                <p><strong>ISBN:</strong> ${escapeHtml(book.isbn)}</p>
                <p><strong>ID:</strong> ${book.id}</p>
            </div>
            <span class="availability ${book.available ? 'available' : 'unavailable'}">
                ${book.available ? 'Available' : 'Unavailable'}
            </span>
            <div class="book-actions">
                <button class="btn btn-success" onclick="editBook(${book.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="showDeleteConfirmation(${book.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

async function handleAddBook(event) {
    event.preventDefault();
    
    const formData = new FormData(addBookForm);
    const bookData = {
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        isbn: formData.get('isbn').trim(),
        available: formData.get('available') === 'true'
    };
    
    if (!bookData.title || !bookData.author || !bookData.isbn) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newBook = await response.json();
        allBooks.push(newBook);
        filteredBooks = [...allBooks];
        displayBooks();
        
        addBookForm.reset();
        showMessage('Book added successfully!', 'success');
        
    } catch (error) {
        console.error('Error adding book:', error);
        showMessage('Failed to add book. Please try again.', 'error');
    }
}

async function handleEditBook(event) {
    event.preventDefault();
    
    const formData = new FormData(editBookForm);
    const bookId = parseInt(document.getElementById('editId').value);
    const bookData = {
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        isbn: formData.get('isbn').trim(),
        available: formData.get('available') === 'true'
    };
    
    if (!bookData.title || !bookData.author || !bookData.isbn) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedBook = await response.json();
        
        const index = allBooks.findIndex(book => book.id === bookId);
        if (index !== -1) {
            allBooks[index] = updatedBook;
        }
        
        const filteredIndex = filteredBooks.findIndex(book => book.id === bookId);
        if (filteredIndex !== -1) {
            filteredBooks[filteredIndex] = updatedBook;
        }
        
        displayBooks();
        closeEditModal();
        showMessage('Book updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating book:', error);
        showMessage('Failed to update book. Please try again.', 'error');
    }
}

async function handleDeleteBook() {
    const bookId = parseInt(confirmDeleteBtn.dataset.bookId);
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allBooks = allBooks.filter(book => book.id !== bookId);
        filteredBooks = filteredBooks.filter(book => book.id !== bookId);
        
        displayBooks();
        closeDeleteModal();
        showMessage('Book deleted successfully!', 'success');
        
    } catch (error) {
        console.error('Error deleting book:', error);
        showMessage('Failed to delete book. Please try again.', 'error');
    }
}

async function editBook(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const book = await response.json();
        
        document.getElementById('editId').value = book.id;
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editIsbn').value = book.isbn;
        document.getElementById('editAvailable').value = book.available.toString();
        
        editModal.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading book for editing:', error);
        showMessage('Failed to load book data for editing.', 'error');
    }
}

function showDeleteConfirmation(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
        document.getElementById('deleteBookTitle').textContent = book.title;
        confirmDeleteBtn.dataset.bookId = bookId;
        deleteModal.style.display = 'block';
    }
}

function closeEditModal() {
    editModal.style.display = 'none';
    editBookForm.reset();
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters(searchTerm, filterAvailable.value);
}

function handleFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters(searchTerm, filterAvailable.value);
}

function applyFilters(searchTerm, availabilityFilter) {
    filteredBooks = allBooks.filter(book => {           
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm);
        
        const matchesAvailability = !availabilityFilter || 
            book.available.toString() === availabilityFilter;
        
        return matchesSearch && matchesAvailability;
    });
    
    displayBooks();
}

function clearFilters() {
    searchInput.value = '';
    filterAvailable.value = '';
    filteredBooks = [...allBooks];
    displayBooks();
}

function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    if (show) {
        booksList.innerHTML = '';
        noBooksMessage.style.display = 'none';
    }
}

function showMessage(message, type) {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditModal();
        closeDeleteModal();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        searchInput.focus();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        document.getElementById('title').focus();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (button.textContent.includes('Edit')) {
            button.title = 'Edit this book';
        } else if (button.textContent.includes('Delete')) {
            button.title = 'Delete this book';
        } else if (button.textContent.includes('Add')) {
            button.title = 'Add a new book to the library';
        }
    });
    
    searchInput.setAttribute('aria-label', 'Search books by title, author, or ISBN');
    filterAvailable.setAttribute('aria-label', 'Filter books by availability');
}); 