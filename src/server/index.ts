import express from 'express';
import path from 'path';
import routes from './routes';
import baSakEndepunkter from '../ba-sak/baSakEndepunkter';
import dotenv from 'dotenv';
import { logInfo } from '@navikt/familie-logging';

dotenv.config();
export const { NODE_ENV } = process.env;

const buildDir = path.join(process.cwd() + '/build');
const app = express();

if (NODE_ENV === 'production') {
  app.use(express.static(buildDir));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/ba-sak', baSakEndepunkter);

const port = 8001;
app.listen(port, () => {
  logInfo(`Server now listening on port: ${port}`);
});
