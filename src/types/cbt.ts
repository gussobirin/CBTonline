export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  category: string;
  questionText: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options?: QuestionOption[];
  correctAnswer: string | string[]; // Single ID (e.g. "B") or Array (e.g. ["A", "C"]) or text
  points: number;
  explanation: string;
  difficulty?: 'Mudah' | 'Sedang' | 'Sukar';
}

export interface ExamPackage {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string; // e.g. "Kelas XII RPL", "Umum", "Sertifikasi"
  description: string;
  durationMinutes: number;
  token: string;
  tokenActive: boolean;
  passingGrade: number; // KKM (e.g. 75)
  randomizeQuestions: boolean;
  randomizeChoices: boolean;
  allowReview: boolean;
  showScoreImmediately: boolean;
  strictFullscreen: boolean;
  maxViolations: number;
  questions: Question[];
  createdAt: string;
}

export interface ViolationEvent {
  id: string;
  timestamp: string;
  type: 'tab_switch' | 'fullscreen_exit' | 'copy_attempt' | 'devtools_opened';
  message: string;
}

export interface StudentProfile {
  studentId: string; // NISN or No. Peserta
  fullName: string;
  schoolName: string;
  classGroup: string;
  roomNumber: string;
}

export interface ExamSessionState {
  examId: string;
  student: StudentProfile;
  startedAt: string;
  durationMinutes: number;
  remainingSeconds: number;
  answers: Record<string, string | string[]>; // questionId -> answer
  flaggedQuestions: Record<string, boolean>; // questionId -> boolean (ragu-ragu)
  isSubmitted: boolean;
  isLocked: boolean;
  submittedAt?: string;
  violations: ViolationEvent[];
  calculatedScore?: {
    totalPointsEarned: number;
    maxPointsPossible: number;
    finalPercentage: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
  };
}

export interface ProctorStudentStatus {
  id: string;
  studentId: string;
  name: string;
  classGroup: string;
  examId: string;
  examTitle: string;
  status: 'Mengerjakan' | 'Selesai' | 'Terkunci' | 'Belum Mulai';
  progressAnswered: number;
  totalQuestions: number;
  flaggedCount: number;
  remainingMinutes: number;
  violationCount: number;
  lastActive: string;
  score?: number;
}

export interface SchoolSettings {
  schoolName: string;
  examHeaderTitle: string;
  academicYear: string;
  curriculum: string;
  principalName: string;
  chiefProctorName: string;
}
