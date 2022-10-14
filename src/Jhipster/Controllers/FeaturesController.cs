
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
    [Route("api/features")]
    [ApiController]
    public class FeaturesController : ControllerBase
    {
        private const string EntityName = "features";
        private readonly ILogger<FeaturesController> _log;
        private readonly IMapper _mapper;
        private readonly IFeaturesRepository _featuresRepository;

        public FeaturesController(ILogger<FeaturesController> log,
        IMapper mapper,
        IFeaturesRepository featuresRepository)
        {
            _log = log;
            _mapper = mapper;
            _featuresRepository = featuresRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<FeaturesDto>> CreateFeatures([FromBody] FeaturesDto featuresDto)
        {
            _log.LogDebug($"REST request to save Features : {featuresDto}");
            if (featuresDto.Id != 0)
                throw new BadRequestAlertException("A new features cannot already have an ID", EntityName, "idexists");

            Features features = _mapper.Map<Features>(featuresDto);
            await _featuresRepository.CreateOrUpdateAsync(features);
            await _featuresRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFeatures), new { id = features.Id }, features)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, features.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateFeatures(long id, [FromBody] FeaturesDto featuresDto)
        {
            _log.LogDebug($"REST request to update Features : {featuresDto}");
            if (featuresDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != featuresDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            Features features = _mapper.Map<Features>(featuresDto);
            await _featuresRepository.CreateOrUpdateAsync(features);
            await _featuresRepository.SaveChangesAsync();
            return Ok(features)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, features.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeaturesDto>>> GetAllFeatures(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Features");
            var result = await _featuresRepository.QueryHelper()
                .GetPageAsync(pageable);
            var page = new Page<FeaturesDto>(result.Content.Select(entity => _mapper.Map<FeaturesDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<FeaturesDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeatures([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Features : {id}");
            var result = await _featuresRepository.QueryHelper()
                .GetOneAsync(features => features.Id == id);
            FeaturesDto featuresDto = _mapper.Map<FeaturesDto>(result);
            return ActionResultUtil.WrapOrNotFound(featuresDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeatures([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Features : {id}");
            await _featuresRepository.DeleteByIdAsync(id);
            await _featuresRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
