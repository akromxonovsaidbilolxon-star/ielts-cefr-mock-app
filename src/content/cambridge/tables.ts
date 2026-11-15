import type { CambridgeTable } from './types';

/**
 * Cell markup — kept deliberately tiny so transcribing stays readable:
 *   {{n}}    inline blank for question n (becomes an input)
 *   *text*   italic
 *   ~text~   underlined
 *   \n       line break
 */

/** Cookery Classes — Listening Section 1. */
export const COOKERY_TABLE: CambridgeTable = {
  columns: ['Cookery Class', 'Focus', 'Other Information'],
  rows: [
    {
      cells: [
        { text: '*Example*\nThe Food ~Studio~' },
        { text: 'how to {{1}} and cook with seasonal products' },
        {
          text:
            '• small classes\n• also offers {{2}} classes\n• clients who return get a {{3}} discount',
        },
      ],
    },
    {
      cells: [
        { text: "Bond's\nCookery School" },
        { text: 'food that is {{4}}' },
        {
          text:
            '• includes recipes to strengthen your {{5}}\n• they have a free {{6}} every Thursday',
        },
      ],
    },
    {
      cells: [{ text: 'The\n{{7}}\nCentre' }, { text: 'mainly {{8}} food' }, {
        text:
          '• located near the {{9}}\n• a special course in skills with a {{10}} is sometimes available',
      }],
    },
  ],
};

/** Tourism New Zealand — Reading Passage 1, Questions 1–7. */
export const TOURISM_TABLE: CambridgeTable = {
  columns: ['Section of website', 'Comments'],
  rows: [
    {
      cells: [
        { text: 'Database of tourism services' },
        {
          text:
            '• easy for tourism-related businesses to get on the list\n• allowed businesses to {{1}} information regularly\n• provided a country-wide evaluation of businesses, including their impact on the {{2}}',
        },
      ],
    },
    {
      cells: [
        { text: 'Special features on local topics' },
        {
          text:
            '• e.g. an interview with a former sports {{3}}, and an interactive tour of various locations used in {{4}}',
        },
      ],
    },
    {
      cells: [
        { text: 'Information on driving routes' },
        { text: '• varied depending on the {{5}}' },
      ],
    },
    {
      cells: [
        { text: 'Travel Planner' },
        {
          text:
            '• included a map showing selected places, details of public transport and local {{6}}',
        },
      ],
    },
    {
      cells: [{ text: "'Your Words'" }, { text: '• travellers could send a link to their {{7}}' }],
    },
  ],
};
