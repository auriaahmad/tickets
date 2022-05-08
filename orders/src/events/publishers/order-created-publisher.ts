import { Publisher, OrderCreatedEvent, Subjects } from '@auriaahmadtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
