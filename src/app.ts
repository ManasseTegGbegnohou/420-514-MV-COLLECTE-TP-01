import express from 'express';
import type { Request, Response } from 'express';


const app = express();
const PORT = 3000;

// Middleware pour parser le JSON des requêtes
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from TypeScript + Express!');
});

app.post('/data', (req: Request, res: Response) => {
  const data = req.body;
  res.json({ received: data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
