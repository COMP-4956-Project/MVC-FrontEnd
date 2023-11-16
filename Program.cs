using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MVC_Backend_Frontend;
using MVC_Backend_Frontend.Data;
using MVC_Backend_Frontend.Models;
using System.Text.Json;
using System.Text.Json.Nodes;

string json = File.ReadAllText(@"./test3.json");
var pythonRunner = new PythonRunner();
pythonRunner.RunFromBlockList(JsonSerializer.Deserialize<BlockList>(json)!);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

    // Routing to the Help page
app.MapControllerRoute(
    name: "help",
    pattern: "{controller=Help}/{action=Help}/{id?}");

// Routing to the Privacy page
app.MapControllerRoute(
    name: "privacy",
    pattern: "{controller=Privacy}/{action=Privacy}/{id?}");

// Routing to the Login page
app.MapControllerRoute(
    name: "login",
    pattern: "{controller=Login}/{action=Login}/{id?}");

// Routing to the Logout page
app.MapControllerRoute(
    name: "logout",
    pattern: "{controller=Logout}/{action=Logout}/{id?}");

app.Run();
