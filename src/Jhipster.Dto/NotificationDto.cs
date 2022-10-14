using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Jhipster.Dto
{

    public class NotificationDto
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public bool? StatusReady { get; set; }
        public bool? StatusSent { get; set; }
        public long? NotificationGroupId { get; set; }
        public NotificationGroupDto NotificationGroup { get; set; }

        // jhipster-needle-dto-add-field - JHipster will add fields here, do not remove
    }
}
