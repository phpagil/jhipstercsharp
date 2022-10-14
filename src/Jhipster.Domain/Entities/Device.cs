using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Jhipster.Crosscutting.Enums;

namespace Jhipster.Domain.Entities
{
    [Table("device")]
    public class Device : BaseEntity<long>
    {
        public string Description { get; set; }
        public SensorType SensorType { get; set; }
        public string MacAddress { get; set; }
        public bool? Status { get; set; }
        [Required]
        public long? ProductionLineId { get; set; }
        public ProductionLine ProductionLine { get; set; }
        [Required]
        public long? NotificationGroupId { get; set; }
        public NotificationGroup NotificationGroup { get; set; }
        public IList<LogTemperature> LogTemperatures { get; set; } = new List<LogTemperature>();
        public IList<LogVision> LogVisions { get; set; } = new List<LogVision>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var device = obj as Device;
            if (device?.Id == null || device?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, device.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Device{" +
                    $"ID='{Id}'" +
                    $", Description='{Description}'" +
                    $", SensorType='{SensorType}'" +
                    $", MacAddress='{MacAddress}'" +
                    $", Status='{Status}'" +
                    "}";
        }
    }
}
