using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Jhipster.Crosscutting.Enums;

namespace Jhipster.Domain.Entities
{
    [Table("log_vision")]
    public class LogVision : BaseEntity<long>
    {
        public DateTime CreatedAt { get; set; }
        public string ImagePath { get; set; }
        public Status Status { get; set; }
        [Required]
        public long? DeviceId { get; set; }
        public Device Device { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var logVision = obj as LogVision;
            if (logVision?.Id == null || logVision?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, logVision.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "LogVision{" +
                    $"ID='{Id}'" +
                    $", CreatedAt='{CreatedAt}'" +
                    $", ImagePath='{ImagePath}'" +
                    $", Status='{Status}'" +
                    "}";
        }
    }
}
