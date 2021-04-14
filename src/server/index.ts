import express from 'express';
import path from 'path';
import routes from './routes';
import dotenv from 'dotenv';
import { logInfo } from '@navikt/familie-logging';

dotenv.config();
export const { NODE_ENV } = process.env;

const buildDir = path.join(process.cwd() + '/build');
const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'production') {
  app.use(express.static(buildDir));
}

app.use('/api', routes);

const port = 8000;
app.listen(port, () => {
  logInfo(`Server now listening on port: ${port}`);
});
