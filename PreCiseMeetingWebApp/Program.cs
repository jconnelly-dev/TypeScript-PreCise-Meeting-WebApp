var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

/*
 * This middleware looks for a default file in your web root (like index.html, index.htm, or default.html) 
 *  and serves it when a directory is requested in the browser. It’s useful for single-page applications (SPA) 
 *  or when you want a specific file to be served by default, such as an index.html when visiting the root URL (/)
 */
app.UseDefaultFiles();

/*
 * This middleware serves static files from the "wwwroot" folder. It makes sure that your JavaScript, CSS, and 
 *  image files are available to the client-side. The wwwroot folder in .NET is publicly served, meaning anything 
 *  that is left there becomes accessible by users. 
 */
app.UseStaticFiles();

app.Run();