"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  console.log("1. Tentando logar com:", email); // <--- DEBUG

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("2. ERRO SUPABASE:", error.message); // <--- VAI MOSTRAR O ERRO NO TERMINAL
    return redirect("/login?error=true");
  }

  console.log("3. Sucesso! Redirecionando...");
  revalidatePath("/", "layout");
  redirect("/admin");
}