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
const IP_GEOLOCATION_URL = "https://free.freeipapi.com/api/json";

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

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatIpPlace(payload = {}) {
  const city = String(payload.cityName || payload.city || "").trim();
  const region = String(payload.regionName || payload.region || "").trim();
  const country = String(payload.countryName || payload.country_name || "").trim();
  const locality = city || region || country || "your area";
  const display = [city, region, country].filter(Boolean);
  return {
    locality,
    region: region || country || "the surrounding region",
    display: display.join(", ") || locality
  };
}

function createParagraphs({ place, region, coords, localTime, precisionLabel }) {
  const area = place || "your area";
  const regionalName = region || "the surrounding region";
  const locationSource = precisionLabel || "localized context";

  return [
    `Reports in this fictional bulletin claim that an orderly formation of luminous craft drifted into view over ${area} at approximately ${localTime}, drawing crowds of completely invented onlookers to sidewalks, parking lots, and rooftops across ${regionalName}. The article is styled like local coverage, but the scenario itself is pure parody.`,
    `The mock account describes low amber light, synchronized turns, and a theatrical pause above the skyline before the craft allegedly continued deeper into the night. Coordinates ${coords} are included only to localize the page for the visitor, not to document a real incident.`,
    `According to the fabricated version of events, an imaginary interagency task force then advised residents to keep phone cameras ready, secure patio furniture, and avoid offering the visitors directions unless specifically asked. That guidance is, of course, invented along with the rest of the bulletin.`,
    `What is real is the location context: this version is anchored with ${locationSource}, a nearby place label, and the live map at right to stage the joke in your area. The reporting style is deliberate; the “invasion” is not.`
  ];
}

function createUpdates({ displayName, localTime, sourceLabel }) {
  return [
    `Fictional witness chatter now references ${displayName || "the viewer's area"}.`,
    `Mock bulletin timestamp updated to ${localTime}.`,
    `Location source now reads as ${sourceLabel}.`,
    "Map module is using real location context while the incident narrative remains invented.",
    "Top banner and article notes continue to mark the page as parody."
  ];
}

function renderStory({ place, region, displayName, lat, lon, sourceLabel, precisionLabel }) {
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
    localTime,
    precisionLabel
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
    `Location source: ${sourceLabel}`,
    "Mode: parody / fiction only"
  ]
    .map((item) => `<li>${item}</li>`)
    .join("");

  updatesList.innerHTML = createUpdates({
    displayName: displayName || placeText,
    localTime,
    sourceLabel
  })
    .map((item) => `<li>${item}</li>`)
    .join("");

  if (typeof lat === "number" && typeof lon === "number") {
    mapFrame.src = buildMapUrl(lat, lon);
    mapFrame.hidden = false;
    return;
  }

  mapFrame.hidden = true;
  mapFrame.removeAttribute("src");
}

function renderDefaultStory() {
  setStoryTime();
  renderStory({
    place: "your area",
    region: "the surrounding region",
    displayName: "Generic mode",
    sourceLabel: "fallback copy",
    precisionLabel: "generic fallback copy"
  });
  statusText.textContent = "Checking location context";
  statusDetail.textContent =
    "Trying automatic localization. If exact geolocation is unavailable, the page will fall back to a rough IP-based area lookup.";
  mapTitle.textContent = "Map loads after location access";
  tickerText.textContent =
    "Parody bulletin is checking your location context automatically. Exact location remains available by button.";
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
      sourceLabel,
      precisionLabel: "browser geolocation"
    });
  } catch {
    renderStory({
      place: "your area",
      region: "the surrounding region",
      displayName: `Approx. ${formatCoords(lat, lon)}`,
      lat,
      lon,
      sourceLabel,
      precisionLabel: "approximate browser coordinates"
    });
    statusDetail.textContent =
      "Coordinates were available, but area-name lookup failed. The map still centers on the approximate location.";
  }
}

function readPrecisePosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000
    });
  });
}

async function localizeFromIp() {
  statusText.textContent = "Estimating rough area";
  statusDetail.textContent =
    "Using IP-based geolocation to infer an approximate city or region without prompting for exact location.";

  const response = await fetch(IP_GEOLOCATION_URL, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`IP geolocation failed with ${response.status}`);
  }

  const payload = await response.json();
  if (payload?.error) {
    throw new Error(payload.reason || "IP geolocation failed");
  }

  const place = formatIpPlace(payload);
  const lat = toNumber(payload.latitude);
  const lon = toNumber(payload.longitude);

  renderStory({
    place: place.locality,
    region: place.region,
    displayName: place.display,
    lat,
    lon,
    sourceLabel: "approximate IP geolocation",
    precisionLabel: "approximate IP geolocation"
  });

  statusDetail.textContent =
    "Location source: approximate IP geolocation. This is a rough city-or-region estimate gathered without prompting for exact browser location.";
  mapTitle.textContent = lat !== null && lon !== null ? place.display : "Approximate area";
}

async function requestLocation() {
  if (!navigator.geolocation) {
    statusText.textContent = "Geolocation unavailable";
    statusDetail.textContent =
      "This browser does not expose geolocation, so the page is using the rough IP-based fallback when available.";
    return;
  }

  statusText.textContent = "Requesting exact location";
  statusDetail.textContent =
    "Your browser will ask for permission. If granted, the page upgrades from rough area context to exact browser geolocation.";

  try {
    const position = await readPrecisePosition();
    const { latitude, longitude } = position.coords;
    await localizeFromCoordinates(latitude, longitude, "browser geolocation");
  } catch (error) {
    try {
      await localizeFromIp();
      statusDetail.textContent =
        error?.code === error.PERMISSION_DENIED
          ? "Exact browser location was denied, so the page fell back to a rough IP-based area estimate."
          : "Exact browser location failed, so the page fell back to a rough IP-based area estimate.";
    } catch {
      statusText.textContent = "Location unavailable";
      statusDetail.textContent =
        error?.code === error.PERMISSION_DENIED
          ? "Permission was denied and the IP-based fallback also failed. The page remains generic."
          : "The browser could not provide a location and the IP-based fallback also failed. The page remains generic.";
    }
  }
}

async function autoLocalize() {
  if ("permissions" in navigator && typeof navigator.permissions.query === "function") {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "granted") {
        statusText.textContent = "Loading exact location";
        statusDetail.textContent =
          "Geolocation permission is already granted in this browser, so the page is loading precise area context automatically.";
        try {
          const position = await readPrecisePosition();
          const { latitude, longitude } = position.coords;
          await localizeFromCoordinates(latitude, longitude, "browser geolocation");
          return;
        } catch {
          // Fall through to IP-based fallback below.
        }
      }
    } catch {
      // Continue with fallback path when Permissions API is unavailable or blocked.
    }
  }

  try {
    await localizeFromIp();
  } catch {
    statusText.textContent = "Automatic localization unavailable";
    statusDetail.textContent =
      "Exact geolocation was not already granted and the rough IP-based lookup failed. You can still use the exact-location button.";
  }
}

setStoryTime();
renderDefaultStory();
autoLocalize();

if (locateButton) {
  locateButton.addEventListener("click", requestLocation);
}

if (demoButton) {
  demoButton.addEventListener("click", () => {
    localizeFromCoordinates(40.7128, -74.006, "demo location");
  });
}
