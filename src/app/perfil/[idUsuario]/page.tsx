import { ProfilePublicView } from "@/components/ProfilePublicView";

export default function PerfilPage({params}: {params: {idUsuario: number}}) {
  console.log("Params recibidos:", params.idUsuario);
  const id = params.idUsuario;

  return (
    <div className="container mx-auto px-4 py-6">
      <ProfilePublicView idUsuario={id} />
    </div>
  );
}