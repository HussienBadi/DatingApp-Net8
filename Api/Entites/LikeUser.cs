using System;

namespace Api.Entites;

public class LikeUser
{
  public AppUser SourceUser { get; set; } = null!;
  public int SourceUserId { get; set; }
  public AppUser TargetUser { get; set; } = null!;
  public int TargetUserId { get; set; }
}
