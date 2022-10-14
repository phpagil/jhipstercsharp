
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
    public class DevicesControllerIntTest
    {
        public DevicesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _deviceRepository = _factory.GetRequiredService<IDeviceRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultDescription = "AAAAAAAAAA";
        private const string UpdatedDescription = "BBBBBBBBBB";

        private const SensorType DefaultSensorType = SensorType.TEMPERATURE;
        private const SensorType UpdatedSensorType = SensorType.TEMPERATURE;

        private const string DefaultMacAddress = "AAAAAAAAAA";
        private const string UpdatedMacAddress = "BBBBBBBBBB";

        private static readonly bool? DefaultStatus = false;
        private static readonly bool? UpdatedStatus = true;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IDeviceRepository _deviceRepository;

        private Device _device;

        private readonly IMapper _mapper;

        private Device CreateEntity()
        {
            return new Device
            {
                Description = DefaultDescription,
                SensorType = DefaultSensorType,
                MacAddress = DefaultMacAddress,
                Status = DefaultStatus,
            };
        }

        private void InitTest()
        {
            _device = CreateEntity();
        }

        [Fact]
        public async Task CreateDevice()
        {
            var databaseSizeBeforeCreate = await _deviceRepository.CountAsync();

            // Create the Device
            DeviceDto _deviceDto = _mapper.Map<DeviceDto>(_device);
            var response = await _client.PostAsync("/api/devices", TestUtil.ToJsonContent(_deviceDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Device in the database
            var deviceList = await _deviceRepository.GetAllAsync();
            deviceList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testDevice = deviceList.Last();
            testDevice.Description.Should().Be(DefaultDescription);
            testDevice.SensorType.Should().Be(DefaultSensorType);
            testDevice.MacAddress.Should().Be(DefaultMacAddress);
            testDevice.Status.Should().Be(DefaultStatus);
        }

        [Fact]
        public async Task CreateDeviceWithExistingId()
        {
            var databaseSizeBeforeCreate = await _deviceRepository.CountAsync();
            // Create the Device with an existing ID
            _device.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            DeviceDto _deviceDto = _mapper.Map<DeviceDto>(_device);
            var response = await _client.PostAsync("/api/devices", TestUtil.ToJsonContent(_deviceDto));

            // Validate the Device in the database
            var deviceList = await _deviceRepository.GetAllAsync();
            deviceList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllDevices()
        {
            // Initialize the database
            await _deviceRepository.CreateOrUpdateAsync(_device);
            await _deviceRepository.SaveChangesAsync();

            // Get all the deviceList
            var response = await _client.GetAsync("/api/devices?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_device.Id);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].sensorType").Should().Contain(DefaultSensorType.ToString());
            json.SelectTokens("$.[*].macAddress").Should().Contain(DefaultMacAddress);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus);
        }

        [Fact]
        public async Task GetDevice()
        {
            // Initialize the database
            await _deviceRepository.CreateOrUpdateAsync(_device);
            await _deviceRepository.SaveChangesAsync();

            // Get the device
            var response = await _client.GetAsync($"/api/devices/{_device.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_device.Id);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.sensorType").Should().Contain(DefaultSensorType.ToString());
            json.SelectTokens("$.macAddress").Should().Contain(DefaultMacAddress);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus);
        }

        [Fact]
        public async Task GetNonExistingDevice()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/devices/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateDevice()
        {
            // Initialize the database
            await _deviceRepository.CreateOrUpdateAsync(_device);
            await _deviceRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _deviceRepository.CountAsync();

            // Update the device
            var updatedDevice = await _deviceRepository.QueryHelper().GetOneAsync(it => it.Id == _device.Id);
            // Disconnect from session so that the updates on updatedDevice are not directly saved in db
            //TODO detach
            updatedDevice.Description = UpdatedDescription;
            updatedDevice.SensorType = UpdatedSensorType;
            updatedDevice.MacAddress = UpdatedMacAddress;
            updatedDevice.Status = UpdatedStatus;

            DeviceDto updatedDeviceDto = _mapper.Map<DeviceDto>(updatedDevice);
            var response = await _client.PutAsync($"/api/devices/{_device.Id}", TestUtil.ToJsonContent(updatedDeviceDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Device in the database
            var deviceList = await _deviceRepository.GetAllAsync();
            deviceList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testDevice = deviceList.Last();
            testDevice.Description.Should().Be(UpdatedDescription);
            testDevice.SensorType.Should().Be(UpdatedSensorType);
            testDevice.MacAddress.Should().Be(UpdatedMacAddress);
            testDevice.Status.Should().Be(UpdatedStatus);
        }

        [Fact]
        public async Task UpdateNonExistingDevice()
        {
            var databaseSizeBeforeUpdate = await _deviceRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            DeviceDto _deviceDto = _mapper.Map<DeviceDto>(_device);
            var response = await _client.PutAsync("/api/devices/1", TestUtil.ToJsonContent(_deviceDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Device in the database
            var deviceList = await _deviceRepository.GetAllAsync();
            deviceList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteDevice()
        {
            // Initialize the database
            await _deviceRepository.CreateOrUpdateAsync(_device);
            await _deviceRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _deviceRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/devices/{_device.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var deviceList = await _deviceRepository.GetAllAsync();
            deviceList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Device));
            var device1 = new Device
            {
                Id = 1L
            };
            var device2 = new Device
            {
                Id = device1.Id
            };
            device1.Should().Be(device2);
            device2.Id = 2L;
            device1.Should().NotBe(device2);
            device1.Id = 0;
            device1.Should().NotBe(device2);
        }
    }
}
