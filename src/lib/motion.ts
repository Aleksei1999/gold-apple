// framer-motion не читает CSS-переменные: держим здесь те же кривые, что в tokens.css
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = { fast: 0.16, base: 0.32, slow: 0.7 };
