'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AuthState {
  error?: string
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Correo o contraseña incorrectos' }
  }

  revalidatePath('/', 'layout')
  redirect('/catalog')
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      // En producción habilitar confirmación de email en Supabase Dashboard
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Ya existe una cuenta con ese correo' }
    }
    return { error: 'Error al crear la cuenta. Intenta de nuevo' }
  }

  revalidatePath('/', 'layout')
  redirect('/catalog')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginWithGoogle(): Promise<AuthState> {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://stampia.shop'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: appUrl + '/auth/callback' },
  })
  if (error) return { error: 'Error al conectar con Google' }
  if (data.url) redirect(data.url)
  return {}
}

export async function resetPassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://stampia.shop'
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: appUrl + '/auth/reset-password',
  })
  if (error) return { error: 'No se pudo enviar el correo. Verifica el email.' }
  return {}
}
