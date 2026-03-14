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
    `A localized observation brief places an orderly formation of luminous objects over ${area} at approximately ${localTime}, prompting residents across ${regionalName} to pause, compare vantage points, and watch for any repeat movement. The bulletin is framed as a developing situation, but it remains a speculative scenario rather than a verified incident log.`,
    `The working description notes low amber light, synchronized turns, and a sustained hold above the skyline before the objects continue deeper into the night. Coordinates ${coords} are included to anchor the page to a real place context, not to certify that an event has been confirmed.`,
    `In the scenario presented here, local officials and aviation contacts are described as reviewing camera angles, weather conditions, and ordinary flight corridors while asking residents to avoid blocking roads or emergency access points. Those procedural details are illustrative, included to keep the tone measured without implying an active public alert.`,
    `What is real is the localization layer: this version is anchored with ${locationSource}, nearby place names, the current local time, and the live map at right. The incident narrative is intentionally presented as an observation exercise and should not be read as verified reporting.`
  ];
}

function createUpdates({ displayName, localTime, sourceLabel }) {
  return [
    `Area context now references ${displayName || "the viewer's area"}.`,
    `Bulletin timestamp updated to ${localTime}.`,
    `Location source now reads as ${sourceLabel}.`,
    "Map module is centered on the best available local context.",
    "Scenario note remains attached to the bulletin."
  ];
}

function renderStory({ place, region, displayName, lat, lon, sourceLabel, precisionLabel }) {
  const coords = typeof lat === "number" && typeof lon === "number" ? formatCoords(lat, lon) : "unknown";
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short"
  }).format(new Date());
  const placeText = place || "your area";

  heroHeadline.textContent = `Observation brief for unusual aerial activity near ${placeText}`;
  heroCopy.textContent =
    "This page uses a restrained bulletin format, nearby place names, and live map context to stage a localized observation scenario.";
  locationLine.textContent = displayName || "Localized observation bulletin";
  storyHeadline.textContent = `Field brief: unusual aerial activity over ${placeText}`;
  storySubhead.textContent =
    `A location-aware observation brief anchored around ${displayName || placeText}, with live area context and explicit scenario labeling.`;

  const paragraphs = createParagraphs({
    place: placeText,
    region,
    coords,
    localTime,
    precisionLabel
  });
  storyBody.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");

  statusText.textContent = "Localized bulletin ready";
  statusDetail.textContent = `Location source: ${sourceLabel}. Story copy uses that area label while keeping the incident narrative clearly unverified.`;
  mapTitle.textContent = displayName || coords;
  flareLabel.textContent = displayName ? `Skywatch visual for ${displayName}` : "Localized visual ready";
  tickerText.textContent = `Bulletin updated for ${displayName || placeText}. Timestamp ${localTime}. Local context is live; the incident narrative remains unverified.`;
  leadVisualCaption.textContent = `Illustrative lead image for ${displayName || placeText}. It is not documentary photography or a confirmed incident record.`;

  factsList.innerHTML = [
    `Area label: ${displayName || placeText}`,
    `Coordinates: ${coords}`,
    `Local bulletin time: ${localTime}`,
    `Location source: ${sourceLabel}`,
    "Mode: speculative scenario"
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
    "Bulletin is checking local context automatically. Exact location remains available by button.";
  flareLabel.textContent = "Localized visual pending";
  leadVisualCaption.textContent =
    "Illustrative lead image placeholder. Once localized, the caption will reference your area while remaining clearly unverified.";
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
