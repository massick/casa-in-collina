import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        things: resolve(__dirname, "things-to-do.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
