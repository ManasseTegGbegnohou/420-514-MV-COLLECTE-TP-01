import express from 'express';
import { requestLogger, errorHandler } from './middlewares/LoggingMiddleware.ts';
import mediaRoutes from './routes/MediaRoute.ts';
import filmRoutes from './routes/FilmRoute.ts';
import serieRoutes from './routes/SerieRoute.ts';
import seasonRoutes from './routes/SeasonRoute.ts';
import episodeRoutes from './routes/EpisodeRoute.ts';
import userRoutes from './routes/UserRoute.ts';
import loggingRoutes from './routes/LoggingRoute.ts';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(requestLogger);  // Logging middleware

// Routes
app.use('/api/medias', mediaRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/series', serieRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', loggingRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});