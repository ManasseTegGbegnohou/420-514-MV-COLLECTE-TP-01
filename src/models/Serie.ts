import { Media } from './Media.ts';
import { Season } from './Season.ts';

export class Serie extends Media {
    private status: "Ongoing" | "Finished";
    private seasons: Season[];

    constructor(title: string, genre: string, year: number, rating: number, status: "Ongoing" | "Finished") {
        super(title, genre, year, rating);  
        this.status = status;
        this.seasons = [];
    }

    // GET
    public getStatus(): "Ongoing" | "Finished" {
        return this.status;
    }
    public getSeasons(): Season[] {
        return this.seasons;
    }
    public getSummary(): string {
        return `${super.getSummary()}, Status: ${this.status}, Seasons: ${this.seasons.length}`;
    }

    // SET
    public setStatus(status: "Ongoing" | "Finished"): void {
        this.status = status;
    }
    public addSeason(season: Season): void {
        this.seasons.push(season);
    }

    // METHODS ???????
    public toString(): string {
        for (const season of this.seasons) {
            for (const episode of season.getEpisodes()) {
                if (!episode.isWatched()) {
                    return `${this.getTitle()} (${this.getYear()}) - Genre: ${this.getGenre()}, Rating: ${this.getRating()}/10, Status: ${this.status}, Seasons: ${this.seasons.length}`;
                }
            }
        }
        return `${this.getTitle()} (${this.getYear()}) - Genre: ${this.getGenre()}, Rating: ${this.getRating()}/10, Status: ${this.status}, Seasons: ${this.seasons}`;
    }

    public markEpisodeAsWatched(seasonNumber: number, episodeTitle: string): void {
    }
}