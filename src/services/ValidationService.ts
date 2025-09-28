export class ValidationService {

    // Validation
    private static readonly PATTERNS = {
        title: /^[a-zA-Z0-9\s]+$/,              // Requires at least one character (letters, numbers, or spaces)
        platform: /^[a-zA-Z]+$/,                // Requires at least one letter
        duration: /^[1-9]\d*$/,                 // Requires at least one digit 1-9
        status: /^(Ongoing|Finished|On_hold)$/, // Must match exact values
        year: /^[1-9]\d*$/,                     // Requires at least one digit 1-9
        genre: /^[a-zA-Z]+$/,                   // Requires at least one letter
        rating: /^(10(\.0)?|[0-9](\.[0-9])?)$/, // Requires digits
        seasonNumber: /^[1-9]\d*$/,              // Requires at least one digit 1-9
        episodeNumber: /^[1-9]\d*$/              // Requires at least one digit 1-9
    };

    static validateTitle(title: string): boolean {
        return title.trim().length > 0 && this.PATTERNS.title.test(title);
    }

    static validatePlatform(platform: string): boolean {
        return platform.trim().length > 0 && this.PATTERNS.platform.test(platform);
    }

    static validateDuration(duration: number): boolean {
        return this.PATTERNS.duration.test(duration.toString());
    }

    static validateStatus(status: string): boolean {
        return this.PATTERNS.status.test(status);
    }

    static validateYear(year: number): boolean {
        return this.PATTERNS.year.test(year.toString());
    }

    static validateGenre(genre: string): boolean {
        return genre.trim().length > 0 && this.PATTERNS.genre.test(genre);
    }

    static validateRating(rating: number): boolean {
        return this.PATTERNS.rating.test(rating.toString());
    }

    // Validate media data
    static validateMediaData(mediaData: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Type
        if (!mediaData.type) {
            errors.push('Type is required');
        } else if (mediaData.type !== 'Film' && mediaData.type !== 'Serie') {
            errors.push('Invalid type');
        }

        // Title
        if (!mediaData.title) {
            errors.push('Title is required');
        } else if (!this.validateTitle(mediaData.title)) {
            errors.push('Title must contain only letters, numbers, and spaces');
        }

        // Platform
        if (!mediaData.platform) {
            errors.push('Platform is required');
        } else if (!this.validatePlatform(mediaData.platform)) {
            errors.push('Invalid platform');
        }

        // Film
        if (mediaData.type === 'Film' && mediaData.duration && !this.validateDuration(mediaData.duration)) {
            errors.push('Duration must be a positive number');
        }

        // Series
        if (mediaData.type === 'Serie' && mediaData.status && !this.validateStatus(mediaData.status)) {
            errors.push('Status must be one of: Ongoing, Finished, On_hold');
        }

        // Year
        if (mediaData.year && !this.validateYear(mediaData.year)) {
            errors.push('Year must be a positive number');
        }

        // Genre
        if (mediaData.genre && !this.validateGenre(mediaData.genre)) {
            errors.push('Genre must be a string');
        }

        // Rating
        if (mediaData.rating && !this.validateRating(mediaData.rating)) {
            errors.push('Rating must be a number between 0 and 10');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate individual fields for updates
    static validateField(fieldName: string, value: any): { isValid: boolean; error?: string } {
        switch (fieldName) {
            case 'title':
                if (!this.validateTitle(value)) {
                    return { isValid: false, error: 'Invalid title' };
                }
                break;
            case 'platform':
                if (!this.validatePlatform(value)) {
                    return { isValid: false, error: 'Invalid platform' };
                }
                break;
            case 'duration':
                if (!this.validateDuration(value)) {
                    return { isValid: false, error: 'Invalid duration' };
                }
                break;
            case 'status':
                if (!this.validateStatus(value)) {
                    return { isValid: false, error: 'Invalid status' };
                }
                break;
            case 'year':
                if (!this.validateYear(value)) {
                    return { isValid: false, error: 'Invalid year' };
                }
                break;
            case 'genre':
                if (!this.validateGenre(value)) {
                    return { isValid: false, error: 'Invalid genre' };
                }
                break;
            case 'rating':
                if (!this.validateRating(value)) {
                    return { isValid: false, error: 'Invalid rating' };
                }
                break;
            default:
                return { isValid: false, error: 'Unknown field' };
        }
        return { isValid: true };
    }

    // Validate season data
    static validateSeasonData(seasonData: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!seasonData.seasonNumber) {
            errors.push('Season number is required');
        } else if (!this.validateSeasonNumber(seasonData.seasonNumber)) {
            errors.push('Season number must be a positive integer');
        }

        if (!seasonData.releaseDate) {
            errors.push('Release date is required');
        } else {
            const date = new Date(seasonData.releaseDate);
            if (isNaN(date.getTime())) {
                errors.push('Release date must be a valid date');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate episode data
    static validateEpisodeData(episodeData: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!episodeData.title) {
            errors.push('Title is required');
        } else if (!this.validateTitle(episodeData.title)) {
            errors.push('Title must contain only letters, numbers, and spaces');
        }

        if (!episodeData.episodeNumber) {
            errors.push('Episode number is required');
        } else if (!this.validateEpisodeNumber(episodeData.episodeNumber)) {
            errors.push('Episode number must be a positive integer');
        }

        if (!episodeData.duration) {
            errors.push('Duration is required');
        } else if (!this.validateDuration(episodeData.duration)) {
            errors.push('Duration must be a positive integer');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate season number
    static validateSeasonNumber(seasonNumber: number): boolean {
        return this.PATTERNS.seasonNumber.test(seasonNumber.toString());
    }

    // Validate episode number
    static validateEpisodeNumber(episodeNumber: number): boolean {
        return this.PATTERNS.episodeNumber.test(episodeNumber.toString());
    }
}