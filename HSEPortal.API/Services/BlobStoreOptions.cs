using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSE.BsrHelp.API.Services
{
    public class BlobStoreOptions
    {
        public const string BlobStore = "BlobStore";

        public string ConnectionString { get; set; }
        public string ContainerName { get; set; }
    }
}
