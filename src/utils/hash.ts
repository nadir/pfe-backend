import argon2 from "argon2";

argon2.hash("password").then((hash) => {
  console.log(hash);
});
