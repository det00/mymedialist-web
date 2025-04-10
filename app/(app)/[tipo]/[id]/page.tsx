"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/app/lib/axios";
import { useParams } from "next/navigation";
import type { Contenido } from "@/app/types";
import EstadoContenido from "@/components/EstadoContenido";

const ContenidoPage = () => {
  const [token, setToken] = useState<string | null>("");
  const params = useParams();
  const [id, setId] = useState<string | undefined>("");
  const [tipo, setTipo] = useState<string | undefined>("");
  const [contenido, setContenido] = useState<Contenido>();
  const [estado, setEstado] = useState<string>(contenido?.item?.estado || "");

  const fetchContenido = useCallback(async () => {
    if (!token || !id || !tipo) {
      console.log("Faltan token, id o tipo para hacer la solicitud");
      return;
    }

    try {
      const res = await api.get<Contenido>(`/${tipo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id_api: id,
        },
      });
      console.log(res.data);
      setContenido(res.data);
      setEstado(res.data.item?.estado || "")
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }, [id, token, tipo]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetchContenido();
  }, [fetchContenido]);

  useEffect(() => {
    if (params?.tipo) {
      setTipo(params.tipo as string);
    }
    if (params?.id) {
      setId(params.id as string);
    }
  }, [params]);

  useEffect(()=>{
    console.log("ESTADO", estado);
    
  },[estado])

  return (
    <>
      {/* <div className="container p-3">
        <div className="row gap-1 justify-content-around">
          <div className="col-8 bg-2 text-white p-4 rounded-4">
            {contenido && (
              <Image
                src={contenido.imagen}
                alt={contenido.titulo || "Contenido image"}
                width={500}
                height={0}
                className="img-fluid rounded-4 shadow"
                style={{ height: "auto", width: "300px" }}
              />
            )}
          </div>

          <div className="col-3 bg-2 text-white p-3 rounded-4">Columna 2</div>
        </div>
      </div> */}
      <div className="container bg-">
        <div className="row">
          <div className="col-9">
            <div className="row mb-3 mr-3 bg-2 rounded-4">
              <div className="row">
                <div className="h3 p-4 text-align-center text-light">
                  {contenido?.titulo}
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 text-light font-italic fst-italic">
                  {contenido?.autor}
                </div>
              </div>
              <div className="d-flex col-6 justify-content-end align-bottom">
                {/* <strong>{contenido?.descripcion}</strong> */}

                <EstadoContenido estado={estado} setEstado={setEstado} />
              </div>
            </div>
            <div className="row">
              <div className="bg-2 rounded-4 h-100 p-3">
                <p
                  dangerouslySetInnerHTML={{
                    __html: `${contenido?.descripcion}`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-3 h-25">
            <div className="rounded-4 h-100 p-3">
              <img
                src={contenido?.imagen}
                alt={contenido?.titulo}
                className="rounded-4 h-auto"
              />
            </div>
            {/* 
            <div className="row bg-black m-3 rounded-2 p-3">amigos</div> */}
            <div className="row px-5">
              {/*<button type="button" className="btn bg-danger bg-opacity-50 rounded-4 text-light align-items-start">
                Amigos <span className="badge bg-3">4</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContenidoPage;
