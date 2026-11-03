import Icon from './Icon.jsx'

const priceOptions = [
  { label: 'Under RM 10', value: 'under-10' },
  { label: 'RM 10–15', value: '10-15' },
  { label: 'Over RM 15', value: 'over-15' },
]
const ratingOptions = [
  { label: '4.5 and up', value: '4.5' },
  { label: '4.8 and up', value: '4.8' },
]
const deliveryOptions = [
  { label: '20 min or less', value: '20' },
  { label: '30 min or less', value: '30' },
  { label: '40 min or less', value: '40' },
]

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

export default function FoodFilters({
  draft,
  onChange,
  onApply,
  onClose,
  onReset,
}) {
  function update(key, value) {
    onChange((current) => ({ ...current, [key]: value }))
  }

  function resetDraft(event) {
    event.preventDefault()
    onReset()
  }

  function applyDraft(event) {
    event.preventDefault()
    onApply()
  }

  return (
    <form className="food-filter-panel" onSubmit={applyDraft} onReset={resetDraft}>
      <div className="food-filter-header">
        <div>
          <span className="section-kicker">Make it your kind of yum</span>
          <h3>Filter your food</h3>
        </div>
        <button
          className="btn btn-square filter-reset"
          type="button"
          onClick={onClose}
          aria-label="Close filter panel"
          title="Close filters"
        >
          ×
        </button>
      </div>

      <section className="filter-group">
        <h4>Price range</h4>
        <div className="filter-chip-list">
          {priceOptions.map((option) => (
            <input
              className="btn filter-chip"
              key={option.value}
              type="checkbox"
              name="prices"
              value={option.value}
              aria-label={option.label}
              checked={draft.prices.includes(option.value)}
              onChange={() => update('prices', toggleValue(draft.prices, option.value))}
            />
          ))}
        </div>
      </section>

      <section className="filter-group">
        <h4>Rating</h4>
        <div className="filter-choice-list">
          {ratingOptions.map((option) => (
            <label className="filter-choice" key={option.value}>
              <input
                className="radio radio-sm"
                type="radio"
                name="rating"
                value={option.value}
                checked={draft.rating === option.value}
                onChange={() => update('rating', option.value)}
              />
              <span>★ {option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="filter-group">
        <h4>Delivery time</h4>
        <div className="filter-choice-list">
          {deliveryOptions.map((option) => (
            <label className="filter-choice" key={option.value}>
              <input
                className="radio radio-sm"
                type="radio"
                name="deliveryTime"
                value={option.value}
                checked={draft.deliveryTime === option.value}
                onChange={() => update('deliveryTime', option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <label className="filter-offer">
        <input
          className="checkbox checkbox-sm"
          type="checkbox"
          checked={draft.specialOffers}
          onChange={(event) => update('specialOffers', event.target.checked)}
        />
        <span><strong>Special offers</strong><small>Only show food with a special deal</small></span>
      </label>

      <div className="food-filter-actions">
        <button className="filter-close-button" type="reset">Clear selections</button>
        <button className="filter-close-button" type="button" onClick={onClose}>Close</button>
        <button className="button-primary" type="submit">Apply filters <Icon name="arrow" size={16} /></button>
      </div>
    </form>
  )
}
