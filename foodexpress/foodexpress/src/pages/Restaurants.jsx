import { useState } from 'react'
import FoodCard from '../components/FoodCard.jsx'
import Icon from '../components/Icon.jsx'

export default function Restaurants({
  restaurants,
  search,
  setSearch,
  onNavigate,
  favorites,
  cart,
  onFavorite,
  onOpenFood,
  onQuantityChange,
}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const query = search.trim().toLowerCase()
  const matchingRestaurants = restaurants.filter((restaurant) =>
    `${restaurant.name} ${restaurant.category}`.toLowerCase().includes(query) ||
    restaurant.menu.some((dish) =>
      `${dish.name} ${dish.category}`.toLowerCase().includes(query),
    ),
  )
  const matchingMenu = selectedRestaurant?.menu.filter((dish) =>
    `${dish.name} ${dish.category} ${dish.restaurant}`.toLowerCase().includes(query),
  )
  const visibleMenu = query ? matchingMenu : selectedRestaurant?.menu

  return (
    <section className="page-section restaurants-page">
      <button
        className="restaurant-back-button restaurant-home-button"
        type="button"
        onClick={() => onNavigate('/')}
      >
        <span aria-hidden="true">←</span> Back to home
      </button>
      <div className="page-heading">
        <span className="section-kicker">Good food lives here</span>
        <h1>{selectedRestaurant ? selectedRestaurant.name : 'Restaurants near you'}</h1>
        <p>
          {selectedRestaurant
            ? 'Choose something delicious from the menu.'
            : 'Search for a restaurant or the food you’re craving.'}
        </p>
      </div>
      <label className="restaurant-search">
        <Icon name="search" size={18} />
        <input
          aria-label="Search restaurants or food"
          placeholder="Search restaurants or food..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {search && (
          <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>
            <Icon name="close" size={17} />
          </button>
        )}
      </label>
      {selectedRestaurant ? (
        <>
          <button
            className="restaurant-back-button"
            type="button"
            onClick={() => setSelectedRestaurant(null)}
          >
            <span aria-hidden="true">←</span> Back to restaurants
          </button>
          {visibleMenu.length ? (
            <div className="food-grid restaurant-food-grid">
              {visibleMenu.map((dish) => (
                <FoodCard
                  key={dish.id}
                  dish={dish}
                  favorite={favorites.includes(dish.id)}
                  quantity={cart[dish.id] || 0}
                  onFavorite={onFavorite}
                  onOpen={onOpenFood}
                  onQuantityChange={onQuantityChange}
                />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>🍜</span>
              <h3>No matching food found</h3>
              <p>Try a different food or restaurant search.</p>
            </div>
          )}
        </>
      ) : matchingRestaurants.length ? (
        <div className="restaurant-grid">
          {matchingRestaurants.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.name}>
              <button
                className="restaurant-select-card"
                type="button"
                onClick={() => setSelectedRestaurant(restaurant)}
                aria-label={`View ${restaurant.name} menu`}
              >
                <img src={restaurant.image} alt="" loading="lazy" />
                <div className="restaurant-card-body">
                  <div className="restaurant-card-title">
                    <div>
                      <h2>{restaurant.name}</h2>
                      <p>{restaurant.category} · Local favourite</p>
                    </div>
                    <span className="food-rating">★ {restaurant.rating.toFixed(1)}</span>
                  </div>
                  <div className="restaurant-card-meta">
                    <span><Icon name="clock" size={15} /> {restaurant.time}</span>
                    <span>Free delivery</span>
                  </div>
                  <span className="restaurant-card-link">View menu <Icon name="arrow" size={15} /></span>
                </div>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <span>🍽️</span>
          <h3>No restaurants or food found</h3>
          <p>Try another restaurant or dish name.</p>
        </div>
      )}
    </section>
  )
}
