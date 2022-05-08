import { Subjects, Publisher, PaymentCreatedEvent } from '@auriaahmadtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
