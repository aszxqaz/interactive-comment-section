import { UserEntityServerResponse } from "../../../server/server-response.types"
import { getClassName } from "../../utils/getClassName"
import { objectKeys } from "../../utils/objectKeys"
import { BaseProps, ImageSource } from "../types"

interface AvatarProps extends BaseProps {
  size?: "sm" | "md" | "lg"
  image: UserEntityServerResponse["image"]
  defaultFormat?: string
  alt: string
}

export const Avatar = ({
  className,
  size = "sm",
  style,
  defaultFormat,
  alt,
  image: _image,
}: AvatarProps) => {
  defaultFormat = defaultFormat || "jpg" in _image ? "jpg" : "png"
  const image = { ..._image }
  const defaultSrc = image[defaultFormat]
  delete image[defaultFormat]

  return (
    <div className={getClassName([`avatar avatar-${size}`, className])} style={style}>
      <picture>
        {objectKeys(image).map((format) => (
          <source key={format} srcSet={image[format]} type={`image/${format}`} />
        ))}
        <img src={defaultSrc} alt={alt} />
      </picture>
    </div>
  )
}
