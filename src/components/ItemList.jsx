import React, { useState } from 'react'

const s = {
  section: {
    padding: '1.25rem',
    paddingBottom: '6rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
  },
  clearBtn: {
    fontSize: 12,
    color: 'var(--danger)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-main)',
    padding: '2px 0',
    opacity: 0.8,
  },
  empty: {
    textAlign: 'center',
    padding: '2.5rem 1rem',
    color: 'var(--text-muted)',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 1.6,
  },
  card: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '0.85rem 1rem',
    marginBottom: 8,
  },
  cardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  num: {
    width: 24,
    height: 24,
    borderRadius: 8,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    fontSize: 11,
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: 'var(--font-mono)',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 2,
    fontFamily: 'var(--font-mono)',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    flexShrink: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '3px 5px',
    borderRadius: 6,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.12s',
  },
  editForm: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid var(--border)',
    display: 'grid',
    gridTemplateColumns: '1fr 80px 70px',
    gap: 8,
    alignItems: 'end',
  },
  input: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--accent)44',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: 13,
    padding: '7px 10px',
    outline: 'none',
    fontFamily: 'var(--font-main)',
    width: '100%',
  },
  fieldLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    marginBottom: 4,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  saveBtn: {
    padding: '7px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--accent)44',
    background: 'var(--accent)',
    color: '#0d0f14',
    fontFamily: 'var(--font-main)',
    width: '100%',
  },
}

function EditIcon({ color = 'var(--text-secondary)' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function TrashIcon({ color = 'var(--danger)' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  )
}

function ItemCard({ item, index, onDelete, onSave }) {
  const [editing, setEditing] = useState(false)
  const [eName, setEName] = useState(item.name)
  const [ePrice, setEPrice] = useState(item.price.toString())
  const [eQty, setEQty] = useState(item.qty.toString())

  function save() {
    const p = parseFloat(ePrice)
    const q = parseInt(eQty) || 1
    if (!eName.trim()) { alert('Name cannot be empty'); return }
    if (isNaN(p) || p < 0) { alert('Enter a valid price'); return }
    onSave(index, { name: eName.trim(), price: p, qty: q, subtotal: p * q })
    setEditing(false)
  }

  function cancelEdit() {
    setEName(item.name)
    setEPrice(item.price.toString())
    setEQty(item.qty.toString())
    setEditing(false)
  }

  return (
    <div style={s.card}>
      <div style={s.cardRow}>
        <div style={s.num}>{index + 1}</div>
        <div style={s.info}>
          <div style={s.name}>{item.name}</div>
          <div style={s.meta}>Rs.{item.price.toFixed(2)} × {item.qty}</div>
        </div>
        <div style={s.subtotal}>Rs.{item.subtotal.toFixed(2)}</div>
        <button
          style={s.iconBtn}
          onClick={() => editing ? cancelEdit() : setEditing(true)}
          title={editing ? 'cancel' : 'edit item'}
        >
          <EditIcon color={editing ? 'var(--accent)' : 'var(--text-secondary)'} />
        </button>
        <button
          style={s.iconBtn}
          onClick={() => onDelete(index)}
          title="remove item"
        >
          <TrashIcon />
        </button>
      </div>

      {editing && (
        <div style={s.editForm}>
          <div>
            <div style={s.fieldLabel}>name</div>
            <input
              style={s.input}
              type="text"
              value={eName}
              onChange={e => setEName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <div style={s.fieldLabel}>price</div>
            <input
              style={s.input}
              type="number"
              min="0"
              step="0.01"
              value={ePrice}
              onChange={e => setEPrice(e.target.value)}
            />
          </div>
          <div>
            <div style={s.fieldLabel}>qty</div>
            <input
              style={s.input}
              type="number"
              min="1"
              value={eQty}
              onChange={e => setEQty(e.target.value)}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button style={s.saveBtn} onClick={save}>save changes</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ItemList({ items, onDelete, onSave, onClear }) {
  return (
    <div style={s.section}>
      <div style={s.header}>
        <div style={s.sectionLabel}>in your trolley</div>
        {items.length > 0 && (
          <button style={s.clearBtn} onClick={onClear}>clear all</button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🛒</div>
          <div style={s.emptyText}>
            your trolley is empty<br />
            scan or manually add a product above
          </div>
        </div>
      ) : (
        items.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            index={i}
            onDelete={onDelete}
            onSave={onSave}
          />
        ))
      )}
    </div>
  )
}
