//index.ts
import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import routes from './routes';
import bodyParser from 'body-parser';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3003;

const app = express();
app.use(bodyParser.json());

// health
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// routes
app.use('/', routes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Carbon Credit Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });