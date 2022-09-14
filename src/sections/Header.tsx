import { UserEntityServerResponse, UserServerResponse } from "server/server-response.types"
import { Avatar } from "src/components"
import styles from "./Header.module.scss"

type HeaderProps = {
  user?: UserEntityServerResponse
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <div className={styles.header}>
      {user && (
        <div className={styles["header__row"]}>
          <span>Logged in as</span>
          <div className={styles["header__user"]}>
            <Avatar
              image={user.image}
              defaultFormat={user.image.jpg ? "jpg" : "png"}
              alt={user.username}
            />
            <span className="username">{user.username}</span>
          </div>
        </div>
      )}
    </div>
  )
}
