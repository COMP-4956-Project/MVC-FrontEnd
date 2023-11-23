

using MVC_Backend_Frontend;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using MVC_Backend_Frontend.Models;
using MVC_Backend_Frontend;

namespace BackendUnitTestProject;

public class PythonRunnerTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void PythonRunnerTest1()
    {
        string expectedResult;
        if (OperatingSystem.IsWindows())
        {
            expectedResult = "donkey\r\n";
        }
        else
        {
            expectedResult = "donkey\n";
        }
        string pythonCode = "print('donkey')";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        Console.WriteLine(result);
        Assert.That(result, Is.EqualTo(expectedResult));
    }
    
    [Test]
    public void PythonRunnerTest2()
    {
        string expectedResult;
        if (OperatingSystem.IsWindows())
        {
            expectedResult = "donkey\r\ndonkey2\r\n";
        }
        else
        {
            expectedResult = "donkey\r\ndonkey2\r\n";
        }
        string pythonCode = "print('donkey')\nprint('donkey2')";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        Console.WriteLine(result);
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
    
    [Test]
    public void PythonRunnerTest3()
    {
        string expectedResult = "donkey\ndonkey2\n0\n1\n2\n3\n";
        string pythonCode = "i = 0\nprint('donkey')\nprint('donkey2')\nwhile(i < 4):\n\tprint(i)\n\ti += 1";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        result = result.Replace("\r", "");
        Console.WriteLine(result);
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
}