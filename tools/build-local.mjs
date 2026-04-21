import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const packageJson = JSON.parse(
    readFileSync(path.join(repoRoot, "package.json"), "utf8")
);

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const requiredFiles = ["module.json"];
for (const fileName of requiredFiles) {
    const source = path.join(repoRoot, fileName);
    if (!existsSync(source)) {
        throw new Error(`Missing required file: ${source}`);
    }
    cpSync(source, path.join(distDir, fileName));
}

const distModuleJsonPath = path.join(distDir, "module.json");
const distModuleJson = JSON.parse(readFileSync(distModuleJsonPath, "utf8"));
distModuleJson.version = packageJson.version;
writeFileSync(
    distModuleJsonPath,
    `${JSON.stringify(distModuleJson, null, 2)}\n`,
    "utf8"
);

const optionalFiles = ["README.md", "LICENSE", "LICENSE.md", "changelog.md"];
for (const fileName of optionalFiles) {
    const source = path.join(repoRoot, fileName);
    if (existsSync(source)) {
        cpSync(source, path.join(distDir, fileName));
    }
}

const optionalDirs = ["assets", "lang", "scripts", "packs", "templates", "styles"];
for (const dirName of optionalDirs) {
    const source = path.join(repoRoot, dirName);
    if (existsSync(source)) {
        cpSync(source, path.join(distDir, dirName), { recursive: true });
    }
}

console.log(`Built traits dist at ${distDir}`);
