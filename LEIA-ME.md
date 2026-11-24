# Pretty Suspects — site de apresentação (A2)

Site interativo do projeto **Pretty Suspects — Case 001: The Last Party**, com 18 capítulos, modo apresentação para o projetor, votação da turma e revelação final protegida contra spoiler.

## Como abrir

- **Pelo link do Claude** (versão publicada): abre em qualquer navegador.
- **Pelo computador**: dê dois cliques em `index.html` (Chrome recomendado). Precisa de internet só para carregar as fontes; sem internet, o site funciona com fontes substitutas.

## Arquivos

```
SITE/
├── index.html   → estrutura e visual (cores e fontes no topo, em :root)
├── data.js      → TODO o conteúdo: textos, personagens, cartas, evidências, imagens
├── app.js       → funcionamento (não precisa mexer)
└── assets/      → imagens, separadas por pasta
    ├── personagens/   agatha.jpg, tina.jpg, laila.jpg, alice.jpg
    ├── moodboard/     moodboard do grupo
    ├── referencias/   26 referências visuais
    ├── logo/          logo oficial (a enviar)
    ├── cartas/        frente e verso das 5 cartas (a enviar)
    ├── mockups/       mockups do produto (a enviar)
    ├── embalagem/     frente, verso, interior (a enviar)
    ├── bastidores/    fotos do processo (a enviar)
    ├── materializacao/ fotos das cartas impressas (a enviar)
    ├── evidencias/    fotos das evidências, se houver
    └── integrantes/   fotos reais das integrantes, se quiserem
```

## Como trocar ou inserir uma imagem

1. Salve a imagem na pasta certa dentro de `assets/` (JPG ou PNG, até ~2000 px de largura).
2. Abra `data.js` num editor de texto (TextEdit em modo texto simples, VS Code etc.).
3. Procure o item e escreva o caminho entre aspas. Exemplo para a frente da carta 01:

   ```js
   front: "assets/cartas/card-01-frente.jpg",
   ```

4. Salve e recarregue a página. Campo vazio (`""`) = o site mostra um espaço reservado.

Nomes sugeridos: `card-01-frente.jpg`, `card-01-verso.jpg` … `card-05-frente.jpg`; `embalagem-fechada.jpg`; `mockup-cartas-juntas.jpg`; `logo-principal.png`.

**Atenção:** se um mockup mostrar a frente da carta 05, marque `spoiler: true` nele. A imagem fica borrada até a revelação.

## Como editar textos

Tudo está em `data.js`, com comentários em português. Mantenha as aspas e as vírgulas do fim das linhas. Campos marcados **A PREENCHER** aparecem como avisos rosa tracejados quando “Pendências” está ligado (menu **INDEX**). No modo apresentação, os avisos somem.

A revelação final fica no arquivo `segredo.js`, **codificada**, para que ninguém leia a resposta abrindo o código do site no GitHub. Para ver ou editar, abram `ferramentas/editar-segredo.html` no computador do grupo, editem o texto e baixem o novo `segredo.js` para substituir o antigo. A pasta `ferramentas/` não vai para o GitHub. Não abram essa ferramenta na frente da turma.

## Modo apresentação

Botão **PRESENTATION MODE** (na abertura) ou **Presentation** (no topo).

| Tecla | Ação |
|---|---|
| → ou espaço | avança (etapa interna ou próximo capítulo) |
| ← | volta |
| M | menu rápido de capítulos |
| F | liga/desliga tela cheia |
| Esc | sai do modo apresentação |

Os controles discretos ficam no rodapé e quase somem quando o mouse fica parado. No celular/tablet, deslize para os lados.

Capítulos longos são divididos em etapas (os pontinhos no rodapé mostram quantas). Exemplos: em **Meet the Girls**, cada → abre a ficha de uma personagem; em **The Cards**, cada → mostra uma carta; em **The Evidence**, cada → abre uma evidência.

## Votação (capítulo 15 — Who Did It?)

1. Opcional: conte as mãos levantadas e use **+ / −** em “Contagem da turma”. **Usar a mais votada** marca a suspeita com mais votos (em caso de empate, escolham manualmente).
2. Toque na suspeita acusada e, se quiserem, escrevam a justificativa.
3. **LOCK THE ACCUSATION** registra a acusação.

Tudo fica salvo só no computador da apresentação. Nada é enviado pela internet e ninguém precisa de cadastro ou celular.

## Revelação final (capítulo 16)

- Fica lacrada até a acusação ser travada. Antes disso, o capítulo aparece como **CLASSIFIED** e não abre pelo menu.
- Depois de travar, toque em **Abrir a revelação** e **segure o botão por 1,5 segundo** para confirmar. Soltar antes cancela.
- A revelação abre em tela cheia, etapa por etapa (→): frase, a assassina, motivo, reconstrução, pistas, carta 05 e o resultado da turma (**CASE SOLVED** ou **YOU TRUSTED THE WRONG GIRL**).
- Para jogar de novo: menu **INDEX → Reiniciar investigação** (ou o botão no capítulo final). Isso apaga a acusação e lacra a revelação outra vez.

Dica: façam um ensaio antes da aula e cliquem em **Reiniciar investigação** no fim, para a turma encontrar tudo lacrado.

## Publicar / levar para outro computador

- **Pendrive / outro computador:** copie a pasta `SITE` inteira e abra `index.html`.
- **Link do Claude:** a versão publicada é uma cópia. Quando mudarem algo em `data.js` ou nas imagens, peçam para o Claude publicar de novo no mesmo link.
- **GitHub Pages:** esta pasta é um repositório do GitHub (`pretty-suspects`) publicado no GitHub Pages. Para atualizar o site depois de trocar imagens ou textos, rode no Terminal, dentro da pasta `SITE`:

  ```
  git add -A && git commit -m "Atualiza o site" && git push
  ```

  Em um ou dois minutos o link do GitHub Pages mostra a nova versão. Também podem pedir para o Claude fazer isso.
