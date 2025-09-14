import React, { useState } from "react";
import SearchBar from "./SearchBar";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";
function Library() {

const [books, setBooks] = useState([
    { title: "Jattan da Itihaas", author: "Hoshiar Singh Duleh" },
    { title: "Atomic Habits", author: "James Clear" },
    { title: "The Power of Now", author: "Eckhart Tolle" },
  ]);

  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const handleAddBook = () => {
    if (newTitle.trim() && newAuthor.trim()) {
      setBooks([...books, { title: newTitle, author: newAuthor }]);
      setNewTitle("");
      setNewAuthor("");
    }
  };

  const handleRemoveBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );
    return (
        <div className="container">
      <h2>Library Management</h2>

      <SearchBar search={search} setSearch={setSearch} />

      <AddBookForm
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newAuthor={newAuthor}
        setNewAuthor={setNewAuthor}
        handleAddBook={handleAddBook}
      />

      <BookList books={filteredBooks} handleRemoveBook={handleRemoveBook} />
    </div>
    );
}
export default Library;
