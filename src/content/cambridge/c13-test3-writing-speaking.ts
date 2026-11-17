import type { CambridgeWritingTask } from './types';
import type { SpeakingPart } from '../../types';
import { ELECTRICITY_2014 } from './figures-db';

/* ================================================================== */
/* WRITING — Cambridge IELTS 13, Test 3 (Academic)                    */
/* ================================================================== */

export const C13_T3_TASK1: CambridgeWritingTask = {
  id: 'c13t3-w1',
  task: 1,
  title: 'Writing Task 1 — Bar chart',
  minutes: 20,
  minWords: 150,
  prompt:
    'The bar chart below shows the top ten countries for the production and consumption of electricity in 2014.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
  guidance: [
    'Write at least 150 words. You should spend about 20 minutes on this task.',
    'The bars are ranked by production, so the list is already in order — do not re-sort it into a different sequence.',
    'China and the United States dwarf everything else (5,398 and 4,099 billion kWh produced). Open by stating that gap, because it is the chart’s single biggest feature.',
    'Group the eight smaller countries rather than listing all ten one at a time: Russia leads them, Japan and India follow, then a tight cluster of five between about 485 and 619.',
    'Two countries consumed more than they produced — Germany (582.5 used against 526.6 generated) and Korea (485.1 against 449.5). That reversal is the second key feature and belongs in your overview.',
    'Report figures to the nearest whole number where the decimals are noisy (936.2 → about 936). Accuracy of trend matters more than reproducing every decimal.',
    'No opinions and no causes. This is a report, not an argument, so do not conclude.',
  ],
  chart: ELECTRICITY_2014,
};

export const C13_T3_TASK2: CambridgeWritingTask = {
  id: 'c13t3-w2',
  task: 2,
  title: 'Writing Task 2 — Discussion essay',
  minutes: 40,
  minWords: 250,
  prompt:
    'Some people say History is one of the most important school subjects. Other people think that, in today’s world, subjects like Science and Technology are more important than History.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.',
  guidance: [
    'Write at least 250 words. You should spend about 40 minutes on this task.',
    '“Discuss both views” is a requirement, not a suggestion. Give each side its own paragraph and cover the second view before your opinion, or Task Response is limited.',
    'State your own view in the introduction and return to it in the conclusion. An essay that only decides on the last line reads as underdeveloped.',
    'The History side is strongest on identity, critical thinking and understanding cause and effect; the Science side on employability, innovation and national competitiveness. Use actual reasons, not slogans.',
    'Avoid the false choice of “one subject matters more”. A position that History and STEM serve different purposes is perfectly acceptable, provided you argue it.',
    'Concrete examples score better than abstractions — a national curriculum, a country that invested heavily in engineering, a historical lesson applied to policy.',
  ],
};

/* ================================================================== */
/* SPEAKING — Cambridge IELTS 13, Test 3                              */
/* ================================================================== */

/**
 * Wording taken directly from the book's Speaking test 3 page (printed page
 * 75). Only these prompts are asked.
 */
export const C13_T3_SPEAKING: SpeakingPart[] = [
  {
    id: 1,
    title: 'Part 1 — Introduction and interview',
    description:
      'The examiner asks about yourself, your home, work or studies and other familiar topics. This test’s topic is Money. Answer each question in two or three sentences — enough to show fluency without taking over the conversation.',
    prepSeconds: 0,
    speakSeconds: 45,
    questions: [
      {
        id: 'c13t3-s1-1',
        text: 'When you go shopping, do you prefer to pay for things in cash or by card? [Why?]',
      },
      {
        id: 'c13t3-s1-2',
        text: 'Do you ever save money to buy special things? [Why/Why not?]',
      },
      {
        id: 'c13t3-s1-3',
        text: 'Would you ever take a job which had low pay? [Why/Why not?]',
      },
      {
        id: 'c13t3-s1-4',
        text: 'Would winning a lot of money make a big difference to your life? [Why/Why not?]',
      },
    ],
  },
  {
    id: 2,
    title: 'Part 2 — Long turn',
    description:
      'You have one minute to prepare, then talk for one to two minutes. The examiner will not interrupt you.',
    prepSeconds: 60,
    speakSeconds: 120,
    cueCard: {
      topic: 'Describe an interesting discussion you had as part of your work or studies.',
      bullets: [
        'what the subject of the discussion was',
        'who you discussed the subject with',
        'what opinions were expressed',
      ],
      finalLine: 'and explain why you found the discussion interesting.',
    },
    questions: [
      {
        id: 'c13t3-s2-1',
        text: 'Describe an interesting discussion you had as part of your work or studies.',
      },
      {
        // The book prints the cue card only. Real exams always close Part 2
        // with a short rounding-off question, so one is supplied here in the
        // examiner's voice and kept deliberately generic.
        id: 'c13t3-s2-2',
        text: 'Follow-up: Do you often have discussions like the one you described?',
      },
    ],
  },
  {
    id: 3,
    title: 'Part 3 — Discussion topics',
    description:
      'Discussion topic: Discussing problems with others, then Communication skills at work. Give developed answers with a reason and an example.',
    prepSeconds: 0,
    speakSeconds: 60,
    questions: [
      {
        id: 'c13t3-s3-1',
        text: 'Why is it good to discuss problems with other people?',
      },
      {
        id: 'c13t3-s3-2',
        text: 'Do you think that it’s better to talk to friends and not family about problems?',
      },
      {
        id: 'c13t3-s3-3',
        text: 'Is it always a good idea to tell lots of people about a problem?',
      },
      {
        id: 'c13t3-s3-4',
        text: 'Communication skills at work — which communication skills are most important when taking part in meetings with colleagues?',
      },
      {
        id: 'c13t3-s3-5',
        text: 'What are the possible effects of poor written communication skills at work?',
      },
      {
        id: 'c13t3-s3-6',
        text: 'What do you think will be the future impact of technology on communication in the workplace?',
      },
    ],
  },
];
