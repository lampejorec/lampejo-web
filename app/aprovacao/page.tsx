import ApprovalClient from "./ApprovalClient";

// ESSA FUNÇÃO GERA AS PÁGINAS HTML NO BUILD (SERVER SIDE)
export async function generateStaticParams() {
  return [
    { cliente: "nicbr" },
    { cliente: "estadao" }
  ];
}

// ESTA É A PÁGINA QUE CHAMA O COMPONENTE CLIENTE
export default function Page({ params }: { params: { cliente: string } }) {
  return <ApprovalClient cliente={params.cliente} />;
}