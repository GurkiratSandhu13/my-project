## 📖 Product Cards with React Components – Experiment 7

A first step into React: rendering a small set of product cards using functional components, props, JSX, and declarative UI composition. This experiment shifts from imperative DOM/event handling (Experiments 4–6) to a component-driven mindset.

### Why This Experiment

Previous experiments focused on real-time text updates (4), DOM filtering (5), and canvas drawing (6). Here, the focus is:

  * **Structure UI as reusable components.**
  * **Pass data via props.**
  * **Rely on React's declarative render** instead of manual DOM mutations.

### Learning Objectives

  * Understand the **React component + prop model**.
  * Contrast **declarative rendering** with prior imperative DOM edits.
  * Prepare for introducing **state (`useState`)** and **lists (`Array.map`)**.
  * Establish a baseline **React + Vite toolchain**.

-----

## Core Concepts & Theory

React is a component-based JavaScript library used for building interactive UIs. The key concepts used in this experiment are:

  * **Components:** Reusable building blocks (`App`, `ProductCard`).
  * **Props:** Passing data between parent and child components.
  * **State (`useState`):** Storing and updating dynamic data (introduced in future experiments).
  * **JSX:** HTML-like syntax compiled to function calls.
  * **Declarative Rendering:** UI is a function of data.
  * **Conditional Rendering:** Image tag only if `product.image`.
  * **Composition:** Parent (`App`) arranges child cards in a flex row.

-----

## Project Structure

A simplified view of the project's file hierarchy is provided below.

### Simplified Structure

```
my-project/
├── HTML-CSS/
│   ├── Experiment-0/
│   └── ...
└── React-Project/
    └── Experiment-7/
        ├── index.html
        ├── src/
        │   ├── App.jsx
        │   ├── App.css
        │   ├── index.css
        │   ├── main.jsx
        │   └── ProductCard.jsx
        ├── Description.txt
        └── package.json
```

### Description of Files

  * **`index.html`:** The main entry point with the `<div id="root"></div>`.
  * **`main.jsx`:** Uses `createRoot` to render `<App />` inside `#root`.
  * **`App.jsx`:** The parent component. It defines the product list and renders multiple `<ProductCard />` components.
  * **`ProductCard.jsx`:** The child component. It receives product details via props and renders them.
  * **`App.css` / `index.css`:** Styling for the body, product card, and cart layout.

-----

## Components & Data Flow

Products are defined as a constant array in `App.jsx`:

```javascript
const products = [
	{ name: 'Wireless Mouse', price: 25.99, inStock: true },
	{ name: 'Keyboard',      price: 45.50, inStock: false },
	{ name: 'Monitor',       price: 199.99, inStock: true }
];
```

Each object is handed to `ProductCard` via the `product` prop.

### Render / Data Flow (Simple Passive Flow)

1.  React starts at `main.jsx`, mounting `<App />` into `#root`.
2.  `App` returns JSX containing multiple `ProductCard` elements.
3.  Each `ProductCard` receives a `product` object; the JSX is converted to DOM nodes by React.
4.  No state changes occur yet (static data) so there are no re-renders after the initial mount.

-----

## Functionality

### 1\. Product Display

  * Each product is displayed inside a card layout.
  * Props include:
      * **name:** Product name.
      * **price:** Product price.
      * **status:** Availability status (`Available` / `Out of Stock`).

**Example:**

```jsx
<ProductCard product={{ name: "IPhone 17", price: 990, status: "Available" }} />
```

### 2\. Conditional Rendering (Stock Status)

  * **If a product is out of stock:**
      * The background changes (`.out-of-stock` class).
      * The status text turns red.
  * **If available:**
      * The status text turns green.

**Example:**

  * `"Monitor"` → Out of Stock (red + gray background)
  * `"IPhone 17"` → Available (green text)

### 3\. Reusable `ProductCard` Component

The `ProductCard` is written once but reused multiple times. Each card is passed different product data via props.

**Benefit:** Adding 100 products only requires reusing `<ProductCard />`.

### 4\. Flexbox Layout for Product Rows

  * Products are grouped in rows (`.cart` class).
  * Each row uses flexbox for alignment and spacing, creating a grid-like catalog.

-----

## CSS Functionality

1.  `.outer-div` → Main container, centered with a border and padding.
2.  `#product-card` → Individual card design (border, radius, fixed width/height).
3.  `.cart` → Horizontal flex layout for product rows.
4.  `.status-green` → Green text for available products.
5.  `.status-red` → Red text for out of stock products.
6.  `.out-of-stock` → Gray background for unavailable items.

-----

## Key Concepts Showcased

  * **Props:** Passing product details into `ProductCard`.
  * **Conditional Rendering:** Styling changes based on stock status.
  * **Reusability:** One `ProductCard` component for multiple products.
  * **Flexbox Layout:** Organizing product rows.
  * **Separation of Concerns:** `App.jsx` handles the list, while `ProductCard.jsx` handles the UI for each item.

**Core Leap:** From “find & mutate DOM” to “declare component tree from data.”