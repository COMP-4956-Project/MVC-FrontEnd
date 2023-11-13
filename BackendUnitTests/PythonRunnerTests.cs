

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
        string pythonCode = "print('donkey')";
        string expectedResult = "donkey\n";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        Console.WriteLine(result);
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
    
    [Test]
    public void PythonRunnerTest2()
    {
        string pythonCode = "print('donkey')\nprint('donkey2')";
        string expectedResult = "donkey\ndonkey2\n";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        Console.WriteLine(result);
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
    
    [Test]
    public void PythonRunnerTest3()
    {
        string pythonCode = "i = 0\nprint('donkey')\nprint('donkey2')\nwhile(i < 4):\n\tprint(i)\n\ti += 1";
        Console.WriteLine(pythonCode);
        string expectedResult = "donkey\ndonkey2\n0\n1\n2\n3\n";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        Console.WriteLine(result);
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
}