import fs from 'fs';


// ENV
const DBFILE = 'src/data/db.json';
const fileContent = fs.readFileSync(DBFILE, 'utf-8');
let jsonData = JSON.parse(fileContent);

// MEDIASS
let dbMedias = jsonData.medias;
export function getMediaFromJSON(type: "Film" | "Serie"): any[] {
    if (!type) throw new Error('Media type MUST be: "Film" or "Serie"');
    let medias = [];
    for (let media of dbMedias) {
        if (media.type === type) {
            medias.push(media);
        }
    }
    return medias;
}

// FILM

// SERIE
export function getSeasonsFromSerieId(id: number): any[] {
    let series = getMediaFromJSON("Serie");
    let seasons = [];
    let title = "";

    for (let serie of series) {
        if (id === serie.id) {
            title = serie.title;
            for (let season of serie.seasons) {
                seasons.push(season);
            }
        }
    }
    console.log(title);
    return seasons;
}