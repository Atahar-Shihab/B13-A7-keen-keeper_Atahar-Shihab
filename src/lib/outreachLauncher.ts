/**
 * Deep-link outreach launcher for WhatsApp, Email, and LinkedIn.
 * Handles phone normalization, URI encoding, and platform-specific link structures.
 */

export interface OutreachOptions {
  name: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  messageText?: string;
  subject?: string;
}

/**
 * Normalizes a phone number by stripping whitespace, dashes, and parentheses.
 * Ensures international format without leading '+' for wa.me.
 */
export function sanitizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  return digits;
}

/**
 * Generates a WhatsApp web/native deep-link prefilled with a draft message.
 */
export function getWhatsAppUrl(phone: string, text: string = ''): string {
  const cleanPhone = sanitizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  if (!cleanPhone) {
    return `https://wa.me/?text=${encodedText}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generates a mailto: URL prefilled with subject and draft body.
 */
export function getMailtoUrl(email: string, subject: string, body: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const queryString = params.toString().replace(/\+/g, '%20');
  return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Formats a LinkedIn profile URL or search URL if direct link isn't provided.
 */
export function getLinkedInUrl(linkedinUrl?: string, fullName?: string): string {
  if (linkedinUrl && linkedinUrl.trim().length > 0) {
    if (linkedinUrl.startsWith('http://') || linkedinUrl.startsWith('https://')) {
      return linkedinUrl;
    }
    return `https://${linkedinUrl}`;
  }
  if (fullName) {
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(fullName)}`;
  }
  return 'https://www.linkedin.com';
}

/**
 * Quick launcher that opens an outreach channel in a new tab / window.
 */
export function launchOutreach(
  channel: 'whatsapp' | 'email' | 'linkedin',
  options: OutreachOptions
): { success: boolean; url: string; error?: string } {
  let url = '';

  switch (channel) {
    case 'whatsapp': {
      if (!options.phone) {
        return {
          success: false,
          url: '',
          error: 'No phone number available for WhatsApp outreach.',
        };
      }
      url = getWhatsAppUrl(options.phone, options.messageText || `Hi ${options.name}!`);
      break;
    }
    case 'email': {
      if (!options.email) {
        return {
          success: false,
          url: '',
          error: 'No email address available for this contact.',
        };
      }
      url = getMailtoUrl(
        options.email,
        options.subject || `Catch-up with ${options.name}`,
        options.messageText || `Hi ${options.name},\n\nHope all is well!`
      );
      break;
    }
    case 'linkedin': {
      url = getLinkedInUrl(options.linkedinUrl, options.name);
      break;
    }
  }

  if (url) {
    if (channel === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return { success: true, url };
  }

  return { success: false, url: '', error: 'Could not construct valid outreach URL.' };
}
