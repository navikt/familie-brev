import { logWarn } from '@navikt/familie-logging';
import type { Meta } from '@navikt/familie-logging';

/**
 * Sender sikre/sensitive logger til Team Logs (team-logs.nais-system), som erstatter
 * den utfasede filbaserte "Secure Logs"-løsningen. Se
 * https://doc.nais.io/observability/logging/how-to/team-logs/
 */
const TEAM_LOGS_URL = 'http://team-logs.nais-system/';

export const logSecure = async (message: string, meta: Meta = {}): Promise<void> => {
  const payload = {
    google_cloud_project: process.env.GOOGLE_CLOUD_PROJECT,
    nais_namespace_name: process.env.NAIS_NAMESPACE,
    nais_pod_name: process.env.NAIS_POD_NAME,
    nais_container_name: process.env.NAIS_APP_NAME,
    message,
    severity: 'ERROR',
    ...meta,
  };

  try {
    await fetch(TEAM_LOGS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (feil) {
    logWarn(`Kunne ikke sende sikker logg til Team Logs: ${(feil as Error).message}`);
  }
};
