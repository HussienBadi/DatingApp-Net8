using System;

namespace Api.DTOs;

public class UserDto
{
   public required string Username { get; set; }
   public required string Token { get; set; }
   public string? photoUrl { get; set; }
}
