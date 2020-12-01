
import backend, {
    IApp,
    ensureAuthenticated,
    getLogTimestamp,
    info,
    envVar,
} from '@navikt/familie-backend';

var path = require('path');
const express = require('express');
const jsdom = require("jsdom");
const request = require("request");
const mustacheExpress = require("mustache-express");
const app = express();
const port = 8000;
const router = express.Router();
router.use(express.static(path.join(__dirname, '../../build')));
const { JSDOM } = jsdom;

app.set("views", `${__dirname}/../../build`);

app.set("view engine", "mustache");
app.engine("html", mustacheExpress());

app.get('/status', (req: any, res: any) => {
    res.status(200).end();
});

app.use("/", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
