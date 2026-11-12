import type { MlWritingSection } from './types';

/**
 * MULTILEVEL WRITING — 2 parts, 3 tasks, one shared 60-minute timer.
 *
 * Part 1 has two tasks that share the SAME source message: an informal
 * message to a friend (about 50 words) and a formal message to a manager
 * (120-150 words). Part 2 is a longer response (180-200 words).
 */
export const ML_WRITING: MlWritingSection = {
  totalMinutes: 60,
  sourceMessage: {
    from: 'Bekzod Rahimov, Course Coordinator',
    subject: 'Changes to the evening English course',
    body: `Dear students,

I am writing to let you know about some changes to the evening English course that starts next month.

The classes will now be on Tuesday and Thursday, from 6 p.m. to 7.30 p.m. (previously Monday and Wednesday). The classroom has also changed: we will meet in Room 204 on the second floor instead of Room 106.

Unfortunately, the course fee will increase from 400,000 so'm to 450,000 so'm. Students who pay before 20 February will keep the old price.

Please note that the class size is limited to twelve students, so please confirm your place as soon as possible.

Kind regards,
Bekzod Rahimov`,
  },
  tasks: [
    {
      id: 'ml-w1',
      part: 1,
      label: 'Part 1 · Task 1.1',
      taskType: 'Informal email to a friend',
      prompt:
        'Write a short message to your friend Dilnoza about the email above. Tell her about the changes and ask if she still wants to join the course.',
      minWords: 50,
      maxWords: 70,
      guidance: [
        'Write about 50 words.',
        'Use informal language — this is a message to a friend, so "Hi Dilnoza" and "See you" are fine.',
        'Cover the key changes: the new days, the new room and the new price.',
        'End with a question so your friend replies.',
      ],
    },
    {
      id: 'ml-w2',
      part: 1,
      label: 'Part 1 · Task 1.2',
      taskType: 'Formal email to a manager',
      prompt:
        'Write a formal email to Mr Rahimov about the same situation. Explain that you would like to join the course, ask two questions about the changes, and confirm your place.',
      minWords: 120,
      maxWords: 150,
      guidance: [
        'Write 120–150 words.',
        'Use formal language: "Dear Mr Rahimov" and "Yours sincerely".',
        'Open with the reason you are writing.',
        'Ask two clear questions, for example about paying the old price or about the room.',
        'Confirm your place and close politely.',
      ],
    },
    {
      id: 'ml-w3',
      part: 2,
      label: 'Part 2 · Task 2',
      taskType: 'Online discussion post',
      prompt:
        'An online forum is discussing this question:\n\n"Some people think evening classes are better than daytime classes for adult learners. Others disagree."\n\nWrite a post for the forum. Give your opinion and support it with reasons and examples from your own experience.',
      minWords: 180,
      maxWords: 220,
      guidance: [
        'Write 180–200 words.',
        'State your opinion clearly in the first few lines.',
        'Give at least two reasons, each with an example.',
        'Use linking words: first, however, in addition, for example, in conclusion.',
        'Finish with a short conclusion that repeats your view.',
      ],
    },
  ],
};
