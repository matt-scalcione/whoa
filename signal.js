const storyTime = document.getElementById("storyTime");
const heroHeadline = document.getElementById("heroHeadline");
const heroCopy = document.getElementById("heroCopy");
const locateButton = document.getElementById("locateButton");
const demoButton = document.getElementById("demoButton");
const locationLine = document.getElementById("locationLine");
const storyHeadline = document.getElementById("storyHeadline");
const storySubhead = document.getElementById("storySubhead");
const storyBody = document.getElementById("storyBody");
const statusText = document.getElementById("statusText");
const statusDetail = document.getElementById("statusDetail");
const mapTitle = document.getElementById("mapTitle");
const mapFrame = document.getElementById("mapFrame");
const factsList = document.getElementById("factsList");
const flareLabel = document.getElementById("flareLabel");
const tickerText = document.getElementById("tickerText");
const leadVisualCaption = document.getElementById("leadVisualCaption");
const updatesList = document.getElementById("updatesList");

function setStoryTime(date = new Date()) {
  if (!storyTime) {
    return;
  }

  storyTime.textContent = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildMapUrl(lat, lon) {
  const delta = 0.08;
  const minLon = clamp(lon - delta, -180, 180);
  const maxLon = clamp(lon + delta, -180, 180);
  const minLat = clamp(lat - delta, -85, 85);
  const maxLat = clamp(lat + delta, -85, 85);
  const params = new URLSearchParams({
    bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
    layer: "mapnik",
    marker: `${lat},${lon}`
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

async function reverseGeocode(lat, lon) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Reverse geocode failed with ${response.status}`);
  }

  return response.json();
}

function formatPlace(geo = {}) {
  const address = geo.address || {};
  const locality =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    address.state_district ||
    address.state ||
    "your area";
  const region = address.state || address.region || address.country || "";
  const display = [locality, region].filter(Boolean).join(", ");
  return {
    locality,
    region,
    display: display || "your area"
  };
}

function formatCoords(lat, lon) {
  return `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
}

function createParagraphs({ place, region, coords, localTime }) {
  const area = place || "your area";
  const regionalName = region || "the surrounding region";

  return [
    `Reports in this fictional bulletin claim that an orderly formation of luminous craft drifted into view over ${area} at approximately ${localTime}, drawing crowds of completely invented onlookers to sidewalks, parking lots, and rooftops across ${regionalName}. The article is styled like local coverage, but the scenario itself is pure parody.`,
    `The mock account describes low amber light, synchronized turns, and a theatrical pause above the skyline before the craft allegedly continued deeper into the night. Coordinates ${coords} are included only to localize the page for the visitor, not to document a real incident.`,
    `According to the fabricated version of events, an imaginary interagency task force then advised residents to keep phone cameras ready, secure patio furniture, and avoid offering the visitors directions unless specifically asked. That guidance is, of course, invented along with the rest of the bulletin.`,
    `What is real is the location context: when permission is granted, the page uses browser geolocation, a nearby place label, and the live map at right to anchor the joke in your area. The reporting style is deliberate; the “invasion” is not.`
  ];
}

function createUpdates({ displayName, localTime }) {
  return [
    `Fictional witness chatter now references ${displayName || "the viewer's area"}.`,
    `Mock bulletin timestamp updated to ${localTime}.`,
    "Map module is using real location context while the incident narrative remains invented.",
    "Top banner and article notes continue to mark the page as parody."
  ];
}

function renderStory({ place, region, displayName, lat, lon, sourceLabel }) {
  const coords = typeof lat === "number" && typeof lon === "number" ? formatCoords(lat, lon) : "unknown";
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short"
  }).format(new Date());
  const placeText = place || "your area";

  heroHeadline.textContent = `Residents near ${placeText} reportedly spot mysterious craft in fictional local bulletin`;
  heroCopy.textContent =
    "This parody page borrows the pacing and visual grammar of a local breaking-news splash page while keeping the story itself explicitly fictional.";
  locationLine.textContent = displayName || "Localized parody bulletin";
  storyHeadline.textContent = `Unidentified lights reportedly gather above ${placeText} in fictional late-night dispatch`;
  storySubhead.textContent =
    `A localized parody bulletin styled like a newsroom special report, anchored around ${displayName || placeText} and repeatedly labeled fiction.`;

  const paragraphs = createParagraphs({
    place: placeText,
    region,
    coords,
    localTime
  });
  storyBody.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");

  statusText.textContent = "Localized parody ready";
  statusDetail.textContent = `Location source: ${sourceLabel}. Story copy uses that area label, then keeps the scenario clearly fictional.`;
  mapTitle.textContent = displayName || coords;
  flareLabel.textContent = displayName ? `Skywatch visual for ${displayName}` : "Localized visual ready";
  tickerText.textContent = `Parody bulletin updated for ${displayName || placeText}. Timestamp ${localTime}. The layout is newsroom-inspired; the scenario is invented.`;
  leadVisualCaption.textContent = `Synthetic lead image for ${displayName || placeText}. It is an illustrated simulation, not a real photograph or report.`;

  factsList.innerHTML = [
    `Area label: ${displayName || placeText}`,
    `Coordinates: ${coords}`,
    `Local bulletin time: ${localTime}`,
    "Mode: parody / fiction only"
  ]
    .map((item) => `<li>${item}</li>`)
    .join("");

  updatesList.innerHTML = createUpdates({ displayName: displayName || placeText, localTime })
    .map((item) => `<li>${item}</li>`)
    .join("");

  if (typeof lat === "number" && typeof lon === "number") {
    mapFrame.src = buildMapUrl(lat, lon);
    mapFrame.hidden = false;
  }
}

function renderDefaultStory() {
  setStoryTime();
  renderStory({
    place: "your area",
    region: "the surrounding region",
    displayName: "Generic mode",
    sourceLabel: "fallback copy"
  });
  statusText.textContent = "Ready to localize";
  statusDetail.textContent =
    "Grant location access for a localized parody article and a map centered on your approximate position.";
  mapTitle.textContent = "Map loads after location access";
  tickerText.textContent =
    "Parody bulletin ready. Allow location access to tailor the fictional dispatch to your nearby area.";
  mapFrame.removeAttribute("src");
  flareLabel.textContent = "Localized visual pending";
  leadVisualCaption.textContent =
    "Synthetic lead image placeholder. Once localized, the caption will reference your area while staying clearly fictional.";
}

async function localizeFromCoordinates(lat, lon, sourceLabel) {
  setStoryTime();
  statusText.textContent = "Resolving area name";
  statusDetail.textContent = "Using your approximate coordinates to request a nearby locality label.";

  try {
    const geo = await reverseGeocode(lat, lon);
    const place = formatPlace(geo);
    renderStory({
      place: place.locality,
      region: place.region,
      displayName: place.display || geo.display_name || "your area",
      lat,
      lon,
      sourceLabel
    });
  } catch {
    renderStory({
      place: "your area",
      region: "the surrounding region",
      displayName: `Approx. ${formatCoords(lat, lon)}`,
      lat,
      lon,
      sourceLabel
    });
    statusDetail.textContent =
      "Coordinates were available, but area-name lookup failed. The map still centers on the approximate location.";
  }
}

function requestLocation() {
  if (!navigator.geolocation) {
    statusText.textContent = "Geolocation unavailable";
    statusDetail.textContent =
      "This browser does not expose geolocation, so the page stays in generic parody mode.";
    return;
  }

  statusText.textContent = "Requesting location";
  statusDetail.textContent =
    "Your browser will ask for permission. If granted, the page rewrites the satire using your nearby area.";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      localizeFromCoordinates(latitude, longitude, "browser geolocation");
    },
    (error) => {
      statusText.textContent = "Location unavailable";
      statusDetail.textContent =
        error.code === error.PERMISSION_DENIED
          ? "Permission was denied, so the page remains generic. No location data was collected."
          : "The browser could not provide a location. The page remains in fallback parody mode.";
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000
    }
  );
}

setStoryTime();
renderDefaultStory();

if (locateButton) {
  locateButton.addEventListener("click", requestLocation);
}

if (demoButton) {
  demoButton.addEventListener("click", () => {
    localizeFromCoordinates(40.7128, -74.006, "demo location");
  });
}
