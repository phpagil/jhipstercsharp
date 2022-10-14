using System;

using AutoMapper;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Jhipster.Infrastructure.Data;
using Jhipster.Domain.Entities;
using Jhipster.Domain.Repositories.Interfaces;
using Jhipster.Dto;
using Jhipster.Configuration.AutoMapper;
using Jhipster.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Jhipster.Test.Controllers
{
    public class ProductionLinesControllerIntTest
    {
        public ProductionLinesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _productionLineRepository = _factory.GetRequiredService<IProductionLineRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultDescription = "AAAAAAAAAA";
        private const string UpdatedDescription = "BBBBBBBBBB";

        private static readonly DateTime DefaultCreatedAt = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedCreatedAt = DateTime.UtcNow;

        private static readonly DateTime DefaultUpdatedAt = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedUpdatedAt = DateTime.UtcNow;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IProductionLineRepository _productionLineRepository;

        private ProductionLine _productionLine;

        private readonly IMapper _mapper;

        private ProductionLine CreateEntity()
        {
            return new ProductionLine
            {
                Description = DefaultDescription,
                CreatedAt = DefaultCreatedAt,
                UpdatedAt = DefaultUpdatedAt,
            };
        }

        private void InitTest()
        {
            _productionLine = CreateEntity();
        }

        [Fact]
        public async Task CreateProductionLine()
        {
            var databaseSizeBeforeCreate = await _productionLineRepository.CountAsync();

            // Create the ProductionLine
            ProductionLineDto _productionLineDto = _mapper.Map<ProductionLineDto>(_productionLine);
            var response = await _client.PostAsync("/api/production-lines", TestUtil.ToJsonContent(_productionLineDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the ProductionLine in the database
            var productionLineList = await _productionLineRepository.GetAllAsync();
            productionLineList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testProductionLine = productionLineList.Last();
            testProductionLine.Description.Should().Be(DefaultDescription);
            testProductionLine.CreatedAt.Should().Be(DefaultCreatedAt);
            testProductionLine.UpdatedAt.Should().Be(DefaultUpdatedAt);
        }

        [Fact]
        public async Task CreateProductionLineWithExistingId()
        {
            var databaseSizeBeforeCreate = await _productionLineRepository.CountAsync();
            // Create the ProductionLine with an existing ID
            _productionLine.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            ProductionLineDto _productionLineDto = _mapper.Map<ProductionLineDto>(_productionLine);
            var response = await _client.PostAsync("/api/production-lines", TestUtil.ToJsonContent(_productionLineDto));

            // Validate the ProductionLine in the database
            var productionLineList = await _productionLineRepository.GetAllAsync();
            productionLineList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllProductionLines()
        {
            // Initialize the database
            await _productionLineRepository.CreateOrUpdateAsync(_productionLine);
            await _productionLineRepository.SaveChangesAsync();

            // Get all the productionLineList
            var response = await _client.GetAsync("/api/production-lines?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_productionLine.Id);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].createdAt").Should().Contain(DefaultCreatedAt);
            json.SelectTokens("$.[*].updatedAt").Should().Contain(DefaultUpdatedAt);
        }

        [Fact]
        public async Task GetProductionLine()
        {
            // Initialize the database
            await _productionLineRepository.CreateOrUpdateAsync(_productionLine);
            await _productionLineRepository.SaveChangesAsync();

            // Get the productionLine
            var response = await _client.GetAsync($"/api/production-lines/{_productionLine.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_productionLine.Id);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.createdAt").Should().Contain(DefaultCreatedAt);
            json.SelectTokens("$.updatedAt").Should().Contain(DefaultUpdatedAt);
        }

        [Fact]
        public async Task GetNonExistingProductionLine()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/production-lines/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateProductionLine()
        {
            // Initialize the database
            await _productionLineRepository.CreateOrUpdateAsync(_productionLine);
            await _productionLineRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _productionLineRepository.CountAsync();

            // Update the productionLine
            var updatedProductionLine = await _productionLineRepository.QueryHelper().GetOneAsync(it => it.Id == _productionLine.Id);
            // Disconnect from session so that the updates on updatedProductionLine are not directly saved in db
            //TODO detach
            updatedProductionLine.Description = UpdatedDescription;
            updatedProductionLine.CreatedAt = UpdatedCreatedAt;
            updatedProductionLine.UpdatedAt = UpdatedUpdatedAt;

            ProductionLineDto updatedProductionLineDto = _mapper.Map<ProductionLineDto>(updatedProductionLine);
            var response = await _client.PutAsync($"/api/production-lines/{_productionLine.Id}", TestUtil.ToJsonContent(updatedProductionLineDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the ProductionLine in the database
            var productionLineList = await _productionLineRepository.GetAllAsync();
            productionLineList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testProductionLine = productionLineList.Last();
            testProductionLine.Description.Should().Be(UpdatedDescription);
            testProductionLine.CreatedAt.Should().BeCloseTo(UpdatedCreatedAt);
            testProductionLine.UpdatedAt.Should().BeCloseTo(UpdatedUpdatedAt);
        }

        [Fact]
        public async Task UpdateNonExistingProductionLine()
        {
            var databaseSizeBeforeUpdate = await _productionLineRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            ProductionLineDto _productionLineDto = _mapper.Map<ProductionLineDto>(_productionLine);
            var response = await _client.PutAsync("/api/production-lines/1", TestUtil.ToJsonContent(_productionLineDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the ProductionLine in the database
            var productionLineList = await _productionLineRepository.GetAllAsync();
            productionLineList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteProductionLine()
        {
            // Initialize the database
            await _productionLineRepository.CreateOrUpdateAsync(_productionLine);
            await _productionLineRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _productionLineRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/production-lines/{_productionLine.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var productionLineList = await _productionLineRepository.GetAllAsync();
            productionLineList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(ProductionLine));
            var productionLine1 = new ProductionLine
            {
                Id = 1L
            };
            var productionLine2 = new ProductionLine
            {
                Id = productionLine1.Id
            };
            productionLine1.Should().Be(productionLine2);
            productionLine2.Id = 2L;
            productionLine1.Should().NotBe(productionLine2);
            productionLine1.Id = 0;
            productionLine1.Should().NotBe(productionLine2);
        }
    }
}
