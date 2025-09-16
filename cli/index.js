var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// api.ts
var accessToken = "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";
var getRepoLanguages = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
  const response = await fetch(url, { headers: { "Authorization": `token ${accessToken}` } });
  const result = await response.json();
  return result;
};
var getRepoContents = async (owner, repo, path = "") => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, { headers: { "Authorization": `token ${accessToken}` } });
  const result = await response.json();
  for (const item of result) {
    if (item.type === "dir") {
      item["contents"] = await getRepoContents(owner, repo, item.path);
    }
  }
  return result.map((item) => ({
    name: item.name,
    path: item.path,
    size: item.size,
    downloadUrl: item.download_url,
    type: item.type,
    contents: item.contents || []
  }));
};
var getRepoInfo = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(url, { headers: { "Authorization": `token ${accessToken}` } });
  const { name, description, topics } = await response.json();
  const languages = await getRepoLanguages(owner, repo);
  const contents = await getRepoContents(owner, repo);
  return {
    name,
    description,
    topics,
    languages,
    contents
  };
};

// util.ts
var import_promises = __toESM(require("readline/promises"));
var input = async (prompt) => {
  const r1 = import_promises.default.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const content = await r1.question(prompt);
  r1.close();
  return content;
};

// index.ts
async function main(argv) {
  const repoUrl = argv[argv.length - 1];
  const [_, owner, repo] = /\.com\/(.+)\/(.+)\.git$/.exec(repoUrl);
  const repoInfo = await getRepoInfo(owner, repo);
  while (true) {
    const userInput = await input(">>> ");
    if (userInput === "exit") {
      break;
    }
  }
}
main(process.argv);
