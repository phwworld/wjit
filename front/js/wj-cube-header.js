/* 웅진IT 서브타이틀 모티브 — B안 CUBE STACK
   [data-wjc-cube] 요소마다 3×3×3 큐브 셀을 생성합니다. 의존성 없음. */
(function () {
  var STEP = 19.2, SCATTER = 2.1;
  var FACES = ['wjc-f1', 'wjc-f2', 'wjc-f3', 'wjc-f4', 'wjc-f5 wjc-face--l', 'wjc-f6 wjc-face--l'];

  function build(root) {
    if (root.getAttribute('data-wjc-built')) return;
    root.setAttribute('data-wjc-built', '1');
    root.classList.add('wjc-cube');
    var html = '<div class="wjc-drift"><div class="wjc-iso"><div class="wjc-spin">';
    for (var j = 0; j < 3; j++) {
      html += '<div class="wjc-row wjc-row--' + j + '">';
      for (var i = 0; i < 3; i++) {
        for (var k = 0; k < 3; k++) {
          var x = (i - 1) * STEP, y = (j - 1) * STEP, z = (k - 1) * STEP;
          var d = Math.abs(i - 1) + Math.abs(j - 1) + Math.abs(k - 1);
          html += '<div class="wjc-cell" style="transform:translate3d(' + x + 'cqw,' + y + 'cqw,' + z + 'cqw)">' +
            '<div class="wjc-cell-in" style="--d:' + d + ';--dx:' + (x * SCATTER).toFixed(2) + 'cqw;--dy:' + (y * SCATTER * 0.7).toFixed(2) + 'cqw;--dz:' + (z * SCATTER).toFixed(2) + 'cqw">';
          for (var f = 0; f < 6; f++) html += '<div class="wjc-face ' + FACES[f] + '"></div>';
          html += '</div></div>';
        }
      }
      html += '</div>';
    }
    html += '</div></div></div>';
    root.innerHTML = html;
  }

  function init(scope) {
    var list = (scope || document).querySelectorAll('[data-wjc-cube]');
    for (var n = 0; n < list.length; n++) build(list[n]);
  }

  /* 모션 다시 재생: WJCubeHeader.replay(헤더요소 또는 생략) */
  function replay(header) {
    var h = header || document.querySelector('.wjc-header');
    if (!h) return;
    var clone = h.cloneNode(true);
    h.parentNode.replaceChild(clone, h);
    return clone;
  }

  window.WJCubeHeader = { init: init, replay: replay };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
