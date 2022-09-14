import { CSSProperties } from "react"

export interface BaseProps {
  className?: string
  style?: CSSProperties
}

export type ImageSource = {
  defaultFormat: string
} & Record<string, string>