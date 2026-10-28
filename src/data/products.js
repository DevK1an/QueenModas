// Edite price com o preço em reais e stock com o estoque total de cada cor.
// Em sizes, informe os tamanhos disponíveis: ['P', 'M', 'G'] ou ['Único'].
// As aspas são obrigatórias: use ['M'] e ['G'], nunca [M] ou [G].
// Deixe sizes: [] enquanto os tamanhos não estiverem confirmados.
// Deixe null para mostrar "a consultar" em vez de um valor ainda não confirmado.
export const products = [
  {
    id: 'vestido-modelo-sereia',
    name: 'Vestido modelo sereia',
    category: 'Roupas',
    price: 70.00,
    image: '/roupas/vestido_01_frente.jpg',
    imageAlt: 'Vestido branco longo de alças finas e barra com babado, frente',
    colors: [
      {
        name: 'Branco',
        hex: '#f2eee7',
        stock: 1,
        sizes: ['M'],
        images: {
          front: '/roupas/vestido_01_frente.jpg',
          back: '/roupas/vestido_01_verso.jpg',
        },
      },
    ],
  },
  {
    id: 'vestido-longo',
    name: 'Vestido Longo',
    category: 'Roupas',
    price: 80.00,
    image: '/roupas/vestido_02_frente.jpg',
    imageAlt: 'Vestido branco longo com recortes na cintura e saia fluida, frente',
    colors: [
      {
        name: 'Branco',
        hex: '#f2eee7',
        stock: 1,
        sizes: ['M'],
        images: {
          front: '/roupas/vestido_02_frente.jpg',
          back: '/roupas/vestido_02_verso.jpg',
        },
      },
    ],
  },
  {
    id: 'vestido-curto-colado',
    name: 'Vestido Curto Colado',
    category: 'Roupas',
    price: 35.00,
    image: '/roupas/vestido_03_frente.jpg',
    imageAlt: 'Vestido branco curto sem alças, com detalhe dourado e recorte, frente',
    colors: [
      {
        name: 'Branco',
        hex: '#f2eee7',
        stock: 35.00,
        sizes: ['Único'],
        images: {
          front: '/roupas/vestido_03_frente.jpg',
          back: '/roupas/vestido_03_verso.jpg',
        },
      },
      {
        name: 'Vermelho',
        hex: '#ff0000',
        stock: 1,
        sizes: ['G'],
        images: {
          front: '/roupas/vestido_03_vermelho_frente.png',
          back: '/roupas/vestido_03_vermelho_verso.png',
        },
      },
    ],
  },
  {
    id: 'vestido-colado-sereia',
    name: 'Vestido Colado Sereia',
    category: 'Roupas',
    price: 65.00,
    image: '/roupas/vestido_04_frente.jpg',
    imageAlt: 'Vestido branco midi de alças finas, com recorte e fenda, frente',
    colors: [
      {
        name: 'Branco',
        hex: '#f2eee7',
        stock: 1,
        sizes: ['G'],
        images: {
          front: '/roupas/vestido_04_frente.jpg',
          back: '/roupas/vestido_04_verso.jpg',
          backCrop: { left: 60, width: 682, height: 1365 },
        },
      },
      {
        name: 'Preto',
        hex: '#282727',
        stock: 1,
        sizes: ['G'],
        images: {
          front: '/roupas/vestido_04_frente_preto.png',
          back: '/roupas/vestido_04_verso_preto.png',
        },
      },
    ],
  },
  {
    id: 'vestido-curto-ombro-so',
    name: 'Vestido curto Colado',
    category: 'Roupas',
    price: 45.00,
    image: '/roupas/vestido_05_frente.jpg',
    imageAlt: 'Vestido branco curto de um ombro só, com babado lateral, frente',
    colors: [
      {
        name: 'Branco',
        hex: '#f2eee7',
        stock: 1,
        sizes: ['Único'],
        images: {
          front: '/roupas/vestido_05_frente.jpg',
          back: '/roupas/vestido_05_verso.jpg',
        },
      },
      {
        name: 'Preto',
        hex: '#282727',
        stock: 1,
        sizes: ['Único'],
        images: {
          front: '/roupas/vestido_05_frente_preto.png',
          back: '/roupas/Vestido_05_verso_preto.png',
        },
      },
    ],
  },
  {
    id: 'vestido-colado-laco',
    name: 'Vestido Colado com Laço',
    category: 'Roupas',
    price: 40.00,
    image: '/roupas/vestido_06_frente.jpg',
    imageAlt: 'Vestido branco curto sem alças, com laço no busto, frente',
    colors: [
      {
        name: 'Branco',
        hex: '#f2eee7',
        stock: 1,
        sizes: ['Único'],
        images: {
          front: '/roupas/vestido_06_frente.jpg',
          back: '/roupas/vestido_06_verso.jpg',
        },
      },
    ],
  },
];
