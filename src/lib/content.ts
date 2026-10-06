import manifest from './manifest.json';

type Group = keyof typeof manifest.groups;
const G = manifest.groups as Record<string, string[]>;
const SIZES = manifest.sizes as unknown as Record<string, [number, number]>;
const COLORS = (manifest as unknown as {colors: Record<string, string>}).colors;

export const full = (slug: string) => `/images/${slug}.webp`;
export const thumb = (slug: string) => `/images/t/${slug}.webp`;
/** Average colour of a photo — used as the placeholder while it loads. */
export const bg = (slug: string) => COLORS[slug] ?? '#1b1c1e';
export const dims = (slug: string): [number, number] => SIZES[slug] ?? [1600, 1067];
const pick = (g: Group | string, ...idx: number[]) => idx.map((i) => G[g][i]).filter(Boolean);

export type Room = 'kitchens' | 'bedrooms' | 'bathrooms' | 'studies' | 'furniture';

export interface CaseStudy {
  title: string;
  place: string;
  text: string;
  images: string[];
}

export interface RoomData {
  slug: Room;
  title: string;
  singular: string;
  tagline: string;
  intro: string;
  lead: string;
  hero: string;
  cases: CaseStudy[];
}

export const ROOMS: Record<Room, RoomData> = {
  kitchens: {
    slug: 'kitchens',
    title: 'Kitchens',
    singular: 'Bespoke kitchen',
    tagline: 'The heart of the home, built by hand.',
    intro:
      'Kitchens are so often the heart of the home; we find customers want to create a multi functional living space but one that still has style, class and sophistication.',
    lead:
      'A bespoke kitchen is tailored to your requirements taking into consideration exactly what you want to achieve. We use the finest quality materials and guarantee an attention to detail second to none.',
    hero: G.kitchens[25],
    cases: [
      {
        title: 'Shaker, in a bold blue',
        place: 'Hampstead, North London',
        text: 'We worked closely with an architect on this project. The customer wanted shaker style kitchen with a modern feel & classic touches. This was achieved with the timeless shaker design, painted in a bold and striking blue. The customer opted to finish off with oak knobs, a quartz worktop with marble vein. Finished off with Perrin & Rowe taps.',
        images: pick('kitchens', 2, 5, 6, 8, 15),
      },
      {
        title: 'An Aga, framed',
        place: 'Hovingham, North Yorkshire',
        text: 'On this project, the customer was clear about what they wanted. Shaker doors throughout with reeded frames. They wanted maximum storage and wanted the Aga to be a focus which we achieved by creating a fabulous Aga surround. Keeping the kitchen neutral with Farrow & Ball colours, accented with antique brass ironmongery.',
        images: pick('kitchens', 24, 16, 18, 21),
      },
      {
        title: 'Sleek, minimal, strong colour',
        place: 'Barnes, South London',
        text: 'On this project the customer wanted a modern, sleek design with strong colours. We created this minimalist look using flat slab, spray painted doors along with stainless steel appliances, worktop & plinth. The Neolith island work surface and splash backs created an exquisite finish to this kitchen.',
        images: pick('kitchens', 25, 27, 29, 30),
      },
      {
        title: 'Hand-painted, bi-fold bright',
        place: 'Malton, North Yorkshire',
        text: 'This kitchen was part of a significant building project for this customer. They had completely overhauled their living and kitchen area. They created light by adding huge bi-folding doors to the rear of their property, they chose a classic shaker style kitchen and went for a hand-painted finish using Farrow & Ball Railings. Antique brass ironmongery & Perrin & Rowe aged brass taps compliment this kitchen perfectly. The worktop is a white quartz with marble vein.',
        images: pick('kitchens', 31, 32, 33, 35),
      },
      {
        title: 'The walnut pantry',
        place: 'Richmond Hill, London',
        text: 'This project focused on creating a pantry unit for extended storage to their kitchen. The architect was specific about the cabinetry doors aligning with the existing wall panelling. The internals were made from walnut veneer giving a rich classic feel in keeping with this beautifully renovated traditional London townhouse.',
        images: pick('kitchens', 36, 37, 38),
      },
    ],
  },
  bedrooms: {
    slug: 'bedrooms',
    title: 'Bedrooms',
    singular: 'Bespoke bedroom',
    tagline: 'Storage that disappears into the architecture.',
    intro:
      'Are you looking for wardrobes to maximise space or to fit in an awkward space? Bespoke bedroom furniture is perfect for maximising storage while maintaining style.',
    lead:
      'Choose your wardrobe interior and create an internal layout perfect for your needs. RM Interiors can also make matching bedside units and chests of drawers.',
    hero: G.home[0],
    cases: [
      {
        title: 'Wall-to-wall statement',
        place: 'Huby, North Yorkshire',
        text: 'These stunning wardrobes were fitted into the master bedroom of a fabulous new build house in Huby. The customer wanted to make a statement and asked for wall to wall wardrobes that would be a striking feature. Shaker style doors, painted in Farrow and Ball Railings. We like the broken front as it is aesthetically pleasing when doing such a long bank of wardrobes. The interiors are a light, wood grained finish.',
        images: pick('bedrooms', 1, 5, 9),
      },
      {
        title: 'Lakeside, room by room',
        place: 'Lakes by Yoo, Cotswolds',
        text: 'This stunning lakeside home, part of a luxury development in the Cotswolds, required wardrobes to several of the bedrooms. Each room had a specific design request. Wardrobe styles all offered a contemporary feel but each slightly different. Flat front and vertical grooved doors all with spray painted finish. The internal cabinetry was made from architectural furniture board giving the customer a range of colours to choose from.',
        images: pick('bedrooms', 3, 4, 2, 11),
      },
      {
        title: 'The walk-in dressing room',
        place: 'Wacton, Norfolk',
        text: 'A stunning walk-in dressing room; walnut internals with shaker style doors in a hand paint finish. Designed jointly with the customer to create a classic dressing room with a traditional feel.',
        images: pick('bedrooms', 13, 0, 12),
      },
    ],
  },
  bathrooms: {
    slug: 'bathrooms',
    title: 'Bathrooms',
    singular: 'Bespoke bathroom',
    tagline: 'Creating the perfect bathroom often requires the bespoke touch.',
    intro: 'Creating the perfect bathroom often requires the bespoke touch.',
    lead:
      'Vanity units drawn to the room, not the catalogue: in-frame doors, dovetailed drawers, stone and marble tops, every detail matched to the house around them.',
    hero: G.home[1],
    cases: [
      {
        title: 'The classic vanity',
        place: 'Richmond Hill',
        text: 'A classic vanity unit designed to maximise storage while complimenting the traditional & classic designs that ran throughout this house. An in-frame shaker door, painted in a neutral finish. A quartz stone worktop with undermount sink and Perrin and Rowe taps.',
        images: pick('bathrooms', 3, 0, 1),
      },
      {
        title: 'Walnut and Italian marble',
        place: 'Marlow, Buckinghamshire',
        text: 'A clear design request from the homeowner for this project. We were sent a design and asked if we could achieve the exact look. The customer was delighted with the finished product. A beautiful bathroom vanity unit with cupboards & drawers. Internal cabinetry in walnut veneer really makes a statement. The sophisticated and stunning vanity top is an Italian marble.',
        images: pick('bathrooms', 9, 11),
      },
      {
        title: 'One of our favourites',
        place: 'Surrey',
        text: 'This bathroom vanity unit is one of our favourites! Shaker doors set into beaded frames. Oak veneered internals and dovetailed oak drawer boxes. Perrin and Rowe taps to complete the traditional look.',
        images: pick('bathrooms', 10, 5, 7),
      },
    ],
  },
  studies: {
    slug: 'studies',
    title: 'Offices, Studies & Libraries',
    singular: 'Bespoke study',
    tagline: 'Rooms for books, work and wind-down.',
    intro:
      'Bespoke shelving, media units and home libraries are in demand. Multi purpose and multi functional, these bespoke pieces really make a statement.',
    lead:
      'From brass-and-oak libraries to wall-to-wall media suites with hidden bars, built to the millimetre and finished in the workshop.',
    hero: G.studies[2],
    cases: [
      {
        title: 'The brass library',
        place: 'Hampstead Way, London',
        text: 'The designer Laroya & Co gave us the brief for this project, explaining the client wanted to use only the best materials. We came up with this grey oak finish, brass liquid metal finish doors and solid brass vertical bars which act as support as well as pleasing to the eye.',
        images: pick('studies', 2, 3, 4, 0),
      },
      {
        title: 'Media suite, hidden bar',
        place: 'Golders Green, London',
        text: 'In this room our client had a very definite concept; they wanted a wall to wall media unit and unit with a hidden bar. Open shelving and doors were a spray paint finish, the cabinetry was a grey oak veneer. The electric fire is seamlessly integrated within the unit, finished off with the granite fire surround.',
        images: pick('studies', 5, 6, 8, 7),
      },
    ],
  },
  furniture: {
    slug: 'furniture',
    title: 'Furniture',
    singular: 'Bespoke furniture',
    tagline: 'A one-off piece that perfectly complements the room.',
    intro: 'RM Interiors can work with you to design and build that perfect piece of furniture.',
    lead:
      'Designed and built to precise measurements, made from a wood of your choice or painted to co-ordinate with your chosen colour scheme.',
    hero: G.furniture[1],
    cases: [
      {
        title: 'Banquette seating',
        place: 'Kitchen extension',
        text: 'The perfect seat created as an extension to the kitchen. This banquet seat was designed to fill this space to maximum effect. The wood detail matched the kitchen design. RM Interiors used a trusted partner to ensure the upholstery was perfect. A sumptuous velvet fabric, chosen by the customer, works perfectly.',
        images: pick('furniture', 1, 2),
      },
      {
        title: 'Pub bar installation',
        place: 'Public house refurbishment',
        text: 'RM Interiors were honoured to be asked to design and build a bar fitting for the refurbishment of this much loved public house. The landlord wanted a strong, bold design with a solid oak worktop. The shelving unit had to be made to exact measurements, with a vision of creating a shelving unit that was functional and stylish.',
        images: pick('furniture', 3, 4, 5),
      },
    ],
  },
};

export const ROOM_ORDER: Room[] = ['kitchens', 'bedrooms', 'bathrooms', 'studies', 'furniture'];

export const TESTIMONIALS = [
  {
    quote:
      'For a superb personal service, creative ideas and real craftsmanship I can unreservedly recommend RM Interiors. They did a great deal of work in our West London home and consistently exceeded our expectations in terms of finish and customer service.',
    who: 'Ben Smith',
    where: 'West London',
  },
  {
    quote:
      'Ryan totally exceeded our expectations and produced the most wonderful and extremely useful cupboard, which matched our other furniture perfectly. On top of his outstanding workmanship he is a really great guy and can not do enough to help you.',
    who: 'Mr & Mrs Ashby',
    where: 'Harrogate, North Yorkshire',
  },
  {
    quote:
      'Not only did he fit the kitchen of our dreams but also the beautiful wardrobes upstairs. I can honestly say it is first class work what he and his team have done, knowing that any work will be done to perfection and on time. We can’t thank you enough Ryan.',
    who: 'Paul Hanagan',
    where: '2x Champion Jockey',
  },
  {
    quote:
      'Ryan McGinty Interiors have been fantastic with listening to our ideas and making recommendations, designs and ideas that has resulted in us having the perfect end product. Really nice to have a company that takes such pride in its work.',
    who: 'Jamie & Hayley Hopwood',
    where: '',
  },
  {
    quote:
      'Ryan is thorough and detailed in his approach and a great collaborator, always keen to provide exactly what the client wants, and within the required timeframe. He has never failed to deliver and has a wonderful team of craftsmen at his side who are a pleasure to have on site.',
    who: 'Sarah Truman',
    where: 'Sarah Truman Interior Design',
  },
  {
    quote:
      'We have worked with R M Interiors for 2 years, and we are always impressed by the high-standards, and attention to detail of Ryan and his team. They produce beautiful cabinetry, and provide a faultless service.',
    who: 'Sarah Gordon',
    where: 'Sarah Gordon Home',
  },
];

export const PROCESS = [
  {
    n: '01',
    title: 'Conversation',
    text: 'Ryan is the first and last point of contact. He listens, advises and learns exactly how you live, with no salesmen to hook you in.',
  },
  {
    n: '02',
    title: 'Design',
    text: 'Early designs, materials and finishes agreed together. Your ever-changing needs are considered at every stage.',
  },
  {
    n: '03',
    title: 'The workshop',
    text: 'Built by hand in Ryan’s own Malton workshop by a trusted, experienced team, with progress monitored daily.',
  },
  {
    n: '04',
    title: 'Fitting',
    text: 'Fitted to the highest standard, in the home, by the people who made it. Nothing is finished until you are completely satisfied.',
  },
];

export interface GalleryItem {
  src: string;
  room: Room;
}

const GALLERY_GROUPS: [string, Room][] = [
  ['g-kitchens', 'kitchens'],
  ['g-bedrooms', 'bedrooms'],
  ['g-bathrooms', 'bathrooms'],
  ['g-studies', 'studies'],
  ['g-furniture', 'furniture'],
];

export const GALLERY: GalleryItem[] = (() => {
  const seen = new Set<string>();
  const out: GalleryItem[] = [];
  for (const [g, room] of GALLERY_GROUPS) {
    for (const src of G[g] ?? []) {
      if (seen.has(src)) continue;
      seen.add(src);
      out.push({src, room});
    }
  }
  return out;
})();

export const FEATURED = [
  {src: G.kitchens[25], label: 'Barnes', room: 'Kitchens'},
  {src: G.studies[2], label: 'Hampstead Way', room: 'Libraries'},
  {src: G.kitchens[2], label: 'Hampstead', room: 'Kitchens'},
  {src: G.furniture[1], label: 'Banquette', room: 'Furniture'},
  {src: G.kitchens[31], label: 'Malton', room: 'Kitchens'},
  {src: G.studies[5], label: 'Golders Green', room: 'Studies'},
];

export const roomImages = {
  hero: G.kitchens[25],
  craft: G.about[1],
  workshop: G.about[0],
};

/** Project captions for photos that belong to a case study (title + place). */
export const CAPTIONS: Record<string, {title: string; place: string}> = (() => {
  const out: Record<string, {title: string; place: string}> = {};
  for (const r of Object.values(ROOMS)) for (const c of r.cases) for (const img of c.images) out[img] ??= {title: c.title, place: c.place};
  return out;
})();
