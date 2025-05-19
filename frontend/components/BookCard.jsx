import React from "react";
import "../styles/BookCard.css";

export default function BookCard({
  book,
  onSelect,
  toggleFavorite,
  isFavorite,
}) {
  return (
    <div className="book-card">
      {book.cover ? (
        <img
          src={book.cover}
          alt={book.title}
          className="book-cover"
          onClick={() => onSelect(book)}
        />
      ) : (
        <div className="book-cover no-image" onClick={() => onSelect(book)}>
          No Image
        </div>
      )}
      <div className="book-title">{book.title}</div>
      <div className="book-author">{book.author || "Unknown Author"}</div>
      {book.year && (
        <div className="book-year">First published: {book.year}</div>
      )}
      <button
        className="favorite-btn"
        onClick={() => toggleFavorite(book)}
        title={isFavorite(book) ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite(book) ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
