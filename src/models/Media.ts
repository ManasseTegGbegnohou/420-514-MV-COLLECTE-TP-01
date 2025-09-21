export class Media {
    private readonly id: number;
    private title: string;
    private genre: string;
    private year: number;
    private rating: number;
    private type: "Film" | "Serie";

    private static incrementId: number = 5000;

    constructor(title: string, genre: string, year: number, rating: number) {
        Media.incrementId++;
        this.id = Media.incrementId;
        this.title = title;
        this.genre = genre;

        if (year < 0) throw new Error("Invalid year.");
        this.year = year;

        if (rating < 0 || rating > 10) throw new Error("Rating must be between 0 and 10.");
        this.rating = rating;

        this.type = this.constructor.name as "Film" | "Serie";
    }

    // GET
    public getSummary(): string {
        return `${this.title} (${this.year}) - Genre: ${this.genre}, Rating: ${this.rating}/10`;
    }
    public getId(): number {
        return this.id;
    }
    public getTitle(): string {
        return this.title;
    }
    public getGenre(): string {
        return this.genre;
    }
    public getYear(): number {
        return this.year;
    }
    public getRating(): number {
        return this.rating;
    }
    public getType(): "Film" | "Serie" {
        return this.type;
    }

    // SET
    public setRating(newRating: number): void {
        if (newRating < 0 || newRating > 10) throw new Error("Rating must be between 0 and 10.");
        this.rating = newRating;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    public setGenre(genre: string): void {
        this.genre = genre;
    }
    public setYear(year: number): void {
        if (year < 0) throw new Error("Invalid year.");
        this.year = year;
    }
}