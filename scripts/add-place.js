#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const PLACES_FILE = path.join(ROOT, "data", "places.js");
const VALID_PEOPLE = new Set(["예담", "정우", "진서", "현승", "두림"]);
const VALID_CATEGORIES = new Set(["볼거리", "산책", "쇼핑", "맛집", "카페", "체험"]);

function usage() {
  console.log(`
Usage:
  node scripts/add-place.js --url "<Google Maps URL>" --people "예담,정우" [options]

Options:
  --name "장소명"       Google Maps URL에서 이름을 못 읽을 때 직접 지정
  --city "후쿠오카"    기본값: 미분류
  --area "텐진"        기본값: 미분류
  --category "쇼핑"    기본값: 볼거리
  --note "메모"        기본값: 추가한 후보지
  --dry-run            places.js를 쓰지 않고 추가될 항목만 출력

Examples:
  node scripts/add-place.js --url "https://www.google.com/maps/place/..." --people "예담"
  node scripts/add-place.js --url "https://maps.app.goo.gl/..." --people "현승,두림" --category "맛집" --city "후쿠오카"
`.trim());
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`알 수 없는 인자입니다: ${token}`);
    const key = token.slice(2);
    if (key === "help" || key === "dry-run") {
      args[key] = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`--${key} 값이 필요합니다.`);
    args[key] = value;
    index += 1;
  }
  return args;
}

function normalizePeople(value) {
  if (!value) throw new Error("--people 값이 필요합니다.");
  const people = value.split(",").map(item => item.trim()).filter(Boolean);
  if (!people.length) throw new Error("--people 값이 비어 있습니다.");
  const invalid = people.filter(person => !VALID_PEOPLE.has(person));
  if (invalid.length) throw new Error(`알 수 없는 people 값입니다: ${invalid.join(", ")}`);
  return [...new Set(people)];
}

function validateCategory(value) {
  const category = value || "볼거리";
  if (!VALID_CATEGORIES.has(category)) {
    throw new Error(`category는 ${[...VALID_CATEGORIES].join(", ")} 중 하나여야 합니다.`);
  }
  return category;
}

function decodePathPart(value) {
  return decodeURIComponent(value.replace(/\+/g, " ")).trim();
}

function parseCoordinatePair(value) {
  const match = String(value || "").match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return { lat: Number(match[1]), lng: Number(match[2]) };
}

function parseMapsUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("유효한 URL이 아닙니다.");
  }

  const pathname = decodeURIComponent(parsed.pathname);
  const placeMatch = pathname.match(/\/maps\/place\/([^/]+)/);
  const dataCoordinateMatch = rawUrl.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const atMatch = rawUrl.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),/);

  let coordinates = dataCoordinateMatch
    ? { lat: Number(dataCoordinateMatch[1]), lng: Number(dataCoordinateMatch[2]) }
    : atMatch ? { lat: Number(atMatch[1]), lng: Number(atMatch[2]) } : null;
  let name = placeMatch ? decodePathPart(placeMatch[1]) : "";

  for (const key of ["q", "query", "destination", "ll"]) {
    const value = parsed.searchParams.get(key);
    if (!coordinates) coordinates = parseCoordinatePair(value);
    if (!name && value && !parseCoordinatePair(value)) name = decodePathPart(value);
  }

  return { name, coordinates };
}

async function resolveShortUrl(rawUrl) {
  const host = new URL(rawUrl).hostname;
  if (!/(^|\.)maps\.app\.goo\.gl$|(^|\.)goo\.gl$/.test(host)) return rawUrl;

  try {
    const response = await fetch(rawUrl, { method: "GET", redirect: "follow" });
    return response.url || rawUrl;
  } catch {
    return rawUrl;
  }
}

function loadPlaces() {
  const source = fs.readFileSync(PLACES_FILE, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: PLACES_FILE });
  const places = sandbox.window.TRIP_PLACES?.places;
  if (!Array.isArray(places)) throw new Error("data/places.js에서 places 배열을 읽지 못했습니다.");
  return places;
}

function quote(value) {
  return JSON.stringify(value);
}

function formatPlace(place) {
  const fields = [
    `name:${quote(place.name)}`,
    place.aliases ? `aliases:${quote(place.aliases)}` : null,
    `city:${quote(place.city)}`,
    `area:${quote(place.area)}`,
    `category:${quote(place.category)}`,
    `people:[${place.people.map(quote).join(",")}]`,
    `lat:${place.lat}`,
    `lng:${place.lng}`,
    `note:${quote(place.note)}`,
    place.mapUrl ? `mapUrl:${quote(place.mapUrl)}` : null
  ].filter(Boolean);
  return `    { ${fields.join(", ")} }`;
}

function formatPlacesFile(places) {
  return `/*
 * 여행 후보지 데이터 스키마 v1
 * - 새 후보지는 places 배열에 추가합니다.
 * - name은 일정 데이터의 item.placeName과 매칭되므로 고유하게 유지합니다.
 * - 필수값: name, city, area, category, people, lat, lng, note
 * - 선택값: aliases, mapUrl
 */
window.TRIP_PLACES = {
  schemaVersion: 1,
  places: [
${places.map(formatPlace).join(",\n")}
  ]
};
`;
}

function mergePeople(current, next) {
  return [...new Set([...(current || []), ...next])];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const rawUrl = args.url;
  if (!rawUrl) throw new Error("--url 값이 필요합니다.");

  const people = normalizePeople(args.people);
  const finalUrl = await resolveShortUrl(rawUrl);
  const parsed = parseMapsUrl(finalUrl);
  const directParsed = finalUrl === rawUrl ? parsed : parseMapsUrl(rawUrl);
  const coordinates = parsed.coordinates || directParsed.coordinates;
  const name = args.name || parsed.name || directParsed.name;

  if (!name) throw new Error("장소명을 URL에서 찾지 못했습니다. --name 값을 추가해주세요.");
  if (!coordinates) throw new Error("좌표를 URL에서 찾지 못했습니다. 구글맵에서 공유한 장소 URL이나 @lat,lng가 포함된 URL을 넣어주세요.");

  const places = loadPlaces();
  const existing = places.find(place => place.name === name || place.mapUrl === rawUrl || place.mapUrl === finalUrl);
  const nextPlace = {
    name,
    city: args.city || existing?.city || "미분류",
    area: args.area || existing?.area || "미분류",
    category: validateCategory(args.category || existing?.category),
    people: mergePeople(existing?.people, people),
    lat: Number(coordinates.lat.toFixed(7)),
    lng: Number(coordinates.lng.toFixed(7)),
    note: args.note || existing?.note || "추가한 후보지",
    mapUrl: rawUrl
  };

  let nextPlaces;
  if (existing) {
    nextPlaces = places.map(place => (place === existing ? { ...existing, ...nextPlace } : place));
    console.log(`기존 장소를 업데이트합니다: ${name}`);
  } else {
    nextPlaces = [...places, nextPlace];
    console.log(`새 장소를 추가합니다: ${name}`);
  }

  console.log(formatPlace(nextPlace).trim());
  if (args["dry-run"]) return;

  fs.writeFileSync(PLACES_FILE, formatPlacesFile(nextPlaces), "utf8");
  console.log(`완료: data/places.js (${nextPlaces.length}곳)`);
}

main().catch(error => {
  console.error(`오류: ${error.message}`);
  usage();
  process.exit(1);
});
