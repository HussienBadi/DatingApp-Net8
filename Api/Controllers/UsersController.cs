using System.Security.Claims;
using Api.Data;
using Api.DTOs;
using Api.Entites;
using Api.Extentions;
using Api.Helpers;
using Api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Authorize]
    public class UsersController(IUserRepository userRepository, IMapper mapper,
    IPhotoService photoService) : BaseApiController
    {
        // [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            userParams.CurrentUser = User.GetUsername();
            var users = await userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users);
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {

            var user = await userRepository.GetMemberByUsernamesAsync(username);

            if (user == null) return NotFound();

            return user;

        }

        [HttpPut]

        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {

            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return BadRequest("no user found");

             mapper.Map(memberUpdateDto, user);

            if (await userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Faild to update the user");
        }

        [HttpPost("add-photo")]

        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){

            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return BadRequest("Can not update the user");

            var result = await photoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0) photo.IsMain = true;
            
            user.Photos.Add(photo);
            if (await userRepository.SaveAllAsync()) 
            return CreatedAtAction(nameof(GetUser),new{username = user.UserName},mapper.Map<PhotoDto>(photo));

            return BadRequest("Problem adding photo");
        }

        [HttpPost("upload-file")]
        public async Task<ActionResult<UploadFile>> UploadFile(IFormFile file){

            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return BadRequest("user is not register");

            if(file == null || file.Length == 0) return BadRequest("No file to upload");
           
            try
            {
                // Read file data
                byte[] fileData;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    fileData = memoryStream.ToArray();
                }

                var theFile =  new UploadFile{
                    FileName= file.FileName,
                    ContentType = file.ContentType,
                    FileData = fileData,
                    AppUserId = user.Id,
                    AppUser = user
                };

                 user.uploadFiles.Add(theFile);

                 if (await userRepository.SaveAllAsync()) 
                 
                 return CreatedAtAction(nameof(GetUser),new{username = user.UserName},theFile);

                return Ok("File uploaded successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

        }

        [HttpPut("set-main-photo/{photoId:int}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){

            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)  return BadRequest("no user found");

            var photo =  user.Photos.FirstOrDefault(p=> p.Id == photoId);

              if (photo == null || photo.IsMain)  return BadRequest("can update the photo");

              var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
               if(currentMain != null)  currentMain.IsMain = false;
              photo.IsMain = true;

              if(await userRepository.SaveAllAsync())
                return NoContent();

              return BadRequest("Problem seting the main photo");





        }

        [HttpDelete("delete-photo/{photoId:int}")]
        public async Task<ActionResult> DeletePhoto(int photoId){

            var user =await userRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return BadRequest("User not found");

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if(photo == null || photo.IsMain) return BadRequest("Photo can not deleted");

            if(photo.PublicId != null){
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if(result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if(await userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting photo");


        }
        

        
    }
}
