#!/usr/bin/env node
/**
 * buildMetadata.js
 * ------------------------------------------------------------------
 * Run this script manually (or from a scheduled GitHub Action) to update
 * Data/metadataCache.json.
 *
 * This script runs with Node and is not part of the running service. Commit
 * and push the updated metadataCache.json so main.js can read it at startup.
 *
 * It is incremental: it only retrieves TMDb data for items missing from the
 * cache, avoiding a full rebuild every time.
 *
 * Usage:
 *   node scripts/buildMetadata.js            -> process new items only
 *   node scripts/buildMetadata.js --refresh  -> refresh every item
 *   node scripts/buildMetadata.js --refresh tt1270798,tt0371746
 *                                             -> refresh specified IDs only
 * ------------------------------------------------------------------
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import pLimit from "p-limit";

import chronologicalData from "../Data/chronologicalData.js";
import releaseData from "../Data/releaseData.js";
import xmenData from "../Data/xmenData.js";
import moviesData from "../Data/moviesData.js";
import seriesData from "../Data/seriesData.js";
import animationsData from "../Data/animationsData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TMDB_KEY = process.env.TMDB_API_KEY;
if (!TMDB_KEY) {
  console.error(
    "CRITICAL: TMDB_API_KEY is not set. Define it in .env or as an environment variable.",
  );
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, "..", "Data");
const CACHE_PATH = path.join(DATA_DIR, "metadataCache.json");

const dataSources = {
  chronologicalData,
  releaseData,
  xmenData,
  moviesData,
  seriesData,
  animationsData,
};

function collectAllItems() {
  const seen = new Map();
  for (const items of Object.values(dataSources)) {
    for (const item of items) {
      const lookupId = item.imdbId || item.id;
      if (lookupId && !seen.has(lookupId)) {
        seen.set(lookupId, item);
      }
    }
  }
  return [...seen.values()];
}

function loadCache() {
  if (fs.existsSync(CACHE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    } catch (err) {
      console.warn(
        "Existing cache is invalid; starting from scratch:",
        err.message,
      );
    }
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function isValidUrl(str) {
  try {
    new URL(str);
    return str && str !== "N/A" && !str.includes("undefined");
  } catch {
    return false;
  }
}

async function fetchOne(item) {
  const type = item.type || "movie";
  const lookupId = item.imdbId || item.id;
  const title = item.title;

  try {
    let tmdbData = {};
    let tmdbImagesData = {};
    let effectiveTmdbId = item.tmdbId || null;

    if (!effectiveTmdbId) {
      const searchUrl = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&year=${item.releaseYear || ""}`;
      const searchRes = await axios.get(searchUrl).catch(() => ({ data: {} }));
      effectiveTmdbId = searchRes.data?.results?.[0]?.id || null;
    }

    if (effectiveTmdbId) {
      const [detailsRes, imagesRes] = await Promise.all([
        axios
          .get(
            `https://api.themoviedb.org/3/${type}/${effectiveTmdbId}?api_key=${TMDB_KEY}&language=en-US`,
          )
          .catch(() => ({ data: {} })),
        axios
          .get(
            `https://api.themoviedb.org/3/${type}/${effectiveTmdbId}/images?api_key=${TMDB_KEY}`,
          )
          .catch(() => ({ data: {} })),
      ]);
      tmdbData = detailsRes.data || {};
      tmdbImagesData = imagesRes.data || {};
    }

    let poster = null;
    if (item.poster && isValidUrl(item.poster)) {
      poster = item.poster;
    } else if (tmdbData.poster_path) {
      poster = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
    } else {
      poster =
        "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg";
    }

    let logoUrl = null;
    if (tmdbImagesData.logos?.length) {
      const bestLogo =
        tmdbImagesData.logos.find((l) => l.iso_639_1 === "en") ||
        tmdbImagesData.logos[0];
      if (bestLogo?.file_path)
        logoUrl = `https://image.tmdb.org/t/p/original${bestLogo.file_path}`;
    }

    return {
      id: lookupId,
      type,
      name: type === "series" ? title.replace(/ Season \d+/, "") : title,
      logo: logoUrl,
      poster,
      description:
        item.description || tmdbData.overview || "No description available.",
      releaseInfo:
        item.releaseYear ||
        (tmdbData.release_date || tmdbData.first_air_date || "").split(
          "-",
        )[0] ||
        "N/A",
      imdbRating: tmdbData.vote_average
        ? tmdbData.vote_average.toFixed(1)
        : "N/A",
      genres: tmdbData.genres?.map((g) => g.name) ||
        item.genres?.map((g) => g.name) || ["Action", "Adventure"],
      tmdbId: effectiveTmdbId || null,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  } catch (err) {
    console.error(`Failed to process ${title} (${lookupId}): ${err.message}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const forceRefresh = args.includes("--refresh");
  const explicitIdsArg = args.find((a) => !a.startsWith("--"));
  const explicitIds = explicitIdsArg
    ? explicitIdsArg.split(",").map((s) => s.trim())
    : null;

  const allItems = collectAllItems();
  const cache = loadCache();

  const toProcess = allItems.filter((item) => {
    const lookupId = item.imdbId || item.id;
    if (!lookupId) return false;
    if (explicitIds) return explicitIds.includes(lookupId);
    if (forceRefresh) return true;
    return !cache[lookupId];
  });

  console.log(`Total unique catalog items: ${allItems.length}`);
  console.log(
    `Items to process: ${toProcess.length} (${forceRefresh ? "forced refresh" : "new or missing only"})`,
  );

  if (toProcess.length === 0) {
    console.log("Nothing to do. The cache is up to date.");
    return;
  }

  const limit = pLimit(5);
  let done = 0;
  const results = await Promise.all(
    toProcess.map((item) =>
      limit(async () => {
        const meta = await fetchOne(item);
        done++;
        process.stdout.write(`\r${done}/${toProcess.length} processed`);
        return meta;
      }),
    ),
  );

  console.log("");

  for (const meta of results) {
    if (meta) cache[meta.id] = meta;
  }

  saveCache(cache);
  console.log(
    `Cache saved to ${CACHE_PATH} with ${Object.keys(cache).length} items total.`,
  );
}

main().catch((err) => {
  console.error("Fatal build error:", err);
  process.exit(1);
});
