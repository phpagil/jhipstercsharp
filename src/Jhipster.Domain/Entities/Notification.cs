using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jhipster.Domain.Entities
{
    [Table("notification")]
    public class Notification : BaseEntity<long>
    {
        public string Message { get; set; }
        public bool? StatusReady { get; set; }
        public bool? StatusSent { get; set; }
        [Required]
        public long? NotificationGroupId { get; set; }
        public NotificationGroup NotificationGroup { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var notification = obj as Notification;
            if (notification?.Id == null || notification?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, notification.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Notification{" +
                    $"ID='{Id}'" +
                    $", Message='{Message}'" +
                    $", StatusReady='{StatusReady}'" +
                    $", StatusSent='{StatusSent}'" +
                    "}";
        }
    }
}
