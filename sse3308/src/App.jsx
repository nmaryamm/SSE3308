import { useMemo, useState } from 'react'
import './App.css'

const categories = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Malay', emoji: '🍛' },
  { name: 'Chinese', emoji: '🥡' },
  { name: 'Western', emoji: '🍔' },
  { name: 'Japanese', emoji: '🍣' },
  { name: 'Korean', emoji: '🍜' },
  { name: 'Drinks', emoji: '🧋' },
  { name: 'Desserts', emoji: '🍰' },
]

const dishes = [
  {
    id: 1,
    name: 'Nasi Lemak Ayam Goreng',
    restaurant: 'Warung Senja',
    category: 'Malay',
    price: 9.9,
    rating: '4.9',
    time: '25–35 min',
    label: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Cheesy Chicken Burger',
    restaurant: 'Burger Society',
    category: 'Western',
    price: 12.9,
    rating: '4.8',
    time: '20–30 min',
    label: 'Fan favourite',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Mee Goreng Mamak',
    restaurant: 'Mamak Corner',
    category: 'Malay',
    price: 8.5,
    rating: '4.8',
    time: '20–30 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Bubble Milk Tea',
    restaurant: 'Boba & Co.',
    category: 'Drinks',
    price: 6.9,
    rating: '4.7',
    time: '15–25 min',
    label: 'Cool pick',
    image:
      'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Salmon Sushi Set',
    restaurant: 'Sushi Zanmai',
    category: 'Japanese',
    price: 18.9,
    rating: '4.9',
    time: '25–35 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Korean Crispy Chicken',
    restaurant: 'Seoul Kitchen',
    category: 'Korean',
    price: 16.5,
    rating: '4.8',
    time: '30–40 min',
    label: 'So crispy',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 7,
    name: 'Wok Hei Fried Rice',
    restaurant: 'Little Wok',
    category: 'Chinese',
    price: 10.5,
    rating: '4.7',
    time: '20–30 min',
    label: '',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 8,
    name: 'Strawberry Cheesecake',
    restaurant: 'Butter & Crumb',
    category: 'Desserts',
    price: 9.5,
    rating: '4.9',
    time: '20–30 min',
    label: 'Sweet treat',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85',
  },
]

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'search')
    return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
  if (name === 'pin')
    return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  if (name === 'heart')
    return <svg {...common}><path d="M20.8 8.8c0 4.5-8.8 10-8.8 10s-8.8-5.5-8.8-10a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z" /></svg>
  if (name === 'bag')
    return <svg {...common}><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
  if (name === 'clock')
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  if (name === 'arrow')
    return <svg {...common}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
  if (name === 'close')
    return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>
  return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>
}

function App() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const filteredDishes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return dishes.filter((dish) => {
      const matchesCategory = category === 'All' || dish.category === category
      const matchesFavorites = !favoritesOnly || favorites.includes(dish.id)
      const matchesSearch =
        !query ||
        `${dish.name} ${dish.restaurant} ${dish.category}`.toLowerCase().includes(query)
      return matchesCategory && matchesFavorites && matchesSearch
    })
  }, [category, favorites, favoritesOnly, search])

  const cartItems = dishes.filter((dish) => cart[dish.id])
  const cartCount = cartItems.reduce((total, dish) => total + cart[dish.id], 0)
  const subtotal = cartItems.reduce((total, dish) => total + dish.price * cart[dish.id], 0)

  function updateQuantity(id, change) {
    setCart((current) => {
      const nextQuantity = (current[id] || 0) + change
      const next = { ...current }
      if (nextQuantity <= 0) delete next[id]
      else next[id] = nextQuantity
      return next
    })
    setOrderPlaced(false)
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function scrollToMenu() {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="MeyYum home">
          <span className="brand-mark">m!</span>
          <span>Mey<span>Yum</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#">Home</a>
          <button className="nav-link" onClick={scrollToMenu}>Restaurants</button>
          <button className="nav-link" onClick={scrollToMenu}>Categories</button>
          <a className="nav-link" href="#deal">Deals</a>
        </nav>
        <label className="header-search">
          <Icon name="search" size={17} />
          <input
            aria-label="Search food or restaurants"
            placeholder="Search food, restaurants..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <kbd>/</kbd>
        </label>
        <button className="location-button" aria-label="Delivery location">
          <Icon name="pin" size={17} />
          <span>UPM</span>
          <span className="location-chevron">⌄</span>
        </button>
        <button
          className={`icon-button favorites-shortcut ${favoritesOnly ? 'is-active' : ''}`}
          aria-label={favoritesOnly ? 'Show all food' : `Show favorites, ${favorites.length} saved`}
          aria-pressed={favoritesOnly}
          onClick={() => { setFavoritesOnly((current) => !current); scrollToMenu() }}
        >
          <Icon name="heart" size={20} />
          {favorites.length > 0 && <span className="mini-count">{favorites.length}</span>}
        </button>
        <button
          className="icon-button cart-shortcut"
          aria-label={`Open cart, ${cartCount} items`}
          onClick={() => setCartOpen(true)}
        >
          <Icon name="bag" size={20} />
          {cartCount > 0 && <span className="mini-count">{cartCount}</span>}
        </button>
        <button className="profile-button" aria-label="Your profile"><Icon name="user" size={19} /></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-star">✳</span> A little joy, delivered</div>
            <h1>Good food brings<br />good people <span>together.</span></h1>
            <p className="hero-description">Crave something lovely? Your next favourite meal is just a few taps away.</p>
            <div className="hero-search-row">
              <button className="hero-location"><Icon name="pin" size={17} /><span>UPM, Serdang</span><span className="location-chevron">⌄</span></button>
              <label className="hero-search">
                <Icon name="search" size={18} />
                <input
                  aria-label="Find a dish or restaurant"
                  placeholder="What are you craving?"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button type="button" aria-label="Show search results" onClick={scrollToMenu}><Icon name="arrow" size={18} /></button>
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

        <section className="categories-section" aria-label="Browse food categories">
          <div className="section-heading category-heading">
            <div>
              <span className="section-kicker">Find your kind of yum</span>
              <h2>What sounds good?</h2>
            </div>
            <button className="text-link" onClick={() => setCategory('All')}>See all <Icon name="arrow" size={16} /></button>
          </div>
          <div className="category-list">
            {categories.map((item) => (
              <button
                className={`category-item ${category === item.name ? 'selected' : ''}`}
                key={item.name}
                onClick={() => setCategory(item.name)}
                aria-pressed={category === item.name}
              >
                <span className="category-emoji">{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading menu-heading">
            <div>
              <span className="section-kicker">{favoritesOnly ? 'Your little collection' : 'Picked for your happy tummy'}</span>
              <h2>{favoritesOnly ? 'Your saved favourites' : category === 'All' ? 'Popular near you' : `${category} favourites`}</h2>
            </div>
            <button className="text-link desktop-link" onClick={() => setCategory('All')}>View full menu <Icon name="arrow" size={16} /></button>
          </div>
          {filteredDishes.length ? (
            <div className="food-grid">
              {filteredDishes.map((dish) => (
                <article className="food-card" key={dish.id}>
                  <div className="food-image-wrap">
                    <img className="food-image" src={dish.image} alt={dish.name} loading="lazy" />
                    {dish.label && <span className="food-label">{dish.label}</span>}
                    <button
                      className={`favorite-button ${favorites.includes(dish.id) ? 'is-favorite' : ''}`}
                      onClick={() => toggleFavorite(dish.id)}
                      aria-label={favorites.includes(dish.id) ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
                      aria-pressed={favorites.includes(dish.id)}
                    >
                      <Icon name="heart" size={18} />
                    </button>
                    <span className="image-time"><Icon name="clock" size={13} /> {dish.time}</span>
                  </div>
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
                      {cart[dish.id] ? (
                        <div className="quantity-control" aria-label={`Quantity of ${dish.name}`}>
                          <button onClick={() => updateQuantity(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button>
                          <span>{cart[dish.id]}</span>
                          <button onClick={() => updateQuantity(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button>
                        </div>
                      ) : (
                        <button className="add-button" onClick={() => updateQuantity(dish.id, 1)} aria-label={`Add ${dish.name} to cart`}>+</button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>🍜</span>
              <h3>No bites found just yet</h3>
              <p>Try another dish, restaurant, or category.</p>
              <button className="button-primary" onClick={() => { setSearch(''); setCategory('All') }}>Show me everything</button>
            </div>
          )}
        </section>

        <section className="deal-banner" id="deal">
          <div className="deal-art" aria-hidden="true"><span>✳</span><span>♡</span><span>✿</span></div>
          <div className="deal-copy">
            <span className="deal-kicker">A little treat from us</span>
            <h2>First order? Make it extra yummy.</h2>
            <p>Enjoy free delivery on your first MeyYum order. Good food, good mood.</p>
          </div>
          <div className="deal-action">
            <span>Use code <strong>MEYYUM</strong></span>
            <button onClick={scrollToMenu}>Find my feast <Icon name="arrow" size={17} /></button>
          </div>
          <span className="deal-spark">✦</span>
        </section>

        <footer className="footer">
          <a className="brand footer-brand" href="#"><span className="brand-mark">m!</span><span>Mey<span>Yum</span></span></a>
          <p>Good food. Good people. Good mood.</p>
          <span className="footer-love">Made with <span>♥</span> for food lovers</span>
        </footer>
      </main>

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" aria-label="Your cart" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div><span className="section-kicker">The good stuff</span><h2>Your cart <span>({cartCount})</span></h2></div>
              <button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><Icon name="close" /></button>
            </div>
            {orderPlaced ? (
              <div className="order-success">
                <span className="success-emoji">🎉</span>
                <h3>Order placed!</h3>
                <p>Your delicious picks are being prepared. Sit tight, good things are on their way.</p>
                <button className="button-primary" onClick={() => { setOrderPlaced(false); setCartOpen(false) }}>Lovely, thanks!</button>
              </div>
            ) : cartItems.length ? (
              <>
                <div className="cart-list">
                  {cartItems.map((dish) => (
                    <div className="cart-item" key={dish.id}>
                      <img src={dish.image} alt="" />
                      <div className="cart-item-info">
                        <h3>{dish.name}</h3>
                        <p>{dish.restaurant}</p>
                        <strong>RM {(dish.price * cart[dish.id]).toFixed(2)}</strong>
                      </div>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button>
                        <span>{cart[dish.id]}</span>
                        <button onClick={() => updateQuantity(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="delivery-note"><span>🚴</span><div><strong>Free delivery, just for you!</strong><small>Your first order delivery is on us.</small></div></div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>RM {subtotal.toFixed(2)}</strong></div>
                  <div><span>Delivery</span><strong className="free-delivery">FREE</strong></div>
                  <div className="summary-total"><span>Total</span><strong>RM {subtotal.toFixed(2)}</strong></div>
                </div>
                <button className="checkout-button" onClick={() => { setOrderPlaced(true); setCart({}) }}>Place my order <Icon name="arrow" size={18} /></button>
                <p className="checkout-footnote">A little yum is on its way ✨</p>
              </>
            ) : (
              <div className="empty-cart">
                <span className="empty-cart-emoji">🧺</span>
                <h3>Your cart is feeling lonely</h3>
                <p>Find something delicious and give it a home.</p>
                <button className="button-primary" onClick={() => { setCartOpen(false); scrollToMenu() }}>Explore the menu</button>
              </div>
            )}
          </aside>
        </div>
      )}
      <button className="mobile-cart" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
        <Icon name="bag" size={19} /><span>Your cart</span><strong>{cartCount}</strong>
      </button>
    </div>
  )
}

export default App
