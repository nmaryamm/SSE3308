import { useEffect, useState } from 'react'

const orderSteps = [
  { title: 'Order placed', detail: 'Your order is confirmed', emoji: '✓' },
  { title: 'Preparing your food', detail: 'The kitchen is cooking up something lovely', emoji: '🍳' },
  { title: 'On the way', detail: 'Your rider is bringing the good stuff', emoji: '🚴' },
  { title: 'Delivered', detail: 'Your food has arrived. Enjoy every bite!', emoji: '🏠' },
]

export default function Tracking({ items, orderTotal, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (currentStep === orderSteps.length - 1) return undefined

    const timer = window.setTimeout(() => {
      setCurrentStep((step) => Math.min(step + 1, orderSteps.length - 1))
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [currentStep])

  return (
    <section className="page-section tracking-page">
      <div className="tracking-banner">
        <span className="tracking-emoji">{currentStep === orderSteps.length - 1 ? '🎉' : '🛵'}</span>
        <div>
          <span className="section-kicker">A little yum is on its way</span>
          <h1>{currentStep === orderSteps.length - 1 ? 'Your order has arrived!' : 'Your order is confirmed!'}</h1>
          <p>
            {currentStep === orderSteps.length - 1
              ? 'Your delicious order is at your door. Let us know when it’s safely with you!'
              : 'Your order moves to the next stage every 5 seconds in this demo.'}
          </p>
        </div>
      </div>
      <div className="tracking-layout">
        <section className="tracking-card">
          <span className="section-kicker">Order progress</span>
          <h2>{currentStep === orderSteps.length - 1 ? 'Bon appétit!' : 'We’re on it!'}</h2>
          <div className="tracking-steps-scroll" role="region" aria-label="Order progress stages" tabIndex={0}>
            <div className="tracking-steps">
              {orderSteps.map((step, index) => (
                <div className={`tracking-step-group ${index === orderSteps.length - 1 ? 'is-last' : ''}`} key={step.title}>
                  <div
                    className={`tracking-step ${index < currentStep ? 'complete' : ''} ${index === currentStep ? 'current' : ''}`}
                    aria-current={index === currentStep ? 'step' : undefined}
                  >
                    <span>{index < currentStep ? '✓' : step.emoji}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <small>{index < currentStep ? 'Complete' : step.detail}</small>
                    </div>
                  </div>
                  {index < orderSteps.length - 1 && (
                    <div className={`tracking-connector ${index < currentStep ? 'complete' : ''}`}>
                      {index === currentStep && (
                        <span className="tracking-progress" key={currentStep} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {currentStep < orderSteps.length - 1 ? (
            <p className="tracking-waiting" aria-live="polite">
              <span className="tracking-waiting-dot" />
              Updating in 5 seconds
            </p>
          ) : (
            <button className="button-primary tracking-confirm" onClick={() => setShowCelebration(true)}>
              Yes, my food arrived safely!
            </button>
          )}
        </section>
        <section className="tracking-card tracking-order">
          <span className="section-kicker">Your delicious picks</span>
          <h2>Order details</h2>
          {items.map(({ dish, quantity }) => (
            <div className="tracking-item" key={dish.id}>
              <img src={dish.image} alt="" />
              <div><strong>{dish.name}</strong><small>Qty {quantity}</small></div>
              <span>RM {(dish.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="tracking-total"><span>Order total</span><strong>RM {orderTotal.toFixed(2)}</strong></div>
          <button className="button-primary" onClick={() => onNavigate('/')}>Order something else</button>
        </section>
      </div>
      {showCelebration && (
        <div className="delivery-modal-backdrop">
          <section
            className="delivery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-modal-title"
          >
            <span className="delivery-modal-emoji" aria-hidden="true">🎉</span>
            <span className="section-kicker">Safely delivered</span>
            <h2 id="delivery-modal-title">Yeayyy, let’s eat!</h2>
            <p>Your food made it to you safely. Enjoy every delicious bite!</p>
            <button className="button-primary" onClick={() => onNavigate('/')}>Let’s eat!</button>
          </section>
        </div>
      )}
    </section>
  )
}
