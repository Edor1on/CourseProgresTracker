using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseTracker.Api.Data;
using CourseTracker.Api.DTOs;
using CourseTracker.Api.Models;

namespace CourseTracker.Api.Controllers;

[ApiController]
public class LessonsController : ControllerBase
{
    private readonly AppDbContext _context;
    public LessonsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("courses/{courseId}/lessons")]
    public async Task<ActionResult<IEnumerable<LessonDto>>> GetLessons(int courseId)
    {
        var lessons = await _context.Lessons
            .Where(c => c.CourseId == courseId)
            .Select(c => new LessonDto
            {
                Id = c.Id,
                CourseId = c.CourseId,
                Title = c.Title,
                Description = c.Description,
                IsCompleted = c.IsCompleted,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
        return Ok(lessons);
    }


    [HttpPost("courses/{courseId}/lessons")]
    public async Task<ActionResult<LessonDto>> CreateLesson(int courseId, CreateLessonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { message = "Title is required" });

        var courseExists = await _context.Courses.AnyAsync(c => c.Id == courseId);
        if (!courseExists)
            return NotFound(new { message = "Course not found" });

        var lesson = new Lesson
        {
            CourseId = courseId,
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();

        var resultDto = new LessonDto
        {
            Id = lesson.Id,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Description = lesson.Description,
            IsCompleted = lesson.IsCompleted,
            CreatedAt = lesson.CreatedAt
        };

        return CreatedAtAction(nameof(GetLessons), new { courseId = lesson.CourseId }, resultDto);
    }

    [HttpPatch("lessons/{id}")]
    public async Task<ActionResult<LessonDto>> UpdateLesson(int id, UpdateLessonDto dto)
    {
        var lesson = await _context.Lessons.FindAsync(id);
        if (lesson == null)
            return NotFound(new { message = "Lesson not found" });

        if (dto.Title != null)
            lesson.Title = dto.Title;

        if (dto.IsCompleted.HasValue)
            lesson.IsCompleted = dto.IsCompleted.Value;

        await _context.SaveChangesAsync();

        var resultDto = new LessonDto
        {
            Id = lesson.Id,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Description = lesson.Description,
            IsCompleted = lesson.IsCompleted,
            CreatedAt = lesson.CreatedAt
        };

        return Ok(resultDto);
    }


    [HttpDelete("lessons/{id}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        var lesson = await _context.Lessons.FindAsync(id);
        if (lesson == null)
        {
            return NotFound(new { message = "Lesson not found" });
        }

        _context.Lessons.Remove(lesson);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
