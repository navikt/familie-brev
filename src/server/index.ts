import express from 'express';
import path from 'path';
import routes from './routes.js';
import ksSakEndepunkter from '../baks/ksSakEndepunkter.js';
import baSakEndepunkter from '../baks/baSakEndepunkter.js';
import dotenv from 'dotenv';
import { logInfo } from '@navikt/familie-logging';
import blankettRoutes from './blankett/blankettRoutes.js';
import næringsinntektRoutes from './næringsinntekt/næringsinntektRoutes.js';

dotenv.config();
export const { NODE_ENV } = process.env;

const buildDir = path.join(process.cwd() + '/public');
const app = express();

if (NODE_ENV == 'production' || NODE_ENV == 'preprod') {
  app.use(express.static(buildDir));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/ba-sak', baSakEndepunkter);
app.use('/ks-sak', ksSakEndepunkter);
app.use('/blankett', blankettRoutes);
app.use('/naeringsinntekt-kontroll', næringsinntektRoutes);

const port = 8001;
app.listen(port, () => {
  logInfo(`Server now listening on port: ${port}`);
});
