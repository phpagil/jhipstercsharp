using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Jhipster.Dto
{

    public class ProductionLineDto
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
