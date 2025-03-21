"use client"
import Container from "@/components/Containter";
import { useState } from "react";
import api from "@/app/lib/axios";


export default function Login() {
    const [registerData, setRegisterData] = useState({})
    const handleRegister = async () => {
        const res = await api.post("/auth/register", registerData)
        console.log("RES", res);
    }



    return (
        <Container>
            <div className="card p-4 shadow mx-auto page-content" style={{ maxWidth: "400px" }}>
                <h1 className="card-title text-center mb-4">Registro</h1>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        onChange={(e) => setRegisterData((prev) => ({
                            ...prev,
                            name: e.target.value
                        }))}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={(e) => setRegisterData((prev) => ({
                            ...prev,
                            email: e.target.value
                        }))}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        onChange={(e) => setRegisterData((prev) => ({
                            ...prev,
                            password: e.target.value
                        }))}
                    />
                </div>
                <div className="main-button d-flex justify-content-center">
                    <div className="ahref" onClick={handleRegister}>Confirmar</div>
                </div>
            </div>
        </Container>
    );
}