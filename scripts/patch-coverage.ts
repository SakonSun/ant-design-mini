import * as path from 'path';
import * as fs from 'node:fs/promises';

(async () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  const coveragePath = path.resolve(
    __dirname,
    '..',
    'coverage/coverage-final.json'
  );

  const coverageInfo = JSON.parse(await fs.readFile(coveragePath, 'utf-8'));

  Object.keys(coverageInfo).filter((key) => {
    if (key.includes('ant-design-mini/node_modules')) {
      delete coverageInfo[key];
    }
    if (key.includes('ant-design-mini/ scripts')) {
      delete coverageInfo[key];
    }
  });

  await fs.writeFile(coveragePath, JSON.stringify(coverageInfo, null, 2));
})();
