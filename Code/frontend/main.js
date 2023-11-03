const currentURL = window.location.href;
    let referrerURL = document.referrer;
    const userAgent = navigator.userAgent;
    const timestamp = new Date();

    // URL commands
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    if (referrerURL === "") {
      referrerURL = null;
    }

    // Check for a meta tag with a specific name attribute
    const metaTag = document.querySelector('meta[name="lead-source"]');
    let leadSourceName;
    if (metaTag) {
      leadSourceName = metaTag.getAttribute("content");
    }

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

    // write original domain of VPS server
    const socket = new WebSocket("ws://localhost:8082");

    socket.addEventListener("open", (e) => {
      socket.send(JSON.stringify(dataToSend));
    });