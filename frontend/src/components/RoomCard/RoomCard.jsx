import React from 'react'
import styles from './RoomCard.module.css'

const RoomCard = ({room}) => {
    console.log(room)
  return (
    <div className={styles.card}>
      <h3 className={styles.topic}>{room.topic}</h3>
      <div className={styles.speakers}>
        <div className={styles.avatars}>
            {
                room.speakers.map((speaker)=>{
                    return(
                        <img src={speaker.avatar} alt="avatar" />
                    )
                })
            }
        </div>
        <div className={styles.names}>
                    {room.speakers.map((speaker) => (
                        <div key={speaker.id} className={styles.nameWrapper}>
                            <span>{speaker.name}</span>
                            <img
                                src="/images/chat-bubble.png"
                                alt="chat-bubble"
                            />
                        </div>
                    ))}
                </div>
                
      </div>
      <div className={styles.peopleCount}>
                <span>{room.totalPeople}</span>
                <img src="/images/user-icon.png" alt="user-icon" />
            </div>
    </div>
  )
}

export default RoomCard
