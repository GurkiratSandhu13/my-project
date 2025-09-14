import React from "react";

export default function BookItem({ book, onRemove }) {
  return (
    <div className="book">
      <span>
        <b>{book.title}</b> by {book.author}
      </span>
      <button onClick={onRemove} className="btn remove">Remove</button>
    </div>
  );
}
