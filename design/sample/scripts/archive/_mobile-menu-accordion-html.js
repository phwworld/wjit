module.exports = `        <!-- Mobile menu panel -->
        <div
          id="mobile-menu"
          class="lg:hidden hidden border-t border-white/[0.06] bg-white pb-3"
          role="navigation"
          aria-label="모바일 주 메뉴"
          aria-hidden="true"
        >
          <div class="site-container w-full px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
            <div class="mobile-menu-inner">
              <div class="mobile-nav">
                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">Business</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel" hidden>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">AI</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">AICC <span class="mobile-nav__sep">|</span> AI 고객상담 시스템</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WIKL <span class="mobile-nav__sep">|</span> AI 인사이트 플랫폼</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">AI웅수 <span class="mobile-nav__sep">|</span> 그룹웨어 AI</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP Joule</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Mendix MAIA</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">SOLUTION</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WRMS</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WDMS</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">GAM SOLUTION</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Business Synergy Suite</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">ERP</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP S/4HANA</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP Business One</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP EWM</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Microsoft Dynamics 365</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Smart Factory</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WiJARD Package</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">CLOUD ONEPACK</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">CLOUD</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">AWS (Amazon Web Services)</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Microsoft Azure</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Microsoft Power Platform</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">NAVER Cloud Platform</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Databricks</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Mendix</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">워크쓰루 &amp; 네이버웍스 코어</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">MANAGED SERVICE</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">ITO</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Global Development Center</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">컨텍센터 BPO</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Payroll BPO</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">Industry</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel" hidden>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">렌탈</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">고객 만족도 및 충성도 증대</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">사업 확장 및 브랜드 신뢰도 증가</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">통합 관리 및 운영 효율화</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">모빌리티</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">디지털 혁신을 위한 최적의 도구</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">프로세스 정립 및 글로벌 운영 시스템 구축</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">효율적인 자원관리</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">제조</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">디지털 혁신과 생산성</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">인공지능과 머신러닝으로 제조 혁신 실현</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">계획과 목표 중심의 프로세스 설계로 품질 향상</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">바이오</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">엄격한 규제 준수를 위한 IT시스템</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">성장을 위한 기반 마련</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">소비재</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">플랫폼을 통한 경쟁력 강화</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">고객 경험 강화</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">데이터 분석과 기술의 활용</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">물류</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">복잡한 물류 현장을 위한 통합된 플랫폼</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">재고 없는 창고</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">미래 성장을 위한 유연한 물류 시스템</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">반도체</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">고도의 정밀성과 효율성을 위한 도구</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

module.exports = `        <!-- Mobile menu panel -->
        <div
          id="mobile-menu"
          class="lg:hidden hidden border-t border-white/[0.06] bg-white pb-3"
          role="navigation"
          aria-label="모바일 주 메뉴"
          aria-hidden="true"
        >
          <div class="site-container w-full px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
            <div class="mobile-menu-inner">
              <div class="mobile-nav">
                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">Business</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel" hidden>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">AI</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">AICC <span class="mobile-nav__sep">|</span> AI 고객상담 시스템</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WIKL <span class="mobile-nav__sep">|</span> AI 인사이트 플랫폼</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">AI웅수 <span class="mobile-nav__sep">|</span> 그룹웨어 AI</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP Joule</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Mendix MAIA</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">SOLUTION</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WRMS</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WDMS</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">GAM SOLUTION</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Business Synergy Suite</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">ERP</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP S/4HANA</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP Business One</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">SAP EWM</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Microsoft Dynamics 365</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Smart Factory</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">WiJARD Package</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">CLOUD ONEPACK</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">CLOUD</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">AWS (Amazon Web Services)</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Microsoft Azure</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Microsoft Power Platform</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">NAVER Cloud Platform</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Databricks</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Mendix</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">워크쓰루 &amp; 네이버웍스 코어</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">MANAGED SERVICE</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">ITO</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Global Development Center</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">컨텍센터 BPO</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">Payroll BPO</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">Industry</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel" hidden>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">렌탈</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">고객 만족도 및 충성도 증대</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">사업 확장 및 브랜드 신뢰도 증가</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">통합 관리 및 운영 효율화</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">모빌리티</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">디지털 혁신을 위한 최적의 도구</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">프로세스 정립 및 글로벌 운영 시스템 구축</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">효율적인 자원관리</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">제조</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">디지털 혁신과 생산성</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">인공지능과 머신러닝으로 제조 혁신 실현</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">계획과 목표 중심의 프로세스 설계로 품질 향상</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">바이오</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">엄격한 규제 준수를 위한 IT시스템</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">성장을 위한 기반 마련</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">소비재</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">플랫폼을 통한 경쟁력 강화</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">고객 경험 강화</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">데이터 분석과 기술의 활용</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">물류</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">복잡한 물류 현장을 위한 통합된 플랫폼</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">재고 없는 창고</a></li>
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">미래 성장을 위한 유연한 물류 시스템</a></li>
                      </ul>
                    </div>
                    <div class="mobile-nav__section">
                      <div class="mobile-nav__lv2">반도체</div>
                      <ul class="mobile-nav__lv3">
                        <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">고도의 정밀성과 효율성을 위한 도구</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">자료실</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel mobile-nav__panel--flat" hidden>
                    <ul class="mobile-nav__lv3">
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">프로젝트사례</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">다운로드</a></li>
                    </ul>
                  </div>
                </div>

                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">미디어룸</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel mobile-nav__panel--flat" hidden>
                    <ul class="mobile-nav__lv3">
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">뉴스</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">이벤트</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">공지사항</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">블로그</a></li>
                    </ul>
                  </div>
                </div>

                <div class="mobile-nav__group" data-mobile-nav-group>
                  <button type="button" class="mobile-nav__lv1 focus-ring" data-mobile-nav-toggle aria-expanded="false">
                    <span class="mobile-nav__lv1-label">회사소개</span>
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="mobile-nav__chevron" aria-hidden="true"></iconify-icon>
                  </button>
                  <div class="mobile-nav__panel mobile-nav__panel--flat" hidden>
                    <ul class="mobile-nav__lv3">
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">기업소개</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">투자정보</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">해외법인</a></li>
                      <li><a class="focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true">채용정보</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
