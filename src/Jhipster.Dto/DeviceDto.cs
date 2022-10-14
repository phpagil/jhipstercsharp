using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Jhipster.Crosscutting.Enums;

namespace Jhipster.Dto
{

    public class DeviceDto
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public SensorType SensorType { get; set; }
        public string MacAddress { get; set; }
        public bool? Status { get; set; }
        public long? ProductionLineId { get; set; }
        public ProductionLineDto ProductionLine { get; set; }
        public long? NotificationGroupId { get; set; }
        public NotificationGroupDto NotificationGroup { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
