"use client";
import { useState } from "react";
import api from "@/app/lib/axios";
import { useRouter } from "next/navigation";

interface RegisterData {
  name?: string;
  email?: string;
  password?: string;
}

export default function Login() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState<RegisterData>({});

  const handleRegister = async (): Promise<void> => {
    const res = await api.post("/auth/register", registerData);
    if (res.data.message === "") {
      router.push("/auth/login");
    }
  };

  return (
    <div className="row vh-100 justify-content-center align-items-center">
      <div className="col-8 col-sm-5 col-md-5 col-lg-4 col-xl-3 bg-content rounded-4 p-4">
        <h1 className="card-title text-center mb-4">Registro</h1>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRegisterData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRegisterData((prev) => ({
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRegisterData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>
        <div className="main-button d-flex justify-content-center">
          <div className="ahref" onClick={handleRegister}>
            Confirmar
          </div>
        </div>
      </div>
    </div>
  );
}
