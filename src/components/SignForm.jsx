import { useEffect, useState } from "react";
import style from "../styles/Signup.module.css";

export default function SignForm({ title, btnTestId }) {
  const [btnStatus, setBtnStatus] = useState(true);
  const [emailVali, setEmailVali] = useState(false);
  const [passwordVali, setPasswordVali] = useState(false);

  const validation = (e) => {
    if (e.target.id === "email") {
      if (e.target.value.includes("@")) setEmailVali(true);
      else setEmailVali(false);
    }
    if (e.target.id === "password") {
      if (e.target.value.length >= 8) setPasswordVali(true);
      else setPasswordVali(false);
    }
  };

  useEffect(() => {
    if (emailVali && passwordVali) setBtnStatus(false);
    else setBtnStatus(true);
  }, [emailVali, passwordVali]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === "SignUp") {
      console.log("test");
    }
  };

  return (
    <div className={style.container} onSubmit={handleSubmit}>
      <span>{title}</span>
      <form className={style.sign_form}>
        <label htmlFor="email">이메일</label>
        <input id="email" data-testid="email-input" onChange={validation} />
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          data-testid="password-input"
          onChange={validation}
        />
        <button data-testid={btnTestId} disabled={btnStatus}>
          제출
        </button>
      </form>
    </div>
  );
}
