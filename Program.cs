WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
WebApplication app = builder.Build();

// Get the port from env, or default to 8080 (i.e. running in Heroku port is assigned via environment)
string port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://+:{port}");

app.UseDefaultFiles();  // looks for index.html
app.UseStaticFiles();   // serves files from wwwroot
app.MapFallbackToFile("index.html"); // for SPA routing

app.Run();