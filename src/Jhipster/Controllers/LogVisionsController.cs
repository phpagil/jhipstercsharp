
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
    [Route("api/log-visions")]
    [ApiController]
    public class LogVisionsController : ControllerBase
    {
        private const string EntityName = "logVision";
        private readonly ILogger<LogVisionsController> _log;
        private readonly IMapper _mapper;
        private readonly ILogVisionRepository _logVisionRepository;

        public LogVisionsController(ILogger<LogVisionsController> log,
        IMapper mapper,
        ILogVisionRepository logVisionRepository)
        {
            _log = log;
            _mapper = mapper;
            _logVisionRepository = logVisionRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<LogVisionDto>> CreateLogVision([FromBody] LogVisionDto logVisionDto)
        {
            _log.LogDebug($"REST request to save LogVision : {logVisionDto}");
            if (logVisionDto.Id != 0)
                throw new BadRequestAlertException("A new logVision cannot already have an ID", EntityName, "idexists");

            LogVision logVision = _mapper.Map<LogVision>(logVisionDto);
            await _logVisionRepository.CreateOrUpdateAsync(logVision);
            await _logVisionRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLogVision), new { id = logVision.Id }, logVision)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, logVision.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateLogVision(long id, [FromBody] LogVisionDto logVisionDto)
        {
            _log.LogDebug($"REST request to update LogVision : {logVisionDto}");
            if (logVisionDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != logVisionDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            LogVision logVision = _mapper.Map<LogVision>(logVisionDto);
            await _logVisionRepository.CreateOrUpdateAsync(logVision);
            await _logVisionRepository.SaveChangesAsync();
            return Ok(logVision)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, logVision.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogVisionDto>>> GetAllLogVisions(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of LogVisions");
            var result = await _logVisionRepository.QueryHelper()
                .Include(logVision => logVision.Device)
                .GetPageAsync(pageable);
            var page = new Page<LogVisionDto>(result.Content.Select(entity => _mapper.Map<LogVisionDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<LogVisionDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLogVision([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get LogVision : {id}");
            var result = await _logVisionRepository.QueryHelper()
                .Include(logVision => logVision.Device)
                .GetOneAsync(logVision => logVision.Id == id);
            LogVisionDto logVisionDto = _mapper.Map<LogVisionDto>(result);
            return ActionResultUtil.WrapOrNotFound(logVisionDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogVision([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete LogVision : {id}");
            await _logVisionRepository.DeleteByIdAsync(id);
            await _logVisionRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
