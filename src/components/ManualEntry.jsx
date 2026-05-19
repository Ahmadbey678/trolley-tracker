import React, { useState } from 'react'

const s = {
  section: {
    padding: '1.25rem',
    borderBottom: '1px solid var(--border)',
  },
  sectionLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
    marginBottom: 10,
  },
  card: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem 1.1rem',
  },
  fieldLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    marginBottom: 5,
    fontWeight: 500,
  },
  input: {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: 14,
    padding: '9px 12px',
    outline: 'none',
    fontFamily: 'var(--font-main)',
    marginBottom: 10,
    transition: 'border-color 0.15s',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 10,
  },
  btnPrimary: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--accent)44',
    background: 'var(--accent)',
    color: '#0d0f14',
    transition: 'opacity 0.12s',
    fontFamily: 'var(--font-main)',
  },
}

export default function ManualEntry({ onAddItem }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('1')

  function handleAdd() {
    const p = parseFloat(price)
    const q = parseInt(qty) || 1
    if (!name.trim()) { alert('Please enter a product name'); return }
    if (isNaN(p) || p < 0) { alert('Please enter a valid price'); return }
    onAddItem({ name: name.trim(), price: p, qty: q, subtotal: p * q })
    setName('')
    setPrice('')
    setQty('1')
  }

  return (
    <div style={s.section}>
      <div style={s.sectionLabel}>manual entry</div>
      <div style={s.card}>
        <div style={s.fieldLabel}>product name</div>
        <input
          style={s.input}
          type="text"
          placeholder="e.g. Tarang Milk 200ml"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <div style={s.row2}>
          <div>
            <div style={s.fieldLabel}>price (Rs.)</div>
            <input
              style={{ ...s.input, marginBottom: 0 }}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div>
            <div style={s.fieldLabel}>quantity</div>
            <input
              style={{ ...s.input, marginBottom: 0 }}
              type="number"
              placeholder="1"
              min="1"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button style={s.btnPrimary} onClick={handleAdd}>
            + add to trolley
          </button>
        </div>
      </div>
    </div>
  )
}
