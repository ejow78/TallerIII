import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './stage.css'
import { LookContext, type Fidelity, type Layout, type Palette, type Theme } from './looks'

export type LookTokens = { [token: `--ss-${string}`]: string }

export interface Rect {
  x: number
  y: number
  width: number
  height: number
  cx: number
  cy: number
  right: number
  bottom: number
}

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0, cx: 0, cy: 0, right: 0, bottom: 0 }
const NONE = {}

export interface StageProps<S> {
  width: number
  height: number
  initial?: S
  compact?: { below: number; width: number; height: number }
  theme?: Theme
  palette?: Palette
  fidelity?: Fidelity
  greys?: 'warm' | 'cool'
  tokens?: LookTokens
  fill?: boolean
  accent?: string
  ground?: 'orbs' | [string, string] | [string, string, string]
  className?: string
  specimen?: boolean
  unframed?: boolean
  children: (s: S, rect: (name: string) => Rect, layout: Layout) => ReactNode
}

export function Stage<S extends object>({
  width,
  height,
  initial = NONE as S,
  compact,
  palette = 'accent',
  greys,
  fidelity = 'standard',
  specimen,
  unframed,
  accent,
  tokens,
  ground,
  fill: fillProp = false,
  theme = 'light',
  className,
  children,
}: StageProps<S>) {
  const [layout, setLayout] = useState<Layout>('wide')
  const [grows, setGrows] = useState(false)
  const [scale, setScale] = useState(1)
  const [inset, setInset] = useState(0)

  const designW = layout === 'compact' && compact ? compact.width : width
  const designH = layout === 'compact' && compact ? compact.height : height

  const fitRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const fit = fitRef.current
    if (!fit) return
    const measure = () => {
      const w = fit.clientWidth
      const wide = !!fit.parentElement?.closest('[data-ss-wide]')
      const next: Layout = compact && !wide && w < compact.below ? 'compact' : 'wide'
      setLayout(next)
      const grow = fillProp || !!fit.parentElement?.closest('[data-ss-fill]')
      setGrows(grow)
      const dw = next === 'compact' ? compact!.width : width
      const s = Math.min(grow ? 2 : 1, w / dw)
      setScale(s)
      setInset(Math.max(0, (w - dw * s) / 2))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(fit)
    return () => ro.disconnect()
  }, [width, compact?.below, compact?.width, fillProp])

  const rectFor = useCallback(() => EMPTY_RECT, [])
  const look = useMemo(() => ({ theme, palette, fidelity, layout }), [theme, palette, fidelity, layout])

  return (
    <div ref={fitRef} className={`ss-fit${className ? ` ${className}` : ''}`} style={{ maxWidth: grows ? undefined : width, height: designH * scale }}>
      <div
        ref={rootRef}
        className="ss-stage"
        data-specimen={specimen || undefined}
        data-unframed={unframed || undefined}
        data-still
        data-theme={theme}
        data-palette={palette}
        data-greys={greys === 'cool' ? 'cool' : undefined}
        data-fidelity={fidelity}
        data-layout={layout}
        style={{
          width: designW,
          height: designH,
          marginLeft: inset || undefined,
          transform: `scale(${scale})`,
          ...tokens,
          ...(accent ? { ['--ss-accent' as string]: accent, ['--ss-accent-2' as string]: accent, ['--ss-accent-soft' as string]: `color-mix(in srgb, ${accent} 14%, transparent)` } : null),
        }}
      >
        {ground && (
          <div
            className="ss-ground"
            aria-hidden
            style={
              Array.isArray(ground)
                ? ({ ['--ss-orb-1' as string]: ground[0], ['--ss-orb-2' as string]: ground[1], ...(ground[2] ? { ['--ss-orb-3' as string]: ground[2] } : null) } as CSSProperties)
                : undefined
            }
          />
        )}
        <LookContext.Provider value={look}>{children(initial, rectFor, layout)}</LookContext.Provider>
      </div>
    </div>
  )
}
