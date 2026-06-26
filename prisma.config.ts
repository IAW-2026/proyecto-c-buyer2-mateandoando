import { defineConfig } from 'prisma/config'

try { process.loadEnvFile('.env.local') } catch {}

export default defineConfig({
    datasource: {
      url: process.env.DIRECT_URL!,
    },
})