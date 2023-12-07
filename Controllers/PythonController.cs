using System;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using MVC_Backend_Frontend.Models;
using MVC_Backend_Frontend;
using Newtonsoft.Json;
namespace Backend.Controllers;


    [ApiController]

    public class PythonController : ControllerBase
    {
        [HttpPost]
       public async Task<IActionResult> PostPythonFromJson([FromBody] BlockList blockInput)
{
    Console.WriteLine(blockInput);
    try
    {
        PythonRunner pyRunner = new PythonRunner();
        string output = pyRunner.RunFromBlockList(blockInput);

        // Sending the output to the API as an error message for demonstration purposes

        return Ok(output);
    }
    catch (Exception e)
    {
        string error = e.Message;
        string apiResponse = await SendErrorMessageToExternalAPI(error);
        Console.WriteLine(apiResponse);
        var response = JsonConvert.SerializeObject(apiResponse);
        return BadRequest(response); 
    }
}


       private async Task<string> SendErrorMessageToExternalAPI(string errorMessage)
{
    using (HttpClient client = new HttpClient())
    {
        try
        {
            var apiUrl = "https://codecraftapierr.azurewebsites.net/api/api/send-err";
            var content = new StringContent("{\"message\": \"" + errorMessage + "\"}", Encoding.UTF8, "application/json");

            var response = await client.PostAsync(apiUrl, content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return responseContent;
            }
            else
            {
                string errorResponse = $"API call failed with status code: {response.StatusCode}";
                // Log or handle errorResponse
                return errorResponse;
            }
        }
        catch (HttpRequestException ex)
        {
            string requestError = $"HTTP Request Error: {ex.Message}";
            // Log or handle requestError
            return requestError;
        }
        catch (Exception ex)
        {
            string otherError = $"An error occurred: {ex.Message}";
            // Log or handle otherError
            return otherError;
        }
    }
}

    }


