import type { MetadataRoute } from 'next';
import { site } from '@/site.config';

export const dynamic = 'force-static';

const routes = ['/', '/privacy/'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() }));
}
