using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MVC_Backend_Frontend.Models;

namespace MVC_Backend_Frontend.Controllers;

[ApiController]
[Route("api")]
public class ApiController : Controller
{
    private readonly IMongoClient _mongoClient;

    public ApiController(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
    }

    [HttpGet("getUserId")]
    public IActionResult YourAction([FromQuery] string email)
    {
        var database = _mongoClient.GetDatabase("CodeCraft");
        var userCollection = database.GetCollection<MongoUser>("users");
        var filter = Builders<MongoUser>.Filter.Eq("Email", email);
        var user = userCollection.Find(filter).FirstOrDefault();
        return Ok(new { Message = user.Id });
    }
}
