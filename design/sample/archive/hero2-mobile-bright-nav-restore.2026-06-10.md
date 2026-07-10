# 히어로 2번 모바일 — 변경 전 복원 가이드 (2026-06-10)

이 체크포인트는 **2번 히어로 밝은 영상 + 탑 네비 반전** 적용 **이전** 상태입니다.

## 변경 요약 (적용 후)

- 모바일 공통: 2번 슬라이드에서 `hero-video-stack::after` 블랙 오버레이 제거
- 모바일 공통: 2번 슬라이드에서 `#site-header.is-hero-bright-nav` → Logo_wj.svg + 다크 아이콘
- `js/site.js`: `syncHeroBrightNav()` 추가

## 복원 방법

### 1) CSS (`css/site.css`)

**A. 오버레이 복원** — `@media (max-width: 719px)...` 블록 내 2번 슬라이드 주석·규칙:

```css
        /* 모바일: 2번 히어로 영상 확대·상단 배치 (틀 유지 · #B9CCDC · 블랙 오버레이 유지) */
        ...
        .hero-media:has(#hero-video-2.is-active) .hero-video-stack::after,
        .hero-media.is-crossfading:has(#hero-video-2.is-incoming) .hero-video-stack::after {
          opacity: 1;
        }
        ...
        .hero-media.is-crossfading:has(#hero-video-2.is-active:not(.is-incoming)) .hero-video-stack::after {
          opacity: 0;
        }
```

**B. 탑 네비 반전 CSS 삭제** — `/* 모바일: 2번 히어로(밝은 영상) — 탑 네비 반전` 블록 전체 제거

### 2) JS (`js/site.js`)

`initHeroBackgroundVideo` 내 아래 항목 제거:

- `mqHeroBrightNav`, `syncHeroBrightNav` 선언
- `goToSlide` / `finishTransition` / `syncHeroVisibility` 내 `syncHeroBrightNav` 호출
- `mqHeroBrightNav` change 리스너

## 백업 스니펫

원본 CSS 스니펫: `archive/hero2-mobile-bright-nav-restore.2026-06-10.css`
