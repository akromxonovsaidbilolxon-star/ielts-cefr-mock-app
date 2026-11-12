import type { WritingTask } from '../types';

export const WRITING_TASKS: WritingTask[] = [
  {
    id: 'w1',
    task: 1,
    title: 'Task 1 — Academic Report',
    minutes: 20,
    minWords: 150,
    prompt:
      'The chart below shows the number of international visitors to four museums in a European city between 2015 and 2023, in thousands. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    guidance: [
      'Write a report of at least 150 words. You should spend about 20 minutes on this task.',
      'Start with an introduction that paraphrases the question — do not copy it.',
      'Include a clear overview (e.g. "Overall, ...") in the first or second paragraph.',
      'Group your data logically and support every claim with figures from the chart.',
      'Two or three body paragraphs is ideal. No conclusion or opinion is needed.',
    ],
    chart: {
      title: 'International visitors to four museums, 2015–2023 (thousands)',
      yLabel: 'Visitors (thousands)',
      yMax: 800,
      categories: ['2015', '2017', '2019', '2021', '2023'],
      series: [
        { name: 'National Gallery', values: [420, 480, 610, 180, 690] },
        { name: 'Science Museum', values: [310, 360, 430, 150, 520] },
        { name: 'Modern Art', values: [260, 240, 290, 90, 350] },
        { name: 'History Museum', values: [500, 470, 520, 210, 480] },
      ],
    },
  },
  {
    id: 'w2',
    task: 2,
    title: 'Task 2 — Essay',
    minutes: 40,
    minWords: 250,
    prompt:
      'Some people believe that universities should only offer courses that lead directly to employment, while others argue that subjects such as history, philosophy and literature are equally valuable.\n\nDiscuss both views and give your own opinion.',
    guidance: [
      'Write an essay of at least 250 words. You should spend about 40 minutes on this task.',
      'Address both views — a response that ignores one of them cannot score above Band 5 for Task Response.',
      'State your own position clearly, ideally in the introduction and again in the conclusion.',
      'Use one body paragraph per view, with a reason and a concrete example.',
      'Use a range of linking devices: however, furthermore, whereas, consequently, in contrast.',
    ],
  },
];
