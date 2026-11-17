import type { CambridgePassage, CambridgeSection } from './types';

/* ================================================================== */
/* LISTENING — Cambridge IELTS 13, Test 3                             */
/* ================================================================== */

/**
 * Transcribed from the owner's copy of the book (printed pages 54–59).
 * Recordings stay in the owner's Google Drive and are streamed from there.
 */
export const C13_T3_LISTENING: CambridgeSection[] = [
  {
    id: 1,
    heading: 'Section 1',
    title: 'Moving to Banford City',
    intro: 'A conversation about moving to a suburb of a city.',
    audio: {
      driveId: '1BTog2rkYz77vfvC_tVkMqUDohJEzyVad',
      filename: 'IELTS13-Tests 3, Section 1.mp3',
      bytes: 6581260,
    },
    groups: [
      {
        id: 'c13t3-l1-g1',
        heading: 'Questions 1–10',
        instruction: 'Complete the notes below.',
        note: 'Write ONE WORD AND/OR A NUMBER for each answer.',
        title: 'Moving to Banford City',
        layout: 'notes',
        sections: [
          {
            heading: 'Example\nLinda recommends living in suburb of: Dalton',
            lines: [],
          },
          {
            heading: 'Accommodation',
            lines: ['Average rent: {{1}} £ ____ a month'],
          },
          {
            heading: 'Transport',
            lines: [
              'Linda travels to work by {{2}}',
              'Limited {{3}} in city centre',
              'Trains to London every {{4}} minutes',
              'Poor train service at {{5}}',
            ],
          },
          {
            heading: 'Advantages of living in Banford',
            lines: [
              'New {{6}} opened recently',
              '{{7}} has excellent reputation',
              'Good {{8}} on Bridge Street',
            ],
          },
          {
            heading: 'Meet Linda',
            lines: [
              'Meet Linda on {{9}} after 5.30 pm',
              'In the {{10}} opposite the station',
            ],
          },
        ],
        questions: [
          {
            number: 1,
            prompt: 'Average rent: £ ____ a month',
            type: 'text',
            answer: '850',
            explanation: 'The average rent is £850 a month.',
          },
          {
            number: 2,
            prompt: 'Linda travels to work by ____',
            type: 'text',
            answer: 'bike|bicycle',
            explanation: 'Linda cycles to work, so she travels by bike.',
          },
          {
            number: 3,
            prompt: 'Limited ____ in city centre',
            type: 'text',
            answer: 'parking',
            explanation: 'Parking in the city centre is limited.',
          },
          {
            number: 4,
            prompt: 'Trains to London every ____ minutes',
            type: 'text',
            answer: '30|thirty',
            explanation: 'There is a train to London every 30 minutes.',
          },
          {
            number: 5,
            prompt: 'Poor train service at ____',
            type: 'text',
            answer: 'weekend|weekends',
            explanation: 'The train service is poor at weekends.',
          },
          {
            number: 6,
            prompt: 'New ____ opened recently',
            type: 'text',
            answer: 'cinema',
            explanation: 'A new cinema has opened recently.',
          },
          {
            number: 7,
            prompt: '____ has excellent reputation',
            type: 'text',
            answer: 'hospital',
            explanation: 'The local hospital has an excellent reputation.',
          },
          {
            number: 8,
            prompt: 'Good ____ on Bridge Street',
            type: 'text',
            answer: 'dentist',
            explanation: 'There is a good dentist on Bridge Street.',
          },
          {
            number: 9,
            prompt: 'Meet Linda on ____ after 5.30 pm',
            type: 'text',
            answer: 'Thursday',
            explanation: 'They arrange to meet on Thursday.',
          },
          {
            number: 10,
            prompt: 'In the ____ opposite the station',
            type: 'text',
            answer: 'cafe|café',
            explanation: 'They will meet in the cafe opposite the station.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    heading: 'Section 2',
    title: 'Advantages of physical activities',
    intro: 'A talk about taking up different kinds of exercise.',
    audio: {
      driveId: '1OEB78Yd097whK3LjbYhBrPauDGTGrmph',
      filename: 'IELTS13-Test 3, Section 2.mp3',
      bytes: 4570861,
    },
    groups: [
      {
        id: 'c13t3-l2-g1',
        heading: 'Questions 11–16',
        instruction:
          'What advantage does the speaker mention for each of the following physical activities?',
        note:
          'Choose SIX answers from the box and write the correct letter, A–G, next to Questions 11–16.',
        title: 'Physical activities',
        layout: 'compact',
        box: {
          title: 'Advantages',
          items: [
            { letter: 'A', text: 'not dependent on season' },
            { letter: 'B', text: 'enjoyable' },
            { letter: 'C', text: 'low risk of injury' },
            { letter: 'D', text: 'fitness level unimportant' },
            { letter: 'E', text: 'sociable' },
            { letter: 'F', text: 'fast results' },
            { letter: 'G', text: 'motivating' },
          ],
        },
        questions: [
          {
            number: 11,
            prompt: 'using a gym',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'F',
            explanation: 'The speaker says the gym gives fast results.',
          },
          {
            number: 12,
            prompt: 'running',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'D',
            explanation: 'Running suits any fitness level.',
          },
          {
            number: 13,
            prompt: 'swimming',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'A',
            explanation: 'Swimming can be done whatever the season.',
          },
          {
            number: 14,
            prompt: 'cycling',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'B',
            explanation: 'Cycling is described as enjoyable.',
          },
          {
            number: 15,
            prompt: 'doing yoga',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'C',
            explanation: 'Yoga carries a low risk of injury.',
          },
          {
            number: 16,
            prompt: 'training with a personal trainer',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 'G',
            explanation: 'A personal trainer keeps you motivated.',
          },
        ],
      },
      {
        id: 'c13t3-l2-g2',
        heading: 'Questions 17 and 18',
        instruction: 'Choose TWO letters, A–E.',
        note: 'Both correct letters are needed for the two marks.',
        layout: 'chooseTwo',
        box: {
          title: 'Options',
          items: [
            { letter: 'A', text: 'lack of time' },
            { letter: 'B', text: 'loss of confidence' },
            { letter: 'C', text: 'too much effort required' },
            { letter: 'D', text: 'high costs' },
            { letter: 'E', text: 'feeling less successful than others' },
          ],
        },
        pairs: [
          {
            heading: 'Questions 17 and 18',
            prompt: 'For which TWO reasons does the speaker say people give up going to the gym?',
            answers: [17, 18],
          },
        ],
        questions: [
          {
            number: 17,
            prompt: 'reason people give up going to the gym',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'B',
          },
          {
            number: 18,
            prompt: 'reason people give up going to the gym',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'C',
          },
        ],
      },
      {
        id: 'c13t3-l2-g3',
        heading: 'Questions 19 and 20',
        instruction: 'Choose TWO letters, A–E.',
        note: 'Both correct letters are needed for the two marks.',
        layout: 'chooseTwo',
        box: {
          title: 'Options',
          items: [
            { letter: 'A', text: 'write goals down' },
            { letter: 'B', text: 'have achievable aims' },
            { letter: 'C', text: 'set a time limit' },
            { letter: 'D', text: 'give yourself rewards' },
            { letter: 'E', text: 'challenge yourself' },
          ],
        },
        pairs: [
          {
            heading: 'Questions 19 and 20',
            prompt: 'Which TWO pieces of advice does the speaker give for setting goals?',
            answers: [19, 20],
          },
        ],
        questions: [
          {
            number: 19,
            prompt: 'advice for setting goals',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E'],
            answer: 'B',
          },
          {
            number: 20,
            prompt: 'advice for setting goals',
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
    title: 'Project on using natural dyes to colour fabrics',
    intro: 'A student discusses his project with his tutor.',
    audio: {
      driveId: '1GEBm8h2XvHA1JDwN0mwUIEosVX_MfHkl',
      filename: 'IELTS13-Test 3, Section 3.mp3',
      bytes: 4776502,
    },
    groups: [
      {
        id: 'c13t3-l3-g1',
        heading: 'Questions 21–24',
        instruction: 'Choose the correct letter, A, B or C.',
        title: 'Project on using natural dyes to colour fabrics',
        layout: 'list',
        questions: [
          {
            number: 21,
            prompt: 'What first inspired Jim to choose this project?',
            type: 'mcq',
            options: [
              'textiles displayed in an exhibition',
              'a book about a botanic garden',
              'carpets he saw on holiday',
            ],
            answer: 'C',
            explanation: 'Jim first had the idea after seeing carpets on holiday.',
          },
          {
            number: 22,
            prompt: 'Jim eventually decided to do a practical investigation which involved',
            type: 'mcq',
            options: [
              'using a range of dyes with different fibres.',
              'applying different dyes to one type of fibre.',
              'testing one dye and a range of fibres.',
            ],
            answer: 'A',
            explanation: 'He tested a range of dyes across different fibres.',
          },
          {
            number: 23,
            prompt: 'When doing his experiments, Jim was surprised by',
            type: 'mcq',
            options: [
              'how much natural material was needed to make the dye.',
              'the fact that dyes were widely available on the internet.',
              'the time that he had to leave the fabric in the dye.',
            ],
            answer: 'A',
            explanation: 'He was surprised by the quantity of raw material each dye needed.',
          },
          {
            number: 24,
            prompt: 'What problem did Jim have with using tartrazine as a fabric dye?',
            type: 'mcq',
            options: [
              'It caused a slight allergic reaction.',
              'It was not a permanent dye on cotton.',
              'It was ineffective when used on nylon.',
            ],
            answer: 'B',
            explanation: 'Tartrazine did not stay permanently on cotton.',
          },
        ],
      },
      {
        id: 'c13t3-l3-g2',
        heading: 'Questions 25–30',
        instruction: 'What problem is identified with each of the following natural dyes?',
        note:
          'Choose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.',
        title: 'Natural dyes',
        layout: 'compact',
        box: {
          title: 'Problems',
          items: [
            { letter: 'A', text: 'It is expensive.' },
            { letter: 'B', text: 'The colour is too strong.' },
            { letter: 'C', text: 'The colour is not long-lasting.' },
            { letter: 'D', text: 'It is very poisonous.' },
            { letter: 'E', text: 'It can damage the fabric.' },
            { letter: 'F', text: 'The colour may be unexpected.' },
            { letter: 'G', text: 'It is unsuitable for some fabrics.' },
            { letter: 'H', text: 'It is not generally available.' },
          ],
        },
        questions: [
          {
            number: 25,
            prompt: 'turmeric',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'C',
            explanation: 'Turmeric fades, so the colour is not long-lasting.',
          },
          {
            number: 26,
            prompt: 'beetroot',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'F',
            explanation: 'Beetroot gives a colour people do not expect.',
          },
          {
            number: 27,
            prompt: 'Tyrian purple',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'H',
            explanation: 'Tyrian purple is not generally available.',
          },
          {
            number: 28,
            prompt: 'logwood',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'D',
            explanation: 'Logwood is very poisonous.',
          },
          {
            number: 29,
            prompt: 'cochineal',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'A',
            explanation: 'Cochineal is expensive.',
          },
          {
            number: 30,
            prompt: 'metal oxide',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'E',
            explanation: 'Metal oxide can damage the fabric.',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    heading: 'Section 4',
    title: 'The sleepy lizard (tiliqua rugosa)',
    intro: 'A lecture about a lizard found in Australia.',
    audio: {
      driveId: '1PqcpfjY1aBLw8MNQ0tbvbibRxSHYO3ee',
      filename: 'IELTS13-Tests 3, Section 4.mp3',
      bytes: 4789022,
    },
    groups: [
      {
        id: 'c13t3-l4-g1',
        heading: 'Questions 31–40',
        instruction: 'Complete the notes below.',
        note: 'Write ONE WORD ONLY for each answer.',
        title: 'The sleepy lizard (tiliqua rugosa)',
        layout: 'notes',
        sections: [
          {
            heading: 'Description',
            lines: [
              'They are common in Western and South Australia',
              'They are brown, but recognisable by their blue {{31}}',
              'They are relatively large',
              'Their diet consists mainly of {{32}}',
              'Their main predators are large birds and {{33}}',
            ],
          },
          {
            heading: 'Navigation study',
            lines: [
              'One study found that lizards can use the {{34}} to help them navigate',
            ],
          },
          {
            heading: 'Observations in the wild',
            lines: [
              'Observations show that these lizards keep the same {{35}} for several years',
            ],
          },
          {
            heading: 'What people want',
            lines: [
              'Possible reasons:',
              'to improve the survival of their young (but little {{36}} has been noted between parents and children)',
              'to provide {{37}} for female lizards',
            ],
          },
          {
            heading: 'Tracking study',
            lines: [
              'A study was carried out using GPS systems attached to the {{38}} of the lizards',
              "This provided information on the lizards' location and even the number of {{39}} taken",
              'It appeared that the lizards were trying to avoid one another',
              'This may be in order to reduce chances of {{40}}',
            ],
          },
        ],
        questions: [
          {
            number: 31,
            prompt: 'recognisable by their blue ____',
            type: 'text',
            answer: 'tongue|tongues',
            explanation: 'The sleepy lizard is known for its blue tongue.',
          },
          {
            number: 32,
            prompt: 'Their diet consists mainly of ____',
            type: 'text',
            answer: 'plants',
            explanation: 'They feed mainly on plants.',
          },
          {
            number: 33,
            prompt: 'Their main predators are large birds and ____',
            type: 'text',
            answer: 'snakes',
            explanation: 'Large birds and snakes are the main predators.',
          },
          {
            number: 34,
            prompt: 'lizards can use the ____ to help them navigate',
            type: 'text',
            answer: 'sky',
            explanation: 'They navigate by using the sky.',
          },
          {
            number: 35,
            prompt: 'these lizards keep the same ____ for several years',
            type: 'text',
            answer: 'partner|partners',
            explanation: 'They stay with the same partner for years.',
          },
          {
            number: 36,
            prompt: 'little ____ has been noted between parents and children',
            type: 'text',
            answer: 'contact',
            explanation: 'There is little contact between parents and their young.',
          },
          {
            number: 37,
            prompt: 'to provide ____ for female lizards',
            type: 'text',
            answer: 'protection',
            explanation: 'The male may provide protection for the female.',
          },
          {
            number: 38,
            prompt: 'GPS systems attached to the ____ of the lizards',
            type: 'text',
            answer: 'tail|tails',
            explanation: 'The GPS units were fixed to their tails.',
          },
          {
            number: 39,
            prompt: 'the number of ____ taken',
            type: 'text',
            answer: 'steps',
            explanation: 'The trackers also recorded the number of steps taken.',
          },
          {
            number: 40,
            prompt: 'This may be in order to reduce chances of ____',
            type: 'text',
            answer: 'injury|injuries',
            explanation: 'Avoiding one another reduces the chance of injury.',
          },
        ],
      },
    ],
  },
];

/* ================================================================== */
/* READING — Cambridge IELTS 13, Test 3  (Academic)                   */
/* ================================================================== */

export const C13_T3_READING: CambridgePassage[] = [
  {
    id: 1,
    title: 'The coconut palm',
    subtitle: 'For millennia, the coconut has been central to the lives of many peoples',
    paragraphs: [
      {
        label: '',
        text:
          "For millennia, the coconut has been central to the lives of Polynesian and Asian peoples. In the western world, on the other hand, coconuts have always been exotic and unusual, sometimes rare. The Italian merchant traveller Marco Polo apparently saw coconuts in South Asia in the late 13th century, and among the mid-14th-century travel writings of Sir John Mandeville there is mention of 'great Notes of Ynde' (great Nuts of India). Today, images of palm-fringed tropical beaches are cliches in the west to sell holidays, chocolate bars, fizzy drinks and even romance.",
      },
      {
        label: '',
        text:
          'Typically, we envisage coconuts as brown cannonballs that, when opened, provide sweet white flesh. But we see only part of the fruit and none of the plant from which they come. The coconut palm has a smooth, slender, grey trunk, up to 30 metres tall. This is an important source of timber for building houses, and is increasingly being used as a replacement for endangered hardwoods in the furniture construction industry. The trunk is surmounted by a rosette of leaves, each of which may be up to six metres long. The leaves have hard veins in their centres which, in many parts of the world, are used as brushes after the green part of the leaf has been stripped away. Immature coconut flowers are tightly clustered together among the leaves at the top of the trunk. The flower stems may be tapped for their sap to produce a drink, and the sap can also be reduced by boiling to produce a type of sugar used for cooking.',
      },
      {
        label: '',
        text:
          "Coconut palms produce as many as seventy fruits per year, weighing more than a kilogram each. The wall of the fruit has three layers: a waterproof outer layer, a fibrous middle layer and a hard, inner layer. The thick fibrous middle layer produces coconut fibre, 'coir', which has numerous uses and is particularly important in manufacturing ropes. The woody innermost layer, the shell, with its three prominent 'eyes', surrounds the seed. An important product obtained from the shell is charcoal, which is widely used in various industries as well as in the home as a cooking fuel. When broken in half, the shells are also used as bowls in many parts of Asia.",
      },
      {
        label: '',
        text:
          "Inside the shell are the nutrients (endosperm) needed by the developing seed. Initially, the endosperm is a sweetish liquid, coconut water, which is enjoyed as a drink, but also provides the hormones which encourage other plants to grow more rapidly and produce higher yields. As the fruit matures, the coconut water gradually solidifies to form the brilliant white, fat-rich, edible flesh or meat. Dried coconut flesh, 'copra', is made into coconut oil and coconut milk, which are widely used in cooking in different parts of the world, as well as in cosmetics. A derivative of coconut fat, glycerine, acquired strategic importance in a quite different sphere, as Alfred Nobel introduced the world to his nitroglycerine-based invention: dynamite.",
      },
      {
        label: '',
        text:
          'Their biology would appear to make coconuts the great maritime voyagers and coastal colonizers of the plant world. The large, energy-rich fruits are able to float in water and tolerate salt, but cannot remain viable indefinitely; studies suggest after about 110 days at sea they are no longer able to germinate. Literally cast onto desert island shores, with little more than sand to grow in and exposed to the full glare of the tropical sun, coconut seeds are able to germinate and root. The air pocket in the seed, created as the endosperm solidifies, protects the embryo. In addition, the fibrous fruit wall that helped it to float during the voyage stores moisture that can be taken up by the roots of the coconut seedling as it starts to grow.',
      },
      {
        label: '',
        text:
          'There have been centuries of academic debate over the origins of the coconut. There were no coconut palms in West Africa, the Caribbean or the east coast of the Americas before the voyages of the European explorers Vasco da Gama and Columbus in the late 15th and early 16th centuries. 16th century trade and human migration patterns reveal that Arab traders and European sailors are likely to have moved coconuts from South and Southeast Asia to Africa and then across the Atlantic to the east coast of America. But the origin of coconuts discovered along the west coast of America by 16th century sailors has been the subject of centuries of discussion. Two diametrically opposed origins have been proposed: that they came from Asia, or that they were native to America. Both suggestions have problems. In Asia, there is a large degree of coconut diversity and evidence of millennia of human use – but there are no relatives growing in the wild. In America, there are close coconut relatives, but no evidence that coconuts are indigenous. These problems have led to the intriguing suggestion that coconuts originated on coral islands in the Pacific and were dispersed from there.',
      },
    ],
    groups: [
      {
        id: 'c13t3-r1-g1',
        heading: 'Questions 1–8',
        instruction: 'Complete the table below.',
        note:
          'Choose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–8 on your answer sheet.',
        title: 'The coconut palm',
        layout: 'table',
        table: {
          columns: ['Part', 'Description', 'Uses'],
          rows: [
            { cells: [{ text: '*trunk*' }, { text: 'up to 30 metres' }, { text: 'timber for houses and the making of {{1}}' }] },
            { cells: [{ text: '*leaves*' }, { text: 'up to 6 metres long' }, { text: 'to make brushes' }] },
            { cells: [{ text: '*flowers*' }, { text: 'at the top of the trunk' }, { text: 'stems provide sap, used as a drink or a source of {{2}}' }] },
            { cells: [{ text: '*fruits*' }, { text: 'outer layer' }, { text: '' }] },
            { cells: [{ text: '' }, { text: 'middle layer (coir fibres)' }, { text: 'used for {{3}}, etc.' }] },
            { cells: [{ text: '' }, { text: 'inner layer (shell)' }, { text: 'a source of {{4}}' }] },
            { cells: [{ text: '' }, { text: '(when halved)' }, { text: 'for {{5}}' }] },
            { cells: [{ text: '*coconut water*' }, { text: 'a drink' }, { text: 'a source of {{6}} for other plants' }] },
            { cells: [{ text: '*coconut flesh*' }, { text: '' }, { text: 'oil and milk for cooking and {{7}}' }] },
            { cells: [{ text: '' }, { text: 'glycerine (an ingredient in {{8}})' }, { text: '' }] },
          ],
        },
        questions: [
          { number: 1, prompt: 'timber for houses and the making of ____', type: 'text', answer: 'furniture', explanation: 'The trunk is used "in the furniture construction industry".' },
          { number: 2, prompt: 'stems provide sap, used as a drink or a source of ____', type: 'text', answer: 'sugar', explanation: 'The sap is boiled "to produce a type of sugar used for cooking".' },
          { number: 3, prompt: 'middle layer (coir fibres) used for ____, etc.', type: 'text', answer: 'ropes', explanation: 'Coir is "particularly important in manufacturing ropes".' },
          { number: 4, prompt: 'inner layer (shell) a source of ____', type: 'text', answer: 'charcoal', explanation: '"An important product obtained from the shell is charcoal".' },
          { number: 5, prompt: '(when halved) for ____', type: 'text', answer: 'bowls', explanation: '"the shells are also used as bowls in many parts of Asia".' },
          { number: 6, prompt: 'coconut water a source of ____ for other plants', type: 'text', answer: 'hormones', explanation: 'Coconut water "provides the hormones which encourage other plants to grow".' },
          { number: 7, prompt: 'oil and milk for cooking and ____', type: 'text', answer: 'cosmetics', explanation: 'Coconut oil and milk are used in cooking "as well as in cosmetics".' },
          { number: 8, prompt: 'glycerine (an ingredient in ____)', type: 'text', answer: 'dynamite', explanation: "Glycerine led to Nobel's nitroglycerine-based invention, dynamite." },
        ],
      },
      {
        id: 'c13t3-r1-g2',
        heading: 'Questions 9–13',
        instruction: 'Do the following statements agree with the information given in Reading Passage 1?',
        note:
          'In boxes 9–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
        layout: 'list',
        questions: [
          {
            number: 9,
            prompt: 'Coconut seeds need shade in order to germinate.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'FALSE',
            explanation: 'Seeds germinate "exposed to the full glare of the tropical sun", so they do not need shade.',
          },
          {
            number: 10,
            prompt: 'Coconuts were probably transported to Asia from America in the 16th century.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'FALSE',
            explanation: 'The passage describes movement from Asia to Africa and then America — the opposite direction.',
          },
          {
            number: 11,
            prompt: 'Coconuts found on the west coast of America were a different type from those found on the east coast.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'NOT GIVEN',
            explanation: 'Both coasts are mentioned, but their coconuts are never compared.',
          },
          {
            number: 12,
            prompt: 'All the coconuts found in Asia are cultivated varieties.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'TRUE',
            explanation: 'In Asia "there are no relatives growing in the wild" — only cultivated varieties exist.',
          },
          {
            number: 13,
            prompt: 'Coconuts are cultivated in different ways in America and the Pacific.',
            type: 'select',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            answer: 'NOT GIVEN',
            explanation: 'Cultivation methods in the two regions are never compared.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'How baby talk gives infant brains a boost',
    subtitle: 'Why the way we speak to babies matters more than it seems',
    paragraphs: [
      {
        label: 'A',
        text:
          "The typical way of talking to a baby – high-pitched, exaggerated and repetitious – is a source of fascination for linguists who hope to understand how 'baby talk' impacts on learning. Most babies start developing their hearing while still in the womb, prompting some hopeful parents to play classical music to their pregnant bellies. Some research even suggests that infants are listening to adult speech as early as 10 weeks before being born, gathering the basic building blocks of their family's native tongue.",
      },
      {
        label: 'B',
        text:
          "Early language exposure seems to have benefits to the brain – for instance, studies suggest that babies raised in bilingual homes are better at learning how to mentally prioritize information. So how does the sweet if sometimes absurd sound of infant-directed speech influence a baby's development? Here are some recent studies that explore the science behind baby talk.",
      },
      {
        label: 'C',
        text:
          "Fathers don't use baby talk as often or in the same ways as mothers – and that's perfectly OK, according to a new study. Mark VanDam of Washington State University at Spokane and colleagues equipped parents with recording devices and speech-recognition software to study the way they interacted with their youngsters during a normal day. 'We found that moms do exactly what you'd expect and what's been described many times over,' VanDam explains. 'But we found that dads aren't doing the same thing. Dads didn't raise their pitch or fundamental frequency when they talked to kids.' Their role may be rooted in what is called the bridge hypothesis, which dates back to 1975. It suggests that fathers use less familial language to provide their children with a bridge to the kind of speech they'll hear in public. 'The idea is that a kid gets to practice a certain kind of speech with mom and another kind of speech with dad, so the kid then has a wider repertoire of kinds of speech to practice,' says VanDam.",
      },
      {
        label: 'D',
        text:
          "Scientists from the University of Washington and the University of Connecticut collected thousands of 30-second conversations between parents and their babies, fitting 26 children with audio-recording vests that captured language and sound during a typical eight-hour day. The study found that the more baby talk parents used, the more their youngsters began to babble. And when researchers saw the same babies at age two, they found that frequent baby talk had dramatically boosted vocabulary, regardless of socioeconomic status. 'Those children who listened to a lot of baby talk were talking more than the babies that listened to more adult talk or standard speech,' says Nairan Ramirez-Esparza of the University of Connecticut. 'We also found that it really matters whether you use baby talk in a one-on-one context,' she adds. 'The more parents use baby talk one-on-one, the more babies babble, and the more they babble, the more words they produce later in life.'",
      },
      {
        label: 'E',
        text:
          "Another study suggests that parents might want to pair their youngsters up so they can babble more with their own kind. Researchers from McGill University and Universite du Quebec a Montreal found that babies seem to like listening to each other rather than to adults – which may be why baby talk is such a universal tool among parents. They played repeating vowel sounds made by a special synthesizing device that mimicked sounds made by either an adult woman or another baby. This way, only the impact of the auditory cues was observed. The team then measured how long each type of sound held the infants' attention. They found that the 'infant' sounds held babies' attention nearly 40 percent longer. The baby noises also induced more reactions in the listening infants, like smiling or lip moving, which approximates sound making. The team theorizes that this attraction to other infant sounds could help launch the learning process that leads to speech.",
      },
      {
        label: 'F',
        text:
          "In a study published in Proceedings of the National Academy of Sciences, a total of 57 babies from two slightly different age groups – seven months and eleven and a half months – were played a number of syllables from both their native language (English) and a non-native tongue (Spanish). The infants were placed in a brain-activation scanner that recorded activity in a brain region known to guide the motor movements that produce speech. The results suggest that listening to baby talk prompts infant brains to start practicing their language skills. 'Finding activation in motor areas of the brain when infants are simply listening is significant, because it means the baby brain is engaged in trying to talk back right from the start,' says co-author Patricia Kuhl. Another interesting finding was that while the seven-month-olds responded to all speech sounds regardless of language, the brains of the older infants worked harder at the motor activations of non-native sounds compared to native sounds.",
      },
    ],
    groups: [
      {
        id: 'c13t3-r2-g1',
        heading: 'Questions 14–17',
        instruction:
          'Look at the following ideas (Questions 14–17) and the list of researchers below.\nMatch each idea with the correct researcher, A, B or C.',
        note:
          'Write the correct letter, A, B or C, in boxes 14–17 on your answer sheet.\nNB You may use any letter more than once.',
        layout: 'compact',
        box: {
          title: 'List of Researchers',
          items: [
            { letter: 'A', text: 'Mark VanDam' },
            { letter: 'B', text: 'Nairan Ramirez-Esparza' },
            { letter: 'C', text: 'Patricia Kuhl' },
          ],
        },
        questions: [
          {
            number: 14,
            prompt: 'the importance of adults giving babies individual attention when talking to them',
            type: 'select',
            options: ['A', 'B', 'C'],
            answer: 'B',
            explanation: 'Ramirez-Esparza stresses "whether you use baby talk in a one-on-one context".',
          },
          {
            number: 15,
            prompt: 'the connection between what babies hear and their own efforts to create speech',
            type: 'select',
            options: ['A', 'B', 'C'],
            answer: 'C',
            explanation: 'Kuhl found motor-area activation — the baby brain "trying to talk back".',
          },
          {
            number: 16,
            prompt: 'the advantage for the baby of having two parents each speaking in a different way',
            type: 'select',
            options: ['A', 'B', 'C'],
            answer: 'A',
            explanation: 'VanDam describes the bridge hypothesis and a "wider repertoire".',
          },
          {
            number: 17,
            prompt: 'the connection between the amount of baby talk babies hear and how much vocalising they do themselves',
            type: 'select',
            options: ['A', 'B', 'C'],
            answer: 'B',
            explanation: 'Ramirez-Esparza: "The more parents use baby talk one-on-one, the more babies babble".',
          },
        ],
      },
      {
        id: 'c13t3-r2-g2',
        heading: 'Questions 18–23',
        instruction: 'Complete the summary below.',
        note:
          'Choose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 18–23 on your answer sheet.',
        title: 'Research into how parents talk to babies',
        layout: 'notes',
        questions: [
          {
            number: 18,
            prompt:
              'Researchers at Washington State University used ____, together with specialised computer programs, to analyse how parents interacted with their babies during a normal day.',
            type: 'text',
            answer: 'recording devices',
            explanation: 'Parents were "equipped with recording devices and speech-recognition software".',
          },
          {
            number: 19,
            prompt:
              'The study revealed that ____ tended not to modify their ordinary speech patterns when interacting with their babies.',
            type: 'text',
            answer: 'fathers|dads',
            explanation: '"Dads didn\'t raise their pitch or fundamental frequency."',
          },
          {
            number: 20,
            prompt:
              'According to an idea known as the ____, they may use a more adult type of speech to prepare infants for the language they will hear outside the family home.',
            type: 'text',
            answer: 'bridge hypothesis',
            explanation: 'The passage names "the bridge hypothesis".',
          },
          {
            number: 21,
            prompt:
              "According to the researchers, hearing baby talk from one parent and 'normal' language from the other expands the baby's ____ of types of speech which they can practise.",
            type: 'text',
            answer: 'repertoire',
            explanation: '"a wider repertoire of kinds of speech to practice".',
          },
          {
            number: 22,
            prompt:
              'Meanwhile, another study carried out by scientists from the University of Washington and the University of Connecticut recorded speech and sound using special ____ that the babies were equipped with.',
            type: 'text',
            answer: 'audio-recording vests|vests',
            explanation: 'Children were "fitted with audio-recording vests".',
          },
          {
            number: 23,
            prompt:
              'When they studied the babies again at age two, they found that those who had heard a lot of baby talk in infancy had a much larger ____ than those who had not.',
            type: 'text',
            answer: 'vocabulary',
            explanation: 'Frequent baby talk "had dramatically boosted vocabulary".',
          },
        ],
      },
      {
        id: 'c13t3-r2-g3',
        heading: 'Questions 24–26',
        instruction:
          'Reading Passage 2 has six paragraphs, A–F.\nWhich paragraph contains the following information?',
        note: 'Write the correct letter, A–F, in boxes 24–26 on your answer sheet.',
        layout: 'compact',
        questions: [
          {
            number: 24,
            prompt: "a reference to a change which occurs in babies' brain activity before the end of their first year",
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'F',
            explanation: 'Kuhl compared seven-month-olds with eleven-and-a-half-month-olds.',
          },
          {
            number: 25,
            prompt: "an example of what some parents do for their baby's benefit before birth",
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'A',
            explanation: 'Some parents "play classical music to their pregnant bellies".',
          },
          {
            number: 26,
            prompt: "a mention of babies' preference for the sounds that other babies make",
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 'E',
            explanation: '"babies seem to like listening to each other rather than to adults".',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Whatever happened to the Harappan Civilisation?',
    subtitle: 'New research sheds light on the disappearance of an ancient society',
    paragraphs: [
      {
        label: 'A',
        text:
          "The Harappan Civilisation of ancient Pakistan and India flourished 5,000 years ago, but a thousand years later their cities were abandoned. The Harappan Civilisation was a sophisticated Bronze Age society who built 'megacities' and traded internationally in luxury craft products, and yet seemed to have left almost no depictions of themselves. But their lack of self-imagery – at a time when the Egyptians were carving and painting representations of themselves all over their temples – is only part of the mystery.",
      },
      {
        label: 'B',
        text:
          "'There is plenty of archaeological evidence to tell us about the rise of the Harappan Civilisation, but relatively little about its fall,' explains archaeologist Dr Cameron Petrie of the University of Cambridge. 'As populations increased, cities were built that had great baths, craft workshops, palaces and halls laid out in distinct sectors. Houses were arranged in blocks, with wide main streets and narrow alleyways, and many had their own wells and drainage systems. It was very much a \"thriving\" civilisation.' Then around 2100 BC, a transformation began. Streets went uncleaned, buildings started to be abandoned, and ritual structures fell out of use. After their final demise, a millennium passed before really large-scale cities appeared once more in South Asia.",
      },
      {
        label: 'C',
        text:
          "Some have claimed that major glacier-fed rivers changed their course, dramatically affecting the water supply and agriculture; or that the cities could not cope with an increasing population, they exhausted their resource base, the trading economy broke down or they succumbed to invasion and conflict; and yet others that climate change caused an environmental change that affected food and water provision. 'It is unlikely that there was a single cause for the decline of the civilisation. But the fact is, until now, we have had little solid evidence from the area for most of the key elements,' said Petrie. 'A lot of the archaeological debate has really only been well-argued speculation.'",
      },
      {
        label: 'D',
        text:
          'A research team led by Petrie, together with Dr Ravindanath Singh of Banaras Hindu University in India, found early in their investigations that many of the archaeological sites were not where they were supposed to be, completely altering understanding of the way that this region was inhabited in the past. When they carried out a survey of how the larger area was settled in relation to sources of water, they found inaccuracies in the published geographic locations of ancient settlements ranging from several hundred metres to many kilometres. They realised that any attempts to use the existing data were likely to be fundamentally flawed. Over the course of several seasons of fieldwork they carried out new surveys, finding an astonishing 198 settlement sites that were previously unknown.',
      },
      {
        label: 'E',
        text:
          "Now, research published by Dr Varna Dixit and Professor David Hodell, both from Cambridge's Department of Earth Sciences, has provided the first definitive evidence for climate change affecting the plains of north-western India, where hundreds of Harappan sites are known to have been situated. The researchers gathered shells of Melanoides tuberculata snails from the sediments of an ancient lake and used geochemical analysis as a means of tracing the climate history of the region. 'As today, the major source of water into the lake is likely to have been the summer monsoon,' says Dixit. 'But we have observed that there was an abrupt change about 4,100 years ago, when the amount of evaporation from the lake exceeded the rainfall – indicative of a drought.' Hodell adds: 'We estimate that the weakening of the Indian summer monsoon climate lasted about 200 years before recovering to the previous conditions, which we still see today.'",
      },
      {
        label: 'F',
        text:
          "It has long been thought that other great Bronze Age civilisations also declined at a similar time, with a global-scale climate event being seen as the cause. While it is possible that these local-scale processes were linked, the real archaeological interest lies in understanding the impact of these larger-scale events on different environments and different populations. 'Considering the vast area of the Harappan Civilisation with its variable weather systems,' explains Singh, 'it is essential that we obtain more climate data from areas close to the two great cities at Mohenjodaro and Harappa and also from the Indian Punjab.'",
      },
      {
        label: 'G',
        text:
          "Petrie and Singh's team is now examining archaeological records and trying to understand details of how people led their lives in the region five millennia ago. They are analysing grains cultivated at the time, and trying to work out whether they were grown under extreme conditions of water stress, and whether they were adjusting the combinations of crops they were growing for different weather systems. They are also looking at whether the types of pottery used, and other aspects of their material culture, were distinctive to specific regions or were more similar across larger areas. This gives us insight into the types of interactive networks that the population was involved in, and whether those changed.",
      },
      {
        label: 'H',
        text:
          "Petrie believes that archaeologists are in a unique position to investigate how past societies responded to environmental and climatic change. 'By investigating responses to environmental pressures and threats, we can learn from the past to engage with the public, and the relevant governmental and administrative bodies, to be more proactive in issues such as the management and administration of water supply, the balance of urban and rural development, and the importance of preserving cultural heritage in the future.'",
      },
    ],
    groups: [
      {
        id: 'c13t3-r3-g1',
        heading: 'Questions 27–31',
        instruction:
          'Reading Passage 3 has eight paragraphs, A–H.\nWhich paragraph contains the following information?',
        note:
          'Write the correct letter, A–H, in boxes 27–31 on your answer sheet.\nNB You may use any letter more than once.',
        layout: 'compact',
        questions: [
          {
            number: 27,
            prompt: 'proposed explanations for the decline of the Harappan Civilisation',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'C',
            explanation: 'Paragraph C lists the competing theories for the decline.',
          },
          {
            number: 28,
            prompt: 'reference to a present-day application of some archaeological research findings',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'H',
            explanation: 'Petrie argues we can "learn from the past" to inform current water management.',
          },
          {
            number: 29,
            prompt: 'a difference between the Harappan Civilisation and another culture of the same period',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'A',
            explanation: 'Unlike the Egyptians, the Harappans left almost no depictions of themselves.',
          },
          {
            number: 30,
            prompt: 'a description of some features of Harappan urban design',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'B',
            explanation: 'Paragraph B describes baths, streets, alleyways, wells and drainage.',
          },
          {
            number: 31,
            prompt: 'reference to the discovery of errors made by previous archaeologists',
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            answer: 'D',
            explanation: 'They found "inaccuracies in the published geographic locations".',
          },
        ],
      },
      {
        id: 'c13t3-r3-g2',
        heading: 'Questions 32–36',
        instruction: 'Complete the summary below.',
        note:
          'Choose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 32–36 on your answer sheet.',
        title: 'Looking at evidence of climate change',
        layout: 'notes',
        questions: [
          {
            number: 32,
            prompt:
              'By collecting the ____ of snails and analysing them, they discovered evidence of a change in water levels',
            type: 'text',
            answer: 'shells',
            explanation: 'They "gathered shells of Melanoides tuberculata snails".',
          },
          {
            number: 33,
            prompt: 'evidence of a change in water levels in a ____ in the region',
            type: 'text',
            answer: 'lake',
            explanation: 'The shells came from "the sediments of an ancient lake".',
          },
          {
            number: 34,
            prompt: 'This occurred when there was less ____ than evaporation',
            type: 'text',
            answer: 'rainfall',
            explanation: '"the amount of evaporation from the lake exceeded the rainfall".',
          },
          {
            number: 35,
            prompt: "Petrie and Singh's team are using archaeological records to look at ____ from five millennia ago",
            type: 'text',
            answer: 'grains',
            explanation: 'They are "analysing grains cultivated at the time".',
          },
          {
            number: 36,
            prompt: 'They are also examining objects including ____, so as to find out about links between inhabitants',
            type: 'text',
            answer: 'pottery',
            explanation: '"the types of pottery used ... were distinctive to specific regions".',
          },
        ],
      },
      {
        id: 'c13t3-r3-g3',
        heading: 'Questions 37–40',
        instruction:
          'Look at the following statements (Questions 37–40) and the list of researchers below.\nMatch each statement with the correct researcher, A, B, C or D.',
        note:
          'Write the correct letter, A, B, C or D, in boxes 37–40 on your answer sheet.\nNB You may use any letter more than once.',
        layout: 'compact',
        box: {
          title: 'List of Researchers',
          items: [
            { letter: 'A', text: 'Cameron Petrie' },
            { letter: 'B', text: 'Ravindanath Singh' },
            { letter: 'C', text: 'Varna Dixit' },
            { letter: 'D', text: 'David Hodell' },
          ],
        },
        questions: [
          {
            number: 37,
            prompt: 'Finding further information about changes to environmental conditions in the region is vital.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'B',
            explanation: 'Singh says "it is essential that we obtain more climate data".',
          },
          {
            number: 38,
            prompt: 'Examining previous patterns of behaviour may have long-term benefits.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
            explanation: 'Petrie: "we can learn from the past ... to be more proactive".',
          },
          {
            number: 39,
            prompt: 'Rough calculations indicate the approximate length of a period of water shortage.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'D',
            explanation: 'Hodell estimates the weakened monsoon "lasted about 200 years".',
          },
          {
            number: 40,
            prompt: 'Information about the decline of the Harappan Civilisation has been lacking.',
            type: 'select',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
            explanation: 'Petrie: "relatively little about its fall" and "little solid evidence".',
          },
        ],
      },
    ],
  },
];
