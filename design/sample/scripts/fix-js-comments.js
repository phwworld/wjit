const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "js", "site.js");
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

const replacements = {
  467: "      /** 히어로: 섹션 노출 시 배경 영상 재생·역재생. 모션 감소 시 루프 재생 */",
  591: "      /** 섹션 대타이틀: 뷰포트 진입 시 라인 단위 등장 · snap-section에 is-section-active 토글 */",
  620: "      /** GROWTH REPORT 배경 영상: 섹션 노출 시 1회 재생 후 정지 */",
  781: "        /** 스크롤 이징: 거리 기반 duration + ease-out-quad */",
  905: "          /* 키보드: 스냅 섹션 간 이동(화살표/스페이스) 처리 */",
  962: "        /** 퀵네비 라벨 색: 밝은 배경 섹션에서 대비 전환 */",
};

for (const [lineNo, text] of Object.entries(replacements)) {
  const i = Number(lineNo) - 1;
  if (lines[i] && lines[i].includes("?")) lines[i] = text;
}

const out = lines.join("\n");
if (out.includes("???")) {
  console.error('FAIL: still has "???"');
  process.exit(1);
}
fs.writeFileSync(file, out + "\n", "utf8");
console.log("OK: fix-js-comments");
