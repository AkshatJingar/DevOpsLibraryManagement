const express = require('express');
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: "Atomic Habits", author: "James Clear", isbn: "9780061122415", available: true },
  { id: 2, title: "ABC", author: "XYZ", isbn: "9780451524935", available: false }
];

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) 
    return res.status(404).send("Book not found");
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, isbn, available } = req.body;

  const newBook = {
    id: books.length + 1,
    title,
    author,
    isbn,
    available: available !== undefined ? available : true
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) 
    return res.status(404).send("Book not found");

  const { title, author, isbn, available } = req.body;

  book.title = title || book.title;
  book.author = author || book.author;
  book.isbn = isbn || book.isbn;
  book.available = available !== undefined ? available : book.available;

  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) 
    return res.status(404).send("Book not found");

  const deletedBook = books.splice(index, 1);
  res.json(deletedBook[0]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Library service is running on port ${PORT}`);
});
