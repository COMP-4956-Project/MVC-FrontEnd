using Microsoft.AspNetCore.Mvc;
using System.Text;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using MVC_Backend_Frontend.Models;

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
    public ActionResult UploadText(string name, string content)
    {
        if (string.IsNullOrEmpty(name))
        {
        ModelState.AddModelError("name", "Name cannot be null or empty.");
        return View();
        }

        var fileName = name + ".json";
        var filter = Builders<GridFSFileInfo>.Filter.Eq(x => x.Filename, fileName);
        var fileExists = gridFS.Find(filter).Any();

        if (fileExists)
        {
        ModelState.AddModelError("name", "A file with this name already exists.");
        return View();
        }

        byte[] contentBytes = System.Text.Encoding.UTF8.GetBytes(content);
        var stream = new MemoryStream(contentBytes);

        ObjectId fileId = gridFS.UploadFromStream(fileName, stream);

        return RedirectToAction("Index");
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
}