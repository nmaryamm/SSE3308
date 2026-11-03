import { useState } from 'react'
import Icon from './Icon.jsx'

export default function Navbar({
  activePage,
  cartCount,
  favoritesCount,
  favoritesOnly,
  onNavigate,
  onCartNavigate,
  onAccountNavigate,
  onToggleFavorites,
  currentUser,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(path) {
    setMenuOpen(false)
    onNavigate(path)
  }

  function showFavorites() {
    setMenuOpen(false)
    onToggleFavorites()
  }

  function navigateToAccount() {
    setMenuOpen(false)
    onAccountNavigate()
  }

  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('/')} aria-label="MeyYum home">
        <img className="brand-logo" src="/meyyum-logo.png" alt="MeyYum — Good food, happy mood" />
      </button>
      <nav className="main-nav" aria-label="Main navigation">
        <button className={`nav-link ${activePage === 'home' ? 'active' : ''}`} onClick={() => navigate('/')}>Home</button>
        <button className={`nav-link ${activePage === 'restaurants' ? 'active' : ''}`} onClick={() => navigate('/restaurants')}>Restaurants</button>
        <button className={`nav-link ${activePage === 'offers' ? 'active' : ''}`} onClick={() => navigate('/offers')}>Deals & vouchers</button>
      </nav>
      <button
        className={`icon-button favorites-shortcut ${favoritesOnly ? 'is-active' : ''}`}
        aria-label={favoritesOnly ? 'Show all food' : `Show favorites, ${favoritesCount} saved`}
        aria-pressed={favoritesOnly}
        onClick={onToggleFavorites}
      >
        <Icon name="heart" size={20} />
        {favoritesCount > 0 && <span className="mini-count">{favoritesCount}</span>}
      </button>
      <button className="icon-button cart-shortcut" aria-label={`Open cart, ${cartCount} items`} onClick={onCartNavigate}>
        <Icon name="bag" size={20} />
        {cartCount > 0 && <span className="mini-count">{cartCount}</span>}
      </button>
      <button className="profile-button" aria-label={currentUser ? `Manage account for ${currentUser.name}` : 'Sign in or create an account'} onClick={navigateToAccount}>
        <Icon name="user" size={19} />
      </button>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      {menuOpen && (
        <nav className="mobile-navigation" id="mobile-navigation" aria-label="Mobile navigation">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/restaurants')}>Restaurants</button>
          <button onClick={() => navigate('/offers')}>Deals & vouchers</button>
          <button onClick={showFavorites}>Favourite{favoritesCount > 0 ? ` (${favoritesCount})` : ''}</button>
        </nav>
      )}
    </header>
  )
}
