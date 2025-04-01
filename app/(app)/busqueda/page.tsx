"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Buscar } from "@/app/types";
import moment from "moment";
import "moment/locale/es";
import ItemSearchScreen from "@/components/ItemSearchScreen";

export default function Busqueda() {
  const searchParams = useSearchParams();
  const [resultados, setResultados] = useState<Buscar[]>([]);
  moment.locale("es");

  useEffect(() => {
    const search = async () => {
      const token = localStorage.getItem("token");
      const busqueda = searchParams.get("busqueda");
      const tipo = searchParams.get("tipo");
      const res = await api.get("/buscar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          busqueda: busqueda,
          tipo: tipo,
        },
      });
      setResultados(res.data);
    };
    search();
  }, [searchParams]);

  return (
    <div className="row gap-4">
      <div className="heading-section">
        <h4>
          <em>R</em>esultados
        </h4>
      </div>
      {resultados.map((item) => {
        return <ItemSearchScreen key={item.id_api} item={item} />;
      })}
    </div>
  );
}
