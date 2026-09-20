import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateCourseDto } from '../models/course.model';
import { Lesson, CreateLessonDto, UpdateLessonDto } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  createCourse(dto: CreateCourseDto): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, dto);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}`);
  }

  // Lessons
  getLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/courses/${courseId}/lessons`);
  }

  createLesson(courseId: number, dto: CreateLessonDto): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/courses/${courseId}/lessons`, dto);
  }

  updateLesson(id: number, dto: UpdateLessonDto): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.apiUrl}/lessons/${id}`, dto);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lessons/${id}`);
  }
}
