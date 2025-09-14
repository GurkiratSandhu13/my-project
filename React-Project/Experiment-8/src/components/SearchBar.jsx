import React from "react";

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by title or author"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="input search"
    />
  );
}
