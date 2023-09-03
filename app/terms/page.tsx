import React from 'react';

const terms = [
  'Primabela é apenas uma plataforma que conecta usuários. Não se responsabiliza pelo conteúdo, veracidade das informações ou transações entre usuários.',
  'Os usuários devem ter mais de 18 anos para usar o Primabela. Você deve fornecer informações precisas em seu perfil.',
  'Você é o único responsável por manter sua senha segura e todas as atividades em sua conta. Notificar imediatamente a Primabela sobre qualquer utilização não autorizada.',
  'Os utilizadores não podem utilizar a Primabela para quaisquer fins ilegais, prejudiciais ou impróprios.',
  'A Primabela pode suspender, bloquear ou desativar contas a seu critério, sem aviso prévio.',
  'A Primabela retém todos os direitos de propriedade intelectual da sua plataforma e serviços. Os utilizadores não podem reivindicar quaisquer direitos ou privilégios sobre a propriedade intelectual da Primabela.',
  'Os utilizadores concedem à Primabela permissão para utilizar quaisquer imagens, vídeos ou meios de comunicação carregados no seu perfil.',
  'Os usuários devem seguir a política de nomenclatura da Primabela para nomes de usuário. Não são permitidos nomes ameaçadores, ofensivos ou abusivos.',
  'A Primabela poderá investigar e penalizar os utilizadores que violem estes termos, se comportem de forma inadequada ou ilegal. As penalidades incluem suspensão e banimento.',
  'A Primabela utiliza cookies para melhorar a experiência do utilizador e fornecer serviços personalizados.',
  'A Primabela pode alterar estes termos a qualquer momento, publicando uma versão revista no seu website.',
  'Estes termos são regidos pelas leis do Brasil. A jurisdição exclusiva é dos tribunais de São Paulo.'
];

const keyPoints = [
  'As assinaturas oferecem benefícios de listagem promovida na plataforma da Primabela.',
  'O pagamento é devido antecipadamente pelo período de assinatura escolhido pelo usuário.',
  'As assinaturas são renovadas automaticamente, a menos que o usuário entre em contato com a Primabela para cancelar.',
  'Os usuários podem cancelar a assinatura a qualquer momento, mediante notificação à Primabela.',
  'A Primabela poderá atualizar os preços da assinatura para novos termos. Assinaturas existentes mantidas pelo prazo atual.',
  'A Primabela salvaguarda a privacidade dos dados dos utilizadores. Informações não compartilhadas sem o consentimento do usuário.',
  'Alterações que aumentem os custos dos utilizadores serão comunicadas previamente. O usuário pode concordar, renegociar ou cancelar.',
  'Os tribunais de São Paulo têm jurisdição sobre quaisquer disputas.'
];

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TERMOS E CONDIÇÕES</h1>
      <p>
        Os presentes termos e condições regem a utilização da plataforma e dos
        serviços da Primabela. Ao utilizar o Primabela, você concorda em ficar
        vinculado a estes termos.
      </p>

      <h2 className="text-xl font-semibold mt-4">Pontos chave:</h2>
      <ul className="list-disc pl-5">
        {terms.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mt-6 mb-4">TERMOS DE ASSINATURA</h1>
      <h2 className="text-xl font-semibold mt-4">Pontos chave:</h2>
      <ul className="list-disc pl-5">
        {keyPoints.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default TermsAndConditions;
