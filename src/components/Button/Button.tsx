import { ButtonHTMLAttributes, ReactNode } from "react"
import { getClassName } from "src/utils/getClassName"
import { BaseSpinner } from "../Spinner/Spinner"
import { BaseProps } from "../types"
import styles from "./Button.module.scss"

type BaseButtonProps = BaseProps & {
  isSubmitting?: boolean
  type?: "button" | "submit" | "reset"
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export const BaseButton = ({
  className,
  style,
  isSubmitting,
  type = "button",
  children,
  ...rest
}: BaseButtonProps) => {
  return (
    <button
      className={getClassName([styles.button, className])}
      type={type}
      disabled={isSubmitting}
      style={style}
      {...rest}
    >
      <span className={styles.button__label}>{children}</span>
      {isSubmitting && <BaseSpinner className={styles.button__spinner} />}
    </button>
  )
}
