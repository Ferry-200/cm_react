import { blueFromArgb, greenFromArgb, redFromArgb, Theme, themeFromImage, themeFromSourceColor } from "@material/material-color-utilities";
import { getImageStreamUrl } from "../jellyfin/streaming";
import { Api } from "@jellyfin/sdk";

const MD_THEME_ITEM_ID = '--md-theme-item-id'
const MD_THEME_SOURCE = '--md-theme-source'

export function needChangeTheme(itemId: string) {
    return document.body.style.getPropertyValue(MD_THEME_ITEM_ID) !== itemId
}

export async function themeFromAlbumArt(jellyfinApi: Api, itemId: string) {
    const src = getImageStreamUrl(jellyfinApi, itemId, 64, false)
    const img = new Image()
    // NOTE: no need when deploy
    // 跨域访问图片
    img.crossOrigin = 'Anonymous';
    img.src = src

    const theme = await themeFromImage(img);

    return {
        theme: theme, associated: itemId
    };
}

/**
 * md color is always *not* transparent, 
 * this can help construct a css rgb color with opacity
 * @param argb color in argb number
 * @param opacity undefined: 1
 * @returns 'rgb(r, g, b)'
 */
function argbToCssRgb(argb: number, opacity?: number) {
    const r = redFromArgb(argb)
    const g = greenFromArgb(argb)
    const b = blueFromArgb(argb)

    return opacity
        ? `rgb(${r}, ${g}, ${b}, ${opacity})`
        : `rgb(${r}, ${g}, ${b})`
}

type ThemeMode = 'md-light' | 'md-dark'

export function getCurrThemeMode(): ThemeMode {
    return document.body.classList[0] as ThemeMode
}

export function applyThemeMode(mode: ThemeMode) {
    const bodyClassList = document.body.classList
    bodyClassList.replace(bodyClassList[0], mode)

    const source = document.body.style.getPropertyValue(MD_THEME_SOURCE)
    applyThemeToBody(
        themeFromSourceColor(
            source.length === 0 ? 4285963487 : Number.parseInt(source)
        )
    )
}

export function applyThemeToBody(theme: Theme, itemId?: string) {
    const brightness = document.body.classList[0]
    const isDark = brightness === 'md-dark'
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light

    const styleText = [
        `${MD_THEME_ITEM_ID}: ${itemId};`,
        `${MD_THEME_SOURCE}: ${theme.source};`,
        `--md-primary: ${argbToCssRgb(scheme.primary)};`,
        `--md-on-primary: ${argbToCssRgb(scheme.onPrimary)};`,
        `--md-primary-hover: ${argbToCssRgb(scheme.onPrimary, 0.08)};`,
        `--md-primary-active: ${argbToCssRgb(scheme.onPrimary, 0.12)};`,

        `--md-primary-container: ${argbToCssRgb(scheme.primaryContainer)};`,
        `--md-on-primary-container: ${argbToCssRgb(scheme.onPrimaryContainer)};`,
        `--md-primary-container-hover: ${argbToCssRgb(scheme.onPrimaryContainer, 0.08)};`,
        `--md-primary-container-active: ${argbToCssRgb(scheme.onPrimaryContainer, 0.12)};`,

        `--md-secondary: ${argbToCssRgb(scheme.secondary)};`,
        `--md-on-secondary: ${argbToCssRgb(scheme.onSecondary)};`,
        `--md-secondary-hover: ${argbToCssRgb(scheme.onSecondary, 0.08)};`,
        `--md-secondary-active: ${argbToCssRgb(scheme.onSecondary, 0.12)};`,

        `--md-secondary-container: ${argbToCssRgb(scheme.secondaryContainer)};`,
        `--md-on-secondary-container: ${argbToCssRgb(scheme.onSecondaryContainer)};`,
        `--md-secondary-container-hover: ${argbToCssRgb(scheme.onSecondaryContainer, 0.08)};`,
        `--md-secondary-container-active: ${argbToCssRgb(scheme.onSecondaryContainer, 0.12)};`,

        `--md-error: ${argbToCssRgb(scheme.error)};`,
        `--md-on-error: ${argbToCssRgb(scheme.onError)};`,
        `--md-error-hover: ${argbToCssRgb(scheme.onError, 0.08)};`,
        `--md-error-active: ${argbToCssRgb(scheme.onError, 0.12)};`,

        `--md-error-container: ${argbToCssRgb(scheme.errorContainer)};`,
        `--md-on-error-container: ${argbToCssRgb(scheme.onErrorContainer)};`,
        `--md-error-container-hover: ${argbToCssRgb(scheme.onErrorContainer, 0.08)};`,
        `--md-error-container-active: ${argbToCssRgb(scheme.onErrorContainer, 0.12)};`,

        `--md-surface: ${argbToCssRgb(scheme.surface)};`,
        `--md-on-surface: ${argbToCssRgb(scheme.onSurface)};`,
        `--md-surface-hover: ${argbToCssRgb(scheme.onSurface, 0.08)};`,
        `--md-surface-active: ${argbToCssRgb(scheme.onSurface, 0.12)};`,

        // there isn't surface-container in newest material-color-utilities, 
        // so here we generate from neutral palette.
        // ref: https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
        `--md-surface-container: ${argbToCssRgb(
            isDark
                ? theme.palettes.neutral.tone(12)
                : theme.palettes.neutral.tone(94)
        )};`,

        `--md-surface-variant: ${argbToCssRgb(scheme.surfaceVariant)};`,
        `--md-on-surface-variant: ${argbToCssRgb(scheme.onSurfaceVariant)};`,

        `--md-inverse-surface: ${argbToCssRgb(scheme.inverseSurface)};`,
        `--md-inverse-on-surface: ${argbToCssRgb(scheme.inverseOnSurface)};`,
        `--md-inverse-surface-hover: ${argbToCssRgb(scheme.inverseOnSurface, 0.08)};`,
        `--md-inverse-surface-active: ${argbToCssRgb(scheme.inverseOnSurface, 0.12)};`,
        `--md-inverse-primary: ${argbToCssRgb(scheme.inversePrimary)};`,

        `--md-outline: ${argbToCssRgb(scheme.outline)};`,
        `--md-outline-variant: ${argbToCssRgb(scheme.outlineVariant)};`,
    ].join('')

    document.body.style.cssText = styleText
}