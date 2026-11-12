import type { MlSpeakingStage } from './types';

/**
 * MULTILEVEL SPEAKING — 4 stages, 8 recording windows, about 15 minutes.
 *
 * Stage 1.1: 3 personal questions, 30 s each, shown one at a time (A1-A2)
 * Stage 1.2: 3 questions on two pictures, 45 s + 30 s + 30 s, one at a time (B1)
 * Stage 2:   3 related abstract questions + context image, 60 s prep, 2 min (B2)
 * Stage 3:   analyse both sides of a statement, 60 s prep, 2 min (C1)
 */
export const ML_SPEAKING_STAGES: MlSpeakingStage[] = [
  {
    id: 'ml-s11',
    stage: '1.1',
    title: 'Part 1.1 — Personal questions',
    level: 'A1',
    description:
      'Answer three questions about familiar topics. You have 30 seconds for each question and there is no preparation time.',
    prepSeconds: 0,
    weight: 0.15,
    reveal: 'sequential',
    questions: [
      { id: 'ml-q1', label: 'Q1', text: 'Where do you live?', seconds: 30 },
      { id: 'ml-q2', label: 'Q2', text: 'Tell me about your family.', seconds: 30 },
      { id: 'ml-q3', label: 'Q3', text: 'What do you like doing in your free time?', seconds: 30 },
    ],
  },
  {
    id: 'ml-s12',
    stage: '1.2',
    title: 'Part 1.2 — Two pictures',
    level: 'B1',
    description:
      'Look at the two pictures on the same topic. Answer three questions, describing what you see and giving your views.',
    prepSeconds: 0,
    weight: 0.2,
    reveal: 'sequential',
    visual: 'pictures',
    questions: [
      {
        id: 'ml-q4',
        label: 'Q4',
        text: 'Describe the two pictures. What are the people doing, and how are the two situations different?',
        seconds: 45,
      },
      {
        id: 'ml-q5',
        label: 'Q5',
        text: 'Which of these places would you prefer to spend a free afternoon in? Why?',
        seconds: 30,
      },
      {
        id: 'ml-q6',
        label: 'Q6',
        text: 'Do you think people in your country spend enough time outdoors? Why do you think so?',
        seconds: 30,
      },
    ],
  },
  {
    id: 'ml-s2',
    stage: '2',
    title: 'Part 2 — Abstract topic',
    level: 'B2',
    description:
      'You have one minute to prepare, then two minutes to answer all three questions together. The picture gives you context; describing it is optional.',
    prepSeconds: 60,
    weight: 0.3,
    reveal: 'together',
    visual: 'context',
    // ONE continuous 2-minute response covering all three questions.
    // The questions are context, not separate recording windows.
    questions: [
      {
        id: 'ml-q7',
        label: 'Response',
        text: 'Give one response covering all three questions below.',
        seconds: 120,
      },
    ],
    subQuestions: [
      'Why do you think some people prefer to work alone, while others work better in a team?',
      'What are the advantages and disadvantages of teamwork for a large project?',
      'Should schools teach students to work in teams? Give reasons and examples.',
    ],
  },
  {
    id: 'ml-s3',
    stage: '3',
    title: 'Part 3 — Two sides of an argument',
    level: 'C1',
    description:
      'You have one minute to prepare. Then speak for two minutes, analysing both sides of the statement and supporting your arguments.',
    prepSeconds: 60,
    weight: 0.35,
    reveal: 'together',
    statement:
      'Technology has made people less able to concentrate, but it has also made learning more accessible. Discuss both sides and give your opinion.',
    questions: [
      {
        id: 'ml-q10',
        label: 'Your response',
        text: 'Analyse both sides of the statement and support your arguments with reasons and examples.',
        seconds: 120,
      },
    ],
  },
];

export const ML_SPEAKING_QUESTIONS = ML_SPEAKING_STAGES.flatMap((s) => s.questions);

/** The first stage and question, used when starting a fresh run. */
export const ML_SPEAKING_FIRST = {
  stageId: ML_SPEAKING_STAGES[0].id,
  questionId: ML_SPEAKING_STAGES[0].questions[0].id,
};
