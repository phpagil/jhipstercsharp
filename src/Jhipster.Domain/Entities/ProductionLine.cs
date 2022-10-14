using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jhipster.Domain.Entities
{
    [Table("production_line")]
    public class ProductionLine : BaseEntity<long>
    {
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public IList<Device> Devices { get; set; } = new List<Device>();

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var productionLine = obj as ProductionLine;
            if (productionLine?.Id == null || productionLine?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, productionLine.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "ProductionLine{" +
                    $"ID='{Id}'" +
                    $", Description='{Description}'" +
                    $", CreatedAt='{CreatedAt}'" +
                    $", UpdatedAt='{UpdatedAt}'" +
                    "}";
        }
    }
}
