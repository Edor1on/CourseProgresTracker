namespace CourseTracker.Api.Models
{
    public class Lesson
    {
        public int Id { get; set; }
        public string CourseId { get; set; } = String.Empty;
        public string Title { get; set; } = String.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Course? Course { get; set; }

    }
}
