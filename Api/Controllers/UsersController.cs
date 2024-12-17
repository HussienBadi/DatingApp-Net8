using Api.Data;
using Api.DTOs;
using Api.Entites;
using Api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
   [Authorize]
    public class UsersController(IUserRepository userRepository) : BaseApiController
    {
        // [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(){
            var users = await userRepository.GetMembersAsync();
            return Ok(users);
        }
       
         [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username){

            var user = await userRepository.GetMemberByUsernamesAsync(username);
            if(user == null) return NotFound();

            return user;

        }
    }
}
