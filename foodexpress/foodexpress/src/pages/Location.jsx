import { useState } from 'react'
import Icon from '../components/Icon.jsx'

export default function Location({ location, onSave, onNavigate }) {
  const [draftLocation, setDraftLocation] = useState(location)

  function saveLocation(event) {
    event.preventDefault()
    const nextLocation = draftLocation.trim()
    if (!nextLocation) return
    onSave(nextLocation)
    onNavigate('/')
  }

  return (
    <section className="page-section location-page account-auth-page">
      <div className="account-welcome-art" aria-hidden="true">
        <span>📍</span><span>🛵</span><span>🍓</span>
      </div>
      <div className="page-heading account-auth-heading location-heading">
        <span className="section-kicker">A little delivery magic</span>
        <h1>Delivery location</h1>
        <p>Pick the perfect spot and we’ll bring the yum right to you!</p>
      </div>
      <form className="location-form account-auth-form location-auth-form" onSubmit={saveLocation}>
        <label htmlFor="delivery-location">Your delivery address</label>
        <div className="location-input-wrap">
          <Icon name="pin" size={19} />
          <input
            id="delivery-location"
            name="delivery-location"
            type="text"
            autoComplete="street-address"
            placeholder="Enter your location"
            value={draftLocation}
            onChange={(event) => setDraftLocation(event.target.value)}
            required
          />
        </div>
        <button className="button-primary" type="submit" disabled={!draftLocation.trim()}>
          Save my happy place <span aria-hidden="true">✨</span>
        </button>
        <p className="location-current"><span aria-hidden="true">🏠</span> Current spot: {location}</p>
      </form>
    </section>
  )
}
