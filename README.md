# TechMentor Site

Página "Seja nosso parceiro" do TechMentor: apresenta o programa para instituições, ONGs e criadores de conteúdo e tem o formulário de pedido de parceria, que chega à fila da equipe pela API.

É um site **estático** (HTML, CSS e um JavaScript pequeno), sem instalar nada para rodar e sem etapa de build. Serve direto no GitHub Pages.

```
index.html          a página (textos, formulário)
privacidade.html    política de privacidade (rascunho: revisar com o jurídico antes de divulgar)
css/estilo.css      identidade visual (mesmas cores e fontes do app e do portal)
js/config.js        ENDEREÇOS: API, portal, e-mail da equipe  <- o único arquivo que você muda ao publicar
js/formulario.js    validação e envio do pedido
fonts/ img/         fontes e logo (tudo local, sem chamar serviços de fora)
```

## Ver no computador

O formulário chama a API, então ela precisa estar no ar. Em uma janela, na pasta do site:

```bash
npx serve -l 5500
```

Abra `http://localhost:5500`. Para o navegador deixar a página chamar a API, suba a API com esse endereço liberado no CORS (PowerShell, antes de iniciar a API):

```powershell
$env:CORS_ORIGENS = "http://localhost:5173,http://localhost:5500"
```

O `js/config.js` já aponta para `http://localhost:8080/techmentor/api`.

## Publicar no GitHub Pages

1. No GitHub, repositório → **Settings → Pages**. Em *Build and deployment*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
2. O endereço sai como `https://devapps2.github.io/TechMentor-Site/` (o GitHub mostra na própria tela).
3. Edite `js/config.js` com os endereços **de produção**:
   - `API_URL`: a API com **https** (uma página https não consegue chamar uma API http);
   - `PORTAL_URL`: onde o portal das parceiras estiver publicado.
4. Na API, libere o endereço do site no CORS. Só a origem, sem o caminho: `CORS_ORIGENS=https://devapps2.github.io` (junto dos outros, separados por vírgula).

Observação: no GitHub Pages grátis o repositório precisa ser **público**.

## Antes de divulgar

- [ ] A API tem endereço público fixo com https.
- [ ] `js/config.js` com os endereços reais.
- [ ] O texto da `privacidade.html` foi revisado por quem cuida da parte jurídica (nome da entidade responsável, prazo de guarda, canal do encarregado). Ao mudar o texto, mude `VERSAO_POLITICA` no `js/config.js`.
- [ ] Um pedido de teste chegou à fila da administradora e os e-mails saíram.

## Como o formulário funciona

Envia `POST /parceiras/pedidos` (rota pública). Há um campo escondido (`website`) que serve de armadilha para robôs: pessoas não o veem e não preenchem. A resposta de sucesso é sempre a mesma, exista ou não o e-mail no sistema, por isso a tela de confirmação não promete que uma conta foi criada. O contrato completo está em `backend/docs/contrato-pedidos-de-parceria.md` do repositório do TechMentor.
