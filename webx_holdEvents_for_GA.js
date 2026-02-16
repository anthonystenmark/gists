window.optimizely = window.optimizely || [];
window.optimizely.push({ type: "holdEvents" });

const activationEvent = 'gtm.load';
let hasSent = false;

const sendEvents = () => {
  if (hasSent) return;
  hasSent = true;
  window.optimizely.push({ type: "sendEvents" });
  clearInterval(pollForActivation);
  clearTimeout(fallbackTimeout);
};

const pollForActivation = setInterval(() => {
  if (!window.dataLayer) return;
  if (window.dataLayer.some(entry => entry.event === activationEvent)) {
    sendEvents();
  }
}, 100);

// Fallback in case GA never loads
const fallbackTimeout = setTimeout(sendEvents, 5000);