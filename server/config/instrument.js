// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";


Sentry.init({
  dsn: "https://ace8cf35e594d51cb430a10e7e7d53ee@o4509835070078976.ingest.us.sentry.io/4509835079581696",
  integrations:[
    Sentry.mongooseIntegration()
  ],

  sendDefaultPii: true,
});





