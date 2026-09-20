export interface Course {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  totalLessons: number;
  completedLessons: number;
}

export interface CreateCourseDto {
  title: string;
  description?: string;
}
