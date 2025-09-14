import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductCard from './ProductCard.jsx'

function App() {

  return (
    <div class ="outer-div">
       <div id = "list">Product List</div>
       <div className="cart">
      <ProductCard product={{ name: "Wireless Mouse", price: 100, status: "Available" }} />
      <ProductCard product={{ name: "Monitor", price: 200, status: "Out of Stock" }} />
      <ProductCard product={{ name: "Play Station 5", price: 300, status: "Available" }} />
      </div>
      <div className="cart">
      <ProductCard product={{ name: "IPhone 17", price: 990, status: "Available" }} />
      <ProductCard product={{ name: "MacBook Pro", price: 1490, status: "Available" }} />
      <ProductCard product={{ name: "Samsung S21", price: 699, status: "Out of Stock" }} />
      </div>
    </div>

  )
}

export default App
