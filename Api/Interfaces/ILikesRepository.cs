using System;
using Api.DTOs;
using Api.Entites;
using Api.Helpers;

namespace Api.Interfaces;

public interface ILikesRepository
{
  Task<LikeUser?> GetUserLike(int sourceUserId,int targetUserId);
  Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
  Task<IEnumerable<int>> GetCurrentUserLikeIds(int cureentUserId);

  void DeleteLike(LikeUser like);
  void AddLike(LikeUser like);
  Task<bool> SaveChanges();

}
