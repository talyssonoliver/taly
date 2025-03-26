```md
# Serverless Function: queue-processor (Planned)

This document describes the future `queue-processor` serverless function that will be used in Taly CRM to coordinate asynchronous workflows via **message queues** such as **AWS SQS** or **EventBridge**. This design enables scalable, decoupled processing of time-sensitive or background jobs.

---

## 1. Purpose

The `queue-processor` will handle:

- **Retry queues** for failed webhook, email, or report jobs
- **Fan-out event processing** (e.g., notify all relevant systems after booking)
- **Delayed jobs** such as reminders and notifications
- **Event-driven chaining** of serverless functions

---

## 2. Queue Architecture

### Planned AWS Resources

| Resource        | Purpose                                  |
|-----------------|-------------------------------------------|
| SQS queue       | Primary event bus for async events        |
| DLQ (dead-letter queue) | Retry failed events                 |
| EventBridge     | (Optional) Structured event routing       |

---

## 3. Event Structure

All messages passed to the queue should conform to a common contract:

```json
{
  "type": "appointment.reminder",
  "payload": {
    "appointmentId": "uuid",
    "companyId": "uuid",
    "startTime": "2024-04-15T14:00:00Z"
  },
  "timestamp": "2024-04-14T14:00:00Z",
  "attempts": 1
}
```

> Message contracts will be versioned in `@shared/types/events.ts`

---

## 4. Common Event Types (Planned)

| Event Type                | Handler Function             |
|---------------------------|------------------------------|
| `appointment.reminder`    | Triggers email + SMS reminder |
| `report.ready`            | Sends generated report via email |
| `payment.failed`          | Notifies admin or retries payment |
| `booking.created`         | Triggers email confirmation, activity log |
| `user.invited`            | Sends invitation email        |

---

## 5. Lambda Handler Logic (Planned)

The handler will:

1. **Parse message** and validate structure (Zod)
2. **Dispatch to event-specific logic**
3. **Log outcome (success or failure)**
4. **Handle retries** or forward to DLQ after max attempts

```ts
export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    const msg = JSON.parse(record.body);

    switch (msg.type) {
      case 'appointment.reminder':
        await handleReminder(msg.payload);
        break;

      default:
        console.warn(`Unhandled message type: ${msg.type}`);
    }
  }
}
```

---

## 6. Retry Strategy

| Strategy           | Detail                          |
|--------------------|---------------------------------|
| Retry on failure   | Max 3 attempts                  |
| DLQ fallback       | After 3rd failure, log + notify |
| Deduplication      | Future: message ID tracking     |

---

## 7. Integration Points

| System        | Event                          | Sent To         |
|---------------|----------------------------------|------------------|
| Backend       | `appointment.created`           | SQS (`queue-processor`) |
| Serverless    | `report.generated`              | SQS or EventBridge |
| Webhooks      | `stripe.invoice.payment_failed` | Queue retry + log |

---

## 8. Deployment Plan (Future)

### Initial Stack (Serverless Framework):

```yaml
functions:
  queueProcessor:
    handler: handler.main
    events:
      - sqs:
          arn:
            Fn::GetAtt: [QueueProcessorQueue, Arn]
```

### IAM Requirements:

```json
{
  "Action": [
    "sqs:ReceiveMessage",
    "sqs:DeleteMessage",
    "sqs:GetQueueAttributes"
  ],
  "Resource": "*"
}
```

---

## 9. Monitoring & Alerting (Planned)

- DLQ threshold alerts via CloudWatch
- Log aggregation by event type and outcome
- Slack/Email alerts on queue overflow or failure spikes

---

## 10. Questions?

- Slack: `#taly-async-ops`
- Email: `infra@taly.dev`

---
```
