import { blueFromArgb, greenFromArgb, redFromArgb, Theme, themeFromImage } from "@material/material-color-utilities";
import { getImageStreamUrl } from "../jellyfin/streaming";

const MD_THEME_ITEM_ID = '--md-theme-item-id'

export function needChangeTheme(itemId: string) {
    return document.body.style.getPropertyValue(MD_THEME_ITEM_ID) !== itemId
}

export async function themeFromAlbumArt(itemId: string) {
    const src = getImageStreamUrl(itemId, 64, false)
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

export function applyThemeToBody(theme: Theme, itemId: string) {
    const brightness = document.body.classList[0]
    const isDark = brightness === 'md-dark'
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light

    const styleText = [
        `${MD_THEME_ITEM_ID}: ${itemId};`,
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

        `--md-outline: ${argbToCssRgb(scheme.outline)};`,
        `--md-outline-variant: ${argbToCssRgb(scheme.outlineVariant)};`,
    ].join('')

    document.body.style.cssText = styleText
}