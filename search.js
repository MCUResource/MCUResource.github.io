const pages = [
  //Main pages
  { title: "Movies", url: "movies.html", keywords: "film cinema movie mcu marvel" },
  { title: "TV", url: "tv.html", keywords: "show tv television series streaming disney+ special presentation netflix abc marvel mcu" },
  { title: "Timeline", url: "timeline.html", keywords: "timeline chronology chronological order watch order mcu marvel movies tv shows disney+ marvel television marvel entertainment" },
  { title: "Characters", url: "characters.html", keywords: "heroes villains characters profiles marvel mcu" },
  { title: "Easter Eggs & Theories", url: "eastereggs.html", keywords: "hidden details theories easter egg community archive marvel mcu" },
  
  //Movies
  { title: "Iron Man (2008)", url: "movies.html#iron-man", keywords: "tony stark iron man arc reactor obadiah stane james rhodes rhodey happy hogan pepper potts" },
  { title: "Captain America: The First Avenger (2011)", url: "movies.html#captain-america-first-avenger", keywords: "steve rogers captain america cap first avenger red skull peggy carter bucky barnes hydra" },
  { title: "The Avengers (2012)", url: "movies.html#the-avengers", keywords: "avengers assemble loki thor captain america steve rogers iron man tony stark hawkeye clint barton black widow natasha romanoff hulk bruce banner nick fury phil coulson maria hill" },
  
  //TV Shows
  { title: "WandaVision", url: "tv.html#wandavision", keywords: "wanda vision scarlet witch westview sitcom agatha harkness billy tommy pietro" },
  { title: "Loki", url: "tv.html#loki", keywords: "tva variants multiverse sylvie mobius god of mischief" },
  { title: "Hawkeye", url: "tv.html#hawkeye", keywords: "clint barton kate bishop yelena belova kingpin wilson fisk echo maya lopez" },
  
  //Characters
  { title: "Tony Stark / Iron Man", url: "characters/tony-stark.html", keywords: "tony stark iron man tony stank" },
  { title: "Steve Rogers / Captain America", url: "characters/steve-rogers.html", keywords: "steve rogers captain america cap" },
  { title: "Natasha Romanoff / Black Widow", url: "characters/natasha-romanoff.html", keywords: "natasha romanoff black widow nat" },
  { title: "Scott Lang / Ant-Man", url: "characters/scott-lang.html", keywords: "scott lang ant-man ant man antman cassie lang pym particles hank pym hope van dyne x-con security consultants" },
  
  //Coming Soon
  { title: "Daredevil: Born Again — Season 2", url: "tv.html#daredevil-born-again-season-2", keywords: "daredevil matt murdock born again season 2" },
  { title: "VisionQuest", url: "tv.html#visionquest", keywords: "vision white vision wanda sequel" }
];

const resultsList = document.getElementById("results-list");

function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

if (resultsList) {
  const params = new URLSearchParams(window.location.search);
  const queryRaw = params.get("q") || "";
  const query = normalize(queryRaw);

  resultsList.textContent = "";

  const makeLi = (text) => {
    const li = document.createElement("li");
    li.textContent = text;
    return li;
  };

  if (!query) {
    resultsList.appendChild(makeLi("Please enter a search term."));
  } else {
    const terms = query.split(/\s+/).filter(Boolean);

    const results = pages
      .map((page) => {
        const title = normalize(page.title);
        const keywords = normalize(page.keywords);
        const haystack = `${title} ${keywords}`;

        let score = 0;

        terms.forEach((term) => {
          if (title.includes(term)) score += 3;
          if (keywords.includes(term)) score += 1;
        });

        if (title === query) score += 10;
        if (haystack.includes(query)) score += 5;

        return { ...page, score };
      })
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode('No results found for "'));
      const strong = document.createElement("strong");
      strong.textContent = queryRaw;
      li.appendChild(strong);
      li.appendChild(document.createTextNode('".'));
      resultsList.appendChild(li);
    } else {
      results.forEach((page) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = page.url;
        a.textContent = page.title;
        li.appendChild(a);
        resultsList.appendChild(li);
      });
    }
  }
}
