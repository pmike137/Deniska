"use strict";
const regForm = document.getElementById("reg-form");
const loginForm = document.getElementById("login-form");
const getUsersBtn = document.getElementById("getUsersBtn");

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

// Получение списка пользователей по нажатию на кнопку

const getUsersList = async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  const result = await fetch("http://localhost:5050/auth/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  console.log(result);
  if (result.ok) {
    window.location.href = "admin.html";
  }

  // console.log(result.ok ? "ok" : "not ok");
};

getUsersBtn.addEventListener("click", getUsersList);
