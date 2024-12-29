using System.ComponentModel.DataAnnotations;

namespace Api.DTOs;

public class RegisterDto
{
    
    [Required] public string UserName { get; set; } = string.Empty;
     public string? KnownAs { get; set; }
     public string? Gender { get; set; }
     public string? DateOfBirth { get; set; }
     public string? City { get; set; }
     public string? Country { get; set; }
    [Required]
    [StringLength(9,MinimumLength = 4)]
    public string Password { get; set; } =string.Empty;
}
