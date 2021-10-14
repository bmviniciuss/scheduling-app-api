import { TicketStatus } from '.prisma/client'

import { objectType, enumType } from 'nexus'

import { Context } from '../../../../shared/infra/graphql/setupGraphql'
import { UserNexus } from '../../user'

export const TicketStatusNexusEnum = enumType({
  name: 'TicketStatus',
  members: Object.values(TicketStatus)
})

export const TicketNexus = objectType({
  name: 'Ticket',
  definition (t) {
    t.nonNull.id('id')
    t.nonNull.field('status', { type: TicketStatusNexusEnum })
    t.nonNull.boolean('active')
    t.field('user', {
      type: UserNexus,
      resolve (root, _args, { prisma }: Context) {
        return prisma.ticket.findFirst({
          where: {
            id: root.id
          },
          select: {
            user: true
          }
        }).then(data => data!.user)
      }
    })

    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
  }
})
