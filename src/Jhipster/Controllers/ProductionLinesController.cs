
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
    [Route("api/production-lines")]
    [ApiController]
    public class ProductionLinesController : ControllerBase
    {
        private const string EntityName = "productionLine";
        private readonly ILogger<ProductionLinesController> _log;
        private readonly IMapper _mapper;
        private readonly IProductionLineRepository _productionLineRepository;

        public ProductionLinesController(ILogger<ProductionLinesController> log,
        IMapper mapper,
        IProductionLineRepository productionLineRepository)
        {
            _log = log;
            _mapper = mapper;
            _productionLineRepository = productionLineRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<ProductionLineDto>> CreateProductionLine([FromBody] ProductionLineDto productionLineDto)
        {
            _log.LogDebug($"REST request to save ProductionLine : {productionLineDto}");
            if (productionLineDto.Id != 0)
                throw new BadRequestAlertException("A new productionLine cannot already have an ID", EntityName, "idexists");

            ProductionLine productionLine = _mapper.Map<ProductionLine>(productionLineDto);
            await _productionLineRepository.CreateOrUpdateAsync(productionLine);
            await _productionLineRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductionLine), new { id = productionLine.Id }, productionLine)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, productionLine.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateProductionLine(long id, [FromBody] ProductionLineDto productionLineDto)
        {
            _log.LogDebug($"REST request to update ProductionLine : {productionLineDto}");
            if (productionLineDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != productionLineDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            ProductionLine productionLine = _mapper.Map<ProductionLine>(productionLineDto);
            await _productionLineRepository.CreateOrUpdateAsync(productionLine);
            await _productionLineRepository.SaveChangesAsync();
            return Ok(productionLine)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, productionLine.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductionLineDto>>> GetAllProductionLines(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of ProductionLines");
            var result = await _productionLineRepository.QueryHelper()
                .GetPageAsync(pageable);
            var page = new Page<ProductionLineDto>(result.Content.Select(entity => _mapper.Map<ProductionLineDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<ProductionLineDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductionLine([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get ProductionLine : {id}");
            var result = await _productionLineRepository.QueryHelper()
                .GetOneAsync(productionLine => productionLine.Id == id);
            ProductionLineDto productionLineDto = _mapper.Map<ProductionLineDto>(result);
            return ActionResultUtil.WrapOrNotFound(productionLineDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductionLine([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete ProductionLine : {id}");
            await _productionLineRepository.DeleteByIdAsync(id);
            await _productionLineRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
