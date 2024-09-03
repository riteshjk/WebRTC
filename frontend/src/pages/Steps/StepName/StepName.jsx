import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import styles from "./StepName.module.css";
import { setName } from "../../../store/activeSlice";
import toast, { Toaster } from 'react-hot-toast';

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.active);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(name);

  function nextStep() {
    if (!fullname) {
      toast.error('Please enter your name');
    }
    dispatch(setName(fullname));
    toast.success('Name saved successfully');
    onNext();
  }
  return (
    <div className={styles.cardWrapper}>
      <Card title="What’s your full name?" icon="goggle-emoji">
        <TextInput
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <p className={styles.paragraph}>
          People use real names at codershouse :) !
        </p>
        <div>
          <Button onClick={nextStep} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default StepName;
