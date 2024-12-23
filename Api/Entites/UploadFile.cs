namespace Api.Entites;
public class UploadFile
{
  public int Id { get; set; }
  public required string FileName { get; set; }
  public required string ContentType { get; set; }
  public byte[] FileData { get; set; } = Array.Empty<byte>();
  public DateOnly UploadedOn { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

  public int AppUserId { get; set; }
  public required AppUser AppUser { get; set; } = null!;
}
