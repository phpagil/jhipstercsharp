
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
    public class FeaturesControllerIntTest
    {
        public FeaturesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _featuresRepository = _factory.GetRequiredService<IFeaturesRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultDescription = "AAAAAAAAAA";
        private const string UpdatedDescription = "BBBBBBBBBB";

        private const string DefaultRoute = "AAAAAAAAAA";
        private const string UpdatedRoute = "BBBBBBBBBB";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IFeaturesRepository _featuresRepository;

        private Features _features;

        private readonly IMapper _mapper;

        private Features CreateEntity()
        {
            return new Features
            {
                Description = DefaultDescription,
                Route = DefaultRoute,
            };
        }

        private void InitTest()
        {
            _features = CreateEntity();
        }

        [Fact]
        public async Task CreateFeatures()
        {
            var databaseSizeBeforeCreate = await _featuresRepository.CountAsync();

            // Create the Features
            FeaturesDto _featuresDto = _mapper.Map<FeaturesDto>(_features);
            var response = await _client.PostAsync("/api/features", TestUtil.ToJsonContent(_featuresDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Features in the database
            var featuresList = await _featuresRepository.GetAllAsync();
            featuresList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testFeatures = featuresList.Last();
            testFeatures.Description.Should().Be(DefaultDescription);
            testFeatures.Route.Should().Be(DefaultRoute);
        }

        [Fact]
        public async Task CreateFeaturesWithExistingId()
        {
            var databaseSizeBeforeCreate = await _featuresRepository.CountAsync();
            // Create the Features with an existing ID
            _features.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            FeaturesDto _featuresDto = _mapper.Map<FeaturesDto>(_features);
            var response = await _client.PostAsync("/api/features", TestUtil.ToJsonContent(_featuresDto));

            // Validate the Features in the database
            var featuresList = await _featuresRepository.GetAllAsync();
            featuresList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllFeatures()
        {
            // Initialize the database
            await _featuresRepository.CreateOrUpdateAsync(_features);
            await _featuresRepository.SaveChangesAsync();

            // Get all the featuresList
            var response = await _client.GetAsync("/api/features?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_features.Id);
            json.SelectTokens("$.[*].description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.[*].route").Should().Contain(DefaultRoute);
        }

        [Fact]
        public async Task GetFeatures()
        {
            // Initialize the database
            await _featuresRepository.CreateOrUpdateAsync(_features);
            await _featuresRepository.SaveChangesAsync();

            // Get the features
            var response = await _client.GetAsync($"/api/features/{_features.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_features.Id);
            json.SelectTokens("$.description").Should().Contain(DefaultDescription);
            json.SelectTokens("$.route").Should().Contain(DefaultRoute);
        }

        [Fact]
        public async Task GetNonExistingFeatures()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/features/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateFeatures()
        {
            // Initialize the database
            await _featuresRepository.CreateOrUpdateAsync(_features);
            await _featuresRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _featuresRepository.CountAsync();

            // Update the features
            var updatedFeatures = await _featuresRepository.QueryHelper().GetOneAsync(it => it.Id == _features.Id);
            // Disconnect from session so that the updates on updatedFeatures are not directly saved in db
            //TODO detach
            updatedFeatures.Description = UpdatedDescription;
            updatedFeatures.Route = UpdatedRoute;

            FeaturesDto updatedFeaturesDto = _mapper.Map<FeaturesDto>(updatedFeatures);
            var response = await _client.PutAsync($"/api/features/{_features.Id}", TestUtil.ToJsonContent(updatedFeaturesDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Features in the database
            var featuresList = await _featuresRepository.GetAllAsync();
            featuresList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testFeatures = featuresList.Last();
            testFeatures.Description.Should().Be(UpdatedDescription);
            testFeatures.Route.Should().Be(UpdatedRoute);
        }

        [Fact]
        public async Task UpdateNonExistingFeatures()
        {
            var databaseSizeBeforeUpdate = await _featuresRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            FeaturesDto _featuresDto = _mapper.Map<FeaturesDto>(_features);
            var response = await _client.PutAsync("/api/features/1", TestUtil.ToJsonContent(_featuresDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Features in the database
            var featuresList = await _featuresRepository.GetAllAsync();
            featuresList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteFeatures()
        {
            // Initialize the database
            await _featuresRepository.CreateOrUpdateAsync(_features);
            await _featuresRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _featuresRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/features/{_features.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var featuresList = await _featuresRepository.GetAllAsync();
            featuresList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Features));
            var features1 = new Features
            {
                Id = 1L
            };
            var features2 = new Features
            {
                Id = features1.Id
            };
            features1.Should().Be(features2);
            features2.Id = 2L;
            features1.Should().NotBe(features2);
            features1.Id = 0;
            features1.Should().NotBe(features2);
        }
    }
}
