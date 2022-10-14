
using AutoMapper;
using System.Linq;
using Jhipster.Domain.Entities;
using Jhipster.Dto;


namespace Jhipster.Configuration.AutoMapper
{

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(userDto => userDto.Roles, opt => opt.MapFrom(user => user.UserRoles.Select(iur => iur.Role.Name).ToHashSet()))
            .ReverseMap()
                .ForPath(user => user.UserRoles, opt => opt.MapFrom(userDto => userDto.Roles.Select(role => new UserRole { Role = new Role { Name = role }, UserId = userDto.Id }).ToHashSet()));

            CreateMap<Device, DeviceDto>().ReverseMap();
            CreateMap<Features, FeaturesDto>().ReverseMap();
            CreateMap<LogTemperature, LogTemperatureDto>().ReverseMap();
            CreateMap<LogVision, LogVisionDto>().ReverseMap();
            CreateMap<Notification, NotificationDto>().ReverseMap();
            CreateMap<NotificationGroup, NotificationGroupDto>().ReverseMap();
            CreateMap<ProductionLine, ProductionLineDto>().ReverseMap();
        }
    }
}
