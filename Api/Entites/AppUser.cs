using Api.Extentions;

namespace Api.Entites;

public class AppUser
{
      public int Id { get; set; }
      public required string UserName { get; set; }
      public byte[] PasswordHash { get; set; } = [];
      public byte[] PasswordSalt { get; set; } = [];

      public DateOnly DateOfBirth { get; set; }
      public required string KnownAs { get; set; }

      public DateTime Create { get; set; } = DateTime.UtcNow;
      public DateTime LastActive { get; set; } = DateTime.UtcNow;
      public required string Gender { get; set; }
      public string? Introduction { get; set; }
      public string? Interests { get; set; }
      public string? LookingFor { get; set; }
      public required string City { get; set; }
      public required string Country { get; set; }
      public List<Photo> Photos { get; set; } = [];
      public List<UploadFile> uploadFiles {get;set;} = [];
      public List<LikeUser> LikeByUser {get;set;} = [];
      public List<LikeUser> LikedUsers {get;set;} = [];


}
