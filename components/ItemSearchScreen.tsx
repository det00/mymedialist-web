import Image from "next/image";
import moment from "moment";
import "moment/locale/es";
import type { Buscar } from "@/app/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import EstadoContenido from "./EstadoContenido";

moment.locale("es");

interface ItemSearchScreenProps {
  item: Buscar;
}

const ItemSearchScreen: React.FC<ItemSearchScreenProps> = ({ item }) => {
  const [rutaTipo, setRutaTipo] = useState<string>("");
  const [estado, setEstado] = useState<string>("");

  useEffect(() => {
    switch (item.tipo) {
      case "V": {
        setRutaTipo("videojuego");
        break;
      }
      case "P": {
        setRutaTipo("pelicula");
        break;
      }
      case "L": {
        setRutaTipo("libro");
        break;
      }
      case "S": {
        setRutaTipo("serie");
        break;
      }
    }
  }, [item.tipo]);

  return (
    <>
      <Link
        href={`/${rutaTipo}/${item.id_api}`}
        className="col-sm-3 col-4 col-lg-4 bg-2 d-flex flex-column p-2 flex-lg-row rounded-4 shadow-lg flex-grow-1"
      >
        <div className="col-xl-3 col-xxl-2 col-12 col-sm-12 col-md-12 col-lg-3">
          <Image
            src={item.imagen}
            alt={item.titulo}
            width={100}
            height={100}
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>

        <div className="col-12 col-md-12 col-sm-12 col-lg-8 d-flex flex-column justify-content-between p-2 align-items-stretch flex-grow-1">
          <div className="text-color-base">
            {item.titulo}
            <p className="text-muted fst-italic">{item.autor}</p>
          </div>
          <div className="row">
            <div className="col">
              <p className="text-muted mb-1 d-none d-md-block">
                {moment(item.fechaLanzamiento).format("L")}
              </p>
              <small className="text-muted d-none d-md-block">
                {item.genero.join(", ")}
              </small>
            </div>
            <div className="col d-flex flex-column align-items-end justify-content-end">
              <small className="text-muted d-none d-md-block">{item.numAmigos ? `${item.numAmigos} Amigos` : ""}</small>
              <div className="col-12 d-flex justify-content-end">
                <EstadoContenido estado={estado} setEstado={setEstado} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ItemSearchScreen;
