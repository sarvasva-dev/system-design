export type ConfidenceLevel = 'stable' | 'tech-specific' | 'verification-needed';

export interface VerifiedSource {
  title: string;
  url: string;
  type: 'Official Documentation' | 'Research Paper' | 'RFC / Standard' | 'Engineering Blog' | 'Conference Video';
  whatItSupports: string;
}

export interface VerifiedVideo {
  title: string;
  creator: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  whatYouWillLearn: string;
  url: string;
}

export interface GateSmashersLecture {
  id: string;
  lectureNumber: number;
  title: string;
  duration: string;
  category: string;
  summary: string;
  keyTakeaways: string[];
  associatedChapterTitle: string;
  associatedChapterId: string;
  youtubeUrl: string;
  searchQuery: string;
  isPopular?: boolean;
}

export interface ChapterExercise {
  quickRevision: string[];
  conceptualQuestions: { id: string; question: string; answer: string }[];
  designExercises: { id: string; scenario: string; task: string; solutionGuide: string }[];
  interviewQuestions: { id: string; question: string; idealAnswer?: string; answer?: string }[];
  practicalTask: { title: string; instructions: string; verification: string };
}

export interface ConceptBlock {
  title: string;
  confidence: ConfidenceLevel;
  simpleDefinition: string;
  whyItExists: string;
  analogy: string;
  technicalExplanation: string;
  example: string;
  whenToUse: string[];
  whenNotToUse: string[];
  commonMistakes: string[];
  interviewQuestion: { question: string; answer: string };
  codeSnippet?: { language: string; title: string; code: string };
}

export interface ArchitectureEvolution {
  version: string;
  title: string;
  scale: string;
  architectureDescription: string;
  diagramAscii: string;
  whatBroke: string;
  whyItBroke: string;
  whatChanged: string;
  whyNewComponent: string;
}

export interface Chapter {
  id: string;
  part: number;
  partTitle: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  concepts: ConceptBlock[];
  diagramAscii?: string;
  tradeOffAnalysis?: {
    technologyA: string;
    technologyB: string;
    comparisonDimensions: { dimension: string; optionA: string; optionB: string; verdict: string }[];
  };
  realWorldReality?: {
    concept: string;
    implementation: string;
    productionReality: string;
    interviewAbstraction: string;
  }[];
  exercises: ChapterExercise;
  sources: VerifiedSource[];
  videos: VerifiedVideo[];
}

export interface CaseStudy {
  id: string;
  number: number;
  title: string;
  problem: string;
  requirements: {
    functional: string[];
    nonFunctional: string[];
  };
  scaleAssumptions: {
    users: string;
    dauMau: string;
    rps: string;
    peakRps: string;
    storage: string;
    bandwidth: string;
    readWriteRatio: string;
    calculationsStepByStep: string[];
  };
  apiDesign: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    description: string;
    sampleRequest?: string;
    sampleResponse?: string;
  }[];
  dataModel: {
    entity: string;
    storageEngine: string;
    schemaDefinition: string;
    notes: string;
  }[];
  highLevelArchitectureAscii: string;
  components: { name: string; role: string; scalingStrategy: string }[];
  requestLifecycle: string[];
  databaseDesign: string;
  cachingStrategy: string;
  messagingStrategy: string;
  scalingTechniques: string[];
  failureScenarios: { failure: string; impact: string; mitigation: string }[];
  securityThreats: { threat: string; defense: string }[];
  observabilityPlan: { logs: string; metrics: string; traces: string };
  costDrivers: string[];
  tradeOffsSacrificed: string[];
  alternativeArchitecture: string;
  interviewDiscussion: { question: string; keyTalkingPoints: string[] }[];
}

export interface InterviewQuestionItem {
  id: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'saas' | 'iaas' | 'distributed-systems' | 'databases';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  modelAnswer: string;
  evaluationRubric: string[];
  followUpQuestions: string[];
}

export interface GlossaryInterviewQuestion {
  question: string;
  companies: string[];
  level: string; // e.g. 'L4 (Mid)', 'L5 (Senior)', 'L6+ (Staff)'
  detailedAnswer: string;
  keyPoints: string[];
  interviewerFollowUp?: string;
  followUpAnswer?: string;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  simpleMeaning: string;
  technicalMeaning: string;
  example: string;
  interviewQuestions?: GlossaryInterviewQuestion[];
}

export interface ArchitectureChecklistItem {
  step: number;
  category: string;
  description: string;
  keyQuestionsToAsk: string[];
  commonRedFlags: string[];
}
