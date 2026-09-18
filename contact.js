(function () {
  "use strict";

  const form = document.getElementById("contactForm");
  if (!form || !window.ProductCatalog) return;

  const productSelect = document.getElementById("contactProduct");
  const productStatus = document.getElementById("contactProductStatus");
  const formStatus = document.getElementById("contactFormStatus");
  const fields = [...form.querySelectorAll("input, select, textarea")];

  function errorElement(field) {
    return form.querySelector('[data-error-for="' + field.id + '"]');
  }

  function setError(field, message) {
    const error = errorElement(field);
    if (!error) return;
    error.id = field.id + "Error";
    error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) field.setAttribute("aria-describedby", error.id);
    else field.removeAttribute("aria-describedby");
  }

  function clearErrors() {
    fields.forEach((field) => setError(field, ""));
    formStatus.textContent = "";
  }

  function renderProducts(products) {
    productSelect.innerHTML = '<option value="">문의할 제품을 선택해 주세요</option>';
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
    productSelect.disabled = products.length === 0;
  }

  function showProductLoadError() {
    productSelect.disabled = true;
    productStatus.textContent = "제품 목록을 불러오지 못했습니다.";
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "contact-retry";
    retryButton.textContent = "다시 시도";
    retryButton.addEventListener("click", loadProducts);
    productStatus.append(" ", retryButton);
  }

  async function loadProducts() {
    productStatus.textContent = "제품 목록을 불러오는 중입니다.";
    productSelect.disabled = true;
    try {
      const products = await ProductCatalog.loadVisibleProducts();
      renderProducts(products);
      productStatus.textContent = products.length ? "" : "현재 공개된 제품이 없습니다.";
    } catch (_) {
      showProductLoadError();
    }
  }

  function validate() {
    clearErrors();
    const name = document.getElementById("contactName");
    const phone = document.getElementById("contactPhone");
    const email = document.getElementById("contactEmail");
    const message = document.getElementById("contactMessage");
    const invalidFields = [];

    if (!name.value.trim()) {
      setError(name, "이름을 입력해 주세요.");
      invalidFields.push(name);
    }
    if (!phone.value.trim()) {
      setError(phone, "연락처를 입력해 주세요.");
      invalidFields.push(phone);
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(phone.value.trim())) {
      setError(phone, "전화번호 형식을 확인해 주세요.");
      invalidFields.push(phone);
    }
    if (!email.value.trim()) {
      setError(email, "이메일을 입력해 주세요.");
      invalidFields.push(email);
    } else if (!email.validity.valid) {
      setError(email, "이메일 형식을 확인해 주세요.");
      invalidFields.push(email);
    }
    if (!productSelect.value) {
      setError(productSelect, "문의할 제품을 선택해 주세요.");
      invalidFields.push(productSelect);
    }
    if (!message.value.trim()) {
      setError(message, "문의 내용을 입력해 주세요.");
      invalidFields.push(message);
    }

    if (invalidFields[0]) invalidFields[0].focus();
    return invalidFields.length === 0;
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => setError(field, ""));
    field.addEventListener("change", () => setError(field, ""));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;
    formStatus.textContent = "현재 문의 전송 기능을 준비 중입니다. 작성한 내용은 유지됩니다.";
  });

  loadProducts();
})();
