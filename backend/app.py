from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)  # Make sure this is **before** using @app.route
CORS(app)

@app.route("/api/search", methods=["GET"])
def search_books():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    url = f"https://openlibrary.org/search.json?q={query}"
    response = requests.get(url)
    data = response.json()

    books = []
    for item in data.get("docs", [])[:10]:
        books.append({
            "title": item.get("title"),
            "author": ", ".join(item.get("author_name", [])),
            "year": item.get("first_publish_year"),
            "cover": f"https://covers.openlibrary.org/b/id/{item.get('cover_i', '')}-M.jpg" if item.get("cover_i") else None,
            "link": f"https://openlibrary.org{item.get('key')}" if item.get("key") else None,
        })

    return jsonify(books)

if __name__ == "__main__":
    app.run(debug=True)
