// Get current URL
const currentURL = window.location.href;

// Get referrer URL, default to null if empty
const referrerURL = document.referrer || null;

// Get user agent
const userAgent = navigator.userAgent;

// Get current timestamp
const timestamp = new Date();

// Get URL parameters (query string values)
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get("utm_source");
const utmMedium = urlParams.get("utm_medium");

// Get lead source name from the meta tag
const metaTag = document.querySelector('meta[name="lead-source"]');
const leadSourceName = metaTag ? metaTag.getAttribute("content") : null;

// Create data object
const dataToSend = {
  type: "clientJoin",
  currentURL,
  referrerURL,
  userAgent,
  utmSource,
  utmMedium,
  timestamp,
  leadSourceName
};

// Connect to WebSocket server
const socket = new WebSocket("ws://localhost:8082");

// Handle WebSocket connection
socket.addEventListener("open", (e) => {
  socket.send(JSON.stringify(dataToSend));
});
