import Icon from '../components/Icon.jsx'

const offers = [
  {
    label: 'FIRST ORDER',
    title: 'Free delivery on your first order',
    description: 'Enjoy delivery on us when you order your first MeyYum meal.',
    code: 'MEYYUM',
    accent: 'pink',
  },
  {
    label: 'A LITTLE EXTRA',
    title: 'Save 15% on your next meal',
    description: 'Take 15% off your next order and make your favourites even sweeter.',
    code: 'YUMMY15',
    accent: 'yellow',
  },
  {
    label: 'SHARE THE LOVE',
    title: 'RM 5 off when you spend RM 25',
    description: 'A little treat for a bigger meal. Add your voucher at checkout.',
    code: 'GOODFOOD5',
    accent: 'orange',
  },
]

export default function Offers({ onNavigate }) {
  return (
    <section className="page-section offers-page">
      <div className="page-heading">
        <span className="section-kicker">A little treat from us</span>
        <h1>Deals & vouchers</h1>
        <p>Good food feels even better with a little saving.</p>
      </div>
      <div className="offers-grid">
        {offers.map((offer) => (
          <article className={`offer-card offer-card-${offer.accent}`} key={offer.code}>
            <span className="offer-label">{offer.label}</span>
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            <div className="offer-code">
              <span>Use code</span>
              <strong>{offer.code}</strong>
            </div>
            <button className="button-primary" onClick={() => onNavigate('/#menu')}>
              Browse restaurants <Icon name="arrow" size={16} />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
