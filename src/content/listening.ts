import type { ListeningPart } from '../types';

export const LISTENING_PARTS: ListeningPart[] = [
  /* ---------------------------------------------------------------- */
  /* PART 1 — Everyday social conversation                             */
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    title: 'Part 1 — Sports Centre Membership',
    context:
      'A conversation between a man and a receptionist at a community sports centre.',
    script: [
      { speaker: 'Receptionist', text: 'Good morning, Harbourside Community Sports Centre. How can I help you?' },
      { speaker: 'Man', text: 'Hello. I moved into the area last month and I would like to join the centre. Could you tell me about the membership options?' },
      { speaker: 'Receptionist', text: 'Of course. We have three types. The full membership covers the gym, the pool and all the classes, and that costs forty-two pounds a month.' },
      { speaker: 'Man', text: 'And is there anything cheaper? I mainly want to swim.' },
      { speaker: 'Receptionist', text: 'Then the swim-only membership would suit you. That is twenty-six pounds a month, but it does not include the gym.' },
      { speaker: 'Man', text: 'I see. And is there a joining fee?' },
      { speaker: 'Receptionist', text: 'There is normally a fifteen pound joining fee, but we are running a promotion until the end of the month, so at the moment it is waived entirely.' },
      { speaker: 'Man', text: 'That sounds good. What about the pool timetable?' },
      { speaker: 'Receptionist', text: 'The pool opens at six thirty in the morning and closes at nine thirty at night on weekdays. At weekends we close earlier, at seven in the evening.' },
      { speaker: 'Man', text: 'And is there a quiet time? I do not like swimming when it is crowded.' },
      { speaker: 'Receptionist', text: 'The quietest sessions are between ten and twelve in the morning — that is when the school groups have left and the lunchtime crowd has not arrived yet.' },
      { speaker: 'Man', text: 'Great. Do I need to bring anything when I come to sign up?' },
      { speaker: 'Receptionist', text: 'Just some proof of address, such as a utility bill, and a form of photo identification. The name on our system should be spelled exactly as it appears on your ID.' },
      { speaker: 'Man', text: 'Sorry, it is spelled A-L-L-E-N-S-O-N. No double L.' },
      { speaker: 'Receptionist', text: 'Let me check the spelling. So that is Allenson with one L. Perfect. And could I take a telephone number in case a class is cancelled?' },
      { speaker: 'Man', text: 'Yes, it is oh seven seven double nine, two four six, eight one three. I am usually available after five.' },
      { speaker: 'Receptionist', text: 'Thank you. One more thing — members get a discount at the cafe in the main building. It is ten per cent off all hot drinks.' },
      { speaker: 'Man', text: 'That is a nice bonus. The cafe is in the main building, did you say?' },
      { speaker: 'Receptionist', text: 'That is right, on the ground floor next to the reception desk. And if you come on a Saturday there is free parking in the car park behind the building.' },
      { speaker: 'Man', text: 'About the studio classes — is there anything for beginners?' },
      { speaker: 'Receptionist', text: 'The beginners yoga class runs on Tuesday evenings at seven, and the instructor is called Marta. Most people find her very patient.' },
      { speaker: 'Man', text: 'Tuesday is difficult for me because I work late. Is there anything on Thursday?' },
      { speaker: 'Receptionist', text: 'On Thursday there is a beginners pilates class at six thirty. That is probably the most popular class we run for new members.' },
      { speaker: 'Man', text: 'That sounds ideal. I will come in tomorrow and sign up. Thank you very much.' },
      { speaker: 'Receptionist', text: 'You are welcome. We look forward to seeing you.' },
    ],
    questionGroups: [
      {
        id: 'l1-g1',
        heading: 'Questions 1–6',
        instruction:
          'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
        layout: 'notes',
        questions: [
          { number: 1, prompt: 'Full membership costs £______ per month.', type: 'text', answer: '42|forty-two|forty two', explanation: '"forty-two pounds a month".' },
          { number: 2, prompt: 'Swim-only membership costs £______ per month.', type: 'text', answer: '26|twenty-six|twenty six', explanation: '"twenty-six pounds a month".' },
          { number: 3, prompt: 'The joining fee has been ______ during the current promotion.', type: 'text', answer: 'waived|removed|cancelled|canceled', explanation: 'The receptionist says the fee "is waived entirely".' },
          { number: 4, prompt: 'The pool closes at ______ pm at weekends.', type: 'text', answer: '7|seven|19:00|7pm', explanation: '"At weekends we close earlier, at seven in the evening."' },
          { number: 5, prompt: 'The quietest sessions are from 10 am to ______ am.', type: 'text', answer: '12|twelve|noon', explanation: '"between ten and twelve in the morning".' },
          { number: 6, prompt: 'Surname: ______', type: 'text', answer: 'Allenson', explanation: 'The caller spells it A-L-L-E-N-S-O-N.' },
        ],
      },
      {
        id: 'l1-g2',
        heading: 'Questions 7–10',
        instruction: 'Choose the correct letter, A, B or C.',
        layout: 'list',
        questions: [
          {
            number: 7,
            prompt: 'What proof must new members bring?',
            type: 'mcq',
            options: [
              'a passport and a photograph',
              'a utility bill and photo identification',
              'a bank statement and a letter from an employer',
            ],
            answer: 'B',
            explanation: '"Just some proof of address, such as a utility bill, and a form of photo identification."',
          },
          {
            number: 8,
            prompt: 'What discount do members receive in the cafe?',
            type: 'mcq',
            options: ['ten per cent off hot drinks', 'fifteen per cent off all food', 'a free drink with every meal'],
            answer: 'A',
            explanation: '"It is ten per cent off all hot drinks."',
          },
          {
            number: 9,
            prompt: 'The beginners yoga class is on',
            type: 'mcq',
            options: ['Tuesday evening.', 'Thursday evening.', 'Saturday morning.'],
            answer: 'A',
            explanation: 'The yoga class runs Tuesday evenings at seven; Thursday is pilates.',
          },
          {
            number: 10,
            prompt: 'Which class will the man probably join?',
            type: 'mcq',
            options: ['beginners yoga', 'beginners pilates', 'the swimming club'],
            answer: 'B',
            explanation: 'He cannot attend Tuesday, so he chooses the Thursday pilates class.',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PART 2 — Monologue                                                */
  /* ---------------------------------------------------------------- */
  {
    id: 2,
    title: 'Part 2 — Greenfield Wildlife Park',
    context: 'A guide gives new volunteers an introduction to the wildlife park.',
    script: [
      { speaker: 'Guide', text: 'Welcome, everyone, to Greenfield Wildlife Park. My name is Rachel and I coordinate the volunteer programme.' },
      { speaker: 'Guide', text: 'Greenfield was opened in 1987 on the site of a former dairy farm. For the first decade it housed only British species, but we now care for animals from six continents.' },
      { speaker: 'Guide', text: 'The park is divided into four zones. The first zone, closest to the entrance, is the wetland area, where you will find our otters and a large colony of herons.' },
      { speaker: 'Guide', text: 'Beyond that is the woodland zone. This is the largest area, covering nearly sixty per cent of the park, and it is home to deer, foxes and several species of owl.' },
      { speaker: 'Guide', text: 'The third zone is the savannah, which opened in 2004 and houses our zebras and giraffes. The fourth and smallest zone is the discovery centre, where we run school workshops.' },
      { speaker: 'Guide', text: 'Now, about your volunteering. Most of you will start in the animal care team, which begins at eight in the morning. The work involves preparing food, cleaning enclosures and recording what each animal eats.' },
      { speaker: 'Guide', text: 'Everyone must complete a two-day training course before you begin. The next course runs on the fourteenth of March. It is free, and lunch is provided, but you need to bring your own boots.' },
      { speaker: 'Guide', text: 'You will be given a green T-shirt and a name badge. Please wear the T-shirt whenever you are on site, because visitors often ask volunteers for directions.' },
      { speaker: 'Guide', text: 'There are a few rules. Do not feed any animal unless a keeper has given you permission. Do not enter an enclosure alone, ever. And please wash your hands at the station beside every gate before you leave a zone.' },
      { speaker: 'Guide', text: 'One last point: the park receives around three hundred thousand visitors a year, and most of them arrive between eleven and two. If you need to move equipment across the site, do it before ten in the morning, when the paths are still quiet.' },
      { speaker: 'Guide', text: 'Any questions so far? No? Then let us walk down to the wetland zone and meet the otters.' },
    ],
    questionGroups: [
      {
        id: 'l2-g1',
        heading: 'Questions 11–15',
        instruction:
          'Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        layout: 'notes',
        questions: [
          { number: 11, prompt: 'Greenfield Wildlife Park opened in the year ______.', type: 'text', answer: '1987', explanation: '"Greenfield was opened in 1987".' },
          { number: 12, prompt: 'The park was built on the site of a former ______.', type: 'text', answer: 'dairy farm', explanation: '"on the site of a former dairy farm".' },
          { number: 13, prompt: 'The wetland zone contains otters and a large colony of ______.', type: 'text', answer: 'herons', explanation: '"a large colony of herons".' },
          { number: 14, prompt: 'The woodland zone covers nearly ______ per cent of the park.', type: 'text', answer: '60|sixty', explanation: '"covering nearly sixty per cent of the park".' },
          { number: 15, prompt: 'The savannah zone opened in ______.', type: 'text', answer: '2004', explanation: '"the savannah, which opened in 2004".' },
        ],
      },
      {
        id: 'l2-g2',
        heading: 'Questions 16–20',
        instruction: 'Choose the correct letter, A, B or C.',
        layout: 'list',
        questions: [
          {
            number: 16,
            prompt: 'Volunteers in the animal care team start work at',
            type: 'mcq',
            options: ['7 am.', '8 am.', '9 am.'],
            answer: 'B',
            explanation: '"the animal care team, which begins at eight in the morning".',
          },
          {
            number: 17,
            prompt: 'What must volunteers bring to the training course?',
            type: 'mcq',
            options: ['their own lunch', 'a name badge', 'their own boots'],
            answer: 'C',
            explanation: '"lunch is provided, but you need to bring your own boots".',
          },
          {
            number: 18,
            prompt: 'Volunteers must wear the green T-shirt because',
            type: 'mcq',
            options: [
              'it identifies them to visitors.',
              'it protects their clothes.',
              'it is required by law.',
            ],
            answer: 'A',
            explanation: '"because visitors often ask volunteers for directions".',
          },
          {
            number: 19,
            prompt: 'Volunteers should move equipment across the site',
            type: 'mcq',
            options: ['before 10 am.', 'between 11 am and 2 pm.', 'after 4 pm.'],
            answer: 'A',
            explanation: '"do it before ten in the morning, when the paths are still quiet".',
          },
          {
            number: 20,
            prompt: 'The park receives about ______ visitors each year.',
            type: 'mcq',
            options: ['thirty thousand', 'three hundred thousand', 'three million'],
            answer: 'B',
            explanation: '"around three hundred thousand visitors a year".',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PART 3 — Academic discussion                                      */
  /* ---------------------------------------------------------------- */
  {
    id: 3,
    title: 'Part 3 — Research Project Discussion',
    context:
      'Two students, Daniel and Priya, discuss their psychology project with their tutor.',
    script: [
      { speaker: 'Tutor', text: 'So, Daniel and Priya, you have chosen to look at how sleep affects memory in teenagers. Tell me how the project is going.' },
      { speaker: 'Daniel', text: 'We have done the background reading, but we are struggling with the method, because the studies we found used very different designs.' },
      { speaker: 'Tutor', text: 'That is a common problem. What sort of participants can you realistically get?' },
      { speaker: 'Priya', text: 'We can use our own school, so about forty students aged sixteen to eighteen. They would all be studying for the same exams, which helps because their stress levels should be similar.' },
      { speaker: 'Tutor', text: 'Good. That is a strong point in favour of your choice. What will you actually measure?' },
      { speaker: 'Daniel', text: 'We thought we would give them a list of words to memorise in the evening, then test them the next morning. We would compare people who slept eight hours with people who slept only five.' },
      { speaker: 'Tutor', text: 'And how will you know that they really slept eight hours? Students are not always honest about bedtimes.' },
      { speaker: 'Priya', text: 'That was our worry too. Our first idea was a questionnaire, but people forget what time they went to bed. Then we considered wrist sensors, but they are far too expensive. In the end we decided to use a simple app on their phones that records when the phone is inactive.' },
      { speaker: 'Tutor', text: 'That is a sensible compromise. One weakness is that a phone left on a desk will look inactive even if the student is awake, so you should mention that limitation clearly in your report.' },
      { speaker: 'Daniel', text: 'We will. We also wondered whether we should test them twice, to reduce the effect of luck.' },
      { speaker: 'Tutor', text: 'I would definitely recommend that. Use two different word lists and swap the order between groups, so the second test does not simply measure practice.' },
      { speaker: 'Priya', text: 'What about ethics? We will need parental consent, because most of our participants are under eighteen.' },
      { speaker: 'Tutor', text: 'Yes, and you should also make sure that nobody feels pressured to stay up late for the experiment. The five-hour group is fine as long as they choose that condition themselves.' },
      { speaker: 'Daniel', text: 'Should we analyse the results with a simple average, or something more advanced?' },
      { speaker: 'Tutor', text: 'Given your sample size, a comparison of means with a significance test will be enough. Do not overcomplicate it. What you must do is present the raw data clearly in a table or graph.' },
      { speaker: 'Priya', text: 'We were going to put the raw data in an appendix and only show the averages in the main report.' },
      { speaker: 'Tutor', text: 'That is exactly right. Your main report should stay readable, and examiners like to see that you can separate evidence from interpretation.' },
      { speaker: 'Daniel', text: 'One more thing. Our deadline is the twenty-second of April, but the school holidays start on the eighth. Will we have enough time to collect the data?' },
      { speaker: 'Tutor', text: 'You will need to run the experiment before the holidays. I suggest you begin in the first week of March so that you have two full weeks for analysis afterwards.' },
      { speaker: 'Priya', text: 'That works for us. Thank you.' },
    ],
    questionGroups: [
      {
        id: 'l3-g1',
        heading: 'Questions 21–25',
        instruction: 'Choose the correct letter, A, B or C.',
        layout: 'list',
        questions: [
          {
            number: 21,
            prompt: 'What problem are the students having with the method?',
            type: 'mcq',
            options: [
              'They cannot find enough background reading.',
              'The studies they read used very different designs.',
              'Their tutor disagrees with their topic.',
            ],
            answer: 'B',
            explanation: '"the studies we found used very different designs".',
          },
          {
            number: 22,
            prompt: 'Why is using students from their own school an advantage?',
            type: 'mcq',
            options: [
              'The school has already agreed to help.',
              'The participants are all the same age.',
              'Their stress levels should be similar during exams.',
            ],
            answer: 'C',
            explanation: '"their stress levels should be similar".',
          },
          {
            number: 23,
            prompt: 'Why did the students reject wrist sensors?',
            type: 'mcq',
            options: ['They are too expensive.', 'They are unreliable.', 'They are uncomfortable.'],
            answer: 'A',
            explanation: '"they are far too expensive".',
          },
          {
            number: 24,
            prompt: 'What is the weakness of using a phone app?',
            type: 'mcq',
            options: [
              'It measures practice rather than memory.',
              'A phone left on a desk looks inactive when the student is awake.',
              'Students may refuse to install it.',
            ],
            answer: 'B',
            explanation: 'The tutor points out a phone left on a desk will look inactive.',
          },
          {
            number: 25,
            prompt: 'Why does the tutor recommend testing the participants twice?',
            type: 'mcq',
            options: [
              'To increase the amount of data.',
              'To reduce the effect of luck.',
              'To compare two different age groups.',
            ],
            answer: 'B',
            explanation: '"we should test them twice, to reduce the effect of luck" — the tutor agrees.',
          },
        ],
      },
      {
        id: 'l3-g2',
        heading: 'Questions 26–30',
        instruction:
          'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
        layout: 'notes',
        questions: [
          { number: 26, prompt: 'Students must obtain parental ______ before starting.', type: 'text', answer: 'consent', explanation: '"We will need parental consent".' },
          { number: 27, prompt: 'Participants must choose their sleep condition ______.', type: 'text', answer: 'themselves', explanation: '"as long as they choose that condition themselves".' },
          { number: 28, prompt: 'Results: compare means using a ______ test.', type: 'text', answer: 'significance', explanation: '"a comparison of means with a significance test".' },
          { number: 29, prompt: 'Raw data should appear in an ______.', type: 'text', answer: 'appendix', explanation: '"put the raw data in an appendix".' },
          { number: 30, prompt: 'Deadline for the report: ______ April.', type: 'text', answer: '22|twenty-second|twenty second|22nd', explanation: '"deadline is the twenty-second of April".' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PART 4 — Academic lecture                                         */
  /* ---------------------------------------------------------------- */
  {
    id: 4,
    title: 'Part 4 — Urban Beekeeping',
    context: 'A lecture from a module on urban ecology.',
    script: [
      { speaker: 'Lecturer', text: 'Today I want to talk about urban beekeeping, and why a practice that began as a hobby has become a subject of serious scientific debate.' },
      { speaker: 'Lecturer', text: 'Beekeeping in cities is not new. Records from Paris show hives on the roof of the opera house in the middle of the nineteenth century. But the number of urban hives has grown enormously since about 2010, largely because of media coverage of the decline of wild pollinators.' },
      { speaker: 'Lecturer', text: 'The argument usually made is simple: bees are in trouble, so keeping more bees must help. And it is true that honeybees pollinate many crops. However, the honeybee is a managed species, not an endangered one. There are more managed honeybee colonies in Europe today than at any point in the last fifty years.' },
      { speaker: 'Lecturer', text: 'The real concern is competition. A single colony of honeybees can collect food from an area of roughly three square kilometres, and it will visit an enormous range of flowers. In a city, however, the flowers are not evenly distributed. Parks and gardens may be rich in nectar, while a business district may offer almost nothing.' },
      { speaker: 'Lecturer', text: 'This matters because wild bees — and there are around two hundred and fifty species of wild bee in a typical European city — often forage much closer to home. Some solitary species travel less than five hundred metres. If a dense cluster of honeybee hives is placed beside a meadow, the wild bees can be outcompeted for the same limited flowers.' },
      { speaker: 'Lecturer', text: 'Researchers in London compared flower visits in twelve parks. Where hives had been introduced in large numbers, the diversity of wild bee species fell by almost a third within four years, while the total number of flower visits stayed about the same. In other words, the honeybees replaced the wild bees rather than adding to pollination.' },
      { speaker: 'Lecturer', text: 'So what should cities do? The most effective measure is not to limit hives but to increase habitat. A study in Berlin found that simply allowing grass verges to grow longer increased wild bee diversity by forty per cent in two years, at a fraction of the cost of installing hives.' },
      { speaker: 'Lecturer', text: 'The second measure is to plan hive density. Some cities, including Amsterdam, now require a permit for new hives above a certain density, and they map existing colonies before granting permission.' },
      { speaker: 'Lecturer', text: 'The third measure concerns public education. Many people install a hive because they want to help nature, and it feels like a positive action. We should not discourage that enthusiasm. But we should redirect it towards planting, and towards leaving parts of gardens untidy, because dead wood and long grass are exactly where wild bees nest.' },
      { speaker: 'Lecturer', text: 'Next week we will look at the urban heat island effect, and the week after that we will discuss green roofs. For now, let me just note that the distinction between doing something visible and doing something useful runs through the whole of urban ecology.' },
    ],
    questionGroups: [
      {
        id: 'l4-g1',
        heading: 'Questions 31–35',
        instruction:
          'Complete the notes below. Write ONE WORD ONLY for each answer.',
        layout: 'notes',
        questions: [
          { number: 31, prompt: 'Paris records show hives on the roof of the ______ in the nineteenth century.', type: 'text', answer: 'opera|opera house', explanation: '"hives on the roof of the opera house".' },
          { number: 32, prompt: 'The honeybee is a managed species, not an ______ one.', type: 'text', answer: 'endangered', explanation: '"managed species, not an endangered one".' },
          { number: 33, prompt: 'One honeybee colony may forage over about three square ______.', type: 'text', answer: 'kilometres|kilometers|km', explanation: '"an area of roughly three square kilometres".' },
          { number: 34, prompt: 'There are around 250 species of ______ bee in a typical European city.', type: 'text', answer: 'wild', explanation: '"two hundred and fifty species of wild bee".' },
          { number: 35, prompt: 'Some solitary species travel less than 500 ______.', type: 'text', answer: 'metres|meters|m', explanation: '"travel less than five hundred metres".' },
        ],
      },
      {
        id: 'l4-g2',
        heading: 'Questions 36–40',
        instruction: 'Choose the correct letter, A, B or C.',
        layout: 'list',
        questions: [
          {
            number: 36,
            prompt: 'In the London parks study, where many hives were introduced,',
            type: 'mcq',
            options: [
              'the total number of flower visits fell.',
              'the diversity of wild bees fell by almost a third.',
              'the honeybee population collapsed.',
            ],
            answer: 'B',
            explanation: '"the diversity of wild bee species fell by almost a third within four years".',
          },
          {
            number: 37,
            prompt: 'The lecturer says the most effective measure for cities is to',
            type: 'mcq',
            options: [
              'limit the number of hives.',
              'increase habitat for pollinators.',
              'ban beekeeping in city centres.',
            ],
            answer: 'B',
            explanation: '"The most effective measure is not to limit hives but to increase habitat."',
          },
          {
            number: 38,
            prompt: 'In Berlin, allowing grass verges to grow longer increased wild bee diversity by',
            type: 'mcq',
            options: ['fourteen per cent.', 'forty per cent.', 'half.'],
            answer: 'B',
            explanation: '"increased wild bee diversity by forty per cent in two years".',
          },
          {
            number: 39,
            prompt: 'Amsterdam now requires permits for new hives when',
            type: 'mcq',
            options: [
              'the city centre reaches a certain density.',
              'the hive is placed in a public park.',
              'the beekeeper is a beginner.',
            ],
            answer: 'A',
            explanation: '"require a permit for new hives above a certain density".',
          },
          {
            number: 40,
            prompt: 'Wild bees often nest in',
            type: 'mcq',
            options: ['tall grass and dead wood.', 'roof spaces.', 'tree bark only.'],
            answer: 'A',
            explanation: '"dead wood and long grass are exactly where wild bees nest".',
          },
        ],
      },
    ],
  },
];

export const LISTENING_QUESTIONS = LISTENING_PARTS.flatMap((part) =>
  part.questionGroups.flatMap((group) => group.questions),
);
