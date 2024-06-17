// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, './src'),
            },
        ],
    },
});
