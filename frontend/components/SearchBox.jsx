import React from "react";
import "../styles/SearchBox.css";

export default function SearchBox({ query, setQuery, onSearch }) {
  return (
    <div className="search-box">
      <input
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button className="search-button" onClick={onSearch}>
        Search
      </button>
    </div>
  );
}
