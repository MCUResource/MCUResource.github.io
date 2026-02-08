const pages = [
  { title: "Movies", url: "movies.html", keywords: "films cinema mcu" },
  { title: "TV", url: "tv.html", keywords: "shows series streaming" },
  { title: "Chronology", url: "chronology.html", keywords: "timeline order" },
  { title: "Characters", url: "characters.html", keywords: "heroes villains" },
  { title: "Easter Eggs & Theories", url: "eastereggs.html", keywords: "hidden theories" }
];

const params = new URLSearchParams(window.location.search);
const query = params.get("q")?.toLowerCase() || "";

const resultsList = document.getElementById("results-list");

const results = pages.filter(page =>
  page.title.toLowerCase().includes(query) ||
  page.keywords.toLowerCase().includes(query)
);

if (results.length === 0) {
  resultsList.innerHTML = "<li>No results found.</li>";
} else {
  results.forEach(page => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${page.url}">${page.title}</a>`;
    resultsList.appendChild(li);
  });
}

