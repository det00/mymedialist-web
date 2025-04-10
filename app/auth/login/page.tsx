"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/app/lib/axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({});
  const handleLogin = async () => {
    const res = await api.post("/auth/login", loginData);
    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      router.push("/home");
      console.log("RES", res);
      
    }
  };

  return (
    <div className="row vh-100 justify-content-center align-items-center">
      <div className="col-8 col-sm-5 col-md-5 col-lg-4 col-xl-3 bg-content rounded-4 p-4">
        <h1 className="card-title text-center mb-4">Login</h1>
        <form>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
/*               onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("Se presionó Enter");
                }
              }} */
              onChange={(e) =>
                setLoginData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              onChange={(e) =>
                setLoginData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <div className="main-button d-flex justify-content-center">
            <div className="ahref" onClick={handleLogin}>
              Acceder
            </div>
          </div>
        </form>
        <p className="text-center mt-3">
          ¿No tienes cuenta?
          <Link href={"/auth/register"}>
            <span className="text-tertiary"> Regístrate</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
