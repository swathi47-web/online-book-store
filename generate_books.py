import requests
import json

def fetch_books(n=10):
    url = "https://gutendex.com/books"
    books = []
    page = 1

    while len(books) < n:
        try:
            response = requests.get(f"{url}?page={page}", timeout=10)
            response.raise_for_status()
            data = response.json()
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Error fetching page {page}: {e}")
            break

        for book in data["results"]:
            if "text/plain; charset=utf-8" not in book["formats"]:
                continue

            books.append({
                "title": book["title"],
                "author": book["authors"][0]["name"] if book["authors"] else "Unknown",
                "genre": book["subjects"][0] if book["subjects"] else "General",
                "description": f"A book titled {book['title']} by {book['authors'][0]['name'] if book['authors'] else 'Unknown'}",
                "coverImage": book["formats"].get("image/jpeg", ""),
                "file_url": book["formats"]["text/plain; charset=utf-8"]
            })

            if len(books) >= n:
                break

        page += 1

    return books


if __name__ == "__main__":
    books = fetch_books(10)  # 👈 only 10 books
    with open("books.json", "w", encoding="utf-8") as f:
        json.dump(books, f, indent=4, ensure_ascii=False)

    print(f"✅ books.json created with {len(books)} books!")
