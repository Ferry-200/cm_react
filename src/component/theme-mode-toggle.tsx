import { useState } from "react"
import { applyThemeMode, getCurrThemeMode } from "../md-theme/theme-helper"
import { StandardIconButton } from "./icon-button"
import { LucideMoon, LucideSun } from "lucide-react"

export const ThemeModeToggle = () => {
  const [mode, setMode] = useState(getCurrThemeMode())

  return (
    <StandardIconButton
      onClick={() => {
        const newMode = mode === 'md-light' ? 'md-dark' : 'md-light'
        setMode(newMode)
        applyThemeMode(newMode)
      }}
    >
      {mode === 'md-light' ? <LucideSun /> : <LucideMoon />}
    </StandardIconButton>
  )
}