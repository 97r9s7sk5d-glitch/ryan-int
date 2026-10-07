// Shared by the contact form (instant feedback) and /api/enquiry (the check that actually counts).
export const ENQUIRY_TYPES = ['Kitchen', 'Bedroom / wardrobes', 'Bathroom', 'Office, study or library', 'Furniture', 'Something else'] as const;

export interface Enquiry {
  first: string;
  last: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  spec: string;
}
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

export function validateEnquiry(d: Partial<Record<keyof Enquiry, unknown>>): EnquiryErrors {
  const s = (k: keyof Enquiry) => (typeof d[k] === 'string' ? (d[k] as string).trim() : '');
  const e: EnquiryErrors = {};
  if (!s('first')) e.first = 'Please enter your first name.';
  else if (s('first').length > 60) e.first = 'That name is too long.';
  if (!s('last')) e.last = 'Please enter your last name.';
  else if (s('last').length > 60) e.last = 'That name is too long.';
  if (!s('email')) e.email = 'Please enter your email address.';
  else if (s('email').length > 254 || !EMAIL.test(s('email'))) e.email = 'That email address doesn’t look right.';
  if (s('phone') && !PHONE.test(s('phone'))) e.phone = 'Please enter a valid phone number, or leave it blank.';
  if (!(ENQUIRY_TYPES as readonly string[]).includes(s('type'))) e.type = 'Please choose what you’re planning.';
  if (s('message').length < 10) e.message = 'Please tell us a little about your project (at least a sentence).';
  else if (s('message').length > 3000) e.message = 'Please keep your message under 3,000 characters.';
  else if ((s('message').match(/https?:\/\//gi) ?? []).length > 2) e.message = 'Please remove some of the links from your message.';
  if (s('spec').length > 500) e.spec = 'Too long.';
  return e;
}
