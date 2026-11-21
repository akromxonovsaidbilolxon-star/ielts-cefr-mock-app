/**
 * Demo dataset.
 *
 * The app must be usable before Supabase is connected, so demo mode ships with
 * a believable classroom: two teachers' classes, eight students, homework with
 * a mix of graded/open/overdue work, and three starter books. The seeded PDFs
 * are generated in the browser at seed time (see store.ts) so the library is
 * not padded with binary fixtures in the repo.
 */

import type { AcademySnapshot, Assignment, Book, SchoolClass, Student, Submission } from './types';

export const DEMO_TEACHER_NAME = 'Demo Teacher';

export const DEMO_STUDENTS: Student[] = [
  { id: 's-aziz', displayName: 'Aziz Karimov', email: 'aziz@demo.local' },
  { id: 's-madina', displayName: 'Madina Yusupova', email: 'madina@demo.local' },
  { id: 's-temur', displayName: 'Temur Toshev', email: 'temur@demo.local' },
  { id: 's-dilnoza', displayName: 'Dilnoza Rahimova', email: 'dilnoza@demo.local' },
  { id: 's-jasur', displayName: 'Jasur Bekmurodov', email: 'jasur@demo.local' },
  { id: 's-nodira', displayName: 'Nodira Qodirova', email: 'nodira@demo.local' },
  { id: 's-bekzod', displayName: 'Bekzod Umarov', email: 'bekzod@demo.local' },
  { id: 's-shahnoza', displayName: 'Shahnoza Islomova', email: 'shahnoza@demo.local' },
];

/** Demo student used by "View as student". */
export const DEMO_STUDENT_ID = 's-madina';

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const DEMO_CLASSES: SchoolClass[] = [
  {
    id: 'c-b2-evening',
    name: 'IELTS B2 · Evening',
    level: 'B2',
    schedule: 'Mon & Wed · 18:00',
    color: 'brand',
    studentIds: ['s-aziz', 's-madina', 's-temur', 's-dilnoza', 's-jasur'],
    createdAt: isoDaysAgo(90),
  },
  {
    id: 'c-c1-intensive',
    name: 'IELTS C1 · Intensive',
    level: 'C1',
    schedule: 'Tue & Thu · 16:30',
    color: 'accent',
    studentIds: ['s-nodira', 's-bekzod', 's-shahnoza', 's-madina'],
    createdAt: isoDaysAgo(60),
  },
  {
    id: 'c-a2-starters',
    name: 'General English A2',
    level: 'A2',
    schedule: 'Sat · 10:00',
    color: 'ok',
    studentIds: ['s-jasur', 's-temur', 's-bekzod'],
    createdAt: isoDaysAgo(35),
  },
];

export const DEMO_BOOKS: Book[] = [
  {
    id: 'b-pathway',
    title: 'Pathway to IELTS B2',
    author: 'Center materials',
    subject: 'IELTS preparation',
    level: 'B2',
    description:
      'Course book for the evening B2 group: writing task models, reading strategies and a full practice test.',
    coverColor: 'brand',
    file: null,
    uploadedBy: 'teacher',
    createdAt: isoDaysAgo(70),
  },
  {
    id: 'b-grammar',
    title: 'Grammar in Practice — Intermediate',
    author: 'Center materials',
    subject: 'Grammar',
    level: 'B1',
    description: 'Short explanations with controlled practice. Used for the Saturday A2/B1 bridge group.',
    coverColor: 'ok',
    file: null,
    uploadedBy: 'teacher',
    createdAt: isoDaysAgo(50),
  },
  {
    id: 'b-vocab',
    title: 'Academic Word List Essentials',
    author: 'Center materials',
    subject: 'Vocabulary',
    level: 'B2',
    description: 'The 570 headwords every university-bound student needs, with example sentences.',
    coverColor: 'accent',
    file: null,
    uploadedBy: 'teacher',
    createdAt: isoDaysAgo(20),
  },
];

export const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a-task2-essay',
    classId: 'c-b2-evening',
    title: 'Writing Task 2 — technology and education',
    description:
      'Write at least 250 words answering: "Some people believe that technology has made learning more effective, while others think it has weakened students\' ability to think deeply. Discuss both views and give your own opinion."\n\nInclude a clear introduction, one paragraph per view, a paragraph with your opinion, and a conclusion.',
    dueAt: daysFromNow(2),
    maxPoints: 10,
    bookId: 'b-pathway',
    createdAt: isoDaysAgo(5),
  },
  {
    id: 'a-reading-set',
    classId: 'c-b2-evening',
    title: 'Reading — True/False/Not Given practice',
    description:
      'Complete Reading Passage 2 (pages 41–44 of the course book). Answer questions 14–26 on paper, then write a short note explaining the method you used for any statement you got wrong.',
    dueAt: daysFromNow(-1),
    maxPoints: 10,
    bookId: 'b-pathway',
    createdAt: isoDaysAgo(8),
  },
  {
    id: 'a-listen-2',
    classId: 'c-b2-evening',
    title: 'Listening — Section 2 map labelling',
    description:
      'Listen to the recording twice. The first time, only follow the map without writing. The second time, label places 11–15. Write how many letters you got right.',
    dueAt: daysFromNow(6),
    maxPoints: 5,
    bookId: null,
    createdAt: isoDaysAgo(3),
  },
  {
    id: 'a-vocab-quiz',
    classId: 'c-b2-evening',
    title: 'Vocabulary quiz — Academic Word List 1–20',
    description: 'Learn the first 20 words of the academic list and write one sentence for each.',
    dueAt: daysFromNow(-6),
    maxPoints: 10,
    bookId: 'b-vocab',
    createdAt: isoDaysAgo(14),
  },
  {
    id: 'a-c1-summary',
    classId: 'c-c1-intensive',
    title: 'Reading — summarise the third passage',
    description:
      'Write a 120-word summary of "The future of work". Keep every sentence grammatical and use at least five academic linking devices.',
    dueAt: daysFromNow(3),
    maxPoints: 20,
    bookId: null,
    createdAt: isoDaysAgo(4),
  },
  {
    id: 'a-c1-debate',
    classId: 'c-c1-intensive',
    title: 'Speaking — prepare a 2-minute monologue',
    description:
      'Prepare a two-minute talk: "A skill I would like to learn". Record it or write the full script. Bring at least three useful phrases you practised.',
    dueAt: daysFromNow(-2),
    maxPoints: 15,
    bookId: null,
    createdAt: isoDaysAgo(9),
  },
  {
    id: 'a-a2-present',
    classId: 'c-a2-starters',
    title: 'Present simple worksheet',
    description: 'Complete exercise A (1–20) on page 18. Write the full sentences, not just the verb.',
    dueAt: daysFromNow(4),
    maxPoints: 10,
    bookId: 'b-grammar',
    createdAt: isoDaysAgo(2),
  },
];

export const DEMO_SUBMISSIONS: Submission[] = [
  // Graded work
  {
    id: 'sub-1',
    assignmentId: 'a-vocab-quiz',
    studentId: 's-madina',
    text:
      '1. The research shows that technology improves access to education.\n2. Students need a significant amount of time to build deep understanding.\n' +
      '3. The government funds alternative approaches to teacher training.\n4. A considerable number of schools now use digital tools.\n' +
      '5. Teachers play a critical role in motivating young learners.',
    files: [],
    submittedAt: isoDaysAgo(8),
    points: 9,
    feedback: 'Very good sentences. Watch the spelling of "considerable".',
    gradedAt: isoDaysAgo(6),
  },
  {
    id: 'sub-2',
    assignmentId: 'a-c1-debate',
    studentId: 's-madina',
    text:
      'A skill I would like to learn is public speaking. I am quite comfortable writing, but standing in front of an audience is a different matter. ' +
      'When I presented my project last term, my voice shook and I forgot my opening sentence. I would like to master it because almost every career path eventually asks for it.',
    files: [],
    submittedAt: isoDaysAgo(3),
    points: 13,
    feedback: 'Good fluency and a clear personal example. Work on stress on multi-syllable words.',
    gradedAt: isoDaysAgo(2),
  },
  // Submitted, waiting for marking
  {
    id: 'sub-3',
    assignmentId: 'a-task2-essay',
    studentId: 's-aziz',
    text:
      'Technology has become one of the most debated topics in education. While some claim that digital tools have made lessons more efficient, others argue that they have weakened our ability to think for ourselves. This essay will discuss both perspectives before offering a personal opinion.',
    files: [],
    submittedAt: isoDaysAgo(1),
    points: null,
    feedback: '',
    gradedAt: null,
  },
  {
    id: 'sub-4',
    assignmentId: 'a-c1-summary',
    studentId: 's-nodira',
    text:
      'The passage argues that automation will reshape rather than replace professional work. Although routine tasks will disappear, demand for judgement and communication is expected to grow, so schools should focus on transferable skills.',
    files: [],
    submittedAt: isoDaysAgo(1),
    points: null,
    feedback: '',
    gradedAt: null,
  },
  // Submitted late, then closed
  {
    id: 'sub-5',
    assignmentId: 'a-reading-set',
    studentId: 's-madina',
    text:
      'Questions 14–26: 14 F, 15 NG, 16 T, 17 T, 18 NG, 19 F, 20 T, 21 F, 22 T, 23 NG, 24 F, 25 T, 26 NG. Method note: for NOT GIVEN I checked whether the passage only implied the idea or said it directly.',
    files: [],
    submittedAt: isoDaysAgo(1),
    points: 8,
    feedback: 'Solid method note — that is exactly the right test for NOT GIVEN.',
    gradedAt: isoDaysAgo(1),
  },
  {
    id: 'sub-6',
    assignmentId: 'a-vocab-quiz',
    studentId: 's-temur',
    text: 'Exercise completed in the notebook.',
    files: [],
    submittedAt: isoDaysAgo(7),
    points: 6,
    feedback: 'Too short — please write the full sentences next time.',
    gradedAt: isoDaysAgo(5),
  },
];

/** Demo books get generated PDF content so students have something to open. */
export const DEMO_BOOK_TEXT: Record<string, { title: string; paragraphs: string[] }> = {
  'b-pathway': {
    title: 'Pathway to IELTS B2',
    paragraphs: [
      'Welcome to Pathway to IELTS B2. This course book was prepared by the teaching team and is used in the Monday/Wednesday evening group. Each unit takes two lessons and ends with a short progress check.',
      'Unit 1 — Writing Task 2 foundations. A good Task 2 answer needs four things: a position that answers the question, paragraphs that each make one point, evidence or examples that are relevant, and grammar accurate enough not to cost the reader effort.',
      'The most common mistake is a memorised introduction. Examiners are trained to ignore material that does not answer this particular question, so spend the first two minutes deciding what you actually think.',
      'Unit 2 — Reading: True / False / Not Given. Ask one question of every statement: does the passage tell me this is TRUE, does it tell me it is FALSE, or does it simply not say? The third answer is not the same as "I cannot find it quickly".',
      'Practice: Passage 2, questions 14–26. Allow 20 minutes. Then read the explanations in the key and underline the sentence that decides each answer.',
      'Unit 3 — Listening maps. Before the recording starts, find the entrance and the compass. As the speaker gives directions, move your pen on the map; do not wait for the word in the question.',
      'Progress check: Section 2, questions 11–15. Write your score on the worksheet.',
    ],
  },
  'b-grammar': {
    title: 'Grammar in Practice — Intermediate',
    paragraphs: [
      'This workbook gives short explanations followed by controlled practice. Work through one page at a time and check your answers immediately.',
      'Present simple. Use the present simple for habits, routines and facts: I study every evening. She works in a language centre. The school opens at nine.',
      'Remember the third person -s. It is the most common error in written work at this level: he studies, she watches, the class finishes.',
      'Exercise A (page 18). Complete sentences 1–20 with the correct present simple form. Write the full sentence, not only the verb.',
      'Present continuous. Use it for actions in progress now, or for temporary situations: We are revising for the exam this week.',
      'Answers are on page 96. If you make more than five mistakes, return to the explanation before continuing.',
    ],
  },
  'b-vocab': {
    title: 'Academic Word List Essentials',
    paragraphs: [
      'The Academic Word List contains the words that appear most often in university texts across all subjects. Research shows consistently high value: these words allow you to understand academic texts and write about them with precision.',
      '1. analyse — to examine something in detail. The report analyses the results of the survey.',
      '2. approach — a way of dealing with a situation. The teacher chose a communicative approach.',
      '3. area — a part of a subject or place. Grammar is the area I find most difficult.',
      '4. assess — to judge the quality of something. Teachers assess writing against four criteria.',
      '5. assume — to accept something as true without proof. Do not assume every word in the question is important.',
      'Study strategy: choose five words a day, write one sentence of your own for each, and review yesterday\'s words before adding new ones.',
    ],
  },
};

export function emptySnapshot(): AcademySnapshot {
  return {
    isTeacher: true,
    classes: [],
    students: [],
    books: [],
    assignments: [],
    submissions: [],
  };
}

export function demoSnapshot(): AcademySnapshot {
  return {
    isTeacher: true,
    classes: DEMO_CLASSES.map((c) => ({ ...c, studentIds: [...c.studentIds] })),
    students: DEMO_STUDENTS.map((s) => ({ ...s })),
    books: DEMO_BOOKS.map((b) => ({ ...b })),
    assignments: DEMO_ASSIGNMENTS.map((a) => ({ ...a })),
    submissions: DEMO_SUBMISSIONS.map((s) => ({ ...s, files: [...s.files] })),
  };
}
