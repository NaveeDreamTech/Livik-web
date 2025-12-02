// lib/firebaseRecaptcha.js
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "./firebaseClient";

let recaptchaVerifier;

export const getRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  }
  return recaptchaVerifier;
};
