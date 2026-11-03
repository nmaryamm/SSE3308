import FoodCard from '../components/FoodCard.jsx'
import Icon from '../components/Icon.jsx'

export default function FoodDetails({
  dish,
  relatedDishes,
  cart,
  favorites,
  onBack,
  onFavorite,
  onOpenFood,
  onQuantityChange,
}) {
  if (!dish) {
    return (
      <section className="page-section empty-results">
        <span>🍜</span><h3>That dish isn’t on the menu</h3>
        <p>Let’s find something else you’ll love.</p>
        <button className="button-primary" onClick={onBack}>Back to the menu</button>
      </section>
    )
  }

  return (
    <section className="page-section food-details-page">
      <button className="back-link detail-back-button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to menu
      </button>
      <div className="detail-layout">
        <img className="detail-image" src={dish.image} alt={dish.name} />
        <div className="detail-copy">
          <span className="section-kicker">{dish.category} · {dish.restaurant}</span>
          <h1>{dish.name}</h1>
          <div className="detail-meta"><span>★ {dish.rating}</span><span><Icon name="clock" size={15} /> {dish.time}</span><span>Free delivery</span></div>
          <p>{dish.description}</p>
          <strong className="detail-price">RM {dish.price.toFixed(2)}</strong>
          <div className="detail-actions">
            <button className={`favorite-button detail-favorite ${favorites.includes(dish.id) ? 'is-favorite' : ''}`} onClick={() => onFavorite(dish.id)} aria-label="Toggle favorite">
              <Icon name="heart" size={18} />
            </button>
            <div className="quantity-control">
              <button onClick={() => onQuantityChange(dish.id, -1)} aria-label="Remove one">−</button>
              <span>{cart[dish.id] || 0}</span>
              <button onClick={() => onQuantityChange(dish.id, 1)} aria-label="Add one">+</button>
            </div>
            <button className="checkout-button detail-add" onClick={() => onQuantityChange(dish.id, 1)}>Add to cart <Icon name="bag" size={17} /></button>
          </div>
        </div>
      </div>
      {relatedDishes.length > 0 && (
        <div className="related-section">
          <div className="section-heading"><div><span className="section-kicker">A few more delicious ideas</span><h2>You might also like</h2></div></div>
          <div className="food-grid related-grid">
            {relatedDishes.map((item) => (
              <FoodCard
                key={item.id}
                dish={item}
                favorite={favorites.includes(item.id)}
                quantity={cart[item.id] || 0}
                onFavorite={onFavorite}
                onOpen={onOpenFood}
                onQuantityChange={onQuantityChange}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
