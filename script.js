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
