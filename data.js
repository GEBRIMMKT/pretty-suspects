/* =====================================================================
   PRETTY SUSPECTS — CASE 001: THE LAST PARTY
   ARQUIVO CENTRAL DE CONTEÚDO DO SITE

   Tudo o que aparece no site (textos, personagens, cartas, evidências,
   linha do tempo, mockups, bastidores, especificações e créditos) está
   aqui. Para mudar o site, edite só este arquivo e recarregue a página.

   COMO INSERIR UMA IMAGEM
   1. Salve o arquivo na pasta indicada (ex.: assets/cartas/).
   2. Escreva o caminho entre aspas no campo "img", "front" ou "back".
      Exemplo:  front: "assets/cartas/card-01-frente.jpg",
   3. Campo vazio ("") = o site mostra um espaço reservado.

   REGRAS
   - Escreva entre aspas. Não apague vírgulas no fim das linhas.
   - Para quebrar linha dentro de um texto, use \n.
   - Campos marcados "A PREENCHER" ficam visíveis só com
     "Pendências" ligado (menu INDEX). No modo apresentação, somem.
   ===================================================================== */

window.PS = {

  /* ------------------------------------------------------------------
     MARCA
     ------------------------------------------------------------------ */
  brand: {
    name: "PRETTY SUSPECTS",
    edition: "THE LAST PARTY",
    caseId: "CASE 001",
    caseNo: "CASE NO. 001",
    date: "OCTOBER 31, 2005",
    dateStamp: "31 10 '05",
    slogan: ["FOUR FRIENDS.", "ONE DEAD.", "THREE SUSPECTS."],
    slogan2: "EVERYONE HAS A SECRET. ONE OF THEM IS DEADLY.",
    phrases: [
      "PRETTY FACES. UGLY SECRETS.", "TRUST NO ONE.", "EVERY GIRL HAS SOMETHING TO HIDE.",
      "THE PARTY ISN'T OVER YET.", "BEAUTY CAN BE DEADLY.", "SOME SECRETS SHOULD STAY BURIED.",
      "NOT EVERY SWEETHEART IS INNOCENT.", "THREE SUSPECTS. FIVE CLUES. ONE TRUTH.",
      "DO YOU KNOW YOUR FRIENDS?", "GOOD GIRLS TELL BAD LIES.", "CONFIDENTIAL.", "CLASSIFIED FILE."
    ],
    // Arquivo oficial do logotipo (PNG com fundo transparente, de preferência).
    // Enquanto estiver vazio, o site mostra o nome composto com a fonte provisória.
    logo: "",
    logoNegative: "",          // versão para fundo preto (opcional)
    logoMoodboard: "assets/logo/logo-no-moodboard.jpg"   // recorte do moodboard do grupo
  },

  /* ------------------------------------------------------------------
     CAP. 02 — CONCEITO
     ------------------------------------------------------------------ */
  concept: {
    title: ["PRETTY FACES.", "UGLY SECRETS."],
    text: [
      "Pretty Suspects nasce do encontro entre a estética feminina dos anos 2000 e o universo dos jogos de investigação.",
      "Em uma narrativa marcada por glamour, amizade, rivalidade e segredos, o jogador é convidado a questionar aparências e descobrir o que existe por trás da imagem aparentemente perfeita de quatro amigas.",
      "A proposta transforma a tipografia em parte da experiência narrativa, utilizando contrastes visuais, diferentes vozes gráficas e composições editoriais para construir uma atmosfera de mistério."
    ],
    question: "Até que ponto você realmente conhece suas amigas?",
    // Itens do conceito (texto-base montado a partir do briefing — revisar com o grupo)
    pillars: [
      { k: "Conceito", t: "Um jogo de investigação criminal com identidade feminina, fashionista e nostálgica: glamour, amizade, rivalidade e segredos." },
      { k: "Propósito", t: "Fazer o jogador questionar aparências. Todas as personagens escondem algo, inclusive as inocentes." },
      { k: "Modalidade", t: "Nova modalidade: dedução coletiva com cinco cartas. A turma analisa pistas, compara álibis e vota. A quinta carta só é aberta no fim." },
      { k: "Universo narrativo", t: "Uma marca de jogos com edições. A primeira, Case 001 — The Last Party: quatro amigas, uma vítima, três suspeitas e uma assassina." },
      { k: "Diferencial criativo", t: "A tipografia participa da narrativa: manchete, ficha, bilhete e mensagem são vozes gráficas diferentes do mesmo mistério." },
      { k: "Experiência", t: "Sentir que está acessando informações que não deveria conhecer, como um arquivo confidencial com cara de campanha de moda." },
      { k: "Tipografia × narrativa", t: "Contrastes de escala, peso e estilo diferenciam o glamour da superfície e o perigo do que está escondido." }
    ]
  },

  /* ------------------------------------------------------------------
     CAP. 03 — MOODBOARD E REFERÊNCIAS
     "cats" = categorias. "note" = como a referência influenciou o grupo.
     ------------------------------------------------------------------ */
  moodboard: {
    img: "assets/moodboard/moodboard-pretty-suspects.jpg",
    caption: "Moodboard do grupo — Pretty Suspects: The Last Party",
    keywords: ["confidential", "evidence", "polaroid", "ID card", "memory box", "lace", "Y2K", "the last party"],
    // Texto do grupo explicando como as referências guiaram as decisões:
    influence: "",   // A PREENCHER
    // Crédito exibido junto das referências e nos créditos finais
    refsCredit: "Referências visuais de terceiros (Pinterest e outras fontes), reunidas pelo grupo apenas como inspiração para este projeto acadêmico. Os direitos de cada imagem pertencem aos seus autores.",
    categories: ["Y2K Culture", "Fashion Editorial", "Teen Thriller", "Typography", "Photography", "Graphic Elements", "Packaging", "Card Design"],
    refs: [
      { img: "assets/referencias/ref-5609.jpg", cats: ["Card Design", "Fashion Editorial"], label: "Retrato oval em moldura de renda", note: "" },
      { img: "assets/referencias/ref-5610.jpg", cats: ["Photography", "Teen Thriller", "Y2K Culture"], label: "Grupo de amigas com flash e data na foto", note: "" },
      { img: "assets/referencias/ref-5611.jpg", cats: ["Card Design", "Fashion Editorial"], label: "Moldura de renda e lettering gótico", note: "" },
      { img: "assets/referencias/ref-5614.jpg", cats: ["Card Design", "Photography"], label: "Cartas colecionáveis com retratos P&B", note: "" },
      { img: "assets/referencias/ref-5615.jpg", cats: ["Card Design", "Graphic Elements"], label: "Carteirinha / ID card", note: "" },
      { img: "assets/referencias/ref-5616.jpg", cats: ["Card Design", "Typography"], label: "Ficha com polaroid e campos manuscritos", note: "" },
      { img: "assets/referencias/ref-5617.jpg", cats: ["Typography", "Y2K Culture"], label: "Colagem com documento e assinatura", note: "" },
      { img: "assets/referencias/ref-5618.jpg", cats: ["Y2K Culture", "Graphic Elements"], label: "Scrapbook rosa", note: "" },
      { img: "assets/referencias/ref-5619.jpg", cats: ["Typography", "Y2K Culture"], label: "Lombadas de VHS", note: "" },
      { img: "assets/referencias/ref-5620.jpg", cats: ["Packaging", "Graphic Elements"], label: "Arquivo em plástico com crachá", note: "" },
      { img: "assets/referencias/ref-5621.jpg", cats: ["Typography", "Graphic Elements"], label: "Etiquetas e recortes tipográficos", note: "" },
      { img: "assets/referencias/ref-5622.jpg", cats: ["Packaging", "Y2K Culture"], label: "Memory box numerada", note: "" },
      { img: "assets/referencias/ref-5623.jpg", cats: ["Packaging", "Typography"], label: "Pastas com abas", note: "" },
      { img: "assets/referencias/ref-5624.jpg", cats: ["Fashion Editorial", "Typography"], label: "Editorial rosa com script", note: "" },
      { img: "assets/referencias/ref-5625.jpg", cats: ["Card Design", "Typography"], label: "Crachá com foto e manuscrito", note: "" },
      { img: "assets/referencias/ref-5626.jpg", cats: ["Packaging", "Graphic Elements"], label: "Pasta de arquivo com colagem", note: "" },
      { img: "assets/referencias/ref-5627.jpg", cats: ["Graphic Elements"], label: "Prendedor e etiquetas", note: "" },
      { img: "assets/referencias/ref-5628.jpg", cats: ["Graphic Elements"], label: "Tachinha rendada", note: "" },
      { img: "assets/referencias/ref-5629.jpg", cats: ["Graphic Elements"], label: "Prendedor rendado", note: "" },
      { img: "assets/referencias/ref-5630.jpg", cats: ["Graphic Elements", "Packaging"], label: "Lacre de cera com cupido", note: "" },
      { img: "assets/referencias/ref-5631.jpg", cats: ["Graphic Elements"], label: "Coração de renda", note: "" },
      { img: "assets/referencias/ref-5632.jpg", cats: ["Graphic Elements", "Typography"], label: "Adesivo oval", note: "" },
      { img: "assets/referencias/ref-5633.jpg", cats: ["Photography", "Teen Thriller"], label: "Recorte de amigas em duotone rosa", note: "" },
      { img: "assets/referencias/ref-5634.jpg", cats: ["Packaging", "Graphic Elements"], label: "Lacre de cera com monograma", note: "" },
      { img: "assets/referencias/ref-5635.jpg", cats: ["Packaging"], label: "Envelope de renda", note: "" },
      { img: "assets/referencias/ref-5636.jpg", cats: ["Packaging", "Typography"], label: "Envelope lacrado com script", note: "" }
    ]
  },

  /* ------------------------------------------------------------------
     CAP. 04 — IDENTIDADE VISUAL
     ------------------------------------------------------------------ */
  identity: {
    // Cores amostradas do moodboard do grupo. Confirme com os valores do arquivo original.
    // Para mudar uma cor do site inteiro, altere também as variáveis no topo do index.html.
    palette: [
      { name: "Baby Pink", hex: "#F1BBC4", role: "Fundos, papéis, áreas de respiro" },
      { name: "Hot Pink", hex: "#BE3E66", role: "Nome da marca, destaques, carimbos" },
      { name: "Black", hex: "#1E1919", role: "Base, contraste, noite da festa" },
      { name: "Off-white", hex: "#FBF0E6", role: "Papel, fichas, documentos" },
      { name: "Silver / Chrome", hex: "#C5BCB2", role: "Metal, estrelas, detalhes Y2K" }
    ],
    accent: { name: "Dark Red", hex: "#8B1025", role: "Uso pontual: só na revelação final (sugestão do briefing, não está no moodboard)" },
    paletteNote: "", // A PREENCHER: justificativa do grupo para a paleta

    // FONTES. status: "provisória" (escolhida para o site) ou "oficial" (definida pelo grupo).
    // css = nome da família carregada no site. Para usar outra fonte, veja o LEIA-ME.
    fonts: [
      { role: "Principal — display", name: "Playfair Display", css: "var(--f-display)", status: "provisória",
        use: "Logotipo, títulos, nomes das personagens", why: "Aproximação da serifa itálica pesada do logo no moodboard.",
        weights: [400, 700, 900], italic: true, justification: "" },
      { role: "Secundária — condensada", name: "Archivo (larguras condensadas)", css: "var(--f-cond)", status: "provisória",
        use: "Manchetes, rótulos, carimbos, ingressos", why: "Ecoa o 'ADMIT ONE' e as lombadas de VHS das referências.",
        weights: [400, 600, 800, 900], italic: false, justification: "" },
      { role: "Apoio — datilografia", name: "Courier Prime", css: "var(--f-mono)", status: "provisória",
        use: "Fichas, documentos, dados do caso", why: "Ecoa o 'CASE 001: THE LAST PARTY' do crachá no moodboard.",
        weights: [400, 700], italic: true, justification: "" },
      { role: "Apoio — manuscrita", name: "Caveat", css: "var(--f-hand)", status: "provisória",
        use: "Anotações, bilhetes, legendas de polaroid", why: "Ecoa o 'The Last Party' e a checklist escritos à mão no moodboard.",
        weights: [400, 700], italic: false, justification: "" }
    ],
    typeNote: "", // A PREENCHER: justificativa geral das escolhas tipográficas do grupo

    // Elementos gráficos observados no moodboard e usados no site
    graphics: [
      { k: "Carimbo", t: "CONFIDENTIAL, CLASSIFIED, CASE NO. 001" },
      { k: "Polaroid", t: "Fotos com moldura, flash e data impressa" },
      { k: "Crachá / ID", t: "Fichas das personagens" },
      { k: "Renda", t: "Bordas e texturas de toalhinha" },
      { k: "Lacre de cera", t: "Fecha o que é secreto" },
      { k: "Ingresso", t: "ADMIT ONE — THE LAST PARTY" },
      { k: "Fita e prendedor", t: "Colagem e sobreposição" },
      { k: "Estrela prateada", t: "Detalhe cromado Y2K" }
    ],
    // Leitura do moodboard (validar com o grupo)
    composition: [
      "Sobreposição controlada: documentos, fotos e recortes empilhados como colagem.",
      "Fotografia emoldurada: polaroid, oval de renda e crachá.",
      "Contraste de vozes: serifa itálica (glamour) × condensada (escândalo) × máquina de escrever (arquivo) × manuscrita (segredo).",
      "Rotações leves e assimetria, com uma informação principal por peça.",
      "Rosa e preto como base; prata e vermelho só como pontos de tensão."
    ],
    compositionNote: "" // A PREENCHER: critérios de composição definidos pelo grupo
  },

  /* ------------------------------------------------------------------
     CAP. 05 — THE LAST PARTY (HISTÓRIA)
     ------------------------------------------------------------------ */
  story: {
    caseName: "The Last Party",
    place: "Mansão Valentina",
    event: "The Pink Night",
    date: "31 de outubro de 2005",
    crimeWindow: "entre 22h30 e 23h",
    anonymousMessage: "Eu sei o que você fez. Me encontre no andar de cima às 22h45. Venha sozinha.",
    beats: [
      { t: "Quatro amigas foram convidadas para uma festa exclusiva em uma antiga mansão." },
      { t: "Durante a noite, Alice recebe uma mensagem anônima.", phone: true },
      { t: "Ela não conta às amigas o que aconteceu e desaparece durante a festa." },
      { big: "23:00", t: "As luzes da mansão piscam. Um grito é ouvido no andar superior.", flicker: true },
      { t: "Alice é encontrada morta no antigo quarto de fotografias da mansão." },
      { t: "A polícia chega e descobre que as três amigas restantes possuem motivos para querer silenciá-la." },
      { t: "O problema? Todas têm álibis.", t2: "Mas pelo menos um deles é falso." }
    ],
    ending: ["THE PARTY IS OVER.", "THE INVESTIGATION BEGINS."]
  },

  /* ------------------------------------------------------------------
     CAP. 06 — PERSONAGENS
     img = imagem da personagem. As três suspeitas têm o mesmo peso visual.
     ------------------------------------------------------------------ */
  girls: [
    {
      id: "agatha", name: "AGATHA", title: "THE IT GIRL", status: "SOB SUSPEITA", victim: false,
      img: "assets/personagens/agatha.jpg",
      fields: [
        ["Personalidade", "Confiante, comunicativa e observadora."],
        ["Relação com Alice", "Melhores amigas, mas estavam afastadas."],
        ["Segredo", "Descobriu que Alice estava falando mal dela pelas costas, e as duas discutiram naquela noite."],
        ["Álibi", "Afirma que estava na pista de dança entre 22h30 e 22h55."],
        ["O que esconde", "Guardou uma mensagem ofensiva que Alice havia enviado."]
      ],
      quote: "Popularity comes with a price."
    },
    {
      id: "tina", name: "TINA", title: "THE SWEETHEART", status: "SOB SUSPEITA", victim: false,
      img: "assets/personagens/tina.jpg",
      fields: [
        ["Personalidade", "Doce, tranquila e aparentemente inocente."],
        ["Relação com Alice", "Eram amigas, mas tinham uma rivalidade secreta."],
        ["Segredo", "Alice descobriu que Tina estava espalhando um segredo comprometedor sobre ela."],
        ["Álibi", "Afirma que estava no banheiro retocando a maquiagem durante o horário do crime."],
        ["O que esconde", "Foi vista perto do corredor do quarto de fotografias."]
      ],
      quote: "Sweet girls have secrets too."
    },
    {
      id: "laila", name: "LAILA", title: "THE MYSTERY GIRL", status: "SOB SUSPEITA", victim: false,
      img: "assets/personagens/laila.jpg",
      fields: [
        ["Personalidade", "Misteriosa, inteligente e reservada."],
        ["Relação com Alice", "Sabia de coisas que as outras amigas desconheciam."],
        ["Segredo", "Pegou escondida a chave do quarto de fotografias para procurar uma carta que Alice guardava."],
        ["Álibi", "Afirma que estava no jardim fazendo uma ligação."],
        ["O que esconde", "Entrou no quarto antes do assassinato, mas diz que não encontrou Alice."]
      ],
      quote: "Silence says more than words."
    },
    {
      id: "alice", name: "ALICE", title: "THE VICTIM", status: "VÍTIMA", victim: true,
      img: "assets/personagens/alice.jpg",
      fields: [
        ["Personalidade", "Popular, manipuladora e muito observadora."],
        ["Relação com as amigas", "Conhecia os segredos de todas."],
        ["Segredo", "Estava preparando uma revelação que poderia destruir a amizade das quatro."],
        ["Última ação", "Deixou uma fotografia escondida no quarto antes de morrer."],
        ["Mistério", "Quem tinha mais a perder com o que Alice sabia?"]
      ],
      quote: "She knew too much."
    }
  ],

  /* ------------------------------------------------------------------
     CAP. 07 — AS CINCO CARTAS
     front / back = artes do grupo. Proporção e medidas em "cardSpec".
     ------------------------------------------------------------------ */
  cardSpec: {
    ratio: "90 / 126",       // proporção das cartas (largura / altura)
    size: "90 × 126 mm (proposta, a aprovar)",       // modelos gerados em _producao (ver 09 — Arquivos para Impressão)
    enlargedSize: "180 × 252 mm (proposta, a aprovar)",
    paper: "",               // A PREENCHER — papel e gramatura
    finish: "",              // A PREENCHER — acabamento
    sharedBack: ""           // se todas as cartas tiverem o mesmo verso, coloque a imagem aqui
  },
  cards: [
    { n: "01", id: "crime", name: "THE CRIME", sub: "O caso", category: "Abertura do caso",
      fn: "Abre a investigação: apresenta o caso e a mensagem anônima.",
      content: ["Nome do caso", "Data", "Local", "Horário aproximado", "Mensagem anônima", "Introdução ao assassinato"],
      visual: "", front: "assets/cartas/carta-01-the-crime-frente.jpg", back: "assets/cartas/verso-carta-01.jpg", typeNotes: "" },
    { n: "02", id: "girls-1", name: "THE GIRLS", sub: "Agatha & Tina", category: "Personagens",
      fn: "Apresenta duas suspeitas, com fotos, personalidades, segredos e álibis.",
      content: ["Agatha — The It Girl", "Tina — The Sweetheart", "Fotografias", "Personalidades", "Segredos", "Álibis"],
      visual: "Duas fichas de investigação, com referências de páginas de revistas e arquivos policiais.", front: "assets/cartas/carta-02-the-girls-frente.jpg", back: "assets/cartas/verso-carta-02.jpg", typeNotes: "" },
    { n: "03", id: "girls-2", name: "THE GIRLS", sub: "Laila & Alice", category: "Personagens",
      fn: "Apresenta a terceira suspeita e a vítima, com a última ação de Alice.",
      content: ["Laila — The Mystery Girl", "Alice — The Victim", "Fotografias", "Informações", "Segredos", "Última ação da vítima"],
      visual: "Montagem editorial de fotografias, recortes e anotações.", front: "assets/cartas/carta-03-the-girls-frente.jpg", back: "assets/cartas/verso-carta-03.jpg", typeNotes: "" },
    { n: "04", id: "evidence", name: "THE EVIDENCE", sub: "As pistas", category: "Evidências",
      fn: "Reúne as cinco pistas que a turma precisa cruzar.",
      content: ["Fotografia", "Chave", "Mensagem", "Contradição no álibi", "Bilhete misterioso"],
      visual: "Mural de investigação com elementos conectados graficamente.", front: "assets/cartas/carta-04-the-evidence-frente.jpg", back: "assets/cartas/verso-carta-04.jpg", typeNotes: "" },
    { n: "05", id: "truth", name: "THE TRUTH", sub: "Confidencial", category: "Revelação", sealed: true,
      fn: "Fica lacrada no envelope até a votação final.",
      content: ["Identidade da assassina", "Motivo", "Reconstrução do crime", "Explicação das pistas"],
      visual: "", front: "", back: "assets/cartas/verso-carta-05.jpg", typeNotes: "" }
  ],

  /* ------------------------------------------------------------------
     CAP. 08 — EVIDÊNCIAS (não acrescentar novas sem aprovação do grupo)
     ------------------------------------------------------------------ */
  evidence: [
    { n: "01", kind: "photo", title: "THE PHOTOGRAPH", label: "A fotografia",
      text: "Uma fotografia instantânea foi encontrada no chão do quarto. No reflexo de um espelho aparece uma pessoa usando um acessório de estrela prateada, perto da porta.",
      ask: ["O que aparece no reflexo?", "Quem estava perto da porta?"], img: "" },
    { n: "02", kind: "key", title: "THE KEY", label: "A chave",
      text: "A chave do quarto estava escondida dentro de uma bolsa. Laila admite que pegou a chave antes da festa, mas afirma que a devolveu.",
      ask: ["Quem teve acesso ao quarto?", "Devolver a chave prova alguma coisa?"], img: "" },
    { n: "03", kind: "message", title: "THE MESSAGE", label: "A mensagem", time: "22:15",
      text: "O celular de Alice tinha uma mensagem enviada às 22h15:",
      quote: "Você não pode contar isso para ninguém. Se contar, acabou para mim.",
      ask: ["Quem teria escrito isso?", "O que Alice sabia?"], img: "" },
    { n: "04", kind: "alibi", title: "THE ALIBI", label: "O álibi", time: "22:46",
      text: "Tina diz que estava no banheiro durante o crime, mas uma fotografia tirada às 22h46 mostra alguém com seu acessório característico no corredor do quarto.",
      ask: ["Qual declaração esta foto coloca em dúvida?", "Um acessório prova quem estava lá?"], img: "" },
    { n: "05", kind: "note", title: "THE NOTE", label: "O bilhete",
      text: "Um pedaço de papel foi encontrado na lixeira:",
      quote: "23h. Negativo. Antes que ela conte.",
      ask: ["Que negativo é esse?", "Quem tinha pressa?"], img: "" }
  ],

  /* ------------------------------------------------------------------
     CAP. 09 — LINHA DO TEMPO (recurso do site, não é uma sexta carta)
     type: "fato" (documentado), "declaracao" (dita por suspeita), "estimativa"
     ------------------------------------------------------------------ */
  timeline: [
    { time: "22:15", type: "fato", t: "Alice recebe uma mensagem ameaçadora." },
    { time: "22:30", type: "estimativa", t: "Início do intervalo estimado do crime." },
    { time: "22:45", type: "fato", t: "Horário indicado na mensagem anônima para o encontro." },
    { time: "22:46", type: "fato", t: "Uma fotografia registra alguém com o acessório característico de Tina no corredor." },
    { time: "22:55", type: "declaracao", t: "Horário em que termina o álibi declarado por Agatha." },
    { time: "23:00", type: "fato", t: "As luzes piscam, um grito é ouvido e Alice é encontrada." }
  ],
  // Álibis declarados (aparecem como declarações, nunca como fatos)
  alibis: [
    { who: "AGATHA", where: "Pista de dança", from: "22:30", to: "22:55", note: "22h30 – 22h55" },
    { who: "TINA", where: "Banheiro", from: "22:30", to: "23:00", note: "“durante o horário do crime”" },
    { who: "LAILA", where: "Jardim, numa ligação", from: "22:30", to: "23:00", note: "horário não especificado" }
  ],

  /* ------------------------------------------------------------------
     CAP. 10 — PRODUTO / MOCKUPS
     kind: "mockup" (mockup digital), "arte" (arte digital plana), "prototipo", "final" (foto do produto pronto)
     spoiler: true = a imagem mostra a frente da carta 05 → fica borrada até a revelação
     ratio = proporção do espaço (largura / altura)
     ------------------------------------------------------------------ */
  product: {
    hero: { label: "Produto completo — composição publicitária", kind: "mockup", img: "assets/mockups/mockup-04-produto-completo-publicitario.jpg", ratio: "16 / 9", spoiler: false },
    shots: [
      { label: "Embalagem fechada", kind: "mockup", img: "assets/mockups/mockup-01-embalagem-fechada.jpg", ratio: "16 / 10", spoiler: false },
      { label: "Embalagem aberta", kind: "mockup", img: "assets/mockups/mockup-02-embalagem-aberta-com-cartas.jpg", ratio: "16 / 11", spoiler: false },
      { label: "As cinco cartas juntas", kind: "mockup", img: "assets/mockups/mockup-03-cinco-cartas-organizadas.jpg", ratio: "16 / 9", spoiler: false },
      { label: "Cartas espalhadas", kind: "mockup", img: "assets/mockups/mockup-08-cartas-espalhadas.jpg", ratio: "16 / 10", spoiler: false },
      { label: "Frentes e versos", kind: "mockup", img: "assets/mockups/mockup-07-frentes-e-versos.jpg", ratio: "16 / 10", spoiler: false },
      { label: "Carta na mão", kind: "mockup", img: "", ratio: "4 / 5", spoiler: false },
      { label: "Escala ampliada das cartas", kind: "mockup", img: "assets/mockups/mockup-05-escala-das-cartas.jpg", ratio: "16 / 10", spoiler: false },
      { label: "Envelope confidencial", kind: "arte", img: "assets/embalagem/envelope-frente.jpg", ratio: "100 / 136", spoiler: false },
      { label: "Embalagem e cartas juntas", kind: "mockup", img: "", ratio: "3 / 2", spoiler: false },
      { label: "Mesa de investigação", kind: "mockup", img: "assets/mockups/mockup-06-mesa-de-investigacao.jpg", ratio: "16 / 10", spoiler: false },
      { label: "Detalhes", kind: "final", img: "", ratio: "1 / 1", spoiler: false },
      { label: "Acabamentos", kind: "final", img: "", ratio: "1 / 1", spoiler: false },
      { label: "Produto materializado", kind: "final", img: "", ratio: "4 / 5", spoiler: false }
    ]
  },

  /* ------------------------------------------------------------------
     CAP. 11 — EMBALAGEM
     ------------------------------------------------------------------ */
  packaging: {
    concept: "Uma pasta de investigação confidencial.",
    elements: ["Logotipo Pretty Suspects", "Case 001", "The Last Party", "Etiqueta Confidential",
      "Referências gráficas de arquivos secretos", "Fotografias e elementos editoriais (se fizerem parte do design final)",
      "As cinco cartas físicas", "Envelope lacrado para a carta The Truth"],
    images: [
      { label: "Frente", img: "assets/embalagem/tampa-frente.jpg", ratio: "107 / 143" },
      { label: "Verso", img: "assets/embalagem/base-verso.jpg", ratio: "104 / 140" },
      { label: "Interior", img: "assets/embalagem/forro-base.jpg", ratio: "103 / 139" }
    ],
    fields: [
      ["Forma de abertura", "Caixa de duas partes: a tampa encaixa por cima da base (proposta)."],
      ["Organização das cartas", "Cartas 01 a 04 soltas; a carta 05 lacrada no envelope; manual em zine de 8 páginas (proposta)."],
      ["Materiais", ""],
      ["Acabamento", ""],
      ["Detalhes gráficos", ""],
      ["Experiência de unboxing", ""]
    ]
  },

  /* ------------------------------------------------------------------
     CAP. 12 — BASTIDORES (diário de produção)
     status: "registrado" quando a etapa aconteceu e tem material.
     Não marque etapas que ainda não aconteceram.
     ------------------------------------------------------------------ */
  process: [
    { k: "Pesquisa de referências e moodboard", status: "registrado", note: "26 referências reunidas e moodboard da edição The Last Party.", imgs: ["assets/moodboard/moodboard-pretty-suspects.jpg"] },
    { k: "Brainstorming", status: "", note: "", imgs: [] },
    { k: "Desenvolvimento do conceito", status: "", note: "", imgs: [] },
    { k: "Primeiros esboços", status: "", note: "", imgs: [] },
    { k: "Estudos tipográficos", status: "", note: "", imgs: [] },
    { k: "Testes de composição", status: "", note: "", imgs: [] },
    { k: "Testes de cores", status: "", note: "", imgs: [] },
    { k: "Ensaios fotográficos", status: "", note: "", imgs: [] },
    { k: "Bastidores das fotografias", status: "", note: "", imgs: [] },
    { k: "Desenvolvimento das cartas", status: "", note: "", imgs: [] },
    { k: "Testes de impressão", status: "", note: "", imgs: [] },
    { k: "Escolha de materiais", status: "", note: "", imgs: [] },
    { k: "Montagem da embalagem", status: "", note: "", imgs: [] },
    { k: "Processo de recorte", status: "", note: "", imgs: [] },
    { k: "Acabamento", status: "", note: "", imgs: [] },
    { k: "Materialização", status: "", note: "", imgs: [] }
  ],

  /* ------------------------------------------------------------------
     CAP. 13 — MATERIALIZAÇÃO (não inventar medidas ou materiais)
     cardMM = medidas da carta em milímetros, para o desenho de escala.
     ------------------------------------------------------------------ */
  materials: {
    cardMM: { w: 90, h: 126 },        // proposta (a aprovar)
    standardMM: { w: 63, h: 88 },    // carta de baralho convencional (referência)
    specs: [
      ["Dimensões das cartas", "90 × 126 mm (proposta) · ampliadas 180 × 252 mm"], ["Gramatura do papel", ""], ["Tipo de impressão", ""],
      ["Tipo de acabamento", ""], ["Material da embalagem", ""], ["Material do envelope", ""],
      ["Técnicas utilizadas", ""], ["Processo de montagem", ""], ["Escolhas de suporte", ""],
      ["Resistência", ""], ["Legibilidade", ""], ["Escala", ""], ["Relação entre forma e função", ""]
    ],
    photos: [
      { label: "Carta na mão (escala)", img: "", ratio: "4 / 5" },
      { label: "Frente e verso lado a lado", img: "", ratio: "3 / 2" },
      { label: "Cartas em escala ampliada", img: "", ratio: "4 / 5" }
    ],
    justification: "" // A PREENCHER
  },

  // Entregáveis do enunciado (A2 — Projeto Baralho Tipográfico). done: true quando concluído.
  checklist: [
    { t: "Conjunto completo de 5 cartas", done: false, where: "cards" },
    { t: "No mínimo 2 cartas materializadas em escala ampliada", done: false, where: "materials" },
    { t: "Sistema gráfico com frente e verso das cartas", done: false, where: "cards" },
    { t: "Regras e instruções de funcionamento", done: true, where: "play" },
    { t: "Mockups de apresentação do produto", done: true, where: "product" },
    { t: "Apresentação coletiva do processo e do resultado", done: false, where: "process" }
  ],

  /* ------------------------------------------------------------------
     CAP. 14 — COMO JOGAR
     card = número da carta usada no passo.
     ------------------------------------------------------------------ */
  rules: [
    { t: "O grupo recebe a carta The Crime.", card: "01" },
    { t: "Conhece as quatro personagens pelas cartas The Girls.", card: "02 + 03" },
    { t: "Analisa as pistas da carta The Evidence.", card: "04" },
    { t: "Compara os álibis." },
    { t: "Identifica contradições." },
    { t: "Discute possíveis suspeitas." },
    { t: "Escolhe quem acredita ser a assassina." },
    { t: "Registra sua acusação." },
    { t: "Abre a carta The Truth.", card: "05" },
    { t: "Descobre se a investigação estava correta." }
  ],
  roleplay: [
    "A quinta carta permanece lacrada até a votação final.",
    "Durante a apresentação, as integrantes podem interpretar suas personagens.",
    "Agatha, Tina e Laila respondem perguntas da turma dentro do universo fictício do jogo.",
    "Alice pode aparecer em fotografias, mensagens ou numa gravação deixada antes de morrer."
  ],

  /* ------------------------------------------------------------------
     CAP. 17 — CRÉDITOS
     ------------------------------------------------------------------ */
  team: {
    members: [
      { name: "AGATHA", full: "", role: "História, roteiro e organização", img: "assets/personagens/agatha.jpg" },
      { name: "TINA", full: "", role: "Identidade visual e tipografia", img: "assets/personagens/tina.jpg" },
      { name: "LAILA", full: "", role: "Criação e desenvolvimento das cartas no Canva", img: "assets/personagens/laila.jpg" },
      { name: "ALICE", full: "", role: "Embalagem, mockups e apresentação", img: "assets/personagens/alice.jpg" }
    ],
    shared: "Todas participam das fotografias, da revisão e da materialização.",
    rolesNote: "Divisão inicial de responsabilidades, sujeita à confirmação do grupo.",
    info: [
      ["Instituição", "IDP"],
      ["Curso", ""],
      ["Disciplina", ""],
      ["Professora", ""],
      ["Semestre", ""],
      ["Avaliação", "A2 — Projeto Baralho Tipográfico"]
    ],
    references: "", // A PREENCHER: fontes das referências visuais, fontes tipográficas, tutoriais
    // Rascunho da declaração de uso de IA — o grupo deve revisar conforme o processo real.
    aiStatement: "Este website de apresentação foi desenvolvido com apoio de inteligência artificial (Claude, da Anthropic), a partir do enunciado da A2, do briefing, do moodboard, das referências e das imagens fornecidas pelo grupo. A IA apoiou a organização das informações, a programação e a interface do site, e gerou modelos-base editáveis das cartas, da embalagem, do envelope, do manual e dos adesivos, além dos mockups digitais, a partir da direção de arte e do conteúdo definidos pelo grupo.\n\nA concepção do jogo, a narrativa, as personagens e a direção visual são do grupo. [COMPLETAR: quais ajustes tipográficos, de composição e de edição o grupo fez nos modelos-base, e como foi a materialização.]\n\n[COMPLETAR: outros usos de IA no projeto, por exemplo na geração ou no tratamento das imagens das personagens e do moodboard, se for o caso.]",
    disclaimer: "Projeto acadêmico fictício. As personagens, os nomes e a história não representam características reais das integrantes."
  }

  /* A REVELAÇÃO FINAL (cap. 16) fica em segredo.js, codificada.
     Para ver ou editar: ferramentas/editar-segredo.html */
};
