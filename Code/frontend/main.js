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
const utmCamp = urlParams.get("utm_campaign");
const utmTerm = urlParams.get("utm_term");
const utmContent = urlParams.get("utm_content");

// Check for a meta tag with a specific name attribute
const leadSourceInput = document.querySelector('input[name="lead_source"]');
let leadSourceName;
if (leadSourceInput) {
  // Access the value of the input field
  leadSourceName = leadSourceInput.value;
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
// TODO fix this

if (
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i)
) {
  platform = "mobile";
} else {
  platform = "desktop";
}

// Getting user's location

const socket = new WebSocket("ws://localhost:8082");
let dataToSend;

socket.addEventListener("open", (e) => {
  // fetch("http://ip-api.com/json/")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     country = data.country;
  // DATASENDING

  dataToSend = {
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

  socket.send(JSON.stringify(dataToSend));
  // })
  // .catch((error) => console.error(error));
});

socket.addEventListener("message", (e) => {
  if (e.data) {
    const receivedMessage = JSON.parse(e.data); // Assuming the message is in JSON format
    // Now you can work with the received message
    if (receivedMessage === "requestOfData") {
      console.log(dataToSend);
      socket.send(JSON.stringify(dataToSend));
    }
    // You can also send a response if needed
  }
});
