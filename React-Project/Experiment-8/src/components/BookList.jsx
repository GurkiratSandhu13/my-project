import React from "react";
import BookItem from "./BookItem";

export default function BookList({ books, handleRemoveBook }) {
  return (
    <div className="book-list">
      {books.map((book, index) => (
        <BookItem key={index} book={book} onRemove={() => handleRemoveBook(index)} />
      ))}
    </div>
  );
}
