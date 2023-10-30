import express from 'express';
import path from 'path';
import routes from './routes';
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

app.use(function (req, res, next) {
  const acceptedOrigins = [
    'http://localhost:8033',
    'http://localhost:3000',
    'https://familie-ef-blankett.intern.nav.no',
  ];
  const defaultAcceptedOrigin = 'https://familie-ef-blankett.intern.nav.no';
  const origin = req.header('origin')?.toLowerCase();

  res.setHeader(
    'Access-Control-Allow-Origin',
    origin && acceptedOrigins.includes(origin) ? origin : defaultAcceptedOrigin,
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

app.use('/api', routes);
/* TODO : Fjern hardkoding av port */
const port = 8033;
app.listen(port, () => {
  logInfo(`Server now listening on port: ${port}`);
});
