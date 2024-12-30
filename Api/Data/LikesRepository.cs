using System;
using Api.DTOs;
using Api.Entites;
using Api.Helpers;
using Api.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class LikesRepository(DataContext context,IMapper mapper) : ILikesRepository
{
    public void AddLike(LikeUser like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(LikeUser like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
    {
        return await context.Likes
        .Where(l => l.SourceUserId == currentUserId)
        .Select(l=>l.TargetUserId)
        .ToListAsync();
          
    }

    public async Task<LikeUser?> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await context.Likes.FindAsync(sourceUserId,targetUserId);
    }

    public async Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams)
    {
        var likes = context.Likes.AsQueryable();
        IQueryable<MemberDto> query;

        switch (likesParams.predicate)
        {
            case "liked":
               query = likes
                 .Where(l=>l.SourceUserId == likesParams.userID)
                 .Select(l=>l.TargetUser)
                 .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                 break;

            case "likedBy":
                query =  likes
                 .Where(l=>l.TargetUserId == likesParams.userID)
                 .Select(l=>l.SourceUser)
                 .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                 break;

            default:

            var likeIds = await GetCurrentUserLikeIds(likesParams.userID);

             query = likes
                 .Where(l=>l.TargetUserId == likesParams.userID && likeIds.Contains(l.SourceUserId))
                 .Select(l=>l.SourceUser)
                 .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                 break;

        }

        return await PagedList<MemberDto>.CreateAsync(query,likesParams.PageNumber,likesParams.PageSize);
       
    }

    public async Task<bool> SaveChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
