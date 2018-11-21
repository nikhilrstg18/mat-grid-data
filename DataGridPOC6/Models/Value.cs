using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataGridPOC6.Models
{
    public class Value
    {
        public long Id { get; set; }
        public string ServiceTag { get; set; }
        public string HardwareId { get; set; }
        public string Username { get; set; }
        public string Status { get; set; }
        public int Ram { get; set; }
        public int CpuUsage { get; set; }
    }
}
