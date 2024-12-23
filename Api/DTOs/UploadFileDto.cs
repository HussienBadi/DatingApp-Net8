namespace Api.DTOs
{
    public class UploadFileDto
    {
         public int Id { get; set; }
        public required string FileName { get; set; }
        public required string ContentType { get; set; }
        public byte[] FileData { get; set; } = Array.Empty<byte>();  
     public DateOnly UploadedOn { get; set; }

    }
}