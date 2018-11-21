using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataGridPOC6.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataGridPOC6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly ValueContext _context;
        public ValuesController(ValueContext context)
        {
            _context = context;
            if (_context.Values.Count() == 0)
            {
                // Create mock data as collection<Value>

                for (int i = 1; i <= 600; i++)
                {
                    var isComplete = (i & 1) == 1 ? true : false;
                    var status = isComplete ? "Success" : "Pending";
                    _context.Values.Add(
                        new Value
                        {
                            ServiceTag = !isComplete ? "infiniteServicerTag" + i : null,
                            HardwareId = isComplete ? "infinite" + i : null,
                            Username = "Full Username" + i,
                            Status = status,
                            Ram = isComplete ? 100000 : 1000,
                            CpuUsage = !isComplete ? 100000 : 1000
                        });
                }

                _context.SaveChanges();
            }
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<Value>> Get()
        {
            return _context.Values.ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<Value> Get(int id)
        {
            return _context.Values.FirstOrDefault(v => v.Id == id);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<Value>> GetValuePage(int page, int pageSize, string sort, string query)
        {
            IEnumerable<Value> values = null;
            if(!string.IsNullOrWhiteSpace(sort) && !string.IsNullOrWhiteSpace(query))
            {
                values = sort == "desc" 
                    ? await _context.Values.AsQueryable()
                        .Where(x => x.ServiceTag.Contains(query))
                        .OrderByDescending(s => s.ServiceTag)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize).ToListAsync()
                    : await _context.Values.AsQueryable()
                        .Where(x => x.ServiceTag.Contains(query))
                        .OrderBy(s => s.ServiceTag)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync(); 

            }
            else if(!string.IsNullOrWhiteSpace(sort) && string.IsNullOrWhiteSpace(query))
            {
                values = sort == "desc"
                    ? await _context.Values.AsQueryable()
                        .OrderByDescending(s => s.ServiceTag)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize).ToListAsync()
                    : await _context.Values.AsQueryable()
                        .OrderBy(s => s.ServiceTag)
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
            }
            else if (string.IsNullOrWhiteSpace(sort) && !string.IsNullOrWhiteSpace(query))
            {
                values = await _context.Values.AsQueryable().Where(x => x.ServiceTag.Contains(query))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            }
            else
            {
                values = await _context.Values.AsQueryable().Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            }

            return values;
        }
    }
}
