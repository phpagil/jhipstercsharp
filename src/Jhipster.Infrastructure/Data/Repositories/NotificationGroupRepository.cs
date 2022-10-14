using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using Jhipster.Domain.Entities;
using Jhipster.Domain.Repositories.Interfaces;
using Jhipster.Infrastructure.Data.Extensions;

namespace Jhipster.Infrastructure.Data.Repositories
{
    public class NotificationGroupRepository : GenericRepository<NotificationGroup, long>, INotificationGroupRepository
    {
        public NotificationGroupRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<NotificationGroup> CreateOrUpdateAsync(NotificationGroup notificationGroup)
        {
            List<Type> entitiesToBeUpdated = new List<Type>();
            return await base.CreateOrUpdateAsync(notificationGroup, entitiesToBeUpdated);
        }
    }
}
