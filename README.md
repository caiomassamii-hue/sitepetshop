# Site do Petshop

Site estático em HTML + CSS + JS puro. Basta abrir `index.html` ou hospedar a pasta em qualquer servidor estático.

## O que trocar primeiro

Use "localizar e substituir" em todos os `.html`:

| Procurar | Trocar por |
|---|---|
| `Joca Burguer` | nome do petshop (o logo no header/footer usa `<span>JOCA</span> BURGUER`, com a 1ª palavra em dourado) |
| `5511999999999` | seu WhatsApp com DDI+DDD (só números) |
| `(11) 99999-9999` / `+5511999999999` | telefone real |
| `contato@seupetshop.com.br` | e-mail real |
| `Rua Exemplo, 123 …` | endereço real (também no JSON-LD do `index.html`) |
| `www.seupetshop.com.br` | domínio real (canonical, Open Graph, JSON-LD) |

Também revise: horários, números da faixa de destaque (`2.000+`, `10`, `98%`), preços em `servicos.html`, nomes da equipe e depoimentos (são exemplos).

## Cores e tipografia

No topo de `css/style.css`, bloco `:root`. Mudar `--c-accent` troca o dourado em todo o site.

## Imagens

As imagens usam `placehold.co`. Coloque suas fotos em `img/` e troque os `src`:
- Hero: 1100×800 · Equipe: 480×600 · Galeria: 600×600 · Serviços: 800×600 · Depoimento: 1100×700
- Fundo do formulário: atributo `style="background-image:..."` da `<section id="agendar">`.
- Mapa: troque a imagem por um `<iframe>` do Google Maps se preferir.
- Sempre escreva um `alt` descritivo.

## Estrutura

```
index.html  servicos.html  contato.html
css/style.css   js/main.js   img/
```

O formulário valida os campos e abre o WhatsApp com a mensagem pronta (não há back-end).
