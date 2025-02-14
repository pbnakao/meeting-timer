import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// リポジトリ名を `base` に設定
export default defineConfig({
  plugins: [react()],
  base: "/meeting-timer/",
});
