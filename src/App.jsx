import React, { useState } from 'react'
import Header from './components/Header'
import TotalBar from './components/TotalBar'
import ScanZone from './components/ScanZone'
import ManualEntry from './components/ManualEntry'
import ItemList from './components/ItemList'
import BottomBar from './components/BottomBar'

const appStyle = {
  maxWidth: 480,
  margin: '0 auto',
  minHeight: '100vh',
  background: 'var(--bg-base)',
  position: 'relative',
}

export default function App() {
  const [items, setItems] = useState([])

  function addItem(item) {
    setItems(prev => [...prev, { ...item, id: Date.now() + Math.random() }])
  }

  function deleteItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function saveItem(index, updated) {
    setItems(prev => prev.map((item, i) => i === index ? { ...updated, id: item.id } : item))
  }

  function clearAll() {
    if (confirm('Clear all items from trolley?')) setItems([])
  }

  return (
    <div style={appStyle}>
      <Header />
      <TotalBar items={items} />
      <ScanZone onAddItem={addItem} />
      <ManualEntry onAddItem={addItem} />
      <ItemList
        items={items}
        onDelete={deleteItem}
        onSave={saveItem}
        onClear={clearAll}
      />
      <BottomBar items={items} onNewSession={() => setItems([])} />
    </div>
  )
}
