const input = document.querySelector("#markdown-input");
const sampleButton = document.querySelector("#sample-button");
const clearButton = document.querySelector("#clear-button");
const copyButton = document.querySelector("#copy-button");
const copyFeedback = document.querySelector("#copy-feedback");

const counters = {
  characters: document.querySelector("#character-count"),
  compact: document.querySelector("#compact-count"),
  chinese: document.querySelector("#chinese-count"),
  words: document.querySelector("#word-count"),
  lines: document.querySelector("#line-count"),
};

const sampleText = `# 周末阅读计划

今天准备读几章书，然后记录一点想法：

- 读完第三章
- 整理 Markdown 笔记
- 用 \`git commit\` 保存进度

> 每天进步一点点。`;

function countMarkdown(text) {
  const characters = Array.from(text).length;
  const compact = Array.from(text.replace(/\s/g, "")).length;
  const chinese = Array.from(text).filter((character) =>
    /\p{Script=Han}/u.test(character),
  ).length;
  const words = text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const lines = text.length === 0 ? 0 : text.split(/\r?\n/).length;

  return { characters, compact, chinese, words, lines };
}

function renderStats() {
  const stats = countMarkdown(input.value);

  Object.entries(stats).forEach(([key, value]) => {
    counters[key].textContent = value.toLocaleString("zh-CN");
  });
}

function formatStats(stats) {
  return [
    `总字符数：${stats.characters}`,
    `有效字符：${stats.compact}`,
    `中文字符：${stats.chinese}`,
    `英文单词：${stats.words}`,
    `行数：${stats.lines}`,
  ].join("\n");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = text;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.append(temporaryInput);
  temporaryInput.select();

  const copied = document.execCommand("copy");
  temporaryInput.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
}

input.addEventListener("input", renderStats);

sampleButton.addEventListener("click", () => {
  input.value = sampleText;
  input.focus();
  renderStats();
});

clearButton.addEventListener("click", () => {
  input.value = "";
  input.focus();
  renderStats();
});

copyButton.addEventListener("click", async () => {
  try {
    await copyText(formatStats(countMarkdown(input.value)));
    copyFeedback.textContent = "统计结果已复制，可以粘贴使用。";
  } catch {
    copyFeedback.textContent = "复制失败，请检查浏览器剪贴板权限。";
  }
});

renderStats();
