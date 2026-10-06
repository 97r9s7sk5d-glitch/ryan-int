export const SITE = {
  name: 'Ryan McGinty Interiors',
  short: 'RM Interiors',
  url: 'https://www.ryanmcgintyinteriors.co.uk',
  email: 'ryan@ryanmcgintyinteriors.co.uk',
  // NOTE: the old site listed 01653 698906 in the header and 01653 919870 in the footer. Confirm which is current.
  phone: '01653 919870',
  mobile: '07737 514395',
  instagram: 'https://www.instagram.com/ryanmcgintyinteriors/',
  address: {
    street: 'Units E2 & E3, Pyramid Estate, Showfield Lane',
    town: 'Malton',
    region: 'North Yorkshire',
    postcode: 'YO17 6BT',
  },
  // Set to a Formspree / Netlify Forms / own endpoint to send enquiries from the site. Falls back to mailto.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '',
};

export const tel = (n: string) => 'tel:' + n.replace(/\s/g, '');

export const NAV = [
  {href: '/services', label: 'Services'},
  {href: '/kitchens', label: 'Kitchens'},
  {href: '/bedrooms', label: 'Bedrooms'},
  {href: '/bathrooms', label: 'Bathrooms'},
  {href: '/studies', label: 'Studies'},
  {href: '/furniture', label: 'Furniture'},
  {href: '/gallery', label: 'Gallery'},
  {href: '/about', label: 'About'},
  {href: '/contact', label: 'Contact'},
];
