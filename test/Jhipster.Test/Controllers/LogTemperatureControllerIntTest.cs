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
using Jhipster.Crosscutting.Enums;
using Jhipster.Dto;
using Jhipster.Configuration.AutoMapper;
using Jhipster.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Jhipster.Test.Controllers
{
    public class LogTemperaturesControllerIntTest
    {
        public LogTemperaturesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _logTemperatureRepository = _factory.GetRequiredService<ILogTemperatureRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private static readonly DateTime DefaultCreatedAt = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedCreatedAt = DateTime.UtcNow;

        private static readonly decimal? DefaultTemperature = 1M;
        private static readonly decimal? UpdatedTemperature = 2M;

        private const Status DefaultStatus = Status.NG;
        private const Status UpdatedStatus = Status.NG;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly ILogTemperatureRepository _logTemperatureRepository;

        private LogTemperature _logTemperature;

        private readonly IMapper _mapper;

        private LogTemperature CreateEntity()
        {
            return new LogTemperature
            {
                CreatedAt = DefaultCreatedAt,
                Temperature = DefaultTemperature,
                Status = DefaultStatus,
            };
        }

        private void InitTest()
        {
            _logTemperature = CreateEntity();
        }

        [Fact]
        public async Task CreateLogTemperature()
        {
            var databaseSizeBeforeCreate = await _logTemperatureRepository.CountAsync();

            // Create the LogTemperature
            LogTemperatureDto _logTemperatureDto = _mapper.Map<LogTemperatureDto>(_logTemperature);
            var response = await _client.PostAsync("/api/log-temperatures", TestUtil.ToJsonContent(_logTemperatureDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the LogTemperature in the database
            var logTemperatureList = await _logTemperatureRepository.GetAllAsync();
            logTemperatureList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testLogTemperature = logTemperatureList.Last();
            testLogTemperature.CreatedAt.Should().Be(DefaultCreatedAt);
            testLogTemperature.Temperature.Should().Be(DefaultTemperature);
            testLogTemperature.Status.Should().Be(DefaultStatus);
        }

        [Fact]
        public async Task CreateLogTemperatureWithExistingId()
        {
            var databaseSizeBeforeCreate = await _logTemperatureRepository.CountAsync();
            // Create the LogTemperature with an existing ID
            _logTemperature.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            LogTemperatureDto _logTemperatureDto = _mapper.Map<LogTemperatureDto>(_logTemperature);
            var response = await _client.PostAsync("/api/log-temperatures", TestUtil.ToJsonContent(_logTemperatureDto));

            // Validate the LogTemperature in the database
            var logTemperatureList = await _logTemperatureRepository.GetAllAsync();
            logTemperatureList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllLogTemperatures()
        {
            // Initialize the database
            await _logTemperatureRepository.CreateOrUpdateAsync(_logTemperature);
            await _logTemperatureRepository.SaveChangesAsync();

            // Get all the logTemperatureList
            var response = await _client.GetAsync("/api/log-temperatures?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_logTemperature.Id);
            json.SelectTokens("$.[*].createdAt").Should().Contain(DefaultCreatedAt);
            json.SelectTokens("$.[*].temperature").Should().Contain(DefaultTemperature);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetLogTemperature()
        {
            // Initialize the database
            await _logTemperatureRepository.CreateOrUpdateAsync(_logTemperature);
            await _logTemperatureRepository.SaveChangesAsync();

            // Get the logTemperature
            var response = await _client.GetAsync($"/api/log-temperatures/{_logTemperature.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_logTemperature.Id);
            json.SelectTokens("$.createdAt").Should().Contain(DefaultCreatedAt);
            json.SelectTokens("$.temperature").Should().Contain(DefaultTemperature);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetNonExistingLogTemperature()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/log-temperatures/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateLogTemperature()
        {
            // Initialize the database
            await _logTemperatureRepository.CreateOrUpdateAsync(_logTemperature);
            await _logTemperatureRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _logTemperatureRepository.CountAsync();

            // Update the logTemperature
            var updatedLogTemperature = await _logTemperatureRepository.QueryHelper().GetOneAsync(it => it.Id == _logTemperature.Id);
            // Disconnect from session so that the updates on updatedLogTemperature are not directly saved in db
            //TODO detach
            updatedLogTemperature.CreatedAt = UpdatedCreatedAt;
            updatedLogTemperature.Temperature = UpdatedTemperature;
            updatedLogTemperature.Status = UpdatedStatus;

            LogTemperatureDto updatedLogTemperatureDto = _mapper.Map<LogTemperatureDto>(updatedLogTemperature);
            var response = await _client.PutAsync($"/api/log-temperatures/{_logTemperature.Id}", TestUtil.ToJsonContent(updatedLogTemperatureDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the LogTemperature in the database
            var logTemperatureList = await _logTemperatureRepository.GetAllAsync();
            logTemperatureList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testLogTemperature = logTemperatureList.Last();
            testLogTemperature.CreatedAt.Should().BeCloseTo(UpdatedCreatedAt);
            testLogTemperature.Temperature.Should().Be(UpdatedTemperature);
            testLogTemperature.Status.Should().Be(UpdatedStatus);
        }

        [Fact]
        public async Task UpdateNonExistingLogTemperature()
        {
            var databaseSizeBeforeUpdate = await _logTemperatureRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            LogTemperatureDto _logTemperatureDto = _mapper.Map<LogTemperatureDto>(_logTemperature);
            var response = await _client.PutAsync("/api/log-temperatures/1", TestUtil.ToJsonContent(_logTemperatureDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the LogTemperature in the database
            var logTemperatureList = await _logTemperatureRepository.GetAllAsync();
            logTemperatureList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteLogTemperature()
        {
            // Initialize the database
            await _logTemperatureRepository.CreateOrUpdateAsync(_logTemperature);
            await _logTemperatureRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _logTemperatureRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/log-temperatures/{_logTemperature.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var logTemperatureList = await _logTemperatureRepository.GetAllAsync();
            logTemperatureList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(LogTemperature));
            var logTemperature1 = new LogTemperature
            {
                Id = 1L
            };
            var logTemperature2 = new LogTemperature
            {
                Id = logTemperature1.Id
            };
            logTemperature1.Should().Be(logTemperature2);
            logTemperature2.Id = 2L;
            logTemperature1.Should().NotBe(logTemperature2);
            logTemperature1.Id = 0;
            logTemperature1.Should().NotBe(logTemperature2);
        }
    }
}
