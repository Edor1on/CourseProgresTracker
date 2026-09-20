import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {
  courses: Course[] = [];
  isLoading = false;
  errorMessage = '';

  newCourseTitle = '';
  newCourseDescription = '';

  selectedCourseId: number | null = null;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  createCourse(): void {
    if (!this.newCourseTitle.trim()) {
      return;
    }

    this.courseService.createCourse({
      title: this.newCourseTitle,
      description: this.newCourseDescription
    }).subscribe({
      next: () => {
        this.newCourseTitle = '';
        this.newCourseDescription = '';
        this.loadCourses();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create course';
        console.error(err);
      }
    });
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        if (this.selectedCourseId === id) {
          this.selectedCourseId = null;
        }
        this.loadCourses();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete course';
        console.error(err);
      }
    });
  }

  selectCourse(id: number): void {
    this.selectedCourseId = id;
  }

  getProgress(course: Course): number {
    if (course.totalLessons === 0) return 0;
    return Math.round((course.completedLessons / course.totalLessons) * 100);
  }
}
