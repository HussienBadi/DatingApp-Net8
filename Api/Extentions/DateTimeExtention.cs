using System;

namespace Api.Extentions;

public static class DateTimeExtention
{
   public static int CalculateAge(this DateOnly dob){

    var today = DateOnly.FromDateTime(DateTime.Now);

    var age = today.Year - dob.Year;

    if(dob > today.AddYears(-age)) age --;  
    
    return age;
   }
}
