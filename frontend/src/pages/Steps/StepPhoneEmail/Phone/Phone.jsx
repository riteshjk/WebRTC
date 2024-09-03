import React, { useEffect, useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css';
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';
import toast, { Toaster } from 'react-hot-toast';

//Steps need to follow
// 1. in authSlice we store the initail stage of the otp so when user enter mobile numeber so it will dispatch an action sendotp will get phoen
// ,hash and otp in response we already store this in global state now its time to verify it
const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();

  async function submit() {
    if (!phoneNumber){
      toast.error('Please enter phone number');
      return;
    }
    try {
      const { data } = await sendOtp({ phone: phoneNumber });
      dispatch(setOtp({ phone: data.phone, hash: data.hash }));
      toast.success('OTP sent successfully.');
      onNext();
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  }


  return (
    <div>
      <Card title="Enter Your Phone Number!" icon="phone">
        <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <div>
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={submit} />
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Phone;