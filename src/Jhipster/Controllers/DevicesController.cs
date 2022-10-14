
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
    [Route("api/devices")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private const string EntityName = "device";
        private readonly ILogger<DevicesController> _log;
        private readonly IMapper _mapper;
        private readonly IDeviceRepository _deviceRepository;

        public DevicesController(ILogger<DevicesController> log,
        IMapper mapper,
        IDeviceRepository deviceRepository)
        {
            _log = log;
            _mapper = mapper;
            _deviceRepository = deviceRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<DeviceDto>> CreateDevice([FromBody] DeviceDto deviceDto)
        {
            _log.LogDebug($"REST request to save Device : {deviceDto}");
            if (deviceDto.Id != 0)
                throw new BadRequestAlertException("A new device cannot already have an ID", EntityName, "idexists");

            Device device = _mapper.Map<Device>(deviceDto);
            await _deviceRepository.CreateOrUpdateAsync(device);
            await _deviceRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDevice), new { id = device.Id }, device)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, device.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateDevice(long id, [FromBody] DeviceDto deviceDto)
        {
            _log.LogDebug($"REST request to update Device : {deviceDto}");
            if (deviceDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != deviceDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Device device = _mapper.Map<Device>(deviceDto);
            await _deviceRepository.CreateOrUpdateAsync(device);
            await _deviceRepository.SaveChangesAsync();
            return Ok(device)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, device.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceDto>>> GetAllDevices(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Devices");
            var result = await _deviceRepository.QueryHelper()
                .Include(device => device.ProductionLine)
                .Include(device => device.NotificationGroup)
                .GetPageAsync(pageable);
            var page = new Page<DeviceDto>(result.Content.Select(entity => _mapper.Map<DeviceDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<DeviceDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDevice([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Device : {id}");
            var result = await _deviceRepository.QueryHelper()
                .Include(device => device.ProductionLine)
                .Include(device => device.NotificationGroup)
                .GetOneAsync(device => device.Id == id);
            DeviceDto deviceDto = _mapper.Map<DeviceDto>(result);
            return ActionResultUtil.WrapOrNotFound(deviceDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Device : {id}");
            await _deviceRepository.DeleteByIdAsync(id);
            await _deviceRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
