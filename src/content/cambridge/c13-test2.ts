import type { CambridgePassage, CambridgeSection } from './types';

/* ================================================================== */
/* LISTENING — Cambridge IELTS 13, Test 2                             */
/* ================================================================== */

/**
 * Every word below is transcribed from the owner's copy of the book
 * (pages 32–37). The recordings stay in the owner's Google Drive and are
 * streamed from there — no audio is stored in this repository.
 */
export const C13_T2_LISTENING: CambridgeSection[] = [
  {
    id: 1,
    heading: 'Section 1',
    title: 'South City Cycling Club',
    intro:
      'A woman telephones a cycling club to ask about membership and training rides.',
    audio: {
      driveId: '1Tib38EMnbwF1bTKplXTiGFMwpj1x3kRQ',
      filename: 'IELTS13-Test 2, Section 1.mp3',
      bytes: 6252297,
    },
    groups: [
      {
        id: 'c13t2-l1-g1',
        heading: 'Questions 1–10',
        instruction: 'Complete the notes below.',
        note: 'Write ONE WORD AND/OR A NUMBER for each answer.',
        title: 'South City Cycling Club',
        layout: 'notes',
        sections: [
          {
            heading: 'Example\nName of club secretary: Jim Hunter',
            lines: [],
          },
          {
            heading: 'Membership',
            lines: [
              'Full membership costs $260; this covers cycling and {{1}} all over Australia',
              'Recreational membership costs $108',
              'Cost of membership includes the club fee and {{2}}',
              'The club kit is made by a company called {{3}}',
            ],
          },
          {
            heading: 'Training rides',
            lines: [
              'Chance to improve cycling skills and fitness',
              'Level B: speed about {{4}} kph',
              'Weekly sessions',
              '– Tuesdays at 5.30 am, meet at the {{5}}',
              '– Thursdays at 5.30 am, meet at the entrance to the {{6}}',
            ],
          },
          {
            heading: 'Further information',
            lines: [
              'Rides are about an hour and a half',
              'Members often have {{7}} together afterwards',
              'There is not always a {{8}} with the group on these rides',
              'Check and print the {{9}} on the website beforehand',
              'Bikes must have {{10}}',
            ],
          },
        ],
        questions: [
          {
            number: 1,
            prompt: 'Full membership costs $260; this covers cycling and ____ all over Australia',
            type: 'text',
            answer: 'races',
            explanation: 'Full membership covers cycling and entry to races across Australia.',
          },
          {
            number: 2,
            prompt: 'Cost of membership includes the club fee and ____',
            type: 'text',
            answer: 'insurance',
            explanation: 'The fee bundles the club fee with insurance.',
          },
          {
            number: 3,
            prompt: 'The club kit is made by a company called ____',
            type: 'text',
            answer: 'Jerriz|Jerry',
            explanation:
              'The name is a proper noun, so the book accepts the spelling given in the recording; both common spellings are accepted here.',
          },
          {
            number: 4,
            prompt: 'Level B: speed about ____ kph',
            type: 'text',
            answer: '25|twenty-five',
            explanation: 'Level B rides average about 25 kph.',
          },
          {
            number: 5,
            prompt: 'Tuesdays at 5.30 am, meet at the ____',
            type: 'text',
            answer: 'stadium',
            explanation: 'The Tuesday group meets at the stadium.',
          },
          {
            number: 6,
            prompt: 'Thursdays at 5.30 am, meet at the entrance to the ____',
            type: 'text',
            answer: 'park',
            explanation: 'Thursday riders meet at the park entrance.',
          },
          {
            number: 7,
            prompt: 'Members often have ____ together afterwards',
            type: 'text',
            answer: 'coffee',
            explanation: 'Riders usually go for a coffee after the ride.',
          },
          {
            number: 8,
            prompt: 'There is not always a ____ with the group on these rides',
            type: 'text',
            answer: 'leader',
            explanation: 'A ride leader is not always present.',
          },
          {
            number: 9,
            prompt: 'Check and print the ____ on the website beforehand',
            type: 'text',
            answer: 'route',
            explanation: 'The route is published on the club website.',
          },
          {
            number: 10,
            prompt: 'Bikes must have ____',
            type: 'text',
            answer: 'lights',
            explanation: 'Every bike needs lights, because rides start before dawn.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    heading: 'Section 2',
    title: 'Company volunteering projects',
    intro:
      'A talk to staff about the company’s volunteering programme and its Digital Inclusion Day.',
    audio: {
      driveId: '1n4FdVCgFxY7Xqsf6HjP7Eyu7iSQ5tsQ2',
      filename: 'IELTS13-Test 2, Section 2.mp3',
      bytes: 5279180,
    },
    groups: [
      {
        id: 'c13t2-l2-g1',
        heading: 'Questions 11–16',
        instruction: 'Choose the correct letter, A, B or C.',
        title: 'Information on company volunteering projects',
        layout: 'list',
        questions: [
          {
            number: 11,
            prompt: 'How much time for volunteering does the company allow per employee?',
            type: 'mcq',
            options: ['two hours per week', 'one day per month', '8 hours per year'],
            answer: 'C',
            explanation: 'The speaker confirms eight hours of paid volunteering time a year.',
          },
          {
            number: 12,
            prompt: 'In feedback almost all employees said that volunteering improved their',
            type: 'mcq',
            options: ['chances of promotion.', 'job satisfaction.', 'relationships with colleagues.'],
            answer: 'B',
            explanation: 'Nearly everyone reported higher job satisfaction.',
          },
          {
            number: 13,
            prompt: 'Last year some staff helped unemployed people with their',
            type: 'mcq',
            options: ['literacy skills.', 'job applications.', 'communication skills.'],
            answer: 'C',
            explanation: 'Staff coached unemployed people on communication skills.',
          },
          {
            number: 14,
            prompt: 'This year the company will start a new volunteering project with a local',
            type: 'mcq',
            options: ['school.', 'park.', 'charity.'],
            answer: 'B',
            explanation: 'This year’s new project is with a local park.',
          },
          {
            number: 15,
            prompt: 'Where will the Digital Inclusion Day be held?',
            type: 'mcq',
            options: [
              'at the company’s training facility',
              'at a college',
              'in a community centre',
            ],
            answer: 'B',
            explanation: 'The venue is a local college.',
          },
          {
            number: 16,
            prompt: 'What should staff do if they want to take part in the Digital Inclusion Day?',
            type: 'mcq',
            options: ['fill in a form', 'attend a training workshop', 'get permission from their manager'],
            answer: 'A',
            explanation: 'Interested staff need to fill in a form.',
          },
        ],
      },
      {
        id: 'c13t2-l2-g2',
        heading: 'Questions 17 and 18',
        instruction: 'Choose TWO letters, A–E.',
        note: 'Both correct letters are needed for the two marks.',
        layout: 'chooseTwo',
        box: {
          title: 'Options',
          items: [
            { letter: 'A', text: 'They were all over 70.' },
            { letter: 'B', text: 'They never used their computer.' },
            { letter: 'C', text: 'Their phones were mostly old-fashioned.' },
            { letter: 'D', text: 'They only used their phones for making calls.' },
            { letter: 'E', text: 'They initially showed little interest.' },
          ],
        },
        pairs: [
          {
            heading: 'Questions 17 and 18',
            prompt:
              'What TWO things are mentioned about the participants on the last Digital Inclusion Day?',
            answers: [17, 18],
          },
        ],
        questions: [
          {
            number: 17,
            prompt: 'participants on the last Digital Inclusion Day',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'C',
          },
          {
            number: 18,
            prompt: 'participants on the last Digital Inclusion Day',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'E',
          },
        ],
      },
      {
        id: 'c13t2-l2-g3',
        heading: 'Questions 19 and 20',
        instruction: 'Choose TWO letters, A–E.',
        note: 'Both correct letters are needed for the two marks.',
        layout: 'chooseTwo',
        box: {
          title: 'Options',
          items: [
            { letter: 'A', text: 'learning to use tablets' },
            { letter: 'B', text: 'communicating with family' },
            { letter: 'C', text: 'shopping online' },
            { letter: 'D', text: 'playing online games' },
            { letter: 'E', text: 'sending emails' },
          ],
        },
        pairs: [
          {
            heading: 'Questions 19 and 20',
            prompt:
              'What TWO activities on the last Digital Inclusion Day did participants describe as useful?',
            answers: [19, 20],
          },
        ],
        questions: [
          {
            number: 19,
            prompt: 'activity participants described as useful',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'B',
          },
          {
            number: 20,
            prompt: 'activity participants described as useful',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'D',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    heading: 'Section 3',
    title: 'Planning a presentation on nanotechnology',
    intro: 'A student, Russ, discusses his presentation with his tutor.',
    audio: {
      driveId: '1mX3qC-mGBiOzchmuBcFSrZJwZWforZmZ',
      filename: 'IELTS13-Test 2, Section 3.mp3',
      bytes: 5142399,
    },
    groups: [
      {
        id: 'c13t2-l3-g1',
        heading: 'Questions 21–25',
        instruction: 'Choose the correct letter, A, B or C.',
        title: 'Planning a presentation on nanotechnology',
        layout: 'list',
        questions: [
          {
            number: 21,
            prompt: 'Russ says that his difficulty in planning the presentation is due to',
            type: 'mcq',
            options: [
              'his lack of knowledge about the topic.',
              'his uncertainty about what he should try to achieve.',
              'the short time that he has for preparation.',
            ],
            answer: 'B',
            explanation: 'Russ is unsure what the presentation should achieve.',
          },
          {
            number: 22,
            prompt: 'Russ and his tutor agree that his approach in the presentation will be',
            type: 'mcq',
            options: [
              'to concentrate on how nanotechnology is used in one field.',
              'to follow the chronological development of nanotechnology.',
              'to show the range of applications of nanotechnology.',
            ],
            answer: 'A',
            explanation: 'They settle on one field of application, not a survey.',
          },
          {
            number: 23,
            prompt: 'In connection with slides, the tutor advises Russ to',
            type: 'mcq',
            options: [
              'talk about things that he can find slides to illustrate.',
              'look for slides to illustrate the points he makes.',
              'consider omitting slides altogether.',
            ],
            answer: 'C',
            explanation: 'The tutor suggests he may not need slides at all.',
          },
          {
            number: 24,
            prompt: 'They both agree that the best way for Russ to start his presentation is',
            type: 'mcq',
            options: [
              'to encourage the audience to talk.',
              'to explain what Russ intends to do.',
              'to provide an example.',
            ],
            answer: 'C',
            explanation: 'Starting with an example wins agreement from both.',
          },
          {
            number: 25,
            prompt: 'What does the tutor advise Russ to do next while preparing his presentation?',
            type: 'mcq',
            options: [
              'summarise the main point he wants to make',
              'read the notes he has already made',
              'list the topics he wants to cover',
            ],
            answer: 'A',
            explanation: 'The tutor asks him to write down his main point.',
          },
        ],
      },
      {
        id: 'c13t2-l3-g2',
        heading: 'Questions 26–30',
        instruction:
          'What comments do the speakers make about each of the following aspects of Russ’s previous presentation?',
        note:
          'Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 26–30.',
        title: 'Aspects of Russ’s previous presentation',
        layout: 'compact',
        box: {
          title: 'Comments',
          items: [
            { letter: 'A', text: 'lacked a conclusion' },
            { letter: 'B', text: 'useful in the future' },
            { letter: 'C', text: 'not enough' },
            { letter: 'D', text: 'sometimes distracting' },
            { letter: 'E', text: 'showed originality' },
            { letter: 'F', text: 'covered a wide range' },
            { letter: 'G', text: 'not too technical' },
          ],
        },
        questions: [
          {
            number: 26,
            prompt: 'structure',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'A',
            explanation: 'The presentation stopped without a conclusion.',
          },
          {
            number: 27,
            prompt: 'eye contact',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'C',
            explanation: 'There was too little eye contact with the audience.',
          },
          {
            number: 28,
            prompt: 'body language',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'D',
            explanation: 'His movement sometimes distracted from what he was saying.',
          },
          {
            number: 29,
            prompt: 'choice of words',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'G',
            explanation: 'The vocabulary was clear rather than over-technical.',
          },
          {
            number: 30,
            prompt: 'handouts',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'B',
            explanation: 'The handouts will be useful for revision later.',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    heading: 'Section 4',
    title: 'Episodic memory',
    intro: 'A lecture on how memories of personal events are formed and retrieved.',
    audio: {
      driveId: '182xVUspNMOivkSIzilgnBRM4vsFx5wIn',
      filename: 'IELTS13-Test 2, Section 4.mp3',
      bytes: 6521790,
    },
    groups: [
      {
        id: 'c13t2-l4-g1',
        heading: 'Questions 31–40',
        instruction: 'Complete the notes below.',
        note: 'Write ONE WORD ONLY for each answer.',
        title: 'Episodic memory',
        layout: 'notes',
        sections: [
          {
            lines: [
              'the ability to recall details, e.g. the time and {{31}} of past events',
              'different to semantic memory – the ability to remember general information about the {{32}}, which does not involve recalling {{33}} information',
            ],
          },
          {
            heading: 'Forming episodic memories involves three steps:',
            lines: [],
          },
          {
            heading: 'Encoding',
            lines: [
              'involves receiving and processing information',
              'the more {{34}} given to an event, the more successfully it can be encoded',
              'to remember a {{35}}, it is useful to have a strategy for encoding such information',
            ],
          },
          {
            heading: 'Consolidation',
            lines: [
              'how memories are strengthened and stored',
              'most effective when memories can be added to a {{36}} of related information',
              'the {{37}} of retrieval affects the strength of memories',
            ],
          },
          {
            heading: 'Retrieval',
            lines: [
              'memory retrieval often depends on using a prompt, e.g. the {{38}} of an object near to the place where you left your car',
            ],
          },
          {
            heading: 'Episodic memory impairments',
            lines: [
              'these affect people with a wide range of medical conditions',
              'games which stimulate the {{39}} have been found to help people with schizophrenia',
              'children with autism may have difficulty forming episodic memories – possibly because their concept of the {{40}} may be absent',
              'memory training may help autistic children develop social skills',
            ],
          },
        ],
        questions: [
          {
            number: 31,
            prompt: 'the ability to recall details, e.g. the time and ____ of past events',
            type: 'text',
            answer: 'location',
            explanation: 'Episodic memory records the time and the location of an event.',
          },
          {
            number: 32,
            prompt: 'general information about the ____',
            type: 'text',
            answer: 'world',
            explanation: 'Semantic memory stores facts about the world.',
          },
          {
            number: 33,
            prompt: 'which does not involve recalling ____ information',
            type: 'text',
            answer: 'personal',
            explanation: 'Semantic memory does not record personal experiences.',
          },
          {
            number: 34,
            prompt: 'the more ____ given to an event, the more successfully it can be encoded',
            type: 'text',
            answer: 'attention',
            explanation: 'Encoding depends on the attention paid to the event.',
          },
          {
            number: 35,
            prompt: 'to remember a ____, it is useful to have a strategy for encoding such information',
            type: 'text',
            answer: 'name',
            explanation: 'Names are offered as the classic example of a strategy task.',
          },
          {
            number: 36,
            prompt: 'most effective when memories can be added to a ____ of related information',
            type: 'text',
            answer: 'network',
            explanation: 'New memories consolidate best inside a network of related ones.',
          },
          {
            number: 37,
            prompt: 'the ____ of retrieval affects the strength of memories',
            type: 'text',
            answer: 'frequency',
            explanation: 'How often a memory is retrieved changes its strength.',
          },
          {
            number: 38,
            prompt: 'memory retrieval often depends on using a prompt, e.g. the ____ of an object near to the place where you left your car',
            type: 'text',
            answer: 'colour|color',
            explanation: 'The colour of a nearby object acts as a retrieval cue.',
          },
          {
            number: 39,
            prompt: 'games which stimulate the ____ have been found to help people with schizophrenia',
            type: 'text',
            answer: 'brain',
            explanation: 'Brain-training games showed benefit for people with schizophrenia.',
          },
          {
            number: 40,
            prompt: 'possibly because their concept of the ____ may be absent',
            type: 'text',
            answer: 'self',
            explanation: 'Autistic children may lack a developed concept of the self.',
          },
        ],
      },
    ],
  },
];

/* ================================================================== */
/* READING — Cambridge IELTS 13, Test 2  (Academic)                   */
/* ================================================================== */

export const C13_T2_READING: CambridgePassage[] = [
  {
    id: 1,
    title: 'Bringing cinnamon to Europe',
    subtitle: 'A spicy history of the trade that shaped European taste',
    paragraphs: [
      {
        label: '',
        text:
          'Cinnamon is a sweet, fragrant spice produced from the inner bark of trees of the genus Cinnamomum, which is native to the Indian sub-continent. It was known in biblical times, and is mentioned in several books of the Bible, both as an ingredient that was mixed with oils for anointing people\'s bodies, and also as a token indicating friendship among lovers and friends. In ancient Rome, mourners attending funerals burnt cinnamon to create a pleasant scent. Most often, however, the spice found its primary use as an additive to food and drink. In the Middle Ages, Europeans who could afford the spice used it to flavour food, particularly meat, and to impress those around them with their ability to purchase an expensive condiment from the \'exotic\' East. At a banquet, a host would offer guests a plate with various spices piled upon it as a sign of the wealth at his or her disposal. Cinnamon was also reported to have health benefits, and was thought to cure various ailments, such as indigestion.',
      },
      {
        label: '',
        text:
          'Toward the end of the Middle Ages, the European middle classes began to desire the lifestyle of the elite, including their consumption of spices. This led to a growth in demand for cinnamon and other spices. At that time, cinnamon was transported by Arab merchants, who closely guarded the secret of the source of the spice from potential rivals. They took it from India, where it was grown, on camels via an overland route to the Mediterranean. Their journey ended when they reached Alexandria. European traders sailed there to purchase their supply of cinnamon, then brought it back to Venice. The spice then travelled from that great trading city to markets all around Europe. Because the overland trade route allowed for only small quantities of the spice to reach Europe, and because Venice had a virtual monopoly of the trade, the Venetians could set the price of cinnamon exorbitantly high. These prices, coupled with the increasing demand, spurred the search for new routes to Asia by Europeans eager to take part in the spice trade.',
      },
      {
        label: '',
        text:
          'Seeking the high profits promised by the cinnamon market, Portuguese traders arrived on the island of Ceylon in the Indian Ocean toward the end of the 15th century. Before Europeans arrived on the island, the state had organized the cultivation of cinnamon. People belonging to the ethnic group called the Salagama would peel the bark off young shoots of the cinnamon plant in the rainy season, when the wet bark was more pliable. During the peeling process, they curled the bark into the \'stick\' shape still associated with the spice today. The Salagama then gave the finished product to the king as a form of tribute. When the Portuguese arrived, they needed to increase production significantly, and so enslaved many other members of the Ceylonese native population, forcing them to work in cinnamon harvesting. In 1518, the Portuguese built a fort on Ceylon, which enabled them to protect the island, so helping them to develop a monopoly in the cinnamon trade and generate very high profits. In the late 16th century, for example, they enjoyed a tenfold profit when shipping cinnamon over a journey of eight days from Ceylon to India.',
      },
      {
        label: '',
        text:
          'When the Dutch arrived off the coast of southern Asia at the very beginning of the 17th century, they set their sights on displacing the Portuguese as kings of cinnamon. The Dutch allied themselves with Kandy, an inland kingdom on Ceylon. In return for payments of elephants and cinnamon, they protected the native king from the Portuguese. By 1640, the Dutch broke the 150-year Portuguese monopoly when they overran and occupied their factories. By 1658, they had permanently expelled the Portuguese from the island, thereby gaining control of the lucrative cinnamon trade.',
      },
      {
        label: '',
        text:
          'In order to protect their hold on the market, the Dutch, like the Portuguese before them, treated the native inhabitants harshly. Because of the need to boost production and satisfy Europe\'s ever-increasing appetite for cinnamon, the Dutch began to alter the harvesting practices of the Ceylonese. Over time, the supply of cinnamon trees on the island became nearly exhausted, due to systematic stripping of the bark. Eventually, the Dutch began cultivating their own cinnamon trees to supplement the diminishing number of wild trees available for use.',
      },
      {
        label: '',
        text:
          'Then, in 1796, the English arrived on Ceylon, thereby displacing the Dutch from their control of the cinnamon monopoly. By the middle of the 19th century, production of cinnamon reached 1,000 tons a year, after a lower grade quality of the spice became acceptable to European tastes. By that time, cinnamon was being grown in other parts of the Indian Ocean region and in the West Indies, Brazil, and Guyana. Not only was a monopoly of cinnamon becoming impossible, but the spice trade overall was diminishing in economic potential, and was eventually superseded by the rise of trade in coffee, tea, chocolate, and sugar.',
      },
    ],
    groups: [
      {
        id: 'c13t2-r1-g1',
        heading: 'Questions 1–9',
        instruction: 'Complete the notes below.',
        note:
          'Choose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–9 on your answer sheet.',
        title: 'The Early History of Cinnamon',
        layout: 'notes',
        labels: [
          'Biblical times:',
          'Biblical times:',
          'Ancient Rome:',
          'Middle Ages:',
          'Middle Ages:',
          'Middle Ages:',
          'Middle Ages:',
          'Middle Ages:',
          'Middle Ages:',
          'Middle Ages:',
        ],
        sections: [
          {
            lines: [
              'added to {{1}}',
              'used to show {{2}} between people',
              'used for its sweet smell at {{3}}',
              'added to food, especially meat',
              'was an indication of a person\'s {{4}}',
              'known as a treatment for {{5}} and other health problems',
              'grown in {{6}}',
              'merchants used {{7}} to bring it to the Mediterranean',
              'arrived in the Mediterranean at {{8}}',
              'traders took it to {{9}} and sold it to destinations around Europe',
            ],
          },
        ],
        questions: [
          {
            number: 1,
            prompt: 'added to ____',
            type: 'text',
            answer: 'oils',
            explanation: 'In biblical times it was "mixed with oils for anointing people\'s bodies".',
          },
          {
            number: 2,
            prompt: 'used to show ____ between people',
            type: 'text',
            answer: 'friendship',
            explanation: 'The passage calls it "a token indicating friendship among lovers and friends".',
          },
          {
            number: 3,
            prompt: 'used for its sweet smell at ____',
            type: 'text',
            answer: 'funerals',
            explanation: 'In ancient Rome, "mourners attending funerals burnt cinnamon to create a pleasant scent".',
          },
          {
            number: 4,
            prompt: "was an indication of a person's ____",
            type: 'text',
            answer: 'wealth',
            explanation: '"a sign of the wealth at his or her disposal".',
          },
          {
            number: 5,
            prompt: 'known as a treatment for ____ and other health problems',
            type: 'text',
            answer: 'indigestion',
            explanation: '"thought to cure various ailments, such as indigestion".',
          },
          {
            number: 6,
            prompt: 'grown in ____',
            type: 'text',
            answer: 'India',
            explanation: '"They took it from India, where it was grown".',
          },
          {
            number: 7,
            prompt: 'merchants used ____ to bring it to the Mediterranean',
            type: 'text',
            answer: 'camels',
            explanation: 'Arab merchants carried it "on camels via an overland route".',
          },
          {
            number: 8,
            prompt: 'arrived in the Mediterranean at ____',
            type: 'text',
            answer: 'Alexandria',
            explanation: '"Their journey ended when they reached Alexandria."',
          },
          {
            number: 9,
            prompt: 'traders took it to ____ and sold it to destinations around Europe',
            type: 'text',
            answer: 'Venice',
            explanation: 'European traders "brought it back to Venice", from where it travelled to markets.',
          },
        ],
      },
      {
        id: 'c13t2-r1-g2',
        heading: 'Questions 10–13',
        instruction: 'Do the following statements agree with the information given in Reading Passage 1?',
        note:
          'In boxes 10–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
        layout: 'list',
        questions: [
          {
            number: 10,
            prompt: 'The Portuguese had control over the cinnamon trade in Ceylon throughout the 16th century.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'TRUE',
            explanation:
              'The Portuguese built a fort in 1518 and "in the late 16th century... enjoyed a tenfold profit", keeping the monopoly until 1640.',
          },
          {
            number: 11,
            prompt: 'The Dutch took over the cinnamon trade from the Portuguese as soon as they arrived in Ceylon.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'FALSE',
            explanation:
              'They arrived at the start of the 17th century but only broke the monopoly "by 1640" — not immediately.',
          },
          {
            number: 12,
            prompt: 'The trees planted by the Dutch produced larger quantities of cinnamon than the wild trees.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'NOT GIVEN',
            explanation:
              'The passage says the Dutch cultivated their own trees to replace exhausted wild ones, but never compares yields.',
          },
          {
            number: 13,
            prompt: 'The spice trade maintained its economic importance during the 19th century.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'FALSE',
            explanation:
              'By then the trade "was diminishing in economic potential" and was "superseded" by coffee, tea, chocolate and sugar.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Oxytocin',
    subtitle: "The positive and negative effects of the chemical known as the 'love hormone'",
    paragraphs: [
      {
        label: 'A',
        text:
          'Oxytocin is a chemical, a hormone produced in the pituitary gland in the brain. It was through various studies focusing on animals that scientists first became aware of the influence of oxytocin. They discovered that it helps reinforce the bonds between prairie voles, which mate for life, and triggers the motherly behaviour that sheep show towards their newborn lambs. It is also released by women in childbirth, strengthening the attachment between mother and baby. Few chemicals have as positive a reputation as oxytocin, which is sometimes referred to as the \'love hormone\'. One sniff of it, it is claimed, make a person more trusting, empathetic, generous and cooperative. It is time, however, to revise this wholly optimistic view. A new wave of studies has shown that its effects vary greatly depending on the person and the circumstances, and it can impact on our social interactions for worse as well as for better.',
      },
      {
        label: 'B',
        text:
          "Oxytocin's role in human behaviour first emerged in 2005. In a groundbreaking experiment, Markus Heinrichs and his colleagues at the University of Freiburg, Germany, asked volunteers to do an activity in which they could invest money with an anonymous person who was not guaranteed to be honest. The team found that participants who had sniffed oxytocin via a nasal spray beforehand invested more money than those who received a placebo instead. The study was the start of research into the effects of oxytocin on human interactions. 'For eight years, it was quite a lonesome field,' Heinrichs recalls. 'Now, everyone is interested.' These follow-up studies have shown that after a sniff of the hormone, people become more charitable, better at reading emotions on others' faces and at communicating constructively in arguments. Together, the results fuelled the view that oxytocin universally enhanced the positive aspects of our social nature.",
      },
      {
        label: 'C',
        text:
          'Then, after a few years, contrasting findings began to emerge. Simone Shamay-Tsoory at the University of Haifa, Israel, found that when volunteers played a competitive game, those who inhaled the hormone showed more pleasure when they beat other players, and felt more envy when others won. What\'s more, administering oxytocin also has sharply contrasting outcomes depending on a person\'s disposition. Jennifer Bartz from Mount Sinai School of Medicine, New York, found that it improves people\'s ability to read emotions, but only if they are not very socially adept to begin with. Her research also shows that oxytocin in fact reduces cooperation in subjects who are particularly anxious or sensitive to rejection.',
      },
      {
        label: 'D',
        text:
          "Another discovery is that oxytocin's effects vary depending on who we are interacting with. Studies conducted by Carolyn DeClerck of the University of Antwerp, Belgium, revealed that people who had received a dose of oxytocin actually became less cooperative when dealing with complete strangers. Meanwhile, Carsten De Dreu at the University of Amsterdam in the Netherlands discovered that volunteers given oxytocin showed favouritism: Dutch men became quicker to associate positive words with Dutch names than with foreign ones, for example. According to De Dreu, oxytocin drives people to care for those in their social circles and defend them from outside dangers. So, it appears that oxytocin strengthens biases, rather than promoting general goodwill, as was previously thought.",
      },
      {
        label: 'E',
        text:
          'There were signs of these subtleties from the start. Bartz has recently shown that in almost half of the existing research results, oxytocin influenced only certain individuals or in certain circumstances. Where once researchers took no notice of such findings, now a more nuanced understanding of oxytocin\'s effects is propelling investigations down new lines. To Bartz, the key to understanding what the hormone does lies in pinpointing its core function rather than in cataloguing its seemingly endless effects. There are several hypotheses which are not mutually exclusive. Oxytocin could help to reduce anxiety and fear. Or it could simply motivate people to seek out social connections. She believes that oxytocin acts as a chemical spotlight that shines on social clues – a shift in posture, a flicker of the eyes, a dip in the voice – making people more attuned to their social environment. This would explain why it makes us more likely to look others in the eye and improves our ability to identify emotions. But it could also make things worse for people who are overly sensitive or prone to interpreting social cues in the worst light.',
      },
      {
        label: 'F',
        text:
          "Perhaps we should not be surprised that the oxytocin story has become more perplexing. The hormone is found in everything from octopuses to sheep, and its evolutionary roots stretch back half a billion years. 'It's a very simple and ancient molecule that has been co-opted for many different functions,' says Sue Carter at the University of Illinois, Chicago, USA. 'It affects primitive parts of the brain like the amygdala, so it's going to have many effects on just about everything.' Bartz agrees. 'Oxytocin probably does some very basic things, but once you add our higher-order thinking and social situations, these basic processes could manifest in different ways depending on individual differences and context.'",
      },
    ],
    groups: [
      {
        id: 'c13t2-r2-g1',
        heading: 'Questions 14–17',
        instruction:
          'Reading Passage 2 has six paragraphs, A–F.\nWhich paragraph contains the following information?',
        note:
          'Write the correct letter, A–F, in boxes 14–17 on your answer sheet.\nNB You may use any letter more than once.',
        layout: 'compact',
        questions: [
          {
            number: 14,
            prompt: 'reference to research showing the beneficial effects of oxytocin on people',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'B',
            explanation: 'Paragraph B summarises the follow-up studies showing people "become more charitable".',
          },
          {
            number: 15,
            prompt: 'reasons why the effects of oxytocin are complex',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'F',
            explanation: 'Paragraph F explains the hormone\'s ancient, widespread role across the brain.',
          },
          {
            number: 16,
            prompt: 'mention of a period in which oxytocin attracted little scientific attention',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'B',
            explanation: '"For eight years, it was quite a lonesome field."',
          },
          {
            number: 17,
            prompt: 'reference to people ignoring certain aspects of their research data',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'E',
            explanation: '"Where once researchers took no notice of such findings".',
          },
        ],
      },
      {
        id: 'c13t2-r2-g2',
        heading: 'Questions 18–20',
        instruction:
          'Look at the following research findings (Questions 18–20) and the list of researchers below.\nMatch each research finding with the correct researcher, A–F.',
        note:
          'Write the correct letter, A–F, in boxes 18–20 on your answer sheet.',
        layout: 'compact',
        box: {
          title: 'List of Researchers',
          items: [
            { letter: 'A', text: 'Markus Heinrichs' },
            { letter: 'B', text: 'Simone Shamay-Tsoory' },
            { letter: 'C', text: 'Jennifer Bartz' },
            { letter: 'D', text: 'Carolyn DeClerck' },
            { letter: 'E', text: 'Carsten De Dreu' },
            { letter: 'F', text: 'Sue Carter' },
          ],
        },
        questions: [
          {
            number: 18,
            prompt: 'People are more trusting when affected by oxytocin.',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'A',
            explanation: 'Heinrichs\' volunteers "invested more money" with a stranger.',
          },
          {
            number: 19,
            prompt: "Oxytocin increases people's feelings of jealousy.",
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'B',
            explanation: 'Shamay-Tsoory found volunteers "felt more envy when others won".',
          },
          {
            number: 20,
            prompt: 'The effect of oxytocin varies from one type of person to another.',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'C',
            explanation: 'Bartz showed the effect depends on a person\'s disposition.',
          },
        ],
      },
      {
        id: 'c13t2-r2-g3',
        heading: 'Questions 21–26',
        instruction: 'Complete the summary below.',
        note:
          'Choose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 21–26 on your answer sheet.',
        title: 'Oxytocin research',
        layout: 'notes',
        questions: [
          {
            number: 21,
            prompt: 'The earliest findings about oxytocin and bonding came from research involving ____.',
            type: 'text',
            answer: 'animals',
            explanation: '"It was through various studies focusing on animals".',
          },
          {
            number: 22,
            prompt: 'It was also discovered that humans produce oxytocin during ____.',
            type: 'text',
            answer: 'childbirth',
            explanation: '"It is also released by women in childbirth".',
          },
          {
            number: 23,
            prompt:
              'An experiment in 2005, in which participants were given either oxytocin or a ____, reinforced the belief that the hormone had a positive effect.',
            type: 'text',
            answer: 'placebo',
            explanation: '"those who received a placebo instead".',
          },
          {
            number: 24,
            prompt:
              'A study at the University of Haifa where participants took part in a ____ revealed the negative emotions which oxytocin can trigger.',
            type: 'text',
            answer: 'game',
            explanation: '"when volunteers played a competitive game".',
          },
          {
            number: 25,
            prompt:
              "A study at the University of Antwerp showed people's lack of willingness to help ____ while under the influence of oxytocin.",
            type: 'text',
            answer: 'strangers',
            explanation: '"became less cooperative when dealing with complete strangers".',
          },
          {
            number: 26,
            prompt:
              'Meanwhile, research at the University of Amsterdam revealed that people who have been given oxytocin consider ____ that are familiar to them in their own country to have more positive associations than those from other cultures.',
            type: 'text',
            answer: 'names',
            explanation: '"quicker to associate positive words with Dutch names than with foreign ones".',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'MAKING THE MOST OF TRENDS',
    subtitle: 'Experts from Harvard Business School give advice to managers',
    paragraphs: [
      {
        label: '',
        text:
          'Most managers can identify the major trends of the day. But in the course of conducting research in a number of industries and working directly with companies, we have discovered that managers often fail to recognize the less obvious but profound ways these trends are influencing consumers\' aspirations, attitudes, and behaviors. This is especially true of trends that managers view as peripheral to their core markets.',
      },
      {
        label: '',
        text:
          'Many ignore trends in their innovation strategies or adopt a wait-and-see approach and let competitors take the lead. At a minimum, such responses mean missed profit opportunities. At the extreme, they can jeopardize a company by ceding to rivals the opportunity to transform the industry. The purpose of this article is twofold: to spur managers to think more expansively about how trends can engender new value propositions in their core markets, and to provide some high-level advice on how to make market research and product development personnel more adept at analyzing and exploiting trends.',
      },
      {
        label: '',
        text:
          'One strategy, known as \'infuse and augment\', is to design a product or service that retains most of the attributes and functions of existing products in the category but adds others that address the needs and desires unleashed by a major trend. A case in point is the Poppy range of handbags, which the firm Coach created in response to the economic downturn of 2008. The Coach brand had been a symbol of opulence and luxury for nearly 70 years, and the most obvious reaction to the downturn would have been to lower prices. However, that would have risked cheapening the brand\'s image. Instead, they initiated a consumer-research project which revealed that customers were eager to lift themselves and the country out of tough times. Using these insights, Coach launched the lower-priced Poppy handbags, which were in vibrant colors, and looked more youthful and playful than conventional Coach products. Creating the sub-brand allowed Coach to avert an across-the-board price cut. In contrast to the many companies that responded to the recession by cutting prices, Coach saw the new consumer mindset as an opportunity for innovation and renewal.',
      },
      {
        label: '',
        text:
          'A further example of this strategy was supermarket Tesco\'s response to consumers\' growing concerns about the environment. With that in mind, Tesco, one of the world\'s top five retailers, introduced its Greener Living program, which demonstrates the company\'s commitment to protecting the environment by involving consumers in ways that produce tangible results. For example, Tesco customers can accumulate points for such activities as reusing bags, recycling cans and printer cartridges, and buying home-insulation materials. Like points earned on regular purchases, these green points can be redeemed for cash. Tesco has not abandoned its traditional retail offerings but augmented its business with these innovations, thereby infusing its value proposition with a green streak.',
      },
      {
        label: '',
        text:
          'A more radical strategy is \'combine and transcend\'. This entails combining aspects of the product\'s existing value proposition with attributes addressing changes arising from a trend, to create a novel experience – one that may land the company in an entirely new market space. At first glance, spending resources to incorporate elements of a seemingly irrelevant trend into one\'s core offerings sounds like it\'s hardly worthwhile. But consider Nike\'s move to integrate the digital revolution into its reputation for high-performance athletic footwear. In 2006, they teamed up with technology company Apple to launch Nike+, a digital sports kit comprising a sensor that attaches to the running shoe and a wireless receiver that connects to the user\'s iPod. By combining Nike\'s original value proposition for amateur athletes with one for digital consumers, the Nike+ sports kit and web interface moved the company from a focus on athletic apparel to a new plane of engagement with its customers.',
      },
      {
        label: '',
        text:
          'A third approach, known as \'counteract and reaffirm\', involves developing products or services that stress the values traditionally associated with the category in ways that allow consumers to oppose – or at least temporarily escape from – the aspects of trends they view as undesirable. A product that accomplished this is the ME2, a video game created by Canada\'s iToys. By reaffirming the toy category\'s association with physical play, the ME2 counteracted some of the widely perceived negative impacts of digital gaming devices. Like other handheld games, the device featured a host of exciting interactive games, a full-color LCD screen, and advanced 3D graphics. What set it apart was that it incorporated the traditional physical component of children\'s play: it contained a pedometer, which tracked and awarded points for physical activity (walking, running, biking, skateboarding, climbing stairs). The child could use the points to enhance various virtual skills needed for the video game. The ME2, introduced in mid-2008, catered to kids\' huge desire to play video games while countering the negatives, such as associations with lack of exercise and obesity.',
      },
      {
        label: '',
        text:
          'Once you have gained perspective on how trend-related changes in consumer opinions and behaviors impact on your category, you can determine which of our three innovation strategies to pursue. When your category\'s basic value proposition continues to be meaningful for consumers influenced by the trend, the infuse-and-augment strategy will allow you to reinvigorate the category. If analysis reveals an increasing disparity between your category and consumers\' new focus, your innovations need to transcend the category to integrate the two worlds. Finally, if aspects of the category clash with undesired outcomes of a trend, such as associations with unhealthy lifestyles, there is an opportunity to counteract those changes by reaffirming the core values of your category.',
      },
      {
        label: '',
        text:
          'Trends – technological, economic, environmental, social, or political – that affect how people perceive the world around them and shape what they expect from products and services present firms with unique opportunities for growth.',
      },
    ],
    groups: [
      {
        id: 'c13t2-r3-g1',
        heading: 'Questions 27–31',
        instruction: "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–31 on your answer sheet.",
        layout: 'list',
        questions: [
          {
            number: 27,
            prompt: 'In the first paragraph, the writer says that most managers',
            type: 'mcq',
            options: [
              'fail to spot the key consumer trends of the moment.',
              'make the mistake of focusing only on the principal consumer trends.',
              'misinterpret market research data relating to current consumer trends.',
              'are unaware of the significant impact that trends have on consumers\' lives.',
            ],
            answer: 'B',
            explanation:
              'Managers identify the major trends but miss "the less obvious but profound ways" they matter.',
          },
          {
            number: 28,
            prompt: 'According to the third paragraph, Coach was anxious to',
            type: 'mcq',
            options: [
              'follow what some of its competitors were doing.',
              'maintain its prices throughout its range.',
              'safeguard its reputation as a manufacturer of luxury goods.',
              'modify the entire look of its brand to suit the economic climate.',
            ],
            answer: 'C',
            explanation:
              'Cutting prices "would have risked cheapening the brand\'s image" — so they protected it.',
          },
          {
            number: 29,
            prompt: 'What point is made about Tesco\'s Greener Living programme?',
            type: 'mcq',
            options: [
              'It did not require Tesco to modify its core business activities.',
              'It succeeded in attracting a more eco-conscious clientele.',
              'Its main aim was to raise consumers\' awareness of environmental issues.',
              'It was not the first time that Tesco had implemented such an initiative.',
            ],
            answer: 'A',
            explanation:
              'Tesco "has not abandoned its traditional retail offerings but augmented its business" — the core stayed intact.',
          },
          {
            number: 30,
            prompt: 'What does the writer suggest about Nike\'s strategy?',
            type: 'mcq',
            options: [
              'It was an extremely risky strategy at the time.',
              'It was a strategy that only a major company could afford to follow.',
              'It was the type of strategy that would not have been possible in the past.',
              'It was the kind of strategy which might appear to have few obvious benefits.',
            ],
            answer: 'D',
            explanation:
              'The writer grants it "sounds like it\'s hardly worthwhile" before showing why it worked.',
          },
          {
            number: 31,
            prompt: 'What was original about the ME2?',
            type: 'mcq',
            options: [
              'It contained technology that had been developed for the sports industry.',
              'It appealed to young people who were keen to improve their physical fitness.',
              'It took advantage of a current trend for video games with colourful 3D graphics.',
              'It was a handheld game that addressed people\'s concerns about unhealthy lifestyles.',
            ],
            answer: 'D',
            explanation:
              'It kept the fun of a handheld game while building in a pedometer and physical activity.',
          },
        ],
      },
      {
        id: 'c13t2-r3-g2',
        heading: 'Questions 32–37',
        instruction:
          'Look at the following statements (Questions 32–37) and the list of companies below.\nMatch each statement with the correct company, A, B, C or D.',
        note:
          'Write the correct letter, A, B, C or D, in boxes 32–37 on your answer sheet.\nNB You may use any letter more than once.',
        layout: 'compact',
        box: {
          title: 'List of companies',
          items: [
            { letter: 'A', text: 'Coach' },
            { letter: 'B', text: 'Tesco' },
            { letter: 'C', text: 'Nike' },
            { letter: 'D', text: 'iToys' },
          ],
        },
        questions: [
          {
            number: 32,
            prompt: 'It turned the notion that its products could have harmful effects to its own advantage.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'D',
            explanation: 'iToys countered the negatives of gaming with the physically active ME2.',
          },
          {
            number: 33,
            prompt: 'It extended its offering by collaborating with another manufacturer.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: 'Nike "teamed up with technology company Apple".',
          },
          {
            number: 34,
            prompt: 'It implemented an incentive scheme to demonstrate its corporate social responsibility.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'B',
            explanation: 'Tesco\'s green points reward environmental behaviour.',
          },
          {
            number: 35,
            prompt: 'It discovered that customers had a positive attitude towards dealing with difficult circumstances.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
            explanation: 'Coach\'s research found customers "eager to lift themselves... out of tough times".',
          },
          {
            number: 36,
            prompt: 'It responded to a growing lifestyle trend in an unrelated product sector.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: 'Nike brought the digital revolution into footwear.',
          },
          {
            number: 37,
            prompt: 'It successfully avoided having to charge its customers less for its core products.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
            explanation: 'Coach created a sub-brand, averting "an across-the-board price cut".',
          },
        ],
      },
      {
        id: 'c13t2-r3-g3',
        heading: 'Questions 38–40',
        instruction:
          'Complete each sentence with the correct ending, A, B, C or D below.\nWrite the correct letter, A, B, C or D, in boxes 38–40 on your answer sheet.',
        layout: 'compact',
        box: {
          title: 'Endings',
          items: [
            { letter: 'A', text: 'employ a combination of strategies to maintain your consumer base.' },
            { letter: 'B', text: 'identify the most appropriate innovation strategy to use.' },
            { letter: 'C', text: 'emphasise your brand\'s traditional values with the counteract-and-affirm strategy.' },
            { letter: 'D', text: 'use the combine-and-transcend strategy to integrate the two worlds.' },
          ],
        },
        questions: [
          {
            number: 38,
            prompt: 'If there are any trend-related changes impacting on your category, you should',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'B',
            explanation: '"you can determine which of our three innovation strategies to pursue".',
          },
          {
            number: 39,
            prompt: 'If a current trend highlights a negative aspect of your category, you should',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation:
              '"there is an opportunity to counteract those changes by reaffirming the core values of your category".',
          },
          {
            number: 40,
            prompt: 'If the consumers\' new focus has an increasing lack of connection with your offering, you should',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'D',
            explanation: '"your innovations need to transcend the category to integrate the two worlds".',
          },
        ],
      },
    ],
  },
];
