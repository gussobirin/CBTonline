import React, { useState, useEffect } from 'react';
import { ExamPackage, ExamSessionState, SchoolSettings, StudentProfile } from './types/cbt';
import {
  getStoredExams,
  saveStoredExams,
  getStoredSettings,
  saveStoredSettings,
  getActiveSession,
  saveActiveSession,
  getCompletedResults,
  saveCompletedResult
} from './utils/storage';
import { StudentLogin } from './components/student/StudentLogin';
import { ExamRunner } from './components/student/ExamRunner';
import { ExamResultView } from './components/student/ExamResultView';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [exams, setExams] = useState<ExamPackage[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(getStoredSettings());
  const [completedResults, setCompletedResults] = useState<ExamSessionState[]>([]);
  const [viewMode, setViewMode] = useState<'student_login' | 'exam_running' | 'exam_result' | 'admin_portal'>('student_login');

  // Active state
  const [activeExam, setActiveExam] = useState<ExamPackage | null>(null);
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [activeSession, setActiveSession] = useState<ExamSessionState | null>(null);
  const [resultSession, setResultSession] = useState<ExamSessionState | null>(null);

  // Initialize data
  useEffect(() => {
    const loadedExams = getStoredExams();
    setExams(loadedExams);
    setSettings(getStoredSettings());
    setCompletedResults(getCompletedResults());

    // Check if there is an active exam session in progress (resume capability)
    const existingSession = getActiveSession();
    if (existingSession && !existingSession.isSubmitted) {
      const matchExam = loadedExams.find(e => e.id === existingSession.examId) || loadedExams[0];
      setActiveExam(matchExam);
      setActiveStudent(existingSession.student);
      setActiveSession(existingSession);
      setViewMode('exam_running');
    }
  }, []);

  const handleUpdateExams = (updated: ExamPackage[]) => {
    setExams(updated);
    saveStoredExams(updated);
  };

  const handleUpdateSettings = (updated: SchoolSettings) => {
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Student starts exam
  const handleStartExam = (student: StudentProfile, exam: ExamPackage) => {
    setActiveStudent(student);
    setActiveExam(exam);

    const newSession: ExamSessionState = {
      examId: exam.id,
      student,
      startedAt: new Date().toISOString(),
      durationMinutes: exam.durationMinutes,
      remainingSeconds: exam.durationMinutes * 60,
      answers: {},
      flaggedQuestions: {},
      isSubmitted: false,
      isLocked: false,
      violations: []
    };

    setActiveSession(newSession);
    saveActiveSession(newSession);
    setViewMode('exam_running');
  };

  // Student finishes exam
  const handleFinishExam = (completed: ExamSessionState) => {
    setActiveSession(null);
    saveActiveSession(null);
    saveCompletedResult(completed);

    setCompletedResults(prev => [completed, ...prev]);
    setResultSession(completed);
    setViewMode('exam_result');
  };

  // Admin inspects a specific student result
  const handleViewStudentResultFromAdmin = (session: ExamSessionState) => {
    const matchingExam = exams.find(e => e.id === session.examId) || exams[0];
    setActiveExam(matchingExam);
    setResultSession(session);
    setViewMode('exam_result');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Student Login & Token Screen */}
      {viewMode === 'student_login' && (
        <StudentLogin
          exams={exams}
          onStartExam={handleStartExam}
          onSwitchToAdmin={() => setViewMode('admin_portal')}
        />
      )}

      {/* 2. Active Exam Screen (Student Mode) */}
      {viewMode === 'exam_running' && activeExam && activeStudent && (
        <ExamRunner
          exam={activeExam}
          student={activeStudent}
          initialSession={activeSession}
          onFinishExam={handleFinishExam}
        />
      )}

      {/* 3. Exam Result & Analysis Screen */}
      {viewMode === 'exam_result' && resultSession && (
        <ExamResultView
          session={resultSession}
          exam={activeExam || exams.find(e => e.id === resultSession.examId) || exams[0]}
          settings={settings}
          onRetakeOrExit={() => {
            setResultSession(null);
            setViewMode('student_login');
          }}
          onGoToAdmin={() => {
            setResultSession(null);
            setViewMode('admin_portal');
          }}
        />
      )}

      {/* 4. Teacher / Proctor Admin Portal */}
      {viewMode === 'admin_portal' && (
        <AdminDashboard
          exams={exams}
          settings={settings}
          completedResults={completedResults}
          onUpdateExams={handleUpdateExams}
          onUpdateSettings={handleUpdateSettings}
          onViewStudentResult={handleViewStudentResultFromAdmin}
          onSwitchToStudent={() => setViewMode('student_login')}
        />
      )}
    </div>
  );
}
