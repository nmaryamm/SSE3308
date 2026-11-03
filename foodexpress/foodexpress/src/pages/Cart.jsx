import CartSummary from '../components/CartSummary.jsx'
import Icon from '../components/Icon.jsx'

export default function Cart({ items, subtotal, onNavigate, onQuantityChange, onCheckout }) {
  return (
    <section className="page-section cart-page">
      <div className="page-heading">
        <span className="section-kicker">The good stuff</span>
        <h1>Your cart</h1>
        <p>A few lovely choices. Let’s make it a meal.</p>
      </div>
      {items.length ? (
        <div className="cart-page-layout">
          <div className="cart-page-items">
            <div className="delivery-note"><span>🚴</span><div><strong>Free delivery, just for you!</strong><small>Your first order delivery is on us.</small></div></div>
            {items.map(({ dish, quantity }) => (
              <article className="cart-page-item" key={dish.id}>
                <img src={dish.image} alt="" />
                <div className="cart-item-info">
                  <h3>{dish.name}</h3>
                  <p>{dish.restaurant}</p>
                  <strong>RM {(dish.price * quantity).toFixed(2)}</strong>
                </div>
                <div className="quantity-control" aria-label={`Quantity of ${dish.name}`}>
                  <button onClick={() => onQuantityChange(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => onQuantityChange(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button>
                </div>
              </article>
            ))}
            <button className="back-link cart-keep-exploring" onClick={() => onNavigate('/')}>
              <Icon name="arrow" size={17} /> Keep exploring the menu
            </button>
          </div>
          <CartSummary subtotal={subtotal} onCheckout={onCheckout} />
        </div>
      ) : (
        <div className="empty-results">
          <span>🧺</span><h3>Your cart is feeling lonely</h3>
          <p>Find something delicious and give it a home.</p>
          <button className="button-primary" onClick={() => onNavigate('/')}>Explore the menu <Icon name="arrow" size={16} /></button>
        </div>
      )}
    </section>
  )
}
