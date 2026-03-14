const storyTime = document.getElementById("storyTime");
const heroHeadline = document.getElementById("heroHeadline");
const heroCopy = document.getElementById("heroCopy");
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
    `Residents in and around ${area} are described as tracking a slow-moving formation of luminous objects first noticed at approximately ${localTime}, with observers across ${regionalName} reporting long holds, coordinated turns, and repeated passes above the same stretch of sky.`,
    `Accounts gathered for the bulletin describe low amber light, minimal sound, and a measured drift across the skyline before the formation moved farther out over the region. Coordinates ${coords} keep the current desk map centered on the same area referenced in the dateline and field copy.`,
    `The bulletin describes local officials and aviation contacts reviewing weather conditions, known flight paths, and available camera angles while residents continue gathering along sidewalks, parking lots, and rooftop vantage points to follow the movement.`,
    `This edition is localized with ${locationSource}, nearby place names, the current local time, and the live map at right, allowing the desk to tighten the dateline and supporting notes as stronger regional context becomes available.`
  ];
}

function createUpdates({ displayName, localTime, sourceLabel }) {
  return [
    `Desk dateline now references ${displayName || "the current coverage area"}.`,
    `Bulletin timestamp updated to ${localTime}.`,
    `Source field now reads ${sourceLabel}.`,
    "Coverage map has been centered on the active reporting zone.",
    "Headline and field notes have been aligned with the latest area label."
  ];
}

function renderStory({ place, region, displayName, lat, lon, sourceLabel, precisionLabel }) {
  const coords = typeof lat === "number" && typeof lon === "number" ? formatCoords(lat, lon) : "unknown";
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short"
  }).format(new Date());
  const placeText = place || "your area";

  heroHeadline.textContent = `Aerial activity reports moving across ${placeText}`;
  heroCopy.textContent =
    "Midnight Signal is localizing an overnight bulletin around nearby place names, live map context, and a continuously updated desk timestamp.";
  locationLine.textContent = displayName || "Regional night watch";
  storyHeadline.textContent = `Night watch desk tracks reports over ${placeText}`;
  storySubhead.textContent =
    `Witness descriptions, area timing, and the live desk map are now centered on ${displayName || placeText}.`;

  const paragraphs = createParagraphs({
    place: placeText,
    region,
    coords,
    localTime,
    precisionLabel
  });
  storyBody.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");

  statusText.textContent = "Regional bulletin updated";
  statusDetail.textContent = `Source status: ${sourceLabel}. Story copy, timing, and map framing are aligned to that area label.`;
  mapTitle.textContent = displayName || coords;
  flareLabel.textContent = displayName ? `Desk composite for ${displayName}` : "Desk visual pending";
  tickerText.textContent = `Desk update: ${displayName || placeText} is now the active coverage area. Bulletin time ${localTime}. Map and field notes have been refreshed.`;
  leadVisualCaption.textContent = `Composite desk visual prepared for ${displayName || placeText} and the mapped coverage area.`;

  factsList.innerHTML = [
    `Area label: ${displayName || placeText}`,
    `Coordinates: ${coords}`,
    `Bulletin time: ${localTime}`,
    `Source status: ${sourceLabel}`
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
    displayName: "Night desk standby",
    sourceLabel: "fallback copy",
    precisionLabel: "generic fallback copy"
  });
  statusText.textContent = "Checking location context";
  statusDetail.textContent =
    "The desk is checking automatic localization. If precise geolocation is unavailable, the bulletin will fall back to a rough IP-based area lookup.";
  mapTitle.textContent = "Coverage map loads after localization";
  tickerText.textContent =
    "Desk is checking local context automatically and preparing the first regional update.";
  flareLabel.textContent = "Desk visual pending";
  leadVisualCaption.textContent =
    "Composite desk visual placeholder. Once localized, the caption will reference the active coverage area.";
}

async function localizeFromCoordinates(lat, lon, sourceLabel) {
  setStoryTime();
  statusText.textContent = "Resolving area name";
  statusDetail.textContent = "Using available coordinates to resolve the nearest locality label for the bulletin dateline.";

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
      "Coordinates were available, but the locality lookup failed. The map still centers on the approximate coverage area.";
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
    "Using IP-based geolocation to infer an approximate city or region for the current bulletin.";

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
    "Source status: approximate IP geolocation. This is a rough city-or-region estimate gathered without a precise browser location.";
  mapTitle.textContent = lat !== null && lon !== null ? place.display : "Approximate area";
}

async function autoLocalize() {
  if ("permissions" in navigator && typeof navigator.permissions.query === "function") {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "granted") {
        statusText.textContent = "Loading precise location";
        statusDetail.textContent =
          "Precise browser geolocation is already available, so the desk is loading a tighter area dateline automatically.";
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
      "Automatic localization did not return a usable area. The bulletin will remain in standby mode until a source resolves.";
  }
}

setStoryTime();
renderDefaultStory();
autoLocalize();

if (demoButton) {
  demoButton.addEventListener("click", () => {
    localizeFromCoordinates(40.7128, -74.006, "sample bulletin");
  });
}
