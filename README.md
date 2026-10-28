# queenmodas — mostruário de moda

Mostruário feito com React e Vite. A pessoa escolhe produtos, cores, tamanhos e quantidades e envia uma solicitação de reserva pelo WhatsApp — não há compra ou pagamento pelo site.

## Começar

Instale o Node.js e, na pasta do projeto, execute:

```bash
npm install
npm run dev
```

Para gerar a versão de produção, use `npm run build`.

## Configurar o WhatsApp

O site já usa o número `+55 (61) 99516-6613` como destino dos pedidos. Para trocar o contato, copie `.env.example` para `.env` e preencha `VITE_WHATSAPP_NUMBER` com o número comercial, incluindo o código do país e apenas números:

```env
VITE_WHATSAPP_NUMBER=5561995166613
```

Ao escolher o vestido, a cor e o tamanho, clique em “Separar pelo WhatsApp” para revisar a seleção. O botão “Pedir para separar” abre a conversa com a queenmodas e uma mensagem pronta com os nomes dos vestidos, cores, tamanhos, quantidades e valores. A pessoa confirma o envio dentro do WhatsApp.

Depois de alterar `.env`, reinicie `npm run dev`. Se o site estiver publicado, gere o build novamente para aplicar o novo número.

## Atualizar o catálogo

Edite `src/data/products.js`. Cada produto tem nome, categoria, preço, imagem e uma lista `colors`; cada cor tem nome, código hexadecimal (`hex`) e quantidade disponível (`stock`). O catálogo usa as fotos locais dos vestidos 01 a 06, em `public/roupas/`. Os modelos 04 e 05 também têm fotos em preto.

Preencha `price` com o preço em reais (por exemplo, `129.90`) e `stock` com o estoque de cada cor (por exemplo, `5`). Enquanto esses valores forem `null`, o catálogo informa preço a consultar e disponibilidade a confirmar; a seleção e a mensagem pelo WhatsApp continuam funcionando sem apresentar valores zerados.

## Tamanhos disponíveis

Dentro de cada cor, preencha `sizes` com os tamanhos que você tem disponíveis. Use textos, inclusive para tamanhos numéricos:

```js
{
  name: 'Branco',
  hex: '#f2eee7',
  stock: 3,
  sizes: ['P', 'M', 'G'],
  // Mantenha images com as fotos desta cor.
}
```

Você também pode usar `sizes: ['Único']` ou `sizes: ['38', '40', '42']`. Para deixar o tamanho a confirmar pelo WhatsApp, use `sizes: []`.

Quando há tamanhos cadastrados, a pessoa precisa selecionar um antes de separar a peça. O tamanho acompanha a seleção e a mensagem pelo WhatsApp. A mesma peça em tamanhos diferentes aparece em linhas separadas. `stock` continua sendo o estoque total daquela cor, compartilhado entre os tamanhos; a soma das peças selecionadas respeita esse total.

## Fotos de frente e verso por cor

Em cada cor, preencha `images.front` e `images.back` com as URLs das fotos reais. Você também pode colocar os arquivos em `public/roupas/` e usar caminhos como `/roupas/camisa-areia-frente.jpg`:

```js
{
  name: 'Areia',
  hex: '#d8c6a9',
  stock: 5,
  images: {
    front: '/roupas/camisa-areia-frente.jpg',
    back: '/roupas/camisa-areia-verso.jpg',
  },
}
```

Ao passar o mouse pela foto, aparece o verso da cor escolhida; ao sair, volta a frente. Os botões abaixo da imagem também permitem trocar de lado por toque ou teclado. Passar o mouse sobre uma bolinha mostra uma prévia daquela cor; clicar confirma a cor para a seleção pelo WhatsApp.

Todas as cores cadastradas têm fotos de frente e verso. Ao adicionar novas cores, sem uma foto de frente por cor aparece a foto de referência; sem uma foto de verso, o botão “Verso” fica desabilitado. As fotos não são espelhadas nem recoloridas para simular outras vistas. Respeite as letras maiúsculas e minúsculas dos nomes dos arquivos ao preencher os caminhos.
