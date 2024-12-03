using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Entites;
using Api.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace Api.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
       var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey Exception");
       if (tokenKey.Length < 64) throw new Exception("tokenKey Length needs to be longer");

       var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

       var claims = new List<Claim>{
        new(ClaimTypes.NameIdentifier,user.UserName)
       };

       var signingCredentials = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

       var tokenDescriptor = new SecurityTokenDescriptor{
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = signingCredentials
       };

       var tokenHandler = new JwtSecurityTokenHandler();
       var token = tokenHandler.CreateToken(tokenDescriptor);
       return tokenHandler.WriteToken(token);
    }
}
