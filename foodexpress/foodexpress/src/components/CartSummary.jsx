import { useEffect, useRef, useState } from 'react'

const vouchers = [
  { code: 'MEYYUM', title: 'Free delivery', description: 'Your delivery fee is on us.' },
  { code: 'YUMMY15', title: '15% off', description: 'Save 15% on your food subtotal.' },
  { code: 'GOODFOOD5', title: 'RM 5 off', description: 'Save RM 5 when you spend RM 25.' },
]

export default function CartSummary({ subtotal, onCheckout }) {
  const [voucherCode, setVoucherCode] = useState('')
  const [appliedCode, setAppliedCode] = useState('')
  const [voucherMessage, setVoucherMessage] = useState('')
  const [voucherError, setVoucherError] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const subtotalRef = useRef(subtotal)

  useEffect(() => {
    subtotalRef.current = subtotal
  }, [subtotal])

  const appliedVoucher = vouchers.find((voucher) => voucher.code === appliedCode)
  const discount =
    appliedCode === 'YUMMY15'
      ? Number((subtotal * 0.15).toFixed(2))
      : appliedCode === 'GOODFOOD5' && subtotal >= 25
        ? 5
        : 0
  const total = Math.max(0, subtotal - discount)

  async function applyVoucher(event) {
    event.preventDefault()
    const code = voucherCode.trim().toUpperCase()
    const voucher = vouchers.find((item) => item.code === code)
    setVoucherMessage('')
    setVoucherError('')

    if (!voucher) {
      setVoucherError('That code didn’t work. Check it and try again.')
      return
    }
    if (code === 'GOODFOOD5' && subtotal < 25) {
      setVoucherError('Add RM 25 of food to use this voucher.')
      return
    }

    setIsApplying(true)
    await new Promise((resolve) => window.setTimeout(resolve, 2000))

    if (code === 'GOODFOOD5' && subtotalRef.current < 25) {
      setVoucherError('Your cart is below RM 25, so this voucher could not be applied.')
      setIsApplying(false)
      return
    }

    setAppliedCode(code)
    setVoucherCode(code)
    setVoucherMessage(`${voucher.title} voucher applied!`)
    setIsApplying(false)
  }

  function removeVoucher() {
    setAppliedCode('')
    setVoucherCode('')
    setVoucherMessage('')
    setVoucherError('')
  }

  return (
    <section className="cart-summary-card">
      <span className="section-kicker">Your delicious order</span>
      <h2>Order summary</h2>
      <section className="voucher-box" aria-labelledby="voucher-title">
        <div className="voucher-heading">
          <strong id="voucher-title">Got a voucher?</strong>
          {appliedVoucher && (
            <button className="voucher-remove" type="button" onClick={removeVoucher} disabled={isApplying}>
              Remove
            </button>
          )}
        </div>
        <form className="voucher-entry" onSubmit={applyVoucher}>
          <label className="visually-hidden" htmlFor="voucher-code">Voucher code</label>
          <input
            id="voucher-code"
            type="text"
            autoComplete="off"
            placeholder="Enter voucher code"
            value={voucherCode}
            onChange={(event) => setVoucherCode(event.target.value)}
            disabled={isApplying}
          />
          <button type="submit" disabled={isApplying || !voucherCode.trim()}>
            {isApplying ? <span className="loading loading-dots loading-md" aria-label="Applying voucher" /> : 'Apply'}
          </button>
        </form>
        <div className="voucher-options" aria-label="Available vouchers">
          {vouchers.map((voucher) => (
            <button
              className={voucherCode === voucher.code ? 'selected' : ''}
              key={voucher.code}
              type="button"
              onClick={() => {
                setVoucherCode(voucher.code)
                setVoucherError('')
                setVoucherMessage('')
              }}
              disabled={isApplying}
              aria-pressed={voucherCode === voucher.code}
            >
              <strong>{voucher.code}</strong>
              <span>{voucher.description}</span>
            </button>
          ))}
        </div>
        {voucherError && <p className="voucher-message voucher-error" role="alert">{voucherError}</p>}
        {voucherMessage && <p className="voucher-message voucher-success" role="status">{voucherMessage}</p>}
      </section>
      <div className="summary-lines">
        <div><span>Subtotal</span><strong>RM {subtotal.toFixed(2)}</strong></div>
        {appliedVoucher && discount > 0 && (
          <div className="voucher-discount">
            <span>{appliedCode} discount</span><strong>− RM {discount.toFixed(2)}</strong>
          </div>
        )}
        <div><span>Delivery</span><strong className="free-delivery">FREE</strong></div>
        <div className="summary-total"><span>Total</span><strong>RM {total.toFixed(2)}</strong></div>
      </div>
      <button className="checkout-button" onClick={() => onCheckout(total)} disabled={isApplying}>
        Place my order <span aria-hidden="true">→</span>
      </button>
      <p className="checkout-footnote">A little yum is on its way ✨</p>
    </section>
  )
}
