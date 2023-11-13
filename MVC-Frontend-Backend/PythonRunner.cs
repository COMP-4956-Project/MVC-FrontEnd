using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using IronPython.Hosting;
using MVC_Backend_Frontend;
using MVC_Backend_Frontend.Models;

namespace MVC_Backend_Frontend
{
    public class PythonRunner
    {

        public string RunFromString(string code)
        {
            var engine = Python.CreateEngine();
            var scope = engine.CreateScope();

            // Redirect the standard output to capture Python's print statements
            var stream = new MemoryStream();
            engine.Runtime.IO.SetOutput(stream, Encoding.UTF8);

            var sourceCode = engine.CreateScriptSourceFromString(code);
            sourceCode.Execute(scope);

            // Retrieve the captured output
            stream.Position = 0; // Reset the stream position
            using var reader = new StreamReader(stream, Encoding.UTF8);
            var capturedOutput = reader.ReadToEnd();
            return capturedOutput;
        }

    }

    class BlockListRunner : PythonRunner
    {
        public string RunFromBlockList(BlockList blockList)
        {
            string code = BlockListParser.ParseBlockList(blockList);
            var result = RunFromString(code);
            Console.WriteLine(result);
            return result;
        }
    }
}