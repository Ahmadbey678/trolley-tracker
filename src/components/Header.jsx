import React from 'react'

const styles = {
  header: {
    padding: '1.25rem 1.25rem 1rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'var(--accent-dim)',
    border: '1px solid var(--accent)22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    color: 'var(--accent)',
  },
  title: {
    fontSize: 17,
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  sub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
    fontWeight: 400,
  },
  badge: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    padding: '4px 10px',
    borderRadius: 20,
    fontFamily: 'var(--font-mono)',
  }
}

export default function Header() {
  const today = new Date().toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <div style={styles.iconWrap}>
          <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <div>
          <div style={styles.title}>Trolley Tracker</div>
          <div style={styles.sub}>scan as you shop</div>
        </div>
      </div>
      <div style={styles.badge}>{today}</div>
    </div>
  )
}
