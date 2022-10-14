using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Jhipster.Crosscutting.Enums;

namespace Jhipster.Domain.Entities
{
    [Table("log_temperature")]
    public class LogTemperature : BaseEntity<long>
    {
        public DateTime CreatedAt { get; set; }
        public decimal? Temperature { get; set; }
        public Status Status { get; set; }
        [Required]
        public long? DeviceId { get; set; }
        public Device Device { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var logTemperature = obj as LogTemperature;
            if (logTemperature?.Id == null || logTemperature?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, logTemperature.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "LogTemperature{" +
                    $"ID='{Id}'" +
                    $", CreatedAt='{CreatedAt}'" +
                    $", Temperature='{Temperature}'" +
                    $", Status='{Status}'" +
                    "}";
        }
    }
}
