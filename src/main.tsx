import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { createAppRouter } from './router'
import { PlayerContext } from './player/context'
import { createPlayer } from './player'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerContext.Provider value={createPlayer()}>
      <RouterProvider router={createAppRouter()} />
    </PlayerContext.Provider>
  </StrictMode>
)
