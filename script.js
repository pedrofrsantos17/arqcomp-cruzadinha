
"use strict";

const NUMERO_LINHAS = 13;
const NUMERO_COLUNAS = 13;

// Cada palavra informa sua posição inicial e orientação.
const palavras = [
  {
    numero: 1,
    resposta: "FLASH",
    pista: "Memória não volátil apagada e regravada em blocos, comum em cartões e unidades de armazenamento.",
    linha: 0,
    coluna: 2,
    direcao: "V"
  },
  {
    numero: 2,
    resposta: "UC",
    pista: "Bloco do processador que interpreta instruções e coordena sinais internos.",
    linha: 0,
    coluna: 5,
    direcao: "H"
  },
  {
    numero: 3,
    resposta: "CPU",
    pista: "Componente central que executa instruções e coordena o funcionamento do computador.",
    linha: 0,
    coluna: 6,
    direcao: "V"
  },
  {
    numero: 4,
    resposta: "EEPROM",
    pista: "Memória não volátil que permite apagar e regravar dados eletricamente, geralmente byte a byte.",
    linha: 1,
    coluna: 10,
    direcao: "V"
  },
  {
    numero: 5,
    resposta: "DATABUS",
    pista: "Conjunto de linhas que transporta valores entre o processador, a memória e periféricos.",
    linha: 2,
    coluna: 1,
    direcao: "H"
  },
  {
    numero: 6,
    resposta: "ADDRESSBUS",
    pista: "Conjunto de linhas que indica a posição de memória ou dispositivo acessado.",
    linha: 2,
    coluna: 4,
    direcao: "V"
  },
  {
    numero: 7,
    resposta: "DUALCORE",
    pista: "Processador que possui dois núcleos capazes de executar tarefas.",
    linha: 4,
    coluna: 4,
    direcao: "H"
  },
  {
    numero: 8,
    resposta: "CACHE",
    pista: "Memória rápida que guarda cópias de dados usados com frequência.",
    linha: 6,
    coluna: 0,
    direcao: "H"
  },
  {
    numero: 9,
    resposta: "ULA",
    pista: "Parte responsável por cálculos e operações lógicas dentro do processador.",
    linha: 6,
    coluna: 7,
    direcao: "V"
  },
  {
    numero: 10,
    resposta: "REGISTRADORES",
    pista: "Pequenos espaços internos que guardam valores temporários durante o processamento.",
    linha: 8,
    coluna: 0,
    direcao: "H"
  },
  {
    numero: 11,
    resposta: "QUADCORE",
    pista: "Processador que possui quatro núcleos capazes de executar tarefas.",
    linha: 10,
    coluna: 3,
    direcao: "H"
  },
  {
    numero: 12,
    resposta: "DMA",
    pista: "Recurso que transfere dados entre memória e periféricos com pouca intervenção do processador.",
    linha: 10,
    coluna: 6,
    direcao: "V"
  },
  {
    numero: 13,
    resposta: "ROM",
    pista: "Memória cujo conteúdo é gravado previamente e consultado pelo processador durante a execução.",
    linha: 10,
    coluna: 9,
    direcao: "V"
  },
  {
    numero: 14,
    resposta: "RAM",
    pista: "Memória principal e volátil que mantém temporariamente programas e dados em execução.",
    linha: 12,
    coluna: 5,
    direcao: "H"
  }
];

// Elementos HTML utilizados pelo JavaScript.

const elementoTabuleiro = document.getElementById("board");

const elementoHorizontais =
  document.getElementById("horizontal-clues");

const elementoVerticais =
  document.getElementById("vertical-clues");

const elementoPontuacao =
  document.getElementById("score-count");

const elementoProgresso =
  document.getElementById("score-progress");

const elementoMensagem =
  document.getElementById("game-message");

const botaoConferir =
  document.getElementById("check-button");

const botaoReiniciar =
  document.getElementById("reset-button");

const botaoConsultarRespostas =
  document.getElementById("answers-button");

// Variáveis de controle.

let matriz = [];

let celulasPorPosicao = new Map();

let palavrasPorNumero = new Map();

let palavraSelecionada = null;

let resultadoConferido = false;


// RETORNA AS POSIÇÕES DE UMA PALAVRA.

function obterPosicoesDaPalavra(palavra) {

  const posicoes = [];

  for (
    let indice = 0;
    indice < palavra.resposta.length;
    indice++
  ) {

    const linha =
      palavra.linha +
      (palavra.direcao === "V" ? indice : 0);

    const coluna =
      palavra.coluna +
      (palavra.direcao === "H" ? indice : 0);

    posicoes.push({
      linha,
      coluna,
      letra: palavra.resposta[indice]
    });

  }

  return posicoes;

}


// VALIDA E CONSTRÓI A MATRIZ DO TABULEIRO.

function validarTabuleiro() {

  matriz = Array.from(
    { length: NUMERO_LINHAS },
    () => Array(NUMERO_COLUNAS).fill(null)
  );

  celulasPorPosicao = new Map();

  palavrasPorNumero = new Map();

  palavras.forEach((palavra) => {

    const posicoes = obterPosicoesDaPalavra(palavra);

    palavra.posicoes = posicoes;

    palavra.celulasCruzadas = 0;

    palavrasPorNumero.set(palavra.numero, palavra);

    posicoes.forEach((posicao) => {

      const { linha, coluna, letra } = posicao;

      if (
        linha < 0 ||
        linha >= NUMERO_LINHAS ||
        coluna < 0 ||
        coluna >= NUMERO_COLUNAS
      ) {

        throw new Error(
          `A palavra ${palavra.resposta} ultrapassa os limites do tabuleiro.`
        );

      }

      const chave = `${linha}-${coluna}`;

      const celulaExistente = matriz[linha][coluna];

      if (
        celulaExistente !== null &&
        celulaExistente.letra !== letra
      ) {

        throw new Error(
          `Conflito de letras na posição ${chave}.`
        );

      }

      if (celulaExistente !== null) {

        if (
          celulaExistente.direcoes.includes(palavra.direcao)
        ) {

          throw new Error(
            `Duas palavras na mesma direção ocupam a posição ${chave}.`
          );

        }

        if (celulaExistente.palavras.length >= 2) {

          throw new Error(
            `Mais de duas palavras ocupam a posição ${chave}.`
          );

        }

        palavra.celulasCruzadas++;

        celulaExistente.palavras.push(palavra.numero);

        celulaExistente.direcoes.push(palavra.direcao);

      } else {

        matriz[linha][coluna] = {
          letra,
          palavras: [palavra.numero],
          direcoes: [palavra.direcao]
        };

      }

      celulasPorPosicao.set(
        chave,
        matriz[linha][coluna]
      );

    });

  });


  // Verifica se todas as palavras possuem cruzamentos.

  palavras.forEach((palavra) => {

    const direcaoOposta =
      palavra.direcao === "H" ? "V" : "H";

    const celulasComCruzamento =
      palavra.posicoes.filter((posicao) => {

        const celula =
          matriz[posicao.linha][posicao.coluna];

        return celula.direcoes.includes(direcaoOposta);

      });

    if (celulasComCruzamento.length === 0) {

      throw new Error(
        `A palavra ${palavra.resposta} não cruza nenhuma outra palavra.`
      );

    }

  });


  // Verifica se todas as palavras estão conectadas.

  const visitadas = new Set();

  const fila = [palavras[0].numero];

  visitadas.add(palavras[0].numero);

  while (fila.length > 0) {

    const numeroAtual = fila.shift();

    const palavraAtual =
      palavrasPorNumero.get(numeroAtual);

    palavraAtual.posicoes.forEach((posicao) => {

      const celula =
        matriz[posicao.linha][posicao.coluna];

      celula.palavras.forEach((numeroVizinho) => {

        if (!visitadas.has(numeroVizinho)) {

          visitadas.add(numeroVizinho);

          fila.push(numeroVizinho);

        }

      });

    });

  }

  if (visitadas.size !== palavras.length) {

    throw new Error(
      "O tabuleiro possui palavras que não estão conectadas ao conjunto principal."
    );

  }


  // Evita palavras encostadas sem formar cruzamentos válidos.

  for (
    let linha = 0;
    linha < NUMERO_LINHAS;
    linha++
  ) {

    for (
      let coluna = 0;
      coluna < NUMERO_COLUNAS;
      coluna++
    ) {

      const celulaAtual = matriz[linha][coluna];

      if (celulaAtual === null) continue;

      const celulaDireita =
        coluna + 1 < NUMERO_COLUNAS
          ? matriz[linha][coluna + 1]
          : null;

      if (celulaDireita !== null) {

        const compartilhamHorizontal =
          celulaAtual.palavras.some((numero) => {

            return (
              celulaDireita.palavras.includes(numero) &&
              palavrasPorNumero.get(numero).direcao === "H"
            );

          });

        if (!compartilhamHorizontal) {

          throw new Error(
            `Há casas lado a lado sem uma palavra horizontal na linha ${linha + 1}.`
          );

        }

      }

      const celulaAbaixo =
        linha + 1 < NUMERO_LINHAS
          ? matriz[linha + 1][coluna]
          : null;

      if (celulaAbaixo !== null) {

        const compartilhamVertical =
          celulaAtual.palavras.some((numero) => {

            return (
              celulaAbaixo.palavras.includes(numero) &&
              palavrasPorNumero.get(numero).direcao === "V"
            );

          });

        if (!compartilhamVertical) {

          throw new Error(
            `Há casas uma abaixo da outra sem uma palavra vertical na coluna ${coluna + 1}.`
          );

        }

      }

    }

  }

}


// CRIA VISUALMENTE O TABULEIRO.

function criarTabuleiro() {

  elementoTabuleiro.innerHTML = "";

  for (
    let linha = 0;
    linha < NUMERO_LINHAS;
    linha++
  ) {

    for (
      let coluna = 0;
      coluna < NUMERO_COLUNAS;
      coluna++
    ) {

      const celula = matriz[linha][coluna];

      const casa = document.createElement("div");

      if (celula === null) {

        casa.className = "blocked-cell";

        casa.setAttribute("aria-hidden", "true");

      } else {

        casa.className = "letter-cell";

        casa.setAttribute("role", "gridcell");

        const numero = palavras.find(
          (palavra) =>
            palavra.linha === linha &&
            palavra.coluna === coluna
        );

        if (numero) {

          const etiquetaNumero =
            document.createElement("span");

          etiquetaNumero.className = "cell-number";

          etiquetaNumero.textContent = numero.numero;

          casa.appendChild(etiquetaNumero);

        }

        const entrada =
          document.createElement("input");

        entrada.type = "text";

        entrada.maxLength = 1;

        entrada.autocomplete = "off";

        entrada.autocapitalize = "characters";

        entrada.spellcheck = false;

        entrada.inputMode = "text";

        entrada.dataset.linha = linha;

        entrada.dataset.coluna = coluna;

        entrada.setAttribute(
          "aria-label",
          `Linha ${linha + 1}, coluna ${coluna + 1}`
        );

        entrada.addEventListener(
          "focus",
          selecionarPalavraDaCelula
        );

        entrada.addEventListener(
          "input",
          tratarDigitacao
        );

        entrada.addEventListener(
          "keydown",
          tratarTeclado
        );

        casa.appendChild(entrada);

        celulasPorPosicao.set(
          `${linha}-${coluna}`,
          {
            ...celula,
            entrada,
            casa
          }
        );

      }

      elementoTabuleiro.appendChild(casa);

    }

  }

}


// CRIA AS LISTAS DE PISTAS.

function criarListasDePistas() {

  elementoHorizontais.innerHTML = "";

  elementoVerticais.innerHTML = "";

  palavras.forEach((palavra) => {

    const botao =
      document.createElement("button");

    botao.type = "button";

    botao.className = "clue-button";

    botao.dataset.numero = palavra.numero;

    botao.setAttribute(
      "aria-label",
      `Pista ${palavra.numero}: ${palavra.pista}`
    );

    const numero =
      document.createElement("span");

    numero.className = "clue-number";

    numero.textContent = `${palavra.numero}.`;

    const texto =
      document.createElement("span");

    texto.textContent = palavra.pista;

    const status =
      document.createElement("span");

    status.className = "clue-status";

    status.setAttribute("aria-hidden", "true");

    botao.append(numero, texto, status);

    botao.addEventListener("click", () => {
      selecionarPalavra(palavra);
    });

    if (palavra.direcao === "H") {

      elementoHorizontais.appendChild(botao);

    } else {

      elementoVerticais.appendChild(botao);

    }

    palavra.botaoPista = botao;

  });

}


// DESTACA A PALAVRA SELECIONADA.

function selecionarPalavra(
  palavra,
  focarPrimeiraCasa = true
) {

  palavraSelecionada = palavra;

  document.querySelectorAll(".clue-button")
    .forEach((botao) => {

      const ativa =
        Number(botao.dataset.numero) === palavra.numero;

      botao.classList.toggle("is-active", ativa);

      botao.setAttribute(
        "aria-pressed",
        String(ativa)
      );

    });

  document.querySelectorAll(".letter-cell")
    .forEach((casa) => {

      casa.classList.remove("is-selected");

    });

  palavra.posicoes.forEach((posicao) => {

    const celula = celulasPorPosicao.get(
      `${posicao.linha}-${posicao.coluna}`
    );

    if (celula) {

      celula.casa.classList.add("is-selected");

    }

  });

  if (focarPrimeiraCasa) {

    const primeiraPosicao = palavra.posicoes[0];

    const primeiraCelula = celulasPorPosicao.get(
      `${primeiraPosicao.linha}-${primeiraPosicao.coluna}`
    );

    if (primeiraCelula) {

      primeiraCelula.entrada.focus();

    }

  }

}


// IDENTIFICA A PALAVRA AO CLICAR EM UMA CASA.

function selecionarPalavraDaCelula(evento) {

  const linha =
    Number(evento.target.dataset.linha);

  const coluna =
    Number(evento.target.dataset.coluna);

  const celula =
    celulasPorPosicao.get(`${linha}-${coluna}`);

  if (!celula) return;

  if (
    palavraSelecionada &&
    celula.palavras.includes(palavraSelecionada.numero)
  ) {

    return;

  }

  const palavra =
    palavrasPorNumero.get(celula.palavras[0]);

  selecionarPalavra(palavra, false);

}


// CONTROLA A DIGITAÇÃO DAS LETRAS.

function tratarDigitacao(evento) {

  const entrada = evento.target;

  const letra = entrada.value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(-1);

  entrada.value = letra;

  limparResultadoAnterior();

  if (letra && palavraSelecionada) {

    const linha =
      Number(entrada.dataset.linha);

    const coluna =
      Number(entrada.dataset.coluna);

    const indiceAtual =
      palavraSelecionada.posicoes.findIndex(
        (posicao) =>
          posicao.linha === linha &&
          posicao.coluna === coluna
      );

    const proximaPosicao =
      palavraSelecionada.posicoes[indiceAtual + 1];

    if (proximaPosicao) {

      const proximaCelula =
        celulasPorPosicao.get(
          `${proximaPosicao.linha}-${proximaPosicao.coluna}`
        );

      if (proximaCelula) {

        proximaCelula.entrada.focus();

      }

    }

  }

}


// MOVE O FOCO PARA OUTRA CASA.

function moverParaCelula(linha, coluna) {

  const celula =
    celulasPorPosicao.get(`${linha}-${coluna}`);

  if (celula) {

    celula.entrada.focus();

  }

}


// CONTROLA O TECLADO.

function tratarTeclado(evento) {

  const entrada = evento.target;

  const linha =
    Number(entrada.dataset.linha);

  const coluna =
    Number(entrada.dataset.coluna);


  // Apagar letras.

  if (evento.key === "Backspace") {

    if (
      entrada.value === "" &&
      palavraSelecionada
    ) {

      const indiceAtual =
        palavraSelecionada.posicoes.findIndex(
          (posicao) =>
            posicao.linha === linha &&
            posicao.coluna === coluna
        );

      const posicaoAnterior =
        palavraSelecionada.posicoes[indiceAtual - 1];

      if (posicaoAnterior) {

        evento.preventDefault();

        const celulaAnterior =
          celulasPorPosicao.get(
            `${posicaoAnterior.linha}-${posicaoAnterior.coluna}`
          );

        celulaAnterior.entrada.value = "";

        celulaAnterior.entrada.focus();

        limparResultadoAnterior();

      }

    } else {

      limparResultadoAnterior();

    }

    return;

  }


  // Navegação pelas setas.

  const movimentos = {

    ArrowLeft: [0, -1],

    ArrowRight: [0, 1],

    ArrowUp: [-1, 0],

    ArrowDown: [1, 0]

  };

  if (movimentos[evento.key]) {

    evento.preventDefault();

    const [
      deslocamentoLinha,
      deslocamentoColuna
    ] = movimentos[evento.key];

    moverParaCelula(
      linha + deslocamentoLinha,
      coluna + deslocamentoColuna
    );

  }

}


// LIMPA A VALIDAÇÃO QUANDO UMA RESPOSTA É ALTERADA.

function limparResultadoAnterior() {

  if (!resultadoConferido) return;

  resultadoConferido = false;

  document.querySelectorAll(".letter-cell")
    .forEach((casa) => {

      casa.classList.remove(
        "is-correct",
        "is-incorrect"
      );

    });

  document.querySelectorAll(".clue-button")
    .forEach((botao) => {

      botao.classList.remove(
        "status-correct",
        "status-incorrect",
        "status-incomplete"
      );

      botao.querySelector(
        ".clue-status"
      ).textContent = "";

    });

  atualizarPontuacao(0);

  elementoMensagem.textContent =
    "Resposta alterada. Confira novamente quando terminar.";

  elementoMensagem.className = "game-message";

}


// CONFERE AS RESPOSTAS.

function conferirRespostas() {

  resultadoConferido = true;

  const resultados = [];

  let acertos = 0;

  let incompletas = 0;

  let incorretas = 0;

  palavras.forEach((palavra) => {

    const letrasDigitadas =
      palavra.posicoes.map((posicao) => {

        const celula = celulasPorPosicao.get(
          `${posicao.linha}-${posicao.coluna}`
        );

        return celula.entrada.value;

      });


    // Verifica se a palavra está incompleta.

    let status;

    if (
      letrasDigitadas.some((letra) => letra === "")
    ) {

      status = "incomplete";

      incompletas++;

    }

    // Verifica se a palavra está correta.

    else if (
      letrasDigitadas.join("") === palavra.resposta
    ) {

      status = "correct";

      acertos++;

    }

    // Caso contrário, está incorreta.

    else {

      status = "incorrect";

      incorretas++;

    }

    palavra.status = status;

    resultados.push({
      palavra,
      status
    });

    palavra.botaoPista.classList.remove(
      "status-correct",
      "status-incorrect",
      "status-incomplete"
    );

    palavra.botaoPista.classList.add(
      `status-${status}`
    );

    palavra.botaoPista.querySelector(
      ".clue-status"
    ).textContent =
      status === "correct"
        ? "✓"
        : status === "incorrect"
          ? "×"
          : "…";

  });


  // Identifica o estado visual de cada casa.

  const statusDasCelulas = new Map();

  resultados.forEach(({ palavra, status }) => {

    palavra.posicoes.forEach((posicao) => {

      const chave =
        `${posicao.linha}-${posicao.coluna}`;

      const statusAtual =
        statusDasCelulas.get(chave) || [];

      statusAtual.push(status);

      statusDasCelulas.set(chave, statusAtual);

    });

  });

  statusDasCelulas.forEach((statusLista, chave) => {

    const celula =
      celulasPorPosicao.get(chave);

    celula.casa.classList.remove(
      "is-correct",
      "is-incorrect"
    );

    if (statusLista.includes("incorrect")) {

      celula.casa.classList.add("is-incorrect");

    } else if (
      statusLista.every((status) => status === "correct")
    ) {

      celula.casa.classList.add("is-correct");

    }

  });


  atualizarPontuacao(acertos);


  // Mensagem final.

  if (acertos === palavras.length) {

    elementoMensagem.textContent =
      "Parabéns! Todas as palavras estão corretas. Você concluiu a cruzadinha!";

    elementoMensagem.className =
      "game-message is-success";

  } else {

    elementoMensagem.textContent =
      `Conferência concluída: ${acertos} corretas, ${incompletas} incompletas e ${incorretas} incorretas.`;

    elementoMensagem.className =
      incompletas > 0 || incorretas > 0
        ? "game-message is-warning"
        : "game-message";

  }

}


// CONSULE AS RESPOSTAS NO TABULEIRO.

function consultarRespostas() {

  resultadoConferido = true;

  palavras.forEach((palavra) => {

    palavra.posicoes.forEach((posicao) => {

      const celula = celulasPorPosicao.get(
        `${posicao.linha}-${posicao.coluna}`
      );

      if (celula) {

        celula.entrada.value = posicao.letra;

        celula.casa.classList.add("is-correct");

      }

    });

  });

  palavras.forEach((palavra) => {

    palavra.status = "correct";

    palavra.botaoPista.classList.remove(
      "status-correct",
      "status-incorrect",
      "status-incomplete"
    );

    palavra.botaoPista.classList.add(
      "status-correct"
    );

    palavra.botaoPista.querySelector(
      ".clue-status"
    ).textContent = "✓";

  });

  atualizarPontuacao(palavras.length);

  elementoMensagem.textContent =
    "Respostas consultadas. Revise o tabuleiro e confira novamente se precisar.";

  elementoMensagem.className =
    "game-message is-success";

}


// ATUALIZA A PONTUAÇÃO.

function atualizarPontuacao(acertos) {

  elementoPontuacao.textContent =
    `${acertos} de ${palavras.length} palavras corretas`;

  elementoProgresso.style.width =
    `${(acertos / palavras.length) * 100}%`;

}


// REINICIA O JOGO.

function reiniciarJogo() {

  celulasPorPosicao.forEach((celula) => {

    celula.entrada.value = "";

    celula.casa.classList.remove(
      "is-correct",
      "is-incorrect",
      "is-selected"
    );

  });

  palavras.forEach((palavra) => {

    palavra.status = null;

    palavra.botaoPista.classList.remove(
      "is-active",
      "status-correct",
      "status-incorrect",
      "status-incomplete"
    );

    palavra.botaoPista.querySelector(
      ".clue-status"
    ).textContent = "";

    palavra.botaoPista.setAttribute(
      "aria-pressed",
      "false"
    );

  });

  palavraSelecionada = null;

  resultadoConferido = false;

  atualizarPontuacao(0);

  elementoMensagem.textContent =
    "Tabuleiro reiniciado. Selecione uma pista para começar novamente.";

  elementoMensagem.className = "game-message";

}


// INICIA O JOGO.

function iniciarJogo() {

  try {

    validarTabuleiro();

    criarTabuleiro();

    criarListasDePistas();

    atualizarPontuacao(0);

    if (palavras.length < 12) {

      throw new Error(
        "O tabuleiro precisa conter pelo menos 12 palavras."
      );

    }

    elementoMensagem.textContent =
      "Selecione uma pista para começar a preencher o tabuleiro.";

  } catch (erro) {

    elementoMensagem.textContent =
      `Não foi possível iniciar o jogo: ${erro.message}`;

    elementoMensagem.className =
      "game-message is-warning";

    console.error(erro);

  }

}


// EVENTOS DOS BOTÕES.

botaoConferir.addEventListener(
  "click",
  conferirRespostas
);

botaoReiniciar.addEventListener(
  "click",
  reiniciarJogo
);

botaoConsultarRespostas.addEventListener(
  "click",
  consultarRespostas
);


// EXECUTA A INICIALIZAÇÃO.

iniciarJogo();
