import fs from 'fs';

const DBFILE = 'src/data/db.json';

// Helper functions
function readDatabase(): any {
    const fileContent = fs.readFileSync(DBFILE, 'utf-8');
    return JSON.parse(fileContent);
}

function writeDatabase(data: any): void {
    fs.writeFileSync(DBFILE, JSON.stringify(data, null, 2));
}

function getNextId(collection: any[]): number {
    if (collection.length === 0) return 1;
    return Math.max(...collection.map(item => item.id)) + 1;
}

// MEDIA SERVICE
export class MediaService {

    // GET /api/medias
    static getAllMedia(filters?: { type?: string; genre?: string; year?: number; status?: string }): any[] {
        const data = readDatabase();
        let medias = data.medias;

        if (filters) {
            if (filters.type) {
                medias = medias.filter((media: any) => media.type === filters.type);
            }
            if (filters.genre) {
                medias = medias.filter((media: any) =>
                    media.genre.toLowerCase().includes(filters.genre!.toLowerCase())
                );
            }
            if (filters.year) {
                medias = medias.filter((media: any) => media.year === filters.year);
            }
            if (filters.status) {
                medias = medias.filter((media: any) => media.status === filters.status);
            }
        }

        return medias;
    }

    // GET /api/medias/:id
    static getMediaById(id: number): any | null {
        const data = readDatabase();
        return data.medias.find((media: any) => media.id === id) || null;
    }

    // POST /api/medias
    static addMedia(mediaData: any): any {
        const data = readDatabase();
        const newMedia = {
            id: getNextId(data.medias),
            ...mediaData
        };

        data.medias.push(newMedia);
        writeDatabase(data);
        return newMedia;
    }

    // PUT /api/medias/:id ADMIN ONLY
    static updateMedia(id: number, updateData: any): any | null {
        const data = readDatabase();
        const mediaIndex = data.medias.findIndex((media: any) => media.id === id);

        if (mediaIndex === -1) return null;

        data.medias[mediaIndex] = { ...data.medias[mediaIndex], ...updateData };
        writeDatabase(data);
        return data.medias[mediaIndex];
    }

    // DELETE /api/medias/:id ADMIN ONLY
    static deleteMedia(id: number): boolean {
        const data = readDatabase();
        const mediaIndex = data.medias.findIndex((media: any) => media.id === id);

        if (mediaIndex === -1) return false;

        data.medias.splice(mediaIndex, 1);
        writeDatabase(data);
        return true;
    }

    // GET /api/series/:id/episodes
    static getEpisodesBySerieId(serieId: number): any[] {
        const data = readDatabase();
        const serie = data.medias.find((media: any) => media.id === serieId && media.type === "Serie");

        if (!serie) return [];

        const episodes: any[] = [];
        serie.seasons?.forEach((season: any) => {
            season.episodes?.forEach((episode: any) => {
                episodes.push({
                    ...episode,
                    serieId: serieId,
                    serieTitle: serie.title,
                    seasonNumber: season.seasonNumber
                });
            });
        });

        return episodes;
    }

    // PATCH /episodes/:id
    static updateEpisodeWatchedStatus(episodeId: number, watched: boolean): any | null {
        const data = readDatabase();

        for (const media of data.medias) {
            if (media.type === "Serie" && media.seasons) {
                for (const season of media.seasons) {
                    const episodeIndex = season.episodes.findIndex((e: any) => e.id === episodeId);
                    if (episodeIndex !== -1) {
                        season.episodes[episodeIndex].watched = watched;
                        writeDatabase(data);
                        return season.episodes[episodeIndex];
                    }
                }
            }
        }

        return null;
    }

    // POST /seasons
    static addSeasonToSerie(serieId: number, seasonData: {
        seasonNumber: number;
        releaseDate: string;
    }): any | null {
        const data = readDatabase();
        const serieIndex = data.medias.findIndex((m: any) => m.id === serieId && m.type === "Serie");

        if (serieIndex === -1) {
            return null;
        }

        const newSeason = {
            id: getNextId(data.medias[serieIndex].seasons || []),
            seasonNumber: seasonData.seasonNumber,
            releaseDate: seasonData.releaseDate,
            episodes: []
        };

        if (!data.medias[serieIndex].seasons) {
            data.medias[serieIndex].seasons = [];
        }

        data.medias[serieIndex].seasons.push(newSeason);
        writeDatabase(data);
        return newSeason;
    }

    // POST /episodes
    static addEpisodeToSeason(serieId: number, seasonNumber: number, episodeData: {
        title: string;
        episodeNumber: number;
        duration: number;
    }): any | null {
        const data = readDatabase();
        const serieIndex = data.medias.findIndex((m: any) => m.id === serieId && m.type === "Serie");

        if (serieIndex === -1) {
            return null;
        }

        const seasonIndex = data.medias[serieIndex].seasons.findIndex(
            (s: any) => s.seasonNumber === seasonNumber
        );

        if (seasonIndex === -1) {
            return null;
        }

        const newEpisode = {
            id: getNextId(data.medias[serieIndex].seasons[seasonIndex].episodes || []),
            title: episodeData.title,
            episodeNumber: episodeData.episodeNumber,
            duration: episodeData.duration,
            watched: false
        };

        if (!data.medias[serieIndex].seasons[seasonIndex].episodes) {
            data.medias[serieIndex].seasons[seasonIndex].episodes = [];
        }

        data.medias[serieIndex].seasons[seasonIndex].episodes.push(newEpisode);
        writeDatabase(data);
        return newEpisode;
    }
}