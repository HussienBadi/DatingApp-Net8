using Api.Entites;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<AppUser>  Users { get; set; }
    public required DbSet<UploadFile>  UploadFiles { get; set; }
}
