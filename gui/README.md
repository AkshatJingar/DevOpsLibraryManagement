# Book Management System - GUI

A modern, responsive web interface for managing your book collection. This GUI provides a beautiful and intuitive way to interact with your book management API.

## Features

### 📚 Book Management
- **Add New Books**: Add books with title, author, ISBN, and availability status
- **View All Books**: Display all books in a responsive grid layout
- **Edit Books**: Update book information through a modal interface
- **Delete Books**: Remove books with confirmation dialog
- **Get Specific Book**: View individual book details

### 🔍 Search & Filter
- **Real-time Search**: Search books by title, author, or ISBN
- **Availability Filter**: Filter books by availability status (Available/Unavailable)
- **Clear Filters**: Reset all search and filter options

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and hover effects
- **Modern Color Scheme**: Gradient backgrounds and clean typography
- **Accessibility**: ARIA labels and keyboard shortcuts
- **Loading States**: Visual feedback during API operations

## Getting Started

### Prerequisites
1. Make sure your Node.js backend server is running on port 5000
2. The backend should have CORS enabled (or you may need to add it)

### Running the GUI

1. **Start your backend server first:**
   ```bash
   cd book-management
   node server.js
   ```

2. **Open the GUI:**
   - Navigate to the `gui` folder
   - Open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server -p 8000
     ```

3. **Access the application:**
   - If opened directly: `file:///path/to/book-management/gui/index.html`
   - If served: `http://localhost:8000`

## API Endpoints Used

The GUI connects to your backend API at `http://localhost:5000/api`:

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## How to Use

### Adding a Book
1. Fill in the "Add New Book" form at the top
2. Enter the book title, author, ISBN, and availability
3. Click "Add Book" button
4. The book will appear in the books list below

### Searching and Filtering
1. **Search**: Type in the search box to find books by title, author, or ISBN
2. **Filter**: Use the dropdown to show only available or unavailable books
3. **Clear**: Click "Clear Filters" to reset all search and filter options

### Editing a Book
1. Click the "Edit" button on any book card
2. A modal will open with the book's current information
3. Make your changes
4. Click "Save Changes" to update the book

### Deleting a Book
1. Click the "Delete" button on any book card
2. A confirmation dialog will appear
3. Click "Delete" to confirm or "Cancel" to abort

## Keyboard Shortcuts

- **Escape**: Close any open modal
- **Ctrl/Cmd + F**: Focus the search input
- **Ctrl/Cmd + N**: Focus the "Add Book" form title field

## File Structure

```
gui/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

### Changing the API URL
If your backend runs on a different port or URL, edit the `API_BASE_URL` constant in `script.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Styling
The CSS file (`styles.css`) is well-organized and commented. You can easily customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Adding Features
The JavaScript file (`script.js`) is modular and well-structured. You can easily add:
- Additional search filters
- Sorting options
- Export functionality
- Bulk operations

## Troubleshooting

### Common Issues

1. **Books not loading:**
   - Check if your backend server is running on port 5000
   - Open browser developer tools (F12) and check the Console tab for errors
   - Verify the API endpoints are working by testing them directly

2. **CORS errors:**
   - Add CORS middleware to your backend server:
     ```javascript
     const cors = require('cors');
     app.use(cors());
     ```

3. **GUI not responsive:**
   - Make sure you're using a modern browser
   - Check if all CSS and JavaScript files are loading properly

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Feel free to enhance this GUI by:
- Adding new features
- Improving the design
- Adding more accessibility features
- Optimizing performance

## License

This project is open source and available under the MIT License. 