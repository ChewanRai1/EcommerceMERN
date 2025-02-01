import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173, // Change to any available port if needed
    https: {
      key: fs.readFileSync("../server-app/ssl/server.key"), // Use the same SSL certificate
      cert: fs.readFileSync("../server-app/ssl/server.cert"),
    },
  },
});
