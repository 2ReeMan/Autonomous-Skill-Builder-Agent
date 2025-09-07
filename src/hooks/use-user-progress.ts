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
      setCompletedCourses((prev) => [...prev, newCourse]);
    } catch (error) {
      console.error('Error completing course:', error);
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
