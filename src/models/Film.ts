import { Media } from './Media.ts';

export class Film extends Media {
    private duration : number;
    private watched : boolean = false;

    constructor(title: string, genre: string, year: number, rating: number, duration: number) {
        super(title, genre, year, rating);

        if (duration < 0) throw new Error("Duration must be a positive number.");
        this.duration = duration;
    }

    // GET
    public getDuration(): number {
        return this.duration;
    }
    public isWatched(): boolean {
        return this.watched;
    }
    public getSummary(): string {
        return `${super.getSummary()}, Duration: ${this.duration}mins, Watched: ${this.watched ? 'Yes' : 'No'}`;
    }

    // SET
    public setWatched(watched: boolean): void {
        this.watched = watched;
    }
    public setDuration(duration: number): void {
        if (duration < 0) throw new Error("Duration must be a positive number.");
        this.duration = duration;
    }
}