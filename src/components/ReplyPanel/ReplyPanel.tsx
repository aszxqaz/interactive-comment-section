import { getClassName } from "../../utils/getClassName"
import { BaseProps } from "../types"
import { Avatar } from "../Avatar/Avatar"
import {
  ChangeEventHandler,
  FormEventHandler,
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { UserContext } from "pages"
import { BaseSpinner } from "../Spinner/Spinner"
import { BaseButton } from "../Button/Button"
import styles from "./ReplyPanel.module.scss"

interface ReplyPanelProps extends BaseProps {
  showAvatar?: boolean
  onSubmit?: (content: string) => Promise<unknown>
  placeholder: string
  buttonText: string
  replyTo?: string
  autoFocus?: boolean
  initialContent?: string
}

export const ReplyPanel = forwardRef(function _ReplyPanel(
  {
    className,
    style,
    onSubmit,
    placeholder,
    buttonText,
    autoFocus,
    replyTo,
    showAvatar = true,
    initialContent = "",
  }: ReplyPanelProps,
  panelRef: ForwardedRef<HTMLDivElement>
) {
  const me = useContext(UserContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>()

  const greeting = replyTo ? `@${replyTo} ` : ""
  const [content, setContent] = useState(greeting + initialContent)

  useEffect(() => {
    const textarea = textareaRef.current
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    textarea.focus()
  }, [autoFocus])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    const content = (e.target as HTMLFormElement)["content"].value.slice(greeting.length)

    try {
      const data = await onSubmit(content)
      console.log(data)
    } catch (e) {
      console.log(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    const value = e.target.value
    if (!value.startsWith(greeting)) return
    setContent(value)
  }

  return (
    <div ref={panelRef} style={style} className={getClassName([styles["reply-panel"], className])}>
      {showAvatar && (
        <Avatar
          className={styles["reply-panel__avatar"]}
          alt={me?.username}
          image={me ? me.image : {}}
        />
      )}
      <form
        className={styles["reply-panel__form"]}
        onSubmit={e => {
          setIsSubmitting(true)
          handleSubmit(e)
        }}
      >
        <textarea
          name="content"
          className={getClassName([styles["reply-panel__textarea"], "textarea-standard"])}
          ref={textareaRef}
          onChange={handleChange}
          placeholder={placeholder}
          minLength={1}
          rows={3}
          value={content}
        />
        <BaseButton
          className={styles["reply-panel__submit-btn"]}
          isSubmitting={isSubmitting}
          type="submit"
        >
          {buttonText}
        </BaseButton>
      </form>
    </div>
  )
})
