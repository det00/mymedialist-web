"use client";

import { useState, useEffect } from "react";
import api from "@/app/lib/axios";
import { useParams } from "next/navigation";

const Contenido = () => {
  const [token, setToken] = useState<string | null>("");
  const params = useParams();
  const id = params?.id;
  const tipo = params?.tipo


 /*  const fetchLibro = async () => {
    if (token && id) {
      const res = await api.get("libro", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id_api: id,
        },
      });
      console.log("RES", res);
    }
  }; */

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    console.log("TIPO",tipo);
    console.log("ID",id);
    
  }, []);

/*   useEffect(() => {
    fetchLibro();
  }, [id, token]); */

  return <div></div>;
};

export default Contenido;
