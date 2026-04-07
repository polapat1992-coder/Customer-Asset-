/**
 * Utility for browser Contact Picker API
 */

export interface ContactInfo {
  name?: string;
  phone?: string;
}

export async function selectContact(): Promise<ContactInfo | null> {
  const nav = navigator as any;
  
  if (!('contacts' in nav && 'select' in nav.contacts)) {
    console.warn('Contact Picker API not supported');
    return null;
  }

  try {
    const props = ['name', 'tel'];
    const opts = { multiple: false };
    const contacts = await nav.contacts.select(props, opts);

    if (contacts && contacts.length > 0) {
      const contact = contacts[0];
      return {
        name: contact.name?.[0] || '',
        phone: contact.tel?.[0] || ''
      };
    }
  } catch (err) {
    console.error('Error selecting contact:', err);
  }

  return null;
}

export function isContactPickerSupported(): boolean {
  const isTopFrame = window.self === window.top;
  return isTopFrame && 'contacts' in navigator && 'select' in (navigator as any).contacts;
}

export function isBrowserSupportedButInIframe(): boolean {
  const isTopFrame = window.self === window.top;
  return !isTopFrame && 'contacts' in navigator && 'select' in (navigator as any).contacts;
}

export function isClipboardReadSupported(): boolean {
  const isTopFrame = window.self === window.top;
  return isTopFrame && 'clipboard' in navigator && 'readText' in navigator.clipboard;
}

/**
 * Parses a string to extract name and phone number
 * Example: "สมชาย ใจดี 0812345678" -> { name: "สมชาย ใจดี", phone: "0812345678" }
 */
export function parseContactString(input: string): ContactInfo {
  // Simple regex for Thai/International phone numbers
  const phoneRegex = /((?:\+66|0)[\s-]*\d[\s-]*\d[\s-]*\d[\s-]*\d[\s-]*\d[\s-]*\d[\s-]*\d[\s-]*\d[\s-]*\d)/;
  const match = input.match(phoneRegex);
  
  if (match) {
    const phone = match[0].replace(/[\s-]/g, '');
    const name = input.replace(match[0], '').trim();
    return { name, phone };
  }
  
  return { name: input.trim() };
}
