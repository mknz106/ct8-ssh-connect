import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import vercel from '@astrojs/vercel/serverless'

const adapter = () => {
  if (process.env.VERCEL) {
    return vercel()
  } else {
    return node({
      mode: 'standalone'
    })
  }
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: adapter(),
  server: {
    host: '0.0.0.0'
  }
})
