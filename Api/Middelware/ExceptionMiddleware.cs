using System.Net;
using System.Text.Json;
using Api.Errors;

namespace Api.Middelware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
  public async Task InvokeAsync(HttpContext context)
  {
    try
    {
      await next(context);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, ex.Message);
      context.Response.ContentType = "application/json";
      context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
      //1-
      var responce = env.IsDevelopment()
      ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
      : new ApiException(context.Response.StatusCode, ex.Message, "Internal Server Erorr");

      // 2-
      var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

      var josn = JsonSerializer.Serialize(responce, options);
      await context.Response.WriteAsync(josn);

    }
  }
}
