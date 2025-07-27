#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const [, , componentName] = process.argv;
if (!componentName) {
  console.error(
    "Usage: pnpm --filter @kid-bridge/ui create:component <component-name>"
  );
  console.error(
    "Example:   pnpm --filter @kid-bridge/ui create:component MyButton"
  );
  process.exit(1);
}

// created component path: packages/ui/src/components/<component-name>

const componentsRoot = path.join(__dirname, "..", "src", "components");
const baseDir = path.join(componentsRoot, componentName);

if (fs.existsSync(baseDir)) {
  console.error(`Error: '${componentName}' already exist!`);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

const tsx = `"use client"

import type { ${
  componentName[0].toUpperCase() + componentName.slice(1)
}Props } from './${componentName}.types'

export function ${
  componentName[0].toUpperCase() + componentName.slice(1)
}(props: ${componentName[0].toUpperCase() + componentName.slice(1)}Props) {
  return (
    <div>{/* ${componentName} component */}</div>
  )
}
`;
fs.writeFileSync(path.join(baseDir, `${componentName}.tsx`), tsx);

const types = `export interface ${
  componentName[0].toUpperCase() + componentName.slice(1)
}Props {
}
`;
fs.writeFileSync(path.join(baseDir, `${componentName}.types.ts`), types);

const testprops = `import type { ${
  componentName[0].toUpperCase() + componentName.slice(1)
}Props } from './${componentName}.types'

export const ${componentName}TestProps: ${
  componentName[0].toUpperCase() + componentName.slice(1)
}Props = {
}
`;
fs.writeFileSync(
  path.join(baseDir, `${componentName}.testprops.ts`),
  testprops
);

console.log(
  `Success: '${componentName}' component created on 'packages/ui/src/components'`
);
