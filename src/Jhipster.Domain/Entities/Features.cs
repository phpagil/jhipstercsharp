using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jhipster.Domain.Entities
{
    [Table("features")]
    public class Features : BaseEntity<long>
    {
        public string Description { get; set; }
        public string Route { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var features = obj as Features;
            if (features?.Id == null || features?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, features.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Features{" +
                    $"ID='{Id}'" +
                    $", Description='{Description}'" +
                    $", Route='{Route}'" +
                    "}";
        }
    }
}
