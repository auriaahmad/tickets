import { Subjects, Publisher, OrderCancelledEvent } from '@auriaahmadtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
