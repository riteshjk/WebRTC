import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepAvtar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAvtar } from "../../../store/activeSlice";
import { setAuth } from "../../../store/authSlice";
import { activate } from "../../../http";
import Loader from "../../../components/shared/Loader/Loader";
import toast, { Toaster } from 'react-hot-toast';


const StepAvatar = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.active);
  const [image, setImage] = useState("/images/monkey-avatar.png");
  const [loading, setLoading] = useState(false)

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvtar(reader.result));
    };
  }

  async function submit() {
    if(!name || !avatar){
      toast.error("Please enter all fields");
      return
    }
    setLoading(true)
    try {
      const { data } = await activate({ name, avatar });
      if (data.auth) {
        dispatch(setAuth(data));
        toast.success("Account created successfully");
      }
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }
  return loading ? (<Loader message="Activation In Progress...."/>) : (
    <div className={styles.cardWrapper}>
      <Card title={`Okay, ${name}`} icon="monkey-emoji">
        <p className={styles.subHeading}>How’s this photo?</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImage} src={image} alt="avatar" />
        </div>
        <div>
          <input
            onChange={captureImage}
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a different photo
          </label>
        </div>
        <div>
          <Button onClick={submit} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default StepAvatar;
