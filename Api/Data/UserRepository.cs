using System;
using Api.DTOs;
using Api.Entites;
using Api.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class UserRepository(DataContext context,IMapper mapper) : IUserRepository
{
    public async Task<MemberDto?> GetMemberByUsernamesAsync(string userName)
    {
        return await context.Users
        .Where(u => u.UserName == userName)
        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
        .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto?>> GetMembersAsync()
    {
        return await context.Users
        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await context.Users.FindAsync(id);;
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string userName)
    {
        return await context.Users
        .Include(p =>p.Photos)
        .SingleOrDefaultAsync(u => u.UserName == userName);;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
       return await context.Users
       .Include(p =>p.Photos).ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
       return await context.SaveChangesAsync() > 0 ;
    }
 

    public void Update(AppUser user)
    {
       context.Entry(user).State = EntityState.Modified;
    }
}
