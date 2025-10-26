import fs from 'fs';

const DBFILE = 'src/data/v1/db.json';

function readDatabase(): any {
    const fileContent = fs.readFileSync(DBFILE, 'utf-8');
    return JSON.parse(fileContent);
}

// USER SERVICE
export class UserService {

    // GET /api/users/:id/medias
    static getUserFavorites(userId: number): any[] {
        const data = readDatabase();
        const user = data.users.find((u: any) => u.id === userId);

        if (!user || !user.favorites) {
            return [];
        }

        return data.medias.filter((media: any) =>
            user.favorites.includes(media.id)
        );
    }

    // Check if user is admin
    /* static isAdmin(userId: number): boolean {
        const data = readDatabase();
        const user = data.users.find((u: any) => u.id === userId);
        return user && user.role === 'admin';
    } */

    // Get user by ID
    /* static getUserById(id: number): any | null {
        const data = readDatabase();
        return data.users.find((u: any) => u.id === id) || null;
    } */
}