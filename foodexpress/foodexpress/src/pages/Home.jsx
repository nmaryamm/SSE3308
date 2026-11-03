import { useState } from 'react'
import CategoryList from '../components/CategoryList.jsx'
import FoodCard from '../components/FoodCard.jsx'
import FoodFilters from '../components/FoodFilters.jsx'
import Icon from '../components/Icon.jsx'

const emptyFilters = {
  prices: [],
  rating: '',
  deliveryTime: '',
  specialOffers: false,
}

export default function Home({
  categories,
  category,
  dishes,
  favorites,
  favoritesOnly,
  cart,
  search,
  deliveryLocation,
  setSearch,
  setCategory,
  onShowAllFood,
  onFavorite,
  onOpenFood,
  onQuantityChange,
  onNavigate,
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const activeFilterCount =
    appliedFilters.prices.length +
    Number(Boolean(appliedFilters.rating)) +
    Number(Boolean(appliedFilters.deliveryTime)) +
    Number(appliedFilters.specialOffers)

  const query = search.trim().toLowerCase()
  const visibleDishes = dishes.filter((dish) => {
    const matchesCategory = category === 'All' || dish.category === category
    const matchesFavorites = !favoritesOnly || favorites.includes(dish.id)
    const matchesSearch =
      !query ||
      `${dish.name} ${dish.restaurant} ${dish.category}`.toLowerCase().includes(query)
    const price = dish.price
    const matchesPrice =
      !appliedFilters.prices.length ||
      appliedFilters.prices.some((range) => {
        if (range === 'under-10') return price < 10
        if (range === '10-15') return price >= 10 && price <= 15
        return price > 15
      })
    const matchesRating =
      !appliedFilters.rating || Number(dish.rating) >= Number(appliedFilters.rating)
    const maxDeliveryTime = Number(dish.time.match(/\d+/g)?.at(-1) ?? Infinity)
    const matchesDeliveryTime =
      !appliedFilters.deliveryTime ||
      maxDeliveryTime <= Number(appliedFilters.deliveryTime)
    const matchesSpecialOffer = !appliedFilters.specialOffers || dish.specialOffer
    return (
      matchesCategory &&
      matchesFavorites &&
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesDeliveryTime &&
      matchesSpecialOffer
    )
  })

  function openFilters() {
    setDraftFilters({
      prices: [...appliedFilters.prices],
      rating: appliedFilters.rating,
      deliveryTime: appliedFilters.deliveryTime,
      specialOffers: appliedFilters.specialOffers,
    })
    setFilterOpen(true)
  }

  function closeFilters() {
    setFilterOpen(false)
    setDraftFilters({
      prices: [...appliedFilters.prices],
      rating: appliedFilters.rating,
      deliveryTime: appliedFilters.deliveryTime,
      specialOffers: appliedFilters.specialOffers,
    })
  }

  function applyFilters() {
    setAppliedFilters({
      prices: [...draftFilters.prices],
      rating: draftFilters.rating,
      deliveryTime: draftFilters.deliveryTime,
      specialOffers: draftFilters.specialOffers,
    })
    setFilterOpen(false)
  }

  function resetDraftFilters() {
    setDraftFilters({
      prices: [],
      rating: '',
      deliveryTime: '',
      specialOffers: false,
    })
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-star">✦</span> A little joy, delivered</div>
          <h1>Good food brings<br />good people <span>together.</span></h1>
          <p className="hero-description">Crave something lovely? Your next favourite meal is just a few taps away.</p>
          <div className="hero-search-row">
            <button className="hero-location" type="button" onClick={() => onNavigate('/location')} aria-label={`Change delivery location, currently ${deliveryLocation}`}>
              <Icon name="pin" size={17} />
              <span>{deliveryLocation}</span>
              <span className="location-chevron">⌄</span>
            </button>
            <label className="hero-search">
              <Icon name="search" size={18} />
              <input
                aria-label="Search for food or a restaurant"
                placeholder="Search food or restaurants..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="button" aria-label="Show search results" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="arrow" size={18} /></button>
            </label>
          </div>
          <div className="hero-note"><span>✦</span> Free delivery on your first order</div>
        </div>
        <div className="hero-art">
          <div className="hero-sun" />
          <div className="hero-sticker sticker-top">made<br />with love <span>♥</span></div>
          <img
            className="hero-food"
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=90"
            alt="A colourful bowl of fresh, delicious food"
          />
          <div className="hero-rating"><span>★</span><strong>4.9</strong><small>from happy eaters</small></div>
          <div className="hero-sticker sticker-bottom">yum<br />yum! <span>☺</span></div>
          <span className="floating-spark spark-one">✦</span>
          <span className="floating-spark spark-two">✳</span>
        </div>
        <div className="hero-blob blob-left" />
        <div className="hero-blob blob-right" />
      </section>

      <section className="categories-section" id="categories" aria-label="Browse food categories">
        <div className="section-heading category-heading">
          <div>
            <span className="section-kicker">Find your kind of yum</span>
            <h2>What sounds good?</h2>
          </div>
          <button className="text-link see-all-button" onClick={() => onNavigate('/restaurants')}>See all <Icon name="arrow" size={16} /></button>
        </div>
        <CategoryList categories={categories} selected={category} onSelect={setCategory} />
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading menu-heading">
          <div>
            <span className="section-kicker">
              {favoritesOnly ? 'Your little collection' : 'Browse every restaurant menu'}
            </span>
            <h2>
              {favoritesOnly
                ? 'Your saved favourites'
                : category === 'All'
                  ? 'All food'
                  : `${category} food`}
            </h2>
          </div>
          <div className="menu-actions">
            {activeFilterCount > 0 && <span className="active-filter-count">{activeFilterCount} applied</span>}
            <button
              className={`filter-toggle ${activeFilterCount ? 'has-filters' : ''}`}
              type="button"
              aria-expanded={filterOpen}
              aria-controls="food-filters"
              onClick={() => filterOpen ? closeFilters() : openFilters()}
            >
              <span aria-hidden="true">☷</span> Filter
              {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
        {filterOpen && (
          <div id="food-filters">
            <FoodFilters
              draft={draftFilters}
              onChange={setDraftFilters}
              onApply={applyFilters}
              onClose={closeFilters}
              onReset={resetDraftFilters}
            />
          </div>
        )}
        {visibleDishes.length ? (
          <div className="food-grid">
            {visibleDishes.map((dish) => (
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
            <h3>No food found</h3>
            <p>Try another food, restaurant, or category.</p>
            <button className="button-primary" onClick={onShowAllFood}>Show all food</button>
          </div>
        )}
      </section>

    </>
  )
}
