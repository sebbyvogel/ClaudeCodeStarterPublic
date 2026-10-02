// Put the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Count clicks on the "Say hi" button
let clicks = 0;
document.getElementById("hello-btn").addEventListener("click", () => {
  clicks++;
  document.getElementById("count").textContent = clicks;
});
