import Icon from './Icon.jsx'

export default function FoodCard({
  dish,
  favorite,
  onFavorite,
  onOpen,
  onQuantityChange,
  quantity = 0,
}) {
  return (
    <article className="food-card">
      <button className="food-card-open" onClick={() => onOpen(dish.id)} aria-label={`View ${dish.name}`}>
        <span className="food-image-wrap">
          <img className="food-image" src={dish.image} alt={dish.name} loading="lazy" />
          {dish.label && <span className="food-label">{dish.label}</span>}
          <span className="image-time"><Icon name="clock" size={13} /> {dish.time}</span>
        </span>
      </button>
      <button
        className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
        onClick={() => onFavorite(dish.id)}
        aria-label={favorite ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
        aria-pressed={favorite}
      >
        <Icon name="heart" size={18} />
      </button>
      <div className="food-info">
        <div className="food-title-row">
          <div>
            <h3>{dish.name}</h3>
            <p className="restaurant-name">{dish.restaurant} <span>·</span> {dish.category}</p>
          </div>
          <span className="food-rating">★ {dish.rating}</span>
        </div>
        <div className="food-bottom">
          <strong className="food-price">RM {dish.price.toFixed(2)}</strong>
          {quantity ? (
            <div className="quantity-control" aria-label={`Quantity of ${dish.name}`}>
              <button onClick={() => onQuantityChange(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button>
              <span>{quantity}</span>
              <button onClick={() => onQuantityChange(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button>
            </div>
          ) : (
            <button className="add-button" onClick={() => onQuantityChange(dish.id, 1)} aria-label={`Add ${dish.name} to cart`}>+</button>
          )}
        </div>
      </div>
    </article>
  )
}
