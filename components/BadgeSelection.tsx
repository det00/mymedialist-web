interface BadgeSelectionProps {
  tipo: string;
  nombre: string
  onClick: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const BadgeSelection: React.FC<BadgeSelectionProps> = ({ tipo, nombre, onClick}) => {
  return (
    <span
      className={`badge rounded-pill fw-normal ${tipo === "P" ? "text-bg-pink" : "btn btn-secondary"}`} onClick={onClick}
    >
      {nombre}
    </span>
  );
};
export default BadgeSelection;
