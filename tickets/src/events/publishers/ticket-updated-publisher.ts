import { Publisher, Subjects, TicketUpdatedEvent } from '@auriaahmadtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
