import React, { useState } from "react";
import Card from "../../components/shared/Card/Card";
import styles from "./Register.module.css";
import SetPhoneEmail from "../Steps/StepPhoneEmail/StepPhoneEmail";
import StepOtp from "../Steps/StepOtp/StepOtp";
import StepName from "../Steps/StepName/StepName";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";
import StepUsername from "../Steps/StepUsername/StepUsername";

const steps = {
    1: SetPhoneEmail,
    2: StepOtp,
    3: StepName,
    4: StepAvatar,
    5: StepUsername
}

const Register = () => {
    const [step,setStep] = useState(1)
    const Step = steps[step]
   const onNext = () =>{
       setStep(step+1)
   }
  return (
    <div className={styles.cardWrapper}>
      <Card title="Register" icon="phone">
        <Step onNext={onNext}/>
      </Card>
    </div>
  );
};

export default Register;
