// Put the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Live clock: shows the visitor's local time and updates every second
function updateClock() {
  const now = new Date();
  document.getElementById("clock-time").textContent = now.toLocaleTimeString();
  document.getElementById("clock-date").textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
updateClock();
setInterval(updateClock, 1000);

// Count clicks on the "Say hi" button
let clicks = 0;
document.getElementById("hello-btn").addEventListener("click", () => {
  clicks++;
  document.getElementById("count").textContent = clicks;
});

// FC Bayern matches: ask our API for the data, then show it on the page
async function loadMatches() {
  const status = document.getElementById("matches-status");
  const list = document.getElementById("matches-list");

  try {
    // 1. Send a GET request to the API endpoint
    const response = await fetch("api/matches.json");

    // 2. Check the HTTP status code (200 = OK, 404 = not found, ...)
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    // 3. Turn the JSON text into a JavaScript object
    const data = await response.json();

    // 4. Build one match card per match
    for (const match of data.matches) {
      const date = new Date(match.date).toLocaleString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      const isHome = match.venue === "home";
      const homeTeam = isHome ? "FC Bayern" : match.opponent;
      const awayTeam = isHome ? match.opponent : "FC Bayern";
      const stadium = match.stadium
        ? match.stadium
        : "No stadium added. Please contact the support.";

      // Score in the middle (home team first), or "vs" if not played yet
      let score = "vs";
      let outcome = "upcoming";
      if (match.score) {
        const home = isHome ? match.score.bayern : match.score.opponent;
        const away = isHome ? match.score.opponent : match.score.bayern;
        score = home + " : " + away;
        if (match.score.bayern > match.score.opponent) outcome = "win";
        else if (match.score.bayern < match.score.opponent) outcome = "loss";
        else outcome = "draw";
      }

      // One icon per outcome: win, loss, draw or not played yet
      const icons = { win: "💪", loss: "😢", draw: "🤝", upcoming: "⏳" };
      const icon = makeElement("span", "badge", icons[outcome]);
      icon.title = outcome;
      icon.setAttribute("aria-label", outcome);

      const item = makeElement("li", "match " + outcome);

      const competition = makeElement("div", "competition", match.competition);

      const top = makeElement("div", "match-top");
      top.append(makeElement("span", "match-date", date), icon);

      const teams = makeElement("div", "match-teams");
      teams.append(
        makeElement("span", "team home", homeTeam),
        makeElement("span", "score", score),
        makeElement("span", "team away", awayTeam)
      );

      const place = makeElement("div", "match-stadium", "📍 " + stadium);

      item.append(competition, top, teams, place);
      list.appendChild(item);
    }

    status.textContent = data.team + ", season " + data.season + " (" + data.note + ")";
  } catch (error) {
    status.textContent = "Could not load matches: " + error.message;
  }
}
loadMatches();

// Small helper: create an element with a CSS class and (optional) text
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
