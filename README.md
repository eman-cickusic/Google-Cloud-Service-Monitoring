# Google Cloud Service Monitoring

This repository demonstrates how to implement Service Level Objectives (SLOs) and alerts in Google Cloud Platform using a simple Node.js application deployed to App Engine.

## Overview

Google Cloud's Service Monitoring streamlines the creation of microservice Service Level Objectives (SLOs) based on availability, latency, or custom Service Level Indicators (SLIs). This project shows how to:

- Deploy a test Node.js application to App Engine
- Create a 99.5% availability SLO using Service Monitoring
- Set up alerting when error budgets are at risk
- Trigger the alert by simulating increased error rates

## Prerequisites

- Google Cloud Platform account
- `gcloud` CLI tool installed and configured
- Node.js and npm installed (for local testing)

## Project Structure

```
.
├── app.yaml                 # App Engine configuration file
├── index.js                 # Main application code
├── package-lock.json        # Dependency lock file
├── package.json             # Node.js project configuration
├── README.md                # This file 
```

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/[YOUR-USERNAME]/gcp-service-monitoring-project.git
cd gcp-service-monitoring-project
```

### 2. Create App Engine Application

Choose an appropriate region for your application:

```bash
gcloud app create --region=[REGION]
```

### 3. Deploy to App Engine

```bash
gcloud app deploy
```

After deployment, you can access your application at:
```
https://[YOUR-PROJECT-ID].appspot.com
```

## Creating Service Monitoring SLO

1. Navigate to Google Cloud Console > Monitoring > SLOs
2. Select your App Engine service
3. Create a new SLO with these settings:
   - Metric type: Availability
   - Evaluation method: Request-based
   - Period: Rolling 7 days
   - Goal: 99.5%

## Setting Up Alerts

1. In the SLO view, go to the "Alerts firing" tab
2. Click "CREATE SLO ALERT"
3. Configure notification channels (email, SMS, etc.)
4. Set appropriate lookback duration and burn rate threshold

## Testing the SLO

Generate load on your application with the following command:

```bash
while true; do curl -s https://[YOUR-PROJECT-ID].appspot.com/random-error -w '\n'; sleep .1s; done
```

To simulate increased error rates, modify the `index.js` file to increase error frequency and redeploy.

## Implementation Details

The application uses a `/random-error` endpoint that generates errors at a configurable rate. By default, it generates errors at approximately 0.1% rate (1 in 1000 requests). For testing purposes, we can increase this to 5% (1 in 20 requests) to trigger the SLO alert.

## Key Learnings

- Service Monitoring provides an easy way to define and track SLOs
- Error budgets help quantify acceptable error rates over time
- Alerts can be configured to notify teams before SLOs are breached
- App Engine makes it easy to deploy and scale applications

## Resources

- [Google Cloud Service Monitoring Documentation](https://cloud.google.com/service-monitoring/docs)
- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [SLO Best Practices](https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos)
