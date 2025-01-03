using System.Security.Cryptography;
using System.Text;
using Api.Data;
using Api.DTOs;
using Api.Entites;
using Api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController(DataContext context, ITokenService tokenService,
    IMapper mapper) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
        {

            if (await UserExsist(dto.UserName)) return BadRequest("User is taken");

            var user = mapper.Map<AppUser>(dto);

            using var hmac = new HMACSHA512();
            user.UserName = dto.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            user.PasswordSalt = hmac.Key;

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(RegisterDto dto)
        {

            var user = await context.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == dto.UserName.ToLower());

            if (user == null) return Unauthorized("Invalid User Name");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));

            for (int i = 0; i < computeHash.Length; i++)
            {
                if (computeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = tokenService.CreateToken(user),
                photoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };

        }

        private async Task<bool> UserExsist(string username)
        {
            return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
    }
}
