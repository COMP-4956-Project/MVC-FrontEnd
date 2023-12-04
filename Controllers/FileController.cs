using Microsoft.AspNetCore.Mvc;
using System.Text;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using MVC_Backend_Frontend.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MVC_Backend_Frontend.Controllers;

[Route("file")]
public class FileController : Controller
{
    private IMongoDatabase db;
    private IGridFSBucket gridFS;
    private IMongoClient _mongoClient;


    public FileController(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
        db = _mongoClient.GetDatabase("CodeCraft");
        gridFS = new GridFSBucket(db);
    }

    [HttpPost]
    [Route("uploadtext")]
    public ActionResult UploadText([FromBody] UploadTextModel model)
    {
        try
        {
            Console.WriteLine($"Received POST request to uploadtext. Name: {model.Name}, Content Length: {model.Content}");

            if (model.Content == null)
            {
                return BadRequest("Content cannot be null");
            }

            // Upload the file
            byte[] contentBytes = System.Text.Encoding.UTF8.GetBytes(model.Content);
            var stream = new MemoryStream(contentBytes);
            ObjectId fileId = gridFS.UploadFromStream(model.Name, stream);

            // Get the MongoUser document for the current user
            var usersCollection = db.GetCollection<MongoUser>("users"); // replace "users" with the actual collection name
            var userFilter = Builders<MongoUser>.Filter.Eq(u => u.Email, User.Identity.Name); // replace "Username" with the actual property name
            var user = usersCollection.Find(userFilter).FirstOrDefault();

            if (user != null)
            {
                // Add the file name to the user's projects and save the updated user document
                user.Projects.Add(model.Name);
                var userUpdate = Builders<MongoUser>.Update.Set(u => u.Projects, user.Projects);
                usersCollection.UpdateOne(userFilter, userUpdate);
            }

            return RedirectToAction("Index", "Home");
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return StatusCode(500);
        }
    }



    [HttpGet]
    public ActionResult DisplayFileContents(string fileName)
    {
        using (var stream = gridFS.OpenDownloadStreamByName(fileName))
        {
            var reader = new StreamReader(stream);
            var fileContent = reader.ReadToEnd();
            ViewBag.FileName = fileName;
            return View((object)fileContent);
        }
    }

    [HttpPost]
    [Route("savefile")]
    public ActionResult SaveFile(string fileName, string fileContents)
    {
        DeleteFile(fileName); // Delete the existing file

        // Create a new file with the updated content
        using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(fileContents)))
        {
            gridFS.UploadFromStream(fileName, stream);
        }

        return RedirectToAction("Index");
    }

    [HttpDelete]
    public ActionResult DeleteFile(string fileName)
    {
        var filter = Builders<GridFSFileInfo>.Filter.Eq(x => x.Filename, fileName);
        var fileInfo = gridFS.Find(filter).FirstOrDefault();

        if (fileInfo != null)
        {
            gridFS.Delete(fileInfo.Id);
        }

        return RedirectToAction("Index");
    }

    [HttpGet]
    [Route("showAllFiles")]
    public List<string> ListAllFiles()
    {
        var filter = Builders<GridFSFileInfo>.Filter.Empty;
        var filesInfo = gridFS.Find(filter).ToList();

        List<string> fileNames = new List<string>();
        foreach (var fileInfo in filesInfo)
        {
            fileNames.Add(fileInfo.Filename);
        }

        return fileNames;
    }

    // This is for showing all the projects of the logged in user
    [HttpGet]
    [Route("showAllMyFiles")]
    public ActionResult<List<string>> ListAllUserFiles()
    {
        try
        {
            var usersCollection = db.GetCollection<MongoUser>("users");
            var userFilter = Builders<MongoUser>.Filter.Eq(u => u.Email, User.Identity.Name);
            var user = usersCollection.Find(userFilter).FirstOrDefault();
            if (user != null)
            {
                return Ok(new { Projects = user.Projects });
            }
            return Ok(new { Projects = new List<string>() });
        }
        catch (Exception ex)
        {
            return BadRequest(new { ErrorMessage = ex.Message });
        }
    }



}