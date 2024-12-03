using System;
using Api.Entites;

namespace Api.Interfaces;

public interface ITokenService
{
  string CreateToken(AppUser user);
}
