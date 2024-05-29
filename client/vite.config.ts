import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		Pages({
			dirs: 'pages'
		})
	],
	build: {
		assetsInlineLimit: 0,
		emptyOutDir: true,
		outDir: './build/____'
	},
	resolve: {
		alias: { '@/': './' }
	},
	envDir: '../'
})
