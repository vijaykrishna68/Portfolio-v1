import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import { remarkContentImages } from './src/app/lib/mdx/remarkContentImages'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
          remarkContentImages,
        ],
      }),
    },
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // motion/react (Hero's tech-cluster animation) is only ever imported from
  // inside the lazy-loaded Home route chunk, so Vite's cold-start dependency
  // scan doesn't discover it until that chunk first loads — which triggers a
  // dev-only re-optimize/reload that otherwise ends up with a duplicate React
  // module instance ("Invalid hook call"). Pre-bundling it explicitly avoids
  // that reload entirely.
  optimizeDeps: {
    include: ['motion/react'],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
