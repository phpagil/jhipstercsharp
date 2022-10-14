
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
    public class NotificationGroupsControllerIntTest
    {
        public NotificationGroupsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _notificationGroupRepository = _factory.GetRequiredService<INotificationGroupRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultDescription = "AAAAAAAAAA";
        private const string UpdatedDescription = "BBBBBBBBBB";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly INotificationGroupRepository _notificationGroupRepository;

        private NotificationGroup _notificationGroup;

        private readonly IMapper _mapper;

        private NotificationGroup CreateEntity()
        {
            return new NotificationGroup
            {
                Description = DefaultDescription,
            };
        }

        private void InitTest()
        {
            _notificationGroup = CreateEntity();
        }

        [Fact]
        public async Task CreateNotificationGroup()
        {
            var databaseSizeBeforeCreate = await _notificationGroupRepository.CountAsync();

            // Create the NotificationGroup
            NotificationGroupDto _notificationGroupDto = _mapper.Map<NotificationGroupDto>(_notificationGroup);
            var response = await _client.PostAsync("/api/notification-groups", TestUtil.ToJsonContent(_notificationGroupDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the NotificationGroup in the database
            var notificationGroupList = await _notificationGroupRepository.GetAllAsync();
            notificationGroupList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testNotificationGroup = notificationGroupList.Last();
            testNotificationGroup.Description.Should().Be(DefaultDescription);
        }

        [Fact]
        public async Task CreateNotificationGroupWithExistingId()
        {
            var databaseSizeBeforeCreate = await _notificationGroupRepository.CountAsync();
            // Create the NotificationGroup with an existing ID
            _notificationGroup.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            NotificationGroupDto _notificationGroupDto = _mapper.Map<NotificationGroupDto>(_notificationGroup);
            var response = await _client.PostAsync("/api/notification-groups", TestUtil.ToJsonContent(_notificationGroupDto));

            // Validate the NotificationGroup in the database
            var notificationGroupList = await _notificationGroupRepository.GetAllAsync();
            notificationGroupList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllNotificationGroups()
        {
            // Initialize the database
            await _notificationGroupRepository.CreateOrUpdateAsync(_notificationGroup);
            await _notificationGroupRepository.SaveChangesAsync();

            // Get all the notificationGroupList
            var response = await _client.GetAsync("/api/notification-groups?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_notificationGroup.Id);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
        }

        [Fact]
        public async Task GetNotificationGroup()
        {
            // Initialize the database
            await _notificationGroupRepository.CreateOrUpdateAsync(_notificationGroup);
            await _notificationGroupRepository.SaveChangesAsync();

            // Get the notificationGroup
            var response = await _client.GetAsync($"/api/notification-groups/{_notificationGroup.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_notificationGroup.Id);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
        }

        [Fact]
        public async Task GetNonExistingNotificationGroup()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/notification-groups/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateNotificationGroup()
        {
            // Initialize the database
            await _notificationGroupRepository.CreateOrUpdateAsync(_notificationGroup);
            await _notificationGroupRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _notificationGroupRepository.CountAsync();

            // Update the notificationGroup
            var updatedNotificationGroup = await _notificationGroupRepository.QueryHelper().GetOneAsync(it => it.Id == _notificationGroup.Id);
            // Disconnect from session so that the updates on updatedNotificationGroup are not directly saved in db
            //TODO detach
            updatedNotificationGroup.Description = UpdatedDescription;

            NotificationGroupDto updatedNotificationGroupDto = _mapper.Map<NotificationGroupDto>(updatedNotificationGroup);
            var response = await _client.PutAsync($"/api/notification-groups/{_notificationGroup.Id}", TestUtil.ToJsonContent(updatedNotificationGroupDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the NotificationGroup in the database
            var notificationGroupList = await _notificationGroupRepository.GetAllAsync();
            notificationGroupList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testNotificationGroup = notificationGroupList.Last();
            testNotificationGroup.Description.Should().Be(UpdatedDescription);
        }

        [Fact]
        public async Task UpdateNonExistingNotificationGroup()
        {
            var databaseSizeBeforeUpdate = await _notificationGroupRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            NotificationGroupDto _notificationGroupDto = _mapper.Map<NotificationGroupDto>(_notificationGroup);
            var response = await _client.PutAsync("/api/notification-groups/1", TestUtil.ToJsonContent(_notificationGroupDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the NotificationGroup in the database
            var notificationGroupList = await _notificationGroupRepository.GetAllAsync();
            notificationGroupList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteNotificationGroup()
        {
            // Initialize the database
            await _notificationGroupRepository.CreateOrUpdateAsync(_notificationGroup);
            await _notificationGroupRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _notificationGroupRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/notification-groups/{_notificationGroup.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var notificationGroupList = await _notificationGroupRepository.GetAllAsync();
            notificationGroupList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(NotificationGroup));
            var notificationGroup1 = new NotificationGroup
            {
                Id = 1L
            };
            var notificationGroup2 = new NotificationGroup
            {
                Id = notificationGroup1.Id
            };
            notificationGroup1.Should().Be(notificationGroup2);
            notificationGroup2.Id = 2L;
            notificationGroup1.Should().NotBe(notificationGroup2);
            notificationGroup1.Id = 0;
            notificationGroup1.Should().NotBe(notificationGroup2);
        }
    }
}
