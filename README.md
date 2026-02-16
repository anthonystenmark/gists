# Optimizely Gists

A collection of utility scripts, snippets, and helpers for Optimizely Web Experimentation and Feature Experimentation.

## Contents

- **webx_datalayer_listener_forward_events.js**: A script that overrides `window.dataLayer.push` to listen for new dataLayer events and automatically forwards them to Optimizely Web Experimentation if they are configured in the project.
- **webx_gtm_forward_events.html**: A GTM tag template script to forward specific GTM events to Optimizely.
