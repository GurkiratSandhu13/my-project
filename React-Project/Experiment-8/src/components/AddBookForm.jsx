import React from "react";

export default function AddBookForm({ newTitle, setNewTitle, newAuthor, setNewAuthor, handleAddBook }) {
  return (
    <div className="form">
      <input
        type="text"
        placeholder="New book title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="input"
      />

      <input
        type="text"
        placeholder="New book author"
        value={newAuthor}
        onChange={(e) => setNewAuthor(e.target.value)}
        className="input"
      />

      <button onClick={handleAddBook} className="btn">Add Book</button>
    </div>
  );
}
