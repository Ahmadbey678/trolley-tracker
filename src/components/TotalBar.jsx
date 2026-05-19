import React from 'react'

const styles = {
  bar: {
    padding: '1rem 1.25rem',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  amountWrap: {
    textAlign: 'right',
  },
  currency: {
    fontSize: 13,
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    marginRight: 3,
  },
  amount: {
    fontSize: 28,
    fontWeight: 600,
    color: 'var(--accent)',
    letterSpacing: '-0.03em',
    fontFamily: 'var(--font-mono)',
  },
  amountSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 2,
    textAlign: 'right',
  }
}

export default function TotalBar({ items }) {
  const total = items.reduce((s, i) => s + i.subtotal, 0)
  const count = items.length

  return (
    <div style={styles.bar}>
      <div>
        <div style={styles.label}>session total</div>
        <div style={styles.count}>{count} {count === 1 ? 'item' : 'items'} in trolley</div>
      </div>
      <div style={styles.amountWrap}>
        <div>
          <span style={styles.currency}>Rs.</span>
          <span style={styles.amount}>{total.toFixed(2)}</span>
        </div>
        <div style={styles.amountSub}>incl. all items</div>
      </div>
    </div>
  )
}
