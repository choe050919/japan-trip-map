#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PLACES_FILE = path.join(ROOT, "data", "places.js");
const VALID_PEOPLE = new Set(["예담", "정우", "진서", "현승", "두림"]);
const VALID_CATEGORIES = new Set(["볼거리", "산책", "쇼핑", "맛집", "카페", "체험"]);

function usage() {
  console.log(`
Usage:
  GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv" node scripts/sync-places-from-sheet.js

Options:
  --url "CSV URL"      환경변수 대신 CSV URL 직접 지정
  --dry-run            data/places.js를 쓰지 않고 생성 결과만 검증

Required sheet columns:
  name, googleMapUrl, city, area, category, people, note, lat, lng

Optional sheet columns:
  aliases, enabled
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

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);
  return rows.filter(item => item.some(value => value.trim()));
}

function normalizeHeader(value) {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

function rowsToObjects(rows) {
  const [headerRow, ...bodyRows] = rows;
  if (!headerRow) throw new Error("CSV 헤더가 없습니다.");
  const headers = headerRow.map(normalizeHeader);
  return bodyRows.map(row => Object.fromEntries(headers.map((header, index) => [header, (row[index] || "").trim()])));
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
  if (!rawUrl) return {};
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return {};
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
  if (!rawUrl) return rawUrl;
  const host = new URL(rawUrl).hostname;
  if (!/(^|\.)maps\.app\.goo\.gl$|(^|\.)goo\.gl$/.test(host)) return rawUrl;

  const response = await fetch(rawUrl, { method: "GET", redirect: "follow" });
  return response.url || rawUrl;
}

function normalizePeople(value, rowNumber) {
  const people = String(value || "").split(",").map(item => item.trim()).filter(Boolean);
  if (!people.length) throw new Error(`${rowNumber}행: people 값이 필요합니다.`);
  const invalid = people.filter(person => !VALID_PEOPLE.has(person));
  if (invalid.length) throw new Error(`${rowNumber}행: 알 수 없는 people 값입니다: ${invalid.join(", ")}`);
  return [...new Set(people)];
}

function normalizeCategory(value, rowNumber) {
  const category = value || "볼거리";
  if (!VALID_CATEGORIES.has(category)) {
    throw new Error(`${rowNumber}행: category는 ${[...VALID_CATEGORIES].join(", ")} 중 하나여야 합니다.`);
  }
  return category;
}

function parseNumber(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function truthyEnabled(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return !["false", "no", "n", "0", "비활성", "숨김"].includes(normalized);
}

async function rowToPlace(row, index) {
  const rowNumber = index + 2;
  if (!truthyEnabled(row.enabled)) return null;

  const mapUrl = row.googlemapurl || row.mapurl || row.url || "";
  const finalUrl = mapUrl ? await resolveShortUrl(mapUrl) : "";
  const parsed = parseMapsUrl(finalUrl || mapUrl);
  const explicitLat = parseNumber(row.lat);
  const explicitLng = parseNumber(row.lng);
  const coordinates = explicitLat != null && explicitLng != null
    ? { lat: explicitLat, lng: explicitLng }
    : parsed.coordinates;

  const name = row.name || parsed.name;
  if (!name) throw new Error(`${rowNumber}행: name 값이 필요합니다.`);
  if (!coordinates) throw new Error(`${rowNumber}행 (${name}): lat/lng 또는 좌표가 포함된 googleMapUrl이 필요합니다.`);

  return {
    name,
    aliases: row.aliases || undefined,
    city: row.city || "미분류",
    area: row.area || "미분류",
    category: normalizeCategory(row.category, rowNumber),
    people: normalizePeople(row.people, rowNumber),
    lat: Number(coordinates.lat.toFixed(7)),
    lng: Number(coordinates.lng.toFixed(7)),
    note: row.note || "추가한 후보지",
    mapUrl: mapUrl || undefined
  };
}

function mergeDuplicates(places) {
  const merged = [];
  const byKey = new Map();

  places.forEach(place => {
    const key = place.name;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, place);
      merged.push(place);
      return;
    }
    existing.people = [...new Set([...existing.people, ...place.people])];
    existing.aliases ||= place.aliases;
    existing.mapUrl ||= place.mapUrl;
    existing.note = existing.note === "추가한 후보지" ? place.note : existing.note;
  });

  return merged;
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
 * - 새 후보지는 Google Sheets에서 관리하고 GitHub Actions로 동기화합니다.
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const csvUrl = args.url || process.env.GOOGLE_SHEET_CSV_URL;
  if (!csvUrl) throw new Error("GOOGLE_SHEET_CSV_URL 환경변수 또는 --url 값이 필요합니다.");

  const response = await fetch(csvUrl);
  if (!response.ok) throw new Error(`시트를 읽지 못했습니다: ${response.status} ${response.statusText}`);

  const csv = await response.text();
  const rows = rowsToObjects(parseCsv(csv));
  const places = mergeDuplicates((await Promise.all(rows.map(rowToPlace))).filter(Boolean));
  if (!places.length) throw new Error("생성할 장소가 없습니다.");

  const output = formatPlacesFile(places);
  if (args["dry-run"]) {
    console.log(`검증 완료: ${places.length}곳`);
    console.log(places.slice(0, 3).map(formatPlace).join("\n"));
    return;
  }

  fs.writeFileSync(PLACES_FILE, output, "utf8");
  console.log(`완료: data/places.js (${places.length}곳)`);
}

main().catch(error => {
  console.error(`오류: ${error.message}`);
  usage();
  process.exit(1);
});
