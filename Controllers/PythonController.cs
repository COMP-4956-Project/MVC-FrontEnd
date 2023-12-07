using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using MVC_Backend_Frontend.Models;
using MVC_Backend_Frontend;

namespace Backend.Controllers
{
    [ApiController]

    public class PythonController : ControllerBase
    {

        [Route("api/runPython")]
        [HttpPost]
        public IActionResult PostPythonFromJson([FromBody] BlockList blockInput)
        {
            Console.WriteLine(blockInput);
            try
            {
                PythonRunner pyRunner = new PythonRunner();
                string output = pyRunner.RunFromBlockList(blockInput);
                return Ok(output);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("api/parsePython")]
        [HttpPost]
        public IActionResult PostPythonCodeFromJson([FromBody] BlockList blockInput)
        {
            try
            {
                string code = "";
            if (blockInput != null && blockInput.blocks != null)
            {
                foreach (var block in blockInput.blocks)
                {
                    code += JsonParser.Parse(block) + "\n";
                }
            }
                return Ok(code);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}