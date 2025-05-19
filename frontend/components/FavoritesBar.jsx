import "../styles/FavoritesBar.css";

export default function FavoritesBar({ favorites, onSelect, hoverIndex, setHoverIndex }) {
  return (
    <div className="favorites-bar">
      <div className="favorites-bar-header">Favorites</div>
      {favorites.map((book, i) =>
        book.cover ? (
          <img
            key={i}
            src={book.cover}
            alt={book.title}
            className={`fav-thumb ${hoverIndex === i ? "hover" : ""}`}
            onClick={() => onSelect(book)}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ) : (
          <div
            key={i}
            className="fav-no-image"
            onClick={() => onSelect(book)}
          >
          </div>
        )
      )}
    </div>
  );
}
