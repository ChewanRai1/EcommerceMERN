// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import fs from "fs";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "localhost",
//     port: 5173, // Change to any available port if needed
//     https: {
//       key: fs.readFileSync("../server-app/ssl/server.key"), // Use the same SSL certificate
//       cert: fs.readFileSync("../server-app/ssl/server.cert"),
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import javascriptObfuscator from "rollup-plugin-javascript-obfuscator";

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    sourcemap: false, // ❌ Prevents source code exposure
    minify: "terser", // ✅ Ensures proper minification
    esbuild: {
      minify: true, // ✅ Removes unnecessary debug files
      drop: ["console", "debugger"], // ✅ Removes console logs
    },
    rollupOptions: {
      plugins: [
        javascriptObfuscator({
          compact: true, // ✅ Minifies the output
          controlFlowFlattening: true, // ✅ Makes it harder to reverse-engineer
          deadCodeInjection: true, // ✅ Adds fake code for confusion
          debugProtection: true, // ✅ Prevents DevTools debugging
          disableConsoleOutput: true, // ✅ Removes all console logs
          identifierNamesGenerator: "hexadecimal", // ✅ Makes variable names unreadable
        })
      ]
    }
  },
  server: {
    host: "localhost",
    port: 5173,
    https: {
      key: fs.readFileSync("../server-app/ssl/server.key"),
      cert: fs.readFileSync("../server-app/ssl/server.cert"),
    },
  },
});
