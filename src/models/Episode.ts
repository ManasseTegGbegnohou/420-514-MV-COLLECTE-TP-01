export class Episode {
    private readonly id: number;
    private title: string;
    private duration: number;
    private episodeNumber: number;
    private watched: boolean;

    private static incrementId: number = 0;

    constructor(title: string, episodeNumber: number, duration: number) {
        Episode.incrementId++;
        this.id = Episode.incrementId;
        this.title = title;

        if (episodeNumber < 1) throw new Error("Episode number must be a positive number.");
        this.episodeNumber = episodeNumber;

        if (duration < 0) throw new Error("Duration must be a positive number.");
        this.duration = duration;
        this.watched = false;
    }

    // GET
    public getSummary(): string {
        return `${this.title} - E${this.episodeNumber.toString().padStart(2, '0')} - Duration: ${this.duration} mins - Watched: ${this.watched ? 'Yes' : 'No'}`;
    }
    public getId(): number {
        return this.id;
    }
    public getTitle(): string {
        return this.title;
    }
    public getEpisodeNumber(): number {
        return this.episodeNumber;
    }
    public getDuration(): number {
        return this.duration;
    }
    public isWatched(): boolean {
        return this.watched;
    }

    // SET
    public setWatched(watched: boolean): void {
        this.watched = watched;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    public setEpisodeNumber(episodeNumber: number): void {
        if (episodeNumber < 1) throw new Error("Episode number must be a positive number.");
        this.episodeNumber = episodeNumber;
    }
    public setDuration(duration: number): void {
        if (duration < 0) throw new Error("Duration must be a positive number.");
        this.duration = duration;

    }
}