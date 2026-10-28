# entrelaço — mostruário de moda

Mostruário feito com React e Vite. A pessoa escolhe produtos, cores e quantidades e envia uma solicitação de reserva pelo WhatsApp — não há compra ou pagamento pelo site.

## Começar

Instale o Node.js e, na pasta do projeto, execute:

```bash
npm install
npm run dev
```

Para gerar a versão de produção, use `npm run build`.

## Configurar o WhatsApp

Copie `.env.example` para `.env` e preencha `VITE_WHATSAPP_NUMBER` com o número comercial, incluindo o código do país e apenas números. Por exemplo:

```env
VITE_WHATSAPP_NUMBER=5511999999999
```

Sem esse valor, o botão abre o WhatsApp com a mensagem pronta para a pessoa escolher o contato.

## Atualizar o catálogo

Edite `src/data/products.js`. Cada produto tem nome, categoria, preço, imagem e uma lista `colors`; cada cor tem nome, código hexadecimal (`hex`) e quantidade disponível (`stock`). As fotos de demonstração são carregadas do Unsplash e podem ser trocadas por URLs das fotos das peças.
