
'use client';
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

interface CompletedCourse {
  courseId: string;
  score: number;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setCompletedCourses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userProgressRef = doc(db, 'userProgress', user.uid);
      const docSnap = await getDoc(userProgressRef);

      if (docSnap.exists()) {
        setCompletedCourses(docSnap.data().completedCourses || []);
      } else {
        // No existing progress, set default empty state
        setCompletedCourses([]);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
      // In case of error (e.g., offline), keep existing state or default to empty
      setCompletedCourses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const completeCourse = async (courseId: string, score: number) => {
    if (!user) return;

    const userProgressRef = doc(db, 'userProgress', user.uid);
    const newCourse: CompletedCourse = { courseId, score };

    // Optimistically update the UI
    const courseAlreadyCompleted = completedCourses.some(c => c.courseId === courseId);
    if (!courseAlreadyCompleted) {
        setCompletedCourses((prev) => [...prev, newCourse]);
    }

    try {
      const docSnap = await getDoc(userProgressRef);
      if (docSnap.exists()) {
        // Update existing document
        const existingCourses = docSnap.data().completedCourses || [];
        if (existingCourses.some((c: CompletedCourse) => c.courseId === courseId)) {
          // Course already completed, maybe update score? For now, we do nothing.
          return;
        }
        await updateDoc(userProgressRef, {
          completedCourses: arrayUnion(newCourse),
        });
      } else {
        // Create new document
        await setDoc(userProgressRef, {
          completedCourses: [newCourse],
        });
      }
    } catch (error) {
      console.error('Error completing course:', error);
      // Revert optimistic update on error
      if(!courseAlreadyCompleted) {
        setCompletedCourses((prev) => prev.filter(c => c.courseId !== courseId));
      }
    }
  };

  const isCourseCompleted = (courseId: string): boolean => {
    return completedCourses.some((course) => course.courseId === courseId);
  };
  
  const averageScore = completedCourses.length > 0
    ? completedCourses.reduce((acc, course) => acc + course.score, 0) / completedCourses.length
    : 0;

  return {
    completedCourses,
    loading,
    completeCourse,
    isCourseCompleted,
    averageScore,
  };
}
