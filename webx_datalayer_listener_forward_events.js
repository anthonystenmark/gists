
/**
 * DataLayer Listener -> Optimizely Event Forwarder
 *
 * This script overrides window.dataLayer.push to listen for new events
 * and forwards them to Optimizely Web Experimentation.
 *
 * Similar to the GTM version, this tries to ensure the event is configured 
 * in the Optimizely project before tracking to avoid noise.
*/

const forwardToOptimizely = (item) => {
  // Ensure we have a valid event object
  if (!item || typeof item !== 'object' || !item.event) return;
  const eventName = item.event;
  const optimizely = window.optimizely || [];

  // Check if Optimizely is active and we can access the data file to filter only configured events.
  const isSnippetActive = optimizely && typeof optimizely.get === 'function';

  if (isSnippetActive) {
    try {
      const optimizelyData = optimizely.get('data');
      if (optimizelyData && optimizelyData.events) {
        const configuredEvents = Object.values(optimizelyData.events);
        const isMatched = configuredEvents.some((config) => config.apiName === eventName);

        // If we have the data and it's not a match, ignore it.
        // Otherwise push the event to Optimizely.
        if (!isMatched) return;

        var cleanedProperties = {};
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            if (key !== 'event' && key !== 'gtm.uniqueEventId' && key !== 'gtm.triggers') {
              cleanedProperties[key] = item[key];
            }
          }
        }

        window.optimizely.push({
          type: 'event',
          eventName: eventName,
          properties: cleanedProperties
        });

        console.log('Optimizely Forwarder: Pushed event', eventName, cleanedProperties);
      }
    } catch (e) {
      return;
    }
  } else {
    return;
  }
};

// Initialize dataLayer if not present
window.dataLayer = window.dataLayer || [];

// Save original push
const originalPush = window.dataLayer.push;

// Override original push
window.dataLayer.push = function () {
  const args = Array.from(arguments);
  const result = originalPush.apply(window.dataLayer, args);

  try {
    args.forEach(forwardToOptimizely);
  } catch (e) {
    console.error('Optimizely Forwarder Error:', e);
  }

  return result;
};
