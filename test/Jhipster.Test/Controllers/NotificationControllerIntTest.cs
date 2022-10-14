
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
    public class NotificationsControllerIntTest
    {
        public NotificationsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _notificationRepository = _factory.GetRequiredService<INotificationRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultMessage = "AAAAAAAAAA";
        private const string UpdatedMessage = "BBBBBBBBBB";

        private static readonly bool? DefaultStatusReady = false;
        private static readonly bool? UpdatedStatusReady = true;

        private static readonly bool? DefaultStatusSent = false;
        private static readonly bool? UpdatedStatusSent = true;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly INotificationRepository _notificationRepository;

        private Notification _notification;

        private readonly IMapper _mapper;

        private Notification CreateEntity()
        {
            return new Notification
            {
                Message = DefaultMessage,
                StatusReady = DefaultStatusReady,
                StatusSent = DefaultStatusSent,
            };
        }

        private void InitTest()
        {
            _notification = CreateEntity();
        }

        [Fact]
        public async Task CreateNotification()
        {
            var databaseSizeBeforeCreate = await _notificationRepository.CountAsync();

            // Create the Notification
            NotificationDto _notificationDto = _mapper.Map<NotificationDto>(_notification);
            var response = await _client.PostAsync("/api/notifications", TestUtil.ToJsonContent(_notificationDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testNotification = notificationList.Last();
            testNotification.Message.Should().Be(DefaultMessage);
            testNotification.StatusReady.Should().Be(DefaultStatusReady);
            testNotification.StatusSent.Should().Be(DefaultStatusSent);
        }

        [Fact]
        public async Task CreateNotificationWithExistingId()
        {
            var databaseSizeBeforeCreate = await _notificationRepository.CountAsync();
            // Create the Notification with an existing ID
            _notification.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            NotificationDto _notificationDto = _mapper.Map<NotificationDto>(_notification);
            var response = await _client.PostAsync("/api/notifications", TestUtil.ToJsonContent(_notificationDto));

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllNotifications()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();

            // Get all the notificationList
            var response = await _client.GetAsync("/api/notifications?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_notification.Id);
            json.SelectTokens("$.[*].message").Should().Contain(DefaultMessage);
            json.SelectTokens("$.[*].statusReady").Should().Contain(DefaultStatusReady);
            json.SelectTokens("$.[*].statusSent").Should().Contain(DefaultStatusSent);
        }

        [Fact]
        public async Task GetNotification()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();

            // Get the notification
            var response = await _client.GetAsync($"/api/notifications/{_notification.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_notification.Id);
            json.SelectTokens("$.message").Should().Contain(DefaultMessage);
            json.SelectTokens("$.statusReady").Should().Contain(DefaultStatusReady);
            json.SelectTokens("$.statusSent").Should().Contain(DefaultStatusSent);
        }

        [Fact]
        public async Task GetNonExistingNotification()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/notifications/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateNotification()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _notificationRepository.CountAsync();

            // Update the notification
            var updatedNotification = await _notificationRepository.QueryHelper().GetOneAsync(it => it.Id == _notification.Id);
            // Disconnect from session so that the updates on updatedNotification are not directly saved in db
            //TODO detach
            updatedNotification.Message = UpdatedMessage;
            updatedNotification.StatusReady = UpdatedStatusReady;
            updatedNotification.StatusSent = UpdatedStatusSent;

            NotificationDto updatedNotificationDto = _mapper.Map<NotificationDto>(updatedNotification);
            var response = await _client.PutAsync($"/api/notifications/{_notification.Id}", TestUtil.ToJsonContent(updatedNotificationDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testNotification = notificationList.Last();
            testNotification.Message.Should().Be(UpdatedMessage);
            testNotification.StatusReady.Should().Be(UpdatedStatusReady);
            testNotification.StatusSent.Should().Be(UpdatedStatusSent);
        }

        [Fact]
        public async Task UpdateNonExistingNotification()
        {
            var databaseSizeBeforeUpdate = await _notificationRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            NotificationDto _notificationDto = _mapper.Map<NotificationDto>(_notification);
            var response = await _client.PutAsync("/api/notifications/1", TestUtil.ToJsonContent(_notificationDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Notification in the database
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteNotification()
        {
            // Initialize the database
            await _notificationRepository.CreateOrUpdateAsync(_notification);
            await _notificationRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _notificationRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/notifications/{_notification.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var notificationList = await _notificationRepository.GetAllAsync();
            notificationList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Notification));
            var notification1 = new Notification
            {
                Id = 1L
            };
            var notification2 = new Notification
            {
                Id = notification1.Id
            };
            notification1.Should().Be(notification2);
            notification2.Id = 2L;
            notification1.Should().NotBe(notification2);
            notification1.Id = 0;
            notification1.Should().NotBe(notification2);
        }
    }
}
