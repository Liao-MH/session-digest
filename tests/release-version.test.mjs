import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const expectedVersion = "v1.0.0";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const version = read("VERSION").trim();
assert(version === expectedVersion, `VERSION must be ${expectedVersion}, got ${version}`);

const packageJson = JSON.parse(read("package.json"));
assert(packageJson.version === expectedVersion.slice(1), "package.json version must match VERSION without the v prefix");

for (const file of ["README.md", "docs/CHANGELOG.md", "docs/DEMANDS.MD"]) {
  assert(read(file).includes(expectedVersion), `${file} must mention ${expectedVersion}`);
}

const skill = read("SKILL.md");
const frontmatterMatch = skill.match(/^---\n([\s\S]*?)\n---\n/);
assert(frontmatterMatch, "SKILL.md must start with YAML frontmatter");

const frontmatter = frontmatterMatch[1];
assert(/^name:\s*session-digest$/m.test(frontmatter), "SKILL.md frontmatter must name the skill session-digest");
assert(/^description:\s*Use when /m.test(frontmatter), "SKILL.md description must start with 'Use when'");
assert(frontmatter.length <= 1024, "SKILL.md frontmatter must stay within the 1024-character skill metadata limit");

console.log(`release metadata verified for ${expectedVersion}`);
