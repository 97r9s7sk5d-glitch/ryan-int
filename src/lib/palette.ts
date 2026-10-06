export type Hardware = 'brass' | 'oak' | 'nickel' | 'black';
export type TopKind = 'marble' | 'slate' | 'oak';
export type DoorStyle = 'shaker' | 'slab' | 'reeded';

export interface Spec {
  paint: string;
  hardware: Hardware;
  top: TopKind;
  style: DoorStyle;
}

export const PAINTS = [
  {name: 'Bold Teal', hex: '#2f6f7c'},
  {name: 'Midnight', hex: '#1d2a40'},
  {name: 'Deep Slate', hex: '#323a42'},
  {name: 'Stone', hex: '#b7ae9e'},
  {name: 'Chalk', hex: '#e4dfd4'},
  {name: 'Sage', hex: '#7b8a72'},
  {name: 'Charcoal', hex: '#232427'},
  {name: 'Clay', hex: '#a2705a'},
];

export const HARDWARE: {id: Hardware; name: string; hex: string}[] = [
  {id: 'brass', name: 'Aged brass', hex: '#b08a4e'},
  {id: 'oak', name: 'Oak', hex: '#b98d57'},
  {id: 'nickel', name: 'Nickel', hex: '#c9c9cc'},
  {id: 'black', name: 'Matt black', hex: '#161616'},
];

export const TOPS: {id: TopKind; name: string}[] = [
  {id: 'marble', name: 'Marble-vein quartz'},
  {id: 'slate', name: 'Dark stone'},
  {id: 'oak', name: 'Solid oak'},
];

export const STYLES: {id: DoorStyle; name: string}[] = [
  {id: 'shaker', name: 'Shaker'},
  {id: 'slab', name: 'Flat slab'},
  {id: 'reeded', name: 'Reeded'},
];

export const DEFAULT_SPEC: Spec = {paint: '#2f6f7c', hardware: 'brass', top: 'marble', style: 'shaker'};

export const paintName = (hex: string) => PAINTS.find((p) => p.hex === hex)?.name ?? 'Custom';
