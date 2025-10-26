// mongodb-seed-got-real-100series.js
// Seed script for MongoDB (media_dev)
// - 3 users (admin, user, test)
// - ~70 movies (sample real titles)
// - 100 series (real titles list + Extra Series to reach 100)
// - For Game of Thrones: real episode titles for all 8 seasons
// - For other series: 5 seasons each with generated SxEx episode titles
//
// Usage:
//   mongosh "mongodb://localhost:27017/media_dev" < mongodb-seed-got-real-100series.js
//
// NOTE: This file may be large but kept manageable by using placeholders for most episode titles
// and only using official titles for Game of Thrones as requested.

print("Cleaning collections...");
db.users.deleteMany({});
db.movies.deleteMany({});
db.series.deleteMany({});
db.seasons.deleteMany({});
db.episodes.deleteMany({});
db.ratings.deleteMany({});
print("Collections cleaned");

print("Inserting users...");
db.users.insertMany([
  {
    _id: "id0001",
    email: "admin@example.com",
    username: "admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    favorites: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "id0002",
    email: "user@example.com",
    username: "user",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "user",
    favorites: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "id0003",
    email: "test@example.com",
    username: "testuser",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "user",
    favorites: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
print("3 users inserted");

print("Inserting movies (~70 sample titles)...");
const movieTitles = [
"Shawshank Redemption","The Godfather","The Godfather Part II","The Dark Knight","12 Angry Men",
"Schindler's List","The Lord of the Rings: The Return of the King","Pulp Fiction","The Good, the Bad and the Ugly",
"Fight Club","Forrest Gump","Inception","The Lord of the Rings: The Fellowship of the Ring","Star Wars: Episode V - The Empire Strikes Back",
"The Matrix","Goodfellas","One Flew Over the Cuckoo's Nest","Se7en","The Silence of the Lambs","City of God",
"Saving Private Ryan","Spirited Away","The Green Mile","Life Is Beautiful","The Usual Suspects","L\u00e9on: The Professional",
"Interstellar","Parasite","The Lion King","The Pianist","Terminator 2: Judgment Day","Back to the Future",
"Whiplash","Gladiator","The Departed","Memento","Apocalypse Now","Alien","The Prestige","The Intouchables",
"Once Upon a Time in the West","Casablanca","The Great Dictator","Raiders of the Lost Ark","Toy Story","Am\u00e9lie",
"Braveheart","Inglourious Basterds","Django Unchained","The Shining","WALL\u00b7E","Oldboy","Princess Mononoke",
"Coco","The Truman Show","Blade Runner 2049","Mad Max: Fury Road","The Wolf of Wall Street",
"Joker","A Clockwork Orange","Avengers: Infinity War","Avengers: Endgame","The Social Network","Her","Logan",
"The Grand Budapest Hotel","Moonlight","Spotlight","The Hunt","Inside Out","The Revenant","Black Swan","Edge of Tomorrow"
];
for (let i = movieTitles.length; i < 70; i++) {
  movieTitles.push("Extra Movie " + (i+1));
}
const movies = movieTitles.map((t, idx) => ({
  _id: `id${String(idx + 100).padStart(4, '0')}`,
  title: t,
  genres: ["Drama"],
  synopsis: `Synopsis for ${t}`,
  releaseDate: new Date(1980 + (idx % 40) + "-01-01"),
  durationMin: 80 + (idx % 60),
  createdAt: new Date(),
  updatedAt: new Date()
}));
db.movies.insertMany(movies);
print("Movies inserted: " + db.movies.countDocuments());

print("Inserting 100 series...");
const seriesTitles = [
"Breaking Bad","Game of Thrones","Stranger Things","The Office (US)","Friends","The Simpsons","The Crown","The Mandalorian",
"Sherlock","Better Call Saul","Westworld","The Walking Dead","Black Mirror","Lost","House of Cards","Narcos",
"Community","Peaky Blinders","Fargo","Ozark","Dexter","The Boys","Money Heist","Homeland","Chernobyl","True Detective",
"Boardwalk Empire","Mr. Robot","Vikings","The Handmaid's Tale","The Marvelous Mrs. Maisel","The Witcher","Brooklyn Nine-Nine",
"How I Met Your Mother","Arrested Development","Seinfeld","Silicon Valley","Parks and Recreation","Mad Men","Killing Eve",
"Mindhunter","The Expanse","Avatar: The Last Airbender","Supernatural","Doctor Who","Frasier","Gotham","Lucifer","Empire",
"NCIS","Bull","The Blacklist","Sons of Anarchy","Blue Bloods","House","Smallville","Alias","24","Prison Break","The Sopranos",
"Battlestar Galactica","The X-Files","True Blood","Band of Brothers","Deadwood","The Americans","Rome","Person of Interest",
"Midsomer Murders","Downton Abbey","The Leftovers","Hannibal","Sherlock Holmes (Modern)","The Newsroom","Ray Donovan","The Wire",
"Lost Girl","White Collar","The Protector","Money Heist: Korea","Yellowstone","The Shield","Californication","Lucifer Morningstar",
"The Good Place","GLOW","The OA","Stargate SG-1","Fringe","24: Legacy","Elementary","The 100","Supergirl","Lucid","Bosch"
];
for (let i = seriesTitles.length; i < 100; i++) {
  seriesTitles.push("Extra Series " + (i+1));
}
let seriesDocs = [];
for (let i = 0; i < 100; i++) {
  seriesDocs.push({
    _id: `id${String(i + 200).padStart(4, '0')}`,
    title: seriesTitles[i],
    genres: ["Drama"],
    status: "ongoing",
    createdAt: new Date(),
    updatedAt: new Date()
  });
}
const insertedSeries = db.series.insertMany(seriesDocs);
print("Series inserted: " + db.series.countDocuments());

print("📅 Creating seasons: 8 seasons for Game of Thrones, 5 seasons for others...");
let seasonsDocs = [];
const seriesIds = seriesDocs.map(s => s._id);
let seasonCounter = 300;
// create seasons
for (let i = 0; i < seriesIds.length; i++) {
  const title = seriesTitles[i];
  if (title === "Game of Thrones") {
    // create 8 seasons for GOT
    for (let s = 1; s <= 8; s++) {
      seasonsDocs.push({ 
        _id: `id${String(seasonCounter++).padStart(4, '0')}`,
        seriesId: seriesIds[i], 
        seasonNo: s, 
        episodes: 0,
        createdAt: new Date(), 
        updatedAt: new Date() 
      });
    }
  } else {
    // create 5 seasons for other series
    for (let s = 1; s <= 5; s++) {
      seasonsDocs.push({ 
        _id: `id${String(seasonCounter++).padStart(4, '0')}`,
        seriesId: seriesIds[i], 
        seasonNo: s, 
        episodes: 0,
        createdAt: new Date(), 
        updatedAt: new Date() 
      });
    }
  }
}
const insertedSeasons = db.seasons.insertMany(seasonsDocs);
print("Seasons inserted: " + db.seasons.countDocuments());

print("Inserting episodes: real titles for Game of Thrones, placeholders for others...");
const seasonIds = seasonsDocs.map(s => s._id);
let episodesBatch = [];
let episodeCounter = 1000;
let ptr = 0;

// Game of Thrones episode titles (seasons 1..8)
const gotSeasons = [
  // Season 1 (10)
  ["Winter Is Coming","The Kingsroad","Lord Snow","Cripples, Bastards, and Broken Things","The Wolf and the Lion","A Golden Crown","You Win or You Die","The Pointy End","Baelor","Fire and Blood"],
  // Season 2 (10)
  ["The North Remembers","The Night Lands","What Is Dead May Never Die","Garden of Bones","The Ghost of Harrenhal","The Old Gods and the New","A Man Without Honor","The Prince of Winterfell","Blackwater","Valar Morghulis"],
  // Season 3 (10)
  ["Valar Dohaeris","Dark Wings, Dark Words","Walk of Punishment","And Now His Watch Is Ended","Kissed by Fire","The Climb","The Bear and the Maiden Fair","Second Sons","The Rains of Castamere","Mhysa"],
  // Season 4 (10)
  ["Two Swords","The Lion and the Rose","Breaker of Chains","Oathkeeper","First of His Name","The Laws of Gods and Men","Mockingbird","The Mountain and the Viper","The Watchers on the Wall","The Children"],
  // Season 5 (10)
  ["The Wars to Come","The House of Black and White","High Sparrow","Sons of the Harpy","Kill the Boy","Unbowed, Unbent, Unbroken","The Gift","Hardhome","The Dance of Dragons","Mother's Mercy"],
  // Season 6 (10)
  ["The Red Woman","Home","Oathbreaker","Book of the Stranger","The Door","Blood of My Blood","The Broken Man","No One","Battle of the Bastards","The Winds of Winter"],
  // Season 7 (7)
  ["Dragonstone","Stormborn","The Queen's Justice","The Spoils of War","Eastwatch","Beyond the Wall","The Dragon and the Wolf"],
  // Season 8 (6)
  ["Winterfell","A Knight of the Seven Kingdoms","The Long Night","The Last of the Starks","The Bells","The Iron Throne"]
];

// iterate series and seasons to create episodes
for (let si = 0; si < seriesIds.length; si++) {
  const name = seriesTitles[si];
  const seasonsForThisSeries = (name === "Game of Thrones") ? 8 : 5;
  for (let s = 1; s <= seasonsForThisSeries; s++) {
    const seasonId = seasonIds[ptr++];
    if (name === "Game of Thrones") {
      const titles = gotSeasons[s-1] || [];
      for (let e = 0; e < titles.length; e++) {
        episodesBatch.push({
          _id: `id${String(episodeCounter++).padStart(4, '0')}`,
          seriesId: seriesIds[si],
          seasonId: seasonId,
          epNo: e+1,
          title: titles[e],
          durationMin: 50 + Math.floor(Math.random()*20),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } else {
      // placeholder episodes: 8..12 episodes per season
      const epCount = 8 + Math.floor(Math.random()*5);
      for (let e = 1; e <= epCount; e++) {
        episodesBatch.push({
          _id: `id${String(episodeCounter++).padStart(4, '0')}`,
          seriesId: seriesIds[si],
          seasonId: seasonId,
          epNo: e,
          title: `${name} S${s}E${e}`,
          durationMin: 20 + Math.floor(Math.random()*41),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }
}

// insert episodes in batches to avoid memory issues
for (let i = 0; i < episodesBatch.length; i += 1000) {
  const batch = episodesBatch.slice(i, i + 1000);
  db.episodes.insertMany(batch);
  print(`Inserted episodes ${i+1}..${i+batch.length}`);
}
print("Episodes inserted: " + db.episodes.countDocuments());

print("Generating ratings (movies + sample episode ratings)...");
const usersArr = db.users.find().toArray();
const moviesArr = db.movies.find().toArray();
const episodesArr = db.episodes.find().toArray();
let ratingsDocs = [];
let ratingCounter = 2000;
// Movie ratings: each user rates each movie
for (let mi = 0; mi < moviesArr.length; mi++) {
  for (let ui = 0; ui < usersArr.length; ui++) {
    const score = Math.round((1 + Math.random() * 9) * 10) / 10;
    ratingsDocs.push({
      _id: `id${String(ratingCounter++).padStart(4, '0')}`,
      userId: usersArr[ui]._id,
      target: "movie",
      targetId: moviesArr[mi]._id,
      score: score,
      review: `Review by ${usersArr[ui].username} for ${moviesArr[mi].title}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
// Episode ratings: sample first 500 episodes (or all if fewer)
const sampleCount = Math.min(500, episodesArr.length);
for (let ei = 0; ei < sampleCount; ei++) {
  for (let ui = 0; ui < usersArr.length; ui++) {
    const score = Math.round((1 + Math.random() * 9) * 10) / 10;
    ratingsDocs.push({
      _id: `id${String(ratingCounter++).padStart(4, '0')}`,
      userId: usersArr[ui]._id,
      target: "episode",
      targetId: episodesArr[ei]._id,
      score: score,
      review: `Episode review`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
// insert ratings in batches
for (let i = 0; i < ratingsDocs.length; i += 1000) {
  const batch = ratingsDocs.slice(i, i + 1000);
  db.ratings.insertMany(batch);
  print(`Inserted ratings ${i+1}..${i+batch.length}`);
}
print("Ratings inserted: " + db.ratings.countDocuments());

print("Creating indexes...");
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.movies.createIndex({ title: 1 });
db.movies.createIndex({ genres: 1 });
db.series.createIndex({ title: 1 });
db.seasons.createIndex({ seriesId: 1 });
db.seasons.createIndex({ seasonNo: 1 });
db.episodes.createIndex({ seriesId: 1 });
db.episodes.createIndex({ seasonId: 1 });
db.episodes.createIndex({ epNo: 1 });
db.ratings.createIndex({ userId: 1 });
db.ratings.createIndex({ targetId: 1 });
db.ratings.createIndex({ target: 1 });
db.ratings.createIndex({ score: 1 });
print("Indexes created");

print("SEED COMPLETED SUCCESSFULLY!");
print("Summary:");
print(" Users: " + db.users.countDocuments());
print(" Movies: " + db.movies.countDocuments());
print(" Series: " + db.series.countDocuments());
print(" Seasons: " + db.seasons.countDocuments());
print(" Episodes: " + db.episodes.countDocuments());
print(" Ratings: " + db.ratings.countDocuments());
