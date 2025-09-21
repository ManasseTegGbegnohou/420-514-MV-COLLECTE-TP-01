export class User {
    private readonly id: number;
    private email: string;
    private password: string;
    private role: "admin" | "user";
    private favoriteMedias: number[]; // store only media IDs

    private static incrementId: number = 0;

    constructor(email: string, password: string, role: "admin" | "user") {
        User.incrementId++;
        this.id = User.incrementId;
        this.email = email;
        this.password = password;
        this.role = role;
        this.favoriteMedias = [];
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
    public getFavorites(): number[] {
        return this.favoriteMedias;
    }
    public getSummary(): string {
        return `Email: ${this.email}, Role: ${this.role}, FavoriteMedias Count: ${this.favoriteMedias.length}`;
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
    public addFavorite(mediaId: number): void {
        if (!this.favoriteMedias.includes(mediaId)) {
            this.favoriteMedias.push(mediaId);
        }
    }

    public removeFavorite(mediaId: number): void {
        this.favoriteMedias = this.favoriteMedias.filter(id => id !== mediaId);
    }

}