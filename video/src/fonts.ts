import {continueRender, delayRender, staticFile} from 'remotion';

// Brand fonts are bundled in public/fonts so renders never depend on the network.
const faces: [string, string, FontFaceDescriptors][] = [
  ['RM Cormorant', 'fonts/cormorant-500.woff2', {weight: '500', style: 'normal'}],
  ['RM Cormorant', 'fonts/cormorant-500i.woff2', {weight: '500', style: 'italic'}],
  ['RM Inter', 'fonts/inter.woff2', {weight: '100 900'}],
];

export function loadFonts() {
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(async ([family, file, d]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, d);
      await f.load();
      document.fonts.add(f);
    }),
  ).then(() => continueRender(handle), () => continueRender(handle));
}
