import axios from 'axios';
import type { Meta } from '@navikt/familie-logging';
import { logWarn } from '@navikt/familie-logging';

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

  axios.post(TEAM_LOGS_URL, body).catch(feil => {
    // Skal aldri kaste videre - vi vil ikke at en feilet team-logs-forsendelse
    // skal føre til en ny, ubehandlet feil i appen.
    logWarn(`Sending av team-logs feilet: ${feil}`);
  });
};
