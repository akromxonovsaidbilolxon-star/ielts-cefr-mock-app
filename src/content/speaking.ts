import type { SpeakingPart } from '../types';

export const SPEAKING_PARTS: SpeakingPart[] = [
  {
    id: 1,
    title: 'Part 1 — Introduction and interview',
    description:
      'The examiner asks general questions about familiar topics. Answer each question in two or three sentences — enough to show fluency, but not so long that you are taking a turn.',
    prepSeconds: 0,
    speakSeconds: 45,
    questions: [
      { id: 's1-1', text: 'Let\'s talk about where you live. Do you live in a house or an apartment?' },
      { id: 's1-2', text: 'What do you like most about your home town?' },
      { id: 's1-3', text: 'Let\'s move on to free time. What do you usually do at the weekend?' },
      { id: 's1-4', text: 'Do you prefer spending your free time alone or with other people? Why?' },
      { id: 's1-5', text: 'Now let\'s talk about studying. Do you work or are you a student at the moment?' },
      { id: 's1-6', text: 'What part of your studies do you find most difficult?' },
      { id: 's1-7', text: 'Do you enjoy reading? How often do you read for pleasure?' },
    ],
  },
  {
    id: 2,
    title: 'Part 2 — Long turn (cue card)',
    description:
      'You have one minute to prepare, then you speak for up to two minutes on the topic below. The examiner will tell you when your time is up. Make notes if you wish — an organised answer scores higher than a perfect one.',
    prepSeconds: 60,
    speakSeconds: 120,
    questions: [
      { id: 's2-1', text: 'Describe a skill you learned that was difficult at first.' },
      { id: 's2-2', text: 'Follow-up: Would you like to learn another skill in the future?' },
    ],
    cueCard: {
      topic: 'Describe a skill you learned that was difficult at first.',
      bullets: [
        'what the skill was',
        'why you decided to learn it',
        'how you learned it',
        'and explain how you felt when you had learned it.',
      ],
      finalLine: 'You will have to talk about the topic for one to two minutes.',
    },
  },
  {
    id: 3,
    title: 'Part 3 — Two-way discussion',
    description:
      'These questions are connected to the Part 2 topic but are more abstract. Give developed answers with reasons, examples and, where possible, a comparison or a concession.',
    prepSeconds: 15,
    speakSeconds: 90,
    questions: [
      { id: 's3-1', text: 'Why do you think some skills are much harder to learn as an adult than as a child?' },
      { id: 's3-2', text: 'Should schools teach practical skills like cooking and budgeting? Why or why not?' },
      { id: 's3-3', text: 'Some people say that technology has made us less willing to learn difficult things. Do you agree?' },
      { id: 's3-4', text: 'How has the way people learn new skills changed in your country over the last twenty years?' },
      { id: 's3-5', text: 'Do you think employers value qualifications more than practical experience? What is your view?' },
    ],
  },
];

export const ALL_SPEAKING_QUESTIONS = SPEAKING_PARTS.flatMap((p) => p.questions);
