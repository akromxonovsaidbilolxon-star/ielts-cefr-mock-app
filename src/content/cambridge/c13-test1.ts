import { GRANFORD } from './figures-db';
import type { CambridgeSection, CambridgePassage } from './types';
import { COOKERY_TABLE, TOURISM_TABLE } from './tables';

/* ================================================================== */
/* LISTENING — Cambridge IELTS 13, Test 1                             */
/* ================================================================== */

export const C13_T1_LISTENING: CambridgeSection[] = [
  /* ---------------------------------------------------------------- */
  /* SECTION 1 — Cookery Classes (Questions 1–10)                      */
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    heading: 'Section 1',
    title: 'Cookery Classes',
    intro: 'A conversation between a man and a woman about taking a cookery class.',
    audio: {
      driveId: '1quq4Abd8ALT1qM_tFm6cLXI5yVsOxzOe',
      filename: 'IELTS13-Test 1,Section-1.mp3',
      bytes: 5380592,
    },
    groups: [
      {
        id: 'c13t1-l1-g1',
        heading: 'Questions 1–10',
        instruction: 'Complete the table below.',
        note: 'Write ONE WORD AND/OR A NUMBER for each answer.',
        title: 'COOKERY CLASSES',
        layout: 'table',
        table: COOKERY_TABLE,
        questions: [
          {
            number: 1,
            prompt: 'how to ____ and cook with seasonal products',
            type: 'text',
            answer: 'choose',
            explanation:
              'They "focus on seasonal products, and as well as teaching you how to cook them, they also show you how to choose them".',
          },
          {
            number: 2,
            prompt: 'also offers ____ classes',
            type: 'text',
            answer: 'private',
            explanation: 'The woman asks "could I get a private lesson there?"',
          },
          {
            number: 3,
            prompt: 'clients who return get a ____ discount',
            type: 'text',
            answer: '20|twenty|20%|twenty percent',
            explanation: '"they offer a discount of 20 percent if you return for a further class".',
          },
          {
            number: 4,
            prompt: 'food that is ____',
            type: 'text',
            answer: 'healthy',
            explanation: 'Bond\'s "concentrate on teaching you to prepare healthy food".',
          },
          {
            number: 5,
            prompt: 'includes recipes to strengthen your ____',
            type: 'text',
            answer: 'bones',
            explanation: '"recipes that look at specific needs, like including ingredients that will help build up your bones".',
          },
          {
            number: 6,
            prompt: 'they have a free ____ every Thursday',
            type: 'text',
            answer: 'lecture',
            explanation: '"every Thursday evening they have a lecture at the school. It\'s free".',
          },
          {
            number: 7,
            prompt: 'The ____ Centre',
            type: 'text',
            answer: 'Arretsa|arretsa',
            explanation: '"it\'s called The Arretsa Centre" — a name, so the spelling must match.',
          },
          {
            number: 8,
            prompt: 'mainly ____ food',
            type: 'text',
            answer: 'vegetarian',
            explanation: '"they mostly specialise in vegetarian dishes".',
          },
          {
            number: 9,
            prompt: 'located near the ____',
            type: 'text',
            answer: 'market',
            explanation: '"Is it just by the market?"',
          },
          {
            number: 10,
            prompt: 'a special course in skills with a ____ is sometimes available',
            type: 'text',
            answer: 'knife',
            explanation: '"they also offer a special two-hour course in how to use a knife".',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* SECTION 2 — Traffic Changes in Granford (Questions 11–20)         */
  /* ---------------------------------------------------------------- */
  {
    id: 2,
    heading: 'Section 2',
    title: 'Traffic Changes in Granford',
    intro: 'A talk to local residents about proposed changes to the road system.',
    audio: {
      driveId: '1LG3HGMh-LWrex2URwKbCBusSSs13Z-_r',
      filename: 'IELTS13-Test 1, Section 2.mp3',
      bytes: 4868211,
    },
    groups: [
      {
        id: 'c13t1-l2-g1',
        heading: 'Questions 11–13',
        instruction: 'Choose the correct letter, A, B or C.',
        title: 'Traffic Changes in Granford',
        layout: 'list',
        questions: [
          {
            number: 11,
            prompt: 'Why are changes needed to traffic systems in Granford?',
            type: 'mcq',
            options: [
              'The number of traffic accidents has risen.',
              'The amount of traffic on the roads has increased.',
              'The types of vehicles on the roads have changed.',
            ],
            answer: 'B',
          },
          {
            number: 12,
            prompt: 'In a survey, local residents particularly complained about',
            type: 'mcq',
            options: [
              'dangerous driving by parents.',
              'pollution from trucks and lorries.',
              'inconvenience from parked cars.',
            ],
            answer: 'C',
          },
          {
            number: 13,
            prompt: 'According to the speaker, one problem with the new regulations will be',
            type: 'mcq',
            options: [
              'raising money to pay for them.',
              'finding a way to make people follow them.',
              'getting the support of the police.',
            ],
            answer: 'B',
          },
        ],
      },
      {
        id: 'c13t1-l2-g2',
        heading: 'Questions 14–20',
        instruction: 'Label the map below.',
        note: 'Write the correct letter, A–I, next to Questions 14–20.',
        title: 'Proposed traffic changes in Granford',
        layout: 'compact',
        figure: 'granford',
        figureSpec: GRANFORD,
        box: {
          title: 'Map key',
          items: [
            { letter: 'A', text: 'Station Road / High Street junction' },
            { letter: 'B', text: 'Library, High Street' },
            { letter: 'C', text: 'Bank, north of High Street' },
            { letter: 'D', text: 'Chemist, High Street' },
            { letter: 'E', text: 'High Street / School Road junction' },
            { letter: 'F', text: 'North end of School Road' },
            { letter: 'G', text: 'School Road, by the School' },
            { letter: 'H', text: 'School Road, north of the supermarket' },
            { letter: 'I', text: 'School Road, by the second supermarket' },
          ],
        },
        questions: [
          { number: 14, prompt: 'New traffic lights', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'E' },
          { number: 15, prompt: 'Pedestrian crossing', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'D' },
          { number: 16, prompt: 'Parking allowed', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'B' },
          { number: 17, prompt: "New 'No Parking' sign", type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'G' },
          { number: 18, prompt: 'New disabled parking spaces', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'C' },
          { number: 19, prompt: 'Widened pavement', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'H' },
          { number: 20, prompt: 'Lorry loading/unloading restrictions', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], answer: 'I' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* SECTION 3 — Seed Germination (Questions 21–30)                    */
  /* ---------------------------------------------------------------- */
  {
    id: 3,
    heading: 'Section 3',
    title: 'Seed Germination',
    intro: 'Two students, Jack and Emma, discuss their practical project with their tutor.',
    audio: {
      driveId: '18ltn1iaGZ93P-w7LmsuEcXcXoFRGVZ2X',
      filename: 'IELTS13-Test 1, Section 3.mp3',
      bytes: 5120802,
    },
    groups: [
      {
        id: 'c13t1-l3-g1',
        heading: 'Questions 21–25',
        instruction: 'Choose the correct letter, A, B or C.',
        layout: 'list',
        questions: [
          {
            number: 21,
            prompt: 'Why is Jack interested in investigating seed germination?',
            type: 'mcq',
            options: [
              'He may do a module on a related topic later on.',
              'He wants to have a career in plant science.',
              'He is thinking of choosing this topic for his dissertation.',
            ],
            answer: 'A',
          },
          {
            number: 22,
            prompt:
              'Jack and Emma agree the main advantage of their present experiment is that it can be',
            type: 'mcq',
            options: [
              'described very easily.',
              'carried out inside the laboratory.',
              'completed in the time available.',
            ],
            answer: 'C',
          },
          {
            number: 23,
            prompt: 'What do they decide to check with their tutor?',
            type: 'mcq',
            options: [
              'whether their aim is appropriate',
              'whether anyone else has chosen this topic',
              'whether the assignment contributes to their final grade',
            ],
            answer: 'B',
          },
          {
            number: 24,
            prompt: "They agree that Graves' book on seed germination is disappointing because",
            type: 'mcq',
            options: [
              'it fails to cover recent advances in seed science.',
              'the content is irrelevant for them.',
              'its focus is very theoretical.',
            ],
            answer: 'C',
          },
          {
            number: 25,
            prompt: 'What does Jack say about the article on seed germination by Lee Hall?',
            type: 'mcq',
            options: [
              'The diagrams of plant development are useful.',
              'The analysis of seed germination statistics is thorough.',
              'The findings on seed germination after fires are surprising.',
            ],
            answer: 'B',
          },
        ],
      },
      {
        id: 'c13t1-l3-g2',
        heading: 'Questions 26–30',
        instruction: 'Complete the flow-chart below.',
        note:
          'Choose FIVE answers from the box and write the correct letter, A–H, next to Questions 26–30.',
        title: 'Stages in the experiment',
        layout: 'flow',
        box: {
          title: 'Answers',
          items: [
            { letter: 'A', text: 'container' },
            { letter: 'B', text: 'soil' },
            { letter: 'C', text: 'weight' },
            { letter: 'D', text: 'condition' },
            { letter: 'E', text: 'height' },
            { letter: 'F', text: 'colour' },
            { letter: 'G', text: 'types' },
            { letter: 'H', text: 'depths' },
          ],
        },
        flow: {
          title: 'Stages in the experiment',
          steps: [
            'Select seeds of different {{26}} and sizes.',
            'Measure and record the {{27}} and size of each one.',
            'Decide on the {{28}} to be used.',
            'Use a different {{29}} for each seed and label it.',
            "After about 3 weeks, record the plant's {{30}}.",
            'Investigate the findings.',
          ],
        },
        questions: [
          { number: 26, prompt: 'Select seeds of different ____ and sizes.', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], answer: 'G' },
          { number: 27, prompt: 'Measure and record the ____ and size of each one.', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], answer: 'C' },
          { number: 28, prompt: 'Decide on the ____ to be used.', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], answer: 'H' },
          { number: 29, prompt: 'Use a different ____ for each seed and label it.', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], answer: 'A' },
          { number: 30, prompt: "After about 3 weeks, record the plant's ____.", type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], answer: 'E' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* SECTION 4 — Effects of urban environments on animals (31–40)      */
  /* ---------------------------------------------------------------- */
  {
    id: 4,
    heading: 'Section 4',
    title: 'Effects of urban environments on animals',
    intro: 'A lecture on how city life is changing the animals that live alongside us.',
    audio: {
      driveId: '1q3UN6NOv-ugSukJX15M4oPJMvObpD3fL',
      filename: 'IELTS13-Test 1, Section 4.mp3',
      bytes: 5030345,
    },
    groups: [
      {
        id: 'c13t1-l4-g1',
        heading: 'Questions 31–40',
        instruction: 'Complete the notes below.',
        note: 'Write ONE WORD ONLY for each answer.',
        title: 'Effects of urban environments on animals',
        layout: 'notes',
        questions: [
          {
            number: 31,
            prompt: 'the ____ – because of its general adaptability',
            type: 'text',
            answer: 'crow|crows',
            explanation: 'The lecture names the crow, describing it as highly adaptable.',
          },
          {
            number: 32,
            prompt: 'the pigeon – because walls of city buildings are similar to ____',
            type: 'text',
            answer: 'cliffs|cliff',
            explanation: 'City walls imitate the cliffs pigeons nest on naturally.',
          },
          {
            number: 33,
            prompt: 'many urban animals are adapting with unusual ____',
            type: 'text',
            answer: 'speed',
            explanation: 'The speaker stresses how quickly this adaptation is happening.',
          },
          {
            number: 34,
            prompt: 'She found the size of their ____ had increased.',
            type: 'text',
            answer: 'brain|brains',
            explanation: 'Emilie Snell-Rood found larger brains in urban mammals.',
          },
          {
            number: 35,
            prompt: 'the need to locate new sources of ____ and to deal with new dangers',
            type: 'text',
            answer: 'food',
            explanation: 'Finding food in a city is harder, which may explain the bigger brain.',
          },
          {
            number: 36,
            prompt: 'Catarina Miranda focused on the ____ of urban and rural blackbirds.',
            type: 'text',
            answer: 'behaviour|behavior|behaviours|behaviors',
            explanation: 'Her work compares how the two groups behave.',
          },
          {
            number: 37,
            prompt: 'urban birds were braver, but were afraid of situations that were ____',
            type: 'text',
            answer: 'new',
            explanation: 'Urban birds cope with people but fear unfamiliar situations.',
          },
          {
            number: 38,
            prompt: 'some animals respond to ____ by producing lower levels of hormones',
            type: 'text',
            answer: 'stress',
            explanation: 'Jonathan Atwell linked lower hormone levels to stress.',
          },
          {
            number: 39,
            prompt: 'urban squirrels use their ____ to help them communicate',
            type: 'text',
            answer: 'tail|tails',
            explanation: "Sarah Partan's team studied tail signalling in squirrels.",
          },
          {
            number: 40,
            prompt: 'some changes may not be ____',
            type: 'text',
            answer: 'permanent',
            explanation: 'The lecture closes by warning that not all changes will last.',
          },
        ],
      },
    ],
  },
];

/* ================================================================== */
/* READING — Cambridge IELTS 13, Test 1  (Academic)                   */
/* ================================================================== */

export const C13_T1_READING: CambridgePassage[] = [
  /* ---------------------------------------------------------------- */
  /* PASSAGE 1 — Tourism New Zealand (Questions 1–13)                  */
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    title: 'Case Study: Tourism New Zealand website',
    subtitle: 'READING PASSAGE 1 — you should spend about 20 minutes on Questions 1–13.',
    paragraphs: [
      {
        label: '',
        text:
          'New Zealand is a small country of four million inhabitants, a long-haul flight from all the major tourist-generating markets of the world. Tourism currently makes up 9% of the country\'s gross domestic product, and is the country\'s largest export sector. Unlike other export sectors, which make products and then sell them overseas, tourism brings its customers to New Zealand. The product is the country itself — the people, the places and the experiences. In 1999, Tourism New Zealand launched a campaign to communicate a new brand position to the world. The campaign focused on New Zealand\'s scenic beauty, exhilarating outdoor activities and authentic Maori culture, and it made New Zealand one of the strongest national brands in the world.',
      },
      {
        label: '',
        text:
          'A key feature of the campaign was the website www.newzealand.com, which provided potential visitors to New Zealand with a single gateway to everything the destination had to offer. The heart of the website was a database of tourism services operators, both those based in New Zealand and those based abroad which offered tourism services to the country. Any tourism-related business could be listed by filling in a simple form. This meant that even the smallest bed and breakfast address or specialist activity provider could gain a web presence with access to an audience of long-haul visitors. In addition, because participating businesses were able to update the details they gave on a regular basis, the information provided remained accurate. And to maintain and improve standards, Tourism New Zealand organised a scheme whereby organisations appearing on the website underwent an independent evaluation against a set of agreed national standards of quality. As part of this, the effect of each business on the environment was considered.',
      },
      {
        label: '',
        text:
          'To communicate the New Zealand experience, the site also carried features relating to famous people and places. One of the most popular was an interview with former New Zealand All Blacks rugby captain Tana Umaga. Another feature that attracted a lot of attention was an interactive journey through a number of the locations chosen for blockbuster films which had made use of New Zealand\'s stunning scenery as a backdrop. As the site developed, additional features were added to help independent travellers devise their own customised itineraries. To make it easier to plan motoring holidays, the site catalogued the most popular driving routes in the country, highlighting different routes according to the season and indicating distances and times.',
      },
      {
        label: '',
        text:
          'Later, a Travel Planner feature was added, which allowed visitors to click and "bookmark" places or attractions they were interested in, and then view the results on a map. The Travel Planner offered suggested routes and public transport options between the chosen locations. There were also links to accommodation in the area. By registering with the website, users could save their Travel Plan and return to it later, or print it out to take on the visit. The website also had a \'Your Words\' section where anyone could submit a blog of their New Zealand travels for possible inclusion on the website.',
      },
      {
        label: '',
        text:
          'The Tourism New Zealand website won two Webby awards for online achievement and innovation. More importantly perhaps, the growth of tourism to New Zealand was impressive. Overall tourism expenditure increased by an average of 6.9% per year between 1999 and 2004. From Britain, visits to New Zealand grew at an average annual rate of 13% between 2002 and 2006, compared to a rate of 4% overall for British visits abroad.',
      },
      {
        label: '',
        text:
          'The website was set up to allow both individuals and travel organisations to create itineraries and travel packages to suit their own needs and interests. On the website, visitors can search for activities not solely by geographical location, but also by the particular nature of the activity. This is important as research shows that activities are the key driver of visitor satisfaction, contributing 74% to visitor satisfaction, while transport and accommodation account for the remaining 26%. The more activities that visitors undertake, the more satisfied they will be. It has also been found that visitors enjoy cultural activities most when they are interactive, such as visiting a marae (meeting ground) to learn about traditional Maori life. Many long-haul travellers enjoy such learning experiences, which provide them with stories to take home to their friends and family. In addition, it appears that visitors to New Zealand don\'t want to be \'one of the crowd\' and find activities that involve only a few people more special and meaningful.',
      },
      {
        label: '',
        text:
          'It could be argued that New Zealand is not a typical destination. New Zealand is a small country with a visitor economy composed mainly of small businesses. It is generally perceived as a safe English-speaking country with a reliable transport infrastructure. Because of the long-haul flight, most visitors stay for longer (average 20 days) and want to see as much of the country as possible on what is often seen as a once-in-a-lifetime visit. However, the underlying lessons apply anywhere — the effectiveness of a strong brand, a strategy based on unique experiences and a comprehensive and user-friendly website.',
      },
    ],
    groups: [
      {
        id: 'c13t1-r1-g1',
        heading: 'Questions 1–7',
        instruction: 'Complete the table below.',
        note:
          'Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 1–7 on your answer sheet.',
        layout: 'table',
        table: TOURISM_TABLE,
        questions: [
          {
            number: 1,
            prompt: 'allowed businesses to ____ information regularly',
            type: 'text',
            answer: 'update',
            explanation: '"participating businesses were able to update the details they gave on a regular basis".',
          },
          {
            number: 2,
            prompt: 'including their impact on the ____',
            type: 'text',
            answer: 'environment',
            explanation: '"the effect of each business on the environment was considered".',
          },
          {
            number: 3,
            prompt: 'an interview with a former sports ____',
            type: 'text',
            answer: 'captain',
            explanation: '"an interview with former New Zealand All Blacks rugby captain Tana Umaga".',
          },
          {
            number: 4,
            prompt: 'an interactive tour of various locations used in ____',
            type: 'text',
            answer: 'films|film',
            explanation: '"locations chosen for blockbuster films".',
          },
          {
            number: 5,
            prompt: 'varied depending on the ____',
            type: 'text',
            answer: 'season',
            explanation: '"highlighting different routes according to the season".',
          },
          {
            number: 6,
            prompt: 'details of public transport and local ____',
            type: 'text',
            answer: 'accommodation',
            explanation: '"There were also links to accommodation in the area" — "local" in the table means "in the area".',
          },
          {
            number: 7,
            prompt: 'travellers could send a link to their ____',
            type: 'text',
            answer: 'blog',
            explanation: '"anyone could submit a blog of their New Zealand travels".',
          },
        ],
      },
      {
        id: 'c13t1-r1-g2',
        heading: 'Questions 8–13',
        instruction:
          'Do the following statements agree with the information given in Reading Passage 1?',
        note:
          'In boxes 8–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
        layout: 'list',
        questions: [
          {
            number: 8,
            prompt:
              'The website www.newzealand.com aimed to provide ready-made itineraries and packages for travel companies and individual tourists.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'FALSE',
            explanation:
              'The site let travellers "create itineraries and travel packages to suit their own needs" — it did not supply ready-made ones.',
          },
          {
            number: 9,
            prompt:
              'It was found that most visitors started searching on the website by geographical location.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'NOT GIVEN',
            explanation:
              'The passage says visitors can search "not solely by geographical location", but nothing about how most of them start.',
          },
          {
            number: 10,
            prompt: 'According to research, 26% of visitor satisfaction is related to their accommodation.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'FALSE',
            explanation:
              'Activities contribute 74%; transport and accommodation together account for the remaining 26%, not accommodation alone.',
          },
          {
            number: 11,
            prompt: 'Visitors to New Zealand like to become involved in the local culture.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'TRUE',
            explanation:
              '"visitors enjoy cultural activities most when they are interactive, such as visiting a marae".',
          },
          {
            number: 12,
            prompt:
              'Visitors like staying in small hotels in New Zealand rather than in larger ones.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'NOT GIVEN',
            explanation:
              'Small businesses are mentioned, and a wish not to be "one of the crowd", but hotels are never compared by size.',
          },
          {
            number: 13,
            prompt:
              'Many visitors feel it is unlikely that they will return to New Zealand after their visit.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'TRUE',
            explanation:
              '"what is often seen as a once-in-a-lifetime visit" — a trip believed to happen only once.',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PASSAGE 2 — Why being bored is stimulating (Questions 14–26)      */
  /* ---------------------------------------------------------------- */
  {
    id: 2,
    title: 'Why being bored is stimulating – and useful, too',
    subtitle:
      'This most common of emotions is turning out to be more interesting than we thought',
    paragraphs: [
      {
        label: 'A',
        text:
          'We all know how it feels — it\'s impossible to keep your mind on anything, time stretches out, and all the things you could do seem equally unlikely to make you feel better. But defining boredom so that it can be studied in the lab has proved difficult. For a start, it can include a lot of other mental states, such as frustration, apathy, depression and indifference. There isn\'t even agreement over whether boredom is always a low-energy, flat kind of emotion or whether feeling agitated and restless counts as boredom, too. In his book, Boredom: A Lively History, Peter Toohey at the University of Calgary, Canada, compares it to disgust — an emotion that motivates us to stay away from certain situations. "If disgust protects humans from infection, boredom may protect them from \'infectious\' social situations," he suggests.',
      },
      {
        label: 'B',
        text:
          'By asking people about their experiences of boredom, Thomas Goetz and his team at the University of Konstanz in Germany have recently identified five distinct types: indifferent, calibrating, searching, reactant and apathetic. These can be plotted on two axes — one running left to right, which measures low to high arousal, and the other from top to bottom, which measures how positive or negative the feeling is. Intriguingly, Goetz has found that while people experience all kinds of boredom, they tend to specialise in one. Of the five types, the most damaging is "reactant" boredom with its explosive combination of high arousal and negative emotion. The most useful is what Goetz calls "indifferent" boredom: someone isn\'t engaged in anything satisfying but still feels relaxed and calm. However, it remains to be seen whether there are any character traits that predict the kind of boredom each of us might be prone to.',
      },
      {
        label: 'C',
        text:
          'Psychologist Sandi Mann at the University of Central Lancashire, UK, goes further. "All emotions are there for a reason, including boredom," she says. Mann has found that being bored makes us more creative. "We\'re all afraid of being bored but in actual fact it can lead to all kinds of amazing things," she says. In experiments published last year, Mann found that people who had been made to feel bored by copying numbers out of the phone book for 15 minutes came up with more creative ideas about how to use a polystyrene cup than a control group. Mann concluded that a passive, boring activity is best for creativity because it allows the mind to wander. In fact, she goes so far as to suggest that we should seek out more boredom in our lives.',
      },
      {
        label: 'D',
        text:
          'Psychologist John Eastwood at York University in Toronto, Canada, isn\'t convinced. "If you are in a state of mind-wandering you are not bored," he says. "In my view, by definition boredom is an undesirable state." That doesn\'t necessarily mean that it isn\'t adaptive, he adds. "Pain is adaptive — if we didn\'t have physical pain, bad things would happen to us. Does that mean that we should actively cause pain? No. But even if boredom has evolved to help us survive, it can still be toxic if allowed to fester." For Eastwood, the central feature of boredom is a failure to put our "attention system" into gear. This causes an inability to focus on anything, which makes time seem to go painfully slowly. What\'s more, your efforts to improve the situation can end up making you feel worse. "People try to connect with the world and if they are not successful there\'s that frustration and irritability," he says. Perhaps most worrying, says Eastwood, repeatedly failing to engage attention can lead to a state where we don\'t know what to do any more, and no longer care.',
      },
      {
        label: 'E',
        text:
          'Eastwood\'s team is now trying to explore why the attention system fails. It\'s early days but they think that at least some of it comes down to personality. Boredom proneness has been linked with a variety of traits. People who are motivated by pleasure seem to suffer particularly badly. Other personality traits, such as curiosity, are associated with a high boredom threshold. More evidence that boredom has detrimental effects comes from studies of people who are more or less prone to boredom. It seems those who bore easily face poorer prospects in education, their career and even life in general. But of course, boredom itself cannot kill — it\'s the things we do to deal with it that may put us in danger. What can we do to alleviate it before it comes to that? Goetz\'s group has one suggestion. Working with teenagers, they found that those who "approach" a boring situation — in other words, see that it\'s boring and get stuck in anyway — report less boredom than those who try to avoid it by using snacks, TV or social media for distraction.',
      },
      {
        label: 'F',
        text:
          'Psychologist Francoise Wemelsfelder speculates that our over-connected lifestyles might even be a new source of boredom. "In modern human society there is a lot of overstimulation but still a lot of problems finding meaning," she says. So instead of seeking yet more mental stimulation, perhaps we should leave our phones alone, and use boredom to motivate us to engage with the world in a more meaningful way.',
      },
    ],
    groups: [
      {
        id: 'c13t1-r2-g1',
        heading: 'Questions 14–19',
        instruction: 'Reading Passage 2 has six paragraphs, A–F.',
        note:
          'Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–viii, in boxes 14–19 on your answer sheet.',
        layout: 'compact',
        box: {
          title: 'List of Headings',
          items: [
            { letter: 'i', text: 'The productive outcomes that may result from boredom' },
            { letter: 'ii', text: 'What teachers can do to prevent boredom' },
            { letter: 'iii', text: 'A new explanation and a new cure for boredom' },
            { letter: 'iv', text: 'Problems with a scientific approach to boredom' },
            { letter: 'v', text: 'A potential danger arising from boredom' },
            { letter: 'vi', text: 'Creating a system of classification for feelings of boredom' },
            { letter: 'vii', text: 'Age groups most affected by boredom' },
            { letter: 'viii', text: 'Identifying those most affected by boredom' },
          ],
        },
        questions: [
          { number: 14, prompt: 'Paragraph A', type: 'select', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], answer: 'iv' },
          { number: 15, prompt: 'Paragraph B', type: 'select', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], answer: 'vi' },
          { number: 16, prompt: 'Paragraph C', type: 'select', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], answer: 'i' },
          { number: 17, prompt: 'Paragraph D', type: 'select', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], answer: 'v' },
          { number: 18, prompt: 'Paragraph E', type: 'select', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], answer: 'viii' },
          { number: 19, prompt: 'Paragraph F', type: 'select', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], answer: 'iii' },
        ],
      },
      {
        id: 'c13t1-r2-g2',
        heading: 'Questions 20–23',
        instruction:
          'Look at the following people (Questions 20–23) and the list of ideas below.',
        note:
          'Match each person with the correct idea, A–E. Write the correct letter, A–E, in boxes 20–23 on your answer sheet.',
        layout: 'compact',
        box: {
          title: 'List of Ideas',
          items: [
            { letter: 'A', text: 'The way we live today may encourage boredom.' },
            { letter: 'B', text: 'One sort of boredom is worse than all the others.' },
            { letter: 'C', text: 'Levels of boredom may fall in the future.' },
            { letter: 'D', text: 'Trying to cope with boredom can increase its negative effects.' },
            { letter: 'E', text: 'Boredom may encourage us to avoid an unpleasant experience.' },
          ],
        },
        questions: [
          { number: 20, prompt: 'Peter Toohey', type: 'select', options: ['A', 'B', 'C', 'D', 'E'], answer: 'E' },
          { number: 21, prompt: 'Thomas Goetz', type: 'select', options: ['A', 'B', 'C', 'D', 'E'], answer: 'B' },
          { number: 22, prompt: 'John Eastwood', type: 'select', options: ['A', 'B', 'C', 'D', 'E'], answer: 'D' },
          { number: 23, prompt: 'Francoise Wemelsfelder', type: 'select', options: ['A', 'B', 'C', 'D', 'E'], answer: 'A' },
        ],
      },
      {
        id: 'c13t1-r2-g3',
        heading: 'Questions 24–26',
        instruction: 'Complete the summary below.',
        note:
          'Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 24–26 on your answer sheet.',
        title: 'Responses to boredom',
        layout: 'notes',
        questions: [
          {
            number: 24,
            prompt:
              'For John Eastwood, the central feature of boredom is that people cannot ____, due to a failure in what he calls the "attention system", and as a result they become frustrated and irritable.',
            type: 'text',
            answer: 'focus',
            explanation: '"This causes an inability to focus on anything".',
          },
          {
            number: 25,
            prompt:
              'His team suggests that those for whom ____ is an important aim in life may have problems in coping with boredom,',
            type: 'text',
            answer: 'pleasure',
            explanation: '"People who are motivated by pleasure seem to suffer particularly badly."',
          },
          {
            number: 26,
            prompt:
              'whereas those who have the characteristic of ____ can generally cope with it.',
            type: 'text',
            answer: 'curiosity',
            explanation: '"Other personality traits, such as curiosity, are associated with a high boredom threshold."',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PASSAGE 3 — Artificial artists (Questions 27–40)                  */
  /* ---------------------------------------------------------------- */
  {
    id: 3,
    title: 'Artificial artists',
    subtitle: 'Can computers really create works of art?',
    paragraphs: [
      {
        label: '',
        text:
          'The Painting Fool is one of a growing number of computer programs which, so their makers claim, possess creative talents. Classical music by an artificial composer has had audiences enraptured, and even tricked them into believing a human was behind the score. Artworks painted by a robot have sold for thousands of dollars and been hung in prestigious galleries. And software has been built which creates art that could not have been imagined by the programmer.',
      },
      {
        label: '',
        text:
          'Human beings are the only species to perform sophisticated creative acts regularly. If we break this process down into computer code, where does that leave human creativity? "This is a question at the very core of humanity," says Geraint Wiggins, a computational creativity researcher at Goldsmiths, University of London. "It scares a lot of people. They are worried that it is taking something special away from what it means to be human."',
      },
      {
        label: '',
        text:
          'To some extent, we are all familiar with computerised art. The question is: where does the work of the artist stop and the creativity of the computer begin? Consider one of the oldest machine artists, Aaron, a robot that has had paintings exhibited in London\'s Tate Modern and the San Francisco Museum of Modern Art. Aaron can pick up a paintbrush and paint on canvas on its own. Impressive perhaps, but it is still little more than a tool to realise the programmer\'s own creative ideas.',
      },
      {
        label: '',
        text:
          'Simon Colton, the designer of the Painting Fool, is keen to make sure his creation doesn\'t attract the same criticism. Unlike earlier "artists" such as Aaron, the Painting Fool only needs minimal direction and can come up with its own concepts by going online for material. The software runs its own web searches and trawls through social media sites. It is now beginning to display a kind of imagination too, creating pictures from scratch. One of its original works is a series of fuzzy landscapes, depicting trees and sky. While some might say they have a mechanical look, Colton argues that such reactions arise from people\'s double standards towards software-produced and human-produced art. After all, he says, consider that the Painting Fool painted the landscapes without referring to a photo. "If a child painted a new scene from its head, you\'d say it has a certain level of imagination," he points out. "The same should be true of a machine." Software bugs can also lead to unexpected results. Some of the Painting Fool\'s paintings of a chair came out in black and white, thanks to a technical glitch. This gives the work an eerie, ghostlike quality. Human artists like the renowned Ellsworth Kelly are lauded for limiting their colour palette — so why should computers be any different?',
      },
      {
        label: '',
        text:
          'Researchers like Colton don\'t believe it is right to measure machine creativity directly to that of humans who "have had millennia to develop our skills". Others, though, are fascinated by the prospect that a computer might create something as original and subtle as our best artists. So far, only one has come close. Composer David Cope invented a program called Experiments in Musical Intelligence, or EMI. Not only did EMI create compositions in Cope\'s style, but also that of the most revered classical composers, including Bach, Chopin and Mozart. Audiences were moved to tears, and EMI even fooled classical music experts into thinking they were hearing genuine Bach. Not everyone was impressed however. Some, such as Wiggins, have blasted Cope\'s work as pseudoscience, and condemned him for his deliberately vague explanation of how the software worked. Meanwhile, Douglas Hofstadter of Indiana University said EMI created replicas which still rely completely on the original artist\'s creative impulses. When audiences found out the truth they were often outraged with Cope, and one music lover even tried to punch him. Amid such controversy, Cope destroyed EMI\'s vital databases.',
      },
      {
        label: '',
        text:
          'But why did so many people love the music, yet recoil when they discovered how it was composed? A study by computer scientist David Moffat of Glasgow Caledonian University provides a clue. He asked both expert musicians and non-experts to assess six compositions. The participants weren\'t told beforehand whether the tunes were composed by humans or computers, but were asked to guess, and then rate how much they liked each one. People who thought the composer was a computer tended to dislike the piece more than those who believed it was human. This was true even among the experts, who might have been expected to be more objective in their analyses.',
      },
      {
        label: '',
        text:
          'Where does this prejudice come from? Paul Bloom of Yale University has a suggestion: he reckons part of the pleasure we get from art stems from the creative process behind the work. This can give it an "irresistible essence", says Bloom. Meanwhile, experiments by Justin Kruger of New York University have shown that people\'s enjoyment of an artwork increases if they think more time and effort was needed to create it. Similarly, Colton thinks that when people experience art, they wonder what the artist might have been thinking or what the artist is trying to tell them. It seems obvious, therefore, that with computers producing art, this speculation is cut short — there\'s nothing to explore. But as technology becomes increasingly complex, finding those greater depths in computer art could become possible. This is precisely why Colton asks the Painting Fool to tap into online social networks for its inspiration: hopefully this way it will choose themes that will already be meaningful to us.',
      },
    ],
    groups: [
      {
        id: 'c13t1-r3-g1',
        heading: 'Questions 27–31',
        instruction: 'Choose the correct letter, A, B, C or D.',
        note: 'Write the correct letter in boxes 27–31 on your answer sheet.',
        layout: 'list',
        questions: [
          {
            number: 27,
            prompt:
              'What is the writer suggesting about computer-produced works in the first paragraph?',
            type: 'mcq',
            options: [
              "People's acceptance of them can vary considerably.",
              'A great deal of progress has already been attained in this field.',
              'They have had more success in some artistic genres than in others.',
              'The advances are not as significant as the public believes them to be.',
            ],
            answer: 'B',
            explanation:
              'The list of successes — enraptured audiences, expensive artworks, software creating the unimagined — shows how far the field has come.',
          },
          {
            number: 28,
            prompt: 'According to Geraint Wiggins, why are many people worried by computer art?',
            type: 'mcq',
            options: [
              'It is aesthetically inferior to human art.',
              'It may ultimately supersede human art.',
              'It undermines a fundamental human quality.',
              'It will lead to a deterioration in human ability.',
            ],
            answer: 'C',
            explanation:
              '"They are worried that it is taking something special away from what it means to be human."',
          },
          {
            number: 29,
            prompt: 'What is a key difference between Aaron and the Painting Fool?',
            type: 'mcq',
            options: [
              "its programmer's background",
              'public response to its work',
              'the source of its subject matter',
              'the technical standard of its output',
            ],
            answer: 'C',
            explanation:
              'Aaron merely realises the programmer\'s ideas; the Painting Fool finds its own material online and works "from scratch".',
          },
          {
            number: 30,
            prompt: 'What point does Simon Colton make in the fourth paragraph?',
            type: 'mcq',
            options: [
              'Software-produced art is often dismissed as childish and simplistic.',
              'The same concepts of creativity should not be applied to all forms of art.',
              'It is unreasonable to expect a machine to be as imaginative as a human being.',
              'People tend to judge computer art and human art according to different criteria.',
            ],
            answer: 'D',
            explanation: '"such reactions arise from people\'s double standards" — the same work is judged differently.',
          },
          {
            number: 31,
            prompt:
              'The writer refers to the paintings of a chair as an example of computer art which',
            type: 'mcq',
            options: [
              'achieves a particularly striking effect.',
              'exhibits a certain level of genuine artistic skill.',
              'closely resembles that of a well-known artist.',
              'highlights the technical limitations of the software.',
            ],
            answer: 'A',
            explanation: 'The glitch "gives the work an eerie, ghostlike quality" — an unexpectedly powerful effect.',
          },
        ],
      },
      {
        id: 'c13t1-r3-g2',
        heading: 'Questions 32–37',
        instruction: 'Complete each sentence with the correct ending, A–G, below.',
        note: 'Write the correct letter, A–G, in boxes 32–37 on your answer sheet.',
        layout: 'compact',
        box: {
          title: 'List of Ideas',
          items: [
            { letter: 'A', text: 'generating work that was virtually indistinguishable from that of humans.' },
            { letter: 'B', text: 'knowing whether it was the work of humans or software.' },
            { letter: 'C', text: 'producing work entirely dependent on the imagination of its creator.' },
            { letter: 'D', text: 'comparing the artistic achievements of humans and computers.' },
            { letter: 'E', text: 'revealing the technical details of his program.' },
            { letter: 'F', text: 'persuading the public to appreciate computer art.' },
            { letter: 'G', text: 'discovering that it was the product of a computer program.' },
          ],
        },
        questions: [
          {
            number: 32,
            prompt: 'Simon Colton says it is important to consider the long-term view when',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'D',
            explanation:
              'Humans "have had millennia to develop our skills", so a fair comparison needs a long view.',
          },
          {
            number: 33,
            prompt: "David Cope's EMI software surprised people by",
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'A',
            explanation: 'EMI "fooled classical music experts into thinking they were hearing genuine Bach".',
          },
          {
            number: 34,
            prompt: 'Geraint Wiggins criticised Cope for not',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'E',
            explanation: 'He condemned Cope\'s "deliberately vague explanation of how the software worked".',
          },
          {
            number: 35,
            prompt: 'Douglas Hofstadter claimed that EMI was',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'C',
            explanation: 'Replicas "which still rely completely on the original artist\'s creative impulses".',
          },
          {
            number: 36,
            prompt: 'Audiences who had listened to EMI\'s music became angry after',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'G',
            explanation: '"When audiences found out the truth they were often outraged".',
          },
          {
            number: 37,
            prompt: "The participants in David Moffat's study had to assess music without",
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'B',
            explanation: '"The participants weren\'t told beforehand whether the tunes were composed by humans or computers".',
          },
        ],
      },
      {
        id: 'c13t1-r3-g3',
        heading: 'Questions 38–40',
        instruction:
          'Do the following statements agree with the claims of the writer in Reading Passage 3?',
        note:
          'In boxes 38–40 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
        layout: 'list',
        questions: [
          {
            number: 38,
            prompt: "Moffat's research may help explain people's reactions to EMI.",
            type: 'select',
            options: ['YES', 'NO', 'NOT GIVEN'],
            answer: 'YES',
            explanation:
              'The writer introduces Moffat\'s study with "provides a clue" to explain that reaction.',
          },
          {
            number: 39,
            prompt: 'The non-experts in Moffat\'s study all responded in a predictable way.',
            type: 'select',
            options: ['YES', 'NO', 'NOT GIVEN'],
            answer: 'NOT GIVEN',
            explanation:
              'The study reports a tendency across all participants; nothing is said about every non-expert behaving predictably.',
          },
          {
            number: 40,
            prompt:
              "Justin Kruger's findings cast doubt on Paul Bloom's theory about people's prejudice towards computer art.",
            type: 'select',
            options: ['YES', 'NO', 'NOT GIVEN'],
            answer: 'NO',
            explanation:
              'Kruger\'s effort findings support Bloom\'s idea that pleasure comes from the creative process — they do not contradict it.',
          },
        ],
      },
    ],
  },
];
