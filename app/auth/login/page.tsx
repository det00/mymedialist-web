"use client"

import Container from "@/components/Containter";
import Link from "next/link";
import { useState } from "react";
import api from "@/app/lib/axios";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter()
    const [loginData, setLoginData] = useState({})
    const handleLogin = async () => {
        const res = await api.post("/auth/login", loginData)
        console.log("RES", res.data.token);
        console.log(res);
        
        if (res.data.token !== ""){
            console.log("dentro if");
            router.push("/home")
        }
    }

    return (
        <Container>
            <div className="card p-4 shadow mx-auto page-content" style={{ maxWidth: "400px" }}>
                <h1 className="card-title text-center mb-4">Login</h1>
                <form>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={(e) => setLoginData((prev) => ({
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
                            onChange={(e) => setLoginData((prev) => ({
                                ...prev,
                                password: e.target.value
                            }))}
                        />
                    </div>
                    <div className="main-button d-flex justify-content-center">
                        <div className="ahref" onClick={handleLogin}>Acceder</div>
                    </div>
                </form>
                <p className="text-center mt-3">
                    ¿No tienes cuenta?
                    <Link href={"/auth/register"}><span className="text-tertiary"> Regístrate</span></Link>
                </p>
            </div>
        </Container>
    );
}