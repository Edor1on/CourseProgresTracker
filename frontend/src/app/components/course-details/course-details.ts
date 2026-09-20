import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
})
export class CourseDetails implements OnChanges {
  @Input() courseId!: number;

  lessons: Lesson[] = [];
  isLoading = false;
  errorMessage = '';

  newLessonTitle = '';
  newLessonDescription = '';

  constructor(private courseService: CourseService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId']) {
      this.loadLessons();
    }
  }

  loadLessons(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.getLessons(this.courseId).subscribe({
      next: (data) => {
        this.lessons = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load lessons';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  createLesson(): void {
    if (!this.newLessonTitle.trim()) {
      return;
    }

    this.courseService.createLesson(this.courseId, {
      title: this.newLessonTitle,
      description: this.newLessonDescription
    }).subscribe({
      next: () => {
        this.newLessonTitle = '';
        this.newLessonDescription = '';
        this.loadLessons();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create lesson';
        console.error(err);
      }
    });
  }

  toggleCompleted(lesson: Lesson): void {
    this.courseService.updateLesson(lesson.id, {
      isCompleted: !lesson.isCompleted
    }).subscribe({
      next: () => {
        this.loadLessons();
      },
      error: (err) => {
        this.errorMessage = 'Failed to update lesson';
        console.error(err);
      }
    });
  }

  deleteLesson(id: number): void {
    this.courseService.deleteLesson(id).subscribe({
      next: () => {
        this.loadLessons();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete lesson';
        console.error(err);
      }
    });
  }
}
