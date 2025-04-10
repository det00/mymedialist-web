import { useEffect } from "react";

interface EstadoContenidoProps {
    estado: string
    setEstado: (newEstado: string) => void;
  }
  const EstadoContenido: React.FC<EstadoContenidoProps> = ({ estado, setEstado }) => {
  
    const colorEstado = () => {
    switch (estado) {
      case "T":
        return "bg-success text-white";
      case "E":
        return "bg-info";
      case "P":
        return "bg-warning";
      case "A":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  useEffect(()=>{
    console.log("ESTADOCOMPONENTE", estado);
    
  },[estado])


  return (
    <div className="btn-group dropstart" role="group">
      <button
        type="button"
        className="btn border-0 p-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className={`btn rounded-5 ${colorEstado()}`}>
          {estado ? "" : <i className="bi bi-bookmark" />}
        </span>
      </button>
      <ul className="dropdown-menu rounded-4 p-2 bg-search shadow-lg border-0">
        <li>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-success"
            onClick={(e) => {
              e.preventDefault();
              setEstado("T");
            }}
          >
            Terminado
          </div>
        </li>
        <li>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-info"
            onClick={(e) => {
              e.preventDefault();
              setEstado("E");
            }}
          >
            En progreso
          </div>
        </li>
        <li>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-danger"
            onClick={(e) => {
              e.preventDefault();
              setEstado("A");
            }}
          >
            Abandonado
          </div>
        </li>
        <li>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="dropdown-item text-bg-pink rounded-4 mb-1 cursor-pointer bg-warning"
            onClick={(e) => {
              e.preventDefault();
              setEstado("P");
            }}
          >
            Pendiente
          </div>
        </li>
      </ul>
    </div>
  );
};
export default EstadoContenido;
