
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Jhipster.Domain.Entities;
using Jhipster.Crosscutting.Enums;
using Jhipster.Crosscutting.Exceptions;
using Jhipster.Dto;
using Jhipster.Web.Extensions;
using Jhipster.Web.Filters;
using Jhipster.Web.Rest.Utilities;
using AutoMapper;
using System.Linq;
using Jhipster.Domain.Repositories.Interfaces;
using Jhipster.Domain.Services.Interfaces;
using Jhipster.Infrastructure.Web.Rest.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Jhipster.Controllers
{
    [Authorize]
    [Route("api/log-temperatures")]
    [ApiController]
    public class LogTemperaturesController : ControllerBase
    {
        private const string EntityName = "logTemperature";
        private readonly ILogger<LogTemperaturesController> _log;
        private readonly IMapper _mapper;
        private readonly ILogTemperatureRepository _logTemperatureRepository;

        public LogTemperaturesController(ILogger<LogTemperaturesController> log,
        IMapper mapper,
        ILogTemperatureRepository logTemperatureRepository)
        {
            _log = log;
            _mapper = mapper;
            _logTemperatureRepository = logTemperatureRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<LogTemperatureDto>> CreateLogTemperature([FromBody] LogTemperatureDto logTemperatureDto)
        {
            _log.LogDebug($"REST request to save LogTemperature : {logTemperatureDto}");
            if (logTemperatureDto.Id != 0)
                throw new BadRequestAlertException("A new logTemperature cannot already have an ID", EntityName, "idexists");

            LogTemperature logTemperature = _mapper.Map<LogTemperature>(logTemperatureDto);
            await _logTemperatureRepository.CreateOrUpdateAsync(logTemperature);
            await _logTemperatureRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLogTemperature), new { id = logTemperature.Id }, logTemperature)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, logTemperature.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateLogTemperature(long id, [FromBody] LogTemperatureDto logTemperatureDto)
        {
            _log.LogDebug($"REST request to update LogTemperature : {logTemperatureDto}");
            if (logTemperatureDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != logTemperatureDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            LogTemperature logTemperature = _mapper.Map<LogTemperature>(logTemperatureDto);
            await _logTemperatureRepository.CreateOrUpdateAsync(logTemperature);
            await _logTemperatureRepository.SaveChangesAsync();
            return Ok(logTemperature)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, logTemperature.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogTemperatureDto>>> GetAllLogTemperatures(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of LogTemperatures");
            var result = await _logTemperatureRepository.QueryHelper()
                .Include(logTemperature => logTemperature.Device)
                .GetPageAsync(pageable);
            var page = new Page<LogTemperatureDto>(result.Content.Select(entity => _mapper.Map<LogTemperatureDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<LogTemperatureDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLogTemperature([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get LogTemperature : {id}");
            var result = await _logTemperatureRepository.QueryHelper()
                .Include(logTemperature => logTemperature.Device)
                .GetOneAsync(logTemperature => logTemperature.Id == id);
            LogTemperatureDto logTemperatureDto = _mapper.Map<LogTemperatureDto>(result);
            return ActionResultUtil.WrapOrNotFound(logTemperatureDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogTemperature([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete LogTemperature : {id}");
            await _logTemperatureRepository.DeleteByIdAsync(id);
            await _logTemperatureRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
