'use strict';
const TRIAGE = (() => {
  const icons = {
    card:'<rect x="3" y="5" width="26" height="21" rx="3"/><circle cx="11" cy="13" r="3"/><path d="M6 22c0-5 10-5 10 0m4-11h5m-5 5h5m-5 5h3"/>',
    test:'<path d="M11 5h11v20a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3V5ZM15 1h3v4M22 8h6v5h-6M15 11h3m-4 7h5m-5 4h5"/>',
    shield:'<path d="M16 2 28 7v8c0 8-12 14-12 14S4 23 4 15V7L16 2Z"/><path d="M11 15h10m-5-5v10"/>',
    document:'<path d="M7 2h13l6 6v22H7V2Zm13 0v7h6M12 14h9m-9 5h9m-9 5h6"/>',
    search:'<circle cx="13" cy="13" r="9"/><path d="m20 20 9 9M8 10h10m-10 5h7"/>',
    scales:'<path d="M16 2v26M6 8h20M9 8 3 19h12L9 8Zm14 0-6 11h12L23 8ZM9 29h14"/>',
    courthouse:'<path d="m2 10 14-8 14 8H2ZM5 14v11m7-11v11m8-11v11m7-11v11M2 29h28"/>',
    clock:'<circle cx="16" cy="16" r="13"/><path d="M16 7v10l7 4"/>'
  };
  const topics = {
    ppd:{area:'transito',label:'PPD',description:'Infrações durante a habilitação provisória.',icon:'card',docs:['PPD, com as datas de emissão e validade legíveis.','Histórico de infrações e pontuação do Detran, com a situação de cada registro.','Se houver, comunicação sobre a emissão da CNH definitiva ou eventual impedimento.'],note:'A análise da PPD exige atenção às datas, à natureza da infração, à responsabilidade e à situação administrativa. Um registro isolado não permite concluir o efeito sobre a habilitação.',action:'Conferir se o fato ocorreu durante a validade da PPD e quais registros e decisões fundamentam eventual impedimento.'},
    seca:{area:'transito',label:'Lei Seca',description:'Autuação por álcool ou recusa ao teste.',icon:'test',docs:['Comprovante do teste e dados do equipamento, se o teste foi realizado e o documento estiver disponível.','Termo de constatação, boletim de ocorrência e outros registros da abordagem, se existirem.','Notificações de eventual processo de suspensão, além das referentes à multa.'],note:'Autuação por álcool e autuação por recusa têm enquadramentos próprios. Multa e suspensão precisam ser examinadas com os respectivos documentos e prazos.',action:'Conferir o enquadramento registrado no auto e verificar separadamente as notificações e o andamento da multa e da suspensão.'},
    cnh:{area:'transito',label:'Suspensão ou cassação',description:'Processo, restrição ou decisão sobre a CNH.',icon:'shield',docs:['Notificação de abertura e cópia integral do processo de suspensão ou cassação.','Histórico de pontuação e documentos das infrações que fundamentam o processo.','Consulta atual da situação da CNH e decisões sobre restrições ou cumprimento da penalidade.'],note:'Suspensão e cassação são situações distintas. O fundamento, as notificações e a fase do processo precisam ser conferidos. Esta triagem não autoriza dirigir.',action:'Identificar se o procedimento é de suspensão ou cassação e conferir as infrações, datas e decisões utilizadas como fundamento.'},
    outra:{area:'transito',label:'Outra autuação',description:'Velocidade, celular, sinalização e demais casos.',icon:'document',docs:['CRLV do veículo e documentos de locação ou comunicação de venda, se relacionados ao fato.','Fotos, vídeos, comprovantes ou outros registros legítimos do ocorrido, se disponíveis.'],note:'A análise começa pelo auto de infração, pelo órgão responsável e pela fase atual. A existência de documentos ou de uma alegação não assegura o cancelamento da autuação.',action:'Verificar local, data, enquadramento e responsabilidade atribuída, comparando o registro com os documentos disponíveis.'},
    investigacao:{area:'penal',label:'Investigação ou intimação',description:'Inquérito, boletim de ocorrência ou convocação.',icon:'search',docs:['Intimação completa, com a unidade responsável, a data e a finalidade do comparecimento.','Boletim de ocorrência e número do inquérito ou procedimento, se conhecidos.','Registros relacionados aos fatos, preservados em seu formato original.'],note:'Identificar a condição em que a pessoa será ouvida e o objeto do procedimento permite organizar o atendimento. Não ignore uma convocação nem altere registros.',action:'Verificar a finalidade da intimação, a condição da pessoa convocada e a possibilidade de acompanhamento e acesso aos elementos disponíveis.'},
    prisao:{area:'penal',label:'Prisão e custódia',description:'Prisão em flagrante, preventiva ou audiência de custódia.',icon:'shield',docs:['Nome completo da pessoa presa e informação da delegacia, fórum ou unidade de custódia.','Número do procedimento, auto de prisão e decisões já disponíveis.','Comprovantes atuais de residência e trabalho e informações familiares relevantes, se disponíveis.'],note:'Se há pessoa presa ou ato prestes a ocorrer, procure assistência jurídica prontamente, inclusive a Defensoria Pública se necessário. Não espere reunir todos os documentos. Não há atendimento de plantão garantido por esta página.',action:'Confirmar onde a pessoa está custodiada, os atos já realizados e a assistência jurídica disponível, para que o profissional avalie as medidas cabíveis.'},
    processo:{area:'penal',label:'Processo criminal',description:'Citação, defesa, audiência ou decisão.',icon:'courthouse',docs:['Citação ou intimação completa e número do processo.','Denúncia ou queixa, decisões e peças processuais já disponíveis.','Informações sobre audiências e dados de contato de possíveis testemunhas, para análise reservada.'],note:'O conteúdo da acusação, a forma da intimação e a fase processual orientam a atuação. Esta organização inicial não substitui a leitura dos autos pelo defensor.',action:'Examinar a acusação e os atos já praticados, identificando o próximo ato processual e a necessidade de preparação da defesa.'},
    recurso:{area:'penal',label:'Recursos e execução penal',description:'Sentença, acórdão ou cumprimento da pena.',icon:'scales',docs:['Sentença, acórdão ou decisão a ser examinada, com o registro da intimação.','Recursos, petições e decisões anteriores, se existentes.','Na execução, guia, cálculo de pena e relatório da situação processual, se disponíveis.'],note:'Recursos e medidas na execução dependem da decisão, da intimação e do histórico processual. Nenhuma via ou benefício pode ser confirmado apenas por esta triagem.',action:'Conferir a decisão e sua intimação; na execução, examinar também a guia, o cálculo e os registros do cumprimento da pena.'}
  };
  const trafficStages = [
    {id:'autuacao',label:'Recebi uma notificação de autuação',desc:'Ainda é a etapa inicial da autuação.'},
    {id:'penalidade',label:'Recebi uma notificação de penalidade',desc:'O documento comunica a aplicação da multa.'},
    {id:'recurso',label:'Já apresentei defesa ou recurso',desc:'Estou aguardando ou já recebi uma resposta.'},
    {id:'prazo',label:'O prazo indicado já passou',desc:'Não apresentei a defesa ou o recurso no prazo.'},
    {id:'restricao',label:'Há bloqueio ou impedimento na habilitação',desc:'Existe restrição ou dificuldade para emitir a CNH.'},
    {id:'incerto',label:'Não sei em que fase está',desc:'Vi no aplicativo ou não entendi o documento.'}
  ];
  const criminalStages = [
    {id:'intimacao',label:'Recebi uma intimação ou citação',desc:'Há um documento ou uma data de comparecimento.'},
    {id:'andamento',label:'O procedimento está em andamento',desc:'Ainda não tenho uma decisão final.'},
    {id:'decisao',label:'Recebi uma decisão ou sentença',desc:'Quero compreender a decisão e as possibilidades.'},
    {id:'prazo',label:'Uma data ou prazo já passou',desc:'Preciso verificar o que aconteceu no procedimento.'},
    {id:'incerto',label:'Não sei em que fase está',desc:'Preciso identificar a situação atual.'}
  ];
  function stagesFor(topicId){
    const topic=topics[topicId];
    if(!topic)return [];
    if(topic.area==='penal')return topicId==='prisao' ? [{id:'custodia',label:'Há uma pessoa presa neste momento',desc:'Preciso organizar informações para assistência jurídica.'},...criminalStages.filter(s=>s.id!=='intimacao')] : criminalStages;
    return trafficStages.map(s=>{
      if(topicId==='cnh'&&s.id==='autuacao')return {...s,label:'Recebi a abertura do processo',desc:'A notificação informa suspensão ou cassação.'};
      if(topicId==='cnh'&&s.id==='penalidade')return {...s,label:'Recebi a decisão de suspensão ou cassação',desc:'O documento comunica a penalidade aplicada.'};
      return {...s};
    });
  }
  function getResult(topicId,stageId){
    const topic=topics[topicId],stage=stagesFor(topicId).find(s=>s.id===stageId);
    if(!topic||!stage)throw new Error('Selecione assunto e fase válidos.');
    const traffic=topic.area==='transito';
    const base=traffic?[topicId==='ppd'?'Documento de identificação legível.':'CNH ou documento de identificação legível.','Notificações completas, frente e verso, inclusive os prazos, o número do auto e o órgão responsável.','Auto de Infração de Trânsito (AIT), se disponível; caso não tenha, solicite a cópia ao órgão.','Envelopes, registros de recebimento e avisos eletrônicos, se disponíveis.']:['Documento de identificação da pessoa envolvida, para eventual atendimento reservado.','Documentos completos do procedimento, com número, unidade responsável e datas dos atos.'];
    const extra=[];
    let steps=[];
    if(traffic){
      if(stageId==='autuacao')steps=['Conferir o órgão competente e a data limite de defesa indicada na notificação. No processo de suspensão ou cassação, verificar o prazo próprio.',topic.action,'Avaliar a defesa da autuação ou do processo, conforme o documento recebido. Qualquer protocolo exige os documentos e o canal do órgão responsável.'];
      if(stageId==='penalidade'){extra.push('Decisão ou notificação que aplicou a penalidade, com o prazo e o canal para recurso.');steps=['Identificar qual penalidade foi aplicada e a data limite de recurso indicada no documento.',topic.action,'Avaliar recurso à JARI quando cabível. Se o documento já for uma decisão de recurso, verificar a instância adequada e o prazo correspondente.'];}
      if(stageId==='recurso'){extra.push('Cópia da defesa ou recurso apresentado, protocolos e decisões, com os registros de ciência.');steps=['Consultar no portal oficial se há decisão e obter seu inteiro teor.',topic.action,'Se estiver pendente, acompanhar o andamento. Se houve julgamento, avaliar eventual recurso cabível, a instância e o prazo próprios.'];}
      if(stageId==='prazo')steps=['Obter o histórico completo e conferir os registros de expedição, disponibilização e ciência das notificações.',topic.action,'Avaliar se existe outra etapa administrativa aberta ou alguma medida juridicamente cabível. A passagem do prazo não gera reabertura automática.'];
      if(stageId==='restricao'){extra.push('Consulta oficial da restrição, comunicação de bloqueio ou impedimento e decisões correspondentes.');steps=['Confirmar a situação oficial no Detran e identificar o motivo exato da restrição.',topic.action,'Avaliar as providências administrativas ou judiciais adequadas aos documentos e à fase. Não dirija sem esclarecer eventual restrição vigente.'];}
      if(stageId==='incerto')steps=['Consultar o portal oficial do órgão indicado na notificação ou, para a habilitação, o Detran.',topic.action,'Obter a cópia integral, localizar o prazo vigente e só então avaliar a via de defesa ou recurso adequada.'];
    }else{
      if(stageId==='intimacao'){extra.push('Comprovante da intimação ou citação e informação da data de comparecimento ou ciência.');steps=['Conferir a autenticidade, a finalidade e a data do documento no canal oficial da unidade responsável.',topic.action,'Consultar um defensor sobre preparação, acompanhamento e eventual prazo. Não ignore o ato indicado.'];}
      if(stageId==='andamento')steps=['Obter o número e consultar a situação do procedimento no órgão ou tribunal competente.',topic.action,'Organizar os documentos para o defensor identificar os atos pendentes e avaliar as providências adequadas.'];
      if(stageId==='decisao'){extra.push('Decisão completa e comprovante da intimação, incluindo a data de ciência.');steps=['Reunir a íntegra da decisão e o registro da intimação. Prazos precisam de conferência profissional.',topic.action,'Avaliar com um defensor a via cabível e seus requisitos. A triagem não confirma prazo, benefício ou chance de reforma.'];}
      if(stageId==='prazo')steps=['Obter a íntegra do procedimento e identificar o ato ou prazo que passou, com seu registro de ciência.',topic.action,'Consultar um defensor para examinar os efeitos do ocorrido e as medidas ainda cabíveis. Não há reabertura automática.'];
      if(stageId==='incerto')steps=['Localizar o número, a unidade responsável e o último documento recebido.',topic.action,'Buscar uma análise reservada para compreender a fase e os atos pendentes, sem divulgar detalhes do caso em canais públicos.'];
      if(stageId==='custodia')steps=['Buscar assistência jurídica prontamente; se necessário, procurar a Defensoria Pública. Não espere completar o checklist.',topic.action,'Informar ao profissional os dados e documentos disponíveis, inclusive informações relevantes de saúde, sem divulgar detalhes publicamente.'];
    }
    return {topic,stage,docs:[...base,...topic.docs,...extra],steps,note:topic.note,area:traffic?'Direito de Trânsito':'Direito Penal'};
  }
  return {topics,icons,stagesFor,getResult};
})();
