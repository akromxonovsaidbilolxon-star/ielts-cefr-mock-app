import type { ReadingPassage } from '../types';

export const READING_PASSAGES: ReadingPassage[] = [
  /* ---------------------------------------------------------------- */
  /* PASSAGE 1                                                         */
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    title: 'The Return of the Beavers',
    subtitle: 'Reading Passage 1 — you should spend about 20 minutes on Questions 1–13',
    paragraphs: [
      {
        label: 'A',
        text: 'For four hundred years, the Eurasian beaver was absent from most of Britain. Hunted relentlessly for its fur, meat and a secretion known as castoreum, which was prized in medicine, the animal had disappeared from England and Wales by the sixteenth century and from Scotland by the seventeenth. Only a handful of scattered reintroductions in continental Europe kept the species from complete regional extinction. Then, in 2009, a small number of beavers was released in Knapdale Forest in Argyll, Scotland, as part of a carefully monitored official trial. The animals had come from Norway, and no one was certain whether they would survive, breed, or cause the damage that farmers feared.',
      },
      {
        label: 'B',
        text: 'The results of the five-year trial, published in 2015, were mixed but broadly encouraging. Eleven beavers had become close to thirty, and the population had spread along two river systems. More importantly, the trial produced the first detailed measurements of how beavers change a landscape. By building dams, the animals raised water levels and slowed the flow of streams, creating ponds and wetlands. Nitrate levels downstream fell, because the slow-moving water allowed bacteria to break the pollutants down. Salmon and trout were able to shelter in the deeper pools. In some places, the number of aquatic invertebrates increased by more than half.',
      },
      {
        label: 'C',
        text: 'Not every consequence was welcome. On valuable agricultural land, beavers flooded fields and gnawed through crops. In one area, an underground burrow weakened the embankment of a road, and repairs cost more than a quarter of a million pounds. Farmers argued, reasonably enough, that the benefits were being enjoyed by everyone while the costs fell on a few. The trial therefore included a scheme to trap and relocate problem animals, and this proved to be central to public acceptance. Where farmers knew that they could apply for help, opposition decreased sharply.',
      },
      {
        label: 'D',
        text: 'Meanwhile, in Devon, a wild population of beavers was discovered in 2013 on the River Otter. These animals had no official origin, but their presence forced a legal question: under European law, a protected species that has re-established itself naturally must be allowed to remain. For three years, the fate of the Devon beavers hung on a series of legal decisions. Eventually the government agreed that the animals could stay, provided that they were tested for disease and that a five-year monitoring programme was put in place. This episode established an important principle: where beavers arrive without human help, their protection is not a matter of policy, but of law.',
      },
      {
        label: 'E',
        text: 'The idea that a single species can engineer an entire ecosystem is now well established in ecology. Conservationists call such animals "keystone species", meaning that their influence on the environment is disproportionate to their numbers. Beavers are perhaps the clearest example in Europe. A single family of six beavers may modify two hectares of land within a season, and the effects persist long after the animals have moved on. Research in Bavaria found that old beaver ponds supported a significantly higher diversity of amphibians than nearby stretches of unmodified river, even decades after abandonment.',
      },
      {
        label: 'F',
        text: 'Yet the reintroduction debate is not really about ecology. It is about land. Britain is a crowded country, and every hectare has an owner, a use and usually a subsidy attached to it. When a beaver floods a field, the loss is immediate and personal, while the gain is diffuse and belongs to the future. This asymmetry explains why conflicts over reintroduced species are so bitter. It also suggests the most likely solution: a system in which those who host the animals are paid for the benefit they provide to everyone else. Several European countries already operate such schemes, and Scotland has begun to experiment with them.',
      },
      {
        label: 'G',
        text: 'What happens next depends less on biology than on politics. Beavers were granted protected status in Scotland in 2016, which makes it illegal to kill them without a licence. In England, a national reintroduction strategy has been repeatedly delayed. Meanwhile, the animals continue to spread quietly along rivers, sometimes with permission and sometimes without. The beaver, having been removed from Britain by deliberate human effort, is returning through a mixture of accident and design. Whether that return is managed or merely tolerated will determine whether the benefits described in the Knapdale report are realized across the country, or confined to a few protected sites.',
      },
    ],
    questionGroups: [
      {
        id: 'r1-g1',
        heading: 'Questions 1–5',
        instruction:
          'Do the following statements agree with the information in the passage? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.',
        layout: 'list',
        questions: [
          { number: 1, prompt: 'Beavers disappeared from Scotland before they disappeared from England.', type: 'select', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', explanation: 'The passage says they had gone from England and Wales by the 16th century and from Scotland by the 17th — Scotland was later.' },
          { number: 2, prompt: 'The 2009 trial used beavers brought from Norway.', type: 'select', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', explanation: '"The animals had come from Norway".' },
          { number: 3, prompt: 'The Knapdale trial found that beaver dams reduced nitrate levels downstream.', type: 'select', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', explanation: '"Nitrate levels downstream fell".' },
          { number: 4, prompt: 'Farmers in the trial were required to pay for all repairs themselves.', type: 'select', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', explanation: 'A scheme to trap and relocate problem animals was provided; the passage says farmers could apply for help.' },
          { number: 5, prompt: 'The Devon beavers were released illegally by conservationists.', type: 'select', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN', explanation: 'The passage says they "had no official origin" but never states who released them or that it was illegal.' },
        ],
      },
      {
        id: 'r1-g2',
        heading: 'Questions 6–9',
        instruction: 'Choose the correct letter, A, B, C or D.',
        layout: 'list',
        questions: [
          {
            number: 6,
            prompt: 'The legal significance of the Devon case was that',
            type: 'mcq',
            options: [
              'the government was forced to fund a reintroduction programme.',
              'naturally re-established protected species must be allowed to remain.',
              'beavers could be hunted without a licence.',
              'the River Otter was declared a protected area.',
            ],
            answer: 'B',
            explanation: '"where beavers arrive without human help, their protection is not a matter of policy, but of law".',
          },
          {
            number: 7,
            prompt: 'According to paragraph E, a "keystone species" is one whose',
            type: 'mcq',
            options: [
              'numbers are unusually large.',
              'influence is disproportionate to its numbers.',
              'survival depends on a single habitat.',
              'population cannot be counted accurately.',
            ],
            answer: 'B',
            explanation: '"their influence on the environment is disproportionate to their numbers".',
          },
          {
            number: 8,
            prompt: 'What does the writer suggest is the main obstacle to reintroduction?',
            type: 'mcq',
            options: [
              'Scientific uncertainty about the benefits.',
              'The attitudes of conservationists.',
              'The distribution of costs and benefits across landowners.',
              'Insufficient funding for research.',
            ],
            answer: 'C',
            explanation: 'Paragraph F: "the loss is immediate and personal, while the gain is diffuse".',
          },
          {
            number: 9,
            prompt: 'The phrase "mixture of accident and design" in the final paragraph refers to',
            type: 'mcq',
            options: [
              'unplanned escapes and deliberate releases.',
              'government policy and academic research.',
              'the natural spread of beavers and the failure of legislation.',
              'scientific trials and farming practice.',
            ],
            answer: 'A',
            explanation: 'Some beavers spread unofficially (accident) and others were reintroduced officially (design).',
          },
        ],
      },
      {
        id: 'r1-g3',
        heading: 'Questions 10–13',
        instruction:
          'Complete the summary below. Write NO MORE THAN TWO WORDS from the passage for each answer.',
        layout: 'notes',
        questions: [
          { number: 10, prompt: 'Beaver dams raise water levels and create ponds and ______.', type: 'text', answer: 'wetlands', explanation: '"creating ponds and wetlands".' },
          { number: 11, prompt: 'The trial included a scheme to trap and ______ problem animals.', type: 'text', answer: 'relocate', explanation: '"trap and relocate problem animals".' },
          { number: 12, prompt: 'Beavers were granted protected status in Scotland in ______.', type: 'text', answer: '2016', explanation: '"granted protected status in Scotland in 2016".' },
          { number: 13, prompt: 'Old beaver ponds supported a higher diversity of ______.', type: 'text', answer: 'amphibians', explanation: '"supported a significantly higher diversity of amphibians".' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PASSAGE 2                                                         */
  /* ---------------------------------------------------------------- */
  {
    id: 2,
    title: 'The Science of Sleep and Memory',
    subtitle: 'Reading Passage 2 — you should spend about 20 minutes on Questions 14–26',
    paragraphs: [
      {
        label: 'A',
        text: 'For most of human history, sleep was understood as a passive state — a kind of nightly shutdown during which the body rested and the brain, in effect, switched off. That view collapsed in the 1950s, when researchers using electroencephalography (EEG) discovered that the sleeping brain produces a rich and highly organized pattern of electrical activity. It has taken another half century to understand what that activity is for. Today, most neuroscientists agree that one of sleep\'s central functions is the consolidation of memory.',
      },
      {
        label: 'B',
        text: 'Sleep is not a single uniform state. In a normal night we move through cycles of roughly ninety minutes, passing from light sleep into deeper slow-wave sleep and then into rapid eye movement (REM) sleep, when dreaming is most vivid. Slow-wave sleep dominates the first half of the night, while REM occupies a larger share of the second. This structure is not arbitrary: it maps onto different kinds of learning. Declarative memories — facts, names, dates, the content of a lecture — are strengthened mainly during slow-wave sleep. Procedural skills, such as playing a scale or riding a bicycle, improve disproportionately after REM sleep.',
      },
      {
        label: 'C',
        text: 'The mechanism that explains this is now fairly well understood. During slow-wave sleep, the hippocampus, a structure deep in the brain that acts as a temporary store for new experiences, replays the sequences of neural activity that occurred during the day. These replays happen at high speed and are coordinated with slow oscillations in the cortex, the outer layer of the brain where long-term memories are held. The result is a transfer of information: the hippocampus effectively teaches the cortex, and the memory becomes independent of the structure that first recorded it.',
      },
      {
        label: 'D',
        text: 'The consequences are easy to demonstrate. In a classic experiment, participants learned pairs of unrelated words and were tested after either a night of sleep or an equivalent period of daytime wakefulness. Those who slept remembered about twenty per cent more. The advantage was not simply due to being rested or free from interference: when experimenters monitored sleep directly, they found that the amount of slow-wave activity in the first half of the night predicted, with surprising accuracy, how much each individual would remember.',
      },
      {
        label: 'E',
        text: 'More recent work has begun to identify the chemical signals involved. A team in Heidelberg showed that during slow-wave sleep the brain is flooded with a wave of noradrenaline that rises and falls in step with the slow oscillations. When this chemical wave was blocked in animals, the transfer of memories from hippocampus to cortex did not happen, even though the animals slept normally by every other measure. This suggests that the rhythm of sleep, and not merely its duration, is what matters.',
      },
      {
        label: 'F',
        text: 'If sleep consolidates memory, then losing sleep should damage it — and it does. Chronic restriction to five or six hours a night is associated with measurable deficits in working memory and attention, and with a smaller hippocampus in middle age. The effects are not permanent if sleep is restored, but they accumulate slowly and are easy to overlook. A student who sleeps five hours before an exam may feel alert, and may even perform adequately on a simple test, but studies consistently show poorer performance on tasks requiring flexible thinking and the integration of new information with what is already known.',
      },
      {
        label: 'G',
        text: 'The practical implications are obvious, and yet they are widely ignored. Schools and universities schedule examinations and teaching in ways that assume late-night study is effective, despite evidence that material learned after midnight is retained poorly. Some employers now offer "sleep hygiene" training, though the evidence that such programmes change behaviour is mixed. What is clear is that sleep is not a luxury that can be traded for productivity; it is part of the process by which learning becomes permanent. The old advice to "sleep on it" turns out to be a precise, and scientifically well-founded, recommendation.',
      },
    ],
    questionGroups: [
      {
        id: 'r2-g1',
        heading: 'Questions 14–18',
        instruction: 'Choose the correct letter, A, B, C or D.',
        layout: 'list',
        questions: [
          {
            number: 14,
            prompt: 'The 1950s discovery that changed views about sleep was that',
            type: 'mcq',
            options: [
              'dreaming occurs mostly in REM sleep.',
              'the sleeping brain produces organized electrical activity.',
              'the body temperature falls during sleep.',
              'the brain consumes less oxygen at night.',
            ],
            answer: 'B',
            explanation: '"researchers using electroencephalography discovered that the sleeping brain produces a rich and highly organized pattern of electrical activity".',
          },
          {
            number: 15,
            prompt: 'According to paragraph B, REM sleep',
            type: 'mcq',
            options: [
              'occupies most of the first half of the night.',
              'improves declarative memory more than slow-wave sleep.',
              'is associated with greater improvement in procedural skills.',
              'occurs in a single period each night.',
            ],
            answer: 'C',
            explanation: 'Procedural skills "improve disproportionately after REM sleep".',
          },
          {
            number: 16,
            prompt: 'The hippocampus is described as',
            type: 'mcq',
            options: [
              'a permanent store of long-term memories.',
              'a temporary store for new experiences.',
              'the region that generates REM sleep.',
              'a structure that controls body temperature.',
            ],
            answer: 'B',
            explanation: '"acts as a temporary store for new experiences".',
          },
          {
            number: 17,
            prompt: 'In the word-pair experiment, the advantage of sleep was linked to',
            type: 'mcq',
            options: [
              'how long participants slept.',
              'the amount of slow-wave activity early in the night.',
              'the absence of interference the following day.',
              'participants\' general level of tiredness.',
            ],
            answer: 'B',
            explanation: '"the amount of slow-wave activity in the first half of the night predicted ... how much each individual would remember".',
          },
          {
            number: 18,
            prompt: 'The Heidelberg study suggests that',
            type: 'mcq',
            options: [
              'noradrenaline has no role in memory.',
              'the timing of sleep matters, not just its length.',
              'memories are stored in the cortex from the start.',
              'animals do not consolidate memories.',
            ],
            answer: 'B',
            explanation: '"the rhythm of sleep, and not merely its duration, is what matters".',
          },
        ],
      },
      {
        id: 'r2-g2',
        heading: 'Questions 19–23',
        instruction:
          'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
        layout: 'notes',
        questions: [
          { number: 19, prompt: 'Sleep cycles last about ______ minutes.', type: 'text', answer: '90|ninety', explanation: '"cycles of roughly ninety minutes".' },
          { number: 20, prompt: 'Long-term memories are held in the ______.', type: 'text', answer: 'cortex|the cortex', explanation: '"the outer layer of the brain where long-term memories are held".' },
          { number: 21, prompt: 'Sleeping participants remembered about ______ per cent more word pairs.', type: 'text', answer: '20|twenty', explanation: '"remembered about twenty per cent more".' },
          { number: 22, prompt: 'Recent work has identified the chemical ______ involved in consolidation.', type: 'text', answer: 'signals', explanation: '"has begun to identify the chemical signals involved".' },
          { number: 23, prompt: 'Chronic sleep restriction is linked with a smaller ______ in middle age.', type: 'text', answer: 'hippocampus', explanation: '"with a smaller hippocampus in middle age".' },
        ],
      },
      {
        id: 'r2-g3',
        heading: 'Questions 24–26',
        instruction:
          'Which paragraph contains the following information? Write the correct letter, A–G.',
        layout: 'list',
        questions: [
          { number: 24, prompt: 'A comparison between the effects of sleep and of simply being awake.', type: 'text', answer: 'D', explanation: 'Paragraph D compares a night of sleep with daytime wakefulness.' },
          { number: 25, prompt: 'A reference to the way institutions ignore research findings.', type: 'text', answer: 'G', explanation: 'Paragraph G discusses schools and employers ignoring the evidence.' },
          { number: 26, prompt: 'A description of two different kinds of memory and when they improve.', type: 'text', answer: 'B', explanation: 'Paragraph B contrasts declarative memories and procedural skills.' },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* PASSAGE 3                                                         */
  /* ---------------------------------------------------------------- */
  {
    id: 3,
    title: 'The Economics of Second-hand Markets',
    subtitle: 'Reading Passage 3 — you should spend about 20 minutes on Questions 27–40',
    paragraphs: [
      {
        label: 'A',
        text: 'Economists have traditionally paid little attention to second-hand markets, treating the resale of goods as a minor rounding error in the great sum of consumption. This neglect is difficult to justify. In most rich countries, the resale of cars, furniture, clothing and electronics is worth hundreds of billions of pounds a year, and online platforms have expanded it rapidly. The rise of these platforms raises questions that go well beyond the value of the trade itself, touching on how information is priced, how trust is produced, and how markets deal with goods whose quality is difficult to observe.',
      },
      {
        label: 'B',
        text: 'The central problem was described in 1970 by the economist George Akerlof, whose paper "The Market for Lemons" used the used-car trade as its illustration. Suppose that buyers cannot tell a good car from a bad one — a "lemon" — and that sellers can. Buyers will therefore offer only an average price, reflecting the risk. Owners of good cars, knowing their vehicles are worth more, will withdraw from the market. Their withdrawal lowers the average quality of what remains, so buyers reduce their offers again. This adverse selection can, in principle, cause a market to collapse altogether.',
      },
      {
        label: 'C',
        text: 'Akerlof\'s insight was that institutions emerge to solve this problem, and the history of second-hand trade is largely a history of such institutions. Warranties, money-back guarantees, dealer reputations and certification schemes all exist to transfer information from the seller to the buyer. What is striking is how well these solutions can work without any regulation at all. A used-car dealer with a showroom and a local reputation has a great deal to lose from cheating; the value of its reputation functions as a bond, and the bond is often more effective than a legal rule.',
      },
      {
        label: 'D',
        text: 'Online platforms have transformed the mechanics of this problem without changing its logic. A platform cannot inspect the goods it lists, so it must find other ways to make quality visible. The most important innovation has been the feedback score. In effect, the platform converts a long series of small transactions into a public record of trustworthiness, a reputation that is costly to build and costly to lose. Studies of online auctions have found that sellers with strong feedback records receive prices five to eight per cent higher than otherwise identical sellers, and that this premium is remarkably stable across categories.',
      },
      {
        label: 'E',
        text: 'Yet feedback systems have well-known weaknesses. Ratings are inflated, because buyers are reluctant to leave negative comments when they might themselves be rated in return. Sellers can also manipulate the system by creating fake accounts. Platforms respond with increasingly sophisticated verification, but the arms race is endless. More importantly, feedback measures only past transactions: it tells a buyer how a seller behaved towards others, not what condition this particular item is in. For goods whose quality varies item by item, such as antiques or vintage clothing, the problem of observation remains essentially unsolved.',
      },
      {
        label: 'F',
        text: 'There is a further economic effect that Akerlof did not anticipate. Second-hand markets do not simply redistribute existing goods; they change the decision to buy new ones. If a buyer knows that a car can be resold for a substantial fraction of its price, the effective cost of ownership falls, and demand for new cars rises. Conversely, a market flooded with cheap used goods can cannibalize new sales. The net effect depends on the durability of the product and the speed at which it depreciates, which explains why the second-hand market for books collapsed when e-readers arrived while the market for furniture has grown steadily.',
      },
      {
        label: 'G',
        text: 'The environmental argument is also less straightforward than it appears. Buying second-hand extends the life of a product and avoids the emissions of manufacturing a new one, which is plainly beneficial. But a well-functioning second-hand market also raises the resale value of goods and therefore makes new purchases cheaper in effective terms, encouraging people to buy more than they otherwise would. Whether the substitution effect or the price effect dominates is an empirical question, and the evidence so far is mixed. What can be said with confidence is that the policy debate, which often assumes that second-hand trade is unambiguously good for the environment, is founded on an assumption that has never been tested.',
      },
    ],
    questionGroups: [
      {
        id: 'r3-g1',
        heading: 'Questions 27–31',
        instruction:
          'Do the following statements agree with the claims of the writer in the passage? Write YES, NO or NOT GIVEN.',
        layout: 'list',
        questions: [
          { number: 27, prompt: 'Economists have underestimated the importance of second-hand markets.', type: 'select', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'YES', explanation: 'The writer calls the neglect "difficult to justify" and notes the trade is worth hundreds of billions.' },
          { number: 28, prompt: 'Akerlof believed that second-hand markets would always collapse.', type: 'select', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', explanation: 'He argued it "can, in principle" collapse, and stressed that institutions emerge to solve the problem.' },
          { number: 29, prompt: 'Reputation is often a more effective guarantee than a legal rule.', type: 'select', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'YES', explanation: '"the bond is often more effective than a legal rule".' },
          { number: 30, prompt: 'Buyers trust sellers with high feedback scores because platforms inspect the goods.', type: 'select', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', explanation: 'The passage says a platform "cannot inspect the goods it lists".' },
          { number: 31, prompt: 'Negative feedback is more common than positive feedback on most platforms.', type: 'select', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NOT GIVEN', explanation: 'The passage says ratings are inflated, but gives no comparative frequency figures.' },
        ],
      },
      {
        id: 'r3-g2',
        heading: 'Questions 32–36',
        instruction: 'Choose the correct letter, A, B, C or D.',
        layout: 'list',
        questions: [
          {
            number: 32,
            prompt: 'In Akerlof\'s model, the withdrawal of good cars from the market leads to',
            type: 'mcq',
            options: [
              'higher average quality.',
              'lower offers from buyers.',
              'government regulation.',
              'an increase in new car sales.',
            ],
            answer: 'B',
            explanation: '"so buyers reduce their offers again".',
          },
          {
            number: 33,
            prompt: 'The writer describes reputation as',
            type: 'mcq',
            options: [
              'a legal obligation.',
              'a form of bond.',
              'a kind of warranty.',
              'a government certificate.',
            ],
            answer: 'B',
            explanation: '"the value of its reputation functions as a bond".',
          },
          {
            number: 34,
            prompt: 'Strong feedback records raise seller prices by roughly',
            type: 'mcq',
            options: ['one to two per cent.', 'five to eight per cent.', 'ten to fifteen per cent.', 'twenty per cent.'],
            answer: 'B',
            explanation: '"prices five to eight per cent higher".',
          },
          {
            number: 35,
            prompt: 'The main limitation of feedback systems is that they',
            type: 'mcq',
            options: [
              'cannot be used internationally.',
              'describe the seller, not the individual item.',
              'require government approval.',
              'are too expensive for small sellers.',
            ],
            answer: 'B',
            explanation: '"it tells a buyer how a seller behaved towards others, not what condition this particular item is in".',
          },
          {
            number: 36,
            prompt: 'The second-hand market for books collapsed because',
            type: 'mcq',
            options: [
              'books depreciate very slowly.',
              'e-readers arrived.',
              'feedback systems did not work for books.',
              'demand for new books fell sharply.',
            ],
            answer: 'B',
            explanation: '"the second-hand market for books collapsed when e-readers arrived".',
          },
        ],
      },
      {
        id: 'r3-g3',
        heading: 'Questions 37–40',
        instruction:
          'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
        layout: 'notes',
        questions: [
          { number: 37, prompt: 'Akerlof\'s paper was titled "The Market for ______".', type: 'text', answer: 'Lemons|lemons', explanation: 'The title is "The Market for Lemons".' },
          { number: 38, prompt: 'The process described in paragraph B is known as ______.', type: 'text', answer: 'adverse selection', explanation: '"This adverse selection can...".' },
          { number: 39, prompt: 'Ratings are inflated because buyers do not want to leave ______ comments.', type: 'text', answer: 'negative', explanation: '"reluctant to leave negative comments".' },
          { number: 40, prompt: 'The policy debate is based on an assumption that has never been ______.', type: 'text', answer: 'tested', explanation: '"an assumption that has never been tested".' },
        ],
      },
    ],
  },
];

export const READING_QUESTIONS = READING_PASSAGES.flatMap((p) =>
  p.questionGroups.flatMap((g) => g.questions),
);
