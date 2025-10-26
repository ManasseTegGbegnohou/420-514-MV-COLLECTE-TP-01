import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from 'config';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { requestLogger, errorHandler as loggingErrorHandler } from './middlewares/LoggingMiddleware.ts';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.ts';
import { errorsLogger } from './services/LoggingService.ts';
// import { corsOptions, rateLimitOptions, authRateLimit, helmetOptions } from './middlewares/security.ts';
import swaggerV1 from '../docs/swagger-v1.json' with { type: 'json' };
import swaggerV2 from '../docs/swagger-v2.json' with { type: 'json' };
import mediaRoutes from './routes/v1/MediaRoute.ts';
import filmRoutes from './routes/v1/FilmRoute.ts';
import serieRoutes from './routes/v1/SerieRoute.ts';
import seasonRoutes from './routes/v1/SeasonRoute.ts';
import episodeRoutes from './routes/v1/EpisodeRoute.ts';
import userRoutes from './routes/v1/UserRoute.ts';
import loggingRoutes from './routes/v1/LoggingRoute.ts';
// v2 routes
import authRoutes from './routes/v2/auth.ts';
import movieRoutes from './routes/v2/movies.ts';
import ratingRoutes from './routes/v2/ratings.ts';
import seriesRoutes from './routes/v2/series.ts';

const app = express();
const PORT = config.get('server.port') as number;

// Security middleware - temporarily disabled
// app.use(helmetOptions);
// app.use(corsOptions);
// app.use(rateLimitOptions);

// Parse JSON bodies
app.use(express.json());

// Logging middleware
app.use(requestLogger);

// Connect to MongoDB
mongoose.connect(config.get('db.uri') as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes v1 (deprecated)
app.use('/api/v1/medias', mediaRoutes);
app.use('/api/v1/films', filmRoutes);
app.use('/api/v1/series', serieRoutes);
app.use('/api/v1/seasons', seasonRoutes);
app.use('/api/v1/episodes', episodeRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/logs', loggingRoutes);

// Legacy routes (deprecated - redirect to v1)
app.use('/api/medias', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/medias instead.');
    next();
}, mediaRoutes);
app.use('/api/films', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/films instead.');
    next();
}, filmRoutes);
app.use('/api/series', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/series instead.');
    next();
}, serieRoutes);
app.use('/api/seasons', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/seasons instead.');
    next();
}, seasonRoutes);
app.use('/api/episodes', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/episodes instead.');
    next();
}, episodeRoutes);
app.use('/api/users', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/users instead.');
    next();
}, userRoutes);
app.use('/api/logs', (req, res, next) => {
    res.set('X-Deprecated', 'true');
    res.set('X-Deprecation-Message', 'This endpoint is deprecated. Use /api/v1/logs instead.');
    next();
}, loggingRoutes);

// Routes v2 (new)
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/movies', movieRoutes);
app.use('/api/v2/ratings', ratingRoutes);
app.use('/api/v2/series', seriesRoutes);

// Swagger documentation
app.use('/docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerV1, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Media Tracker API v1 (Deprecated)'
}));

app.use('/docs/v2', swaggerUi.serve, swaggerUi.setup(swaggerV2, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Media Tracker API v2',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true
    }
}));

// 404 handler for undefined routes (must be after all routes)
app.use((req, res, next) => {
    const correlationId = (req as any).correlationId;
    
    errorsLogger.error('Route not found', {
        correlationId,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    res.status(404).json({
        error: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        message: `Cannot ${req.method} ${req.url}`,
        availableRoutes: {
            movies: '/api/v2/movies',
            series: '/api/v2/series',
            auth: '/api/v2/auth',
            ratings: '/api/v2/ratings',
            docs: '/docs/v2'
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
    console.log(`API v1: http://localhost:${PORT}/api/v1/medias`);
    console.log(`API v2: http://localhost:${PORT}/api/v2/movies`);
    console.log(`Docs v1: http://localhost:${PORT}/docs/v1`);
    console.log(`Docs v2: http://localhost:${PORT}/docs/v2`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close();
    process.exit(0);
});