"use strict";
const regForm = document.getElementById("reg-form");
const loginForm = document.getElementById("login-form");

const registerUser = async (event) => {
  event.preventDefault();
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  const result = await fetch("http://localhost:5050/auth/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());

  // if (result.errors) {
  //   for (let i = 0; i < result.errors.length; i++) {
  //     const element = result.errors[i];
  //     console.log(element);
  //   }
  // }
  console.log(result);
};
regForm.addEventListener("submit", registerUser);

const loginUser = async (event) => {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const result = await fetch("http://localhost:5050/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());

  localStorage.setItem("token", result.token);

  console.log(result);
  // console.log("Got the token", result.data);
};
loginForm.addEventListener("submit", loginUser);
