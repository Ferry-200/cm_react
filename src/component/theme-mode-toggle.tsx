import { useState } from "react"
import { applyThemeMode, getCurrThemeMode } from "../md-theme/theme-helper"
import { StandardIconButton } from "./icon-button"
import { LucideMoon, LucideSun } from "lucide-react"
import { Stylable } from "../utils"

export const ThemeModeToggle = ({ className, style }: Stylable) => {
  const [mode, setMode] = useState(getCurrThemeMode())

  return (
    <StandardIconButton
      className={className}
      style={style}
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