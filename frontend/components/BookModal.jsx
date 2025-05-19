import React, { useState } from "react";
import "../styles/BookModal.css";

export default function BookModal({
  book,
  onClose,
  toggleFavorite,
  isFavorite,
  modalRef,
  onOverlayClick,
}) {
  const [hover, setHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  return (
    <div className="modal-overlay" onClick={onOverlayClick}>
      <div className="modal-content" ref={modalRef}>
        {book.cover ? (
          <img src={book.cover} alt={book.title} className="modal-cover" />
        ) : (
          <div className="modal-no-image">No Image Available</div>
        )}
        <div className="modal-details">
          <h2 className="modal-title">{book.title}</h2>
          <div className="modal-author">{book.author || "Unknown Author"}</div>
          {book.year && <div className="modal-year">First published: {book.year}</div>}
          {book.link && (
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="open-library-link"
            >
              View on OpenLibrary
            </a>
          )}
          <button
            id="modal-fav-btn"
            className={`modal-fav-btn ${hover ? "hover" : ""}`}
            onClick={() => toggleFavorite(book)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {isFavorite(book) ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"}
          </button>
        </div>
        <button
          className={`close-button ${closeHover ? "hover" : ""}`}
          onClick={onClose}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
