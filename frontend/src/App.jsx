import React, { useState, useEffect, useRef } from "react";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: 20,
    maxWidth: 900,
    margin: "auto",
    position: "relative",
  },
  header: {
    textAlign: "center",
    fontSize: 36,
    marginBottom: 24,
  },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
  },
  input: {
    width: "70%",
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    marginLeft: 10,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#4a90e2",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 16,
  },
  bookCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "relative",
  },
  bookCover: {
    width: "100%",
    height: 190,
    objectFit: "cover",
    borderRadius: 6,
    cursor: "pointer",
  },
  bookTitle: {
    fontWeight: "600",
    marginTop: 8,
    fontSize: 14,
  },
  bookAuthor: {
    fontSize: 12,
    color: "#555",
  },
  bookYear: {
    fontSize: 11,
    color: "#888",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "transparent",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    userSelect: "none",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxWidth: 700,
    padding: 20,
    position: "relative",
    display: "flex",
    gap: 20,
  },
  modalCover: {
    width: 200,
    height: 280,
    objectFit: "cover",
    borderRadius: 10,
  },
  modalNoImage: {
    width: 200,
    height: 280,
    borderRadius: 10,
    backgroundColor: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#aaa",
    fontSize: 16,
  },
  modalDetails: {
    flex: 1,
  },
  modalTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: "bold",
  },
  modalAuthor: {
    fontSize: 16,
    margin: "8px 0",
    color: "#555",
  },
  modalYear: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  openLibraryLink: {
    display: "inline-block",
    marginBottom: 12,
    color: "#4a90e2",
    textDecoration: "none",
    fontWeight: "600",
  },
  modalFavoriteBtn: {
    padding: "10px 16px",
    fontSize: 16,
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    userSelect: "none",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 30,
    fontWeight: "bold",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    color: "#444",
  },

  // Favorites Bar Styles
  favoritesBar: {
    position: "fixed",
    top: 60,
    right: 0,
    width: 120,
    height: "80vh",
    backgroundColor: "#f0f4ff",
    borderLeft: "1px solid #ccc",
    padding: 10,
    overflowY: "auto",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
    zIndex: 1100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  favoritesBarHeader: {
    fontWeight: "700",
    marginBottom: 12,
    color: "#4a90e2",
  },
  favThumb: {
    width: 80,
    height: 110,
    marginBottom: 12,
    borderRadius: 4,
    objectFit: "cover",
    cursor: "pointer",
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  favThumbHover: {
    transform: "scale(1.05)",
  },
  favNoImage: {
    width: 80,
    height: 110,
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#aaa",
    fontSize: 12,
    cursor: "pointer",
  },
  favToggleBtn: {
    position: "fixed",
    top: 10,
    right: 10,
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    zIndex: 1200,
  },
};

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favBarVisible, setFavBarVisible] = useState(true);
  const [favThumbHoverIndex, setFavThumbHoverIndex] = useState(null);
  const [favBtnHover, setFavBtnHover] = useState(false);
  const [closeBtnHover, setCloseBtnHover] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    // Load favorites from localStorage if you want persistence
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    // Save favorites to localStorage on change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Close modal on ESC
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedBook(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function searchBooks() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const booksData = data.docs.slice(0, 30).map((book) => ({
          key: book.key,
          title: book.title,
          author: book.author_name ? book.author_name.join(", ") : null,
          year: book.first_publish_year,
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null,
          link: `https://openlibrary.org${book.key}`,
        }));
        setBooks(booksData);
      })
      .catch(() => setError("Failed to fetch books."))
      .finally(() => setLoading(false));
  }

  function toggleFavorite(book) {
    if (isFavorite(book)) {
      setFavorites(favorites.filter((fav) => fav.key !== book.key));
    } else {
      setFavorites([...favorites, book]);
    }
  }

  function isFavorite(book) {
    return favorites.some((fav) => fav.key === book.key);
  }

  function onOverlayClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedBook(null);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📚 Book Finder</h1>

      <button
        style={styles.favToggleBtn}
        onClick={() => setFavBarVisible(!favBarVisible)}
        title={favBarVisible ? "Hide Favorites Bar" : "Show Favorites Bar"}
      >
        {favBarVisible ? "Hide ❤️" : "Show ❤️"}
      </button>

      {/* Favorites Sidebar */}
      {favBarVisible && favorites.length > 0 && (
        <div style={styles.favoritesBar}>
          <div style={styles.favoritesBarHeader}>Favorites</div>
          {favorites.map((book, i) =>
            book.cover ? (
              <img
                key={`fav-thumb-${i}`}
                src={book.cover}
                alt={book.title}
                style={{
                  ...styles.favThumb,
                  ...(favThumbHoverIndex === i ? styles.favThumbHover : {}),
                }}
                onClick={() => setSelectedBook(book)}
                onMouseEnter={() => setFavThumbHoverIndex(i)}
                onMouseLeave={() => setFavThumbHoverIndex(null)}
              />
            ) : (
              <div
                key={`fav-thumb-${i}`}
                style={styles.favNoImage}
                onClick={() => setSelectedBook(book)}
              >
                No Image
              </div>
            )
          )}
        </div>
      )}

      {/* Search Box */}
      <div style={styles.searchBox}>
        <input
          style={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          onKeyDown={(e) => {
            if (e.key === "Enter") searchBooks();
          }}
        />
        <button style={styles.button} onClick={searchBooks}>
          Search
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Books Grid */}
      <h3>Results</h3>
      <div style={styles.booksGrid}>
        {books.map((book, i) => (
          <div key={i} style={styles.bookCard}>
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                style={styles.bookCover}
                onClick={() => setSelectedBook(book)}
              />
            ) : (
              <div
                style={{
                  ...styles.bookCover,
                  backgroundColor: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  fontSize: 14,
                }}
                onClick={() => setSelectedBook(book)}
              >
                No Image
              </div>
            )}
            <div style={styles.bookTitle}>{book.title}</div>
            <div style={styles.bookAuthor}>{book.author || "Unknown Author"}</div>
            {book.year && <div style={styles.bookYear}>First published: {book.year}</div>}
            <button
              onClick={() => toggleFavorite(book)}
              style={styles.favoriteBtn}
              title={isFavorite(book) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(book) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <div style={styles.modalOverlay} onClick={onOverlayClick}>
          <div style={styles.modalContent} ref={modalRef}>
            {selectedBook.cover ? (
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                style={styles.modalCover}
              />
            ) : (
              <div style={styles.modalNoImage}>No Image Available</div>
            )}

            <div style={styles.modalDetails}>
              <h2 style={styles.modalTitle}>{selectedBook.title}</h2>
              <div style={styles.modalAuthor}>
                {selectedBook.author || "Unknown Author"}
              </div>
              {selectedBook.year && (
                <div style={styles.modalYear}>First published: {selectedBook.year}</div>
              )}

              {selectedBook.link && (
                <a
                  href={selectedBook.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.openLibraryLink}
                >
                  View on OpenLibrary
                </a>
              )}

              <button
                style={{
                  ...styles.modalFavoriteBtn,
                  ...(favBtnHover ? { backgroundColor: "#357ABD" } : {}),
                }}
                onClick={() => toggleFavorite(selectedBook)}
                onMouseEnter={() => setFavBtnHover(true)}
                onMouseLeave={() => setFavBtnHover(false)}
              >
                {isFavorite(selectedBook)
                  ? "Remove from Favorites ❤️"
                  : "Add to Favorites 🤍"}
              </button>
            </div>

            <button
              style={{
                ...styles.closeButton,
                ...(closeBtnHover ? { color: "#000" } : {}),
              }}
              onClick={() => setSelectedBook(null)}
              onMouseEnter={() => setCloseBtnHover(true)}
              onMouseLeave={() => setCloseBtnHover(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
