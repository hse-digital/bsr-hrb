using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HSEPortal.API.Services;

public interface IFileReaderService
{
    FileStream GetFileStream(string filePath);
    object DeserializeJsonFile<T>(FileStream stream);
}

public class FileReaderService : IFileReaderService
{

    public FileReaderService()
    {
    }

    public FileStream GetFileStream(string fullPath)
    {
        if (File.Exists(fullPath))
        {
            return File.OpenRead(fullPath);
        }
        return null;
    }

    public object DeserializeJsonFile<T>(FileStream stream)
    {
        if (stream == null) return null;
        return JsonSerializer.Deserialize<T>(stream);
    }


}
