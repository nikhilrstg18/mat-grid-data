using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataGridPOC6.Models
{
    public class ValueContext : DbContext
    {
        public ValueContext(DbContextOptions<ValueContext> options)
            : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }
    }
}
