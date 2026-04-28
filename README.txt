# 📌 Event Processing System

## 🧠 Overview
This project is based on an event-driven architecture using a message queue, a scheduler, a consumer, and an alerter.

The system is designed to:
- Generate events automatically
- Process events from a queue
- Detect changes
- Update the database accordingly
- Trigger alerts when needed

---

## 🚀 How to Run the Project

### 1. Fill the Queue (Fallback)
If the scheduler does not generate events (e.g., school year ended → empty agenda), run:

```bash
node publish.js
2. Start the Configuration APIs
node index.js
3. Start the Consumer

The consumer:

Listens to the queue
Processes incoming events
Checks if the event exists in the database
Updates the database if changes are detected
4. Start the Alerter

The alerter:

Monitors important events
Triggers notifications or specific actions
5. Start the Scheduler

The scheduler:

Automatically generates events
Publishes them to the queue based on a defined schedule
🔄 System Workflow
Scheduler generates events → sends them to the queue
(Fallback) publish.js injects events if needed
Consumer:
Consumes messages from the queue
Detects if the event already exists
Updates the database if a change is detected
Alerter:
Reacts to important events or updates
🧪 Testing the System

To test the system behavior:

Inject or modify an event in the queue
Verify that:
The consumer detects the change
The database is updated correctly
⚠️ Special Case

If no events are generated (empty agenda):

Use publish.js to simulate events

This allows testing the system even without the scheduler.

✅ Goal

Ensure that:

Every event is properly processed
Changes are detected accurately
The database stays synchronized with the queue