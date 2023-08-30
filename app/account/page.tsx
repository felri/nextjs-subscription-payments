import { Card } from './Card';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import MediaUpload from './MediaUpload';
import SectionAddress from './SectionAddress';
import {
  getSession,
  getUserDetails,
  getSubscription,
  getSeller,
  getMedia,
  getAllStates
} from '@/app/supabase-server';
import { MaskedInput } from '@/components/inputs';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Account() {
  const [session, userDetails, subscription, seller, media, states] =
    await Promise.all([
      getSession(),
      getUserDetails(),
      getSubscription(),
      getSeller(),
      getMedia(),
      getAllStates()
    ]);
  const user = session?.user;
  const sellerState = states.find(
    (state) => state.state_id === seller?.state_id
  );

  if (!session) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;

    if (!newName || newName.length > 64 || newName.length < 2) {
      return;
    }

    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id ?? '');
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updatePhone = async (formData: FormData) => {
    'use server';
    const newPhone = formData.get('phone') as string;
    const numberPhone = newPhone.replace(/\D/g, '');
    if (!numberPhone || numberPhone.length > 11 || numberPhone.length < 11) {
      return;
    }

    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;

    const { error } = await supabase
      .from('sellers')
      .update({ phone: numberPhone })
      .eq('user_id', user?.id ?? '');
    if (error) {
      console.log(error);
    }

    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateShortDescription = async (formData: FormData) => {
    'use server';

    const newShortDescription = formData.get('short-description') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from('sellers')
      .update({ short_description: newShortDescription })
      .eq('user_id', user?.id ?? '');
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateDescription = async (formData: FormData) => {
    'use server';

    const newDescription = formData.get('description') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;

    const { error } = await supabase
      .from('sellers')
      .update({ description: newDescription })
      .eq('user_id', user?.id ?? '');
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Sua conta
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Atualize suas informações de conta, adicione fotos e videos, e
            gerencie suas assinaturas.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Seu Plano"
          description={
            subscription
              ? `Você está atualmente no plano ${subscription?.prices?.products?.name}.`
              : 'Você não está atualmente inscrito em nenhum plano.'
          }
          footer={<ManageSubscriptionButton session={session} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/pricing">Escolha seu plano</Link>
            )}
          </div>
        </Card>
        <Card
          title="Seu Nome"
          description="O nome que você deseja usar no seu perfil."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">64 caracteres ou menos.</p>
              <Button variant="slim" type="submit" form="nameForm">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Atualizar Nome
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <input
                type="text"
                name="name"
                className="w-full p-3 rounded-md bg-zinc-800"
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Seu nome"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Seu Whatsapp"
          description="O Whatsapp que você deseja usar no seu perfil."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Você pode alterar seu Whatsapp a qualquer momento.
              </p>
              <Button variant="slim" type="submit" form="phoneForm">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Atualizar Whatsapp
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="phoneForm" action={updatePhone}>
              <MaskedInput
                value={seller?.phone ?? ''}
                className="w-full p-3 rounded-md bg-zinc-800"
                mask="(99) 99999-9999"
                placeholder="Seu Whatsapp"
                name="phone"
                type="tel"
              />
            </form>
          </div>
        </Card>
        <Card
          title="Descrição curta"
          description="Uma descrição curta que aparece embaixo do seu nome."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Exemplo: "Simpatia, educação e profissionalismo."
              </p>
              <Button variant="slim" type="submit" form="shortDescriptionForm">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Atualizar Descrição
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="shortDescriptionForm" action={updateShortDescription}>
              <input
                name="short-description"
                className="w-full p-3 rounded-md bg-zinc-800"
                defaultValue={seller?.short_description ?? ''}
                placeholder="Sua descrição curta"
                max={256}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Descrição"
          description="Descrição completa do seu perfil."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Adicione uma descrição completa do seu perfil.
              </p>
              <Button variant="slim" type="submit" form="descriptionForm">
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Atualizar Descrição
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="descriptionForm" action={updateDescription}>
              <textarea
                name="description"
                className="w-full p-3 rounded-md bg-zinc-800"
                defaultValue={seller?.description ?? ''}
                placeholder="Recém chegada na cidade, atendo em local próprio,
                discreto e aconchegante. Sou uma acompanhante de luxo, estilo
                namoradinha, carinhosa e muito safada. Adoro beijar na boca e
                fazer um oral bem molhadinho. Venha me conhecer, você não vai
                se arrepender..."
                rows={16}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Sua galeria"
          description="Adicione fotos e videos."
          footer={<MediaUpload images={media} userId={user?.id ?? ''} />}
        >
          <div />
        </Card>
        {seller && <SectionAddress states={states} seller={seller} />}
        <Card
          title="Seu Email"
          description="Por favor, use um email que você verifique regularmente."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Nós enviaremos um email para verificar a mudança.
              </p>
              <Button
                variant="slim"
                type="submit"
                form="emailForm"
                disabled={true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Atualizar Email
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <input
                type="text"
                name="email"
                className="w-full p-3 rounded-md bg-zinc-800"
                defaultValue={user ? user.email : ''}
                placeholder="Seu email"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
}
