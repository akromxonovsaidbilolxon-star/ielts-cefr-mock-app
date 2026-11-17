
/**
 * Chart data for the figures drawn in the app.
 *
 * Only CHARTS live here — geometry the app draws itself from numbers. The
 * maps and diagrams that reproduce the book's layout (Granford, the hospital
 * plans) belong to the test content and now travel with it from the database;
 * see `content/cambridge/figures-db.ts`. Importing them here would compile
 * book-derived artwork into the public bundle.
 */

/** Small shapes used by the redrawn maps, so types stay in one place. */
export interface FigureBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  bold?: boolean;
}
