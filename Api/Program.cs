using Api.Extentions;
using Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddServiceExtention(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(x=> x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200","https://localhost:4200"));

//Ordering is important
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
