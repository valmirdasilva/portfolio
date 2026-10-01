# Portfólio — Valmir da Silva

Site estático (HTML/CSS/JS puro, sem build) para GitHub Pages.
Serve como portfólio **e** currículo, com uma segunda página direta pra mandar
pra cliente. Estética: clean, clara, direta — fundo quase branco, acento verde
oliva + vermelho-tijolo só na ação principal, Oswald nos títulos, Work Sans no
corpo. (A versão anterior, side-scroller cyberpunk em pixel, está arquivada em
`arquivo-cyberpunk/` — ver abaixo.)

Sem bibliotecas externas. Fontes via Google Fonts (Oswald, Work Sans).
Tudo degrada com `prefers-reduced-motion`.

## Estrutura

```
index.html              portfólio completo (hero, serviços, skills, método, projetos, contato)
cliente.html            versão curta e direta — pra mandar num DM/proposta
case.html               apresentação de um projeto — lê ?p=<slug> (ainda no visual cyberpunk)
css/clean.css           estilos do index.html e cliente.html
js/clean.js             menu móvel, configurador de escopo, reveal
css/style.css + js/main.js   usados só pelo case.html (visual antigo)
assets/projetos/        thumbnails dos cases (.jpg)

arquivo-cyberpunk/      versão anterior do index.html (side-scroller em pixel), guardada

<pasta-do-cliente>/     cada case reformulado, site completo:
  Carolina-Guaragna-main/
  cleo-ribeiro-main/
  Daniela-dalberto-main/
  formato-contabil-main/
  buriti-garden-main/
```

`cliente.html` é a página pra mandar direto pra um prospect: pitch curto, o que
resolve, 3 projetos de prova e um CTA. `index.html` é o portfólio completo, com
skills, método e os 6 projetos. Os dois levam pro mesmo `case.html`.

`case.html` embute a pasta do cliente num `<iframe>` dentro de uma moldura de
navegador (modo desktop/mobile) + lista "o que foi feito". Os slugs e textos
ficam no objeto `P` dentro de `case.html`.

## Arquivos pesados (fora do deploy)

- `Catalogo-Faria-Leather-2026.pdf` (47 MB) — no `.gitignore`. Comprimir antes de usar.
- `buriti-garden-main/img/` (originais em PNG, ~480 MB) — **já removido**; o site
  usa só `buriti-garden-main/assets/img/` (~18 MB). Não recriar essa pasta.

## Rodar localmente

XAMPP: `http://localhost/Portfólio/`. (Abrir via `file://` bloqueia as fontes
self-hosted dos iframes dos cases por CORS — só um aviso de console, some no https.)

## Publicar no GitHub Pages

Repositório: **valmirdasilva/portfolio** → sai em `https://valmirdasilva.github.io/portfolio/`.

1. `git init`, commit e push para o repositório.
2. **Settings → Pages** → branch `main`, pasta `/ (root)`.
3. `.nojekyll` já está presente (evita o Jekyll ignorar pastas).

O README do perfil (`valmirdasilva/valmirdasilva`) fica em `github-perfil/README.md`
(fora deste deploy, no `.gitignore`) — é markdown puro, não depende deste repo.

