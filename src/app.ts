import express from 'express';
import type { Request, Response } from 'express';
import { Serie } from './models/Serie.ts';
import { Film } from './models/Film.ts';
import { User } from './models/User.ts';
import { Season } from './models/Season.ts';
import { Episode } from './models/Episode.ts';


const app = express();
const PORT = 3000;

// Middleware pour parser le JSON des requêtes
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from TypeScript + Express!');
});

app.post('/data', (req: Request, res: Response) => {
  const data = req.body;
  res.json({ received: data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Run with npm run dev

// Example Episode
console.log("---------------------");
const episode01 = new Episode("Winter Is Coming", 1, 62);
const episode02 = new Episode("The Kingsroad", 2, 56);
const episode03 = new Episode("Lord Snow", 3, 58);
const episode04 = new Episode("Cripples, Bastards, and Broken Things", 4, 56);
const episode05 = new Episode("The Wolf and the Lion", 5, 60);
console.log("Episode: " + episode01.getSummary());
console.log("Episode: " + episode02.getSummary());
console.log("Episode: " + episode03.getSummary());
console.log("Episode: " + episode04.getSummary());
console.log("Episode: " + episode05.getSummary());
console.log("---------------------");

// Example Season
const season1 = new Season(1, new Date("2011-04-17"));
season1.addEpisode(episode01);
season1.addEpisode(episode02);
season1.addEpisode(episode03);
season1.addEpisode(episode04);
season1.addEpisode(episode05);
console.log("Season: " + season1.getSummary());
console.log("---------------------");

// Example Serie
const mySerie = new Serie("Game of Thrones", "Fantasy", 2011, 9.5, "Finished");
mySerie.addSeason(season1);
console.log("Serie: " + mySerie.getSummary());
console.log("---------------------");

// Example Film
const myFilm = new Film("Avatar", "Sci-fi", 2009, 8.2, 162);
console.log("Film: " + myFilm.getSummary());
console.log("---------------------");

// Example User
const myUser = new User("user@gmail.com", "passord", "user");
console.log("User: " + myUser.getSummary());
console.log("---------------------");