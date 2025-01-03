using Api.Data.Migrations;
using Api.Entites;

namespace Api.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public int Age { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? PhotoUrl { get; set; }
    public string? KnownAs { get; set; }
    public DateTime Create { get; set; }
    public DateTime LastActive { get; set; }
    public string? Gender { get; set; }
    public string? Introduction { get; set; }
    public string? Interests { get; set; }
    public string? LookingFor { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public List<PhotoDto>? Photos { get; set; }
    public List<UploadFileDto>? uploadFiles { get; set; }

}
