#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [,, componentName] = process.argv;
if (!componentName) {
  console.error('Kullanım: node create-component.js <component-ismi>');
  process.exit(1);
}

const baseDir = path.join(__dirname, componentName);
if (fs.existsSync(baseDir)) {
  console.error('Bu isimde bir klasör zaten var!');
  process.exit(1);
}
fs.mkdirSync(baseDir);

// component.tsx
const tsx = `"use client"

import type { ${componentName[0].toUpperCase() + componentName.slice(1)}Props } from './${componentName}.types'

export function ${componentName[0].toUpperCase() + componentName.slice(1)}(props: ${componentName[0].toUpperCase() + componentName.slice(1)}Props) {
  return (
    <div>{/* ${componentName} component */}</div>
  )
}
`;
fs.writeFileSync(path.join(baseDir, `${componentName}.tsx`), tsx);

// component.types.ts
const types = `export interface ${componentName[0].toUpperCase() + componentName.slice(1)}Props {
  // props tanımla
}
`;
fs.writeFileSync(path.join(baseDir, `${componentName}.types.ts`), types);

// component.testprops.ts
const testprops = `import type { ${componentName[0].toUpperCase() + componentName.slice(1)}Props } from './${componentName}.types'

export const ${componentName}TestProps: ${componentName[0].toUpperCase() + componentName.slice(1)}Props = {
  // örnek props
}
`;
fs.writeFileSync(path.join(baseDir, `${componentName}.testprops.ts`), testprops);

console.log(`${componentName} component klasörü ve dosyaları oluşturuldu!`); 