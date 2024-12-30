using Api.Entites;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<AppUser>  Users { get; set; }
    public required DbSet<UploadFile>  UploadFiles { get; set; }

    public required DbSet<LikeUser> Likes { get; set; }


    protected override void OnModelCreating(ModelBuilder Builder)
    {
        base.OnModelCreating(Builder);

        Builder.Entity<LikeUser>()
        .HasKey(k => new {k.SourceUserId,k.TargetUserId});

        Builder.Entity<LikeUser>()
        .HasOne(s =>s.SourceUser)
        .WithMany(l =>l.LikedUsers)
        .HasForeignKey(s=>s.SourceUserId)
        .OnDelete(DeleteBehavior.Cascade);

         Builder.Entity<LikeUser>()
        .HasOne(s =>s.TargetUser)
        .WithMany(l =>l.LikeByUser)
        .HasForeignKey(s=>s.TargetUserId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}
