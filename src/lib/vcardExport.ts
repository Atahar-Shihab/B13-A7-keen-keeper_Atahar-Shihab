import { Friend } from '../types';

/**
 * Generates an RFC 2426 compliant vCard (v3.0) string for a Friend record.
 */
export const generateVCardString = (friend: Friend): string => {
  const nameParts = friend.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${friend.name}`,
  ];

  if (friend.company || friend.companyOrOrg) {
    lines.push(`ORG:${friend.company || friend.companyOrOrg}`);
  }

  if (friend.role || friend.roleOrContext) {
    lines.push(`TITLE:${friend.role || friend.roleOrContext}`);
  }

  if (friend.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${friend.email}`);
  }

  if (friend.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${friend.phone}`);
  }

  if (friend.location) {
    lines.push(`ADR;TYPE=HOME:;;${friend.location};;;;`);
  }

  if (friend.birthday) {
    lines.push(`BDAY:${friend.birthday}`);
  }

  if (friend.linkedinUrl) {
    lines.push(`URL:${friend.linkedinUrl}`);
  }

  // Combine bio, cadence, and notes into note field
  const noteParts: string[] = [];
  if (friend.circleTier) {
    noteParts.push(`Circle: ${friend.circleTier}`);
  }
  if (friend.bio) {
    noteParts.push(friend.bio);
  }
  if (friend.quickNotes) {
    noteParts.push(`Notes: ${friend.quickNotes}`);
  }
  if (noteParts.length > 0) {
    const escapedNote = noteParts.join(' | ').replace(/[\r\n]+/g, ' ');
    lines.push(`NOTE:${escapedNote}`);
  }

  if (friend.tags && friend.tags.length > 0) {
    lines.push(`CATEGORIES:${friend.tags.join(',')}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
};

/**
 * Initiates browser download of a contact's vCard (.vcf) file.
 */
export const downloadVCard = (friend: Friend): void => {
  const vcardText = generateVCardString(friend);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const sanitizedName = friend.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${sanitizedName}.vcf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
