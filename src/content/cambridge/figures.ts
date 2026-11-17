import type { ChartSpec } from '../../types';

/**
 * Small inline SVG figures that stand in for the maps and diagrams printed in
 * the book. They are drawn from the original layout so the questions stay
 * answerable; they are simplified line drawings, not scanned book artwork.
 */

export interface FigureBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  bold?: boolean;
}

/** Listening Section 2 — "Proposed traffic changes in Granford". */
export const GRANFORD = {
  viewBox: '0 0 360 300',
  letters: [
    { letter: 'A', x: 74, y: 196 },
    { letter: 'B', x: 118, y: 210 },
    { letter: 'C', x: 150, y: 148 },
    { letter: 'D', x: 203, y: 172 },
    { letter: 'E', x: 250, y: 176 },
    { letter: 'F', x: 268, y: 42 },
    { letter: 'G', x: 238, y: 108 },
    { letter: 'H', x: 292, y: 132 },
    { letter: 'I', x: 260, y: 226 },
  ],
  boxes: [
    { x: 148, y: 118, w: 62, h: 34, label: 'Bank' },
    { x: 192, y: 148, w: 78, h: 34, label: 'Chemist' },
    { x: 178, y: 196, w: 116, h: 36, label: 'Supermarket' },
    { x: 116, y: 200, w: 68, h: 34, label: 'Library' },
    { x: 268, y: 96, w: 78, h: 34, label: 'School' },
    { x: 278, y: 214, w: 78, h: 34, label: 'Supermarket' },
  ] as FigureBox[],
  streetLabels: [
    { text: 'Station Road', x: 82, y: 150, rotate: -88 },
    { text: 'High Street', x: 148, y: 186, rotate: -8 },
    { text: 'School Road', x: 272, y: 178, rotate: -72 },
  ],
};

/** Writing Task 1 — road access to a city hospital, 2007 and 2010. */
export const HOSPITAL_MAPS = {
  viewBox: '0 0 360 250',
  panelWidth: 168,
  panels: [
    {
      year: '2007',
      caption: 'Ring Road • Hospital Road • six bus stops • shared car park',
      busStops: [
        { x: 96, y: 92 },
        { x: 96, y: 118 },
        { x: 96, y: 144 },
        { x: 116, y: 92 },
        { x: 116, y: 118 },
        { x: 116, y: 144 },
      ],
      roundabouts: [] as { x: number; y: number }[],
      hospital: { x: 46, y: 88, w: 42, h: 56 },
      carPark: { x: 128, y: 74, w: 26, h: 30, label: 'car park\nstaff + public' },
      busStation: null as null | { x: number; y: number; w: number; h: number },
    },
    {
      year: '2010',
      caption: 'Ring Road • Hospital Road • bus station • two roundabouts • separate car parks',
      busStops: [] as { x: number; y: number }[],
      roundabouts: [
        { x: 96, y: 74 },
        { x: 96, y: 158 },
      ],
      hospital: { x: 46, y: 88, w: 42, h: 56 },
      carPark: { x: 128, y: 60, w: 26, h: 26, label: 'staff\ncar park' },
      busStation: { x: 66, y: 176, w: 62, h: 22 },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Test 2 · Writing Task 1 — household tenure in England and Wales     */
/* ------------------------------------------------------------------ */

/**
 * Bar chart of homes owned vs rented, 1918–2011.
 *
 * These percentages were read off the printed figure in the owner's copy of
 * the book, so they are close approximations of individual bar heights rather
 * than the exact data Cambridge used. The app labels the redrawing as such;
 * candidates only need the overall pattern to answer the task.
 */
export const ENGLAND_WALES_TENURE = {
  title: 'Households owning and renting accommodation in England and Wales, 1918 to 2011',
  yLabel: '% of households',
  yMax: 90,
  categories: ['1918', '1939', '1953', '1961', '1971', '1981', '1991', '2001', '2011'],
  series: [
    { name: 'households in owned accommodation', values: [23, 32, 33, 41, 50, 60, 67, 69, 64] },
    { name: 'households in rented accommodation', values: [77, 68, 67, 59, 50, 40, 33, 31, 36] },
  ],
} satisfies ChartSpec;

/* ------------------------------------------------------------------ */
/* Test 3 · Writing Task 1 — top ten electricity producers, 2014       */
/* ------------------------------------------------------------------ */

/**
 * Horizontal bar chart: production vs consumption of electricity, 2014.
 *
 * These figures are the ones printed beside the bars in the book's own
 * figure, so unlike the Test 2 chart this is not an approximation. Bars are
 * ordered by rank (production), China first.
 */
export const ELECTRICITY_2014: ChartSpec = {
  title: 'Top ten countries for the production and consumption of electricity, 2014 (billion kWh)',
  yLabel: 'billion kWh',
  yMax: 5500,
  categories: [
    'China',
    'United States',
    'Russia',
    'Japan',
    'India',
    'Canada',
    'France',
    'Brazil',
    'Germany',
    'Korea, Rep.',
  ],
  series: [
    {
      name: 'Production',
      values: [5398, 4099, 1057, 936.2, 871, 618.9, 561.2, 530.7, 526.6, 485.1],
    },
    {
      name: 'Consumption',
      values: [5322, 3866, 1038, 856.7, 698.8, 499.9, 462.9, 455.8, 582.5, 449.5],
    },
  ],
};
