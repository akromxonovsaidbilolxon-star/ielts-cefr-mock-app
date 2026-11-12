import type { MlReadingPart } from './types';

/**
 * MULTILEVEL READING — 5 parts, 35 questions, 60 minutes.
 * Difficulty rises from Part 1 (A1-A2 notices) to Part 5 (C1 academic text).
 */
export const ML_READING_PARTS: MlReadingPart[] = [
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    partNumber: 1,
    difficulty: 'A1',
    title: 'Part 1 — Notices and short messages',
    instruction:
      'Read the notices and choose the correct answer, A, B or C.',
    intro: 'Look at the four short texts.',
    blocks: [
      {
        kind: 'notice',
        heading: 'City Library',
        text: 'The library is open from 9 a.m. to 6 p.m. on Monday to Friday. On Saturday it closes at 1 p.m. The library is closed on Sunday.',
      },
      {
        kind: 'notice',
        heading: 'Supermarket',
        text: 'Fresh bread is half price every day after 6 p.m. Fruit and vegetables are on the first floor.',
      },
      {
        kind: 'notice',
        heading: 'Sports Centre',
        text: 'The swimming pool is closed this week for cleaning. The gym is open as usual. Classes start again on Monday.',
      },
      {
        kind: 'notice',
        heading: 'Bus 14',
        text: 'The bus does not stop at the market on Saturdays because of road works. Please use the stop at the station.',
      },
    ],
    questions: [
      {
        number: 1,
        difficulty: 'A1',
        prompt: 'What time does the library close on Saturday?',
        type: 'mcq',
        options: ['1 p.m.', '6 p.m.', '9 a.m.'],
        answer: 'A',
        explanation: '"On Saturday it closes at 1 p.m."',
      },
      {
        number: 2,
        difficulty: 'A1',
        prompt: 'When is bread cheaper?',
        type: 'mcq',
        options: ['in the morning', 'after 6 p.m.', 'on Sunday'],
        answer: 'B',
        explanation: '"Fresh bread is half price every day after 6 p.m."',
      },
      {
        number: 3,
        difficulty: 'A1',
        prompt: 'What is closed this week?',
        type: 'mcq',
        options: ['the gym', 'the swimming pool', 'the classes'],
        answer: 'B',
        explanation: '"The swimming pool is closed this week for cleaning."',
      },
      {
        number: 4,
        difficulty: 'A1',
        prompt: 'If you want to take bus 14 on Saturday, you should go to',
        type: 'mcq',
        options: ['the market', 'the station', 'the library'],
        answer: 'B',
        explanation: '"Please use the stop at the station."',
      },
      {
        number: 5,
        difficulty: 'A2',
        prompt: 'On which day is the library closed?',
        type: 'mcq',
        options: ['Monday', 'Saturday', 'Sunday'],
        answer: 'C',
        explanation: '"The library is closed on Sunday."',
      },
      {
        number: 6,
        difficulty: 'A2',
        prompt: 'Why does bus 14 not stop at the market?',
        type: 'mcq',
        options: ['road works', 'a holiday', 'bad weather'],
        answer: 'A',
        explanation: '"because of road works".',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 2,
    partNumber: 2,
    difficulty: 'A2',
    title: 'Part 2 — An email and an advertisement',
    instruction:
      'Read the texts and choose the correct answer, A, B or C.',
    blocks: [
      {
        kind: 'email',
        heading: 'Email',
        text: `From: Kamila
To: Jasur
Subject: Saturday

Hi Jasur,

I am sorry, but I cannot come to the cinema on Saturday. My sister is visiting from Samarkand and she arrives at 2 p.m. Can we go on Sunday instead? The film starts at 7 p.m., so let us meet at the café next to the cinema at 6.30.

Please tell me if Sunday is good for you.

Kamila`,
      },
      {
        kind: 'advert',
        heading: 'Language School — New Classes',
        text: 'Evening English classes start on 3 March. Classes are on Monday and Wednesday, 6 p.m. to 8 p.m. The course costs 450,000 so\'m for ten weeks. Students pay 300,000 so\'m. To join, call 71 200 55 44 or visit our office on Navoi Street.',
      },
    ],
    questions: [
      {
        number: 7,
        difficulty: 'A2',
        prompt: 'Why can Kamila not go to the cinema on Saturday?',
        type: 'mcq',
        options: ['She is working.', 'Her sister is visiting.', 'She is ill.'],
        answer: 'B',
        explanation: '"My sister is visiting from Samarkand".',
      },
      {
        number: 8,
        difficulty: 'A2',
        prompt: 'When does Kamila suggest meeting?',
        type: 'mcq',
        options: ['6.30 p.m.', '7 p.m.', '2 p.m.'],
        answer: 'A',
        explanation: '"let us meet at the café next to the cinema at 6.30".',
      },
      {
        number: 9,
        difficulty: 'A2',
        prompt: 'What time does the film start?',
        type: 'mcq',
        options: ['6.30 p.m.', '7 p.m.', '8 p.m.'],
        answer: 'B',
        explanation: '"The film starts at 7 p.m."',
      },
      {
        number: 10,
        difficulty: 'A2',
        prompt: 'On which days are the English classes?',
        type: 'mcq',
        options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Saturday and Sunday'],
        answer: 'A',
        explanation: '"Classes are on Monday and Wednesday".',
      },
      {
        number: 11,
        difficulty: 'A2',
        prompt: 'How much do students pay for the course?',
        type: 'mcq',
        options: ['300,000 so\'m', '450,000 so\'m', '200,000 so\'m'],
        answer: 'A',
        explanation: '"Students pay 300,000 so\'m."',
      },
      {
        number: 12,
        difficulty: 'A2',
        prompt: 'How long is the course?',
        type: 'mcq',
        options: ['ten weeks', 'ten days', 'three weeks'],
        answer: 'A',
        explanation: '"The course costs 450,000 so\'m for ten weeks."',
      },
      {
        number: 13,
        difficulty: 'B1',
        prompt: 'Where does Kamila want to meet Jasur?',
        type: 'mcq',
        options: ['at the cinema', 'at the café', 'at the station'],
        answer: 'B',
        explanation: '"the café next to the cinema at 6.30".',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 3,
    partNumber: 3,
    difficulty: 'B1',
    title: 'Part 3 — An article about cycling',
    instruction:
      'Read the article and choose the correct answer, A, B or C.',
    blocks: [
      {
        kind: 'prose',
        heading: 'Why more people are cycling to work',
        text: `Ten years ago, only a small number of people in the city cycled to work. Today, almost one in eight workers does. The change has not happened by accident.

The first reason is cost. A monthly bus ticket costs about 120,000 so'm, and running a car costs far more. A good bicycle costs the price of three or four months of bus tickets, and after that it is almost free.

The second reason is time. In the city centre, traffic moves slowly in the morning. A cyclist can often cross the centre in fifteen minutes, while a car takes twice as long. For journeys under five kilometres, the bicycle is usually the fastest option.

The third reason is the new cycle lanes. The city built forty kilometres of separated lanes between 2019 and 2022. Cycling on a separated lane feels much safer, and safety was the main reason people gave for not cycling before.

Not everyone is happy. Some shop owners say that cycle lanes take away parking spaces and that customers cannot carry heavy shopping on a bike. The city has answered by building small parking areas for bicycles near the main streets.`,
      },
    ],
    questions: [
      {
        number: 14,
        difficulty: 'B1',
        prompt: 'How many workers cycle to work today?',
        type: 'mcq',
        options: ['about one in eight', 'about one in ten', 'about one in three'],
        answer: 'A',
        explanation: '"almost one in eight workers does".',
      },
      {
        number: 15,
        difficulty: 'B1',
        prompt: 'According to the article, a bicycle costs about the same as',
        type: 'mcq',
        options: [
          'one month of bus tickets.',
          'three or four months of bus tickets.',
          'ten months of bus tickets.',
        ],
        answer: 'B',
        explanation: '"the price of three or four months of bus tickets".',
      },
      {
        number: 16,
        difficulty: 'B1',
        prompt: 'For journeys under five kilometres, a bicycle is usually',
        type: 'mcq',
        options: ['the fastest option.', 'the safest option.', 'the most expensive option.'],
        answer: 'A',
        explanation: '"the bicycle is usually the fastest option".',
      },
      {
        number: 17,
        difficulty: 'B1',
        prompt: 'How many kilometres of cycle lanes were built?',
        type: 'mcq',
        options: ['fourteen', 'forty', 'four hundred'],
        answer: 'B',
        explanation: '"the city built forty kilometres of separated lanes".',
      },
      {
        number: 18,
        difficulty: 'B1',
        prompt: 'What was the main reason people did not cycle before?',
        type: 'mcq',
        options: ['cost', 'safety', 'the weather'],
        answer: 'B',
        explanation: '"safety was the main reason people gave for not cycling before".',
      },
      {
        number: 19,
        difficulty: 'B1',
        prompt: 'What do some shop owners complain about?',
        type: 'mcq',
        options: [
          'losing parking spaces',
          'too much noise',
          'the cost of bicycles',
        ],
        answer: 'A',
        explanation: '"cycle lanes take away parking spaces".',
      },
      {
        number: 20,
        difficulty: 'B1',
        prompt: 'How has the city responded to the complaints?',
        type: 'mcq',
        options: [
          'by removing some cycle lanes',
          'by building bicycle parking areas',
          'by lowering bus prices',
        ],
        answer: 'B',
        explanation: '"building small parking areas for bicycles near the main streets".',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 4,
    partNumber: 4,
    difficulty: 'B2',
    title: 'Part 4 — An article about remote work',
    instruction:
      'Read the article and answer the questions. Choose the correct answer, A, B, C or D.',
    blocks: [
      {
        kind: 'prose',
        heading: 'The unexpected lesson of remote work',
        text: `When offices closed in 2020, many managers predicted a collapse in productivity. The opposite often happened, at least at first. Studies across several countries found that output in routine tasks, such as data entry and basic administration, actually rose. Employees saved the commute and started earlier.

The picture became less clear as time went on. Productivity in routine work held up, but work that depended on unexpected conversations declined. Researchers at a large technology firm found that the number of weak ties, the casual contacts with people outside one's immediate team, fell by about a quarter. These ties are rarely valued by employees, yet they are the main route by which new ideas travel between departments.

A second finding is about how people judge their own productivity. When asked, remote workers consistently reported being more productive than their managers believed they were. Neither group was necessarily wrong: employees measured output, while managers measured visibility. The disagreement was not about facts but about which facts count.

The most useful conclusion is not that remote work is good or bad. It is that the tasks we call "work" are not equally suited to it. Focused, individual tasks survive distance well. Coordination, mentoring and the informal exchange that produces innovation do not. Organisations that adapted best did not choose between office and home; they matched the location to the task.`,
      },
    ],
    questions: [
      {
        number: 21,
        difficulty: 'B2',
        prompt: 'What happened to routine task output when offices closed?',
        type: 'mcq',
        options: ['It fell sharply.', 'It rose.', 'It stayed the same.', 'It was not measured.'],
        answer: 'B',
        explanation: '"output in routine tasks ... actually rose".',
      },
      {
        number: 22,
        difficulty: 'B2',
        prompt: 'What are "weak ties"?',
        type: 'mcq',
        options: [
          'relationships with people outside your immediate team',
          'friendships that end quickly',
          'contacts with clients only',
          'unreliable colleagues',
        ],
        answer: 'A',
        explanation: '"the casual contacts with people outside one\'s immediate team".',
      },
      {
        number: 23,
        difficulty: 'B2',
        prompt: 'Why does the writer say weak ties matter?',
        type: 'mcq',
        options: [
          'Employees value them highly.',
          'They are how new ideas travel between departments.',
          'They reduce costs.',
          'They replace mentoring.',
        ],
        answer: 'B',
        explanation: '"they are the main route by which new ideas travel between departments".',
      },
      {
        number: 24,
        difficulty: 'B2',
        prompt: 'How did the number of weak ties change?',
        type: 'mcq',
        options: ['by about a quarter', 'by half', 'not at all', 'by a tenth'],
        answer: 'A',
        explanation: '"fell by about a quarter".',
      },
      {
        number: 25,
        difficulty: 'B2',
        prompt: 'Why did workers and managers disagree about productivity?',
        type: 'mcq',
        options: [
          'Managers had better data.',
          'They measured different things.',
          'Workers were dishonest.',
          'Neither group was asked.',
        ],
        answer: 'B',
        explanation: '"employees measured output, while managers measured visibility".',
      },
      {
        number: 26,
        difficulty: 'B2',
        prompt: 'What is the writer\'s main conclusion?',
        type: 'mcq',
        options: [
          'Remote work is better than office work.',
          'Office work is always more productive.',
          'Different tasks suit different locations.',
          'The question cannot be answered.',
        ],
        answer: 'C',
        explanation: '"they matched the location to the task".',
      },
      {
        number: 27,
        difficulty: 'B2',
        prompt: 'Which type of work does the writer say suffers most from distance?',
        type: 'mcq',
        options: ['focused individual tasks', 'data entry', 'coordination and mentoring', 'basic administration'],
        answer: 'C',
        explanation: '"Coordination, mentoring and the informal exchange ... do not" survive distance well.',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 5,
    partNumber: 5,
    difficulty: 'C1',
    title: 'Part 5 — An academic text on memory',
    instruction:
      'Read the text and answer the questions. Choose the correct answer, A, B, C or D.',
    blocks: [
      {
        kind: 'prose',
        heading: 'Reconsolidation and the instability of memory',
        text: `For much of the twentieth century, memory was understood as a kind of storage: experiences were written to the brain and later retrieved, more or less intact. The metaphor was architectural, and it was wrong in an important respect.

Work on reconsolidation has shown that recalling a memory does not leave it unchanged. When a memory is reactivated, it becomes temporarily labile, susceptible to modification, before being stabilised again in a process that resembles the original consolidation. In effect, every act of remembering is also an act of rewriting.

The implications are considerable. It means that a confident recollection may be the product of many previous recollections rather than a faithful record of the event. Elizabeth Loftus demonstrated this in a series of experiments in which participants were gently led to recall details that had never occurred; a substantial minority subsequently reported these invented details with conviction.

Critics of the reconsolidation literature raise a methodological objection. Much of the strongest evidence comes from animal studies using fear conditioning, and it is not obvious that the same mechanism governs the richly semantic memories humans care about. Replications in human episodic memory have been uneven, and some prominent findings have not survived attempts to reproduce them.

A more measured reading is available. Reconsolidation is probably not a universal property of all memory, but a family of processes that occur under particular conditions, notably when the reactivated memory is surprising or when it conflicts with new information. Under those conditions, the memory becomes editable; under others, it may be retrieved without change. The interesting question is therefore not whether memory is reconstructive, which is settled, but when and how far.`,
      },
    ],
    questions: [
      {
        number: 28,
        difficulty: 'C1',
        prompt: 'The architectural metaphor for memory is criticised because it implies',
        type: 'mcq',
        options: [
          'memories are stored unchanged and retrieved intact.',
          'memories are stored in the hippocampus.',
          'memory is unlimited.',
          'memory depends on language.',
        ],
        answer: 'A',
        explanation: 'The metaphor implies "experiences were written to the brain and later retrieved, more or less intact".',
      },
      {
        number: 29,
        difficulty: 'C1',
        prompt: 'According to the text, recalling a memory',
        type: 'mcq',
        options: [
          'strengthens it permanently.',
          'makes it temporarily open to change.',
          'has no effect on it.',
          'always distorts it beyond recognition.',
        ],
        answer: 'B',
        explanation: '"it becomes temporarily labile, susceptible to modification".',
      },
      {
        number: 30,
        difficulty: 'C1',
        prompt: 'What does Loftus\'s work suggest?',
        type: 'mcq',
        options: [
          'People never invent details.',
          'Confident recollections may include details that never occurred.',
          'Memory improves with repetition.',
          'Animals and humans remember identically.',
        ],
        answer: 'B',
        explanation: 'A substantial minority "reported these invented details with conviction".',
      },
      {
        number: 31,
        difficulty: 'C1',
        prompt: 'What is the critics\' main objection?',
        type: 'mcq',
        options: [
          'Reconsolidation has never been observed.',
          'Evidence from fear conditioning in animals may not apply to human semantic memory.',
          'The experiments were unethical.',
          'The theory is too old.',
        ],
        answer: 'B',
        explanation: '"it is not obvious that the same mechanism governs the richly semantic memories humans care about".',
      },
      {
        number: 32,
        difficulty: 'C1',
        prompt: 'The phrase "replications ... have been uneven" means',
        type: 'mcq',
        options: [
          'the studies were all successful.',
          'attempts to reproduce the findings have had mixed success.',
          'the studies were never repeated.',
          'the findings were published unevenly.',
        ],
        answer: 'B',
        explanation: '"some prominent findings have not survived attempts to reproduce them".',
      },
      {
        number: 33,
        difficulty: 'C1',
        prompt: 'What is the writer\'s "more measured reading"?',
        type: 'mcq',
        options: [
          'Reconsolidation applies to all memory equally.',
          'Reconsolidation occurs only under particular conditions.',
          'Reconsolidation is a myth.',
          'Reconsolidation only affects animals.',
        ],
        answer: 'B',
        explanation: '"a family of processes that occur under particular conditions".',
      },
      {
        number: 34,
        difficulty: 'C1',
        prompt: 'Under which condition does a memory most clearly become editable?',
        type: 'mcq',
        options: [
          'when it is recalled in silence',
          'when it is surprising or conflicts with new information',
          'when it is very old',
          'when it is emotional',
        ],
        answer: 'B',
        explanation: '"when the reactivated memory is surprising or when it conflicts with new information".',
      },
      {
        number: 35,
        difficulty: 'C1',
        prompt: 'The writer says the interesting question is',
        type: 'mcq',
        options: [
          'whether memory is reconstructive.',
          'when and to what extent memory is reconstructive.',
          'where memory is stored.',
          'how to improve memory.',
        ],
        answer: 'B',
        explanation: '"when and how far".',
      },
    ],
  },
];

export const ML_READING_QUESTIONS = ML_READING_PARTS.flatMap((p) => p.questions);
