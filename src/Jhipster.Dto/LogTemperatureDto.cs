using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Jhipster.Crosscutting.Enums;

namespace Jhipster.Dto
{

    public class LogTemperatureDto
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal? Temperature { get; set; }
        public Status Status { get; set; }
        public long? DeviceId { get; set; }
        public DeviceDto Device { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
