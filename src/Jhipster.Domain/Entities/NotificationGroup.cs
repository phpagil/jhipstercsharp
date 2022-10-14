using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jhipster.Domain.Entities
{
    [Table("notification_group")]
    public class NotificationGroup : BaseEntity<long>
    {
        public string Description { get; set; }
        public IList<Device> Devices { get; set; } = new List<Device>();
        public IList<Notification> Notifications { get; set; } = new List<Notification>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var notificationGroup = obj as NotificationGroup;
            if (notificationGroup?.Id == null || notificationGroup?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, notificationGroup.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "NotificationGroup{" +
                    $"ID='{Id}'" +
                    $", Description='{Description}'" +
                    "}";
        }
    }
}
