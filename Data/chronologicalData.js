import releaseData from "./releaseData.js";
import seriesData from "./seriesData.js";
import animationsData from "./animationsData.js";
import moviesData from "./moviesData.js";

const itemsByImdbId = new Map(
  [...releaseData, ...seriesData, ...animationsData]
    .filter((item) => item.imdbId)
    .map((item) => [item.imdbId, item]),
);

const oneShotIds = new Set([
  "tt3067038",
  "tt2011109",
  "tt2011118",
  "tt2247732",
  "tt3438640",
  "tt6016776",
  "tt6599818",
  "tt8023090",
]);
for (const item of moviesData) {
  if (oneShotIds.has(item.imdbId)) {
    itemsByImdbId.set(item.imdbId, item);
  }
}

itemsByImdbId.set("tt36042156", {
  title: "The Punisher: One Last Kill",
  type: "series",
  imdbId: "tt36042156",
  id: "marvel_tt36042156",
  releaseYear: "2026",
  poster: "https://image.tmdb.org/t/p/original/qQclTgLMDvGBuUBFGHRipxkEwWR.jpg",
});

const chronologicalOrder = [
  ["tt13968252", "Eyes of Wakanda"],
  ["tt0458339", "Captain America: The First Avenger"],
  ["tt3067038", "Marvel One-Shot: Agent Carter"],
  ["tt3475734", "Marvel's Agent Carter"],
  ["tt4154664", "Captain Marvel"],
  ["tt0371746", "Iron Man"],
  ["tt1228705", "Iron Man 2"],
  ["tt0800080", "Der unglaubliche Hulk"],
  ["tt2011109", "Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer"],
  ["tt0800369", "Thor"],
  ["tt2011118", "Marvel One-Shot: The Consultant"],
  ["tt0848228", "Marvel’s The Avengers"],
  ["tt2247732", "Marvel One-Shot: Item 47"],
  ["tt1981115", "Thor: The Dark Kingdom"],
  ["tt1300854", "Iron Man 3"],
  ["tt3438640", "Marvel One-Shot: All Hail the King"],
  ["tt1843866", "The Return of the First Avenger"],
  ["tt2015381", "Guardians of the Galaxy"],
  ["tt3896198", "Guardians of the Galaxy Vol. 2"],
  ["tt13623148", "I Am Groot – Staffel 1"],
  ["tt13623148", "I Am Groot – Staffel 2"],
  ["tt3322312", "Daredevil – Staffel 1"],
  ["tt2357547", "Jessica Jones – Staffel 1"],
  ["tt2395427", "Avengers: Age of Ultron"],
  ["tt0478970", "Ant-Man"],
  ["tt3322312", "Daredevil – Staffel 2"],
  ["tt3322314", "Luke Cage – Staffel 1"],
  ["tt3322310", "Iron Fist – Staffel 1"],
  ["tt4230076", "The Defenders"],
  ["tt3498820", "The First Avenger: Civil War"],
  ["tt3480822", "Black Widow"],
  ["tt6016776", "Marvel One-Shot: Team Thor"],
  ["tt6599818", "Marvel One-Shot: Team Thor: Part 2"],
  ["tt1825683", "Black Panther"],
  ["tt2250912", "Spider-Man: Homecoming"],
  ["tt5675620", "The Punisher – Staffel 1"],
  ["tt1211837", "Doctor Strange"],
  ["tt2357547", "Jessica Jones – Staffel 2"],
  ["tt3322314", "Luke Cage – Staffel 2"],
  ["tt3322310", "Iron Fist – Staffel 2"],
  ["tt3322312", "Daredevil – Staffel 3"],
  ["tt3501632", "Thor: Tag der Entscheidung"],
  ["tt8023090", "Marvel One-Shot: Team Darryl"],
  ["tt5675620", "The Punisher – Staffel 2"],
  ["tt2357547", "Jessica Jones – Staffel 3"],
  ["tt5095030", "Ant-Man and the Wasp"],
  ["tt4154756", "Avengers: Infinity War"],
  ["tt4154796", "Avengers: Endgame"],
  ["tt9140554", "Loki – Staffel 1"],
  ["tt10168312", "What If…? – Staffel 1"],
  ["tt16027014", "Marvel Zombies"],
  ["tt9140560", "WandaVision"],
  ["tt9376612", "Shang-Chi and the Legend of the Ten Rings"],
  ["tt9208876", "The Falcon and the Winter Soldier"],
  ["tt6320628", "Spider-Man: Far From Home"],
  ["tt9032400", "Eternals"],
  ["tt10872600", "Spider-Man: No Way Home"],
  ["tt9419884", "Doctor Strange in the Multiverse of Madness"],
  ["tt10160804", "Hawkeye"],
  ["tt10234724", "Moon Knight"],
  ["tt9114286", "Black Panther: Wakanda Forever"],
  ["tt13966962", "Echo"],
  ["tt10857160", "She-Hulk: Die Anwältin"],
  ["tt10857164", "Ms. Marvel"],
  ["tt10648342", "Thor: Love and Thunder"],
  ["tt13623126", "Ironheart"],
  ["tt15318872", "Werewolf by Night"],
  ["tt13623136", "The Guardians of the Galaxy Holiday Special"],
  ["tt10954600", "Ant-Man and the Wasp: Quantumania"],
  ["tt6791350", "Guardians of the Galaxy Vol. 3"],
  ["tt13157618", "Secret Invasion"],
  ["tt10676048", "The Marvels"],
  ["tt9140554", "Loki – Staffel 2"],
  ["tt10168312", "What If…? – Staffel 2"],
  ["tt6263850", "Deadpool & Wolverine"],
  ["tt15571732", "Agatha All Along"],
  ["tt10168312", "What If…? – Staffel 3"],
  ["tt18923754", "Daredevil: Born Again – Staffel 1"],
  ["tt14513804", "Captain America: Brave New World"],
  ["tt20969586", "Thunderbolts*"],
  ["tt10676052", "The Fantastic Four: First Steps"],
  ["tt21066182", "Wonder Man"],
  ["tt18923754", "Daredevil: Born Again – Staffel 2"],
  ["tt36042156", "The Punisher: One Last Kill"],
  ["tt22084616", "Spider-Man: Brand New Day"],
  ["tt23112594", "VisionQuest"],
  ["tt21357150", "Avengers: Doomsday"],
];

export default chronologicalOrder.map(([imdbId, title]) => {
  const item = itemsByImdbId.get(imdbId);
  if (!item) {
    throw new Error(`Chronological item not found for IMDb ID ${imdbId}`);
  }
  return { ...item, title };
});
