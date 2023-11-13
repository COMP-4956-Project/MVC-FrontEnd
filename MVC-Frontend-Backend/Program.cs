using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MVC_Backend_Frontend;
using MVC_Backend_Frontend.Models;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

string json =
    "{\"blocks\":[{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_variable\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":0}},{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"Hello World!\"}},{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"operation\",\"operation\":\"add\",\"A\":{\"type\":\"value\",\"field\":\"num\",\"num\":1},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":2}}},{\"type\":\"control\",\"instruction\":\"while\",\"input\":{\"type\":\"logic\",\"logic\":\"less\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":5}},\"children\":[{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"hello\"}},{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_add\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":1}}]}]}";
BlockList blockList = Newtonsoft.Json.JsonConvert.DeserializeObject<BlockList>(json);
string codeResult = Regex.Escape(BlockListParser.ParseBlockList(blockList));
Console.WriteLine(BlockListParser.ParseBlockList(blockList));
Console.WriteLine(codeResult);
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

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

app.Run();
