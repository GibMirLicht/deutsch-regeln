// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { APPLY_SETTINGS_SCRIPT } from './src/lib/settings.ts';

// GitHub Pages serves the site under /deutsch-regeln/: every internal link
// must go through `base` (import.meta.env.BASE_URL), never a root-absolute path.
export default defineConfig({
  site: 'https://gibmirlicht.github.io',
  base: '/deutsch-regeln',
  integrations: [
    starlight({
      title: 'Deutsch-Regeln',
      description: 'Справочник по грамматике немецкого языка, уровни A1–C1.',
      // Single Russian root locale: Starlight UI strings come from its built-in `ru` translation.
      defaultLocale: 'root',
      locales: {
        root: { label: 'Русский', lang: 'ru' },
      },
      head: [
        // The site is public by link but must not be indexed.
        { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } },
        // Apply saved display settings (e.g. hidden translations) before the page paints.
        { tag: 'script', content: APPLY_SETTINGS_SCRIPT },
      ],
      // The rule tree replaces the sidebar; no "On this page" list (owner, 2026-11-22).
      tableOfContents: false,
      components: {
        Sidebar: './src/components/overrides/Sidebar.astro',
        PageTitle: './src/components/overrides/PageTitle.astro',
        Search: './src/components/overrides/Search.astro',
      },
      customCss: ['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/GibMirLicht/deutsch-regeln' },
      ],
    }),
  ],
});
