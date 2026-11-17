import type { CambridgeWritingTask } from './types';
import type { SpeakingPart } from '../../types';

/* ================================================================== */
/* WRITING — Cambridge IELTS 13, Test 1 (Academic)                    */
/* ================================================================== */

export const C13_T1_TASK1: CambridgeWritingTask = {
  id: 'c13t1-w1',
  task: 1,
  title: 'Writing Task 1 — Map comparison',
  minutes: 20,
  minWords: 150,
  prompt:
    'The two maps below show road access to a city hospital in 2007 and in 2010.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
  guidance: [
    'Write at least 150 words. You should spend about 20 minutes on this task.',
    'Your first paragraph should paraphrase the question, not copy it.',
    'Give an overview of the main changes before you describe them in detail — this is a map task with a clear direction of change.',
    'Describe the two years in order: the 2007 layout first, then what changed by 2010.',
    'Use position language precisely: north of, to the east of, at the junction of, alongside.',
    'Do not give opinions or reasons for the changes. A report needs no conclusion.',
  ],
  figure: 'hospital-maps',
};

export const C13_T1_TASK2: CambridgeWritingTask = {
  id: 'c13t1-w2',
  task: 2,
  title: 'Writing Task 2 — Opinion essay',
  minutes: 40,
  minWords: 250,
  prompt:
    'Living in a country where you have to speak a foreign language can cause serious social problems, as well as practical problems.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.',
  guidance: [
    'Write at least 250 words. You should spend about 40 minutes on this task.',
    '"To what extent" invites a position, not a balanced list — decide how far you agree and keep that position visible throughout.',
    'The question names two things: social problems and practical problems. You must address both, or Task Response is capped.',
    'One body paragraph per kind of problem is the safest structure, each with a reason and a concrete example.',
    'Consider a concession in one paragraph (for example, that second-generation migrants face far fewer of these problems), then return to your view.',
    'Link ideas explicitly: moreover, whereas, consequently, nevertheless, in contrast.',
  ],
};

/* ================================================================== */
/* SPEAKING — Cambridge IELTS 13, Test 1                              */
/* ================================================================== */

export const C13_T1_SPEAKING: SpeakingPart[] = [
  {
    id: 1,
    title: 'Part 1 — Introduction and interview',
    description:
      'The examiner asks about yourself, your home, work or studies and other familiar topics. Answer each question in two or three sentences — enough to show fluency without taking over the conversation.',
    prepSeconds: 0,
    speakSeconds: 45,
    questions: [
      { id: 'c13t1-s1-1', text: 'Let\'s talk about television programmes. Where do you usually watch TV programmes or shows? Why?' },
      { id: 'c13t1-s1-2', text: 'What is your favourite TV programme or show? Why?' },
      { id: 'c13t1-s1-3', text: 'Are there any programmes or shows you don\'t like watching? Why/Why not?' },
      { id: 'c13t1-s1-4', text: 'Do you think you will watch more or fewer TV programmes or shows in the future? Why/Why not?' },
    ],
  },
  {
    id: 2,
    title: 'Part 2 — Long turn (cue card)',
    description:
      'You have one minute to prepare, then you speak for one to two minutes. The examiner will tell you when your time is up. Make notes if you wish — a structured answer scores higher than a perfect one.',
    prepSeconds: 60,
    speakSeconds: 120,
    questions: [
      { id: 'c13t1-s2-1', text: 'Describe someone you know who has started a business.' },
      { id: 'c13t1-s2-2', text: 'Follow-up: Would you like to do the same kind of work as this person?' },
    ],
    cueCard: {
      topic: 'Describe someone you know who has started a business.',
      bullets: [
        'who this person is',
        'what work this person does',
        'why this person decided to start a business',
        'and explain whether you would like to do the same kind of work as this person.',
      ],
      finalLine: 'You will have to talk about the topic for one to two minutes.',
    },
  },
  {
    id: 3,
    title: 'Part 3 — Two-way discussion',
    description:
      'These questions are linked to the Part 2 topic but are more abstract. Develop each answer with a reason, an example and, where you can, a comparison or a concession.',
    prepSeconds: 15,
    speakSeconds: 90,
    questions: [
      { id: 'c13t1-s3-1', text: 'Discussion topic: Choosing work. What kinds of jobs do young people not want to do in your country?' },
      { id: 'c13t1-s3-2', text: 'Who is best at advising young people about choosing a job: teachers or parents?' },
      { id: 'c13t1-s3-3', text: 'Is money always the most important thing when choosing a job?' },
      { id: 'c13t1-s3-4', text: 'Discussion topic: Work-life balance. Do you agree that many people nowadays are under pressure to work longer hours and take less holiday?' },
      { id: 'c13t1-s3-5', text: 'What is the impact on society of people having a poor work-life balance?' },
      { id: 'c13t1-s3-6', text: 'Could you recommend some effective strategies for governments and employers to ensure people have a good work-life balance?' },
    ],
  },
];
