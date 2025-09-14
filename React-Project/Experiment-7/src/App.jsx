import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductCard from './ProductCard.jsx'

const products = [
  { name: 'Wireless Mouse', price: 25.99, inStock: true },
  { name: 'Keyboard', price: 45.5, inStock: false },
  { name: 'Monitor', price: 199.99, inStock: true }
]

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
      <ProductCard product={products[0]} />
      <ProductCard product={products[1]} />
      <ProductCard product={products[2]} />
    </div>
  )
}

export default App