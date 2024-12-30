using Api.DTOs;
using Api.Entites;
using Api.Extentions;
using Api.Helpers;
using Api.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController(ILikesRepository likesRepository) : BaseApiController
    {
        [HttpPost("{targetUserId:int}")]
        public async Task<ActionResult> ToggleLikes(int targetUserId){

            var sourceUserId = User.GetUserId();

            if (sourceUserId == targetUserId) return BadRequest("Cannot like yourself");

            var existingLike = await likesRepository.GetUserLike(sourceUserId,targetUserId);

            if (existingLike == null){

                var like = new LikeUser{
                    SourceUserId = sourceUserId,
                    TargetUserId = targetUserId
                };
                 likesRepository.AddLike(like);
            }else{

                likesRepository.DeleteLike(existingLike);
            }

            if(await likesRepository.SaveChanges()) return Ok();

            return BadRequest("Faild to update like");
        }

     [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds(){

        return Ok(await likesRepository.GetCurrentUserLikeIds(User.GetUserId()));
     }

       [HttpGet]
     public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery] LikesParams likesParams){

        likesParams.userID = User.GetUserId();
        var users = await likesRepository.GetUserLikes(likesParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
     }


    }

  
}
