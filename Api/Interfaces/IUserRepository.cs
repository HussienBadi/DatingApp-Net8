using System;
using Api.DTOs;
using Api.Entites;

namespace Api.Interfaces;

public interface IUserRepository
{
   void Update (AppUser user);
   Task<bool> SaveAllAsync();
   Task<IEnumerable<AppUser>> GetUsersAsync();
   Task<AppUser?> GetUserByIdAsync(int id);
   Task<AppUser?> GetUserByUsernameAsync(string userName);

   Task<IEnumerable<MemberDto?>> GetMembersAsync();
   Task<MemberDto?> GetMemberByUsernamesAsync(string userName);

}
