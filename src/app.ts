import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('RoktoBd API');
});

app.use('/api/v1', routes);

app.use(globalErrorHandler);

export default app;
