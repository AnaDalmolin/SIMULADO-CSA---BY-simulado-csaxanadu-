# Simulado CSA (300 questões)
## Repositório ORIGINAL https://github.com/geporto-dev/simulado-csaxanadu ##

Uma aplicação web **estática** (HTML/CSS/JS) para simulado com 4 blocos de 75 questões. Uma questão por página, sem feedback imediato. No final, calcula acertos, mostra **APROVADO** (≥80%) ou **REPROVADO**, e exibe o **gabarito** (respostas marcadas vs corretas).

## COMO INICIAR:

- <img width="857" height="358" alt="image" src="https://github.com/user-attachments/assets/19209942-083a-4781-92d2-9aa568acfa09" />

## Como executar localmente
1. Faça download de todos os arquivos numa mesma pasta.
2. Clique duas vezes em `index.html` para abrir no navegador (Chrome/Edge/Firefox).

> Dica: por ser site **estático**, não precisa de backend. Os resultados ficam no navegador (localStorage) e somem ao limpar o cache.

## Como publicar gratuitamente

### Opção A — GitHub Pages (100% grátis)
1. Crie um repositório no GitHub.
2. Envie os 4 arquivos (`index.html`, `styles.css`, `script.js`, `questions.json`).
3. Vá em **Settings → Pages** e selecione **Deploy from a branch** (branch `main`, pasta `/root`).
4. Acesse o link gerado (`https://seu-usuario.github.io/nome-do-repo/`).

### Opção B — Netlify (grátis com deploy contínuo)
1. Crie conta no Netlify.
2. Use **Deploy site → Drag & Drop** e arraste a pasta com os arquivos.
3. O site fica online em um subdomínio `.netlify.app`.

### Opção C — Vercel (grátis e simples)
1. Crie conta no Vercel e importe o repositório do GitHub com os arquivos.
2. O deploy sai em minutos num subdomínio `.vercel.app`.

## Personalizações úteis
- **Embaralhar questões**: alterar `sliceBlock()` para embaralhar a lista.
- **Tempo limite**: adicionar um cronômetro e bloquear navegação ao fim.
- **Salvar resultados** (servidor): precisaria de backend (ex.: Firebase/Firestore, Supabase, ou Azure Static Web Apps + Functions).
- **Tema visual**: editar `styles.css` (cores, tipografia, spacing).

## Observações
- Questões com “Choose two/three” viram **checkbox** (multi-seleção) e exigem marcar **todas** as corretas para contar ponto.
- O gabarito final compara as letras selecionadas com as letras corretas (ordem não importa).
