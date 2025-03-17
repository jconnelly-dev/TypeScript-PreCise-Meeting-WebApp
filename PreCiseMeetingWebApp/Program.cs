var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Enable serving static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();