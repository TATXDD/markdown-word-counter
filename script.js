const input = document.querySelector("#markdown-input");
const sampleButton = document.querySelector("#sample-button");
const clearButton = document.querySelector("#clear-button");

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

renderStats();
