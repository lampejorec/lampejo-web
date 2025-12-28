import ApprovalClient from "./ApprovalClient";

// GERAÇÃO ESTÁTICA (Necessário para o Build do Vercel)
export async function generateStaticParams() {
  return [
    { cliente: "nicbr" },
    { cliente: "estadao" }
  ];
}

// CORREÇÃO: "params" agora é uma Promise (await)
export default async function Page({ params }: { params: Promise<{ cliente: string }> }) {
  const { cliente } = await params; // Espera o parâmetro carregar
  return <ApprovalClient cliente={cliente} />;
}