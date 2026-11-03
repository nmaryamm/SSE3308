export default function CategoryList({ categories, selected, onSelect }) {
  return (
    <div className="category-list">
      {categories.map((item) => (
        <button
          className={`category-item ${selected === item.name ? 'selected' : ''}`}
          key={item.name}
          onClick={() => onSelect(item.name)}
          aria-pressed={selected === item.name}
        >
          <span className="category-icon-wrap">
            <img className="category-icon" src={item.icon} alt="" />
          </span>
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  )
}
