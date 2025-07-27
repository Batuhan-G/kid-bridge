if (!process.env.npm_execpath.includes("pnpm")) {
  console.error("\n❌ just only use pnpm!\n");
  process.exit(1);
}
