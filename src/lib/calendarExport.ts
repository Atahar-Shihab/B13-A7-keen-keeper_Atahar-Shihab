/**
 * Calendar export service for RFC-5545 .ics generation and Google Calendar deep-links.
 */

export interface CalendarEventDetails {
  title: string;
  description: string;
  location?: string;
  startTime: Date;
  durationMinutes?: number;
}

/**
 * Format a Date object into UTC iCalendar timestamp: YYYYMMDDTHHmmssZ
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generates an RFC-5545 compliant .ics file and triggers a browser download.
 */
export function downloadIcsFile(details: CalendarEventDetails): void {
  const durationMs = (details.durationMinutes || 30) * 60 * 1000;
  const endTime = new Date(details.startTime.getTime() + durationMs);

  const dtStamp = formatIcsDate(new Date());
  const dtStart = formatIcsDate(details.startTime);
  const dtEnd = formatIcsDate(endTime);
  const uid = `keenkeeper-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@keenkeeper.app`;

  // Escape special chars according to RFC 5545
  const cleanSummary = (details.title || 'Catch-Up Meeting')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

  const cleanDescription = (details.description || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

  const cleanLocation = (details.location || 'Video Call / Coffee')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KeenKeeper//Relationship Intelligence OS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Relationship Check-In',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(icsBlob);

  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  const filename = `${details.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'check-in'}.ics`;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Generates a pre-filled Google Calendar web URL.
 */
export function getGoogleCalendarUrl(details: CalendarEventDetails): string {
  const durationMs = (details.durationMinutes || 30) * 60 * 1000;
  const endTime = new Date(details.startTime.getTime() + durationMs);

  const startUtc = formatIcsDate(details.startTime);
  const endUtc = formatIcsDate(endTime);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: details.title,
    dates: `${startUtc}/${endUtc}`,
    details: details.description,
    location: details.location || 'Video Call / In-Person',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Opens Google Calendar event creator in a new tab.
 */
export function openGoogleCalendar(details: CalendarEventDetails): void {
  const url = getGoogleCalendarUrl(details);
  window.open(url, '_blank', 'noopener,noreferrer');
}
