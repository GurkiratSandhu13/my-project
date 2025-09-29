import React from "react";

export default function GroceryList({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
