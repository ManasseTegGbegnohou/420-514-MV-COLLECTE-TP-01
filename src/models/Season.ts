import { Episode } from './Episode.ts';

export class Season {
    private readonly id: number;
    private seasonNumber: number;
    private releaseDate: Date; // Format : new Date("2023-05-10") || new Date(2023, 4, 10)
    private episodes: Episode[];

    private static incrementId: number = 0;

    constructor(seasonNumber: number, releaseDate: Date /*new Date("2023-05-10")*/) {
        Season.incrementId++;
        this.id = Season.incrementId;

        if (seasonNumber < 1) throw new Error("Season number must be a positive number.");
        this.seasonNumber = seasonNumber;
        this.episodes = [];

        this.releaseDate = releaseDate;
    }

    // GET
    public getId(): number {
        return this.id;
    }
    public getSeasonNumber(): number {
        return this.seasonNumber;
    }
    public getReleaseDate(): Date {
        return this.releaseDate;
    }
    public getEpisodes(): Episode[] {
        return this.episodes;
    }
    public getSummary(): string {
        const episodeTitles: string[] = [];
        for (const episode of this.episodes) {
            episodeTitles.push(episode.getTitle());
        }

        return `Season ${this.seasonNumber} - Episodes: ${episodeTitles}`;
    }

    // SET
    public setSeasonNumber(seasonNumber: number): void {
        if (seasonNumber < 1) throw new Error("Season number must be a positive integer.");
        this.seasonNumber = seasonNumber;
    }
    public setReleaseDate(releaseDate: Date): void {
        this.releaseDate = releaseDate;
    }

    // METHODS
    public addEpisode(episode: Episode): void {
        this.episodes.push(episode);
    }
}