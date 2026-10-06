/**
 * eDM 캠페인 랜딩 페이지(신청 폼) 공통 스크립트.
 *
 * 화면마다 캠페인이 다르지만 폼 모양은 같다. 어느 캠페인인지는 이 페이지의 주소가
 * 이미 말하고 있으므로, 접수도 같은 주소로 fetch 한다 - 화면마다 주소를 하드코딩하지 않는다.
 */
(function () {
	"use strict";

	function field(form, name) {
		return form.elements[name];
	}

	function checkedRadio(form, name) {
		var checked = form.querySelector('input[name="' + name + '"]:checked');
		return checked ? checked.value : "";
	}

	/** 화면에서 먼저 걸러 준다. api도 같은 규칙으로 다시 본다 - 여기는 사용자 편의용이다. */
	function validate(form) {
		var required = [
			["userName", "이름을 입력해주세요."],
			["company", "회사(소속)를 입력해주세요."],
			["position", "직급을 입력해주세요."],
			["department", "부서명을 입력해주세요."],
			["tel1", "연락처를 입력해주세요."],
			["tel2", "연락처를 입력해주세요."],
			["tel3", "연락처를 입력해주세요."],
			["emailId", "이메일을 입력해주세요."],
			["emailDomain", "이메일을 입력해주세요."],
			["content", "상담 내용을 입력해주세요."]
		];

		for (var i = 0; i < required.length; i++) {
			var input = field(form, required[i][0]);
			if (!input || !input.value.trim()) {
				alert(required[i][1]);
				if (input) {
					input.focus();
				}
				return false;
			}
		}
		if (!checkedRadio(form, "counselYn")) {
			alert("상담 방법을 선택해주세요.");
			return false;
		}
		if (!field(form, "agreeYn1").checked) {
			alert("개인정보 수집 및 이용에 동의해주세요.");
			return false;
		}
		return true;
	}

	function toRequest(form) {
		return {
			userName: field(form, "userName").value.trim(),
			company: field(form, "company").value.trim(),
			position: field(form, "position").value.trim(),
			department: field(form, "department").value.trim(),
			tel1: field(form, "tel1").value.trim(),
			tel2: field(form, "tel2").value.trim(),
			tel3: field(form, "tel3").value.trim(),
			emailId: field(form, "emailId").value.trim(),
			emailDomain: field(form, "emailDomain").value.trim(),
			counselYn: checkedRadio(form, "counselYn"),
			content: field(form, "content").value.trim(),
			agreeYn1: field(form, "agreeYn1").checked,
			agreeYn2: field(form, "agreeYn2").checked
		};
	}

	/**
	 * 밑줄 친 문구를 누르면 팝업을 연다. AS-IS도 이용동의 문구를 팝업으로 보여준다
	 * (data-popopen 이름도 그대로 따랐다). 라벨 안에 넣은 문구라 그냥 두면 클릭이
	 * 체크박스도 함께 토글하므로 막는다 - 약관만 보고 싶은 사람이 뜻하지 않게
	 * 동의해 버리는 것을 막는다.
	 */
	function bindPopupTriggers() {
		document.querySelectorAll("[data-popopen]").forEach(function (trigger) {
			trigger.addEventListener("click", function (event) {
				event.preventDefault();
				event.stopPropagation();
				var target = document.getElementById(trigger.getAttribute("data-popopen"));
				if (target) {
					target.hidden = false;
				}
			});
		});
	}

	/** data-close 단추를 누르면 그 팝업을 닫는다. onClose 로 팝업마다 다른 뒷정리를 더한다. */
	function bindPopupClose(overlay, onClose) {
		if (!overlay) {
			return;
		}
		overlay.querySelectorAll("[data-close]").forEach(function (button) {
			button.addEventListener("click", function () {
				overlay.hidden = true;
				if (onClose) {
					onClose();
				}
			});
		});
	}

	/**
	 * 이메일 뒷자리 선택 상자. 흔한 메일 서비스를 고르면 옆 칸을 채우고 잠근다 -
	 * 직접입력을 고르면 다시 연다. AS-IS AWSpocevent 화면과 같은 목록이다.
	 */
	function bindEmailDomainSelect(form) {
		var select = document.getElementById("emailDomainSelect");
		var domainInput = field(form, "emailDomain");
		if (!select || !domainInput) {
			return;
		}
		select.addEventListener("change", function () {
			if (select.value === "") {
				domainInput.value = "";
				domainInput.readOnly = false;
				domainInput.focus();
			} else {
				domainInput.value = select.value;
				domainInput.readOnly = true;
			}
		});
	}

	document.addEventListener("DOMContentLoaded", function () {
		var form = document.getElementById("edmForm");
		var submitButton = document.getElementById("edmSubmit");
		var doneLayer = document.getElementById("edmDone");
		if (!form || !submitButton) {
			return;
		}

		submitButton.addEventListener("click", function () {
			if (!validate(form)) {
				return;
			}
			submitButton.disabled = true;

			fetch(window.location.pathname, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(toRequest(form))
			})
				.then(function (response) {
					if (!response.ok) {
						throw new Error("접수 실패");
					}
					if (doneLayer) {
						doneLayer.hidden = false;
					}
				})
				.catch(function () {
					alert("신청 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
				})
				.finally(function () {
					submitButton.disabled = false;
				});
		});

		bindEmailDomainSelect(form);
		bindPopupTriggers();
		bindPopupClose(document.getElementById("agreeInfo1"));
		bindPopupClose(document.getElementById("agreeInfo2"));
		bindPopupClose(doneLayer, function () {
			form.reset();
		});
	});
})();
