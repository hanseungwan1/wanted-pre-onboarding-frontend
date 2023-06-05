import { useEffect, useState } from "react";
import style from "../styles/Signup.module.css";
import { json, useNavigate } from "react-router-dom";

export default function SignForm({ title, btnTestId }) {
  const URL = "https://www.pre-onboarding-selection-task.shop/";
  const navigate = useNavigate();

  const [btnStatus, setBtnStatus] = useState(true);
  const [emailVali, setEmailVali] = useState(false);
  const [passwordVali, setPasswordVali] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/todo");
    }
  }, []);

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
    const [emailval, passwordval] = [
      e.target.email.value,
      e.target.password.value,
    ];

    if (title === "SignUp") signupReq(emailval, passwordval);
    else if (title === "SignIn") signinReq(emailval, passwordval);
  };

  const signupReq = (email, password) => {
    fetch(URL + "auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => {
      if (response.status === 201) navigate("/signin");
    });
  };

  const signinReq = (email, password) => {
    fetch(URL + "auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.access_token);
        localStorage.setItem("access_token", json.access_token);
        navigate("/todo");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={style.container} onSubmit={handleSubmit}>
      <span>{title}</span>
      <form className={style.sign_form}>
        <label htmlFor="email">email</label>
        <input id="email" data-testid="email-input" onChange={validation} />
        <label htmlFor="password">password</label>
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
