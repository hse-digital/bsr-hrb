namespace HSEPortal.API.Extensions;
 
public static class StringExtensions
{
    public static string EscapeSingleQuote(this string value)
    {
        return value.Replace("'", "''");
    }
}