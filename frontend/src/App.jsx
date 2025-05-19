import React, { useState, useEffect, useRef } from "react";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import FavoritesBar from "../components/FavoritesBar";
import SearchBox from "../components/SearchBox";
import "../styles/app.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favBarVisible, setFavBarVisible] = useState(true);

  const modalRef = useRef(null);

  useEffect(() => {
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedBook(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const searchBooks = () => {
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
  };

  const toggleFavorite = (book) => {
    if (isFavorite(book)) {
      setFavorites(favorites.filter((fav) => fav.key !== book.key));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const isFavorite = (book) => {
    return favorites.some((fav) => fav.key === book.key);
  };

  const onOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedBook(null);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-header">📚 Book Finder</h1>

      <button
        className="fav-toggle-btn"
        onClick={() => setFavBarVisible(!favBarVisible)}
        title={favBarVisible ? "Hide Favorites Bar" : "Show Favorites Bar"}
      >
        {favBarVisible ? "Favourites" : "Favourites"}
        <span className="fav-toggle-icon">
          {favBarVisible ? "⬆️" : "⬇️"}
        </span>
      </button>

      <SearchBox query={query} setQuery={setQuery} onSearch={searchBooks} />

      {favBarVisible && (
        <FavoritesBar
          favorites={favorites}
          setSelectedBook={setSelectedBook}
        />
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <h3>Results</h3>
      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            onSelect={setSelectedBook}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite} // ✅ pass function, not boolean
          />
        ))}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite} // ✅ pass function
          onOverlayClick={onOverlayClick}
          modalRef={modalRef}
        />
      )}
    </div>
  );
}
