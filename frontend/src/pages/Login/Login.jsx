import React, { useState } from 'react'
import styles from "./Login.module.css";
import SetPhoneEmail from "../Steps/StepPhoneEmail/StepPhoneEmail";
import StepOtp from "../Steps/StepOtp/StepOtp";
import Card from '../../components/shared/Card/Card';


const steps = {
    1: SetPhoneEmail,
    2: StepOtp
}
const Login = () => {
    const [step,setStep] = useState(1)
    const Step = steps[step];
    const onNext = () =>{
        setStep(step+1)
    }
  return (
    <div className={styles.cardWrapper}>
    <Card title="Register" icon="phone">
      <Step onNext={onNext}/>
    </Card>
  </div>
  )
}

export default Login
