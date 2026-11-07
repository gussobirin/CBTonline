import { ExamPackage, ExamSessionState, SchoolSettings } from '../types/cbt';
import { sampleExams, defaultSchoolSettings } from '../data/initialExams';

const STORAGE_KEYS = {
  EXAMS: 'educbt_exam_packages_v1',
  SETTINGS: 'educbt_school_settings_v1',
  ACTIVE_SESSION: 'educbt_active_student_session_v1',
  COMPLETED_RESULTS: 'educbt_completed_results_v1'
};

export const getStoredExams = (): ExamPackage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(sampleExams));
      return sampleExams;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleExams;
  } catch (e) {
    console.error('Failed reading exams from storage', e);
    return sampleExams;
  }
};

export const saveStoredExams = (exams: ExamPackage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  } catch (e) {
    console.error('Failed saving exams to storage', e);
  }
};

export const getStoredSettings = (): SchoolSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSchoolSettings));
      return defaultSchoolSettings;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading settings', e);
    return defaultSchoolSettings;
  }
};

export const saveStoredSettings = (settings: SchoolSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving settings', e);
  }
};

export const getActiveSession = (): ExamSessionState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const saveActiveSession = (session: ExamSessionState | null): void => {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  } catch (e) {
    console.error('Failed saving session', e);
  }
};

export const getCompletedResults = (): ExamSessionState[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveCompletedResult = (result: ExamSessionState): void => {
  try {
    const list = getCompletedResults();
    const updated = [result, ...list.filter(r => !(r.examId === result.examId && r.student.studentId === result.student.studentId))];
    localStorage.setItem(STORAGE_KEYS.COMPLETED_RESULTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving completed result', e);
  }
};
