import React, { useState, useRef, useEffect } from 'react'

function extractProductName(text) {
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 2 && l.length < 80)
    .filter(l => !/^[\d\s.,\-:/|%]+$/.test(l))
    .filter(l => /[a-zA-Z]/.test(l))
  if (lines.length === 0) return ''
  lines.sort((a, b) => b.length - a.length)
  return lines[0].replace(/[^\w\s\-&().]/g, '').replace(/\s+/g, ' ').trim()
}

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
  dropzone: {
    border: '1px dashed var(--border-hover)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem 1rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
    background: 'var(--bg-elevated)',
    position: 'relative',
    overflow: 'hidden',
  },
  dropzoneActive: {
    borderColor: 'var(--accent)',
    background: 'var(--accent-dim)',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  scanText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: 4,
  },
  scanSub: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  previewImg: {
    maxHeight: 130,
    borderRadius: 'var(--radius-md)',
    objectFit: 'contain',
    marginBottom: 8,
  },
  processing: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: 'var(--text-secondary)',
    justifyContent: 'center',
    padding: '10px 0',
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid var(--border-hover)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  confirmBox: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem 1.1rem',
    marginTop: 12,
  },
  detectedLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
  },
  detectedName: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: 12,
    wordBreak: 'break-word',
    lineHeight: 1.4,
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
  fieldLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    marginBottom: 5,
    fontWeight: 500,
  },
  btnRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  btnSecondary: {
    padding: '9px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid var(--border-hover)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    transition: 'background 0.12s, color 0.12s',
    fontFamily: 'var(--font-main)',
  },
  btnPrimary: {
    padding: '9px 12px',
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
  errorNote: {
    fontSize: 12,
    color: 'var(--danger)',
    textAlign: 'center',
    padding: '6px 0',
  }
}

export default function ScanZone({ onAddItem }) {
  const [phase, setPhase] = useState('idle') // idle | processing | confirm | error
  const [preview, setPreview] = useState(null)
  const [detectedName, setDetectedName] = useState('')
  const [editName, setEditName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('1')
  const [processingText, setProcessingText] = useState('reading product label...')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()
  const workerRef = useRef(null)
  const workerReadyRef = useRef(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
    document.head.appendChild(style)
    initWorker()
    return () => { if (workerRef.current) workerRef.current.terminate() }
  }, [])

  async function initWorker() {
    try {
      const { createWorker } = await import('tesseract.js')
      workerRef.current = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProcessingText(`reading text... ${Math.round(m.progress * 100)}%`)
          }
        }
      })
      workerReadyRef.current = true
    } catch (e) {
      console.error('Tesseract init failed', e)
    }
  }

  async function handleFile(file) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setPhase('processing')
    setProcessingText('reading product label...')

    try {
      if (!workerReadyRef.current) await initWorker()
      const result = await workerRef.current.recognize(url)
      const name = extractProductName(result.data.text || '')
      setDetectedName(name)
      setEditName(name)
      setIsEditingName(!name)
      setPrice('')
      setQty('1')
      setPhase('confirm')
    } catch (e) {
      setDetectedName('')
      setEditName('')
      setIsEditingName(true)
      setPrice('')
      setQty('1')
      setPhase('error')
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  function handleAdd() {
    const name = isEditingName ? editName.trim() : detectedName
    const p = parseFloat(price)
    const q = parseInt(qty) || 1
    if (!name) { alert('Please enter a product name'); return }
    if (isNaN(p) || p < 0) { alert('Please enter a valid price'); return }
    onAddItem({ name, price: p, qty: q, subtotal: p * q })
    reset()
  }

  function reset() {
    setPhase('idle')
    setPreview(null)
    setDetectedName('')
    setEditName('')
    setIsEditingName(false)
    setPrice('')
    setQty('1')
  }

  return (
    <div style={s.section}>
      <div style={s.sectionLabel}>scan product</div>

      <div
        style={{ ...s.dropzone, ...(dragging ? s.dropzoneActive : {}) }}
        onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={e => { handleFile(e.target.files[0]); e.target.value = '' }}
        />

        {phase === 'idle' && (
          <>
            <div style={s.iconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div style={s.scanText}>tap to photograph a product</div>
            <div style={s.scanSub}>point at the label for best results</div>
          </>
        )}

        {(phase === 'processing' || phase === 'confirm' || phase === 'error') && preview && (
          <img src={preview} style={s.previewImg} alt="scanned product" />
        )}
      </div>

      {phase === 'processing' && (
        <div style={s.processing}>
          <div style={s.spinner} />
          <span>{processingText}</span>
        </div>
      )}

      {(phase === 'confirm' || phase === 'error') && (
        <div style={s.confirmBox}>
          <div style={s.detectedLabel}>product name</div>

          {!isEditingName && (
            <div style={s.detectedName}>{detectedName || 'could not detect name'}</div>
          )}

          <input
            style={{
              ...s.input,
              display: isEditingName ? 'block' : 'none',
              borderColor: isEditingName ? 'var(--accent)66' : 'var(--border)',
            }}
            type="text"
            placeholder="type product name..."
            value={editName}
            onChange={e => setEditName(e.target.value)}
            autoFocus={isEditingName}
          />

          <div style={s.row2}>
            <div>
              <div style={s.fieldLabel}>price (Rs.)</div>
              <input
                style={s.input}
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
                style={s.input}
                type="number"
                placeholder="1"
                min="1"
                value={qty}
                onChange={e => setQty(e.target.value)}
              />
            </div>
          </div>

          <div style={s.btnRow}>
            <button
              style={s.btnSecondary}
              onClick={() => setIsEditingName(v => !v)}
            >
              {isEditingName ? '✓ confirm name' : '✎ edit name'}
            </button>
            <button style={s.btnPrimary} onClick={handleAdd}>
              + add to trolley
            </button>
          </div>

          <button
            style={{ ...s.btnSecondary, width: '100%', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}
            onClick={reset}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  )
}
