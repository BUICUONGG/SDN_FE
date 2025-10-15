import React, { useState } from "react";
import "./login.css";
import UserLogin from "../../Components/UserCom/UserLogin";

export default function LoginPageTest() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <div className="bg-login"></div>
      <div className="over-login">
        <div
          style={{ width: isLoggedIn ? "100%" : "60%", transition: "1s" }}
          className="content"
        ></div>
        {!isLoggedIn && (
          <div style={{ width: isLoggedIn ? "0%" : "40%", transition: "1s" }} className="content2">
            <UserLogin onLogin={() => setIsLoggedIn(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
