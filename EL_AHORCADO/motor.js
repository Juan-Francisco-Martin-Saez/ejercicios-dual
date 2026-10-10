(() => {
  'use strict';

  const INITIAL_TARGET = 3000;
  const POLICY = 'descubrimiento-cultural-v5';
  const CACHE_KEY = 'ahorcado-catalogo-mensual-v5';
  const CATEGORIES = ['Películas', 'Series de ficción', 'Películas de animación', 'Series de animación', 'Programas de televisión', 'Videojuegos', 'Libros', 'Cantantes y grupos', 'Canciones', 'Lugares y monumentos', 'Figuras históricas y públicas', 'Personajes de ficción', 'Gastronomía', 'Arte', 'Deportes', 'Cultura friki'];
  const MODE_KEY = 'ahorcado-modo-v2';
  const API = './api/palabras.php';

  let mode = read(MODE_KEY, 'online') === 'offline' ? 'offline' : 'online';
  let catalogMonth = '', catalogUpdatedAt = '', loading = false, nextChallenge = null;
  let syncing = false, lastOrigin = 'local', engineReady = false;
  let downloadProgress = '', storageNotice = '', syncController = null, syncTimer = null;
  let storedCatalog = null;
  let serverCatalog = null;
  let prefetchTask = null;
  const CATALOG_REFRESH_MS = 300000;

  const baseNewGame = newGame;
  const buttons = [...document.querySelectorAll('.mode-toggle')];
  const startButton = $('#player-form button[type="submit"]');
  const monthlyKey = () => new Date().toISOString().slice(0, 7);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const chosenCategory = () => {
    const value = $('#category-select')?.value || 'all';
    return CATEGORIES.includes(value) ? value : 'all';
  };

  const offlinePool = () => {
    const level = $('#level-select').value;
    const category = chosenCategory();
    return catalog.filter(item =>
      (level === 'all' || item.level === level) &&
      (category === 'all' || item.category === category)
    );
  };

  function validEntry(item) {
    return item &&
      typeof item.text === 'string' &&
      item.text.length >= 3 &&
      item.text.length <= 65 &&
      /^[A-ZÁÉÍÓÚÜÑ \-–—'’.,:!?¡¿]+$/i.test(item.text) &&
      normalize(item.text).length >= 3 &&
      CATEGORIES.includes(item.category) &&
      Object.hasOwn(LEVELS, item.level) &&
      item.recognitionPolicy === POLICY &&
      typeof item.sourceUrl === 'string' &&
      /^https:\/\/es\.wikipedia\.org\/(?:\?curid=\d+|wiki\/)/.test(item.sourceUrl);
  }

  function validateCatalog(data) {
    if (
      !data ||
      data.recognitionPolicy !== POLICY ||
      (data.month != null && !/^\d{4}-(0[1-9]|1[0-2])$/.test(data.month)) ||
      !Array.isArray(data.entries) ||
      data.entries.length === 0 ||
      (data.count != null && data.count !== data.entries.length)
    ) return false;

    const ids = new Set();

    for (const item of data.entries) {
      if (!validEntry(item)) return false;
      const key = normalize(item.text);
      if (ids.has(key)) return false;
      ids.add(key);
    }

    return true;
  }

  // IndexedDB permite conservar un catálogo que crece.
  function catalogStorage(action, value) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('Almacenamiento no disponible.'));
        return;
      }

      let db, settled = false;

      const finish = (error, result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        db?.close();
        if (error) reject(error);
        else resolve(result);
      };

      const timer = setTimeout(
        () => finish(new Error('Almacenamiento ocupado.')),
        4000
      );

      const request = indexedDB.open('ahorcado-catalogos-v5', 1);

      request.onupgradeneeded = () =>
        request.result.createObjectStore('catalogos');

      request.onerror = () => finish(request.error);
      request.onblocked = () =>
        finish(new Error('Almacenamiento ocupado.'));

      request.onsuccess = () => {
        db = request.result;

        if (settled) {
          db.close();
          return;
        }

        try {
          const transaction = db.transaction(
            'catalogos',
            action === 'put' ? 'readwrite' : 'readonly'
          );
          const store = transaction.objectStore('catalogos');
          const operation = action === 'put'
            ? store.put(value, 'actual')
            : store.get('actual');

          transaction.oncomplete = () =>
            finish(null, operation.result);

          transaction.onerror = () =>
            finish(transaction.error || new Error('No se puede guardar.'));

          transaction.onabort = transaction.onerror;
        } catch (error) {
          finish(error);
        }
      };
    });
  }

  async function readStoredCatalog() {
    try {
      const data = await catalogStorage('get');
      if (validateCatalog(data)) return data;
    } catch { }

    return read(CACHE_KEY, null);
  }

  // Guardar las ampliaciones en orden.
  let persistence = Promise.resolve();

  function persistCatalog(data) {
    persistence = persistence.then(async () => {
      try {
        await catalogStorage('put', data);
        try { localStorage.removeItem(CACHE_KEY); } catch { }
        storageNotice = '';
      } catch {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          storageNotice = '';
        } catch {
          storageNotice =
            'No se ha podido guardar la ampliación en este dispositivo.';
        }
      }

      catalogStatus();
    });
  }

  function installCatalog(data) {
    if (!validateCatalog(data)) {
      throw new Error('Catálogo no válido.');
    }

    // Conservar las entradas anteriores aunque llegue un lote parcial.
    const previous = new Map(
      (storedCatalog?.entries || []).map(item => [
        normalize(item.text),
        item
      ])
    );
    const entries = new Map(previous);

    for (const item of data.entries) {
      entries.set(normalize(item.text), {
        ...item,
        id: normalize(item.text)
      });
    }

    const merged = { ...data, entries: [...entries.values()] };
    merged.count = merged.entries.length;

    const unchanged = storedCatalog &&
      merged.count === catalog.length &&
      (data.month || '') === catalogMonth &&
      (data.updatedAt || '') === catalogUpdatedAt &&
      data.entries.every(item =>
        JSON.stringify(previous.get(normalize(item.text))) ===
        JSON.stringify({ ...item, id: normalize(item.text) })
      );

    if (unchanged) return;

    catalog.length = 0;
    for (const item of merged.entries) catalog.push(item);

    seen.clear();
    for (const item of catalog) seen.add(item.id);

    // Recuperar el historial también para las nuevas entradas.
    const history = read(STORAGE_KEY, []);
    if (Array.isArray(history)) {
      for (const id of history) {
        if (typeof id === 'string') used.add(id);
      }
    }

    for (const level of Object.keys(byLevel)) {
      byLevel[level] = level === 'all'
        ? catalog
        : catalog.filter(item => item.level === level);
    }

    catalogMonth = data.month || '';
    catalogUpdatedAt = data.updatedAt || '';
    storedCatalog = merged;

    persistCatalog(merged);
    catalogStatus();
  }

  async function fetchWords(url, controller = new AbortController()) {
    const timer = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'La búsqueda no está disponible.');
      }

      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function updateMode() {
    for (const button of buttons) {
      button.textContent = mode === 'online' ? 'ONLINE' : 'OFFLINE';
      button.dataset.mode = mode;
      button.setAttribute('aria-pressed', String(mode === 'online'));
      button.setAttribute(
        'aria-label',
        mode === 'online'
          ? 'Modo online. Cambiar a offline'
          : 'Modo offline. Cambiar a online'
      );
    }

    catalogStatus();

    if (engineReady) {
      startButton.disabled =
        mode === 'offline' && offlinePool().length === 0;

      $('#player-error').textContent = startButton.disabled
        ? 'Todavía no hay enigmas guardados para esta selección. Conéctate y actualiza el catálogo.'
        : '';
    }
  }

  catalogStatus = function () {
    const remaining = catalog.filter(item => !used.has(item.id)).length;
    const count =
      `${remaining.toLocaleString('es-ES')} de ${catalog.length.toLocaleString('es-ES')} enigmas pendientes`;

    const searching =
      loading && mode === 'online' && navigator.onLine;

    let message;

    if (searching) {
      message = 'ONLINE · Buscando el próximo enigma en la web…';
    } else if (current && lastOrigin === 'internet') {
      message = 'ONLINE · Enigma buscado en la web';
    } else if (current && lastOrigin === 'recent-web') {
      message = 'ONLINE · Enigma obtenido de la web · Consulta reciente';
    } else if (current || mode === 'offline') {
      message = `OFFLINE · Catálogo guardado · ${count}`;
    } else {
      message = 'ONLINE · El próximo enigma se buscará en la web';
    }

    $('#catalog-status').textContent = message;
    $('#catalog-status').title = current && lastOrigin !== 'local'
      ? 'Enigma obtenido de internet'
      : `Catálogo guardado: ${catalog.length.toLocaleString('es-ES')} enigmas en total`;

    $('#catalog-status').style.fontWeight = '700';

    $('#engine-status').textContent = mode === 'offline'
      ? [`OFFLINE · ${count}`, storageNotice].filter(Boolean).join(' · ')
      : [downloadProgress || 'Ampliando catálogo · Total pendiente de comprobar', storageNotice]
        .filter(Boolean).join(' · ');
  };

  selectChallenge = function () {
    if (!nextChallenge) {
      const pool = offlinePool();

      if (!pool.length) {
        throw new Error('No hay enigmas offline para esta selección.');
      }

      let available = pool.filter(item => !used.has(item.id));

      if (!available.length) {
        for (const item of pool) used.delete(item.id);
        available = pool;
      }

      const item = available[Math.floor(Math.random() * available.length)];

      used.add(item.id);
      save(STORAGE_KEY, [...used]);

      return item;
    }

    const item = nextChallenge;
    nextChallenge = null;

    used.add(item.id);
    save(STORAGE_KEY, [...used]);

    return item;
  };

  // Online: respuestas ocultas y puntuación conservada por PHP.
  let verifiedToken = null;
  let verifiedRound = null;
  let startRequest = null;
  let pendingAttempt = null;
  let verificationBusy = false;

  const originalEndRun = endRun;

  endRun = function () {
    if (verificationBusy || loading) {
      feedback('Espera a que termine la comprobación del servidor.');
      return;
    }

    originalEndRun();
    cancelPrefetch();
  };

  $('#end-run').removeEventListener('click', originalEndRun);
  $('#end-run').addEventListener('click', endRun);

  // Compatibilidad con índices anteriores.
  const originalSubmit = submit;

  submit = function (event) {
    if (window.verifiedActive) return verifiedSubmit(event);
    return originalSubmit(event);
  };

  $('#guess-form').removeEventListener('submit', originalSubmit);
  $('#guess-form').addEventListener('submit', submit);

  const randomRequest = () =>
    Array.from(
      crypto.getRandomValues(new Uint8Array(16)),
      x => x.toString(16).padStart(2, '0')
    ).join('');

  async function verifiedRequest(body, controller = new AbortController()) {
    const timer = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch('./api/partida.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || 'No se puede verificar la partida.');
        error.code = data.code;
        error.status = response.status;
        throw error;
      }

      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function cancelPrefetch() {
    prefetchTask?.controller.abort();
    prefetchTask = null;
  }

  function startPrefetch() {
    if (mode !== 'online' || !navigator.onLine || !runActive ||
        !verifiedToken || !verifiedRound || verifiedRound.status === 'lost') return;
    const filters = { level: $('#level-select').value, category: chosenCategory() };
    const key = JSON.stringify([verifiedToken, verifiedRound.id, filters]);
    if (prefetchTask?.key === key) return;
    cancelPrefetch();
    const task = {
      key, filters, token: verifiedToken, roundId: verifiedRound.id,
      controller: new AbortController(), ready: false, promise: null
    };
    prefetchTask = task;
    task.promise = verifiedRequest({
      action: 'prefetch', token: task.token, roundId: task.roundId, ...filters
    }, task.controller).then(data => {
      task.ready = data.ready === true && data.roundId === task.roundId;
    }).catch(() => {
      // Un fallo de precarga no interrumpe el enigma actual ni altera su puntuación.
      task.ready = false;
    });
  }

  async function requestNext(body) {
    const task = prefetchTask;
    if (task && task.token === body.token && task.roundId === body.roundId &&
        task.filters.level === body.level && task.filters.category === body.category) {
      await task.promise;
    } else if (task) {
      cancelPrefetch();
    }
    const deadline = Date.now() + 45000;
    while (runActive && mode === 'online') {
      try { return await verifiedRequest(body); }
      catch (error) {
        if (error.code !== 'prefetch_pending' || Date.now() >= deadline) throw error;
        // Otro intento o pestaña aún está preparando la misma precarga: no duplicar búsqueda.
        await sleep(1000);
      }
    }
    throw new Error('La partida ha terminado.');
  }

  function verifiedState(data) {
    verifiedToken = data.token;
    verifiedRound = data.round;
    window.verifiedActive = true;

    current = { ...data.round };
    guessed = new Set(data.round.guessed);
    errors = data.round.errors;
    runScore = data.score;

    updatePlayer();
    drawWord();
    drawUsed();
    drawProgress();
  }

  const originalDrawWord = drawWord;

  drawWord = function (reveal = false) {
    if (!window.verifiedActive) {
      return originalDrawWord(reveal);
    }

    word.replaceChildren();

    for (const part of current.text.split(' ')) {
      const group = document.createElement('div');
      group.className = 'word-group';

      for (const ch of part) {
        const span = document.createElement('span');
        span.className = 'letter';

        if (ch === '_') {
          span.setAttribute('aria-label', 'Letra oculta');
        } else {
          span.textContent = ch;
          span.classList.add('revealed');
        }

        group.append(span);
      }

      word.append(group);
    }

    fitWord();
  };

  newGame = async function () {
    if (!runActive || loading) return;

    if (mode === 'offline') {
      if (!offlinePool().length) {
        feedback(
          'No hay enigmas guardados para esta selección. Cambia de dificultad o termina la partida para elegir online.'
        );

        $('#result-title').textContent = 'SIN ENIGMAS GUARDADOS';
        $('#result-eyebrow').textContent = 'MODO OFFLINE';
        $('#result-description').textContent =
          'Cambia de dificultad o termina la partida para elegir el modo online.';
        $('#result-answer').textContent = '';
        $('#result-run').textContent = `${runScore} palabras resueltas.`;
        $('#play-again').textContent = 'REINTENTAR →';
        $('#overlay').classList.add('show');
        $('#overlay').setAttribute('aria-hidden', 'false');

        return;
      }

      cancelPrefetch();
      verifiedToken = null;
      verifiedRound = null;
      startRequest = null;
      pendingAttempt = null;
      window.verifiedActive = false;
      window.verifiedSubmit = null;
      lastOrigin = 'local';
      nextChallenge = null;

      baseNewGame();
      catalogStatus();

      feedback('Partida offline · Sin ranking global.');
      $('#end-run').textContent = 'TERMINAR PARTIDA';

      return;
    }

    syncController?.abort();

    loading = true;
    input.disabled = true;
    $('#guess-button').disabled = true;
    $('#play-again').disabled = true;
    $('#level-select').disabled = true;

    syncKeyboard();
    catalogStatus();
    clearTimeout(timeout);

    try {
      startRequest ||= randomRequest();

      const filters = {
        level: $('#level-select').value,
        category: chosenCategory()
      };

      const body = verifiedToken
        ? {
          action: 'next',
          token: verifiedToken,
          roundId: verifiedRound.id,
          ...filters
        }
        : {
          action: 'start',
          requestId: startRequest,
          nombre: playerName,
          ...filters
        };

      const data = await (verifiedToken ? requestNext(body) : verifiedRequest(body));
      if (!runActive) return;

      window.verifiedActive = true;
      window.verifiedSubmit = verifiedSubmit;
      nextChallenge = { ...data.round };
      lastOrigin = data.round.origin;

      baseNewGame();
      verifiedState(data);
      pendingAttempt = null;
      startPrefetch();

      $('#end-run').textContent = 'TERMINAR Y GUARDAR';
      feedback('Partida online · Puntuación verificada por el servidor.');
    } catch (error) {
      feedback(
        error.message || 'Sin conexión. Reintenta o cambia a offline.'
      );

      $('#play-again').textContent = 'REINTENTAR →';
      $('#result-title').textContent = 'SIN CONEXIÓN';
      $('#result-eyebrow').textContent = 'NO SE HA INICIADO EL ENIGMA';
      $('#result-description').textContent =
        'Reintenta la búsqueda o termina la partida para elegir el modo offline.';
      $('#result-answer').textContent = '';
      $('#result-run').textContent = `${runScore} palabras verificadas.`;
      $('#overlay').classList.add('show');
      $('#overlay').setAttribute('aria-hidden', 'false');
    } finally {
      loading = false;
      $('#play-again').disabled = false;
      $('#level-select').disabled = false;
      catalogStatus();
      syncKeyboard();
    }
  };

  async function verifiedSubmit(event) {
    event.preventDefault();

    if (
      finished ||
      !runActive ||
      input.disabled ||
      playerDialog.open ||
      rankingDialog.open
    ) return;

    const value = normalize(input.value);
    input.value = '';

    if (!value) return;

    if (pendingAttempt && pendingAttempt.value !== value) {
      feedback(
        'Reintenta primero la respuesta pendiente: ' +
        pendingAttempt.value
      );
      return;
    }

    pendingAttempt ||= {
      value,
      requestId: randomRequest()
    };

    verificationBusy = true;

    if ($('#solution-dialog').open) {
      $('#solution-dialog').close();
    }

    input.disabled = true;
    $('#guess-button').disabled = true;
    syncKeyboard();

    try {
      const data = await verifiedRequest({
        action: 'guess',
        token: verifiedToken,
        roundId: verifiedRound.id,
        ...pendingAttempt
      });

      pendingAttempt = null;

      if (!runActive) return;

      verifiedState(data);

      if (
        data.round.status === 'won' ||
        data.round.status === 'lost'
      ) {
        // finish añade un punto visual; ajustar al total del servidor.
        if (data.round.status === 'won') {
          runScore = data.score - 1;
        }

        if (data.round.status === 'lost') cancelPrefetch();
        finish(data.round.status === 'won', value.length > 1);

        runScore = data.score;
        updatePlayer();

        $('#play-again').textContent = 'CONTINUAR SUMANDO →';
      } else {
        feedback(
          value.length === 1 &&
            normalize(data.round.text).includes(value)
            ? 'Letra acertada.'
            : 'Respuesta comprobada por el servidor.'
        );
      }
    } catch (error) {
      feedback(
        'No se ha confirmado la respuesta. Reintenta ' + value + '.'
      );
    } finally {
      verificationBusy = false;

      if (!finished && runActive) {
        input.disabled = false;
        $('#guess-button').disabled = false;
        syncKeyboard();
        focusAnswer();
      }
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (verificationBusy || loading) {
        feedback('Espera a que termine la comprobación del servidor.');
        return;
      }

      if (runActive) endRun();

      mode = mode === 'online' ? 'offline' : 'online';
      save(MODE_KEY, mode);

      if (mode === 'offline') syncController?.abort();

      updateMode();

      if (runActive && !finished && !loading) {
        feedback(
          `El próximo enigma se jugará en modo ${mode.toUpperCase()}.`
        );
      }

      if (mode === 'online' && navigator.onLine && engineReady) {
        syncMonthly();
      }
    });
  }

  const stopSearch = () => { syncController?.abort(); cancelPrefetch(); };

  $('#restart').addEventListener('click', stopSearch);
  $('#end-run').addEventListener('click', stopSearch);
  $('#level-select').addEventListener('change', () => {
    updateMode();
    cancelPrefetch();
    if (!loading && !verificationBusy) startPrefetch();
  });

  $('#category-select')?.addEventListener('change', () => {
    updateMode();
    cancelPrefetch();
    if (runActive && !finished && !loading) newGame();
  });

  function observeServerCatalog(data) {
    if (!data || data.recognitionPolicy !== POLICY || !Array.isArray(data.entries) ||
        !Number.isSafeInteger(data.count) || data.count < 0 || data.count !== data.entries.length ||
        (data.count > 0 && !validateCatalog(data))) throw new Error('Catálogo no válido.');
    const target = Number.isSafeInteger(data.target) && data.target >= INITIAL_TARGET
      ? data.target : INITIAL_TARGET;
    serverCatalog = { count: data.count, target };
    downloadProgress = data.count < target
      ? `Ampliando catálogo · ${data.count.toLocaleString('es-ES')} / ${target.toLocaleString('es-ES')}`
      : `Catálogo disponible · ${data.count.toLocaleString('es-ES')} enigmas`;
    if (data.count > 0) installCatalog(data);
    catalogStatus();
    updateMode();
  }

  async function syncMonthly() {
    clearTimeout(syncTimer);
    if (syncing) return;
    if (!navigator.onLine || document.hidden || loading || verificationBusy) {
      syncTimer = setTimeout(syncMonthly, CATALOG_REFRESH_MS);
      return;
    }
    syncing = true;
    syncController = new AbortController();
    const controller = syncController;
    try {
      // Leer el catálogo ya guardado; la generación se ejecuta exclusivamente mediante cron.
      observeServerCatalog(await fetchWords(API + '?action=catalog', controller));
    } catch (error) {
      if (error.name !== 'AbortError') {
        downloadProgress = serverCatalog
          ? `Último total confirmado · ${serverCatalog.count.toLocaleString('es-ES')} enigmas`
          : 'Ampliando catálogo · Total pendiente de comprobar';
        catalogStatus();
      }
    } finally {
      syncing = false;
      if (syncController === controller) syncController = null;
      syncTimer = setTimeout(syncMonthly, CATALOG_REFRESH_MS);
    }
  }

  async function prepareOffline() {
    if (
      !('serviceWorker' in navigator) ||
      !window.isSecureContext
    ) return;

    try {
      await navigator.serviceWorker.register('./sw.js', {
        updateViaCache: 'none'
      });

      await navigator.serviceWorker.ready;
      catalogStatus();
    } catch { }
  }

  // PHP conserva y registra la puntuación.
  const RANKING_COPY_KEY = 'ahorcado-ranking-copia-v2';
  const originalRankingFetch = rankingFetch;

  rankingFetch = async function (options = {}) {
    if (options.method === 'POST') {
      if (!verifiedToken) {
        throw new Error('Esta partida no está verificada.');
      }

      return originalRankingFetch({
        ...options,
        body: JSON.stringify({ token: verifiedToken })
      });
    }

    try {
      const rows = await originalRankingFetch(options);
      save(RANKING_COPY_KEY, rows);
      return rows;
    } catch (error) {
      const copy = read(RANKING_COPY_KEY, null);

      if (!navigator.onLine) {
        return Array.isArray(copy) ? copy : [];
      }

      throw error;
    }
  };

  const originalLoadRanking = loadRanking;

  loadRanking = async function () {
    await originalLoadRanking();

    if (!navigator.onLine) {
      $('#ranking-status').textContent =
        'Sin conexión · Última clasificación guardada.';
    }
  };

  const originalSaveRun = saveRun;

  saveRun = async function () {
    if (!verifiedToken) {
      const score = pendingScore;
      pendingScore = null;

      $('#ranking-refresh').textContent = 'ACTUALIZAR';
      $('#ranking-action').disabled = false;

      await loadRanking();

      $('#ranking-summary').hidden = false;
      $('#ranking-summary').textContent =
        `${score?.nombre || playerName} · ${score?.palabrasResueltas ?? runScore} palabras resueltas · Partida offline`;

      $('#ranking-status').textContent =
        'Esta partida no participa en el ranking global.';

      return;
    }

    await originalSaveRun();

    if (!pendingScore) {
      cancelPrefetch();
      verifiedToken = null;
      verifiedRound = null;
      window.verifiedActive = false;
    }
  };

  // Los resultados offline anteriores no son verificables.
  try {
    localStorage.removeItem('ahorcado-ranking-pendiente-v2');
  } catch { }

  window.addEventListener('offline', () => {
    cancelPrefetch();
    syncController?.abort();
    clearTimeout(syncTimer);
    downloadProgress = '';
    catalogStatus();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && engineReady) { syncMonthly(); startPrefetch(); }
  });

  window.addEventListener('online', () => {
    catalogStatus();
    syncMonthly();
    startPrefetch();
  });

  async function boot() {
    startButton.disabled = true;
    $('#player-error').textContent = 'Preparando los enigmas…';

    const saved = await readStoredCatalog();

    try {
      if (validateCatalog(saved)) {
        installCatalog(saved);
      } else {
        // Retirar el banco antiguo, que no cumple la nueva clasificación.
        catalog.length = 0;
        seen.clear();

        for (const level of Object.keys(byLevel)) {
          byLevel[level] = level === 'all' ? catalog : [];
        }

        let remote;

        if (navigator.onLine) {
          try {
            remote = await fetchWords(API + '?action=catalog');
            observeServerCatalog(remote);
          } catch { }
        }

        if (!validateCatalog(remote) && remote?.count !== 0) {
          remote = await fetchWords('./catalogo-inicial.json');
        }

        installCatalog(remote);
      }
    } catch {
      $('#player-error').textContent =
        'Todavía no hay un catálogo offline revisado. Puedes jugar online si tienes conexión.';
    }

    engineReady = true;
    startButton.disabled = false;

    updateMode();
    prepareOffline();
    syncMonthly();
  }

  updateMode();
  boot();
})();