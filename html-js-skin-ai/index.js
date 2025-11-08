// Store all received events
let eventsLog = [];

// Allowed origins for security
const ALLOWED_ORIGINS = [
  'https://skinai-engine.pulpoar.com',
];

// Listen for postMessage events
window.addEventListener('message', function(event) {
  // Security: Validate origin
  const isAllowedOrigin = ALLOWED_ORIGINS.some(origin =>
    event.origin.startsWith(origin)
  );

  if (!isAllowedOrigin) {
    console.warn('Message from unauthorized origin:', event.origin);
    return;
  }

  // Log the event
  const eventData = {
    timestamp: new Date().toISOString(),
    origin: event.origin,
    data: event.data
  };

  eventsLog.push(eventData);

  // Console log for debugging
  console.log('Event received:', eventData);

  // Display in UI
  displayEvent(eventData);

  // Update counter
  updateEventCount();

  // Handle specific event types
  handleEventType(event.data);
});

/**
 * Display event in the UI
 */
function displayEvent(eventData) {
  const eventsLogEl = document.getElementById('events-log');

  // Remove empty state if exists
  const emptyState = eventsLogEl.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  // Create event item
  const eventItem = document.createElement('div');
  const eventType = eventData.data.event || eventData.data.event_id || 'unknown';
  eventItem.className = 'event-item';
  eventItem.setAttribute('data-event', eventType);

  // Format timestamp
  const timestamp = new Date(eventData.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  eventItem.innerHTML = `
    <div class="event-header">
      <span class="event-type">${eventType}</span>
      <span class="event-timestamp">${timestamp}</span>
    </div>
    <div class="event-origin">Origin: ${eventData.origin}</div>
    <div class="event-data">
      <pre>${JSON.stringify(eventData.data, null, 2)}</pre>
    </div>
  `;

  // Add to top of log
  eventsLogEl.insertBefore(eventItem, eventsLogEl.firstChild);

  // Limit to 50 events in UI
  const items = eventsLogEl.querySelectorAll('.event-item');
  if (items.length > 50) {
    items[items.length - 1].remove();
  }
}

/**
 * Update event counter
 */
function updateEventCount() {
  const countEl = document.getElementById('event-count');
  countEl.textContent = eventsLog.length;
}

/**
 * Handle specific event types from SkinAI Engine
 *
 * PARTNER INTEGRATION POINT:
 * This is where you should add your custom business logic to respond to SkinAI events.
 * Each event type below can trigger specific actions on your platform, such as:
 * - Tracking analytics (page_view)
 * - Storing skin analysis results (skin_problem_evaluation)
 * - Managing shopping cart (add_to_cart, go_to_product)
 *
 * Add your API calls, tracking pixels, or other integration logic in the respective
 * event handler functions below.
 */
function handleEventType(data) {
  const eventType = data.event || data.event_id;

  switch(eventType) {
    case 'page_view':
      handlePageView(data);
      break;
    case 'skin_problem_evaluation':
      handleSkinEvaluation(data);
      break;
    case 'question_answered':
      handleQuestionAnswered(data);
      break;
    case 'send_email':
      handleSendEmail(data);
      break;
    case 'validation_email':
      handleValidationEmail(data);
      break;
    case 'add_to_cart':
      handleAddToCart(data);
      break;
    case 'go_to_product':
      handleGoToProduct(data);
      break;
    default:
      console.log('Event type:', eventType, data);
  }
}

/**
 * Event handlers
 */
function handlePageView(payload) {
  console.log('Page View:', payload);
}

function handleSkinEvaluation(payload) {
  console.log('Skin Evaluation:', payload);
}

function handleQuestionAnswered(payload) {
  console.log('Question Answered:', payload);
}

function handleSendEmail(payload) {
  console.log('Send Email:', payload);
}

function handleValidationEmail(payload) {
  console.log('Validation Email:', payload);
}

function handleAddToCart(payload) {
  console.log('Add to Cart:', payload);
}

function handleGoToProduct(payload) {
  console.log('Go to Product:', payload);
}

/**
 * Clear all events
 */
function clearEvents() {
  if (confirm('Are you sure you want to clear all events?')) {
    eventsLog = [];
    const eventsLogEl = document.getElementById('events-log');
    eventsLogEl.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <h3>No events yet</h3>
        <p>Interact with the SkinAI Engine to see events appear here</p>
      </div>
    `;
    updateEventCount();
    console.clear();
    console.log('Events cleared');
  }
}

/**
 * Export events to JSON
 */
function exportEvents() {
  if (eventsLog.length === 0) {
    alert('No events to export');
    return;
  }

  const dataStr = JSON.stringify(eventsLog, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `skinai-events-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);

  console.log('Events exported:', eventsLog.length, 'events');
}

// Log initialization
console.log('SkinAI Engine Integration initialized');
console.log('Listening for events from:', ALLOWED_ORIGINS);
console.log('---');
