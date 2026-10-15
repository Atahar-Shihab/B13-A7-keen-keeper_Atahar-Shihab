import { Friend, Interaction } from '../types';
import { getDaysElapsed, getTargetCadence, calculateHealthScore } from './relationshipEngine';

export interface CRMBackupPayload {
  version: string;
  exportedAt: string;
  metadata: {
    contactsCount: number;
    interactionsCount: number;
    app: string;
  };
  friends: Friend[];
  interactions: Interaction[];
}

/**
 * Triggers a browser download of a UTF-8 file
 */
const triggerDownload = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports full CRM state as a timestamped .json backup file
 */
export const exportJSONBackup = (
  friends: Friend[],
  interactions: Interaction[]
): void => {
  const payload: CRMBackupPayload = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    metadata: {
      contactsCount: friends.length,
      interactionsCount: interactions.length,
      app: 'KeenKeeper v2.0',
    },
    friends,
    interactions,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const dateStamp = new Date().toISOString().split('T')[0];
  triggerDownload(
    jsonString,
    `keenkeeper-crm-backup-${dateStamp}.json`,
    'application/json;charset=utf-8'
  );
};

/**
 * Validates and extracts state from an uploaded .json backup
 */
export const parseAndValidateJSONBackup = (
  fileContent: string
): { friends: Friend[]; interactions: Interaction[] } => {
  try {
    const parsed = JSON.parse(fileContent);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    // Support both direct array exports or full versioned payload
    let friends: Friend[] = [];
    let interactions: Interaction[] = [];

    if (Array.isArray(parsed.friends)) {
      friends = parsed.friends;
    } else if (Array.isArray(parsed)) {
      friends = parsed;
    } else {
      throw new Error('No friends array found in backup file');
    }

    if (Array.isArray(parsed.interactions)) {
      interactions = parsed.interactions;
    }

    return { friends, interactions };
  } catch (err: any) {
    throw new Error(`Failed to parse CRM backup: ${err.message || 'Malformed JSON'}`);
  }
};

/**
 * Helper to escape CSV field values
 */
const escapeCSV = (value: any): string => {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Exports relationships directory as a clean, spreadsheet-ready .csv report
 */
export const exportCSVReport = (friends: Friend[]): void => {
  const headers = [
    'Name',
    'Email',
    'Circle Tier',
    'Health Score (%)',
    'Health Status',
    'Target Cadence (Days)',
    'Days Since Contact',
    'Last Contact Date',
    'Next Recommended Check-In',
    'Company',
    'Role',
    'Location',
    'Tags',
    'Open Tasks Count',
    'Vault Items Count',
  ];

  const rows = friends.map((f) => {
    const daysElapsed = getDaysElapsed(f.lastContactDate);
    const cadence = getTargetCadence(f);
    const computed = calculateHealthScore(f.lastContactDate, cadence);
    const openTasks = f.actionItems.filter((a) => !a.completed).length;

    return [
      escapeCSV(f.name),
      escapeCSV(f.email),
      escapeCSV(f.circleTier),
      f.healthScore,
      escapeCSV(f.status),
      cadence,
      daysElapsed,
      escapeCSV(f.lastContactDate ? f.lastContactDate.split('T')[0] : 'Never'),
      escapeCSV(computed.nextRecommendedDate.split('T')[0]),
      escapeCSV(f.company || ''),
      escapeCSV(f.role || ''),
      escapeCSV(f.location || ''),
      escapeCSV(f.tags.join('; ')),
      openTasks,
      f.vault.length,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const dateStamp = new Date().toISOString().split('T')[0];

  triggerDownload(
    csvContent,
    `keenkeeper-relationships-report-${dateStamp}.csv`,
    'text/csv;charset=utf-8'
  );
};
