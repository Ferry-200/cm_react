import { ReactNode, useEffect, useRef, useState } from "react"
import { GlobalMessagerContext, GlobalMessagerNotifier } from "./global-messager-context"
import { Toast } from "radix-ui";
import { StandardIconButton } from "./icon-button";
import { LucideX } from "lucide-react";
import { styled } from "@linaria/react";

type MessageContainerProp = {
  message: string | null,
  onClose: VoidFunction
}

const MessageViewPort = styled(Toast.Viewport)`
  margin: 0;
  padding: 0;
  position: fixed;
  left: calc(50% - 150px);
  bottom: 32px;
`

const MessageTile = styled(Toast.Root)`
  background-color: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  width: 300px;
  padding-left: 16px;
  padding-right: 12px;
  border-radius: 4px;
  box-shadow: var(--md-elevation-2);

  &[data-state="open"] {
    animation: slideIn 100ms;
  }
  &[data-state="closed"] {
    animation: slideOut 100ms;
  }
  &[data-swipe="end"] {
    animation: slideOut 100ms;
  }
  
  @keyframes hide {
  	from {
  		opacity: 1;
  	}
  	to {
  		opacity: 0;
  	}
  }
  
  @keyframes slideIn {
  	from {
  		transform: translateY(calc(100% + 32px));
  	}
  	to {
  		transform: translateY(0);
  	}
  }
  
  @keyframes slideOut {
  	from {
  		transform: translateY(0);
  	}
  	to {
  		transform: translateY(calc(100% + 32px));
  	}
  }
`

const MessageTileAction = styled(StandardIconButton)`
  color: var(--md-inverse-on-surface);
  &:hover::before {
    background-color: var(--md-inverse-surface-hover);
  }

  &:active::before {
    background-color: var(--md-inverse-surface-active);
  }
`

const MessageContainer = ({ message, onClose }: MessageContainerProp) => (
  <Toast.Provider swipeDirection="right">
    <MessageTile className="ToastRoot" open={message !== null}>
      <Toast.Title>{message}</Toast.Title>
      <Toast.Close asChild>
        <MessageTileAction onClick={onClose}><LucideX /></MessageTileAction>
      </Toast.Close>
    </MessageTile>
    <MessageViewPort />
  </Toast.Provider>
)

export const GlobalMessagerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<string[]>([])
  const [current, setCurrent] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const showMessage = (text: string) => {
    setQueue(prev => [...prev, text])
  }

  useEffect(() => {
    GlobalMessagerNotifier.addListener(showMessage)
    return () => {
      GlobalMessagerNotifier.removeListener(showMessage)
    }
  }, [])

  useEffect(() => {
    if (!current && queue.length > 0) {
      const next = queue[0]
      setCurrent(next)
      setQueue(prev => prev.slice(1))

      timerRef.current = setTimeout(() => {
        setCurrent(null)
      }, 3000, [])
    }
  }, [queue, current])

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrent(null)
  }

  return (
    <GlobalMessagerContext.Provider value={{ showMessage: showMessage }}>
      {children}
      <MessageContainer message={current} onClose={handleClose} />
    </GlobalMessagerContext.Provider>
  )
}
