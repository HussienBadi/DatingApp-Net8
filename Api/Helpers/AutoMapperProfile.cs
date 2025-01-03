using Api.Data.Migrations;
using Api.DTOs;
using Api.Entites;
using Api.Extentions;
using AutoMapper;

namespace Api.Helpers;

public class AutoMapperProfile : Profile
{
   public AutoMapperProfile()
   {
     CreateMap<AppUser,MemberDto>()
     .ForMember(d=>d.Age,o=>o.MapFrom(s => s.DateOfBirth.CalculateAge()))
    .ForMember(d => d.PhotoUrl,o => o.MapFrom(s => s.Photos.FirstOrDefault(p =>p.IsMain)!.Url));

     CreateMap<Photo,PhotoDto>();

     CreateMap<UploadFile,UploadFileDto>();
     
     CreateMap<MemberUpdateDto,AppUser>();
     CreateMap<RegisterDto,AppUser>();

     CreateMap<string,DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
   }
}
