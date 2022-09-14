import styles from "./Dialog.module.scss"
import { BaseButton } from "../Button/Button"
import { MouseEventHandler } from "react"
import { getClassName } from "src/utils/getClassName"
import { OverlayingPopup } from "./OverlayingPopup"

export type DialogProps = {
  title: string
  text: string
  primaryBtnText: string
  primaryBtnOnClick?: () => void
  secondaryBtnText: string
  secondaryBtnOnClick?: () => void
  primaryBtnType?: "default" | "danger"
  isOpened: boolean
  onClose?: () => void
}

export const Dialog = ({
  title,
  text,
  primaryBtnOnClick,
  primaryBtnText,
  secondaryBtnOnClick = () => {},
  primaryBtnType = "default",
  secondaryBtnText,
  isOpened,
  onClose,
}: DialogProps) => {
  console.log('here')
  return (
    <OverlayingPopup isOpened={isOpened} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.text}>{text}</div>
        <div className={styles.actions}>
          <BaseButton
            className={getClassName([styles.button, styles["button-secondary"]])}
            onClick={() => {
              onClose()
              secondaryBtnOnClick()
            }}
          >
            {secondaryBtnText}
          </BaseButton>
          <BaseButton
            className={getClassName([styles.button, styles[`button-${primaryBtnType}`]])}
            onClick={() => {
              onClose()
              primaryBtnOnClick()
            }}
          >
            {primaryBtnText}
          </BaseButton>
        </div>
      </div>
    </OverlayingPopup>
  )
}
