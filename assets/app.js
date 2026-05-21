(async function () {
  const lang = document.body.dataset.lang || "en";
  const dataUrl = document.body.dataset.products || "../data/products.json";
  const pageSize = 10;
  let products = [];
  let visibleLimit = pageSize;
  let lastResultKey = "";

  const copy = {
    en: {
      groups: {
        cleaning: "Cleaning",
        carry: "Leak & carry",
        material: "Material",
        size: "Size",
        buying: "Buying"
      },
      filters: {
        mouthMin: "Mouth diameter",
        leakproof: "Leakproof",
        ceramicCoated: "Ceramic coated",
        lidFullyDisassemblable: "Fully disassemblable lid",
        dishwasherSafe: "Dishwasher safe",
        cupHolderCompatible: "Car cup holder fit",
        drinkingModes: "Drinking mode",
        capacityMin: "Capacity",
        weightMax: "Max weight",
        priceMax: "Max price"
      },
      options: {
        any: "Any",
        yes: "Yes",
        no: "No",
        unknown: "Unknown",
        straw: "Straw",
        sip: "Sip lid",
        chug: "Chug",
        allModes: "Any mode"
      },
      units: {
        cmMin: "cm or wider",
        mlMin: "ml or larger",
        gMax: "g or lighter",
        usdMax: "USD or less"
      },
      resultCount: (shown, matched, total) =>
        `${shown} shown of ${matched} matches (${total} total records)`,
      loading: "Loading verified product data...",
      loadError: "Product data could not be loaded.",
      loadMore: {
        button: (remaining) => (remaining > 10 ? `Show 10 more (${remaining} left)` : `Show ${remaining} more`),
        done: "All matching products are shown.",
        hint: "Press the button to load the next 10."
      },
      activeNone: "No filters selected yet. Start narrowing by verified specs.",
      activePrefix: "Active filters",
      card: {
        demo: "Demo data",
        match: "Matches active filters",
        compare: "Ready to compare",
        buy: "Buy link",
        disabledBuy: "Replace after verification",
        notes: "Community notes",
        notesHint: "Prototype notes are stored only in this browser.",
        notePlaceholder: "What would you want other picky buyers to know?",
        addNote: "Add note",
        emptyNotes: "No notes yet.",
        source: "Needs human source check"
      },
      specs: {
        mouthDiameterCm: "Mouth",
        capacityMl: "Capacity",
        weightG: "Weight",
        leakproof: "Leakproof",
        ceramicCoated: "Ceramic",
        lidFullyDisassemblable: "Lid parts",
        dishwasherSafe: "Dishwasher",
        cupHolderCompatible: "Cup holder",
        drinkingModes: "Mode"
      },
      empty: {
        title: "No verified matches",
        body: "Because Unknown values are excluded when a filter is active, the current demo set may disappear quickly. Try relaxing one condition."
      }
    },
    ko: {
      groups: {
        cleaning: "세척",
        carry: "밀폐·휴대",
        material: "소재",
        size: "크기",
        buying: "구매"
      },
      filters: {
        mouthMin: "입구 최상단 내경",
        leakproof: "완전 밀폐",
        ceramicCoated: "세라믹 코팅",
        lidFullyDisassemblable: "뚜껑 완전 분해",
        dishwasherSafe: "식기세척기 가능",
        cupHolderCompatible: "차 컵홀더 호환",
        drinkingModes: "마시는 구조",
        capacityMin: "용량",
        weightMax: "최대 무게",
        priceMax: "최대 가격"
      },
      options: {
        any: "전체",
        yes: "예",
        no: "아니오",
        unknown: "Unknown",
        straw: "빨대",
        sip: "마개/입구",
        chug: "벌컥 마심",
        allModes: "전체 구조"
      },
      units: {
        cmMin: "cm 이상",
        mlMin: "ml 이상",
        gMax: "g 이하",
        usdMax: "USD 이하"
      },
      resultCount: (shown, matched, total) =>
        `${matched}개 결과 중 ${shown}개 표시 · 전체 ${total}개`,
      loading: "검증 제품 데이터를 불러오는 중...",
      loadError: "제품 데이터를 불러오지 못했습니다.",
      loadMore: {
        button: (remaining) => (remaining > 10 ? `10개 더 보기 (${remaining}개 남음)` : `${remaining}개 더 보기`),
        done: "조건에 맞는 제품을 모두 표시했습니다.",
        hint: "버튼을 누르면 다음 10개가 추가됩니다."
      },
      activeNone: "아직 선택한 필터가 없습니다. 검증 스펙으로 바로 좁혀보세요.",
      activePrefix: "선택한 필터",
      card: {
        demo: "Demo data",
        match: "선택 조건 충족",
        compare: "비교 가능",
        buy: "구매 링크",
        disabledBuy: "검증 후 연결",
        notes: "커뮤니티 노트",
        notesHint: "프로토타입 노트는 이 브라우저에만 저장됩니다.",
        notePlaceholder: "까다로운 구매자에게 알려주고 싶은 점을 적어보세요.",
        addNote: "노트 추가",
        emptyNotes: "아직 노트가 없습니다.",
        source: "출처 수동 검증 필요"
      },
      specs: {
        mouthDiameterCm: "입구",
        capacityMl: "용량",
        weightG: "무게",
        leakproof: "밀폐",
        ceramicCoated: "세라믹",
        lidFullyDisassemblable: "뚜껑",
        dishwasherSafe: "식세기",
        cupHolderCompatible: "컵홀더",
        drinkingModes: "구조"
      },
      empty: {
        title: "검증된 결과 없음",
        body: "활성 필터에서는 Unknown 값이 제외됩니다. 데모 데이터가 작으니 조건을 하나 줄여보세요."
      }
    }
  };

  const t = copy[lang];
  const tableCopy =
    lang === "ko"
      ? {
          product: "제품",
          mouth: "입구",
          capacity: "용량",
          weight: "무게",
          leakproof: "밀폐",
          ceramic: "세라믹",
          cleaning: "세척",
          cup: "컵홀더",
          price: "가격",
          lid: "분해",
          dishwasher: "식세기",
          specs: "검증 스펙",
          actions: "링크",
          sorts: [
            ["match", "조건 만족 우선"],
            ["nameAsc", "이름순"],
            ["priceAsc", "가격 낮은순"],
            ["priceDesc", "가격 높은순"],
            ["mouthDesc", "입구 지름 넓은순"],
            ["mouthAsc", "입구 지름 좁은순"],
            ["capacityDesc", "용량 큰순"],
            ["weightAsc", "무게 가벼운순"]
          ]
        }
      : {
          product: "Product",
          mouth: "Mouth",
          capacity: "Capacity",
          weight: "Weight",
          leakproof: "Leak",
          ceramic: "Ceramic",
          cleaning: "Cleaning",
          cup: "Cup fit",
          price: "Price",
          lid: "Lid",
          dishwasher: "DW",
          specs: "Verified specs",
          actions: "Links",
          sorts: [
            ["match", "Best match"],
            ["nameAsc", "Name A-Z"],
            ["priceAsc", "Lowest price"],
            ["priceDesc", "Highest price"],
            ["mouthDesc", "Widest mouth"],
            ["mouthAsc", "Narrowest mouth"],
            ["capacityDesc", "Largest capacity"],
            ["weightAsc", "Lightest weight"]
          ]
        };
  const filterForm = document.getElementById("filters");
  const resultsEl = document.getElementById("results");
  const resultsTitle = document.getElementById("resultsTitle");
  const activeFiltersEl = document.getElementById("activeFilters");
  const resetButton = document.getElementById("resetFilters");
  const sortBy = document.getElementById("sortBy");

  async function loadProducts() {
    resultsTitle.textContent = t.loading;
    try {
      const response = await fetch(dataUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      const records = Array.isArray(payload) ? payload : payload.products;
      products = Array.isArray(records) ? records : [];
    } catch (error) {
      throw new Error(`${dataUrl}: ${error.message}`);
    }
  }

  function renderLoadError(error) {
    resultsTitle.textContent = t.loadError;
    activeFiltersEl.replaceChildren();
    resultsEl.replaceChildren();
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `<h3>${t.loadError}</h3><p>${escapeHtml(error.message)}</p>`;
    resultsEl.appendChild(empty);
  }

  const numericFilters = [
    {
      group: "cleaning",
      name: "mouthMin",
      values: [7, 7.5, 8, 8.5, 9],
      label: (value) => `${value.toFixed(1)} ${t.units.cmMin}`,
      match: (specs, value) => knownNumber(specs.mouthDiameterCm) && specs.mouthDiameterCm >= value
    },
    {
      group: "size",
      name: "capacityMin",
      values: [350, 500, 700, 900, 1000],
      label: (value) => `${value} ${t.units.mlMin}`,
      match: (specs, value) => knownNumber(specs.capacityMl) && specs.capacityMl >= value
    },
    {
      group: "size",
      name: "weightMax",
      values: [300, 400, 500, 650],
      label: (value) => `${value} ${t.units.gMax}`,
      match: (specs, value) => knownNumber(specs.weightG) && specs.weightG <= value
    },
    {
      group: "buying",
      name: "priceMax",
      values: [25, 35, 45, 60],
      label: (value) => `$${value} ${t.units.usdMax}`,
      match: (specs, value, product) => knownNumber(product.priceUsd) && product.priceUsd <= value
    }
  ];

  const booleanFilters = [
    { group: "carry", name: "leakproof" },
    { group: "material", name: "ceramicCoated" },
    { group: "cleaning", name: "lidFullyDisassemblable" },
    { group: "cleaning", name: "dishwasherSafe" },
    { group: "carry", name: "cupHolderCompatible" }
  ];

  const modeOptions = ["straw", "sip", "chug"];

  function knownNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function readQueryState() {
    const params = new URLSearchParams(window.location.search);
    const state = {};

    for (const filter of numericFilters) {
      const value = Number(params.get(filter.name));
      state[filter.name] = Number.isFinite(value) && value > 0 ? value : "";
    }

    for (const filter of booleanFilters) {
      state[filter.name] = params.get(filter.name) === "1";
    }

    state.drinkingModes = params.get("drinkingModes")
      ? params.get("drinkingModes").split(",").filter((mode) => modeOptions.includes(mode))
      : [];
    state.sortBy = params.get("sort") || "match";
    return state;
  }

  function buildSortOptions(selectedValue = "match") {
    sortBy.replaceChildren();

    for (const [value, label] of tableCopy.sorts) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      sortBy.appendChild(option);
    }

    sortBy.value = tableCopy.sorts.some(([value]) => value === selectedValue) ? selectedValue : "match";
  }

  function createSelect(filter, state) {
    const label = document.createElement("label");
    label.className = "field";
    label.innerHTML = `<span>${t.filters[filter.name]}</span>`;

    const select = document.createElement("select");
    select.name = filter.name;
    select.dataset.filter = filter.name;

    const any = document.createElement("option");
    any.value = "";
    any.textContent = t.options.any;
    select.appendChild(any);

    for (const value of filter.values) {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = filter.label(value);
      select.appendChild(option);
    }

    select.value = state[filter.name] ? String(state[filter.name]) : "";
    label.appendChild(select);
    return label;
  }

  function createCheckbox(filter, state) {
    const label = document.createElement("label");
    label.className = "check-field";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = filter.name;
    input.checked = Boolean(state[filter.name]);

    const text = document.createElement("span");
    text.textContent = t.filters[filter.name];

    label.append(input, text);
    return label;
  }

  function createModeGroup(state) {
    const wrapper = document.createElement("fieldset");
    wrapper.className = "mode-group";

    const legend = document.createElement("legend");
    legend.textContent = t.filters.drinkingModes;
    wrapper.appendChild(legend);

    const row = document.createElement("div");
    row.className = "segmented";

    for (const mode of modeOptions) {
      const label = document.createElement("label");
      label.className = "segment";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "drinkingModes";
      input.value = mode;
      input.checked = state.drinkingModes.includes(mode);

      const text = document.createElement("span");
      text.textContent = t.options[mode];

      label.append(input, text);
      row.appendChild(label);
    }

    wrapper.appendChild(row);
    return wrapper;
  }

  function buildFilters() {
    const state = readQueryState();
    const groups = ["cleaning", "carry", "material", "size", "buying"];
    filterForm.replaceChildren();

    for (const group of groups) {
      const block = document.createElement("section");
      block.className = "filter-group";
      const heading = document.createElement("h3");
      heading.textContent = t.groups[group];
      block.appendChild(heading);

      for (const filter of numericFilters.filter((item) => item.group === group)) {
        block.appendChild(createSelect(filter, state));
      }

      for (const filter of booleanFilters.filter((item) => item.group === group)) {
        block.appendChild(createCheckbox(filter, state));
      }

      if (group === "carry") {
        block.appendChild(createModeGroup(state));
      }

      filterForm.appendChild(block);
    }

    buildSortOptions(state.sortBy);
  }

  function getStateFromForm() {
    const data = new FormData(filterForm);
    const state = {};

    for (const filter of numericFilters) {
      const value = Number(data.get(filter.name));
      state[filter.name] = Number.isFinite(value) && value > 0 ? value : "";
    }

    for (const filter of booleanFilters) {
      state[filter.name] = data.get(filter.name) === "on";
    }

    state.drinkingModes = data.getAll("drinkingModes");
    state.sortBy = sortBy.value;
    return state;
  }

  function stateToParams(state) {
    const params = new URLSearchParams();

    for (const filter of numericFilters) {
      if (state[filter.name]) {
        params.set(filter.name, state[filter.name]);
      }
    }

    for (const filter of booleanFilters) {
      if (state[filter.name]) {
        params.set(filter.name, "1");
      }
    }

    if (state.drinkingModes.length) {
      params.set("drinkingModes", state.drinkingModes.join(","));
    }

    if (state.sortBy && state.sortBy !== "match") {
      params.set("sort", state.sortBy);
    }

    return params;
  }

  function updateUrl(state) {
    const params = stateToParams(state);
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState({}, "", next);
  }

  function productMatches(product, state) {
    const specs = product.specs;

    for (const filter of numericFilters) {
      const value = state[filter.name];
      if (value && !filter.match(specs, value, product)) {
        return false;
      }
    }

    for (const filter of booleanFilters) {
      if (state[filter.name] && specs[filter.name] !== true) {
        return false;
      }
    }

    if (state.drinkingModes.length) {
      if (!Array.isArray(specs.drinkingModes)) {
        return false;
      }
      const hasMode = state.drinkingModes.some((mode) => specs.drinkingModes.includes(mode));
      if (!hasMode) {
        return false;
      }
    }

    return true;
  }

  function activeFilterCount(state) {
    return [
      ...numericFilters.map((filter) => Boolean(state[filter.name])),
      ...booleanFilters.map((filter) => Boolean(state[filter.name])),
      state.drinkingModes.length > 0
    ].filter(Boolean).length;
  }

  function sortProducts(items, state) {
    const sorted = [...items];

    if (state.sortBy === "nameAsc") {
      sorted.sort((a, b) => compareText(productName(a), productName(b)));
    } else if (state.sortBy === "priceAsc") {
      sorted.sort((a, b) => compareNumber(a.priceUsd, b.priceUsd, "asc") || compareText(productName(a), productName(b)));
    } else if (state.sortBy === "priceDesc") {
      sorted.sort((a, b) => compareNumber(a.priceUsd, b.priceUsd, "desc") || compareText(productName(a), productName(b)));
    } else if (state.sortBy === "mouthDesc") {
      sorted.sort(
        (a, b) => compareNumber(a.specs.mouthDiameterCm, b.specs.mouthDiameterCm, "desc") || compareText(productName(a), productName(b))
      );
    } else if (state.sortBy === "mouthAsc") {
      sorted.sort(
        (a, b) => compareNumber(a.specs.mouthDiameterCm, b.specs.mouthDiameterCm, "asc") || compareText(productName(a), productName(b))
      );
    } else if (state.sortBy === "capacityDesc") {
      sorted.sort(
        (a, b) => compareNumber(a.specs.capacityMl, b.specs.capacityMl, "desc") || compareText(productName(a), productName(b))
      );
    } else if (state.sortBy === "weightAsc") {
      sorted.sort((a, b) => compareNumber(a.specs.weightG, b.specs.weightG, "asc") || compareText(productName(a), productName(b)));
    } else {
      sorted.sort((a, b) => {
        const aScore = matchScore(a, state);
        const bScore = matchScore(b, state);
        return bScore - aScore || compareNumber(a.priceUsd, b.priceUsd, "asc") || compareText(productName(a), productName(b));
      });
    }

    return sorted;
  }

  function productName(product) {
    return `${product.brand || ""} ${product.name || ""}`.trim();
  }

  function compareText(a, b) {
    return String(a).localeCompare(String(b), lang === "ko" ? "ko" : "en", {
      sensitivity: "base"
    });
  }

  function compareNumber(a, b, direction) {
    const aKnown = knownNumber(a);
    const bKnown = knownNumber(b);

    if (!aKnown && !bKnown) {
      return 0;
    }

    if (!aKnown) {
      return 1;
    }

    if (!bKnown) {
      return -1;
    }

    return direction === "asc" ? a - b : b - a;
  }

  function matchScore(product, state) {
    const specs = product.specs;
    let score = 0;

    for (const filter of numericFilters) {
      if (state[filter.name] && filter.match(specs, state[filter.name], product)) {
        score += 1;
      }
    }

    for (const filter of booleanFilters) {
      if (state[filter.name] && specs[filter.name] === true) {
        score += 1;
      }
    }

    if (state.drinkingModes.length && state.drinkingModes.some((mode) => specs.drinkingModes?.includes(mode))) {
      score += 1;
    }

    return score;
  }

  function formatValue(key, value) {
    if (value === null || value === undefined || value === "") {
      return t.options.unknown;
    }

    if (typeof value === "boolean") {
      return value ? t.options.yes : t.options.no;
    }

    if (key === "mouthDiameterCm") {
      return `${value.toFixed(1)} cm`;
    }

    if (key === "capacityMl") {
      return `${value} ml`;
    }

    if (key === "weightG") {
      return `${value} g`;
    }

    if (key === "drinkingModes") {
      return Array.isArray(value) && value.length
        ? value.map((mode) => t.options[mode] || mode).join(" / ")
        : t.options.unknown;
    }

    return String(value);
  }

  function renderActiveFilters(state) {
    const chips = [];

    for (const filter of numericFilters) {
      if (state[filter.name]) {
        chips.push(`${t.filters[filter.name]} ${filter.label(state[filter.name])}`);
      }
    }

    for (const filter of booleanFilters) {
      if (state[filter.name]) {
        chips.push(t.filters[filter.name]);
      }
    }

    if (state.drinkingModes.length) {
      chips.push(`${t.filters.drinkingModes}: ${state.drinkingModes.map((mode) => t.options[mode]).join(" / ")}`);
    }

    activeFiltersEl.replaceChildren();

    if (!chips.length) {
      const empty = document.createElement("p");
      empty.textContent = t.activeNone;
      activeFiltersEl.appendChild(empty);
      return;
    }

    const label = document.createElement("span");
    label.className = "active-label";
    label.textContent = t.activePrefix;
    activeFiltersEl.appendChild(label);

    for (const chip of chips) {
      const item = document.createElement("span");
      item.className = "chip";
      item.textContent = chip;
      activeFiltersEl.appendChild(item);
    }
  }

  function renderResults(options = {}) {
    const state = getStateFromForm();
    updateUrl(state);
    renderActiveFilters(state);

    const filtered = sortProducts(products.filter((product) => productMatches(product, state)), state);
    const resultKey = JSON.stringify({
      state,
      ids: filtered.map((product) => product.id)
    });
    if (!options.preserveLimit && resultKey !== lastResultKey) {
      visibleLimit = pageSize;
    }
    lastResultKey = resultKey;

    const visibleProducts = filtered.slice(0, visibleLimit);
    resultsTitle.textContent = t.resultCount(visibleProducts.length, filtered.length, products.length);
    resultsEl.replaceChildren();

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = `<h3>${t.empty.title}</h3><p>${t.empty.body}</p>`;
      resultsEl.appendChild(empty);
      return;
    }

    resultsEl.appendChild(createComparisonHeader());

    for (const product of visibleProducts) {
      resultsEl.appendChild(createProductRow(product, state));
    }

    resultsEl.appendChild(createLoadMoreControl(filtered.length));
  }

  function createLoadMoreControl(totalMatches) {
    const footer = document.createElement("div");
    footer.className = "load-more";

    if (visibleLimit >= totalMatches) {
      footer.innerHTML = `<p>${t.loadMore.done}</p>`;
      return footer;
    }

    const remaining = totalMatches - visibleLimit;
    const button = document.createElement("button");
    button.className = "show-more-button";
    button.type = "button";
    button.textContent = t.loadMore.button(remaining);
    button.addEventListener("click", showMoreResults);

    const hint = document.createElement("p");
    hint.textContent = t.loadMore.hint;

    footer.append(button, hint);
    return footer;
  }

  function showMoreResults() {
    const scrollY = window.scrollY;
    visibleLimit += pageSize;
    renderResults({ preserveLimit: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    });
  }

  function createComparisonHeader() {
    const header = document.createElement("div");
    header.className = "comparison-header";
    header.setAttribute("aria-hidden", "true");
    header.innerHTML = `
      <span>${tableCopy.product}</span>
      <span>${tableCopy.specs}</span>
      <span>${tableCopy.price}</span>
      <span>${tableCopy.actions}</span>
    `;
    return header;
  }

  function createProductRow(product, state) {
    const template = document.createElement("article");
    template.className = "product-row";
    template.dataset.productId = product.id;
    template.style.setProperty("--accent", product.accent || "#2f6f73");

    const modeText = formatValue("drinkingModes", product.specs.drinkingModes);
    const statusText = activeFilterCount(state) ? t.card.match : t.card.compare;

    const visual = product.imageUrl
      ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(productName(product))}">`
      : "<span></span>";
    const hasBuyUrl = product.buyUrl && product.buyUrl !== "#";

    template.innerHTML = `
      <div class="row-product">
        <div class="row-image ${product.imageUrl ? "row-image--photo" : ""}" aria-hidden="true">
          ${visual}
        </div>
        <div class="row-copy">
          <div class="row-kicker">
            <span class="status-pill">${statusText}</span>
            <span class="status-pill status-pill--demo">${t.card.demo}</span>
          </div>
          <h3>${escapeHtml(product.brand)}</h3>
          <p>${escapeHtml(product.name)} <span aria-hidden="true">&middot;</span> ${modeText}</p>
        </div>
      </div>
      <div class="row-specs" aria-label="${tableCopy.specs}">
        ${metricCell(tableCopy.mouth, formatValue("mouthDiameterCm", product.specs.mouthDiameterCm), "mouth")}
        ${metricCell(tableCopy.capacity, formatValue("capacityMl", product.specs.capacityMl), "capacity")}
        ${metricCell(tableCopy.weight, formatValue("weightG", product.specs.weightG), "weight")}
        ${metricCell(tableCopy.leakproof, formatValue("leakproof", product.specs.leakproof), "leak")}
        ${metricCell(tableCopy.ceramic, formatValue("ceramicCoated", product.specs.ceramicCoated), "ceramic")}
        <div class="row-metric row-metric--cleaning">
          <span>${tableCopy.cleaning}</span>
          <strong>${tableCopy.lid}: ${formatValue("lidFullyDisassemblable", product.specs.lidFullyDisassemblable)}</strong>
          <small>${tableCopy.dishwasher}: ${formatValue("dishwasherSafe", product.specs.dishwasherSafe)}</small>
        </div>
        ${metricCell(tableCopy.cup, formatValue("cupHolderCompatible", product.specs.cupHolderCompatible), "cup")}
      </div>
      <div class="row-price">
        <strong>$${product.priceUsd}</strong>
        <span>USD</span>
      </div>
      <div class="row-actions">
        <button class="notes-toggle" type="button" aria-expanded="false">${t.card.notes}</button>
        <a class="buy-link" href="${hasBuyUrl ? escapeHtml(product.buyUrl) : "#"}" ${hasBuyUrl ? 'target="_blank" rel="noreferrer"' : ""} data-disabled-buy="${String(!hasBuyUrl)}">${t.card.buy}</a>
      </div>
      <p class="source-note">${t.card.source}</p>
      <section class="notes-panel" hidden>
        <div class="notes-heading">
          <h4>${t.card.notes}</h4>
          <p>${t.card.notesHint}</p>
        </div>
        <div class="notes-list"></div>
        <label class="note-input">
          <span>${t.card.notes}</span>
          <textarea rows="3" placeholder="${t.card.notePlaceholder}"></textarea>
        </label>
        <button class="add-note" type="button">${t.card.addNote}</button>
      </section>
    `;

    const notesToggle = template.querySelector(".notes-toggle");
    const notesPanel = template.querySelector(".notes-panel");
    const notesList = template.querySelector(".notes-list");
    const addNote = template.querySelector(".add-note");
    const textarea = template.querySelector("textarea");
    const buyLink = template.querySelector(".buy-link");

    notesToggle.addEventListener("click", () => {
      const isOpen = !notesPanel.hidden;
      notesPanel.hidden = isOpen;
      notesToggle.setAttribute("aria-expanded", String(!isOpen));
      if (!isOpen) {
        renderNotes(product.id, notesList);
      }
    });

    addNote.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) {
        textarea.focus();
        return;
      }
      const notes = loadNotes(product.id);
      notes.unshift({ text, createdAt: new Date().toISOString() });
      saveNotes(product.id, notes);
      textarea.value = "";
      renderNotes(product.id, notesList);
    });

    buyLink.addEventListener("click", (event) => {
      if (buyLink.dataset.disabledBuy === "true") {
        event.preventDefault();
        buyLink.textContent = t.card.disabledBuy;
        setTimeout(() => {
          buyLink.textContent = t.card.buy;
        }, 1600);
      }
    });

    return template;
  }

  function metricCell(label, value, modifier) {
    const unknown = value === t.options.unknown;
    return `
      <div class="row-metric row-metric--${modifier} ${unknown ? "row-metric--unknown" : ""}">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `;
  }

  function loadNotes(productId) {
    try {
      return JSON.parse(localStorage.getItem(`specchecked-notes:${productId}`)) || [];
    } catch {
      return [];
    }
  }

  function saveNotes(productId, notes) {
    localStorage.setItem(`specchecked-notes:${productId}`, JSON.stringify(notes));
  }

  function renderNotes(productId, target) {
    const notes = loadNotes(productId);
    target.replaceChildren();

    if (!notes.length) {
      const empty = document.createElement("p");
      empty.className = "empty-notes";
      empty.textContent = t.card.emptyNotes;
      target.appendChild(empty);
      return;
    }

    for (const note of notes) {
      const item = document.createElement("div");
      item.className = "note-item";
      const date = new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
        month: "short",
        day: "numeric"
      }).format(new Date(note.createdAt));
      item.innerHTML = `<p>${escapeHtml(note.text)}</p><time>${date}</time>`;
      target.appendChild(item);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  filterForm.addEventListener("change", () => renderResults());
  sortBy.addEventListener("change", () => renderResults());
  resetButton.addEventListener("click", () => {
    filterForm.reset();
    sortBy.value = "match";
    renderResults();
  });

  buildFilters();
  try {
    await loadProducts();
    renderResults();
  } catch (error) {
    renderLoadError(error);
  }
})();
