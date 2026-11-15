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
