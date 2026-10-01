// Renders the PNG icons in public/ from the SVG source in assets/.
// Run with `npm run icons` after editing assets/icon.svg.
import { readFileSync, writeFileSync } from 'node:fs';

import { Resvg } from '@resvg/resvg-js';

const render = (svg, size, out) => {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(new URL(`../${out}`, import.meta.url), png);
  console.log(`${out} (${size}px)`);
};

const icon = readFileSync(new URL('../assets/icon.svg', import.meta.url), 'utf8');
// Maskable icons get cropped to a circle on Android; shrink the art into the
// central 80% safe zone and leave the background full-bleed.
const maskable = icon.replace(
  '<g id="art">',
  '<g id="art" transform="translate(256 256) scale(.8) translate(-256 -256)">',
);
if (maskable === icon) throw new Error('assets/icon.svg is missing <g id="art">');

// Browsers don't mask favicons, so round the corners of the background ourselves.
const background = '<rect width="512" height="512" fill="url(#bg)"/>';
const favicon = icon.replace(background, background.replace('/>', ' rx="116"/>'));
if (favicon === icon) throw new Error('assets/icon.svg is missing the background <rect>');

render(icon, 1024, 'assets/icon.png');
render(icon, 512, 'public/icon-512.png');
render(icon, 192, 'public/icon-192.png');
render(icon, 180, 'public/apple-touch-icon.png');
render(maskable, 512, 'public/icon-maskable-512.png');
render(favicon, 48, 'public/favicon.png');
