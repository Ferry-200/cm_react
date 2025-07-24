import { ReactNode, useEffect, useState } from "react";
import { JellyfinApiContext } from "./context";
import { createJellyfinApi } from ".";

export const JellyfinApiProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const [api, setApi] = useState<any>(undefined)
  const [err, setErr] = useState<string | undefined>(undefined)

  useEffect(() => {
    let isMounted = true
    createJellyfinApi().then(
      (jellyfinApi) => {
        if (isMounted) {
          setApi(jellyfinApi)
        }
      },
      (reason) => {
        console.error(`Failed to create jellyfin api\n${reason}`)
        if (isMounted) {
          setErr(`${reason}`)
        }
      }
    )

    return () => {
      isMounted = false
    }
  }, [])

  return (
    api
      ? (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <JellyfinApiContext.Provider value={api}>
          {children}
        </JellyfinApiContext.Provider>
      )
      : <div>{err}</div>
  );
}