// src/lib/audioManifest.ts
var AUDIO_MANIFEST = {
  // (no audio files yet)
};
function audioFor(key) {
  return AUDIO_MANIFEST[key];
}
function hasRealAudio(key) {
  return Boolean(AUDIO_MANIFEST[key]?.src);
}
var audioKeys = {
  ielts: (partId) => `ielts-${partId}`,
  multilevel: (partId) => `ml-${partId}`
};

// src/content/multilevel/listening.ts
var ML_LISTENING_PARTS = [
  {
    id: 1,
    partNumber: 1,
    difficulty: "A1",
    title: "Part 1 \u2014 Short conversations",
    instruction: "Listen and choose the correct answer, A, B or C.",
    context: "Three very short conversations about everyday things.",
    preReadSeconds: 20,
    script: [
      { speaker: "Woman", text: "Good morning. Can I help you?" },
      { speaker: "Man", text: "Yes, please. I would like a cup of tea and a sandwich." },
      { speaker: "Woman", text: "Would you like chicken or cheese in the sandwich?" },
      { speaker: "Man", text: "Cheese, please. And how much is it?" },
      { speaker: "Woman", text: "That is four pounds fifty." }
    ],
    questions: [
      {
        number: 1,
        difficulty: "A1",
        prompt: "What does the man want to eat?",
        type: "mcq",
        options: ["a chicken sandwich", "a cheese sandwich", "a cake"],
        answer: "B",
        explanation: 'He says "Cheese, please" when asked which filling he wants.'
      },
      {
        number: 2,
        difficulty: "A1",
        prompt: "How much does he pay?",
        type: "mcq",
        options: ["\xA34.50", "\xA35.40", "\xA34.15"],
        answer: "A",
        explanation: '"That is four pounds fifty."'
      },
      {
        number: 3,
        difficulty: "A1",
        prompt: "Where are they?",
        type: "mcq",
        options: ["in a caf\xE9", "in a library", "at a train station"],
        answer: "A",
        explanation: "They are ordering tea and a sandwich, so they are in a caf\xE9."
      }
    ]
  },
  {
    id: 2,
    partNumber: 2,
    difficulty: "A2",
    title: "Part 2 \u2014 A phone call",
    instruction: "Listen and write ONE WORD AND/OR A NUMBER for each answer.",
    context: "A woman phones a sports centre to join a swimming class.",
    preReadSeconds: 25,
    script: [
      { speaker: "Receptionist", text: "Hello, Riverside Sports Centre." },
      { speaker: "Woman", text: "Hello. I would like to join a swimming class, please." },
      { speaker: "Receptionist", text: "Of course. We have classes on Tuesdays and Thursdays." },
      { speaker: "Woman", text: "Tuesday is good for me. What time does it start?" },
      { speaker: "Receptionist", text: "The Tuesday class begins at six in the evening." },
      { speaker: "Woman", text: "And how much is it for one month?" },
      { speaker: "Receptionist", text: "It is thirty-two pounds for a month." },
      { speaker: "Woman", text: "OK. Can I pay by card?" },
      { speaker: "Receptionist", text: "Yes, but please bring a towel. The pool is on the second floor." },
      { speaker: "Woman", text: "Thank you. My name is Anna Petrov." },
      { speaker: "Receptionist", text: "Could you spell your surname for me?" },
      { speaker: "Woman", text: "Yes, P-E-T-R-O-V." }
    ],
    questions: [
      {
        number: 4,
        difficulty: "A2",
        prompt: "The class is on Tuesdays at ______ in the evening.",
        type: "text",
        answer: "6|six|18:00|6pm",
        explanation: '"The Tuesday class begins at six in the evening."'
      },
      {
        number: 5,
        difficulty: "A2",
        prompt: "The class costs \xA3______ for one month.",
        type: "text",
        answer: "32|thirty-two|thirty two",
        explanation: '"It is thirty-two pounds for a month."'
      },
      {
        number: 6,
        difficulty: "A2",
        prompt: "The pool is on the ______ floor.",
        type: "text",
        answer: "second|2nd|2",
        explanation: '"The pool is on the second floor."'
      },
      {
        number: 7,
        difficulty: "A2",
        prompt: "Surname: ______",
        type: "text",
        answer: "Petrov",
        explanation: "She spells it P-E-T-R-O-V."
      },
      {
        number: 8,
        difficulty: "A2",
        prompt: "She must bring a ______.",
        type: "text",
        answer: "towel",
        explanation: '"please bring a towel".'
      }
    ]
  },
  {
    id: 3,
    partNumber: 3,
    difficulty: "B1",
    title: "Part 3 \u2014 A conversation about a trip",
    instruction: "Listen and choose the correct answer, A, B or C.",
    context: "Two friends discuss a weekend trip they are planning.",
    preReadSeconds: 25,
    script: [
      { speaker: "Tom", text: "So, have you decided where we should go for the weekend?" },
      { speaker: "Sara", text: "I was thinking about the mountains, but the forecast says it will rain." },
      { speaker: "Tom", text: "Then maybe we should go to the coast instead. My cousin says the beach there is beautiful." },
      { speaker: "Sara", text: "The problem is the train. It takes almost four hours." },
      { speaker: "Tom", text: "True, but we could leave on Friday evening and stay two nights." },
      { speaker: "Sara", text: "How much would the hotel be?" },
      { speaker: "Tom", text: "About sixty pounds a night, but if we share a room it is only thirty each." },
      { speaker: "Sara", text: "That sounds reasonable. Shall I book it today?" },
      { speaker: "Tom", text: "Yes, but let us check the reviews first. Last time the photos looked much better than the room." },
      { speaker: "Sara", text: "Good point. I will send you the link this evening." }
    ],
    questions: [
      {
        number: 9,
        difficulty: "B1",
        prompt: "Why does Sara not want to go to the mountains?",
        type: "mcq",
        options: ["It is too far.", "The weather will be bad.", "She has been there before."],
        answer: "B",
        explanation: '"the forecast says it will rain".'
      },
      {
        number: 10,
        difficulty: "B1",
        prompt: "What is Tom's concern about the coast?",
        type: "mcq",
        options: ["The journey is long.", "The beach is crowded.", "There are no hotels."],
        answer: "A",
        explanation: "Sara says the train takes almost four hours and Tom accepts the point."
      },
      {
        number: 11,
        difficulty: "B1",
        prompt: "How much will each person pay for the hotel per night?",
        type: "mcq",
        options: ["\xA330", "\xA360", "\xA390"],
        answer: "A",
        explanation: '"if we share a room it is only thirty each".'
      },
      {
        number: 12,
        difficulty: "B1",
        prompt: "What does Tom want to do before booking?",
        type: "mcq",
        options: ["ask his cousin", "check the reviews", "look at the photos"],
        answer: "B",
        explanation: '"let us check the reviews first".'
      },
      {
        number: 13,
        difficulty: "B1",
        prompt: "What did Tom dislike about the last hotel?",
        type: "mcq",
        options: ["the price", "the location", "the room itself"],
        answer: "C",
        explanation: '"the photos looked much better than the room".'
      },
      {
        number: 14,
        difficulty: "B1",
        prompt: "Who will book the hotel?",
        type: "mcq",
        options: ["Sara", "Tom", "Tom's cousin"],
        answer: "A",
        explanation: 'Sara asks "Shall I book it today?" and Tom agrees.'
      }
    ]
  },
  {
    id: 4,
    partNumber: 4,
    difficulty: "B2",
    title: "Part 4 \u2014 A talk about city parks",
    instruction: "Listen and write NO MORE THAN TWO WORDS for each answer.",
    context: "A speaker from the city council talks about a new park project.",
    preReadSeconds: 30,
    script: [
      { speaker: "Speaker", text: "Thank you for coming this evening. I want to tell you about the Northfield Park project." },
      { speaker: "Speaker", text: "The land was used for industry for over a hundred years, and for the last decade it has been empty. The council bought it in 2019 for eleven million pounds." },
      { speaker: "Speaker", text: "Work will begin in March and should finish within eighteen months, which is faster than we originally planned." },
      { speaker: "Speaker", text: "The most important feature will be a wetland area in the south-east corner. This will collect rainwater and reduce flooding in the streets nearby." },
      { speaker: "Speaker", text: "We will also plant more than four thousand trees. Local schools will help, and each class will look after its own small plot." },
      { speaker: "Speaker", text: "Some residents have asked about parking. There will be no cars inside the park, but there will be a bicycle hire point at each entrance, and the tram stop will move closer." },
      { speaker: "Speaker", text: "Finally, the playground. We had planned to build it near the main road, but after consultation we have moved it to the centre, so that children are further from the traffic." }
    ],
    questions: [
      {
        number: 15,
        difficulty: "B2",
        prompt: "The council bought the land in ______.",
        type: "text",
        answer: "2019",
        explanation: '"The council bought it in 2019".'
      },
      {
        number: 16,
        difficulty: "B2",
        prompt: "The land cost \xA311 ______.",
        type: "text",
        answer: "million",
        explanation: '"for eleven million pounds".'
      },
      {
        number: 17,
        difficulty: "B2",
        prompt: "Work will finish within ______ months.",
        type: "text",
        answer: "18|eighteen",
        explanation: '"should finish within eighteen months".'
      },
      {
        number: 18,
        difficulty: "B2",
        prompt: "A ______ area will collect rainwater.",
        type: "text",
        answer: "wetland",
        explanation: '"The most important feature will be a wetland area".'
      },
      {
        number: 19,
        difficulty: "B2",
        prompt: "More than four ______ trees will be planted.",
        type: "text",
        answer: "thousand",
        explanation: '"We will also plant more than four thousand trees."'
      },
      {
        number: 20,
        difficulty: "B2",
        prompt: "Local ______ will look after small plots.",
        type: "text",
        answer: "schools",
        explanation: '"Local schools will help, and each class will look after its own small plot."'
      },
      {
        number: 21,
        difficulty: "B2",
        prompt: "The playground has been moved to the ______.",
        type: "text",
        answer: "centre|center",
        explanation: '"we have moved it to the centre".'
      }
    ]
  },
  {
    id: 5,
    partNumber: 5,
    difficulty: "B2",
    title: "Part 5 \u2014 A tutorial discussion",
    instruction: "Listen and choose the correct answer, A, B or C.",
    context: "A student and a tutor discuss the student's research project.",
    preReadSeconds: 30,
    script: [
      { speaker: "Tutor", text: "So, you have decided to look at how students use social media while studying. How is it going?" },
      { speaker: "Student", text: "The reading is fine, but I am not sure about my method. I wanted to interview people, but I only have three weeks." },
      { speaker: "Tutor", text: "Then a questionnaire would be more realistic. You could reach a hundred students in a week if you use the university email list." },
      { speaker: "Student", text: "I did think about that, but people do not always answer honestly on questionnaires." },
      { speaker: "Tutor", text: "That is a fair criticism, and you should say so in your report. It is better to acknowledge a limitation than to pretend it does not exist." },
      { speaker: "Student", text: "Should I ask about the number of hours they study as well?" },
      { speaker: "Tutor", text: "Definitely. Without that, you cannot tell whether social media is the cause of any difference, or whether heavy social media users simply study less." },
      { speaker: "Student", text: "And how should I present the results?" },
      { speaker: "Tutor", text: "A simple bar chart is clearest for a comparison of groups. Save the detailed statistics for an appendix." }
    ],
    questions: [
      {
        number: 22,
        difficulty: "B2",
        prompt: "Why does the student hesitate to use interviews?",
        type: "mcq",
        options: ["They are expensive.", "There is not enough time.", "The tutor dislikes them."],
        answer: "B",
        explanation: '"I only have three weeks".'
      },
      {
        number: 23,
        difficulty: "B2",
        prompt: "What does the tutor suggest?",
        type: "mcq",
        options: ["using a questionnaire", "changing the topic", "interviewing fewer people"],
        answer: "A",
        explanation: '"Then a questionnaire would be more realistic."'
      },
      {
        number: 24,
        difficulty: "B2",
        prompt: "What does the tutor say about the student's criticism?",
        type: "mcq",
        options: [
          "It is not relevant.",
          "It should be acknowledged in the report.",
          "It means questionnaires cannot be used."
        ],
        answer: "B",
        explanation: '"It is better to acknowledge a limitation".'
      },
      {
        number: 25,
        difficulty: "B2",
        prompt: "Why does the tutor want to know the study hours?",
        type: "mcq",
        options: [
          "to compare students' grades",
          "to establish whether social media is the cause",
          "to calculate a total"
        ],
        answer: "B",
        explanation: '"you cannot tell whether social media is the cause".'
      },
      {
        number: 26,
        difficulty: "B2",
        prompt: "How should the results be presented?",
        type: "mcq",
        options: ["a bar chart", "a long table", "detailed statistics in the main text"],
        answer: "A",
        explanation: '"A simple bar chart is clearest".'
      }
    ]
  },
  {
    id: 6,
    partNumber: 6,
    difficulty: "C1",
    title: "Part 6 \u2014 A lecture on noise",
    instruction: "Listen and choose the correct answer, A, B or C.",
    context: "A lecture from a module on environmental psychology.",
    preReadSeconds: 30,
    script: [
      { speaker: "Lecturer", text: "Today I want to examine something so familiar that we rarely notice it, and yet which shapes behaviour in ways that are surprisingly measurable: noise." },
      { speaker: "Lecturer", text: "The standard assumption, repeated in most occupational guidelines, is that noise matters chiefly when it exceeds a certain volume. That is true as far as hearing damage is concerned. But for cognitive performance, the evidence suggests something rather different." },
      { speaker: "Lecturer", text: "What appears to matter most is not loudness but predictability. A steady background hum of sixty decibels is far less disruptive than irregular noise of fifty: intermittent sounds demand attention as the brain keeps predicting when the next one will arrive." },
      { speaker: "Lecturer", text: "A well-known study of open-plan offices in Denmark tracked nearly two thousand workers over three years. Reported concentration did not correlate with measured noise levels at all. It correlated with the number of distinct speech fragments employees could hear, regardless of volume." },
      { speaker: "Lecturer", text: "This has an uncomfortable implication. Many modern offices and libraries were designed to lower volume, for example with carpets and acoustic panels, while keeping the space open. Those measures shorten reverb time, but they do not reduce intelligibility, which is precisely what is intrusive." },
      { speaker: "Lecturer", text: "There is a further asymmetry worth noting. Once we habituate to a steady background, we stop noticing it, and it ceases to cost us attention. Irregular noise cannot be habituated to, because habituation depends on predicting the stimulus." },
      { speaker: "Lecturer", text: "What, then, should we conclude for practice? If you can choose only one intervention in a shared space, reduce the number of discernible voices rather than the average decibel level. Next week we will ask whether the same principle applies to visual distraction." }
    ],
    questions: [
      {
        number: 27,
        difficulty: "C1",
        prompt: "The lecturer's main claim is that noise affects performance according to its",
        type: "mcq",
        options: ["average volume.", "predictability.", "duration."],
        answer: "B",
        explanation: '"What appears to matter most is not loudness but predictability."'
      },
      {
        number: 28,
        difficulty: "C1",
        prompt: "According to the lecturer, volume guidelines are",
        type: "mcq",
        options: [
          "entirely wrong.",
          "valid for hearing damage but not for cognitive performance.",
          "the only reliable measure available."
        ],
        answer: "B",
        explanation: '"That is true as far as hearing damage is concerned. But for cognitive performance..."'
      },
      {
        number: 29,
        difficulty: "C1",
        prompt: "Why is irregular noise more disruptive?",
        type: "mcq",
        options: [
          "It is always louder.",
          "The brain cannot predict it and keeps attending to it.",
          "It lasts longer than steady noise."
        ],
        answer: "B",
        explanation: '"intermittent sounds demand attention as the brain keeps predicting".'
      },
      {
        number: 30,
        difficulty: "C1",
        prompt: "The Danish study found that reported concentration correlated with",
        type: "mcq",
        options: [
          "measured noise levels.",
          "the number of distinct speech fragments heard.",
          "the size of the office."
        ],
        answer: "B",
        explanation: '"It correlated with the number of distinct speech fragments".'
      },
      {
        number: 31,
        difficulty: "C1",
        prompt: 'What is the "uncomfortable implication" for office design?',
        type: "mcq",
        options: [
          "Acoustic panels are a waste of money in every case.",
          "Measures that lower volume but keep speech intelligible may not help.",
          "Open-plan offices should be banned."
        ],
        answer: "B",
        explanation: 'They "shorten reverb time, but they do not reduce intelligibility, which is precisely what is intrusive."'
      },
      {
        number: 32,
        difficulty: "C1",
        prompt: "Why can irregular noise not be habituated to?",
        type: "mcq",
        options: [
          "Because habituation depends on predicting the stimulus.",
          "Because it is too quiet to notice.",
          "Because people dislike it."
        ],
        answer: "A",
        explanation: '"habituation depends on predicting the stimulus".'
      },
      {
        number: 33,
        difficulty: "C1",
        prompt: "The lecturer recommends, for a shared space, reducing",
        type: "mcq",
        options: ["the average volume.", "the number of discernible voices.", "the number of people."],
        answer: "B",
        explanation: '"reduce the number of discernible voices rather than the average decibel level".'
      },
      {
        number: 34,
        difficulty: "C1",
        prompt: "The Danish study is described as tracking nearly",
        type: "mcq",
        options: ["two hundred workers.", "two thousand workers.", "twenty thousand workers."],
        answer: "B",
        explanation: '"nearly two thousand workers over three years".'
      },
      {
        number: 35,
        difficulty: "C1",
        prompt: "The lecturer says the topic of noise is",
        type: "mcq",
        options: [
          "rarely examined in psychology.",
          "so familiar that it is rarely noticed.",
          "only relevant to musicians."
        ],
        answer: "B",
        explanation: '"something so familiar that we rarely notice it".'
      }
    ]
  }
];
var ML_LISTENING_QUESTIONS = ML_LISTENING_PARTS.flatMap((p) => p.questions);

// src/content/listening.ts
var LISTENING_PARTS = [
  /* ---------------------------------------------------------------- */
  /* PART 1 — Everyday social conversation                             */
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    title: "Part 1 \u2014 Sports Centre Membership",
    context: "A conversation between a man and a receptionist at a community sports centre.",
    script: [
      { speaker: "Receptionist", text: "Good morning, Harbourside Community Sports Centre. How can I help you?" },
      { speaker: "Man", text: "Hello. I moved into the area last month and I would like to join the centre. Could you tell me about the membership options?" },
      { speaker: "Receptionist", text: "Of course. We have three types. The full membership covers the gym, the pool and all the classes, and that costs forty-two pounds a month." },
      { speaker: "Man", text: "And is there anything cheaper? I mainly want to swim." },
      { speaker: "Receptionist", text: "Then the swim-only membership would suit you. That is twenty-six pounds a month, but it does not include the gym." },
      { speaker: "Man", text: "I see. And is there a joining fee?" },
      { speaker: "Receptionist", text: "There is normally a fifteen pound joining fee, but we are running a promotion until the end of the month, so at the moment it is waived entirely." },
      { speaker: "Man", text: "That sounds good. What about the pool timetable?" },
      { speaker: "Receptionist", text: "The pool opens at six thirty in the morning and closes at nine thirty at night on weekdays. At weekends we close earlier, at seven in the evening." },
      { speaker: "Man", text: "And is there a quiet time? I do not like swimming when it is crowded." },
      { speaker: "Receptionist", text: "The quietest sessions are between ten and twelve in the morning \u2014 that is when the school groups have left and the lunchtime crowd has not arrived yet." },
      { speaker: "Man", text: "Great. Do I need to bring anything when I come to sign up?" },
      { speaker: "Receptionist", text: "Just some proof of address, such as a utility bill, and a form of photo identification. The name on our system should be spelled exactly as it appears on your ID." },
      { speaker: "Man", text: "Sorry, it is spelled A-L-L-E-N-S-O-N. No double L." },
      { speaker: "Receptionist", text: "Let me check the spelling. So that is Allenson with one L. Perfect. And could I take a telephone number in case a class is cancelled?" },
      { speaker: "Man", text: "Yes, it is oh seven seven double nine, two four six, eight one three. I am usually available after five." },
      { speaker: "Receptionist", text: "Thank you. One more thing \u2014 members get a discount at the cafe in the main building. It is ten per cent off all hot drinks." },
      { speaker: "Man", text: "That is a nice bonus. The cafe is in the main building, did you say?" },
      { speaker: "Receptionist", text: "That is right, on the ground floor next to the reception desk. And if you come on a Saturday there is free parking in the car park behind the building." },
      { speaker: "Man", text: "About the studio classes \u2014 is there anything for beginners?" },
      { speaker: "Receptionist", text: "The beginners yoga class runs on Tuesday evenings at seven, and the instructor is called Marta. Most people find her very patient." },
      { speaker: "Man", text: "Tuesday is difficult for me because I work late. Is there anything on Thursday?" },
      { speaker: "Receptionist", text: "On Thursday there is a beginners pilates class at six thirty. That is probably the most popular class we run for new members." },
      { speaker: "Man", text: "That sounds ideal. I will come in tomorrow and sign up. Thank you very much." },
      { speaker: "Receptionist", text: "You are welcome. We look forward to seeing you." }
    ],
    questionGroups: [
      {
        id: "l1-g1",
        heading: "Questions 1\u20136",
        instruction: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
        layout: "notes",
        questions: [
          { number: 1, prompt: "Full membership costs \xA3______ per month.", type: "text", answer: "42|forty-two|forty two", explanation: '"forty-two pounds a month".' },
          { number: 2, prompt: "Swim-only membership costs \xA3______ per month.", type: "text", answer: "26|twenty-six|twenty six", explanation: '"twenty-six pounds a month".' },
          { number: 3, prompt: "The joining fee has been ______ during the current promotion.", type: "text", answer: "waived|removed|cancelled|canceled", explanation: 'The receptionist says the fee "is waived entirely".' },
          { number: 4, prompt: "The pool closes at ______ pm at weekends.", type: "text", answer: "7|seven|19:00|7pm", explanation: '"At weekends we close earlier, at seven in the evening."' },
          { number: 5, prompt: "The quietest sessions are from 10 am to ______ am.", type: "text", answer: "12|twelve|noon", explanation: '"between ten and twelve in the morning".' },
          { number: 6, prompt: "Surname: ______", type: "text", answer: "Allenson", explanation: "The caller spells it A-L-L-E-N-S-O-N." }
        ]
      },
      {
        id: "l1-g2",
        heading: "Questions 7\u201310",
        instruction: "Choose the correct letter, A, B or C.",
        layout: "list",
        questions: [
          {
            number: 7,
            prompt: "What proof must new members bring?",
            type: "mcq",
            options: [
              "a passport and a photograph",
              "a utility bill and photo identification",
              "a bank statement and a letter from an employer"
            ],
            answer: "B",
            explanation: '"Just some proof of address, such as a utility bill, and a form of photo identification."'
          },
          {
            number: 8,
            prompt: "What discount do members receive in the cafe?",
            type: "mcq",
            options: ["ten per cent off hot drinks", "fifteen per cent off all food", "a free drink with every meal"],
            answer: "A",
            explanation: '"It is ten per cent off all hot drinks."'
          },
          {
            number: 9,
            prompt: "The beginners yoga class is on",
            type: "mcq",
            options: ["Tuesday evening.", "Thursday evening.", "Saturday morning."],
            answer: "A",
            explanation: "The yoga class runs Tuesday evenings at seven; Thursday is pilates."
          },
          {
            number: 10,
            prompt: "Which class will the man probably join?",
            type: "mcq",
            options: ["beginners yoga", "beginners pilates", "the swimming club"],
            answer: "B",
            explanation: "He cannot attend Tuesday, so he chooses the Thursday pilates class."
          }
        ]
      }
    ]
  },
  /* ---------------------------------------------------------------- */
  /* PART 2 — Monologue                                                */
  /* ---------------------------------------------------------------- */
  {
    id: 2,
    title: "Part 2 \u2014 Greenfield Wildlife Park",
    context: "A guide gives new volunteers an introduction to the wildlife park.",
    script: [
      { speaker: "Guide", text: "Welcome, everyone, to Greenfield Wildlife Park. My name is Rachel and I coordinate the volunteer programme." },
      { speaker: "Guide", text: "Greenfield was opened in 1987 on the site of a former dairy farm. For the first decade it housed only British species, but we now care for animals from six continents." },
      { speaker: "Guide", text: "The park is divided into four zones. The first zone, closest to the entrance, is the wetland area, where you will find our otters and a large colony of herons." },
      { speaker: "Guide", text: "Beyond that is the woodland zone. This is the largest area, covering nearly sixty per cent of the park, and it is home to deer, foxes and several species of owl." },
      { speaker: "Guide", text: "The third zone is the savannah, which opened in 2004 and houses our zebras and giraffes. The fourth and smallest zone is the discovery centre, where we run school workshops." },
      { speaker: "Guide", text: "Now, about your volunteering. Most of you will start in the animal care team, which begins at eight in the morning. The work involves preparing food, cleaning enclosures and recording what each animal eats." },
      { speaker: "Guide", text: "Everyone must complete a two-day training course before you begin. The next course runs on the fourteenth of March. It is free, and lunch is provided, but you need to bring your own boots." },
      { speaker: "Guide", text: "You will be given a green T-shirt and a name badge. Please wear the T-shirt whenever you are on site, because visitors often ask volunteers for directions." },
      { speaker: "Guide", text: "There are a few rules. Do not feed any animal unless a keeper has given you permission. Do not enter an enclosure alone, ever. And please wash your hands at the station beside every gate before you leave a zone." },
      { speaker: "Guide", text: "One last point: the park receives around three hundred thousand visitors a year, and most of them arrive between eleven and two. If you need to move equipment across the site, do it before ten in the morning, when the paths are still quiet." },
      { speaker: "Guide", text: "Any questions so far? No? Then let us walk down to the wetland zone and meet the otters." }
    ],
    questionGroups: [
      {
        id: "l2-g1",
        heading: "Questions 11\u201315",
        instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        layout: "notes",
        questions: [
          { number: 11, prompt: "Greenfield Wildlife Park opened in the year ______.", type: "text", answer: "1987", explanation: '"Greenfield was opened in 1987".' },
          { number: 12, prompt: "The park was built on the site of a former ______.", type: "text", answer: "dairy farm", explanation: '"on the site of a former dairy farm".' },
          { number: 13, prompt: "The wetland zone contains otters and a large colony of ______.", type: "text", answer: "herons", explanation: '"a large colony of herons".' },
          { number: 14, prompt: "The woodland zone covers nearly ______ per cent of the park.", type: "text", answer: "60|sixty", explanation: '"covering nearly sixty per cent of the park".' },
          { number: 15, prompt: "The savannah zone opened in ______.", type: "text", answer: "2004", explanation: '"the savannah, which opened in 2004".' }
        ]
      },
      {
        id: "l2-g2",
        heading: "Questions 16\u201320",
        instruction: "Choose the correct letter, A, B or C.",
        layout: "list",
        questions: [
          {
            number: 16,
            prompt: "Volunteers in the animal care team start work at",
            type: "mcq",
            options: ["7 am.", "8 am.", "9 am."],
            answer: "B",
            explanation: '"the animal care team, which begins at eight in the morning".'
          },
          {
            number: 17,
            prompt: "What must volunteers bring to the training course?",
            type: "mcq",
            options: ["their own lunch", "a name badge", "their own boots"],
            answer: "C",
            explanation: '"lunch is provided, but you need to bring your own boots".'
          },
          {
            number: 18,
            prompt: "Volunteers must wear the green T-shirt because",
            type: "mcq",
            options: [
              "it identifies them to visitors.",
              "it protects their clothes.",
              "it is required by law."
            ],
            answer: "A",
            explanation: '"because visitors often ask volunteers for directions".'
          },
          {
            number: 19,
            prompt: "Volunteers should move equipment across the site",
            type: "mcq",
            options: ["before 10 am.", "between 11 am and 2 pm.", "after 4 pm."],
            answer: "A",
            explanation: '"do it before ten in the morning, when the paths are still quiet".'
          },
          {
            number: 20,
            prompt: "The park receives about ______ visitors each year.",
            type: "mcq",
            options: ["thirty thousand", "three hundred thousand", "three million"],
            answer: "B",
            explanation: '"around three hundred thousand visitors a year".'
          }
        ]
      }
    ]
  },
  /* ---------------------------------------------------------------- */
  /* PART 3 — Academic discussion                                      */
  /* ---------------------------------------------------------------- */
  {
    id: 3,
    title: "Part 3 \u2014 Research Project Discussion",
    context: "Two students, Daniel and Priya, discuss their psychology project with their tutor.",
    script: [
      { speaker: "Tutor", text: "So, Daniel and Priya, you have chosen to look at how sleep affects memory in teenagers. Tell me how the project is going." },
      { speaker: "Daniel", text: "We have done the background reading, but we are struggling with the method, because the studies we found used very different designs." },
      { speaker: "Tutor", text: "That is a common problem. What sort of participants can you realistically get?" },
      { speaker: "Priya", text: "We can use our own school, so about forty students aged sixteen to eighteen. They would all be studying for the same exams, which helps because their stress levels should be similar." },
      { speaker: "Tutor", text: "Good. That is a strong point in favour of your choice. What will you actually measure?" },
      { speaker: "Daniel", text: "We thought we would give them a list of words to memorise in the evening, then test them the next morning. We would compare people who slept eight hours with people who slept only five." },
      { speaker: "Tutor", text: "And how will you know that they really slept eight hours? Students are not always honest about bedtimes." },
      { speaker: "Priya", text: "That was our worry too. Our first idea was a questionnaire, but people forget what time they went to bed. Then we considered wrist sensors, but they are far too expensive. In the end we decided to use a simple app on their phones that records when the phone is inactive." },
      { speaker: "Tutor", text: "That is a sensible compromise. One weakness is that a phone left on a desk will look inactive even if the student is awake, so you should mention that limitation clearly in your report." },
      { speaker: "Daniel", text: "We will. We also wondered whether we should test them twice, to reduce the effect of luck." },
      { speaker: "Tutor", text: "I would definitely recommend that. Use two different word lists and swap the order between groups, so the second test does not simply measure practice." },
      { speaker: "Priya", text: "What about ethics? We will need parental consent, because most of our participants are under eighteen." },
      { speaker: "Tutor", text: "Yes, and you should also make sure that nobody feels pressured to stay up late for the experiment. The five-hour group is fine as long as they choose that condition themselves." },
      { speaker: "Daniel", text: "Should we analyse the results with a simple average, or something more advanced?" },
      { speaker: "Tutor", text: "Given your sample size, a comparison of means with a significance test will be enough. Do not overcomplicate it. What you must do is present the raw data clearly in a table or graph." },
      { speaker: "Priya", text: "We were going to put the raw data in an appendix and only show the averages in the main report." },
      { speaker: "Tutor", text: "That is exactly right. Your main report should stay readable, and examiners like to see that you can separate evidence from interpretation." },
      { speaker: "Daniel", text: "One more thing. Our deadline is the twenty-second of April, but the school holidays start on the eighth. Will we have enough time to collect the data?" },
      { speaker: "Tutor", text: "You will need to run the experiment before the holidays. I suggest you begin in the first week of March so that you have two full weeks for analysis afterwards." },
      { speaker: "Priya", text: "That works for us. Thank you." }
    ],
    questionGroups: [
      {
        id: "l3-g1",
        heading: "Questions 21\u201325",
        instruction: "Choose the correct letter, A, B or C.",
        layout: "list",
        questions: [
          {
            number: 21,
            prompt: "What problem are the students having with the method?",
            type: "mcq",
            options: [
              "They cannot find enough background reading.",
              "The studies they read used very different designs.",
              "Their tutor disagrees with their topic."
            ],
            answer: "B",
            explanation: '"the studies we found used very different designs".'
          },
          {
            number: 22,
            prompt: "Why is using students from their own school an advantage?",
            type: "mcq",
            options: [
              "The school has already agreed to help.",
              "The participants are all the same age.",
              "Their stress levels should be similar during exams."
            ],
            answer: "C",
            explanation: '"their stress levels should be similar".'
          },
          {
            number: 23,
            prompt: "Why did the students reject wrist sensors?",
            type: "mcq",
            options: ["They are too expensive.", "They are unreliable.", "They are uncomfortable."],
            answer: "A",
            explanation: '"they are far too expensive".'
          },
          {
            number: 24,
            prompt: "What is the weakness of using a phone app?",
            type: "mcq",
            options: [
              "It measures practice rather than memory.",
              "A phone left on a desk looks inactive when the student is awake.",
              "Students may refuse to install it."
            ],
            answer: "B",
            explanation: "The tutor points out a phone left on a desk will look inactive."
          },
          {
            number: 25,
            prompt: "Why does the tutor recommend testing the participants twice?",
            type: "mcq",
            options: [
              "To increase the amount of data.",
              "To reduce the effect of luck.",
              "To compare two different age groups."
            ],
            answer: "B",
            explanation: '"we should test them twice, to reduce the effect of luck" \u2014 the tutor agrees.'
          }
        ]
      },
      {
        id: "l3-g2",
        heading: "Questions 26\u201330",
        instruction: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
        layout: "notes",
        questions: [
          { number: 26, prompt: "Students must obtain parental ______ before starting.", type: "text", answer: "consent", explanation: '"We will need parental consent".' },
          { number: 27, prompt: "Participants must choose their sleep condition ______.", type: "text", answer: "themselves", explanation: '"as long as they choose that condition themselves".' },
          { number: 28, prompt: "Results: compare means using a ______ test.", type: "text", answer: "significance", explanation: '"a comparison of means with a significance test".' },
          { number: 29, prompt: "Raw data should appear in an ______.", type: "text", answer: "appendix", explanation: '"put the raw data in an appendix".' },
          { number: 30, prompt: "Deadline for the report: ______ April.", type: "text", answer: "22|twenty-second|twenty second|22nd", explanation: '"deadline is the twenty-second of April".' }
        ]
      }
    ]
  },
  /* ---------------------------------------------------------------- */
  /* PART 4 — Academic lecture                                         */
  /* ---------------------------------------------------------------- */
  {
    id: 4,
    title: "Part 4 \u2014 Urban Beekeeping",
    context: "A lecture from a module on urban ecology.",
    script: [
      { speaker: "Lecturer", text: "Today I want to talk about urban beekeeping, and why a practice that began as a hobby has become a subject of serious scientific debate." },
      { speaker: "Lecturer", text: "Beekeeping in cities is not new. Records from Paris show hives on the roof of the opera house in the middle of the nineteenth century. But the number of urban hives has grown enormously since about 2010, largely because of media coverage of the decline of wild pollinators." },
      { speaker: "Lecturer", text: "The argument usually made is simple: bees are in trouble, so keeping more bees must help. And it is true that honeybees pollinate many crops. However, the honeybee is a managed species, not an endangered one. There are more managed honeybee colonies in Europe today than at any point in the last fifty years." },
      { speaker: "Lecturer", text: "The real concern is competition. A single colony of honeybees can collect food from an area of roughly three square kilometres, and it will visit an enormous range of flowers. In a city, however, the flowers are not evenly distributed. Parks and gardens may be rich in nectar, while a business district may offer almost nothing." },
      { speaker: "Lecturer", text: "This matters because wild bees \u2014 and there are around two hundred and fifty species of wild bee in a typical European city \u2014 often forage much closer to home. Some solitary species travel less than five hundred metres. If a dense cluster of honeybee hives is placed beside a meadow, the wild bees can be outcompeted for the same limited flowers." },
      { speaker: "Lecturer", text: "Researchers in London compared flower visits in twelve parks. Where hives had been introduced in large numbers, the diversity of wild bee species fell by almost a third within four years, while the total number of flower visits stayed about the same. In other words, the honeybees replaced the wild bees rather than adding to pollination." },
      { speaker: "Lecturer", text: "So what should cities do? The most effective measure is not to limit hives but to increase habitat. A study in Berlin found that simply allowing grass verges to grow longer increased wild bee diversity by forty per cent in two years, at a fraction of the cost of installing hives." },
      { speaker: "Lecturer", text: "The second measure is to plan hive density. Some cities, including Amsterdam, now require a permit for new hives above a certain density, and they map existing colonies before granting permission." },
      { speaker: "Lecturer", text: "The third measure concerns public education. Many people install a hive because they want to help nature, and it feels like a positive action. We should not discourage that enthusiasm. But we should redirect it towards planting, and towards leaving parts of gardens untidy, because dead wood and long grass are exactly where wild bees nest." },
      { speaker: "Lecturer", text: "Next week we will look at the urban heat island effect, and the week after that we will discuss green roofs. For now, let me just note that the distinction between doing something visible and doing something useful runs through the whole of urban ecology." }
    ],
    questionGroups: [
      {
        id: "l4-g1",
        heading: "Questions 31\u201335",
        instruction: "Complete the notes below. Write ONE WORD ONLY for each answer.",
        layout: "notes",
        questions: [
          { number: 31, prompt: "Paris records show hives on the roof of the ______ in the nineteenth century.", type: "text", answer: "opera|opera house", explanation: '"hives on the roof of the opera house".' },
          { number: 32, prompt: "The honeybee is a managed species, not an ______ one.", type: "text", answer: "endangered", explanation: '"managed species, not an endangered one".' },
          { number: 33, prompt: "One honeybee colony may forage over about three square ______.", type: "text", answer: "kilometres|kilometers|km", explanation: '"an area of roughly three square kilometres".' },
          { number: 34, prompt: "There are around 250 species of ______ bee in a typical European city.", type: "text", answer: "wild", explanation: '"two hundred and fifty species of wild bee".' },
          { number: 35, prompt: "Some solitary species travel less than 500 ______.", type: "text", answer: "metres|meters|m", explanation: '"travel less than five hundred metres".' }
        ]
      },
      {
        id: "l4-g2",
        heading: "Questions 36\u201340",
        instruction: "Choose the correct letter, A, B or C.",
        layout: "list",
        questions: [
          {
            number: 36,
            prompt: "In the London parks study, where many hives were introduced,",
            type: "mcq",
            options: [
              "the total number of flower visits fell.",
              "the diversity of wild bees fell by almost a third.",
              "the honeybee population collapsed."
            ],
            answer: "B",
            explanation: '"the diversity of wild bee species fell by almost a third within four years".'
          },
          {
            number: 37,
            prompt: "The lecturer says the most effective measure for cities is to",
            type: "mcq",
            options: [
              "limit the number of hives.",
              "increase habitat for pollinators.",
              "ban beekeeping in city centres."
            ],
            answer: "B",
            explanation: '"The most effective measure is not to limit hives but to increase habitat."'
          },
          {
            number: 38,
            prompt: "In Berlin, allowing grass verges to grow longer increased wild bee diversity by",
            type: "mcq",
            options: ["fourteen per cent.", "forty per cent.", "half."],
            answer: "B",
            explanation: '"increased wild bee diversity by forty per cent in two years".'
          },
          {
            number: 39,
            prompt: "Amsterdam now requires permits for new hives when",
            type: "mcq",
            options: [
              "the city centre reaches a certain density.",
              "the hive is placed in a public park.",
              "the beekeeper is a beginner."
            ],
            answer: "A",
            explanation: '"require a permit for new hives above a certain density".'
          },
          {
            number: 40,
            prompt: "Wild bees often nest in",
            type: "mcq",
            options: ["tall grass and dead wood.", "roof spaces.", "tree bark only."],
            answer: "A",
            explanation: '"dead wood and long grass are exactly where wild bees nest".'
          }
        ]
      }
    ]
  }
];
var LISTENING_QUESTIONS = LISTENING_PARTS.flatMap(
  (part) => part.questionGroups.flatMap((group) => group.questions)
);

// .tmp-test/audio.test.ts
var f = 0;
var check = (n, c) => {
  if (!c) {
    f++;
    console.log(`  FAIL ${n}`);
  } else console.log(`  ok ${n}`);
};
console.log("\n== AUDIO MANIFEST ==");
check("manifest is an object", typeof AUDIO_MANIFEST === "object");
check("audioKeys.ielts builds correct key", audioKeys.ielts(3) === "ielts-3");
check("audioKeys.multilevel builds correct key", audioKeys.multilevel(5) === "ml-5");
check("falls back when no real audio registered", !hasRealAudio("ielts-1"));
check("audioFor returns undefined when absent", audioFor("ielts-1") === void 0);
console.log("\n== FALLBACK SAFETY: every part has a script ==");
check("all 4 IELTS parts have scripts", LISTENING_PARTS.every((p) => p.script.length > 3));
check("all 6 Multilevel parts have scripts", ML_LISTENING_PARTS.every((p) => p.script.length > 3));
check(
  "every IELTS part maps to a distinct key",
  new Set(LISTENING_PARTS.map((p) => audioKeys.ielts(p.id))).size === 4
);
check(
  "every Multilevel part maps to a distinct key",
  new Set(ML_LISTENING_PARTS.map((p) => audioKeys.multilevel(p.id))).size === 6
);
console.log(`
${f === 0 ? "ALL AUDIO CHECKS PASSED" : f + " FAILED"}
`);
process.exit(f === 0 ? 0 : 1);
