const currentURL = window.location.href;
let referrerURL = document.referrer;
const userAgent = navigator.userAgent;
const timestamp = new Date();
let platform = "";
let country = "";

// URL commands
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get("utm_source");
const utmMedium = urlParams.get("utm_medium");
const utmCamp = urlParams.get('utm_campaign');
const utmTerm = urlParams.get('utm_term');
const utmContent = urlParams.get('utm_content');

// Check for a meta tag with a specific name attribute
const metaTag = document.querySelector('meta[name="lead-source"]');
let leadSourceName;
if (metaTag) {
  leadSourceName = metaTag.getAttribute("content");
}

// Check if they came back
// Check if the user is a returning visitor
const isFirstVisit = document.cookie.indexOf("visited=true") === -1;

// Set a cookie to mark this visit
if (isFirstVisit) {
  document.cookie =
    "visited=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

// Check user's platform

if (userAgent.match("/Mobile/i")) {
  // User is on a mobile device
  platform = "mobile";
} else if (userAgent.match("/Tablet|iPad/i")) {
  // User is on a tablet
  platform = "tablet";
} else {
  // User is on a desktop
  platform = "desktop";
}

// Getting user's location

fetch("http://ip-api.com/json/")
  .then((response) => response.json())
  .then((data) => {
    country = data.country;
    // DATASENDING

    const dataToSend = {
      type: "clientJoin",
      currentURL,
      referrerURL,
      userAgent,
      utmSource,
      utmMedium,
      utmCamp,
      utmTerm,
      utmContent,
      timestamp,
      leadSourceName,
      isFirstVisit,
      platform,
      country,
    };
    const socket = new WebSocket("ws://localhost:8082");

    socket.addEventListener("open", (e) => {
      socket.send(JSON.stringify(dataToSend));
    });
  })
  .catch((error) => console.error(error));
