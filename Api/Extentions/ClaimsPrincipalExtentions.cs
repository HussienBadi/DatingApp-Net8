using System.Security.Claims;

namespace Api.Extentions;

public static class ClaimsPrincipalExtentions
{
  public static string GetUsername(this ClaimsPrincipal user){

    var username = user.FindFirstValue(ClaimTypes.Name) 
    ?? throw new Exception("Can not get username from token");
        return username;

  }


  public static int GetUserId(this ClaimsPrincipal user){

    var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier) 
    ?? throw new Exception("Can not get username from token"));
        return userId;

  }
}
