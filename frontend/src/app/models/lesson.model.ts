export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateLessonDto {
  title: string;
  description?: string;
}

export interface UpdateLessonDto {
  title?: string;
  isCompleted?: boolean;
}
