## 📖 Library Management System - React Project

This React-based project is a Library Management System that allows users to manage a collection of books with interactive features, including search, add, and remove functionality. The project demonstrates core React concepts like component-based architecture, state management, and event handling.

-----

### Project Overview

**Tech Stack:**

  * **Frontend:** React.js (using Vite for a fast build)
  * **Styling:** HTML5 and CSS (`App.css`)

**Core Concepts:**

  * **Components:** Reusable building blocks such as `SearchBar`, `AddBookForm`, and `BookList`.
  * **Props:** Data is passed between parent and child components.
  * **State (`useState`):** Dynamic data (books, search text) is stored and updated.
  * **Events:** Handles user interactions like button clicks and input changes.

-----

### File Hierarchy

```
Experiment-8/
├── index.html                  (Entry point with <div id="root"></div>)
├── src/
│   ├── App.jsx                 (Loads <Library /> component)
│   ├── index.css               (Styling for index page)
│   ├── App.css                 (Styling for UI)
│   ├── main.jsx                (Mounts React App into #root)
│   └── components/
│       ├── Library.jsx         (Main logic for managing books, search, add, and remove)
│       ├── SearchBar.jsx       (Component for filtering books)
│       ├── AddBookForm.jsx     (Component to add new books)
│       ├── BookList.jsx        (Displays books with a remove option)
│       └── BookItem.jsx        (Displays individual book information)
├── Description.txt             (Description about the Experiment)
└── package.json
```

-----

### Functionality

1.  **Add Book:**

      * Input fields for **Title** and **Author** are in `AddBookForm.jsx`.
      * Clicking **"Add Book"** calls the `addBook()` function in `Library.jsx`.
      * A new book object `{ title, author }` is created and appended to the existing `books` state.
      * The UI automatically updates to display the new book.

2.  **Remove Book:**

      * Each book in `BookList.jsx` has a **"Remove"** button.
      * Clicking it calls `handleRemoveBook(id)` from `Library.jsx`, which filters the book out of the list.
      * The UI updates instantly.

3.  **Search Book:**

      * A search input field is in `SearchBar.jsx`.
      * Typing in the field updates the `searchTerm` state in `Library.jsx`.
      * The book list is filtered to display only matching books.

4.  **Book Display:**

      * A clean, card-based layout shows a list of books with bolded titles and author information in the format *"by [Author Name]"*.

-----

### Usage Instructions

1.  **SEARCH:** Type in the search box to filter books by title or author.
2.  **ADD:** Enter a new book's title and author, then click **"Add Book"**.
3.  **REMOVE:** Click the **"Remove"** button next to any book to delete it.
4.  All changes happen instantly without page reloads.

-----

### How to Run

1.  Navigate to the project directory.
2.  Run `npm install` (if dependencies are not already installed).
3.  Run `npm run dev`.
4.  Open your browser to `http://localhost:5173` (or the port shown in the terminal).

-----

### Learning Objectives Achieved

  * **Dynamic rendering and filtering** of data.
  * **Component composition and props** for building a structured UI.
  * **State management** using the `useState` hook.
  * **Event handling and form management**.
  * CSS styling and layout techniques.
  * Understanding React's component-based architecture.