
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Jhipster.Domain.Entities;
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
    [Route("api/notification-groups")]
    [ApiController]
    public class NotificationGroupsController : ControllerBase
    {
        private const string EntityName = "notificationGroup";
        private readonly ILogger<NotificationGroupsController> _log;
        private readonly IMapper _mapper;
        private readonly INotificationGroupRepository _notificationGroupRepository;

        public NotificationGroupsController(ILogger<NotificationGroupsController> log,
        IMapper mapper,
        INotificationGroupRepository notificationGroupRepository)
        {
            _log = log;
            _mapper = mapper;
            _notificationGroupRepository = notificationGroupRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<NotificationGroupDto>> CreateNotificationGroup([FromBody] NotificationGroupDto notificationGroupDto)
        {
            _log.LogDebug($"REST request to save NotificationGroup : {notificationGroupDto}");
            if (notificationGroupDto.Id != 0)
                throw new BadRequestAlertException("A new notificationGroup cannot already have an ID", EntityName, "idexists");

            NotificationGroup notificationGroup = _mapper.Map<NotificationGroup>(notificationGroupDto);
            await _notificationGroupRepository.CreateOrUpdateAsync(notificationGroup);
            await _notificationGroupRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNotificationGroup), new { id = notificationGroup.Id }, notificationGroup)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, notificationGroup.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateNotificationGroup(long id, [FromBody] NotificationGroupDto notificationGroupDto)
        {
            _log.LogDebug($"REST request to update NotificationGroup : {notificationGroupDto}");
            if (notificationGroupDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != notificationGroupDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            NotificationGroup notificationGroup = _mapper.Map<NotificationGroup>(notificationGroupDto);
            await _notificationGroupRepository.CreateOrUpdateAsync(notificationGroup);
            await _notificationGroupRepository.SaveChangesAsync();
            return Ok(notificationGroup)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, notificationGroup.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationGroupDto>>> GetAllNotificationGroups(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of NotificationGroups");
            var result = await _notificationGroupRepository.QueryHelper()
                .GetPageAsync(pageable);
            var page = new Page<NotificationGroupDto>(result.Content.Select(entity => _mapper.Map<NotificationGroupDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<NotificationGroupDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationGroup([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get NotificationGroup : {id}");
            var result = await _notificationGroupRepository.QueryHelper()
                .GetOneAsync(notificationGroup => notificationGroup.Id == id);
            NotificationGroupDto notificationGroupDto = _mapper.Map<NotificationGroupDto>(result);
            return ActionResultUtil.WrapOrNotFound(notificationGroupDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationGroup([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete NotificationGroup : {id}");
            await _notificationGroupRepository.DeleteByIdAsync(id);
            await _notificationGroupRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
