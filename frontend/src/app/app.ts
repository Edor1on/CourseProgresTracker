import { Component } from '@angular/core';
import { CourseList } from './components/course-list/course-list';
import { CourseDetails } from './components/course-details/course-details';

@Component({
  selector: 'app-root',
  imports: [CourseList, CourseDetails],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedCourseId: number | null = null;

  onCourseSelected(id: number): void {
    this.selectedCourseId = id;
  }
}
