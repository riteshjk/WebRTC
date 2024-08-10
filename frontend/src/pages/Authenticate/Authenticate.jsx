import React, { useState } from 'react'
// import styles from "./Login.module.css";
import SetPhoneEmail from "../Steps/StepPhoneEmail/StepPhoneEmail";
import StepOtp from "../Steps/StepOtp/StepOtp";
import Card from '../../components/shared/Card/Card';

const steps = {
    1: SetPhoneEmail,
    2: StepOtp
}
const Authenticate = () => {
    const [step,setStep] = useState(1)
    const Step = steps[step];
    const onNext = () =>{
        setStep(step+1)
    }
    const submit =() =>{
      setStep(step+1)
    }
  return (
    <div>
   
      <Step onNext={onNext} submit={submit}/>
  
  </div>
  )
}




export default Authenticate
