let cols = 10;
let rows = 8;

const board = document.querySelector("#board");
const logText = document.querySelector("#battleLog");
const logIcon = document.querySelector("#logIcon");
const emptyDetail = document.querySelector("#emptyDetail");
const unitSheet = document.querySelector("#unitSheet");
const detailBar = document.querySelector("#detailBar");
const sheetType = document.querySelector("#sheetType");
const sheetName = document.querySelector("#sheetName");
const primaryStats = document.querySelector("#primaryStats");
const skillList = document.querySelector("#skillList");
const addSkillButton = document.querySelector("#addSkill");
const deleteUnit = document.querySelector("#deleteUnit");
const resetMap = document.querySelector("#resetMap");
const saveLoadMap = document.querySelector("#saveLoadMap");
const duelTitle = document.querySelector("#duelTitle");
const duelUnits = document.querySelector("#duelUnits");
const duelStats = document.querySelector("#duelStats");
const duelResult = document.querySelector("#duelResult");
const discordWebhook = document.querySelector("#discordWebhook");
const mapModal = document.querySelector("#mapModal");
const closeMapModal = document.querySelector("#closeMapModal");
const cancelMapModal = document.querySelector("#cancelMapModal");
const saveLoadModal = document.querySelector("#saveLoadModal");
const closeSaveLoadModal = document.querySelector("#closeSaveLoadModal");
const saveList = document.querySelector("#saveList");
const mapSaveList = document.querySelector("#mapSaveList");
const saveMapButton = document.querySelector("#saveMapButton");
const loadMapButton = document.querySelector("#loadMapButton");
const mapSaveButton = document.querySelector("#mapSaveButton");
const mapLoadButton = document.querySelector("#mapLoadButton");
const nameModal = document.querySelector("#nameModal");
const saveNameInput = document.querySelector("#saveNameInput");
const closeNameModal = document.querySelector("#closeNameModal");
const cancelNameModal = document.querySelector("#cancelNameModal");
const confirmModal = document.querySelector("#confirmModal");
const confirmTitle = document.querySelector("#confirmTitle");
const confirmMessage = document.querySelector("#confirmMessage");
const confirmYes = document.querySelector("#confirmYes");
const confirmNo = document.querySelector("#confirmNo");
const mapInputs = {
  cols: document.querySelector("#mapCols"),
  rows: document.querySelector("#mapRows"),
  allies: document.querySelector("#mapAllies"),
  enemies: document.querySelector("#mapEnemies"),
  obstacles: document.querySelector("#mapObstacles")
};

const inputs = {
  hp: document.querySelector("#unitHp"),
  maxHp: document.querySelector("#unitMaxHp"),
  stamina: document.querySelector("#unitStamina"),
  maxStamina: document.querySelector("#unitMaxStamina")
};

const PRIMARY_STATS = [
  ["str", "힘"],
  ["con", "건강"],
  ["spd", "속도"],
  ["pre", "정밀"],
  ["int", "지능"],
  ["wis", "지혜"],
  ["cha", "매력"]
];

const initialUnits = [
  unit("player", "P", 1, 5, "플레이어", { hp: 30, maxHp: 30, stamina: 14, maxStamina: 14, attack: 8, defense: 3, move: 4 }),
  unit("ally", "1", 1, 1, "아군 1", { hp: 18, maxHp: 18, stamina: 12, maxStamina: 12, attack: 5, defense: 1, move: 4 }),
  unit("ally", "2", 0, 4, "아군 2", { hp: 20, maxHp: 20, stamina: 10, maxStamina: 10, attack: 6, defense: 2, move: 3 }),
  unit("ally", "3", 1, 7, "아군 3", { hp: 16, maxHp: 16, stamina: 16, maxStamina: 16, attack: 7, defense: 1, move: 5 }),
  unit("enemy", "1", 2, 6, "적군 1", { hp: 17, maxHp: 17, stamina: 10, maxStamina: 10, attack: 5, defense: 1, move: 3 }),
  unit("enemy", "2", 3, 1, "적군 2", { hp: 19, maxHp: 19, stamina: 10, maxStamina: 10, attack: 6, defense: 2, move: 3 }),
  unit("enemy", "3", 4, 0, "적군 3", { hp: 22, maxHp: 22, stamina: 8, maxStamina: 8, attack: 7, defense: 2, move: 2 }),
  unit("enemy", "4", 4, 3, "적군 4", { hp: 24, maxHp: 24, stamina: 8, maxStamina: 8, attack: 8, defense: 3, move: 2 }),
  obstacle(1, 0),
  obstacle(3, 0),
  obstacle(1, 3),
  obstacle(3, 4),
  obstacle(1, 6)
];

let units = [];
let selectedUnitId = null;
let drag = null;
let skillDrag = null;
let duel = null;
let idCounter = 100;
let selectedSaveId = null;
let pendingConfirm = null;
let activeSkill = null;
const SAVE_KEY = "trpg-battle-board-saves";
const WEBHOOK_KEY = "trpg-battle-board-discord-webhook";

function unit(type, label, x, y, name, overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    x,
    y,
    stats: {
      name,
      hp: overrides.hp ?? 20,
      maxHp: overrides.maxHp ?? 20,
      stamina: overrides.stamina ?? 10,
      maxStamina: overrides.maxStamina ?? 10,
      attack: overrides.attack ?? 5,
      defense: overrides.defense ?? 1,
      move: overrides.move ?? 3,
      primary: {
        str: overrides.primary?.str ?? 10,
        con: overrides.primary?.con ?? 10,
        spd: overrides.primary?.spd ?? 10,
        pre: overrides.primary?.pre ?? 10,
        int: overrides.primary?.int ?? 10,
        wis: overrides.primary?.wis ?? 10,
        cha: overrides.primary?.cha ?? 10
      },
      bonus: {
        str: overrides.bonus?.str ?? 0,
        con: overrides.bonus?.con ?? 0,
        spd: overrides.bonus?.spd ?? 0,
        pre: overrides.bonus?.pre ?? 0,
        int: overrides.bonus?.int ?? 0,
        wis: overrides.bonus?.wis ?? 0,
        cha: overrides.bonus?.cha ?? 0
      },
      skills: overrides.skills ?? []
    }
  };
}

function obstacle(x, y) {
  return unit("obstacle", "×", x, y, "장애물", {
    hp: 999,
    maxHp: 999,
    stamina: 0,
    maxStamina: 0,
    attack: 0,
    defense: 999,
    move: 0,
    primary: { str: 0, con: 0, spd: 0, pre: 0, int: 0, wis: 0, cha: 0 },
    bonus: { str: 0, con: 0, spd: 0, pre: 0, int: 0, wis: 0, cha: 0 }
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function render() {
  board.innerHTML = "";
  board.style.setProperty("--cols", String(cols));
  board.style.setProperty("--rows", String(rows));
  board.style.gridTemplateColumns = `repeat(${cols}, var(--cell))`;
  board.style.gridTemplateRows = `repeat(${rows}, var(--cell))`;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      board.append(cell);
    }
  }

  units.forEach((piece) => {
    const cell = getCell(piece.x, piece.y);
    if (!cell) return;

    const el = document.createElement("button");
    el.className = `piece ${piece.type}${piece.id === selectedUnitId ? " selected" : ""}`;
    el.type = "button";
    el.dataset.id = piece.id;
    el.textContent = piece.label;
    el.title = `${piece.stats.name} | HP ${piece.stats.hp}/${piece.stats.maxHp} | STM ${piece.stats.stamina}/${piece.stats.maxStamina}`;
    el.addEventListener("pointerdown", startDrag);
    cell.append(el);
  });
}

function renderSheet() {
  const piece = getUnit(selectedUnitId);
  const showSheet = Boolean(piece);

  emptyDetail.hidden = showSheet;
  unitSheet.hidden = !showSheet;

  if (!piece) return;
  ensureUnitShape(piece);

  sheetType.textContent = typeLabel(piece.type);
  sheetName.value = piece.stats.name;
  inputs.hp.value = String(piece.stats.hp);
  inputs.maxHp.value = String(piece.stats.maxHp);
  inputs.stamina.value = String(piece.stats.stamina);
  inputs.maxStamina.value = String(piece.stats.maxStamina);
  deleteUnit.disabled = piece.type === "player";

  primaryStats.innerHTML = PRIMARY_STATS.map(([key, label]) => `
    <label class="stat-field">
      ${label}
      <span>
        <small>기본</small>
        <input type="number" min="0" max="30" data-stat="${key}" value="${piece.stats.primary[key]}">
      </span>
      <span>
        <small>보너스</small>
        <input type="number" min="-99" max="99" data-bonus="${key}" value="${piece.stats.bonus[key]}">
      </span>
    </label>
  `).join("");

  renderSkills(piece);
}

function ensureUnitShape(piece) {
  piece.stats.maxHp ??= piece.stats.hp ?? 20;
  piece.stats.hp ??= piece.stats.maxHp;
  piece.stats.maxStamina ??= piece.stats.stamina ?? 10;
  piece.stats.stamina ??= piece.stats.maxStamina;
  piece.stats.primary ??= {};
  piece.stats.bonus ??= {};
  PRIMARY_STATS.forEach(([key]) => {
    piece.stats.primary[key] ??= piece.type === "obstacle" ? 0 : 10;
    piece.stats.bonus[key] ??= 0;
  });
  piece.stats.skills ??= [];
  piece.stats.skills.forEach((skill) => {
    skill.id ??= crypto.randomUUID();
    skill.name ??= "이름 없는 스킬";
    skill.stat ??= "str";
    skill.desc ??= "";
  });
}

function renderSkills(piece) {
  if (!piece.stats.skills.length) {
    skillList.innerHTML = `<button class="skill-empty" type="button">+ 스킬 추가</button>`;
    skillList.querySelector(".skill-empty").addEventListener("click", addSkill);
    return;
  }

  const statOptions = (selected) => PRIMARY_STATS.map(([key, label]) => `
    <option value="${key}" ${selected === key ? "selected" : ""}>${label}</option>
  `).join("");

  skillList.innerHTML = piece.stats.skills.map((skill, index) => `
    <article class="skill-card${isActiveSkill(piece, index) ? " active-skill" : ""}" draggable="true" data-skill="${index}">
      <input type="text" data-skill-name="${index}" value="${escapeHtml(skill.name)}" aria-label="스킬 이름">
      <label class="skill-stat-row">
        스킬판정
        <select data-skill-stat="${index}" aria-label="스킬판정 능력치">
          ${statOptions(skill.stat)}
        </select>
      </label>
      <textarea data-skill-desc="${index}" aria-label="스킬 설명">${escapeHtml(skill.desc)}</textarea>
    </article>
  `).join("");

  skillList.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("dragstart", startSkillDrag);
    card.addEventListener("dragend", endSkillDrag);
  });

  skillList.querySelectorAll("[data-skill-stat]").forEach((select) => {
    select.addEventListener("change", () => setActiveSkill(piece.id, Number(select.dataset.skillStat), select.value));
    select.addEventListener("click", () => setActiveSkill(piece.id, Number(select.dataset.skillStat), select.value));
  });
}

function isActiveSkill(piece, index) {
  return activeSkill?.unitId === piece.id && activeSkill?.index === index;
}

function selectUnit(id) {
  selectedUnitId = id;
  render();
  renderSheet();
}

function typeLabel(type) {
  return {
    player: "플레이어",
    ally: "아군",
    enemy: "적군",
    obstacle: "장애물"
  }[type];
}

function getCell(x, y) {
  return board.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function getUnitAt(x, y) {
  return units.find((piece) => piece.x === x && piece.y === y);
}

function getUnit(id) {
  return units.find((piece) => piece.id === id);
}

function startDrag(event) {
  if (event.button !== 0) return;

  const piece = getUnit(event.currentTarget.dataset.id);
  if (!piece) return;

  event.preventDefault();
  event.currentTarget.setPointerCapture(event.pointerId);

  drag = {
    id: piece.id,
    el: event.currentTarget
  };

  drag.el.classList.add("dragging");
  moveGhost(event.clientX, event.clientY);
  highlightTargets(piece);

  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", endDrag, { once: true });
}

function onDragMove(event) {
  if (!drag) return;
  moveGhost(event.clientX, event.clientY);
}

function moveGhost(x, y) {
  drag.el.style.left = `${x}px`;
  drag.el.style.top = `${y}px`;
}

function endDrag(event) {
  window.removeEventListener("pointermove", onDragMove);

  if (!drag) return;

  const piece = getUnit(drag.id);
  const targetCell = document.elementFromPoint(event.clientX, event.clientY)?.closest(".cell");
  const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
  const droppedOnSide = dropTarget?.closest("#duelBar, #detailBar");

  clearHighlights();
  drag.el.classList.remove("dragging");
  drag.el.style.left = "";
  drag.el.style.top = "";

  if (piece && droppedOnSide) {
    deleteDraggedUnit(piece);
  } else if (piece && targetCell) {
    const x = Number(targetCell.dataset.x);
    const y = Number(targetCell.dataset.y);
    resolveDrop(piece, x, y);
  }

  drag = null;
  render();
  renderSheet();
}

function resolveDrop(piece, x, y) {
  const target = getUnitAt(x, y);

  if (!target) {
    piece.x = x;
    piece.y = y;
    writeLog(`${piece.stats.name} 이동: (${x + 1}, ${y + 1})`, "↦");
    return;
  }

  if (target.id === piece.id) {
    return;
  }

  if (target.type === "obstacle") {
    writeLog("장애물이 있어 이동할 수 없습니다.", "×");
    return;
  }

  if (isEnemy(piece, target)) {
    attack(piece, target);
    return;
  }

  writeLog("같은 편 유닛 위로는 이동할 수 없습니다.", "!");
}

function isEnemy(attacker, target) {
  if (attacker.type === "obstacle" || target.type === "obstacle") return false;
  if (attacker.type === "enemy") return target.type === "ally" || target.type === "player";
  return target.type === "enemy";
}

function attack(attacker, defender) {
  prepareDuel(attacker, defender);

  const damage = Math.max(1, attacker.stats.attack - defender.stats.defense);
  defender.stats.hp = clamp(defender.stats.hp - damage, 0, defender.stats.maxHp);

  const defenderEl = board.querySelector(`.piece[data-id="${defender.id}"]`);
  defenderEl?.classList.add("hit");

  if (defender.stats.hp <= 0) {
    units = units.filter((piece) => piece.id !== defender.id);
    if (selectedUnitId === defender.id) selectedUnitId = attacker.id;
    writeLog(`${attacker.stats.name} 공격! ${defender.stats.name}에게 ${damage} 피해. 격파!`, "⚔");
    return;
  }

  writeLog(`${attacker.stats.name} 공격! ${defender.stats.name}에게 ${damage} 피해. HP ${defender.stats.hp}`, "⚔");
}

function highlightTargets(piece) {
  document.querySelectorAll(".cell").forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    const target = getUnitAt(x, y);

    if (!target) {
      cell.classList.add("target");
    } else if (isEnemy(piece, target)) {
      cell.classList.add("attack-target");
    }
  });
}

function clearHighlights() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("target", "attack-target");
  });
}

function syncSheetToUnit() {
  const piece = getUnit(selectedUnitId);
  if (!piece) return;

  piece.stats.name = sheetName.value.trim() || piece.stats.name;
  piece.stats.maxHp = clamp(Number(inputs.maxHp.value) || 1, 1, 999);
  piece.stats.hp = clamp(Number(inputs.hp.value) || 0, 0, piece.stats.maxHp);
  piece.stats.maxStamina = clamp(Number(inputs.maxStamina.value) || 0, 0, 999);
  piece.stats.stamina = clamp(Number(inputs.stamina.value) || 0, 0, piece.stats.maxStamina);

  primaryStats.querySelectorAll("[data-stat]").forEach((input) => {
    piece.stats.primary[input.dataset.stat] = clamp(Number(input.value) || 0, 0, 30);
  });

  primaryStats.querySelectorAll("[data-bonus]").forEach((input) => {
    piece.stats.bonus[input.dataset.bonus] = clamp(Number(input.value) || 0, -99, 99);
  });

  skillList.querySelectorAll("[data-skill-name]").forEach((input) => {
    const index = Number(input.dataset.skillName);
    if (piece.stats.skills[index]) piece.stats.skills[index].name = input.value.trim() || "이름 없는 스킬";
  });

  skillList.querySelectorAll("[data-skill-stat]").forEach((input) => {
    const index = Number(input.dataset.skillStat);
    if (piece.stats.skills[index]) piece.stats.skills[index].stat = input.value;
  });

  skillList.querySelectorAll("[data-skill-desc]").forEach((input) => {
    const index = Number(input.dataset.skillDesc);
    if (piece.stats.skills[index]) piece.stats.skills[index].desc = input.value;
  });

  render();
}

function removeSelectedUnit() {
  const piece = getUnit(selectedUnitId);
  if (!piece || piece.type === "player") return;

  units = units.filter((item) => item.id !== piece.id);
  writeLog(`${piece.stats.name} 삭제 완료.`, "×");
  selectedUnitId = null;
  render();
  renderSheet();
}

function addSkill() {
  const piece = getUnit(selectedUnitId);
  if (!piece) return;

  syncSheetToUnit();
  piece.stats.skills.push({
    id: crypto.randomUUID(),
    name: `스킬 ${piece.stats.skills.length + 1}`,
    stat: "str",
    desc: ""
  });
  renderSheet();
}

function startSkillDrag(event) {
  syncSheetToUnit();
  skillDrag = {
    unitId: selectedUnitId,
    index: Number(event.currentTarget.dataset.skill)
  };
  event.currentTarget.classList.add("dragging-skill");
  event.dataTransfer.effectAllowed = "move";
}

function endSkillDrag(event) {
  event.currentTarget.classList.remove("dragging-skill");
  const piece = getUnit(skillDrag?.unitId);
  const outsideDetail = !detailBar.contains(document.elementFromPoint(event.clientX, event.clientY));

  if (piece && outsideDetail) {
    const removed = piece.stats.skills.splice(skillDrag.index, 1)[0];
    writeLog(`${removed.name} 스킬 삭제.`, "×");
    renderSheet();
  }

  skillDrag = null;
}

function addUnit(type) {
  const empty = findEmptyCell();
  if (!empty) {
    writeLog("빈 칸이 없습니다.", "!");
    return;
  }

  if (type === "obstacle") {
    const added = obstacle(empty.x, empty.y);
    units.push(added);
    selectedUnitId = added.id;
    writeLog("장애물을 추가했습니다.", "+");
  } else {
    idCounter += 1;
    const label = type === "ally" ? "A" : "E";
    const name = type === "ally" ? `아군 ${idCounter}` : `적군 ${idCounter}`;
    const added = unit(type, label, empty.x, empty.y, name, {});
    units.push(added);
    selectedUnitId = added.id;
    writeLog(`${name} 추가 완료.`, "+");
  }

  render();
  renderSheet();
}

function findEmptyCell() {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!getUnitAt(x, y)) return { x, y };
    }
  }
  return null;
}

function writeLog(text, icon = "⚔") {
  logIcon.textContent = icon;
  logText.textContent = text;
}

function resetToBlank() {
  openMapModal();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => addUnit(button.dataset.add));
});

discordWebhook.value = localStorage.getItem(WEBHOOK_KEY) || "";
discordWebhook.addEventListener("input", () => {
  localStorage.setItem(WEBHOOK_KEY, discordWebhook.value.trim());
});

function prepareDuel(attacker, defender) {
  duel = {
    attackerId: attacker.id,
    defenderId: defender.id,
    attackerStat: activeSkill?.unitId === attacker.id ? activeSkill.stat : null,
    defenderStat: null,
    result: null
  };
  renderDuel();
}

function renderDuel() {
  const attacker = getUnit(duel?.attackerId);
  const defender = getUnit(duel?.defenderId);
  const ready = Boolean(attacker && defender);

  duelTitle.textContent = ready ? "전투 상황" : "대기 중";
  duelUnits.innerHTML = ready
    ? `
      <div class="duel-card"><small>공격자</small><b>${attacker.stats.name}</b></div>
      <div class="duel-card"><small>방어자</small><b>${defender.stats.name}</b></div>
    `
    : `<p>적 유닛 위로 드래그하면 판정 대결이 준비됩니다.</p>`;

  const statButtons = (side, activeKey) => PRIMARY_STATS.map(([key, label]) => `
    <button class="duel-stat${activeKey === key ? " active" : ""}" type="button" data-duel-side="${side}" data-duel-stat="${key}" ${ready ? "" : "disabled"}>
      ${label}
    </button>
  `).join("");

  duelStats.innerHTML = `
    <section class="duel-side">
      <h3>공격자 능력치</h3>
      <div class="duel-stat-grid">${statButtons("attacker", duel?.attackerStat)}</div>
    </section>
    <section class="duel-side">
      <h3>방어자 능력치</h3>
      <div class="duel-stat-grid">${statButtons("defender", duel?.defenderStat)}</div>
    </section>
  `;

  duelStats.querySelectorAll("[data-duel-stat]").forEach((button) => {
    button.addEventListener("click", () => toggleDuelStat(button.dataset.duelSide, button.dataset.duelStat));
  });

  if (!duel?.result) {
    duelResult.innerHTML = `<span>공격자와 방어자 능력치를 각각 선택하세요.</span>`;
    return;
  }

  const attackerLabel = PRIMARY_STATS.find(([key]) => key === duel.result.attackerStat)?.[1] ?? "공격";
  const defenderLabel = PRIMARY_STATS.find(([key]) => key === duel.result.defenderStat)?.[1] ?? "방어";
  duelResult.innerHTML = `
    <div class="duel-roll"><span>공격자 ${attackerLabel}</span><b>${duel.result.attackerTotal}</b></div>
    <div class="duel-diff">결과값: 방어자 - 공격자 = ${duel.result.diff}</div>
    <div class="duel-roll"><span>방어자 ${defenderLabel}</span><b>${duel.result.defenderTotal}</b></div>
    <div class="duel-winner">${duel.result.winner}</div>
  `;
}

function toggleDuelStat(side, stat) {
  const attacker = getUnit(duel?.attackerId);
  const defender = getUnit(duel?.defenderId);
  if (!attacker || !defender) return;

  const key = side === "attacker" ? "attackerStat" : "defenderStat";
  if (duel[key] === stat) {
    duel[key] = null;
    duel.result = null;
    renderDuel();
    return;
  }

  duel[key] = stat;
  duel.result = null;
  if (!duel.attackerStat || !duel.defenderStat) {
    renderDuel();
    return;
  }

  rollDuel();
  renderDuel();
}

function rollDuel() {
  const attacker = getUnit(duel?.attackerId);
  const defender = getUnit(duel?.defenderId);
  if (!attacker || !defender || !duel.attackerStat || !duel.defenderStat) return;

  ensureUnitShape(attacker);
  ensureUnitShape(defender);

  const attackerRoll = rollDie(attacker.stats.primary[duel.attackerStat]);
  const defenderRoll = rollDie(defender.stats.primary[duel.defenderStat]);
  const attackerTotal = attackerRoll + attacker.stats.bonus[duel.attackerStat];
  const defenderTotal = defenderRoll + defender.stats.bonus[duel.defenderStat];
  const diff = defenderTotal - attackerTotal;

  duel.result = {
    attackerStat: duel.attackerStat,
    defenderStat: duel.defenderStat,
    attackerTotal,
    defenderTotal,
    diff,
    winner: diff < 0
      ? `${attacker.stats.name} 우세`
      : diff > 0
        ? `${defender.stats.name} 우세`
        : "동률"
  };

  const usedSkill = getActiveSkillName();
  clearActiveSkill();
  sendDiscordRoll(attacker, defender, duel.result, usedSkill);
}

function rollDie(sides) {
  return Math.floor(Math.random() * Math.max(1, Number(sides) || 1)) + 1;
}

function setActiveSkill(unitId, index, stat) {
  const piece = getUnit(unitId);
  if (!piece?.stats.skills[index]) return;

  syncSheetToUnit();
  activeSkill = { unitId, index, stat };

  if (duel?.attackerId === unitId) {
    duel.attackerStat = stat;
    duel.result = null;
    if (duel.defenderStat) rollDuel();
    renderDuel();
  }

  renderSheet();
}

function clearActiveSkill() {
  activeSkill = null;
  renderSheet();
}

function getActiveSkillName() {
  const piece = getUnit(activeSkill?.unitId);
  return piece?.stats.skills[activeSkill.index]?.name ?? "";
}

function sendDiscordRoll(attacker, defender, result, skillName) {
  const webhookUrl = discordWebhook.value.trim();
  if (!webhookUrl) return;

  const content = [
    `**${attacker.stats.name}**: **${result.attackerTotal}**`,
    `**${defender.stats.name}**: **${result.defenderTotal}**`
  ].join("\n");

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, username: "TRPG Battle Board" })
  }).catch(() => {
    writeLog("디스코드 출력에 실패했습니다. 웹훅 URL을 확인하세요.", "!");
  });
}

function deleteDraggedUnit(piece) {
  if (piece.type === "player") {
    writeLog("플레이어 말은 삭제할 수 없습니다.", "!");
    return;
  }

  units = units.filter((item) => item.id !== piece.id);
  if (selectedUnitId === piece.id) selectedUnitId = null;
  if (duel?.attackerId === piece.id || duel?.defenderId === piece.id) duel = null;
  writeLog(`${piece.stats.name} 삭제 완료.`, "×");
}

function openMapModal() {
  mapInputs.cols.value = String(cols);
  mapInputs.rows.value = String(rows);
  mapInputs.allies.value = "3";
  mapInputs.enemies.value = "4";
  mapInputs.obstacles.value = "5";
  renderSaveList();
  mapModal.hidden = false;
}

function closeMapResetModal() {
  mapModal.hidden = true;
}

function buildMapFromForm(event) {
  event.preventDefault();
  const nextCols = clamp(Number(mapInputs.cols.value) || 10, 4, 30);
  const nextRows = clamp(Number(mapInputs.rows.value) || 8, 4, 30);
  const allyCount = clamp(Number(mapInputs.allies.value) || 0, 0, nextCols * nextRows);
  const enemyCount = clamp(Number(mapInputs.enemies.value) || 0, 0, nextCols * nextRows);
  const obstacleCount = clamp(Number(mapInputs.obstacles.value) || 0, 0, nextCols * nextRows);

  cols = nextCols;
  rows = nextRows;
  units = generateMapUnits(allyCount, enemyCount, obstacleCount);
  selectedUnitId = null;
  duel = null;
  activeSkill = null;
  closeMapResetModal();
  writeLog(`배틀맵 [${cols} x ${rows}] 생성 완료.`, "↻");
  render();
  renderSheet();
  renderDuel();
}

function openSaveLoadModal() {
  renderSaveList();
  saveLoadModal.hidden = false;
}

function closeSaveLoad() {
  saveLoadModal.hidden = true;
}

function getSaves() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setSaves(saves) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
}

function renderSaveList() {
  const saves = getSaves();
  const targets = [saveList, mapSaveList].filter(Boolean);
  if (!saves.length) {
    selectedSaveId = null;
    targets.forEach((target) => {
      target.innerHTML = `<div class="empty-save">저장된 기록이 없습니다.</div>`;
    });
    return;
  }

  if (!saves.some((save) => save.id === selectedSaveId)) selectedSaveId = null;
  const markup = saves.map((save) => `
    <button class="save-entry${save.id === selectedSaveId ? " active" : ""}" type="button" data-save-id="${save.id}">
      <span>
        <b>${escapeHtml(save.name)}</b>
        <small>${save.cols} x ${save.rows} | 유닛 ${save.units.length}개</small>
      </span>
      <small>${escapeHtml(save.savedAt)}</small>
    </button>
  `).join("");

  targets.forEach((target) => {
    target.innerHTML = markup;
    target.querySelectorAll("[data-save-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedSaveId = selectedSaveId === button.dataset.saveId ? null : button.dataset.saveId;
        renderSaveList();
      });
    });
  });
}

function requestSaveMap() {
  if (selectedSaveId) {
    openConfirm("덮어쓰기", "선택한 저장 기록을 현재 맵으로 덮어쓰기 하겠습니까?", overwriteSelectedSave);
    return;
  }

  saveNameInput.value = "";
  nameModal.hidden = false;
  saveNameInput.focus();
}

function closeNameInput() {
  nameModal.hidden = true;
}

function createNewSave(event) {
  event.preventDefault();
  const name = saveNameInput.value.trim();
  if (!name) return;

  const saves = getSaves();
  const save = buildSave(name);
  saves.unshift(save);
  setSaves(saves);
  selectedSaveId = save.id;
  closeNameInput();
  renderSaveList();
  writeLog(`${name} 저장 완료.`, "✓");
}

function overwriteSelectedSave() {
  const saves = getSaves();
  const target = saves.find((save) => save.id === selectedSaveId);
  if (!target) return;

  const next = buildSave(target.name, target.id);
  setSaves(saves.map((save) => save.id === selectedSaveId ? next : save));
  renderSaveList();
  writeLog(`${target.name} 덮어쓰기 완료.`, "✓");
}

function requestLoadMap() {
  if (!selectedSaveId) {
    writeLog("불러올 저장 기록을 선택하세요.", "!");
    return;
  }

  openConfirm("불러오기", "선택한 저장 기록을 불러오기 하겠습니까?", loadSelectedSave);
}

function loadSelectedSave() {
  const save = getSaves().find((item) => item.id === selectedSaveId);
  if (!save) return;

  cols = save.cols;
  rows = save.rows;
  units = structuredClone(save.units);
  selectedUnitId = null;
  duel = null;
  activeSkill = null;
  closeSaveLoad();
  closeMapResetModal();
  writeLog(`${save.name} 불러오기 완료.`, "↩");
  render();
  renderSheet();
  renderDuel();
}

function buildSave(name, id = crypto.randomUUID()) {
  return {
    id,
    name,
    cols,
    rows,
    units: structuredClone(units),
    savedAt: new Date().toLocaleString("ko-KR")
  };
}

function openConfirm(title, message, onYes) {
  pendingConfirm = onYes;
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  confirmModal.hidden = false;
}

function closeConfirm() {
  pendingConfirm = null;
  confirmModal.hidden = true;
}

function acceptConfirm() {
  const action = pendingConfirm;
  closeConfirm();
  action?.();
}

function generateMapUnits(allyCount, enemyCount, obstacleCount) {
  const generated = [];
  const occupied = new Set();
  const put = (piece) => {
    occupied.add(`${piece.x},${piece.y}`);
    generated.push(piece);
  };
  const nextEmpty = (preferRight = false) => {
    const xRange = [...Array(cols).keys()];
    const yRange = [...Array(rows).keys()];
    if (preferRight) xRange.reverse();
    for (const x of xRange) {
      for (const y of yRange) {
        if (!occupied.has(`${x},${y}`)) return { x, y };
      }
    }
    return null;
  };

  put(unit("player", "P", 0, Math.floor(rows / 2), "플레이어", { hp: 30, maxHp: 30, stamina: 14, maxStamina: 14, attack: 8, defense: 3, move: 4 }));

  for (let i = 1; i <= allyCount; i += 1) {
    const spot = nextEmpty(false);
    if (!spot) break;
    put(unit("ally", String(i), spot.x, spot.y, `아군 ${i}`, { hp: 18, maxHp: 18, stamina: 12, maxStamina: 12, attack: 5, defense: 1, move: 4 }));
  }

  for (let i = 1; i <= enemyCount; i += 1) {
    const spot = nextEmpty(true);
    if (!spot) break;
    put(unit("enemy", String(i), spot.x, spot.y, `적군 ${i}`, { hp: 20, maxHp: 20, stamina: 10, maxStamina: 10, attack: 6, defense: 2, move: 3 }));
  }

  for (let i = 0; i < obstacleCount; i += 1) {
    const spot = nextEmpty(i % 2 === 0);
    if (!spot) break;
    put(obstacle(spot.x, spot.y));
  }

  return generated;
}

board.addEventListener("contextmenu", (event) => {
  const pieceElement = event.target.closest(".piece");
  if (!pieceElement) return;

  event.preventDefault();
  event.stopPropagation();
  selectUnit(pieceElement.dataset.id);
  writeLog("선택한 유닛의 상세 능력치를 표시했습니다.", "◆");
});

unitSheet.addEventListener("input", syncSheetToUnit);
unitSheet.addEventListener("submit", (event) => event.preventDefault());
addSkillButton.addEventListener("click", addSkill);
deleteUnit.addEventListener("click", removeSelectedUnit);
resetMap.addEventListener("click", resetToBlank);
saveLoadMap.addEventListener("click", openSaveLoadModal);
mapModal.addEventListener("submit", buildMapFromForm);
closeMapModal.addEventListener("click", closeMapResetModal);
cancelMapModal.addEventListener("click", closeMapResetModal);
closeSaveLoadModal.addEventListener("click", closeSaveLoad);
saveMapButton.addEventListener("click", requestSaveMap);
loadMapButton.addEventListener("click", requestLoadMap);
mapSaveButton.addEventListener("click", requestSaveMap);
mapLoadButton.addEventListener("click", requestLoadMap);
nameModal.addEventListener("submit", createNewSave);
closeNameModal.addEventListener("click", closeNameInput);
cancelNameModal.addEventListener("click", closeNameInput);
confirmYes.addEventListener("click", acceptConfirm);
confirmNo.addEventListener("click", closeConfirm);

document.addEventListener("contextmenu", (event) => {
  if (!event.target.closest(".piece")) event.preventDefault();
});

render();
renderSheet();
renderDuel();
writeLog("맵을 생성하거나 저장된 맵을 불러오세요.", "↻");
openMapModal();
