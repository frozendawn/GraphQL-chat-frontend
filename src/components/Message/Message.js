import Avatar from "@mui/material/Avatar";
import styles from "./Message.module.css"
import { useContext } from "react";
import UserContext from "../context/user-context";

const Message = ({message}) => {
  const { user } = useContext(UserContext)
  return (
    <div className={`${styles.Container} ${user && user.id === message.author.id ? styles.Message_home_bubble : styles.Message_away_bubble}`}>
      {user && user.id !== message.author.id && <Avatar sx={{padding: '5px'}} alt="Remy Sharp" src={user.avatar} />}
      <div className={user && user.id === message.author.id ? styles.MessageHome : styles.MessageAway}>
        <p>{message.message}</p>
      </div>
    </div>
  )
}
export default Message;
