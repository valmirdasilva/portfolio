# Daniela Dalberto · Advogada — site institucional (demonstração)

Site estático premium para prospecção. HTML + CSS + JS puros, sem framework, sem build, sem dependências externas de runtime. Fontes e imagens são todas locais.

## Publicar no GitHub Pages
1. Suba o conteúdo desta pasta para um repositório.
2. Settings → Pages → Branch: `main` / root.
3. `index.html` é a página inicial.

## Estrutura
- `index.html` — marcação, SEO (title/description/OG/Twitter), JSON-LD `Attorney`.
- `styles.css` — design system (paleta espresso/ouro/marfim, tipografia Cormorant Garamond + Jost).
- `script.js` — header dinâmico, menu mobile, scroll reveal, formulário → WhatsApp, voltar ao topo.
- `assets/` — logo, retrato, fotos do escritório (comprimidas) e fontes `.woff2` locais.

## Ajustes rápidos
- WhatsApp: variável `WHATS` no topo de `script.js` e links `wa.me/...` no HTML.
- Endereço/telefones: seção `#contato`, rodapé e bloco JSON-LD.

Total ~496 KB. Acessível (skip-link, foco visível, `prefers-reduced-motion`).
