export type Skill = 'listening' | 'reading' | 'writing' | 'speaking';

export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type QuestionType = 'text' | 'mcq' | 'select';

export interface Question {
  /** IELTS-style question number (1-40) */
  number: number;
  prompt: string;
  type: QuestionType;
  options?: string[];
  /** Correct answer. Alternatives may be separated with "|". */
  answer: string;
  /** Shown after submission */
  explanation?: string;
}

export interface QuestionGroup {
  id: string;
  heading: string;
  instruction: string;
  layout?: 'list' | 'notes' | 'table';
  questions: Question[];
}

export interface ScriptLine {
  speaker: string;
  text: string;
}

export interface ListeningPart {
  id: number;
  title: string;
  context: string;
  script: ScriptLine[];
  questionGroups: QuestionGroup[];
}

export interface ReadingParagraph {
  label: string;
  text: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  subtitle: string;
  paragraphs: ReadingParagraph[];
  questionGroups: QuestionGroup[];
}

export interface WritingTask {
  id: string;
  task: 1 | 2;
  title: string;
  minutes: number;
  minWords: number;
  prompt: string;
  guidance: string[];
  chart?: ChartSpec;
}

export interface ChartSpec {
  title: string;
  yLabel: string;
  yMax: number;
  categories: string[];
  series: { name: string; values: number[] }[];
}

export interface SpeakingQuestion {
  id: string;
  text: string;
}

export interface SpeakingPart {
  id: number;
  title: string;
  description: string;
  prepSeconds: number;
  speakSeconds: number;
  questions: SpeakingQuestion[];
  cueCard?: { topic: string; bullets: string[]; finalLine: string };
}

export interface SkillResult {
  band: number;
  correct?: number;
  total?: number;
  feedback?: string;
  detail?: Record<string, number>;
}

export interface Attempt {
  id: string;
  dateISO: string;
  scores: Partial<Record<Skill, SkillResult>>;
}

export interface Answers {
  [questionNumber: number]: string;
}
