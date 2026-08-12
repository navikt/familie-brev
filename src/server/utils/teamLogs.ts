import axios from 'axios';
import type { Meta } from '@navikt/familie-logging';
import { logInfo, logWarn } from '@navikt/familie-logging';

/**
 * Erstatning for `logSecure` fra @navikt/familie-logging.
 *
 * @navikt/familie-logging sin `logSecure` skriver til filen /secure-logs/secure.log,
 * som kun fantes fordi nais.yaml tidligere hadde `spec.secureLogs.enabled: true`.
 * Det feltet finnes ikke lenger i Nais Application-CRD-en (erstattet av Team Logs),
 * så volumet blir ikke montert og loggene forsvinner.
 *
 * Team Logs krever at appen selv sender strukturerte JSON-logger til
 * team-logs.nais-system. Se https://doc.nais.io/observability/logging/how-to/team-logs/
 */
const TEAM_LOGS_URL = 'http://team-logs.nais-system/';

const PÅKREVDE_ENV_VARIABLER = [
  'GOOGLE_CLOUD_PROJECT',
  'NAIS_NAMESPACE',
  'NAIS_POD_NAME',
  'NAIS_APP_NAME',
] as const;

// Logges kun én gang ved oppstart, slik at vi lett kan se i vanlige (ikke-sikre)
// logger om noen av variablene Team Logs-formatet krever faktisk mangler i podden.
const manglendeVariabler = PÅKREVDE_ENV_VARIABLER.filter(navn => !process.env[navn]);
if (manglendeVariabler.length > 0) {
  logWarn(
    `Team-logs: mangler miljøvariabler ${manglendeVariabler.join(
      ', ',
    )}. Feltene vil mangle i loggene som sendes til team-logs.nais-system.`,
  );
}

export const logSecure = (message: string, meta: Meta = {}): void => {
  const body = {
    google_cloud_project: process.env.GOOGLE_CLOUD_PROJECT,
    nais_namespace_name: process.env.NAIS_NAMESPACE,
    nais_pod_name: process.env.NAIS_POD_NAME,
    nais_container_name: process.env.NAIS_APP_NAME,
    message,
    severity: 'INFO',
    ...meta,
  };

  axios
    .post(TEAM_LOGS_URL, body, { timeout: 5_000, headers: { 'Content-Type': 'application/json' } })
    .then(res => {
      logInfo(`Team-logs: sendt OK (status=${res.status})`);
    })
    .catch(feil => {
      // Skal aldri kaste videre - vi vil ikke at en feilet team-logs-forsendelse
      // skal føre til en ny, ubehandlet feil i appen. Logger status/data slik at
      // vi kan se årsaken i vanlige (ikke-sikre) logger.
      const status = feil?.response?.status;
      const data = JSON.stringify(feil?.response?.data);
      logWarn(`Team-logs: sending feilet (status=${status}, data=${data}): ${feil}`);
    });
};
