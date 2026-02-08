const pages = [
  { title: "Movies", url: "movies.html", keywords: "films cinema mcu movie" },
  { title: "TV", url: "tv.html", keywords: "shows series streaming disney+" },
  { title: "Chronology", url: "chronology.html", keywords: "timeline order chronological" },
  { title: "Characters", url: "characters.html", keywords: "heroes villains profiles" },
  { title: "Easter Eggs & Theories", url: "eastereggs.html", keywords: "hidden details theories" }
];

const resultsList = document.getElementById("results-list");

// Safety check so it doesn't error if loaded on another page by accident
if (resultsList) {
  const params = new URLSearchParams(window.location.search);
  const queryRaw = params.get("q") || "";
  const query = queryRaw.trim().toLowerCase();

  if (!query) {
    resultsList.innerHTML = "<li>Please enter a search term.</li>";
  } else {
    const results = pages.filter(page =>
      page.title.toLowerCase().includes(query) ||
      page.keywords.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      resultsList.innerHTML = `<li>No results found for "<strong>${queryRaw}</strong>".</li>`;
    } else {
      results.forEach(page => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${page.url}">${page.title}</a>`;
        resultsList.appendChild(li);
      });
    }
  }
}
