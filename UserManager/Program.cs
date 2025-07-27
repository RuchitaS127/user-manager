using Microsoft.EntityFrameworkCore;
using UserManager.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ Get connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// ✅ Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// ✅ CORS setup for Angular (port 4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ✅ Add API controllers
builder.Services.AddControllers();

// ❌ No Swagger here
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ HTTPS redirection
app.UseHttpsRedirection();

// ✅ CORS for Angular frontend
app.UseCors("AllowFrontend");

// ✅ Authorization middleware (if needed later)
app.UseAuthorization();

// ✅ Route API controllers
app.MapControllers();

app.Run();
