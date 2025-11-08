# SkinAI Engine - HTML/JavaScript Integration

A simple, standalone HTML/JavaScript integration example for embedding the SkinAI Engine using an iframe. This example demonstrates real-time event monitoring and provides a foundation for integrating SkinAI's skin analysis capabilities into your web application.


## Quick Start

1. **Replace the template ID** in `index.html` (line 15)
2. **Open `index.html`** in a web browser
3. **Interact with the SkinAI Engine** and watch events appear in the monitoring panel

## Configuration

### 1. Replace Template ID (Required)

In `index.html`, replace the UUID in the iframe `src` attribute with your own SkinAI Engine template ID:

```html
<iframe
  id="skinai-engine"
  src="https://skinai-engine.pulpoar.com/engine/v0/YOUR-TEMPLATE-ID-HERE"
  allow="camera *"
  title="SkinAI Engine"
></iframe>
```

> **Where to find your template ID:** Log in to your Pulpoar dashboard and navigate to your SkinAI Engine templates.

### 2. Update Allowed Origins (If Needed)

In `index.js` (line 5), update the `ALLOWED_ORIGINS` array if you're hosting the integration on a different domain:

```javascript
const ALLOWED_ORIGINS = [
  'https://skinai-engine.pulpoar.com',
];
```

## Event Integration

The SkinAI Engine communicates with your application by sending events via the `postMessage` API. All events are captured and can be processed with custom business logic.

### Supported Event Types

| Event Type | Handler Function | Use Case |
|-----------|-----------------|----------|
| `page_view` | `handlePageView()` | Track analytics for page navigation |
| `skin_problem_evaluation` | `handleSkinEvaluation()` | Store and process skin analysis results |
| `question_answered` | `handleQuestionAnswered()` | Log questionnaire responses |
| `send_email` | `handleSendEmail()` | Integrate with email services |
| `validation_email` | `handleValidationEmail()` | Handle email validation events |
| `add_to_cart` | `handleAddToCart()` | E-commerce cart integration |
| `go_to_product` | `handleGoToProduct()` | Product page routing |


> **PARTNER INTEGRATION POINT:** Look for the comment in `index.js` at the `handleEventType()` function for detailed guidance on where to add your integration logic.

## Security

### Origin Validation

All incoming postMessage events are validated against the `ALLOWED_ORIGINS` array before processing. Events from unauthorized origins are:
- Rejected and not processed
- Logged to the console with a warning

```javascript
// Security: Validate origin
const isAllowedOrigin = ALLOWED_ORIGINS.some(origin =>
  event.origin.startsWith(origin)
);

if (!isAllowedOrigin) {
  console.warn('Message from unauthorized origin:', event.origin);
  return;
}
```

## Development

### Testing Locally

You can simply open `index.html` directly in your browser, or use a local development server:

**Option 1: VS Code Live Server Extension**
- Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Right-click `index.html` and select "Open with Live Server"

**Option 2: Command Line**
```bash
# Using Python (any port)
python -m http.server

# Using Node.js (any port)
npx http-server
```

Then navigate to the URL shown in your terminal (typically `http://localhost:PORT`)
