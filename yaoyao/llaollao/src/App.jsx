import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  UserRound,
  X,
} from 'lucide-react'
import './App.css'

const restaurants = [
  {
    id: 'olive-and-ember',
    name: 'Olive & Ember',
    cuisine: 'Mediterranean',
    rating: '4.9',
    time: '20–30 min',
    fee: '$1.99 delivery',
    tag: 'Local favorite',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85',
    description: 'Bright Mediterranean plates, slow-roasted meats, and market-fresh sides.',
    dishes: ['Herb chicken bowl', 'Roasted aubergine', 'Crispy halloumi pita'],
  },
  {
    id: 'little-saffron',
    name: 'Little Saffron',
    cuisine: 'Indian',
    rating: '4.8',
    time: '25–35 min',
    fee: '$0 delivery',
    tag: 'Free delivery',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=85',
    description: 'Comforting North Indian recipes with a little extra warmth.',
    dishes: ['Butter chicken', 'Paneer tikka masala', 'Garlic naan'],
  },
  {
    id: 'noodle-house',
    name: 'The Noodle House',
    cuisine: 'Asian',
    rating: '4.7',
    time: '15–25 min',
    fee: '$2.49 delivery',
    tag: 'Quick delivery',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=85',
    description: 'Hand-pulled noodles, rich broths, and plenty of chili crisp.',
    dishes: ['Tonkotsu ramen', 'Chili oil noodles', 'Pork gyoza'],
  },
  {
    id: 'sunday-table',
    name: 'Sunday Table',
    cuisine: 'Italian',
    rating: '4.9',
    time: '30–40 min',
    fee: '$1.49 delivery',
    tag: 'Top rated',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85',
    description: 'Handmade pasta and the sort of sauce you want to mop up.',
    dishes: ['Pappardelle ragu', 'Burrata pomodoro', 'Lemon ricotta cake'],
  },
]

const menuItems = [
  { id: 'chicken-bowl', name: 'Herb chicken bowl', restaurant: 'Olive & Ember', price: 14.5, category: 'Mediterranean', description: 'Charred lemon chicken, herby rice, cucumber, whipped feta.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80', badge: 'Bestseller' },
  { id: 'halloumi-pita', name: 'Crispy halloumi pita', restaurant: 'Olive & Ember', price: 12, category: 'Mediterranean', description: 'Golden halloumi, tomato, greens, and tahini yogurt.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=700&q=80' },
  { id: 'butter-chicken', name: 'Butter chicken', restaurant: 'Little Saffron', price: 16, category: 'Indian', description: 'Tandoor chicken in a silky tomato and fenugreek sauce.', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80', badge: 'Guest favorite' },
  { id: 'paneer', name: 'Paneer tikka masala', restaurant: 'Little Saffron', price: 14, category: 'Indian', description: 'Smoky paneer, spiced tomato gravy, basmati rice.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80' },
  { id: 'ramen', name: 'Tonkotsu ramen', restaurant: 'The Noodle House', price: 17, category: 'Asian', description: 'Slow-simmered pork broth, jammy egg, spring onion.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80', badge: 'Bestseller' },
  { id: 'pasta', name: 'Pappardelle ragu', restaurant: 'Sunday Table', price: 19, category: 'Italian', description: 'Wide ribbons of pasta with a slow-cooked beef ragu.', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80' },
]

const categories = [
  { name: 'All', icon: '✳', tone: 'rose' },
  { name: 'Mediterranean', icon: '◉', tone: 'olive' },
  { name: 'Indian', icon: '✺', tone: 'gold' },
  { name: 'Asian', icon: '⌘', tone: 'sage' },
  { name: 'Italian', icon: '❋', tone: 'pink' },
]

const navItems = [
  { id: 'discover', label: 'Discover' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'tracking', label: 'Track order' },
]

function App() {
  const [page, setPage] = useState('discover')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('Recommended')
  const [cart, setCart] = useState({})
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderStep, setOrderStep] = useState(0)
  const [accountMode, setAccountMode] = useState('Sign in')
  const [saved, setSaved] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [maxTime, setMaxTime] = useState('Any time')

  const cartItems = useMemo(
    () => menuItems.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] })),
    [cart],
  )
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredItems = useMemo(() => {
    let items = menuItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesQuery = `${item.name} ${item.restaurant} ${item.category}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
    if (sortBy === 'Price: low to high') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'Top rated') {
      items = [...items].sort((a, b) => {
        const ratingA = Number(restaurants.find((place) => place.name === a.restaurant)?.rating || 0)
        const ratingB = Number(restaurants.find((place) => place.name === b.restaurant)?.rating || 0)
        return ratingB - ratingA
      })
    }
    return items
  }, [category, query, sortBy])

  const filteredRestaurants = useMemo(() => {
    let places = restaurants.filter((restaurant) => {
      const dishNames = menuItems.filter((item) => item.restaurant === restaurant.name).map((item) => item.name).join(' ')
      const matchesQuery = `${restaurant.name} ${restaurant.cuisine} ${dishNames}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || restaurant.cuisine === category
      const matchesTime = maxTime === 'Any time' || (maxTime === 'Under 30 min' && !restaurant.time.includes('30–40'))
      return matchesQuery && matchesCategory && matchesTime
    })
    if (sortBy === 'Top rated') places = [...places].sort((a, b) => Number(b.rating) - Number(a.rating))
    if (sortBy === 'Price: low to high') {
      places = [...places].sort((a, b) => {
        const startingPrice = (restaurant) => Math.min(...menuItems.filter((item) => item.restaurant === restaurant.name).map((item) => item.price))
        return startingPrice(a) - startingPrice(b)
      })
    }
    return places
  }, [category, maxTime, query, sortBy])

  useEffect(() => {
    if (!orderPlaced) return undefined
    const timer = window.setInterval(() => setOrderStep((step) => Math.min(step + 1, 3)), 9000)
    return () => window.clearInterval(timer)
  }, [orderPlaced])

  function updateCart(itemId, change) {
    setCart((current) => {
      const quantity = (current[itemId] || 0) + change
      const next = { ...current }
      if (quantity <= 0) delete next[itemId]
      else next[itemId] = quantity
      return next
    })
  }

  function placeOrder(event) {
    event.preventDefault()
    setCheckoutOpen(false)
    setOrderPlaced(true)
    setOrderStep(0)
    setPage('tracking')
    setCart({})
  }

  const isRestaurantPage = Boolean(selectedRestaurant)

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#discover" onClick={() => { setPage('discover'); setSelectedRestaurant(null) }} aria-label="Table & Thyme home">
          <span className="brand-mark">t<span>.</span></span>
          <span className="brand-name">table<span>&</span>thyme</span>
        </a>
        <div className="delivery-address"><MapPin size={15} strokeWidth={2.2} /><span><small>Delivering to</small><strong>Brooklyn, NY</strong></span><ChevronDown size={14} /></div>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={page === item.id && !isRestaurantPage ? 'nav-link active' : 'nav-link'} onClick={() => { setPage(item.id); setSelectedRestaurant(null) }}>{item.label}</button>)}
        </nav>
        <div className="top-actions">
          <button className="icon-button account-action" aria-label="Your account" title="Your account" onClick={() => { setPage('account'); setSelectedRestaurant(null) }}><UserRound size={19} /></button>
          <button className="cart-button" onClick={() => { setPage('cart'); setSelectedRestaurant(null) }} aria-label={`Cart, ${itemCount} items`}><ShoppingBag size={18} /><span className="cart-label">Your bag</span><span className="cart-count">{itemCount}</span></button>
        </div>
      </header>

      <main>
        {isRestaurantPage ? (
          <RestaurantPage restaurant={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} onAdd={updateCart} cart={cart} />
        ) : page === 'discover' ? (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <div className="eyebrow"><span /> GOOD FOOD, CLOSE TO HOME</div>
                <h1>Your table,<br /><em>wherever</em> you are.</h1>
                <p>Thoughtful neighborhood kitchens, delivered with a little more care.</p>
                <div className="hero-search">
                  <Search size={18} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Dishes, restaurants, cravings..." aria-label="Search dishes and restaurants" />
                  {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
                  <button className="search-submit" onClick={() => setPage('restaurants')}>Find food <ArrowRight size={16} /></button>
                </div>
                <div className="hero-note"><span className="note-stars">★★★★★</span> 4.9 average from neighbors who know good food</div>
              </div>
              <div className="hero-visual">
                <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90" alt="Fresh Mediterranean grain bowl with herbs and vegetables" />
                <div className="hero-stamp"><span>Made with</span><strong>care.</strong><span>Delivered with love.</span></div>
                <div className="image-credit">A little taste of the neighborhood</div>
              </div>
              <div className="hero-index"><span>01</span><i /><small>DISCOVER SOMETHING GOOD</small></div>
            </section>

            <section className="category-section">
              <div className="section-heading compact-heading"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>What sounds good?</h2></div><button className="text-link" onClick={() => { setCategory('All'); setPage('restaurants') }}>All cuisines <ArrowRight size={15} /></button></div>
              <div className="category-row">
                {categories.map((item) => <button key={item.name} className={`category-tile ${item.tone} ${category === item.name ? 'selected' : ''}`} onClick={() => { setCategory(item.name); setPage('restaurants') }}><span className="category-icon">{item.icon}</span><span>{item.name === 'All' ? 'Everything' : item.name}</span><ArrowRight size={14} className="category-arrow" /></button>)}
              </div>
            </section>

            <section className="restaurant-section">
              <div className="section-heading"><div><span className="eyebrow">GOOD THINGS AROUND THE CORNER</span><h2>Neighborhood favorites</h2></div><button className="text-link" onClick={() => { setPage('restaurants'); setSelectedRestaurant(null) }}>Browse all <ArrowRight size={15} /></button></div>
              <RestaurantGrid restaurants={restaurants.slice(0, 3)} onSelect={setSelectedRestaurant} saved={saved} onSave={(id) => setSaved((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])} />
            </section>

            <section className="menu-section">
              <div className="section-heading"><div><span className="eyebrow">MADE FOR YOUR NEXT CRAVING</span><h2>Good things on the menu</h2></div><button className="text-link" onClick={() => setPage('restaurants')}>See all dishes <ArrowRight size={15} /></button></div>
              <div className="menu-grid">{filteredItems.slice(0, 3).map((item) => <MenuCard key={item.id} item={item} quantity={cart[item.id] || 0} onAdd={() => updateCart(item.id, 1)} onRemove={() => updateCart(item.id, -1)} />)}</div>
            </section>
          </>
        ) : page === 'restaurants' ? (
          <section className="browse-page page-wrap">
            <div className="page-title-row"><div><span className="eyebrow">YOUR NEIGHBORHOOD, SERVED</span><h1>Find your <em>next favorite.</em></h1><p>Good kitchens, good people, and something for every kind of craving.</p></div><div className="browse-count">{filteredRestaurants.length.toString().padStart(2, '0')} <span>places to try</span></div></div>
            <div className="browse-tools"><div className="browse-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search restaurants or dishes" aria-label="Search restaurants" /></div><button className={`filter-button ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen((value) => !value)}><SlidersHorizontal size={16} /> Filters</button><label className="sort-select"><ArrowDownUp size={15} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort restaurants"><option>Recommended</option><option>Top rated</option><option>Price: low to high</option></select><ChevronDown size={14} /></label></div>
            {filtersOpen && <div className="filter-panel"><span>Delivery time</span><div className="filter-options"><button className={maxTime === 'Any time' ? 'chosen' : ''} onClick={() => setMaxTime('Any time')}>Any time</button><button className={maxTime === 'Under 30 min' ? 'chosen' : ''} onClick={() => setMaxTime('Under 30 min')}>Under 30 min</button></div></div>}
            <div className="browse-categories">{categories.map((item) => <button className={category === item.name ? 'chosen' : ''} key={item.name} onClick={() => setCategory(item.name)}>{item.name}</button>)}</div>
            {filteredRestaurants.length ? <RestaurantGrid restaurants={filteredRestaurants} onSelect={setSelectedRestaurant} saved={saved} onSave={(id) => setSaved((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])} /> : <div className="empty-state"><span>Nothing on the menu just yet.</span><p>Try a different search or cuisine.</p><button className="primary-button" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</button></div>}
          </section>
        ) : page === 'cart' ? (
          <CartPage items={cartItems} subtotal={subtotal} onAdd={(id) => updateCart(id, 1)} onRemove={(id) => updateCart(id, -1)} onCheckout={() => setCheckoutOpen(true)} onBrowse={() => setPage('restaurants')} />
        ) : page === 'tracking' ? (
          <TrackingPage orderPlaced={orderPlaced} orderStep={orderStep} onBrowse={() => setPage('restaurants')} />
        ) : (
          <AccountPage mode={accountMode} setMode={setAccountMode} saved={saved} onSelectRestaurant={(restaurant) => { setSelectedRestaurant(restaurant); setPage('restaurants') }} />
        )}
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#discover" onClick={() => { setPage('discover'); setSelectedRestaurant(null) }}><span className="brand-mark">t<span>.</span></span><span className="brand-name">table<span>&</span>thyme</span></a><span>Good food brings us closer.</span><span>© 2025 Table & Thyme</span></footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map((item, index) => <button key={item.id} className={page === item.id && !isRestaurantPage ? 'active' : ''} onClick={() => { setPage(item.id); setSelectedRestaurant(null) }}>{index === 0 ? <span className="mobile-home-icon">✳</span> : index === 1 ? <Search size={20} /> : <Bike size={20} />}<small>{item.label}</small></button>)}<button className={page === 'cart' ? 'active' : ''} onClick={() => { setPage('cart'); setSelectedRestaurant(null) }}><ShoppingBag size={20} /><small>Bag{itemCount ? ` · ${itemCount}` : ''}</small></button></nav>
      {checkoutOpen && <CheckoutModal subtotal={subtotal} onClose={() => setCheckoutOpen(false)} onSubmit={placeOrder} />}
    </div>
  )
}

function RestaurantGrid({ restaurants: places, onSelect, saved, onSave }) {
  return <div className="restaurant-grid">{places.map((restaurant) => <article className="restaurant-card" key={restaurant.id}><button className="restaurant-image" onClick={() => onSelect(restaurant)} aria-label={`View ${restaurant.name}`}><img src={restaurant.image} alt={`${restaurant.cuisine} food from ${restaurant.name}`} /><span className="restaurant-tag">{restaurant.tag}</span><span className="rating"><Star size={12} fill="currentColor" />{restaurant.rating}</span></button><div className="restaurant-card-copy"><button className="restaurant-title" onClick={() => onSelect(restaurant)}>{restaurant.name}</button><button className={`save-button ${saved.includes(restaurant.id) ? 'saved' : ''}`} onClick={() => onSave(restaurant.id)} aria-label={saved.includes(restaurant.id) ? 'Remove from favorites' : 'Save restaurant'}><Heart size={17} fill={saved.includes(restaurant.id) ? 'currentColor' : 'none'} /></button><p>{restaurant.cuisine} <span>·</span> {restaurant.fee}</p><div className="card-meta"><span><Clock3 size={13} />{restaurant.time}</span><button onClick={() => onSelect(restaurant)}>View menu <ArrowRight size={14} /></button></div></div></article>)}</div>
}

function MenuCard({ item, quantity, onAdd, onRemove }) {
  return <article className="menu-card"><div className="menu-image"><img src={item.image} alt={item.name} />{item.badge && <span className="dish-badge">{item.badge}</span>}</div><div className="menu-card-copy"><div className="menu-card-title"><div><span>{item.restaurant}</span><h3>{item.name}</h3></div><strong>${item.price.toFixed(2)}</strong></div><p>{item.description}</p><div className="menu-card-bottom"><span className="dish-category">{item.category}</span><div className="quantity-control">{quantity > 0 && <button onClick={onRemove} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button>}<button className="add-button" onClick={onAdd} aria-label={`Add ${item.name} to bag`}><Plus size={15} />{quantity ? quantity : 'Add'}</button></div></div></div></article>
}

function RestaurantPage({ restaurant, onBack, onAdd, cart }) {
  const dishes = menuItems.filter((item) => item.restaurant === restaurant.name)
  const restaurantDishes = dishes.length ? dishes : menuItems.filter((item) => item.category === restaurant.cuisine)
  return <section className="restaurant-detail page-wrap"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> All places</button><div className="detail-hero"><img src={restaurant.image} alt={`${restaurant.name} cuisine`} /><div className="detail-hero-copy"><span className="eyebrow">{restaurant.cuisine.toUpperCase()} · NEIGHBORHOOD FAVORITE</span><h1>{restaurant.name}</h1><p>{restaurant.description}</p><div className="detail-meta"><span><Star size={14} fill="currentColor" /> {restaurant.rating} (200+)</span><span><Clock3 size={15} /> {restaurant.time}</span><span>{restaurant.fee}</span></div></div></div><div className="detail-menu-heading"><div><span className="eyebrow">COOKED WITH CARE</span><h2>Today's menu</h2></div><span>Prices include tax</span></div><div className="detail-dish-list">{restaurantDishes.map((item) => <div className="detail-dish" key={item.id}><div><span>{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><strong>${item.price.toFixed(2)}</strong></div><div className="detail-dish-image"><img src={item.image} alt={item.name} /><button className="detail-add" onClick={() => onAdd(item.id, 1)} aria-label={`Add ${item.name} to bag`}>{cart[item.id] ? <><Check size={15} /> {cart[item.id]}</> : <Plus size={17} />}</button></div></div>)}</div></section>
}

function CartPage({ items, subtotal, onAdd, onRemove, onCheckout, onBrowse }) {
  const delivery = items.length ? 1.99 : 0
  return <section className="cart-page page-wrap"><div className="page-title-row cart-title"><div><span className="eyebrow">A FEW GOOD THINGS</span><h1>Your <em>bag.</em></h1></div><button className="text-link" onClick={onBrowse}><ArrowLeft size={15} /> Keep browsing</button></div>{items.length ? <div className="cart-layout"><div className="cart-items"><div className="cart-items-heading"><span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span><span>From your neighborhood</span></div>{items.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-copy"><span>{item.restaurant}</span><h3>{item.name}</h3><p>${item.price.toFixed(2)} each</p></div><div className="quantity-control"><button onClick={() => onRemove(item.id)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => onAdd(item.id)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button></div><strong>${(item.price * item.quantity).toFixed(2)}</strong></article>)}</div><aside className="order-summary"><span className="eyebrow">THE LITTLE DETAILS</span><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div className="summary-line"><span>Delivery</span><strong>${delivery.toFixed(2)}</strong></div><div className="summary-line"><span>Service fee</span><strong>$1.25</strong></div><div className="summary-total"><span>Total</span><strong>${(subtotal + delivery + 1.25).toFixed(2)}</strong></div><button className="primary-button full-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button><p className="summary-note"><Check size={13} /> Your order supports a local kitchen</p></aside></div> : <div className="empty-bag"><div className="empty-bag-mark"><ShoppingBag size={28} /></div><h2>Your bag is taking a little break.</h2><p>There are plenty of good things waiting nearby.</p><button className="primary-button" onClick={onBrowse}>Explore restaurants <ArrowRight size={16} /></button></div>}</section>
}

function TrackingPage({ orderPlaced, orderStep, onBrowse }) {
  const steps = ['Order received', 'Being prepared', 'On the way', 'At your door']
  return <section className="tracking-page page-wrap"><div className="page-title-row"><div><span className="eyebrow">GOOD THINGS ARE ON THEIR WAY</span><h1>Order <em>tracking.</em></h1><p>A little window into what happens next.</p></div>{orderPlaced && <span className="order-number">ORDER #TT2048</span>}</div>{orderPlaced ? <div className="tracking-layout"><div className="tracking-main"><div className="live-map"><div className="map-grid" /><span className="map-street street-one">GREENE AVENUE</span><span className="map-street street-two">WASHINGTON ST</span><span className="map-street street-three">ATLANTIC AVE</span><span className="map-spot home-spot"><MapPin size={19} fill="currentColor" /></span><span className={`map-spot rider-spot step-${orderStep}`}><Bike size={18} /></span><div className="map-caption"><span className="live-pulse" /> LIVE ORDER</div><span className="map-distance">{orderStep < 2 ? 'Preparing nearby' : orderStep === 2 ? 'Almost there' : 'Arriving now'}</span></div><div className="tracking-status"><div><span className="eyebrow">ESTIMATED ARRIVAL</span><h2>{orderStep < 2 ? '12:35 – 12:45' : orderStep === 2 ? 'About 8 minutes' : 'Your order is here'}</h2><p>{orderStep === 0 ? 'The restaurant has your order.' : orderStep === 1 ? 'The kitchen is putting everything together.' : orderStep === 2 ? 'Your courier is heading your way.' : 'Enjoy every bite.'}</p></div><div className="courier-avatar">JM</div><span className="courier-name">Jordan M.<small>Your courier</small></span></div></div><aside className="tracking-timeline"><span className="eyebrow">THE JOURNEY</span><h2>Made with care.</h2>{steps.map((step, index) => <div className={`timeline-step ${index <= orderStep ? 'complete' : ''}`} key={step}><span className="timeline-marker">{index < orderStep ? <Check size={13} /> : index === orderStep ? <i /> : null}</span><div><strong>{step}</strong><small>{index === 0 ? 'A lovely choice.' : index === 1 ? 'The kitchen is at work.' : index === 2 ? 'A friendly face is on the way.' : 'Get the napkins ready.'}</small></div></div>)}<button className="text-link" onClick={onBrowse}>Order something else <ArrowRight size={14} /></button></aside></div> : <div className="no-order"><span className="tracking-icon"><Bike size={30} /></span><span className="eyebrow">NOTHING ON THE WAY (YET)</span><h2>Your next great meal is close.</h2><p>Place an order and we'll keep you in the loop, from kitchen to doorstep.</p><button className="primary-button" onClick={onBrowse}>Find something good <ArrowRight size={16} /></button></div>}</section>
}

function AccountPage({ mode, setMode, saved, onSelectRestaurant }) {
  const [submitted, setSubmitted] = useState(false)
  const savedRestaurants = restaurants.filter((restaurant) => saved.includes(restaurant.id))
  return <section className="account-page page-wrap"><div className="page-title-row"><div><span className="eyebrow">A SEAT WITH YOUR NAME ON IT</span><h1>Your <em>account.</em></h1><p>Your details, your favorites, your neighborhood.</p></div></div><div className="account-layout"><form className="account-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><div className="account-form-head"><div className="account-avatar"><UserRound size={22} /></div><div><h2>{submitted ? 'You’re all set.' : mode === 'Sign in' ? 'Welcome back.' : 'Come on in.'}</h2><p>{submitted ? 'Your details are saved for this visit.' : mode === 'Sign in' ? 'Sign in to find your favorites.' : 'Make yourself at home.'}</p></div></div>{mode === 'Create account' && <label>Your name<input required placeholder="First and last name" /></label>}<label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Password<input type="password" minLength="6" required placeholder="At least 6 characters" /></label><button className="primary-button full-button">{submitted ? 'Profile saved' : mode}<ArrowRight size={16} /></button><button type="button" className="mode-switch" onClick={() => { setMode(mode === 'Sign in' ? 'Create account' : 'Sign in'); setSubmitted(false) }}>{mode === 'Sign in' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></form><aside className="account-aside"><span className="eyebrow">YOUR LITTLE BLACK BOOK</span><h2>Saved places</h2>{savedRestaurants.length ? savedRestaurants.map((restaurant) => <button className="saved-place" key={restaurant.id} onClick={() => onSelectRestaurant(restaurant)}><img src={restaurant.image} alt="" /><span><strong>{restaurant.name}</strong><small>{restaurant.cuisine} · ★ {restaurant.rating}</small></span><ArrowRight size={16} /></button>) : <div className="saved-empty"><Heart size={19} /><p>Keep the places you love close. Tap the heart on any restaurant to save it here.</p></div>}</aside></div></section>
}

function CheckoutModal({ subtotal, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><form className="checkout-modal" onSubmit={onSubmit}><div className="modal-heading"><div><span className="eyebrow">THE FINAL LITTLE DETAILS</span><h2>Ready when you are.</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close checkout"><X size={19} /></button></div><label>Delivery address<input required defaultValue="128 Greene Avenue, Brooklyn, NY" /></label><label>Delivery note <span className="optional">OPTIONAL</span><input placeholder="Gate code, leave at door..." /></label><label>Payment method<select defaultValue="card"><option value="card">Visa ending in 2048</option><option value="cash">Cash on delivery</option></select></label><div className="checkout-total"><span>Total due</span><strong>${(subtotal + 3.24).toFixed(2)}</strong></div><button className="primary-button full-button">Place your order <ArrowRight size={16} /></button><p className="checkout-terms">A lovely meal is just around the corner.</p></form></div>
}

export default App