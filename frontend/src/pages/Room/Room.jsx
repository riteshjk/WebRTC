import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Room.module.css";
import { getRoom } from "../../http";

const Room = () => {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { clients, providerRef } = useWebRTC(roomId, user);
  const [numberOfClients, setNumberOfClients] = useState(clients);
  const [room, setRoom] = useState(null)

  useEffect(() => {
    setNumberOfClients(() => {
      return [...new Set(clients)];
    });
  }, [clients]);

  const handManualLeave = () => {
    navigate("/rooms");
  };

  useEffect(()=>{
    const fetchRoom = async() =>{
      const {data} = await getRoom(roomId)
      setRoom((prev)=>data)
    
    }
    fetchRoom()
  },[roomId])

console.log(room)
  return (
    <div>
      <div className="container">
        <button onClick={handManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
                <h2 className={styles.topic}>{room?.topic}</h2>
                <div className={styles.actions}>
                        <button className={styles.actionBtn}>
                            <img src="/images/palm.png" alt="palm-icon" />
                        </button>
                        <button
                            onClick={handManualLeave}
                            className={styles.actionBtn}
                        >
                            <img src="/images/win.png" alt="win-icon" />
                            <span>Leave quietly</span>
                        </button>
                    </div>
        </div>
        <div className={styles.clientsList}>
        {numberOfClients.map((client) => {
          return (
            <div className={styles.client} key={client.id}>
              <div className={styles.userHead} >
              <audio
                ref={(instance) => providerRef(instance, client.id)}
                
                autoPlay
              ></audio>
              <img className={styles.userAvatar} src={client.avatar} alt="" />
              <button className={styles.micBtn}>
                {/* <img src="/images/mic.png" alt="" /> */}
                <img src="/images/mic-mute.png" alt="" />
              </button>
            </div>
            <h4>{client.name}</h4>
            </div>
            
          );
        })}
        </div>
       
      </div>
    </div>
  );
};

export default Room;
