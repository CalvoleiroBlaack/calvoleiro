"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";
import { authenticateUser, createUser } from "@/services";

export type AuthState = { error?: string; success?: string } | null;

export async function loginAction(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const user = await authenticateUser(email, password);
    await createSession({ userId: user.id, email: user.email });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro desconhecido" };
  }
  redirect("/app");
}

export async function registerAction(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password !== confirm) {
    return { error: "As senhas não coincidem" };
  }

  try {
    const { id } = await createUser({ name, email, password });
    await createSession({ userId: id, email: email.toLowerCase() });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao cadastrar" };
  }
  redirect("/app");
}

export async function forgotPasswordAction(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Informe seu email" };
  return {
    success: `Se ${email} estiver cadastrado, enviaremos instruções de recuperação.`,
  };
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
