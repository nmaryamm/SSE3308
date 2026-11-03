import { useEffect, useMemo, useState } from 'react'
import Account from './pages/Account.jsx'
import Cart from './pages/Cart.jsx'
import FoodDetails from './pages/FoodDetails.jsx'
import Home from './pages/Home.jsx'
import Location from './pages/Location.jsx'
import Offers from './pages/Offers.jsx'
import Restaurants from './pages/Restaurants.jsx'
import Tracking from './pages/Tracking.jsx'
import { categories, foods, restaurants } from './data/foods.js'
import Icon from './components/Icon.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

function readRoute() {
  return window.location.hash.startsWith('#/')
    ? window.location.hash.slice(1)
    : '/'
}

function shuffleFoods(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = currentItem
  }
  return shuffled
}

function App() {
  const [route, setRoute] = useState(readRoute)
  const [homeFoods] = useState(() => shuffleFoods(foods))
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('UPM, Serdang')
  const [favorites, setFavorites] = useState([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sessionAccounts, setSessionAccounts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [cart, setCart] = useState({})
  const [lastOrder, setLastOrder] = useState([])
  const [lastOrderTotal, setLastOrderTotal] = useState(0)

  useEffect(() => {
    function handleHashChange() {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const section = route.split('#')[1]
    if (!section) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [route])

  const pagePath = route.split('#')[0]
  const activePage = pagePath.startsWith('/food/')
    ? 'food'
    : pagePath.slice(1) || 'home'
  const selectedFoodId = Number(pagePath.split('/')[2])
  const selectedFood = foods.find((food) => food.id === selectedFoodId)
  const cartItems = useMemo(
    () => foods.filter((food) => cart[food.id]).map((dish) => ({ dish, quantity: cart[dish.id] })),
    [cart],
  )
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.dish.price * item.quantity, 0)

  function navigate(path) {
    if (path !== '/') setFavoritesOnly(false)
    if (window.location.hash === `#${path}`) {
      setRoute(path)
      return
    }
    window.location.hash = path
  }

  function openFood(id) {
    navigate(`/food/${id}`)
  }

  function updateQuantity(id, change) {
    setCart((current) => {
      const nextQuantity = (current[id] || 0) + change
      const next = { ...current }
      if (nextQuantity <= 0) delete next[id]
      else next[id] = nextQuantity
      return next
    })
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function registerAccount({ name, email, password }) {
    const normalizedEmail = email.toLowerCase()
    if (sessionAccounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
      return { error: 'An account with this email already exists in this session.' }
    }
    const account = { name, email, password, phone: '' }
    setSessionAccounts((accounts) => [...accounts, account])
    setCurrentUser(account)
    return { user: account }
  }

  function loginAccount({ email, password }) {
    const account = sessionAccounts.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.toLowerCase() &&
        candidate.password === password,
    )
    if (!account) {
      return { error: 'Email or password is incorrect, or the account was created in another session.' }
    }
    setCurrentUser(account)
    return { user: account }
  }

  function saveAccountProfile(profile) {
    const normalizedEmail = profile.email.toLowerCase()
    if (
      sessionAccounts.some(
        (account) =>
          account.email.toLowerCase() === normalizedEmail &&
          account.email.toLowerCase() !== currentUser.email.toLowerCase(),
      )
    ) {
      return 'Another account in this session already uses this email.'
    }
    const updatedAccount = { ...currentUser, ...profile }
    setSessionAccounts((accounts) =>
      accounts.map((account) =>
        account.email === currentUser.email ? updatedAccount : account,
      ),
    )
    setCurrentUser(updatedAccount)
    return ''
  }

  function logoutAccount() {
    setCurrentUser(null)
  }

  function handleToggleFavorites() {
    const nextFavoritesOnly = !favoritesOnly
    setFavoritesOnly(nextFavoritesOnly)
    if (pagePath !== '/') navigate('/')
  }

  function showAllFood() {
    setFavoritesOnly(false)
    setSearch('')
    setCategory('All')
  }

  function placeOrder(orderTotal = subtotal) {
    if (!cartItems.length) return
    setLastOrder(cartItems)
    setLastOrderTotal(orderTotal)
    setCart({})
    navigate('/tracking')
  }

  const pageProps = {
    cart,
    favorites,
    onFavorite: toggleFavorite,
    onNavigate: navigate,
    onOpenFood: openFood,
    onQuantityChange: updateQuantity,
  }

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        favoritesOnly={favoritesOnly}
        onNavigate={navigate}
        onCartNavigate={() => navigate('/cart')}
        onAccountNavigate={() => navigate('/account')}
        onToggleFavorites={handleToggleFavorites}
        currentUser={currentUser}
      />
      <main>
        {pagePath === '/account' && (
          <Account
            currentUser={currentUser}
            onRegister={registerAccount}
            onLogin={loginAccount}
            onProfileSave={saveAccountProfile}
            onLogout={logoutAccount}
          />
        )}
        {pagePath === '/' && (
          <>
            <Home
              {...pageProps}
              categories={categories}
              category={category}
              dishes={homeFoods}
              favoritesOnly={favoritesOnly}
              deliveryLocation={deliveryLocation}
              search={search}
              setCategory={setCategory}
              setSearch={setSearch}
              onShowAllFood={showAllFood}
            />
            <footer className="footer">
              <button className="brand footer-brand" onClick={() => navigate('/')} aria-label="MeyYum home">
                <img className="brand-logo" src="/meyyum-logo.png" alt="MeyYum — Good food, happy mood" />
              </button>
              <span className="footer-love">Made with <span>♥</span> for food lovers</span>
              <span className="footer-student">
                <span>Created by <strong>Nurisma Maryam Bt Mahaidir</strong></span>
                <span className="footer-divider" aria-hidden="true">·</span>
                <span>Matric no. <strong>223593</strong></span>
              </span>
            </footer>
          </>
        )}
        {pagePath === '/restaurants' && (
          <Restaurants
            restaurants={restaurants}
            search={search}
            setSearch={setSearch}
            {...pageProps}
          />
        )}
        {pagePath === '/offers' && <Offers onNavigate={navigate} />}
        {pagePath === '/location' && (
          <Location
            location={deliveryLocation}
            onSave={setDeliveryLocation}
            onNavigate={navigate}
          />
        )}
        {pagePath.startsWith('/food/') && (
          <FoodDetails
            {...pageProps}
            dish={selectedFood}
            relatedDishes={foods.filter((food) => food.id !== selectedFoodId).slice(0, 4)}
            onBack={() => navigate('/')}
          />
        )}
        {pagePath === '/cart' && (
          <Cart
            items={cartItems}
            subtotal={subtotal}
            onNavigate={navigate}
            onQuantityChange={updateQuantity}
            onCheckout={placeOrder}
          />
        )}
        {pagePath === '/tracking' && (
          <Tracking items={lastOrder} orderTotal={lastOrderTotal} onNavigate={navigate} />
        )}
        {!['/', '/account', '/offers', '/location', '/restaurants', '/cart', '/tracking'].includes(pagePath) && !pagePath.startsWith('/food/') && (
          <section className="page-section empty-results">
            <span>🧭</span><h3>We couldn’t find that page</h3>
            <p>Let’s get you back to something delicious.</p>
            <button className="button-primary" onClick={() => navigate('/')}>Go home</button>
          </section>
        )}
      </main>
      {cartCount > 0 && pagePath !== '/cart' && (
        <button className="floating-cart" onClick={() => navigate('/cart')} aria-label={`Open cart with ${cartCount} items`}>
          <span className="floating-cart-icon"><Icon name="bag" size={23} /></span>
          <span className="floating-cart-count">{cartCount}</span>
        </button>
      )}
    </div>
  )
}

export default App
