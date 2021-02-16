// import './config/env';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import './database/connect';
import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);

app.listen(3000, () => console.log('🔥 started...'));
