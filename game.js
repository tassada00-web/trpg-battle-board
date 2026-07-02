let cols = 10;
let rows = 8;
let activeMode = "exploration";

const explorationApp = document.querySelector("#explorationApp");
const battleApp = document.querySelector("#battleApp");
const explorationBoard = document.querySelector("#explorationBoard");
const explorationSize = document.querySelector("#explorationSize");
const explorationForks = document.querySelector("#explorationForks");
const explorationGoals = document.querySelector("#explorationGoals");
const createExploration = document.querySelector("#createExploration");
const explorationStepsInput = document.querySelector("#explorationStepsInput");
const applyExplorationSteps = document.querySelector("#applyExplorationSteps");
const explorationStepsLeft = document.querySelector("#explorationStepsLeft");
const toggleExplorationFog = document.querySelector("#toggleExplorationFog");
const explorationPosition = document.querySelector("#explorationPosition");
const explorationTileText = document.querySelector("#explorationTileText");
const explorationLog = document.querySelector("#explorationLog");
const openBattleMode = document.querySelector("#openBattleMode");
const openExplorationSaves = document.querySelector("#openExplorationSaves");
const backToExploration = document.querySelector("#backToExploration");
const board = document.querySelector("#board");
const boardWrap = document.querySelector(".board-wrap");
const logText = document.querySelector("#battleLog");
const logIcon = document.querySelector("#logIcon");
const emptyDetail = document.querySelector("#emptyDetail");
const unitSheet = document.querySelector("#unitSheet");
const detailBar = document.querySelector("#detailBar");
const sheetType = document.querySelector("#sheetType");
const sheetName = document.querySelector("#sheetName");
const sheetImportBox = document.querySelector("#sheetImportBox");
const sheetImportFile = document.querySelector("#sheetImportFile");
const primaryStats = document.querySelector("#primaryStats");
const skillList = document.querySelector("#skillList");
const addSkillButton = document.querySelector("#addSkill");
const deleteUnit = document.querySelector("#deleteUnit");
const resetMap = document.querySelector("#resetMap");
const editMap = document.querySelector("#editMap");
const saveLoadMap = document.querySelector("#saveLoadMap");
const captureMapImage = document.querySelector("#captureMapImage");
const duelTitle = document.querySelector("#duelTitle");
const duelUnits = document.querySelector("#duelUnits");
const duelStats = document.querySelector("#duelStats");
const duelResult = document.querySelector("#duelResult");
const skipDamageCalculation = document.querySelector("#skipDamageCalculation");
const discordWebhook = document.querySelector("#discordWebhook");
const mapModal = document.querySelector("#mapModal");
const closeMapModal = document.querySelector("#closeMapModal");
const cancelMapModal = document.querySelector("#cancelMapModal");
const editMapModal = document.querySelector("#editMapModal");
const closeEditMapModal = document.querySelector("#closeEditMapModal");
const cancelEditMapModal = document.querySelector("#cancelEditMapModal");
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

const editMapInputs = {
  cols: document.querySelector("#editMapCols"),
  rows: document.querySelector("#editMapRows"),
  obstacles: document.querySelector("#editMapObstacles"),
  addAllies: document.querySelector("#editMapAddAllies"),
  addEnemies: document.querySelector("#editMapAddEnemies")
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
let explorationState = createEmptyExplorationState();
const SAVE_KEY = "trpg-battle-board-saves";
const WEBHOOK_KEY = "trpg-battle-board-discord-webhook";
const SKIP_DAMAGE_KEY = "trpg-battle-board-skip-damage";
const EXPLORATION_SIZE_PRESETS = {
  small: { cols: 22, rows: 14, distance: 14 },
  medium: { cols: 28, rows: 18, distance: 20 },
  large: { cols: 34, rows: 20, distance: 28 }
};
const EXPLORATION_TILE_LABELS = {
  start: "시작",
  normal: "일반",
  fortune: "행운",
  danger: "불행",
  goal: "목표"
};
const EXPLORATION_TILE_MESSAGES = {
  start: "출발점입니다. 다음 행동력을 기다립니다.",
  normal: "조용한 진행 구간입니다. 다음 장면을 이어가세요.",
  fortune: "행운 칸입니다. 보상, 단서, 유리한 판정을 줄 수 있습니다.",
  danger: "불행 칸입니다. 함정, 소모, 위협, 불리한 판정을 줄 수 있습니다.",
  goal: "목표 지점입니다. 이 구간의 목적지에 도달했습니다."
};
const SKILL_IMPORT_STOP_LABELS = new Set(["직업", "상태", "장비효과"]);
const SHEET_STAT_LABELS = {
  체력: "hp",
  스테미나: "stamina",
  스태미나: "stamina",
  힘: "str",
  건강: "con",
  속도: "spd",
  정밀: "pre",
  지능: "int",
  지혜: "wis",
  매력: "cha",
  데미지: "damage"
};

function createEmptyExplorationState() {
  return {
    cols: 0,
    rows: 0,
    tiles: [],
    player: { x: 0, y: 0 },
    goals: [],
    moveSteps: 0,
    fog: false,
    built: false,
    log: []
  };
}

function createExplorationTile(kind = "wall") {
  return {
    kind,
    open: kind !== "wall"
  };
}

function buildExplorationFromControls() {
  const preset = EXPLORATION_SIZE_PRESETS[explorationSize.value] ?? EXPLORATION_SIZE_PRESETS.large;
  const forkCount = clamp(Number(explorationForks.value) || 8, 1, 30);
  const goalCount = clamp(Number(explorationGoals.value) || 3, 1, 10);

  explorationState = generateExplorationState(preset, forkCount, goalCount);
  addExplorationLog(`탐험판 [${explorationState.cols} x ${explorationState.rows}] 생성 완료.`);
  renderExploration();
}

function generateExplorationState(preset, forkCount, goalCount) {
  const state = createEmptyExplorationState();
  state.cols = preset.cols;
  state.rows = preset.rows;
  state.built = true;
  state.player = { x: 1, y: Math.floor(preset.rows / 2) };
  state.tiles = Array.from({ length: preset.rows }, () =>
    Array.from({ length: preset.cols }, () => createExplorationTile())
  );

  const paths = [];
  const openCell = (x, y, kind = "normal") => {
    if (!isInsideExplorationBounds(state, x, y)) return false;
    const tile = state.tiles[y][x];
    if (!tile.open) paths.push({ x, y });
    state.tiles[y][x] = createExplorationTile(kind);
    return true;
  };

  openCell(state.player.x, state.player.y, "start");
  carveExplorationMainPath(state, paths, openCell, preset.distance);
  for (let i = 0; i < forkCount; i += 1) {
    carveExplorationBranch(state, paths, openCell);
  }

  const goals = chooseExplorationGoals(state, goalCount);
  goals.forEach(({ x, y }) => {
    state.tiles[y][x] = createExplorationTile("goal");
  });
  state.goals = goals;
  paintExplorationEvents(state);

  return state;
}

function carveExplorationMainPath(state, paths, openCell, distance) {
  let current = { ...state.player };
  const limit = distance * 3;

  for (let step = 0; step < limit && current.x < state.cols - 3; step += 1) {
    const directions = shuffleExplorationDirections([
      { x: 1, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ]);
    const next = directions
      .map((direction) => ({ x: current.x + direction.x, y: current.y + direction.y }))
      .find((point) => isInsideExplorationBounds(state, point.x, point.y));

    if (!next) break;
    current = next;
    openCell(current.x, current.y);
  }

  if (current.x < state.cols - 3) {
    for (let x = current.x + 1; x < state.cols - 2; x += 1) {
      current = { x, y: current.y };
      openCell(current.x, current.y);
    }
  }
}

function carveExplorationBranch(state, paths, openCell) {
  if (!paths.length) return;

  let current = paths[Math.floor(Math.random() * paths.length)];
  const length = 4 + Math.floor(Math.random() * 8);

  for (let step = 0; step < length; step += 1) {
    const directions = shuffleExplorationDirections([
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ]);
    const next = directions
      .map((direction) => ({ x: current.x + direction.x, y: current.y + direction.y }))
      .find((point) => (
        isInsideExplorationBounds(state, point.x, point.y) &&
        !state.tiles[point.y][point.x].open
      ));

    if (!next) break;
    current = next;
    openCell(current.x, current.y);
  }
}

function chooseExplorationGoals(state, goalCount) {
  const startKey = `${state.player.x},${state.player.y}`;
  const candidates = getExplorationOpenCells(state)
    .filter((point) => `${point.x},${point.y}` !== startKey)
    .sort((a, b) => {
      const aDeadEnd = countExplorationNeighbors(state, a.x, a.y) === 1 ? 1 : 0;
      const bDeadEnd = countExplorationNeighbors(state, b.x, b.y) === 1 ? 1 : 0;
      const aDistance = Math.abs(a.x - state.player.x) + Math.abs(a.y - state.player.y);
      const bDistance = Math.abs(b.x - state.player.x) + Math.abs(b.y - state.player.y);
      return (bDeadEnd - aDeadEnd) || (bDistance - aDistance);
    });

  return candidates.slice(0, goalCount);
}

function paintExplorationEvents(state) {
  const eventCells = shuffleExplorationDirections(
    getExplorationOpenCells(state).filter(({ x, y }) => state.tiles[y][x].kind === "normal")
  );

  eventCells.forEach(({ x, y }, index) => {
    if (index % 5 === 0) state.tiles[y][x] = createExplorationTile("fortune");
    if (index % 5 === 1) state.tiles[y][x] = createExplorationTile("danger");
  });
}

function getExplorationOpenCells(state) {
  const cells = [];
  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.cols; x += 1) {
      if (state.tiles[y][x].open) cells.push({ x, y });
    }
  }
  return cells;
}

function isInsideExplorationBounds(state, x, y) {
  return x > 0 && x < state.cols - 1 && y > 0 && y < state.rows - 1;
}

function countExplorationNeighbors(state, x, y) {
  return getExplorationNeighborPoints(state, x, y).length;
}

function getExplorationNeighborPoints(state, x, y) {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 }
  ].filter((point) => state.tiles[point.y]?.[point.x]?.open);
}

function shuffleExplorationDirections(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderExploration() {
  if (!explorationBoard) return;

  explorationBoard.innerHTML = "";
  explorationBoard.style.setProperty("--explore-cols", String(Math.max(1, explorationState.cols || 1)));
  explorationBoard.style.setProperty("--explore-rows", String(Math.max(1, explorationState.rows || 1)));
  explorationBoard.classList.toggle("fog-on", explorationState.fog);

  if (!explorationState.built) {
    renderExplorationStatus();
    renderExplorationLog();
    return;
  }

  for (let y = 0; y < explorationState.rows; y += 1) {
    for (let x = 0; x < explorationState.cols; x += 1) {
      const tile = explorationState.tiles[y][x];
      const cell = document.createElement("div");
      const isCurrent = explorationState.player.x === x && explorationState.player.y === y;
      const isMovable = isExplorationMoveTarget(x, y);
      cell.className = `explore-cell ${tile.open ? `path ${tile.kind}` : "wall"}${isCurrent ? " current" : ""}${isMovable ? " movable" : ""}`;
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);

      if (tile.kind === "start") cell.textContent = "S";
      if (tile.kind === "goal") cell.textContent = "G";
      if (isMovable) cell.addEventListener("click", () => moveExplorationPlayer(x, y));
      if (isCurrent) {
        const pawn = document.createElement("div");
        pawn.className = "explore-pawn";
        cell.textContent = "";
        cell.append(pawn);
      }

      explorationBoard.append(cell);
    }
  }

  renderExplorationStatus();
  renderExplorationLog();
}

function renderExplorationStatus() {
  if (!explorationPosition || !explorationTileText || !explorationStepsLeft || !toggleExplorationFog) return;

  explorationStepsLeft.textContent = String(explorationState.moveSteps);
  toggleExplorationFog.textContent = explorationState.fog ? "발판 보이기" : "발판 숨기기";

  if (!explorationState.built) {
    explorationPosition.textContent = "-";
    explorationTileText.textContent = "탐험판을 생성하면 진행 상태가 표시됩니다.";
    return;
  }

  const { x, y } = explorationState.player;
  const tile = explorationState.tiles[y][x];
  const label = EXPLORATION_TILE_LABELS[tile.kind] ?? "알 수 없음";
  explorationPosition.textContent = `(${x + 1}, ${y + 1})`;
  explorationTileText.textContent = `${label}: ${EXPLORATION_TILE_MESSAGES[tile.kind] ?? ""}`;
}

function renderExplorationLog() {
  if (!explorationLog) return;
  if (!explorationState.log.length) {
    explorationLog.innerHTML = `<p>탐험 기록이 없습니다.</p>`;
    return;
  }

  explorationLog.innerHTML = explorationState.log
    .map((entry) => `<p><b>${escapeHtml(entry.time)}</b> ${escapeHtml(entry.text)}</p>`)
    .join("");
}

function isExplorationMoveTarget(x, y) {
  if (!explorationState.built || explorationState.moveSteps <= 0) return false;
  if (!explorationState.tiles[y]?.[x]?.open) return false;
  const distance = Math.abs(explorationState.player.x - x) + Math.abs(explorationState.player.y - y);
  return distance === 1;
}

function applyExplorationMoveSteps() {
  if (!explorationState.built) {
    addExplorationLog("먼저 탐험판을 생성하세요.");
    return;
  }

  const steps = clamp(Number(explorationStepsInput.value) || 0, 0, 99);
  if (steps <= 0) return;
  explorationState.moveSteps = steps;
  explorationStepsInput.value = "";
  addExplorationLog(`행동력 ${steps} 주입.`);
  renderExploration();
}

function moveExplorationPlayer(x, y) {
  if (!isExplorationMoveTarget(x, y)) return;

  explorationState.player = { x, y };
  explorationState.moveSteps = Math.max(0, explorationState.moveSteps - 1);
  addExplorationLog(`이동: (${x + 1}, ${y + 1})`);

  if (explorationState.moveSteps === 0) {
    resolveCurrentExplorationTile();
  }

  renderExploration();
}

function resolveCurrentExplorationTile() {
  const { x, y } = explorationState.player;
  const tile = explorationState.tiles[y][x];
  const label = EXPLORATION_TILE_LABELS[tile.kind] ?? "칸";
  const message = EXPLORATION_TILE_MESSAGES[tile.kind] ?? "";
  addExplorationLog(`${label}: ${message}`);
}

function toggleExplorationFogMode() {
  if (!explorationState.built) return;
  explorationState.fog = !explorationState.fog;
  addExplorationLog(explorationState.fog ? "발판을 숨겼습니다." : "발판을 공개했습니다.");
  renderExploration();
}

function addExplorationLog(text) {
  const time = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  explorationState.log.unshift({ time, text });
  explorationState.log = explorationState.log.slice(0, 24);
  renderExplorationLog();
}

function buildExplorationSave() {
  return structuredClone(explorationState);
}

function restoreExplorationSave(savedExploration) {
  if (!savedExploration?.built || !Array.isArray(savedExploration.tiles)) {
    explorationState = createEmptyExplorationState();
    buildExplorationFromControls();
    return;
  }

  explorationState = {
    ...createEmptyExplorationState(),
    ...structuredClone(savedExploration),
    log: Array.isArray(savedExploration.log) ? structuredClone(savedExploration.log) : []
  };
  renderExploration();
}

function showMode(mode) {
  activeMode = mode === "battle" ? "battle" : "exploration";
  explorationApp.hidden = activeMode !== "exploration";
  battleApp.hidden = activeMode !== "battle";

  if (activeMode === "exploration") {
    renderExploration();
    return;
  }

  render();
  renderSheet();
  renderDuel();
}

function openBattleBoardFromExploration() {
  showMode("battle");
  if (!units.length) openMapModal();
}

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
      damage: overrides.damage ?? 0,
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
  `).join("") + `
    <label class="stat-field">
      데미지
      <span>
        <small>추가</small>
        <input type="number" min="0" max="999" data-damage value="${piece.stats.damage}">
      </span>
      <span class="stat-placeholder"></span>
    </label>
  `;

  renderSkills(piece);
}

function ensureUnitShape(piece) {
  piece.stats.maxHp ??= piece.stats.hp ?? 20;
  piece.stats.hp ??= piece.stats.maxHp;
  piece.stats.maxStamina ??= piece.stats.stamina ?? 10;
  piece.stats.stamina ??= piece.stats.maxStamina;
  piece.stats.damage ??= 0;
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
    <article class="skill-card${isActiveSkill(piece, index) ? " active-skill" : ""}" draggable="false" data-skill="${index}">
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
    card.addEventListener("pointerdown", prepareSkillCardDrag);
    card.addEventListener("mouseup", resetSkillCardDrag);
    card.addEventListener("click", activateSkillFromCard);
    card.addEventListener("dragstart", startSkillDrag);
    card.addEventListener("dragend", endSkillDrag);
  });

  skillList.querySelectorAll(".skill-card input, .skill-card select, .skill-card textarea").forEach((control) => {
    control.addEventListener("pointerdown", disableSkillControlDrag);
    control.addEventListener("mousedown", disableSkillControlDrag);
    control.addEventListener("click", stopSkillControlEvent);
    control.addEventListener("blur", restoreSkillControlDrag);
  });

  skillList.querySelectorAll("[data-skill-stat]").forEach((select) => {
    select.addEventListener("change", () => setActiveSkill(piece.id, Number(select.dataset.skillStat), select.value));
  });
}

function isActiveSkill(piece, index) {
  return activeSkill?.unitId === piece.id && activeSkill?.index === index;
}

function activateSkillFromCard(event) {
  if (event.target.closest("input, select, textarea, button, .skill-stat-row")) return;

  const piece = getUnit(selectedUnitId);
  const index = Number(event.currentTarget.dataset.skill);
  const skill = piece?.stats.skills[index];
  if (!skill) return;

  setActiveSkill(piece.id, index, skill.stat);
}

function prepareSkillCardDrag(event) {
  if (event.target.closest("input, select, textarea, button, .skill-stat-row")) return;
  event.currentTarget.draggable = true;
}

function resetSkillCardDrag(event) {
  event.currentTarget.draggable = false;
}

function disableSkillControlDrag(event) {
  event.stopPropagation();
  const card = event.currentTarget.closest(".skill-card");
  if (card) card.draggable = false;
}

function restoreSkillControlDrag(event) {
  const card = event.currentTarget.closest(".skill-card");
  if (card) card.draggable = false;
}

function stopSkillControlEvent(event) {
  event.stopPropagation();
}

function selectUnit(id, renderBoard = true) {
  selectedUnitId = id;
  if (renderBoard) render();
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

  selectUnit(piece.id, false);
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
  writeLog(`${attacker.stats.name} → ${defender.stats.name} 판정 대결 준비.`, "⚔");
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

  const damageInput = primaryStats.querySelector("[data-damage]");
  piece.stats.damage = clamp(Number(damageInput?.value) || 0, 0, 999);

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

function normalizeSheetText(value) {
  return String(value ?? "").replace(/\s+/g, "").trim();
}

function readCell(sheet, row, col) {
  const address = XLSX.utils.encode_cell({ r: row, c: col });
  return sheet[address]?.v ?? sheet[address]?.w ?? null;
}

function cleanSheetText(value) {
  return String(value ?? "").trim();
}

function findCharacterName(sheet, range) {
  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let col = range.s.c; col <= range.e.c; col += 1) {
      if (normalizeSheetText(readCell(sheet, row, col)) === "이름") {
        const name = readCell(sheet, row, col + 1);
        if (name) return String(name).trim();
      }
    }
  }
  return "";
}

function findSkillColumns(sheet, range) {
  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let col = range.s.c; col <= range.e.c; col += 1) {
      if (normalizeSheetText(readCell(sheet, row, col)) !== "스킬이름") continue;

      let contentCol = col + 1;
      for (let searchCol = col + 1; searchCol <= range.e.c; searchCol += 1) {
        if (normalizeSheetText(readCell(sheet, row, searchCol)) === "내용") {
          contentCol = searchCol;
          break;
        }
      }

      return { headerRow: row, nameCol: col, contentCol };
    }
  }

  return null;
}

function extractSkillsFromSheet(sheet, range) {
  const columns = findSkillColumns(sheet, range);
  if (!columns) return [];

  const skills = [];
  for (let row = columns.headerRow + 1; row <= range.e.r; row += 1) {
    const name = cleanSheetText(readCell(sheet, row, columns.nameCol));
    const desc = cleanSheetText(readCell(sheet, row, columns.contentCol));
    if (SKILL_IMPORT_STOP_LABELS.has(normalizeSheetText(name))) break;
    if (!name && !desc && skills.length) break;
    if (!name && !desc) continue;

    skills.push({
      id: crypto.randomUUID(),
      name: name || "이름 없는 스킬",
      stat: "str",
      desc
    });
  }

  return skills;
}

function findTotalLabelColumn(sheet, range, headerRow, totalCol) {
  for (let offset = 1; offset <= 3; offset += 1) {
    const col = totalCol - offset;
    if (col < range.s.c) break;
    if (normalizeSheetText(readCell(sheet, headerRow, col)) === "능력치") return col;
  }

  return totalCol - 1;
}

function totalTableHasCharacterName(sheet, range, headerRow, labelCol, totalCol, characterName) {
  const targetName = normalizeSheetText(characterName);
  if (!targetName) return false;

  const minRow = Math.max(range.s.r, headerRow - 4);
  const maxRow = headerRow - 1;
  const minCol = Math.max(range.s.c, labelCol - 1);
  const maxCol = Math.min(range.e.c, totalCol + 1);

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      if (normalizeSheetText(readCell(sheet, row, col)) === targetName) return true;
    }
  }

  return false;
}

function buildTotalCandidate(sheet, range, headerRow, totalCol, characterName) {
  const labelCol = findTotalLabelColumn(sheet, range, headerRow, totalCol);
  const totals = {};
  let count = 0;

  for (let row = headerRow + 1; row <= Math.min(range.e.r, headerRow + 24); row += 1) {
    const label = normalizeSheetText(readCell(sheet, row, labelCol));
    const key = SHEET_STAT_LABELS[label];
    const value = Number(readCell(sheet, row, totalCol));
    if (!key || !Number.isFinite(value)) continue;

    totals[key] = value;
    count += 1;
  }

  return {
    totals,
    count,
    hasCharacterName: totalTableHasCharacterName(sheet, range, headerRow, labelCol, totalCol, characterName)
  };
}

function extractTotalsFromWorkbook(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:A1");
  const name = findCharacterName(sheet, range);
  const totalCandidates = [];

  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let col = range.s.c; col <= range.e.c; col += 1) {
      if (normalizeSheetText(readCell(sheet, row, col)) !== "합계") continue;

      const candidate = buildTotalCandidate(sheet, range, row, col, name);
      if (candidate.count) totalCandidates.push(candidate);
    }
  }

  totalCandidates.sort((a, b) => {
    if (a.hasCharacterName !== b.hasCharacterName) return a.hasCharacterName ? -1 : 1;
    return b.count - a.count;
  });

  return {
    name,
    totals: totalCandidates[0]?.totals ?? {},
    skills: extractSkillsFromSheet(sheet, range)
  };
}

function applyImportedStats({ name, totals, skills = [] }) {
  const piece = getUnit(selectedUnitId);
  if (!piece) {
    writeLog("능력치를 적용할 말을 먼저 우클릭으로 선택하세요.", "!");
    return;
  }

  ensureUnitShape(piece);
  if (name) piece.stats.name = name;

  if (Number.isFinite(totals.hp)) {
    piece.stats.hp = Math.max(0, Math.round(totals.hp));
    piece.stats.maxHp = Math.max(1, Math.round(totals.hp));
  }

  if (Number.isFinite(totals.stamina)) {
    piece.stats.stamina = Math.max(0, Math.round(totals.stamina));
    piece.stats.maxStamina = Math.max(1, Math.round(totals.stamina));
  }

  PRIMARY_STATS.forEach(([key]) => {
    if (Number.isFinite(totals[key])) {
      piece.stats.primary[key] = Math.max(0, Math.round(totals[key]));
      piece.stats.bonus[key] = 0;
    }
  });

  if (Number.isFinite(totals.damage)) {
    piece.stats.damage = Math.max(0, Math.round(totals.damage));
  }

  if (skills.length) {
    piece.stats.skills = skills;
    clearActiveSkill();
  }

  render();
  renderSheet();
  renderDuel();
  writeLog(`${piece.stats.name} 능력치${skills.length ? `와 스킬 ${skills.length}개` : ""}를 엑셀에서 가져왔습니다.`, "↥");
}

async function importStatsFromFile(file) {
  if (!file) return;
  if (!window.XLSX) {
    writeLog("엑셀 읽기 도구를 불러오지 못했습니다. 인터넷 연결 후 새로고침해 주세요.", "!");
    return;
  }

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellFormula: true, cellDates: false });
    const parsed = extractTotalsFromWorkbook(workbook);
    if (!Object.keys(parsed.totals).length && !parsed.skills.length) {
      writeLog("엑셀에서 합계 능력치나 스킬 값을 찾지 못했습니다.", "!");
      return;
    }
    applyImportedStats(parsed);
  } catch {
    writeLog("엑셀 파일을 읽지 못했습니다.", "!");
  } finally {
    sheetImportFile.value = "";
  }
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
  if (event.target.closest("input, select, textarea, button, .skill-stat-row")) {
    event.preventDefault();
    return;
  }

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
  event.currentTarget.draggable = false;
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
    const label = type === "enemy" ? getNextExtraEnemyLabel() : "A";
    const name = type === "ally" ? `아군 ${idCounter}` : `적군 ${label}`;
    const added = unit(type, label, empty.x, empty.y, name, {});
    units.push(added);
    selectedUnitId = added.id;
    writeLog(`${name} 추가 완료.`, "+");
  }

  render();
  renderSheet();
}

function getNextExtraEnemyLabel(collection = units) {
  const maxIndex = collection.reduce((max, piece) => {
    if (piece.type !== "enemy") return max;
    const match = String(piece.label).match(/^E-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `E-${maxIndex + 1}`;
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

function getImageTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join("-") + "_" + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join("-");
}

async function captureBoardImage() {
  if (!window.html2canvas) {
    writeLog("이미지 캡처 도구를 불러오지 못했습니다. 새로고침 후 다시 시도하세요.", "!");
    return;
  }

  captureMapImage.disabled = true;

  try {
    const canvas = await window.html2canvas(boardWrap, {
      backgroundColor: "#050607",
      scale: 2,
      logging: false
    });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("image export failed");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trpg-battle-map-${getImageTimestamp()}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    const copied = await copyImageToClipboard(blob);
    writeLog(
      copied
        ? "중앙 전투판 이미지를 다운로드하고 클립보드에 복사했습니다."
        : "중앙 전투판 이미지를 다운로드했습니다. 클립보드 복사는 브라우저 권한 때문에 실패했습니다.",
      "▣"
    );
  } catch {
    writeLog("이미지 저장에 실패했습니다.", "!");
  } finally {
    captureMapImage.disabled = false;
  }
}

async function copyImageToClipboard(blob) {
  if (!navigator.clipboard?.write || !window.ClipboardItem) return false;

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    return true;
  } catch {
    return false;
  }
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

skipDamageCalculation.checked = localStorage.getItem(SKIP_DAMAGE_KEY) === "true";
skipDamageCalculation.addEventListener("change", () => {
  localStorage.setItem(SKIP_DAMAGE_KEY, String(skipDamageCalculation.checked));
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

  const statButtons = (side, activeKey) => [
    ...PRIMARY_STATS.map(([key, label]) => ({ key, label })),
    { key: "giveup", label: "포기" }
  ].map(({ key, label }) => `
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

  const attackerLabel = getDuelStatLabel(duel.result.attackerStat, "공격");
  const defenderLabel = getDuelStatLabel(duel.result.defenderStat, "방어");
  duelResult.innerHTML = `
    <div class="duel-roll"><span>공격자 ${attackerLabel}</span><b>${duel.result.attackerTotal}</b></div>
    <div class="duel-diff">결과값: 공격자 - 방어자 = ${duel.result.diff}</div>
    <div class="duel-damage">${duel.result.damage?.text ?? "피해 없음"}</div>
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

  const attackerTotal = getDuelTotal(attacker, duel.attackerStat);
  const defenderTotal = getDuelTotal(defender, duel.defenderStat);
  const diff = attackerTotal - defenderTotal;
  const damage = skipDamageCalculation.checked ? skipDuelDamage() : applyDuelDamage(attacker, defender, attackerTotal, defenderTotal);

  duel.result = {
    attackerStat: duel.attackerStat,
    defenderStat: duel.defenderStat,
    attackerTotal,
    defenderTotal,
    diff,
    damage,
    winner: diff > 0
      ? `${attacker.stats.name} 우세`
      : diff < 0
        ? `${defender.stats.name} 우세`
        : "동률"
  };

  const usedSkill = getActiveSkillName();
  clearActiveSkill();
  writeLog(damage.amount > 0 ? `${damage.text} 적용.` : damage.text, "⚔");
  sendDiscordRoll(attacker, defender, duel.result, usedSkill);
  render();
  renderSheet();
}

function rollDie(sides) {
  return Math.floor(Math.random() * Math.max(1, Number(sides) || 1)) + 1;
}

function getDuelStatLabel(stat, fallback) {
  if (stat === "giveup") return "포기";
  return PRIMARY_STATS.find(([key]) => key === stat)?.[1] ?? fallback;
}

function getDuelTotal(piece, stat) {
  if (stat === "giveup") return 0;
  return rollDie(piece.stats.primary[stat]) + piece.stats.bonus[stat];
}

function skipDuelDamage() {
  return {
    amount: 0,
    skipped: true,
    text: "데미지 계산안함"
  };
}

function applyDuelDamage(attacker, defender, attackerTotal, defenderTotal) {
  if (attackerTotal <= defenderTotal) {
    return {
      amount: 0,
      text: defenderTotal > attackerTotal ? "방어자 우세. 피해 없음." : "판정 동률. 피해 없음."
    };
  }

  const target = defender;
  const bonusDamage = clamp(Number(attacker.stats.damage) || 0, 0, 999);
  const amount = attackerTotal + bonusDamage;
  const damageFormula = bonusDamage > 0
    ? `판정 ${attackerTotal} + 데미지 ${bonusDamage}`
    : `판정 ${attackerTotal}`;
  target.stats.hp = clamp(target.stats.hp - amount, 0, target.stats.maxHp);

  board.querySelector(`.piece[data-id="${target.id}"]`)?.classList.add("hit");

  return {
    targetId: target.id,
    targetName: target.stats.name,
    amount,
    bonusDamage,
    remainingHp: target.stats.hp,
    defeated: target.stats.hp <= 0,
    text: target.stats.hp <= 0
      ? `${target.stats.name} ${amount} 피해(${damageFormula}), HP 0`
      : `${target.stats.name} ${amount} 피해(${damageFormula}), HP ${target.stats.hp}`
  };
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

function openEditMapModal() {
  editMapInputs.cols.value = String(cols);
  editMapInputs.rows.value = String(rows);
  editMapInputs.obstacles.value = String(units.filter((piece) => piece.type === "obstacle").length);
  editMapInputs.addAllies.value = "0";
  editMapInputs.addEnemies.value = "0";
  editMapModal.hidden = false;
}

function closeEditMap() {
  editMapModal.hidden = true;
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

function readMapFormValues() {
  const nextCols = clamp(Number(editMapInputs.cols.value) || 10, 4, 30);
  const nextRows = clamp(Number(editMapInputs.rows.value) || 8, 4, 30);
  const maxCells = nextCols * nextRows;

  return {
    nextCols,
    nextRows,
    obstacleCount: clamp(Number(editMapInputs.obstacles.value) || 0, 0, maxCells),
    addAllies: clamp(Number(editMapInputs.addAllies.value) || 0, 0, maxCells),
    addEnemies: clamp(Number(editMapInputs.addEnemies.value) || 0, 0, maxCells)
  };
}

function applyMapOnlyChanges(event) {
  event.preventDefault();
  const { nextCols, nextRows, obstacleCount, addAllies, addEnemies } = readMapFormValues();
  cols = nextCols;
  rows = nextRows;

  const occupied = new Set();
  const keptUnits = units
    .filter((piece) => piece.type !== "obstacle")
    .sort((a, b) => (a.type === "player" ? -1 : 0) - (b.type === "player" ? -1 : 0));

  const findSpot = (preferRight = false) => {
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

  const placeExisting = (piece) => {
    const wanted = {
      x: clamp(piece.x, 0, cols - 1),
      y: clamp(piece.y, 0, rows - 1)
    };
    const key = `${wanted.x},${wanted.y}`;
    const spot = occupied.has(key) ? findSpot(piece.type === "enemy") : wanted;
    if (!spot) return false;
    piece.x = spot.x;
    piece.y = spot.y;
    occupied.add(`${piece.x},${piece.y}`);
    return true;
  };

  if (!keptUnits.some((piece) => piece.type === "player")) {
    keptUnits.unshift(unit("player", "P", 0, Math.floor(rows / 2), "플레이어", { hp: 30, maxHp: 30, stamina: 14, maxStamina: 14 }));
  }

  const nextUnits = keptUnits.filter(placeExisting);
  const addPiece = (type) => {
    const spot = findSpot(type === "enemy");
    if (!spot) return false;
    const sameTypeCount = nextUnits.filter((piece) => piece.type === type).length + 1;
    const label = type === "enemy" ? getNextExtraEnemyLabel(nextUnits) : String(sameTypeCount);
    const name = type === "ally" ? `아군 ${sameTypeCount}` : `적군 ${label}`;
    const piece = unit(type, label, spot.x, spot.y, name, {});
    occupied.add(`${spot.x},${spot.y}`);
    nextUnits.push(piece);
    return true;
  };

  for (let i = 0; i < addAllies; i += 1) addPiece("ally");
  for (let i = 0; i < addEnemies; i += 1) addPiece("enemy");

  for (let i = 0; i < obstacleCount; i += 1) {
    const spot = findSpot(i % 2 === 0);
    if (!spot) break;
    occupied.add(`${spot.x},${spot.y}`);
    nextUnits.push(obstacle(spot.x, spot.y));
  }

  units = nextUnits;
  selectedUnitId = selectedUnitId && getUnit(selectedUnitId) ? selectedUnitId : null;
  duel = null;
  activeSkill = null;
  closeEditMap();
  writeLog(`맵만 수정 완료. [${cols} x ${rows}], 장애물 ${units.filter((piece) => piece.type === "obstacle").length}개`, "↻");
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

function getSaveSummary(save) {
  const battle = save.battle ?? save;
  const exploration = save.exploration;
  const inferredMode = save.activeMode ?? (exploration ? "exploration" : "battle");
  const modeLabel = inferredMode === "battle" ? "전투" : "탐험";
  const explorationLabel = exploration?.built
    ? `탐험 ${exploration.cols} x ${exploration.rows}`
    : "탐험 없음";
  const battleLabel = Array.isArray(battle?.units)
    ? `전투 ${battle.cols} x ${battle.rows} | 유닛 ${battle.units.length}개`
    : "전투 없음";
  return `${modeLabel} 저장 | ${explorationLabel} | ${battleLabel}`;
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
        <small>${escapeHtml(getSaveSummary(save))}</small>
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
  if (activeMode === "exploration") {
    addExplorationLog(`${name} 저장 완료.`);
  } else {
    writeLog(`${name} 저장 완료.`, "✓");
  }
}

function overwriteSelectedSave() {
  const saves = getSaves();
  const target = saves.find((save) => save.id === selectedSaveId);
  if (!target) return;

  const next = buildSave(target.name, target.id);
  setSaves(saves.map((save) => save.id === selectedSaveId ? next : save));
  renderSaveList();
  if (activeMode === "exploration") {
    addExplorationLog(`${target.name} 덮어쓰기 완료.`);
  } else {
    writeLog(`${target.name} 덮어쓰기 완료.`, "✓");
  }
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

  restoreBattleSave(save.battle ?? save);
  restoreExplorationSave(save.exploration);
  closeSaveLoad();
  closeMapResetModal();
  const nextMode = save.activeMode ?? (save.exploration ? "exploration" : "battle");
  showMode(nextMode === "battle" ? "battle" : "exploration");
  if (activeMode === "exploration") {
    addExplorationLog(`${save.name} 불러오기 완료.`);
  } else {
    writeLog(`${save.name} 불러오기 완료.`, "↩");
  }
}

function restoreBattleSave(savedBattle) {
  cols = clamp(Number(savedBattle?.cols) || 10, 4, 30);
  rows = clamp(Number(savedBattle?.rows) || 8, 4, 30);
  units = Array.isArray(savedBattle?.units) ? structuredClone(savedBattle.units) : [];
  selectedUnitId = savedBattle?.selectedUnitId && units.some((piece) => piece.id === savedBattle.selectedUnitId)
    ? savedBattle.selectedUnitId
    : null;
  duel = savedBattle?.duel ? structuredClone(savedBattle.duel) : null;
  activeSkill = savedBattle?.activeSkill ? structuredClone(savedBattle.activeSkill) : null;
  render();
  renderSheet();
  renderDuel();
}

function buildSave(name, id = crypto.randomUUID()) {
  return {
    id,
    name,
    schemaVersion: 2,
    activeMode,
    exploration: buildExplorationSave(),
    battle: {
      cols,
      rows,
      units: structuredClone(units),
      selectedUnitId,
      duel: structuredClone(duel),
      activeSkill: structuredClone(activeSkill)
    },
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

createExploration.addEventListener("click", buildExplorationFromControls);
applyExplorationSteps.addEventListener("click", applyExplorationMoveSteps);
explorationStepsInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyExplorationMoveSteps();
});
toggleExplorationFog.addEventListener("click", toggleExplorationFogMode);
openBattleMode.addEventListener("click", openBattleBoardFromExploration);
openExplorationSaves.addEventListener("click", openSaveLoadModal);
backToExploration.addEventListener("click", () => showMode("exploration"));

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
sheetImportFile.addEventListener("change", () => importStatsFromFile(sheetImportFile.files?.[0]));
sheetImportBox.addEventListener("dragover", (event) => {
  event.preventDefault();
  sheetImportBox.classList.add("drag-over");
});
sheetImportBox.addEventListener("dragleave", () => {
  sheetImportBox.classList.remove("drag-over");
});
sheetImportBox.addEventListener("drop", (event) => {
  event.preventDefault();
  sheetImportBox.classList.remove("drag-over");
  importStatsFromFile(event.dataTransfer.files?.[0]);
});
addSkillButton.addEventListener("click", addSkill);
deleteUnit.addEventListener("click", removeSelectedUnit);
resetMap.addEventListener("click", resetToBlank);
editMap.addEventListener("click", openEditMapModal);
saveLoadMap.addEventListener("click", openSaveLoadModal);
captureMapImage.addEventListener("click", captureBoardImage);
mapModal.addEventListener("submit", buildMapFromForm);
closeMapModal.addEventListener("click", closeMapResetModal);
cancelMapModal.addEventListener("click", closeMapResetModal);
editMapModal.addEventListener("submit", applyMapOnlyChanges);
closeEditMapModal.addEventListener("click", closeEditMap);
cancelEditMapModal.addEventListener("click", closeEditMap);
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
buildExplorationFromControls();
showMode("exploration");
writeLog("전투 보드를 열고 맵을 생성하거나 저장된 맵을 불러오세요.", "↻");
