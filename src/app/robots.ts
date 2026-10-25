import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// концепт редизайна чужой пекарни: в поиск не пускаем
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
