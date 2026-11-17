import type { CambridgeWritingTask } from './types';
import type { SpeakingPart } from '../../types';
import { ENGLAND_WALES_TENURE } from './figures-db';

/* ================================================================== */
/* WRITING — Cambridge IELTS 13, Test 2 (Academic)                    */
/* ================================================================== */

export const C13_T2_TASK1: CambridgeWritingTask = {
  id: 'c13t2-w1',
  task: 1,
  title: 'Writing Task 1 — Bar chart',
  minutes: 20,
  minWords: 150,
  prompt:
    'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
  guidance: [
    'Write at least 150 words. You should spend about 20 minutes on this task.',
    'There are no numbers printed on the bars, so read them to the nearest whole percent and say roughly — about, approximately, just under, just over.',
    'The two lines cross in 1971 at roughly 50% each. That crossing is the single most important feature: state it in your overview.',
    'Your overview needs two points: rented homes fell steadily while owned homes rose, and the pattern reversed after 2001.',
    'Group the years rather than listing all nine: 1918–1961 (renting dominant), 1971 (the crossover), 1981–2011 (owning dominant, peaking in 2001).',
    'Report the 2011 figures last — owning near 64%, renting back up to about 36% — and note that the gap had begun to narrow.',
    'No opinions and no reasons for the trend. A report needs no conclusion.',
  ],
  chart: ENGLAND_WALES_TENURE,
};

export const C13_T2_TASK2: CambridgeWritingTask = {
  id: 'c13t2-w2',
  task: 2,
  title: 'Writing Task 2 — Opinion essay',
  minutes: 40,
  minWords: 250,
  prompt:
    'Some people believe that nowadays we have too many choices.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.',
  guidance: [
    'Write at least 250 words. You should spend about 40 minutes on this task.',
    '"To what extent" asks how far you agree — so a partly-agree position is fine, as long as your view is clear in the introduction and the conclusion.',
    'The word "too many" is a judgement, not a fact. Decide early whether choice is a burden, a benefit, or both, and keep that line throughout.',
    'Concrete examples carry this essay: streaming platforms, university courses, phone tariffs, supermarket shelves, online shopping.',
    'A strong body paragraph explains the cost of choice — decision fatigue, time lost, fear of choosing wrongly — because that is what "too many" implies.',
    'A concession paragraph earns marks: choice promotes competition, lower prices and personal freedom.',
    'Avoid the word "choices" in every sentence; paraphrase with options, alternatives, variety, range, and the burden of decision-making.',
  ],
};

/* ================================================================== */
/* SPEAKING — Cambridge IELTS 13, Test 2                              */
/* ================================================================== */

/**
 * Part 1 and Part 3 wording below is taken from the book's Speaking test 2
 * pages, which the owner supplied separately. Only these prompts are asked —
 * no invented follow-ups.
 */
export const C13_T2_SPEAKING: SpeakingPart[] = [
  {
    id: 1,
    title: 'Part 1 — Introduction and interview',
    description:
      'The examiner asks about yourself, your home, work or studies and other familiar topics. This test’s topic is Age. Answer each question in two or three sentences — enough to show fluency without taking over the conversation.',
    prepSeconds: 0,
    speakSeconds: 45,
    questions: [
      { id: 'c13t2-s1-1', text: 'Are you happy to be the age you are now? [Why/Why not?]' },
      { id: 'c13t2-s1-2', text: 'When you were a child, did you think a lot about your future? [Why/Why not?]' },
      { id: 'c13t2-s1-3', text: 'Do you think you have changed as you have got older? [Why/Why not?]' },
      { id: 'c13t2-s1-4', text: 'What will be different about your life in the future? [Why?]' },
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
      topic: 'Describe a time when you started using a new technological device (e.g. a new computer or phone).',
      bullets: [
        'what device you started using',
        'why you started using this device',
        'how easy or difficult it was to use',
      ],
      finalLine: 'and explain how helpful this device was to you.',
    },
    questions: [
      { id: 'c13t2-s2-1', text: 'Describe a time when you started using a new technological device.' },
      {
        id: 'c13t2-s2-2',
        text: 'Follow-up: How do you think your life would be different without that device?',
      },
    ],
  },
  {
    id: 3,
    title: 'Part 3 — Two-way discussion',
    description:
      'These questions widen out from your Part 2 topic. The examiner expects longer, more abstract answers with reasons and examples.',
    prepSeconds: 0,
    speakSeconds: 90,
    questions: [
      { id: 'c13t2-s3-1', text: 'Technology and education: What is the best age for children to start computer lessons? [Why?]' },
      {
        id: 'c13t2-s3-2',
        text: 'Technology and education: Do you think that schools should use more technology to help children learn? [Why?]',
      },
      {
        id: 'c13t2-s3-3',
        text: 'Technology and education: Do you agree or disagree that computers will replace teachers one day?',
      },
      {
        id: 'c13t2-s3-4',
        text: 'Technology and society: How much has technology improved how we communicate with each other?',
      },
      {
        id: 'c13t2-s3-5',
        text: 'Technology and society: Do you agree that there are still many more major technological innovations to be made?',
      },
      {
        id: 'c13t2-s3-6',
        text: 'Technology and society: Could you suggest some reasons why some people are deciding to reduce their use of technology?',
      },
    ],
  },
];
