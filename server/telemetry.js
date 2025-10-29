// server/telemetry.js
import appInsights from 'applicationinsights';

appInsights
  .setup('InstrumentationKey=6d30d278-ea7a-469e-8a06-eccc33411eb3;IngestionEndpoint=https://southindia-0.in.applicationinsights.azure.com/;LiveEndpoint=https://southindia.livediagnostics.monitor.azure.com/;ApplicationId=ae48c4c0-25ac-4902-b247-9281054e2d9f')
  .setAutoCollectRequests(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectConsole(true)
  .setSendLiveMetrics(true)
  .start();

export default appInsights;
