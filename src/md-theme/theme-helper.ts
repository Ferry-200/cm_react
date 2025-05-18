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
 * this can help construct a hex-color with alpha
 * @param argb color in argb number
 * @param opacity undefined: 1
 * @returns '#rrggbbaa'
 */
function hexFromRgbOpacity(argb: number, opacity?: number) {
    const outParts = [
        redFromArgb(argb).toString(16),
        greenFromArgb(argb).toString(16),
        blueFromArgb(argb).toString(16),
        Math.floor((opacity ?? 1) * 255).toString(16)
    ]

    // Pad single-digit output values
    for (const [i, part] of outParts.entries()) {
        if (part.length === 1) {
            outParts[i] = '0' + part
        }
    }

    return '#' + outParts.join('')
}

export function applyThemeToBody(theme: Theme, itemId: string) {
    const brightness = document.body.classList[0]
    const isDark = brightness === 'md-dark'
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light

    const styleText = [
        `${MD_THEME_ITEM_ID}: ${itemId};`,
        `--md-primary: ${hexFromRgbOpacity(scheme.primary)};`,
        `--md-on-primary: ${hexFromRgbOpacity(scheme.onPrimary)};`,
        `--md-primary-hover: ${hexFromRgbOpacity(scheme.onPrimary, 0.08)};`,
        `--md-primary-active: ${hexFromRgbOpacity(scheme.onPrimary, 0.12)};`,

        `--md-primary-container: ${hexFromRgbOpacity(scheme.primaryContainer)};`,
        `--md-on-primary-container: ${hexFromRgbOpacity(scheme.onPrimaryContainer)};`,
        `--md-primary-container-hover: ${hexFromRgbOpacity(scheme.onPrimaryContainer, 0.08)};`,
        `--md-primary-container-active: ${hexFromRgbOpacity(scheme.onPrimaryContainer, 0.12)};`,

        `--md-secondary: ${hexFromRgbOpacity(scheme.secondary)};`,
        `--md-on-secondary: ${hexFromRgbOpacity(scheme.onSecondary)};`,
        `--md-secondary-hover: ${hexFromRgbOpacity(scheme.onSecondary, 0.08)};`,
        `--md-secondary-active: ${hexFromRgbOpacity(scheme.onSecondary, 0.12)};`,

        `--md-secondary-container: ${hexFromRgbOpacity(scheme.secondaryContainer)};`,
        `--md-on-secondary-container: ${hexFromRgbOpacity(scheme.onSecondaryContainer)};`,
        `--md-secondary-container-hover: ${hexFromRgbOpacity(scheme.onSecondaryContainer, 0.08)};`,
        `--md-secondary-container-active: ${hexFromRgbOpacity(scheme.onSecondaryContainer, 0.12)};`,

        `--md-error: ${hexFromRgbOpacity(scheme.error)};`,
        `--md-on-error: ${hexFromRgbOpacity(scheme.onError)};`,
        `--md-error-hover: ${hexFromRgbOpacity(scheme.onError, 0.08)};`,
        `--md-error-active: ${hexFromRgbOpacity(scheme.onError, 0.12)};`,

        `--md-error-container: ${hexFromRgbOpacity(scheme.errorContainer)};`,
        `--md-on-error-container: ${hexFromRgbOpacity(scheme.onErrorContainer)};`,
        `--md-error-container-hover: ${hexFromRgbOpacity(scheme.onErrorContainer, 0.08)};`,
        `--md-error-container-active: ${hexFromRgbOpacity(scheme.onErrorContainer, 0.12)};`,

        `--md-surface: ${hexFromRgbOpacity(scheme.surface)};`,
        `--md-on-surface: ${hexFromRgbOpacity(scheme.onSurface)};`,
        `--md-surface-hover: ${hexFromRgbOpacity(scheme.onSurface, 0.08)};`,
        `--md-surface-active: ${hexFromRgbOpacity(scheme.onSurface, 0.12)};`,

        // there isn't surface-container in newest material-color-utilities, 
        // so here we generate from neutral palette.
        // ref: https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
        `--md-surface-container: ${hexFromRgbOpacity(
            isDark
                ? theme.palettes.neutral.tone(12)
                : theme.palettes.neutral.tone(94)
        )};`,

        `--md-surface-variant: ${hexFromRgbOpacity(scheme.surfaceVariant)};`,
        `--md-on-surface-variant: ${hexFromRgbOpacity(scheme.onSurfaceVariant)};`,

        `--md-outline: ${hexFromRgbOpacity(scheme.outline)};`,
        `--md-outline-variant: ${hexFromRgbOpacity(scheme.outlineVariant)};`,
    ].join('')

    document.body.style.cssText = styleText
}