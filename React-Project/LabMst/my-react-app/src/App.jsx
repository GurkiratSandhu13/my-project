import { useState } from 'react'
import GroceryList from './components/GroceryList'

function App() {
  const [items, setItems] = useState(["Milk", "Bread", "Eggs"])
  const [newItem, setNewItem] = useState("")

  const addItem = () => {
    const trimmed = newItem.trim()
    if (!trimmed) return
    setItems([...items, trimmed])
    setNewItem("")
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div>
      <div>
        <h2 style={{ textAlign: 'center' }}>Grocery List</h2>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Add a new item"
          />
          <button onClick={addItem}>Add</button>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
          <div>
            <GroceryList items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
