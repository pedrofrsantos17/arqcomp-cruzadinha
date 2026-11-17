# Cruzadinha de Arquitetura Computacional

Jogo educacional desenvolvido para a atividade avaliativa de Arquitetura Computacional da SPTech School. O objetivo é praticar conceitos da disciplina por meio de pistas horizontais e verticais.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (Vanilla JavaScript)

O projeto não utiliza servidor, banco de dados, bibliotecas ou dependências externas. Basta abrir `index.html` em um navegador.

## Como jogar

1. Abra o arquivo `index.html`.
2. Selecione uma pista na lista de horizontais ou verticais.
3. Digite uma letra por casa. As letras são convertidas para maiúsculas.
4. Use as setas do teclado para navegar e `Backspace` para apagar.
5. Clique em **Conferir respostas** para verificar palavras certas, erradas e incompletas.
6. Clique em **Reiniciar** para limpar o tabuleiro.

## Palavras utilizadas e pistas

As pistas têm no máximo 15 palavras e foram redigidas para descrever o conceito sem apresentar a resposta por extenso.

| Nº | Direção | Resposta | Pista |
|---:|---|---|---|
| 1 | Vertical | FLASH | Memória não volátil apagada e regravada em blocos, comum em cartões e unidades de armazenamento. |
| 2 | Horizontal | UC | Bloco do processador que interpreta instruções e coordena sinais internos. |
| 3 | Vertical | CPU | Componente central que executa instruções e coordena o funcionamento do computador. |
| 4 | Vertical | EEPROM | Memória não volátil que permite apagar e regravar dados eletricamente, geralmente byte a byte. |
| 5 | Horizontal | DATABUS | Conjunto de linhas que transporta valores entre o processador, a memória e periféricos. |
| 6 | Vertical | ADDRESSBUS | Conjunto de linhas que indica a posição de memória ou dispositivo acessado. |
| 7 | Horizontal | DUALCORE | Processador que possui dois núcleos capazes de executar tarefas. |
| 8 | Horizontal | CACHE | Memória rápida que guarda cópias de dados usados com frequência. |
| 9 | Vertical | ULA | Parte responsável por cálculos e operações lógicas dentro do processador. |
| 10 | Horizontal | REGISTRADORES | Pequenos espaços internos que guardam valores temporários durante o processamento. |
| 11 | Horizontal | QUADCORE | Processador que possui quatro núcleos capazes de executar tarefas. |
| 12 | Vertical | DMA | Recurso que transfere dados entre memória e periféricos com pouca intervenção do processador. |
| 13 | Vertical | ROM | Memória cujo conteúdo é gravado previamente e consultado pelo processador durante a execução. |
| 14 | Horizontal | RAM | Memória principal e volátil que mantém temporariamente programas e dados em execução. |

Foram utilizadas **14 das 16 palavras** oferecidas na atividade. `MEMORIADEMASSA` e `MICROCONTROLADOR` ficaram de fora para manter uma matriz compacta e legível, sem comprometer a exigência mínima de 12 palavras.

## Planejamento do tabuleiro

- Dimensões: **13 linhas × 13 colunas**.
- Distribuição: **7 palavras horizontais e 7 verticais**.
- As coordenadas abaixo começam em 1 (linha 1 e coluna 1 são o canto superior esquerdo).
- Todas as palavras cruzam pelo menos uma outra palavra, usando a mesma letra na casa compartilhada.

| Nº | Resposta | Direção | Início (linha, coluna) | Cruzamentos principais |
|---:|---|---|---|---|
| 1 | FLASH | Vertical | (1, 3) | DATABUS: A em (3, 3) |
| 2 | UC | Horizontal | (1, 6) | CPU: C em (1, 7) |
| 3 | CPU | Vertical | (1, 7) | UC: C em (1, 7); DATABUS: U em (3, 7) |
| 4 | EEPROM | Vertical | (2, 11) | DUALCORE: R em (5, 11) |
| 5 | DATABUS | Horizontal | (3, 2) | FLASH: A em (3, 3); ADDRESSBUS: A em (3, 5); CPU: U em (3, 7) |
| 6 | ADDRESSBUS | Vertical | (3, 5) | DATABUS: A; DUALCORE: D; CACHE: E; REGISTRADORES: S; QUADCORE: U |
| 7 | DUALCORE | Horizontal | (5, 5) | ADDRESSBUS: D em (5, 5); EEPROM: R em (5, 11) |
| 8 | CACHE | Horizontal | (7, 1) | ADDRESSBUS: E em (7, 5) |
| 9 | ULA | Vertical | (7, 8) | REGISTRADORES: A em (9, 8) |
| 10 | REGISTRADORES | Horizontal | (9, 1) | ADDRESSBUS: S em (9, 5); ULA: A em (9, 8) |
| 11 | QUADCORE | Horizontal | (11, 4) | ADDRESSBUS: U em (11, 5); DMA: D em (11, 7); ROM: R em (11, 10) |
| 12 | DMA | Vertical | (11, 7) | QUADCORE: D em (11, 7); RAM: A em (13, 7) |
| 13 | ROM | Vertical | (11, 10) | QUADCORE: R em (11, 10) |
| 14 | RAMgit