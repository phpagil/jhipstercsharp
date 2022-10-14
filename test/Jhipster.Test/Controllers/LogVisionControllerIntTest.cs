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
    public class LogVisionsControllerIntTest
    {
        public LogVisionsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _logVisionRepository = _factory.GetRequiredService<ILogVisionRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private static readonly DateTime DefaultCreatedAt = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedCreatedAt = DateTime.UtcNow;

        private const string DefaultImagePath = "AAAAAAAAAA";
        private const string UpdatedImagePath = "BBBBBBBBBB";

        private const Status DefaultStatus = Status.NG;
        private const Status UpdatedStatus = Status.NG;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly ILogVisionRepository _logVisionRepository;

        private LogVision _logVision;

        private readonly IMapper _mapper;

        private LogVision CreateEntity()
        {
            return new LogVision
            {
                CreatedAt = DefaultCreatedAt,
                ImagePath = DefaultImagePath,
                Status = DefaultStatus,
            };
        }

        private void InitTest()
        {
            _logVision = CreateEntity();
        }

        [Fact]
        public async Task CreateLogVision()
        {
            var databaseSizeBeforeCreate = await _logVisionRepository.CountAsync();

            // Create the LogVision
            LogVisionDto _logVisionDto = _mapper.Map<LogVisionDto>(_logVision);
            var response = await _client.PostAsync("/api/log-visions", TestUtil.ToJsonContent(_logVisionDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the LogVision in the database
            var logVisionList = await _logVisionRepository.GetAllAsync();
            logVisionList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testLogVision = logVisionList.Last();
            testLogVision.CreatedAt.Should().Be(DefaultCreatedAt);
            testLogVision.ImagePath.Should().Be(DefaultImagePath);
            testLogVision.Status.Should().Be(DefaultStatus);
        }

        [Fact]
        public async Task CreateLogVisionWithExistingId()
        {
            var databaseSizeBeforeCreate = await _logVisionRepository.CountAsync();
            // Create the LogVision with an existing ID
            _logVision.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            LogVisionDto _logVisionDto = _mapper.Map<LogVisionDto>(_logVision);
            var response = await _client.PostAsync("/api/log-visions", TestUtil.ToJsonContent(_logVisionDto));

            // Validate the LogVision in the database
            var logVisionList = await _logVisionRepository.GetAllAsync();
            logVisionList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllLogVisions()
        {
            // Initialize the database
            await _logVisionRepository.CreateOrUpdateAsync(_logVision);
            await _logVisionRepository.SaveChangesAsync();

            // Get all the logVisionList
            var response = await _client.GetAsync("/api/log-visions?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_logVision.Id);
            json.SelectTokens("$.[*].createdAt").Should().Contain(DefaultCreatedAt);
            json.SelectTokens("$.[*].imagePath").Should().Contain(DefaultImagePath);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetLogVision()
        {
            // Initialize the database
            await _logVisionRepository.CreateOrUpdateAsync(_logVision);
            await _logVisionRepository.SaveChangesAsync();

            // Get the logVision
            var response = await _client.GetAsync($"/api/log-visions/{_logVision.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_logVision.Id);
            json.SelectTokens("$.createdAt").Should().Contain(DefaultCreatedAt);
            json.SelectTokens("$.imagePath").Should().Contain(DefaultImagePath);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetNonExistingLogVision()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/log-visions/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateLogVision()
        {
            // Initialize the database
            await _logVisionRepository.CreateOrUpdateAsync(_logVision);
            await _logVisionRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _logVisionRepository.CountAsync();

            // Update the logVision
            var updatedLogVision = await _logVisionRepository.QueryHelper().GetOneAsync(it => it.Id == _logVision.Id);
            // Disconnect from session so that the updates on updatedLogVision are not directly saved in db
            //TODO detach
            updatedLogVision.CreatedAt = UpdatedCreatedAt;
            updatedLogVision.ImagePath = UpdatedImagePath;
            updatedLogVision.Status = UpdatedStatus;

            LogVisionDto updatedLogVisionDto = _mapper.Map<LogVisionDto>(updatedLogVision);
            var response = await _client.PutAsync($"/api/log-visions/{_logVision.Id}", TestUtil.ToJsonContent(updatedLogVisionDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the LogVision in the database
            var logVisionList = await _logVisionRepository.GetAllAsync();
            logVisionList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testLogVision = logVisionList.Last();
            testLogVision.CreatedAt.Should().BeCloseTo(UpdatedCreatedAt);
            testLogVision.ImagePath.Should().Be(UpdatedImagePath);
            testLogVision.Status.Should().Be(UpdatedStatus);
        }

        [Fact]
        public async Task UpdateNonExistingLogVision()
        {
            var databaseSizeBeforeUpdate = await _logVisionRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            LogVisionDto _logVisionDto = _mapper.Map<LogVisionDto>(_logVision);
            var response = await _client.PutAsync("/api/log-visions/1", TestUtil.ToJsonContent(_logVisionDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the LogVision in the database
            var logVisionList = await _logVisionRepository.GetAllAsync();
            logVisionList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteLogVision()
        {
            // Initialize the database
            await _logVisionRepository.CreateOrUpdateAsync(_logVision);
            await _logVisionRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _logVisionRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/log-visions/{_logVision.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var logVisionList = await _logVisionRepository.GetAllAsync();
            logVisionList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(LogVision));
            var logVision1 = new LogVision
            {
                Id = 1L
            };
            var logVision2 = new LogVision
            {
                Id = logVision1.Id
            };
            logVision1.Should().Be(logVision2);
            logVision2.Id = 2L;
            logVision1.Should().NotBe(logVision2);
            logVision1.Id = 0;
            logVision1.Should().NotBe(logVision2);
        }
    }
}
