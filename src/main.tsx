import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { createAppRouter } from './router'
import { JellyfinApiProvider } from './jellyfin/provider'
import { PlayerProvider } from './player/provider'

import { init as initSentry } from "@sentry/react";

initSentry({
  dsn: "https://389968c86d02060f7432a2db81adefc1@o4509693787176960.ingest.de.sentry.io/4509693789012048",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JellyfinApiProvider>
      <PlayerProvider>
        <RouterProvider router={createAppRouter()} />
      </PlayerProvider>
    </JellyfinApiProvider>
  </StrictMode>
)
