'use client';

import { useSupabase } from '@/app/supabase-provider';
import { getURL } from '@/utils/helpers';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthUI() {
  const { supabase } = useSupabase();
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={[]}
        redirectTo={`${getURL()}/auth/callback`}
        // magicLink={true}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Endereço de email',
              password_label: 'Criar uma senha',
              email_input_placeholder: 'Seu endereço de email',
              password_input_placeholder: 'Sua senha',
              button_label: 'Inscrever-se',
              loading_button_label: 'Inscrevendo...',
              social_provider_text: 'Entre com {{provider}}',
              link_text: 'Não tem uma conta? Inscreva-se',
              confirmation_text:
                'Verifique seu email para o link de confirmação'
            },
            sign_in: {
              email_label: 'Endereço de email',
              password_label: 'Sua senha',
              email_input_placeholder: 'Seu endereço de email',
              password_input_placeholder: 'Sua senha',
              button_label: 'Entrar',
              loading_button_label: 'Entrando...',
              social_provider_text: 'Entre com {{provider}}',
              link_text: 'Já tem uma conta? Entre'
            },
            magic_link: {
              email_input_label: 'Endereço de email',
              email_input_placeholder: 'Seu endereço de email',
              button_label: 'Enviar link mágico',
              loading_button_label: 'Enviando link mágico...',
              link_text: 'Enviar um email com link mágico',
              confirmation_text: 'Verifique seu email para o link mágico'
            },
            forgotten_password: {
              email_label: 'Endereço de email',
              password_label: 'Sua senha',
              email_input_placeholder: 'Seu endereço de email',
              button_label: 'Enviar instruções de redefinição de senha',
              loading_button_label: 'Enviando instruções...',
              link_text: 'Esqueceu sua senha?',
              confirmation_text:
                'Verifique seu email para o link de redefinição de senha'
            },
            update_password: {
              password_label: 'Nova senha',
              password_input_placeholder: 'Sua nova senha',
              button_label: 'Atualizar senha',
              loading_button_label: 'Atualizando senha...',
              confirmation_text: 'Sua senha foi atualizada'
            },
            verify_otp: {
              email_input_label: 'Endereço de email',
              email_input_placeholder: 'Seu endereço de email',
              phone_input_label: 'Número de telefone',
              phone_input_placeholder: 'Seu número de telefone',
              token_input_label: 'Token',
              token_input_placeholder: 'Seu token OTP',
              button_label: 'Verificar token',
              loading_button_label: 'Entrando...'
            }
          }
        }}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#52525b'
              }
            }
          }
        }}
        theme="dark"
      />
    </div>
  );
}
