import { Media } from "./Media.ts";

export class User {
    private readonly id: number;
    private email: string;
    private password: string;
    private role: "admin" | "user";
    private favorites: Media[];

    private static incrementId: number = 0;

    constructor(email: string, password: string, role: "admin" | "user") {
        User.incrementId++;
        this.id = User.incrementId;
        this.email = email;
        this.password = password;
        this.role = role;
        this.favorites = [];
    }

    // GET
    public getId(): number {
        return this.id;
    }
    public getEmail(): string {
        return this.email;
    }
    public getPassword(): string {
        return this.password;
    }
    public getRole(): "admin" | "user" {
        return this.role;
    }
    public getFavorites(): Media[] {
        return this.favorites;
    }
    public getSummary(): string {
        return `Email: ${this.email}, Role: ${this.role}, Favorites Count: ${this.favorites.length}`;
    }

    // SET
    public setEmail(email: string): void {
        this.email = email;
    }
    public setPassword(password: string): void {
        this.password = password;
    }
    public setRole(role: "admin" | "user"): void {
        this.role = role;
    }

    // METHODS
    public addFavorite(media: Media): void {
        this.favorites.push(media);
    }
    public removeFavorite(mediaId: number): void {
        this.favorites = this.favorites.filter(media => media.getId() !== mediaId);
    }
}