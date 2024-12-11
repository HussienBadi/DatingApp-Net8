using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Entites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{

    public class BuggyController(DataContext context) : BaseApiController
    {
        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetAuth()
        {
            return "";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var user = context.Users.Find(-1);
            if(user == null) return NotFound();
            return user;
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var user = context.Users.Find(-1) ?? throw new Exception("Bad thing has happend");
            return "";
        }

        

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequset()
        {
            return BadRequest("This was not a good request");
        }
    }
}