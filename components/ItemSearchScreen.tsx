import Image from "next/image";
import moment from "moment";
import "moment/locale/es";
import { Buscar } from "@/app/types";
import { useEffect, useState } from "react";
import Link from "next/link";

moment.locale("es");

interface ItemSearchScreenProps {
  item: Buscar;
}

const ItemSearchScreen: React.FC<ItemSearchScreenProps> = ({ item }) => {
  const [estado, setEstado] = useState<string>("");
  const [rutaTipo, setRutaTipo] = useState<string>("")

  const colorEstado = () => {
    switch (estado) {
      case "Terminado":
        return "bg-success text-white";
      case "En progreso":
        return "bg-info";
      case "Pendiente":
        return "bg-warning";
      case "Borrado":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  useEffect(()=>{
    switch(item.tipo){
      case "V":{
        setRutaTipo("videojuego")
        break
      }
      case "P":{
        setRutaTipo("penicula")
        break
      }
      case "L":{
        setRutaTipo("libro")
        break
      }
      case "S":{
        setRutaTipo("serie")
        break
      }
    }
  },[item.tipo])

  return (
    <>
      <Link href={`/${rutaTipo}/${item.id_api}`} className="col-sm-3 col-4 col-lg-4 bg-2 d-flex flex-column p-2 flex-lg-row rounded-4 shadow-lg flex-grow-1">
     
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
                <small className="text-muted d-none d-md-block">3 Amigos</small>
                <div className="col-12 d-flex justify-content-end">
                  <div className="btn-group dropstart" role="group">
                    <button
                      type="button"
                      className="btn border-0 p-0"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className={`btn rounded-5 ${colorEstado()}`}>
                        {estado ? "" : <i className="bi bi-bookmark"></i>}
                      </span>
                    </button>
                    <ul className="dropdown-menu rounded-4 p-2 bg-search shadow-lg border-0">
                      <li>
                        <div
                          className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-success"
                          onClick={() => setEstado("Terminado")}
                        >
                          Terminado
                        </div>
                      </li>
                      <li>
                        <div
                          className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-info"
                          onClick={() => setEstado("En progreso")}
                        >
                          En progreso
                        </div>
                      </li>
                      <li>
                        <div
                          className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-danger"
                          onClick={() => setEstado("Borrado")}
                        >
                          Borrado
                        </div>
                      </li>
                      <li>
                        <div
                          className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-warning"
                          onClick={() => setEstado("Pendiente")}
                        >
                          Pendiente
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </Link>
    </>
  );
};

export default ItemSearchScreen;
