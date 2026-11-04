# O Encontro · Livia Barros

Landing page da imersão **O Encontro**, criada a partir do convite em PDF e da identidade visual da marca.

## Como publicar

É um site estático (HTML, CSS e JS puros, sem etapa de build). Qualquer hospedagem estática serve:

- **GitHub Pages:** Settings > Pages > Branch `main`, pasta `/ (root)`.
- **Vercel / Netlify / Cloudflare Pages:** importar o repositório, sem comando de build, diretório de saída `/`.

Para testar localmente:

```bash
python3 -m http.server 4500
# abrir http://localhost:4500
```

## Estrutura

```
index.html            página
css/scrollcraft.css   motor de scroll (não editar)
css/site.css          identidade, tipografia, layout e animações da página
js/scrollcraft.js     motor de scroll: pins, cues, parallax, revelações (não editar)
js/site.js            peças autorais: luz da janela, abertura do convite,
                      encontro dos círculos, sol do fim de semana, jardim vivo
assets/bg             papéis, camadas de sombra de eucalipto, jardim 4K
assets/botanic        eucalipto e flores em WebP com transparência
assets/img            fotos (Livia, Luciana, fazenda, práticas)
assets/brand          logo vetorizada, favicon, imagem de compartilhamento
assets/fonts          Cormorant Garamond
pdf/                  convite em PDF (horizontal e vertical para celular)
docs/BRIEF.md         direção criativa
```

## Identidade

| Cor | Hex | Uso |
|---|---|---|
| Rosé | `#E2C2BC` | fundos, cartões |
| Malva | `#8B676D` | fundos de destaque, botão |
| Marfim | `#F6EBDF` | fundos, papelaria |
| Sálvia | `#9DA57D` | detalhes, eucalipto |
| Malva profundo | `#4F3A41` | texto corrido (contraste AA) |
| Malva de título | `#74545B` | títulos |

Tipografia: Cormorant Garamond em itálico leve para títulos e versaletes espaçados para rótulos.

## Movimento

- **Luz da janela:** as sombras de eucalipto balançam com o vento e se deslocam no sentido oposto ao cursor.
- **Abertura do convite:** o cartão sobe, o envelope desce e os galhos se afastam conforme o scroll.
- **Desejo:** as palavras entram uma a uma com a seção fixa.
- **O que é:** os dois círculos se aproximam até se encontrarem.
- **Você vai viver:** o sol percorre o fim de semana e acende cada momento.
- **Prática:** colagem em quatro profundidades de parallax.
- **Fechamento:** o jardim vivo, com luz entrando, névoa, pólen, pétalas caindo e um galho fora de foco balançando no primeiro plano.

Tudo respeita `prefers-reduced-motion`. No celular, as seções densas viram fluxo normal e o texto ganha corpo maior.

## Inscrição

Todos os botões "Faça sua inscrição" levam ao formulário: https://forms.gle/t1J1A9PNN9pEV6XH6
