namespace Api.Helpers;
public class LikesParams : PaginationParams
{
  public int userID { get; set; }
  public required string  predicate { get; set; } = "liked";
}
