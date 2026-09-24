import axios from 'axios';
import type { Meta } from '@navikt/familie-logging';
import { logWarn } from '@navikt/familie-logging';

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

  axios
    .post(TEAM_LOGS_URL, body, { timeout: 5_000, headers: { 'Content-Type': 'application/json' } })
    .catch(feil => {
      const status = feil?.response?.status;
      const data = JSON.stringify(feil?.response?.data);
      logWarn(`Team-logs: sending feilet (status=${status}, data=${data}): ${feil}`);
    });
};
