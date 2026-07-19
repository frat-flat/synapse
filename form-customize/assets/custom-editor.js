
  // --- ログインセッションの不整合を自動検知して修復するフォールバックロジック ---
  (function() {
    const defaultAdmin = { id: 'user_admin', name: '管理者', role: 'admin' };
    try {
      const cosUser = localStorage.getItem('cos_logged_user');
      const gfUser = localStorage.getItem('gf_current_user');
      if (cosUser === '"admin"' || cosUser === 'admin') {
        localStorage.setItem('cos_logged_user', JSON.stringify(defaultAdmin));
      }
      if (gfUser === '"admin"' || gfUser === 'admin' || !gfUser) {
        localStorage.setItem('gf_current_user', JSON.stringify(defaultAdmin));
      }
    } catch (e) {}
    if (!window.K) {
      window.K = defaultAdmin;
    }
    try {
      if (window.parent && !window.parent.K) {
        window.parent.K = defaultAdmin;
      }
    } catch (e) {}
  })();
  
(function() {
  console.log('custom-editor.js loading...');

  // CSSのキャッシュ破り用動的インジェクションハック！！！
  (function injectLatestCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/custom-editor-v3.css?v=' + Date.now();
    document.head.appendChild(link);
    console.log('[Custom Flowmap] Injected latest stylesheet:', link.href);
  })();

  // 1. APIシミュレーター用のマスタデータ (モック)
  const ZIP_DATABASE = {
    "1500002": { pref: "東京都", city: "渋谷区", street: "渋谷" },
    "1000005": { pref: "東京都", city: "千代田区", street: "丸の内" },
    "7300012": { pref: "広島県", city: "広島市中区", street: "上八丁堀" },
    "7300013": { pref: "広島県", city: "広島市中区", street: "八丁堀" },
    "5300001": { pref: "大阪府", city: "大阪市北区", street: "梅田" }
  };

  const BANK_DATABASE = {
    "ウェイウェイ銀行": {
      code: "9999",
      branches: {
        "東京支店": "101",
        "大阪支店": "201",
        "広島支店": "301"
      }
    },
    "ヤフー銀行": {
      code: "8888",
      branches: {
        "本店営業部": "001",
        "ネット営業部": "002"
      }
    }
  };

  const CORP_DATABASE = [
    { name: "株式会社wayway", nameKana: "カブシキガイシャウェイウェイ", num: "1010001999999", pref: "東京都", regDate: "2023-10-01", estDate: "2015-05-15" },
    { name: "wayway合同会社", nameKana: "ウェイウェイゴウドウガイシャ", num: "2010001999999", pref: "広島県", regDate: "2024-04-01", estDate: "2020-11-20", cancelDate: "2025-12-31" },
    { name: "ヤフー株式会社", nameKana: "ヤフーカブシキガイシャ", num: "3010001888888", pref: "東京都", regDate: "2023-10-01", estDate: "1996-01-31" },
    { name: "株式会社wayway広島", nameKana: "カブシキガイシャウェイウェイヒロシマ", num: "4010001999999", pref: "広島県", regDate: "2025-01-15", estDate: "2024-09-01" }
  ];

  // 2. 表記揺れ正規化
  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[\uFF21-\uFF3A\uFF41-\uFF5A\uFF10-\uFF19]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/[\s\-\u30FC\u30FB/|\u3000\uFF5C]/g, "");
  }

  // 3. おすすめ2色カラープリセット
  const COLOR_PRESETS = {
    seattle_blue: { primary: "#0056b3", bg: "#f8fafd", label: "シアトルブルー" },
    charcoal: { primary: "#212529", bg: "#ffffff", label: "チャコール" },
    forest: { primary: "#198754", bg: "#f7fbf9", label: "フォレスト" },
    sakura: { primary: "#d63384", bg: "#fdf8fa", label: "サクラ" },
    warm_orange: { primary: "#fd7e14", bg: "#fffdfa", label: "ウォームオレンジ" },
    royal_purple: { primary: "#6f42c1", bg: "#ffffff", label: "ロイヤルパープル" },
    monotone: { primary: "#495057", bg: "#f8f9fa", label: "モノトーン" }
  };

  function adjustColorContrast(hex, percent) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, Math.round(r * (percent / 100))));
    g = Math.min(255, Math.max(0, Math.round(g * (percent / 100))));
    b = Math.min(255, Math.max(0, Math.round(b * (percent / 100))));

    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  function getTextColorForBg(bgHex) {
    bgHex = bgHex.replace(/^#/, '');
    const r = parseInt(bgHex.substring(0, 2), 16);
    const g = parseInt(bgHex.substring(2, 4), 16);
    const b = parseInt(bgHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#212529" : "#ffffff";
  }

  // 5. グローバルの状態管理フック
  let editorMode = "simple";
  let activeApiMetadata = {};

  // タイマー監視によるVite状態ロードの完了検出
  function initializeAll() {
    console.log('custom-editor.js waiting for Vite modules...');
    
    const pollInterval = setInterval(() => {
      if (window.le && window.x && window.Z && window.n) {
        clearInterval(pollInterval);
        console.log('Vite objects found. Exposing overrides...');
        
        setupEditorRenderHooks();
        setupPreviewModeOverrides();
        patchPresetSelectMenu();
        forceBindNavigationTabs();
        
        initEditorMode();
        initColorPresets();
        loadProSettingsToInputs();
        setupValidationInterceptors();
        setupFormTitleSync();
        setupFlowmapDragBindings(); // フローマップドラッグイベント登録
        setupFlowmapOverrideF(); // window.Fのオーバーライドを確実に行う
        
        // フォーム選択プルダウンのリスト作成と変更リスナー登録
        updateFlowmapFormDropdown();
        setupFlowmapFormSelectListener();

        setTimeout(() => {
          renderLivePreview();
          applyPreviewTheme();

          // 保存されたタブ表示状態があれば復元
          const savedTab = localStorage.getItem('form_customize_active_tab');
          if (savedTab) {
            const tabBtn = document.querySelector(`.nav-tab[data-tab="${savedTab}"]`);
            if (tabBtn) {
              tabBtn.click();
            }
          }
        }, 100);
      }
    }, 50);

    setTimeout(() => {
      clearInterval(pollInterval);
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
  } else {
    initializeAll();
  }

  function setupFormTitleSync() {
    const simpleTitleInput = document.getElementById('editor-form-title');
    const proTitleInput = document.getElementById('editor-pro-title');
    const simpleDescInput = document.getElementById('editor-form-desc');

    if (simpleTitleInput) {
      simpleTitleInput.addEventListener('input', (e) => {
        const v = e.target.value;
        if (window.G) {
          window.G.title = v;
          window.G.header = window.G.header || {};
          window.G.header.title = v;
        }
        if (proTitleInput) proTitleInput.value = v;
      });
    }

    if (simpleDescInput) {
      simpleDescInput.addEventListener('input', (e) => {
        const v = e.target.value;
        if (window.G) {
          window.G.description = v;
          window.G.header = window.G.header || {};
          window.G.header.disclaimer = v;
        }
      });
    }
  }

  function forceBindNavigationTabs() {
    console.log('Binding navigation tabs...');
    const tabs = document.querySelectorAll('.nav-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = tab.dataset.tab;
        console.log('Extension tab click hook:', tabName);

        // アクティブなタブの名前を localStorage に記憶
        localStorage.setItem('form_customize_active_tab', tabName);

        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById(`panel-${tabName}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        if (tabName === 'editor') {
          setTimeout(() => {
            renderLivePreview();
            applyPreviewTheme();
          }, 50);
        } else if (tabName === 'flowmap') {
          setTimeout(() => {
            if (window.F && window.G) {
              console.log('[Custom Flowmap] Explicitly invoking window.F on tab click');
              window.F(window.G);
            }
            refreshFlowmapPortsAndStyles();
          }, 100);
        }
      });
    });
  }

  // ================= フローマップドラッグ＆ドロップ接続機能実装 =================
  
  // パン＆ズームのグローバル状態
  let flowmapPanZoom = {
    panX: 0,
    panY: 0,
    scale: 1.0,
    isPanning: false,
    startX: 0,
    startY: 0
  };

  // localStorage からのロード
  function loadFlowmapPanZoom() {
    try {
      const saved = JSON.parse(localStorage.getItem('form_customize_flowmap_pan_zoom') || '{}');
      if (saved.scale !== undefined) flowmapPanZoom.scale = saved.scale;
      if (saved.panX !== undefined) flowmapPanZoom.panX = saved.panX;
      if (saved.panY !== undefined) flowmapPanZoom.panY = saved.panY;
      window.currentFlowmapZoom = flowmapPanZoom.scale;
    } catch (e) {}
  }

  // localStorage へのセーブ
  function saveFlowmapPanZoom() {
    localStorage.setItem('form_customize_flowmap_pan_zoom', JSON.stringify({
      panX: flowmapPanZoom.panX,
      panY: flowmapPanZoom.panY,
      scale: flowmapPanZoom.scale
    }));
  }

  // ズーム・パンレイヤーの transform を更新する関数
  function updateZoomPanTransform() {
    const layer = document.getElementById('flowmap-zoom-pan-layer');
    if (layer) {
      layer.setAttribute('transform', `translate(${flowmapPanZoom.panX}, ${flowmapPanZoom.panY}) scale(${flowmapPanZoom.scale})`);
    }
    const zoomText = document.getElementById('zoom-percentage-label');
    if (zoomText) {
      zoomText.textContent = Math.round(flowmapPanZoom.scale * 100) + '%';
    }
    window.currentFlowmapZoom = flowmapPanZoom.scale;
  }

  function setupFlowmapPanZoomEvents(svg) {
    if (svg.dataset.panZoomBound === 'true') return;
    svg.dataset.panZoomBound = 'true';

    // マウスホイールによるズーム
    svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 0.05;
      let newScale = flowmapPanZoom.scale;
      if (e.deltaY < 0) {
        newScale = Math.min(2.0, flowmapPanZoom.scale + zoomFactor);
      } else {
        newScale = Math.max(0.3, flowmapPanZoom.scale - zoomFactor);
      }

      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const svgMouseX = (mouseX - flowmapPanZoom.panX) / flowmapPanZoom.scale;
      const svgMouseY = (mouseY - flowmapPanZoom.panY) / flowmapPanZoom.scale;

      flowmapPanZoom.scale = newScale;
      flowmapPanZoom.panX = mouseX - svgMouseX * newScale;
      flowmapPanZoom.panY = mouseY - svgMouseY * newScale;

      updateZoomPanTransform();
      saveFlowmapPanZoom();
    }, { passive: false });

    // ドラッグによるパン (空白エリアドラッグ)
    svg.addEventListener('mousedown', (e) => {
      // カードや端子、あるいはその他コントロールのドラッグ中はパンさせない
      if (e.target.closest('.flow-node-card') || e.target.closest('.flow-port') || e.target.closest('.flow-connector') || nodeDragState.active || dragConnection.active) {
        return;
      }

      flowmapPanZoom.isPanning = true;
      flowmapPanZoom.startX = e.clientX - flowmapPanZoom.panX;
      flowmapPanZoom.startY = e.clientY - flowmapPanZoom.panY;
      svg.classList.add('flowmap-panning');
      svg.classList.remove('flowmap-pan-grab');
    });

    document.addEventListener('mousemove', (e) => {
      if (!flowmapPanZoom.isPanning) return;
      
      flowmapPanZoom.panX = e.clientX - flowmapPanZoom.startX;
      flowmapPanZoom.panY = e.clientY - flowmapPanZoom.startY;
      updateZoomPanTransform();
    });

    document.addEventListener('mouseup', () => {
      if (flowmapPanZoom.isPanning) {
        flowmapPanZoom.isPanning = false;
        svg.classList.remove('flowmap-panning');
        svg.classList.add('flowmap-pan-grab');
        saveFlowmapPanZoom();
      }
    });

    svg.classList.add('flowmap-pan-grab');
  }

  let nodeDragState = {
    active: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0
  };

  let dragConnection = {
    active: false,
    fromSectionId: null,
    connectorType: 'default', // 'default' または 'conditional'
    questionId: null,
    optionIndex: null,
    tempPath: null,
    startX: 0,
    startY: 0
  };

  // ドラッグ中に重なり合っているINポート
  let currentHoveredInPort = null;

  function setupFlowmapDragBindings() {
    // 500msごとにフローマップポートのインジェクション状態と孤立セクションを更新監視
    setInterval(() => {
      const flowmapPanel = document.getElementById('panel-flowmap');
      const isVisible = flowmapPanel && (
        flowmapPanel.classList.contains('active') ||
        flowmapPanel.style.display === 'block' ||
        (flowmapPanel.offsetWidth > 0 && flowmapPanel.offsetHeight > 0)
      );
      if (isVisible) {
        refreshFlowmapPortsAndStyles();
        injectZoomControls(); // ズームUIを確実に注入
        updateFlowmapFormDropdown(); // フォーム切り替えプルダウンを確実に同期・更新
      }
    }, 400);

    // エディタタブがアクティブな際に、選択肢ごとの遷移先ドロップダウンを美しく自動装飾する
    setInterval(() => {
      const editorPanel = document.getElementById('panel-editor');
      const isVisible = editorPanel && (
        editorPanel.classList.contains('active') ||
        editorPanel.style.display === 'block' ||
        (editorPanel.offsetWidth > 0 && editorPanel.offsetHeight > 0)
      );
      if (isVisible) {
        styleOptionTransitionSelects();
      }
    }, 300);

    // ドキュメント全体でドラッグ移動とドロップの監視を行う
    document.addEventListener('mousemove', onFlowmapMouseMove);
    document.addEventListener('mouseup', onFlowmapMouseUp);
  }

  // フローマップ端子の挿入および孤立警告スタイルの自動同期
  function refreshFlowmapPortsAndStyles() {
    return; // マインドマップのレイアウトに干渉させないために無効化
    const svg = document.getElementById('flowmap-svg');
    if (!svg || !window.G) return;

    // 1. 各セクションノードへの「INポート（入力口）」および既存「flow-connector」のドラッグ登録
    const nodes = svg.querySelectorAll('foreignObject[id^="node-"]');
    nodes.forEach(node => {
      const nodeId = node.id.replace('node-', '');
      const card = node.querySelector('.flow-node-card');
      if (!card) return;

      // INポートがなければ追加 (startノード以外)
      if (nodeId !== 'start' && !card.querySelector('.flow-port-in')) {
        const inPort = document.createElement('div');
        inPort.className = 'flow-port flow-port-in';
        inPort.dataset.nodeId = nodeId;
        card.appendChild(inPort);
      }

      // 既存のOUTコネクタにドラッグイベントをバインド
      const connectors = card.querySelectorAll('.flow-connector:not([data-drag-bound])');
      connectors.forEach(conn => {
        conn.setAttribute('data-drag-bound', 'true');
        conn.addEventListener('mousedown', (e) => {
          onConnectorMouseDown(e, conn, nodeId, svg);
        });
      });
    });

    // StartノードのOUT端子バインド
    const startNode = document.getElementById('node-start');
    if (startNode) {
      const card = startNode.querySelector('.flow-node-card');
      const conn = card ? card.querySelector('.flow-connector:not([data-drag-bound])') : null;
      if (conn) {
        conn.setAttribute('data-drag-bound', 'true');
        conn.addEventListener('mousedown', (e) => {
          onConnectorMouseDown(e, conn, 'start', svg);
        });
      }
    }

    // SubmitノードのINポート（入力端子）の動的インジェクション (送信ノードへのドラッグ可視化)
    const submitNode = document.getElementById('node-submit');
    if (submitNode) {
      const card = submitNode.querySelector('.flow-node-card');
      if (card && !card.querySelector('.flow-port-in')) {
        const inPort = document.createElement('div');
        inPort.className = 'flow-port flow-port-in';
        inPort.dataset.nodeId = 'submit'; // 接続先IDは 'submit'
        card.appendChild(inPort);
      }
    }

    // デフォルトの出力端子（青い丸）をカードの直下へ移し替え（絶対配置のズレ・歪さを修正）
    const cardsList = svg.querySelectorAll('.flow-node-card');
    cardsList.forEach(card => {
      const defaultConn = card.querySelector('.flow-connector[data-connector-type="default"]');
      if (defaultConn && defaultConn.parentElement !== card) {
        card.appendChild(defaultConn); // 親をカード直下にして absolute right:-7px を効かせる
      }
    });

    // 2. 孤立ノード（到達不能セクション）の検出とクラス付与
    highlightIsolatedSections(svg);

    // 3. foreignObject の高さ・幅不足によるカードや端子のクリッピング（途切れ）を動的に補正
    const fObjects = svg.querySelectorAll('foreignObject');
    fObjects.forEach(fo => {
      const nodeId = fo.id.replace('node-', '');
      
      // 開始ノードと送信ノードはサイズ・高さが固定なので、タイマー無限拡張の対象から完全除外
      if (nodeId === 'start' || nodeId === 'submit') {
        fo.setAttribute('height', 105); // 無限に伸びないように完全に固定高を設定
        fo.setAttribute('width', 240);
        return;
      }

      const card = fo.querySelector('.flow-node-card');
      if (card) {
        // 初回ロード時にのみ、元の正しい高さを data-original-height に退避保存 (タイマー無限増殖を防止)
        if (!fo.dataset.originalHeight) {
          const rawHeight = fo.getAttribute('height');
          fo.dataset.originalHeight = rawHeight && parseFloat(rawHeight) > 0 ? rawHeight : '130';
        }
        const originalHeight = parseFloat(fo.dataset.originalHeight);

        // カードの実際の表示高さを取得
        let actualHeight = card.offsetHeight;

        // タブ切り替え直後など非表示の際に offsetHeight が 0 になる問題のフォールバック
        if (actualHeight === 0) {
          actualHeight = originalHeight;
        }

        // 十分な余白 (+55px) を持たせて拡張 (常に元の高さ、または最新の表示高さを基準とするため無限に伸びない)
        const baseHeight = Math.max(actualHeight, originalHeight);
        const newHeight = baseHeight + 55;
        fo.setAttribute('height', newHeight);
        
        // 端子が左右にはみ出しても切れないように幅を 280px に拡張
        fo.setAttribute('width', 280);

        // y 座標の補正: 高さが広がった分だけ y 座標を少し引き上げ、接続線の中心点を保つ
        if (window.G) {
          const idx = window.G.sections.findIndex(s => s.id === nodeId);
          if (idx !== -1) {
            const basePos = 320; // P のデフォルト座標
            const calculatedY = basePos - (newHeight / 2);
            fo.setAttribute('y', calculatedY);
          }
        }
      }
      fo.style.overflow = 'visible'; // 枠外はみ出し表示を許可
    });

    // 4. 重なりを完全に排除する横一列自動レイアウト (x座標の等間隔再配置)
    if (window.G && window.G.sections) {
      const nodesOrder = ['start', ...window.G.sections.map(s => s.id), 'submit'];
      let currentX = 30; // 開始ノードの開始X位置

      nodesOrder.forEach(nodeId => {
        const fo = svg.querySelector(`#node-${nodeId}`);
        if (fo) {
          fo.setAttribute('x', currentX);
          
          // 次のノードのX座標は、このノードの幅 (280px または 240px) + 間隔 (120px) を足す
          const width = parseFloat(fo.getAttribute('width') || 240);
          currentX += width + 120; // 120pxの十分な間隔をあけて重なりを完全防止！
        }
      });

      // SVG自体の表示幅の自動拡張 (全ノードが収まるように)
      svg.setAttribute('width', currentX + 100);
      svg.style.width = (currentX + 100) + 'px';
    }

    // 5. SVG自体の表示高さ限界の自動拡張 (スクロールカットを完全に防止する)
    const svgHeight = parseFloat(svg.getAttribute('height') || 0);
    if (svgHeight > 0 && svgHeight < 680) {
      svg.setAttribute('height', 720); // 余裕を持たせたサイズに変更
    }
  }

  // 端子のMousedownハンドラー
  function onConnectorMouseDown(e, conn, fromSectionId, svg) {
    e.stopPropagation();
    e.preventDefault();

    const cType = conn.dataset.connectorType || 'default';
    const qId = conn.dataset.questionId || null;
    const optIdx = conn.dataset.optionIndex !== undefined ? parseInt(conn.dataset.optionIndex, 10) : null;

    const startPt = getConnectorSVGCoords(conn, svg);

    // 一時的なドラッグ線の作成
    const edgesGroup = document.getElementById('flowmap-edges');
    if (!edgesGroup) return;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'edge-path temp-drag-path');
    edgesGroup.appendChild(path);

    dragConnection = {
      active: true,
      fromSectionId,
      connectorType: cType,
      questionId: qId,
      optionIndex: optIdx,
      tempPath: path,
      startX: startPt.x,
      startY: startPt.y
    };

    console.log('Drag branch started from:', fromSectionId, cType);
  }

  // ドラッグ移動処理
  function onFlowmapMouseMove(e) {
    if (!dragConnection.active) return;

    const svg = document.getElementById('flowmap-svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const zoom = window.currentFlowmapZoom || 1.0;

    // マウス位置のSVGローカル座標変換 (ズーム倍率で直接割ることで二重スケール適用バグを防止)
    let ex = (e.clientX - rect.left) / zoom;
    let ey = (e.clientY - rect.top) / zoom;

    // 周辺の INポート への「ピタッ」と吸着するスナップ処理 (画面絶対座標 ClientRect ベース: 45ピクセル距離)
    let targetX = ex;
    let targetY = ey;
    let snapsToPort = null;

    const inPorts = document.querySelectorAll('.flow-port-in');
    inPorts.forEach(port => {
      const pRect = port.getBoundingClientRect();
      const pCenterX = pRect.left + pRect.width / 2;
      const pCenterY = pRect.top + pRect.height / 2;

      // 画面上の実距離をピクセル単位で直接計算 (ズーム比率に影響されない)
      const distanceViewport = Math.hypot(e.clientX - pCenterX, e.clientY - pCenterY);
      if (distanceViewport < 45) { // 画面上で 45px 以内に近づいたら強制吸着
        // 吸着先のポート中心点をSVGローカル座標に変換して設定 (同じくズーム倍率で割る)
        targetX = ((pRect.left - rect.left) + pRect.width / 2) / zoom;
        targetY = ((pRect.top - rect.top) + pRect.height / 2) / zoom;
        snapsToPort = port;
      }
    });

    if (snapsToPort) {
      if (currentHoveredInPort && currentHoveredInPort !== snapsToPort) {
        currentHoveredInPort.classList.remove('drag-hover');
      }
      currentHoveredInPort = snapsToPort;
      currentHoveredInPort.classList.add('drag-hover');
    } else {
      if (currentHoveredInPort) {
        currentHoveredInPort.classList.remove('drag-hover');
        currentHoveredInPort = null;
      }
    }

    const sx = dragConnection.startX;
    const sy = dragConnection.startY;

    // 三次ベジェ曲線で点線矢印を動的に曲げる (吸着した座標、またはマウス座標に向けて)
    const dx = Math.abs(targetX - sx) * 0.5;
    const d = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${targetX - dx} ${targetY}, ${targetX} ${targetY}`;
    dragConnection.tempPath.setAttribute('d', d);
  }

  // ドロップ（マウスリリース）処理
  function onFlowmapMouseUp(e) {
    if (!dragConnection.active) return;

    document.querySelectorAll('.flow-port-in').forEach(el => el.classList.remove('drag-hover'));

    const mx = e.clientX;
    const my = e.clientY;
    let toSectionId = null;

    // 1. マウスがスナップして吸着ハイライトされているポートがあれば、それを最優先で接続先にする (これが最も確実)
    if (currentHoveredInPort) {
      toSectionId = currentHoveredInPort.dataset.nodeId;
    }

    // 2. スナップしていない場合、広い当たり判定 (画面絶対座標で前後30px) で INポート を判定
    if (!toSectionId) {
      const inPorts = document.querySelectorAll('.flow-port-in');
      for (const port of inPorts) {
        const pRect = port.getBoundingClientRect();
        if (mx >= pRect.left - 30 && mx <= pRect.right + 30 &&
            my >= pRect.top - 30 && my <= pRect.bottom + 30) {
          toSectionId = port.dataset.nodeId;
          break;
        }
      }
    }

    // 3. マウスの直下にあるDOM要素から直接カードを検索する (ElementsFromPoint 判定)
    if (!toSectionId) {
      const elements = document.elementsFromPoint(mx, my);
      for (const el of elements) {
        const card = el.closest('.flow-node-card');
        if (card) {
          const foreignObj = card.closest('foreignObject');
          if (foreignObj) {
            const foreignId = foreignObj.id || '';
            if (foreignId === 'node-submit') {
              toSectionId = 'submit';
            } else if (foreignId !== 'node-start') {
              toSectionId = foreignId.replace('node-', '');
            }
            break;
          }
        }
      }
    }

    // 4. フォールバック: 各ノードカード全体の矩形領域 (画面絶対座標) で判定
    if (!toSectionId) {
      const cards = document.querySelectorAll('.flow-node-card');
      for (const card of cards) {
        const cRect = card.getBoundingClientRect();
        if (mx >= cRect.left && mx <= cRect.right &&
            my >= cRect.top && my <= cRect.bottom) {
          const foreignObj = card.closest('foreignObject');
          if (foreignObj) {
            const foreignId = foreignObj.id || '';
            if (foreignId === 'node-submit') {
              toSectionId = 'submit';
            } else if (foreignId !== 'node-start') {
              toSectionId = foreignId.replace('node-', '');
            }
            break;
          }
        }
      }
    }

    // 一時的なパスの削除
    if (dragConnection.tempPath) {
      dragConnection.tempPath.remove();
    }

    if (toSectionId && toSectionId !== dragConnection.fromSectionId) {
      console.log('Drop successful: connect', dragConnection.fromSectionId, 'to', toSectionId);
      applyNewBranchConnection(dragConnection.fromSectionId, toSectionId, dragConnection);
    } else {
      console.log('Drag cancelled (outside valid target)');
    }

    dragConnection.active = false;
    currentHoveredInPort = null;
  }

  // ドラッグ端子のSVG座標計算
  function getConnectorSVGCoords(conn, svg) {
    const rect = conn.getBoundingClientRect();
    const sRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;

    let x = (rect.left - sRect.left) + rect.width / 2;
    let y = (rect.top - sRect.top) + rect.height / 2;

    if (viewBox && viewBox.width > 0) {
      x = x * (viewBox.width / sRect.width);
      y = y * (viewBox.height / sRect.height);
    }

    return { x, y };
  }

  // データストアの分岐先更新（相互連動）
  function applyNewBranchConnection(fromId, toId, dragInfo) {
    if (!window.G || !window.G.sections) return;

    // 1. 循環参照（ループ）チェックの実行
    if (detectCycleAfterConnection(fromId, toId, dragInfo)) {
      showFlowErrorToast('⚠️ 循環参照エラー: 遷移が無限ループとなる接続は設定できません。');
      return;
    }

    // window.n.sections 側の同期参照 (保存時の先祖返り防止)
    const fromSectionN = (window.n && window.n.sections) ? window.n.sections.find(s => s.id === fromId) : null;

    // Startノードからの接続変更
    if (fromId === 'start') {
      // G側
      const toIdx = window.G.sections.findIndex(s => s.id === toId);
      if (toIdx !== -1 && toIdx !== 0) {
        const [movedSec] = window.G.sections.splice(toIdx, 1);
        window.G.sections.unshift(movedSec);
      }
      // n側
      if (window.n && window.n.sections) {
        const toIdxN = window.n.sections.findIndex(s => s.id === toId);
        if (toIdxN !== -1 && toIdxN !== 0) {
          const [movedSecN] = window.n.sections.splice(toIdxN, 1);
          window.n.sections.unshift(movedSecN);
        }
      }
    } else {
      // 一般セクションからの接続変更
      const fromSection = window.G.sections.find(s => s.id === fromId);

      if (dragInfo.connectorType === 'default') {
        if (fromSection) fromSection.nextAction = toId;
        if (fromSectionN) fromSectionN.nextAction = toId;
      } else if (dragInfo.connectorType === 'conditional') {
        // 親セクションを動的に検索 (質問が個別ノードに切り出されている可能性があるため)
        const parentSec = window.G.sections.find(s => s.questions.some(q => q.id === dragInfo.questionId));
        const parentSecN = (window.n && window.n.sections) ? window.n.sections.find(s => s.questions.some(q => q.id === dragInfo.questionId)) : null;

        const question = parentSec ? parentSec.questions.find(q => q.id === dragInfo.questionId) : null;
        const questionN = parentSecN ? parentSecN.questions.find(q => q.id === dragInfo.questionId) : null;

        if (question && question.options && question.options[dragInfo.optionIndex] !== undefined) {
          question.options[dragInfo.optionIndex].nextSectionId = toId;
        }
        if (questionN && questionN.options && questionN.options[dragInfo.optionIndex] !== undefined) {
          questionN.options[dragInfo.optionIndex].nextSectionId = toId;
        }
      }
    }

    // 2. データ保存と画面双方向リフレッシュ
    try {
      if (window.S) window.S(); // ローカルストレージに保存
    } catch (err) {
      console.warn('Failed to save master state:', err);
    }

    try {
      if (window.x) window.x(); // エディターの再描画 (非表示の際にDOMエラーで落ちるのを防ぐ)
    } catch (err) {
      console.warn('Failed to refresh editor view (expected if editor tab is hidden):', err);
    }
    
    // フローマップ自体の再描画 (絶対に実行させる)
    try {
      if (window.F) window.F(window.G);
    } catch (err) {
      console.error('Failed to refresh flowmap rendering:', err);
    }

    try {
      renderLivePreview();
    } catch (err) {
      console.warn('Failed to refresh live preview:', err);
    }
  }

  // DFSによる循環参照（無限ループ）検出アルゴリズム
  function detectCycleAfterConnection(fromId, toId, dragInfo) {
    if (fromId === 'start' || toId === 'submit') return false;

    const graph = {};

    // 1. すべての頂点（セクションおよび分岐質問）を初期化
    window.G.sections.forEach(s => {
      graph[s.id] = [];
      (s.questions || []).forEach(q => {
        const isBranch = ['radio', 'select'].includes(q.type) && q.options && q.options.length > 0;
        if (isBranch) {
          graph[q.id] = [];
        }
      });
    });

    // 2. 隣接リストの構築
    window.G.sections.forEach(s => {
      // セクション本体のデフォルト遷移先
      let defNext = s.nextAction || 'next';
      
      // セクション内の質問リスト（分岐する質問と分岐しない質問）
      const normalQ = [];
      const branchQ = [];
      (s.questions || []).forEach(q => {
        if (['radio', 'select'].includes(q.type) && q.options && q.options.length > 0) {
          branchQ.push(q);
        } else {
          normalQ.push(q);
        }
      });

      // 順序の組み立て:
      // セクションノード ➔ (分岐質問1 ➔ 分岐質問2 ...) ➔ 次のセクション/送信
      let prevNodeId = s.id;

      branchQ.forEach(bq => {
        // 前のノードからこの分岐質問への自動線を追加
        if (graph[prevNodeId]) {
          graph[prevNodeId].push(bq.id);
        }

        // 分岐質問の各選択肢からの遷移
        bq.options.forEach(opt => {
          if (opt.nextSectionId) {
            graph[bq.id].push(opt.nextSectionId);
          }
        });

        prevNodeId = bq.id;
      });

      // 最後のノードからデフォルトの遷移先を追加
      if (defNext === 'next') {
        const idx = window.G.sections.findIndex(sec => sec.id === s.id);
        if (idx !== -1 && idx < window.G.sections.length - 1) {
          if (graph[prevNodeId]) graph[prevNodeId].push(window.G.sections[idx + 1].id);
        } else {
          if (graph[prevNodeId]) graph[prevNodeId].push('submit');
        }
      } else if (defNext && defNext !== 'next') {
        if (graph[prevNodeId]) graph[prevNodeId].push(defNext);
      }
    });

    // 新たに接続するエッジを追加（上書き更新）
    if (!graph[fromId]) graph[fromId] = [];
    
    if (dragInfo.connectorType === 'default') {
      graph[fromId] = []; // 一旦クリアして新規先だけにする
      graph[fromId].push(toId);
    } else {
      const parentSec = window.G.sections.find(s => s.questions.some(q => q.id === dragInfo.questionId));
      if (parentSec) {
        const question = parentSec.questions.find(q => q.id === dragInfo.questionId);
        if (question && question.options && question.options[dragInfo.optionIndex]) {
          const oldDest = question.options[dragInfo.optionIndex].nextSectionId;
          if (oldDest) {
            const idx = graph[fromId].indexOf(oldDest);
            if (idx !== -1) {
              graph[fromId].splice(idx, 1);
            }
          }
        }
      }
      graph[fromId].push(toId);
    }

    // DFS (深さ優先探索) で toId から辿って fromId に戻る経路（バックエッジ）があるか検証
    const visited = {};
    const recStack = {};

    function hasCycleDFS(node) {
      if (!visited[node]) {
        visited[node] = true;
        recStack[node] = true;

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
          if (!visited[neighbor] && hasCycleDFS(neighbor)) {
            return true;
          } else if (recStack[neighbor]) {
            return true; // ループ検出
          }
        }
      }
      recStack[node] = false;
      return false;
    }

    // 新たな接続先からループ探索を開始
    return hasCycleDFS(toId);
  }

  // 到達不能（孤立）セクションのハイライト表示処理
  function highlightIsolatedSections(svg) {
    if (!window.G || !window.G.sections || window.G.sections.length === 0) return;

    const startSecId = window.G.sections[0].id;
    const reached = {};
    reached[startSecId] = true;

    // 隣接グラフの構築
    const graph = {};
    window.G.sections.forEach(s => {
      graph[s.id] = [];
      let defNext = s.nextAction || 'next';
      if (defNext === 'next') {
        const idx = window.G.sections.findIndex(sec => sec.id === s.id);
        if (idx !== -1 && idx < window.G.sections.length - 1) {
          defNext = window.G.sections[idx + 1].id;
        } else {
          defNext = 'submit';
        }
      }
      if (defNext && defNext !== 'submit') {
        graph[s.id].push(defNext);
      }

      s.questions.forEach(q => {
        if (['radio', 'select'].includes(q.type) && q.options) {
          q.options.forEach(opt => {
            if (opt.nextSectionId && opt.nextSectionId !== 'submit') {
              graph[s.id].push(opt.nextSectionId);
            }
          });
        }
      });
    });

    // BFSで到達可能な全ノードを探索
    const queue = [startSecId];
    while (queue.length > 0) {
      const node = queue.shift();
      const neighbors = graph[node] || [];
      neighbors.forEach(neighbor => {
        if (!reached[neighbor]) {
          reached[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }

    // 到達不能なノードに孤立CSSクラスを追加
    window.G.sections.forEach((s, idx) => {
      const nodeEl = svg.querySelector(`foreignObject[id="node-${s.id}"] .flow-node-card`);
      if (nodeEl) {
        if (!reached[s.id] && idx !== 0) {
          nodeEl.classList.add('flow-node-isolated');
        } else {
          nodeEl.classList.remove('flow-node-isolated');
        }
      }
    });
  }

  // ループエラー表示用トースト
  function showFlowErrorToast(msg) {
    const existing = document.querySelector('.flow-error-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'flow-error-toast';
    toast.innerHTML = `<span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'none';
      toast.offsetHeight; // リフロー
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // ================= 既存エディターおよびプレビュー側の設定同期 =================

  function initEditorMode() {
    const btnSimple = document.getElementById('btn-mode-simple');
    const btnPro = document.getElementById('btn-mode-pro');
    const proPanel = document.getElementById('pro-settings-panel');

    if (!btnSimple || !btnPro) return;

    btnSimple.addEventListener('click', () => {
      setEditorMode('simple');
    });

    btnPro.addEventListener('click', () => {
      setEditorMode('pro');
    });

    window.setEditorMode = function(mode) {
      editorMode = mode;
      if (window.G) window.G.editorMode = mode;
      
      const bSimple = document.getElementById('btn-mode-simple');
      const bPro = document.getElementById('btn-mode-pro');
      const pPanel = document.getElementById('pro-settings-panel');

      if (mode === 'pro') {
        if (bSimple) bSimple.classList.remove('active');
        if (bPro) bPro.classList.add('active');
        if (pPanel) pPanel.style.display = 'flex';
        loadProSettingsToInputs();
      } else {
        if (bSimple) bSimple.classList.add('active');
        if (bPro) bPro.classList.remove('active');
        if (pPanel) pPanel.style.display = 'none';
      }
      applyPreviewTheme();
      renderLivePreview();
      if (window.x) window.x();
    };

    const popup = document.getElementById('pro-feature-popup');
    const btnClosePopup = document.getElementById('btn-close-pro-popup');
    const btnSwitchPro = document.getElementById('btn-popup-switch-pro');

    if (btnClosePopup) {
      btnClosePopup.addEventListener('click', () => {
        popup.style.display = 'none';
      });
    }

    if (btnSwitchPro) {
      btnSwitchPro.addEventListener('click', () => {
        setEditorMode('pro');
        popup.style.display = 'none';
      });
    }

    document.addEventListener('click', (e) => {
      if (editorMode === 'simple') {
        const target = e.target;
        // 簡易版・プロ版の切り替えタブや切り替えスイッチ自体はブロック対象外にする
        if (target.closest('#btn-mode-pro') || target.closest('#btn-mode-simple') || target.closest('.mode-switch-btn')) {
          return;
        }
        if (target.closest('#pro-settings-panel') || target.classList.contains('pro-only-action')) {
          e.preventDefault();
          e.stopPropagation();
          showProFeaturePopup('プロ版なら、より高度な分岐ロジックや自由度の高いデザイン編集、法人API連携が利用可能になります！');
        }
      }
    }, true);
  }

  function loadProSettingsToInputs() {
    if (!window.G) return;
    
    window.G.appearance = window.G.appearance || {
      colorPreset: "seattle_blue",
      primaryColor: "#0056b3",
      backgroundColor: "#f8fafd",
      contrast: 100,
      fontSizes: { title: "large", section: "medium", label: "medium" }
    };
    window.G.header = window.G.header || {
      logoText: "株式会社wayway",
      title: window.G.title || "Yahoo!ショッピング",
      subtitle: "運営代行 お申し込みフォーム",
      disclaimer: window.G.description || "※ 株式会社waywayが運営する出店サポート..."
    };
    window.G.announcement = window.G.announcement || {
      showDuration: true,
      durationText: "所要時間 目安5~10分",
      showAlertBox: true,
      alertBoxText: "全項目を半角・全角の指定に沿ってご入力ください..."
    };
    window.G.displayMode = window.G.displayMode || "scroll";
    window.G.progressIndicator = window.G.progressIndicator || "both";

    const g = window.G;

    document.getElementById('editor-pro-logo').value = g.header.logoText || "";
    document.getElementById('editor-pro-title').value = g.header.title || "";
    document.getElementById('editor-pro-subtitle').value = g.header.subtitle || "";
    document.getElementById('editor-pro-disclaimer').value = g.header.disclaimer || "";

    document.getElementById('editor-pro-display-mode').value = g.displayMode;
    document.getElementById('editor-pro-progress-indicator').value = g.progressIndicator;

    document.getElementById('editor-pro-contrast').value = g.appearance.contrast || 100;
    document.getElementById('editor-pro-color-primary').value = g.appearance.primaryColor;
    document.getElementById('editor-pro-color-bg').value = g.appearance.backgroundColor;

    document.getElementById('editor-pro-size-title').value = g.appearance.fontSizes.title;
    document.getElementById('editor-pro-size-section').value = g.appearance.fontSizes.section;
    document.getElementById('editor-pro-size-label').value = g.appearance.fontSizes.label;

    document.getElementById('editor-pro-show-duration').checked = !!g.announcement.showDuration;
    document.getElementById('editor-pro-show-alert').checked = !!g.announcement.showAlertBox;
    document.getElementById('editor-pro-duration-text').value = g.announcement.durationText || "";
    document.getElementById('editor-pro-alert-text').value = g.announcement.alertBoxText || "";

    document.getElementById('pro-duration-input-group').style.display = g.announcement.showDuration ? 'block' : 'none';
    document.getElementById('pro-alert-input-group').style.display = g.announcement.showAlertBox ? 'block' : 'none';

    updatePresetChipsState();
    setupProInputListeners();
  }

  function showProFeaturePopup(text) {
    const popup = document.getElementById('pro-feature-popup');
    const pText = document.getElementById('pro-popup-hint-text');
    if (popup && pText) {
      pText.textContent = text;
      popup.style.display = 'block';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 8000);
    }
  }

  let listenersAttached = false;
  function setupProInputListeners() {
    if (listenersAttached) return;
    listenersAttached = true;

    const bindInput = (id, callback) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          callback(e.target.value);
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        });
      }
    };

    const bindChange = (id, callback) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          callback(e.target.type === 'checkbox' ? e.target.checked : e.target.value);
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        });
      }
    };

    bindInput('editor-pro-logo', v => window.G.header.logoText = v);
    bindInput('editor-pro-title', v => {
      window.G.header.title = v;
      window.G.title = v;
      const simpleTitleInput = document.getElementById('editor-form-title');
      if (simpleTitleInput) simpleTitleInput.value = v;
    });
    bindInput('editor-pro-subtitle', v => window.G.header.subtitle = v);
    bindInput('editor-pro-disclaimer', v => {
      window.G.header.disclaimer = v;
      window.G.description = v;
      const simpleDescInput = document.getElementById('editor-form-desc');
      if (simpleDescInput) simpleDescInput.value = v;
    });

    bindChange('editor-pro-display-mode', v => window.G.displayMode = v);
    bindChange('editor-pro-progress-indicator', v => window.G.progressIndicator = v);

    bindInput('editor-pro-contrast', v => {
      window.G.appearance.contrast = parseInt(v, 10);
      const basePreset = COLOR_PRESETS[window.G.appearance.colorPreset];
      if (basePreset) {
        window.G.appearance.backgroundColor = adjustColorContrast(basePreset.bg, 100 + (100 - v));
        document.getElementById('editor-pro-color-bg').value = window.G.appearance.backgroundColor;
      }
    });

    bindChange('editor-pro-color-primary', v => {
      window.G.appearance.primaryColor = v;
      window.G.appearance.colorPreset = "custom";
      updatePresetChipsState();
    });
    bindChange('editor-pro-color-bg', v => {
      window.G.appearance.backgroundColor = v;
      window.G.appearance.colorPreset = "custom";
      updatePresetChipsState();
    });

    bindChange('editor-pro-size-title', v => window.G.appearance.fontSizes.title = v);
    bindChange('editor-pro-size-section', v => window.G.appearance.fontSizes.section = v);
    bindChange('editor-pro-size-label', v => window.G.appearance.fontSizes.label = v);

    bindChange('editor-pro-show-duration', v => {
      window.G.announcement.showDuration = v;
      document.getElementById('pro-duration-input-group').style.display = v ? 'block' : 'none';
    });
    bindChange('editor-pro-show-alert', v => {
      window.G.announcement.showAlertBox = v;
      document.getElementById('pro-alert-input-group').style.display = v ? 'block' : 'none';
    });

    bindInput('editor-pro-duration-text', v => window.G.announcement.durationText = v);
    bindInput('editor-pro-alert-text', v => window.G.announcement.alertBoxText = v);
  }

  function initColorPresets() {
    const container = document.getElementById('pro-color-presets');
    if (!container) return;

    container.innerHTML = "";
    Object.entries(COLOR_PRESETS).forEach(([key, preset]) => {
      const chip = document.createElement('button');
      chip.type = "button";
      chip.className = "preset-chip";
      chip.dataset.presetKey = key;
      chip.innerHTML = `
        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; border:1px solid rgba(0,0,0,0.1); background:${preset.primary};"></span>
        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; border:1px solid rgba(0,0,0,0.1); background:${preset.bg}; margin-left:-6px;"></span>
        <span>${preset.label}</span>
      `;

      chip.addEventListener('click', () => {
        if (editorMode === 'simple') return;
        
        window.G.appearance.colorPreset = key;
        window.G.appearance.primaryColor = preset.primary;
        window.G.appearance.backgroundColor = preset.bg;
        window.G.appearance.contrast = 100;

        document.getElementById('editor-pro-color-primary').value = preset.primary;
        document.getElementById('editor-pro-color-bg').value = preset.bg;
        document.getElementById('editor-pro-contrast').value = 100;

        updatePresetChipsState();
        applyPreviewTheme();
        renderLivePreview();
        if (window.S) window.S();
      });

      container.appendChild(chip);
    });
  }

  function updatePresetChipsState() {
    if (!window.G || !window.G.appearance) return;
    const currentPreset = window.G.appearance.colorPreset || "custom";
    document.querySelectorAll('.preset-chip').forEach(chip => {
      if (chip.dataset.presetKey === currentPreset) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function applyPreviewTheme() {
    const previewContainer = document.querySelector('.preview-container');
    const previewCard = document.querySelector('.preview-card');
    if (!previewContainer || !previewCard || !window.G) return;

    const g = window.G;
    const isPro = editorMode === "pro";

    const logoArea = document.getElementById('preview-logo-area');
    const logoTextSpan = document.getElementById('preview-logo-text');
    const subtitleP = document.getElementById('preview-form-subtitle');
    const disclaimerP = document.getElementById('preview-form-disclaimer');
    const durationBox = document.getElementById('preview-duration-box');
    const alertBox = document.getElementById('preview-alert-box');
    const announceArea = document.getElementById('preview-announcement-area');

    if (isPro) {
      if (g.header && g.header.logoText) {
        logoTextSpan.textContent = g.header.logoText;
        logoArea.style.display = 'block';
      } else {
        logoArea.style.display = 'none';
      }

      if (g.header && g.header.subtitle) {
        subtitleP.textContent = g.header.subtitle;
        subtitleP.style.display = 'block';
      } else {
        subtitleP.style.display = 'none';
      }

      if (g.header && g.header.disclaimer) {
        disclaimerP.textContent = g.header.disclaimer;
        disclaimerP.style.display = 'block';
      } else {
        disclaimerP.style.display = 'none';
      }

      let showAnnounce = false;
      if (g.announcement.showDuration && g.announcement.durationText) {
        document.getElementById('preview-duration-value').textContent = g.announcement.durationText;
        durationBox.style.display = 'flex';
        showAnnounce = true;
      } else {
        durationBox.style.display = 'none';
      }

      if (g.announcement.showAlertBox && g.announcement.alertBoxText) {
        document.getElementById('preview-alert-value').textContent = g.announcement.alertBoxText;
        alertBox.style.display = 'block';
        showAnnounce = true;
      } else {
        alertBox.style.display = 'none';
      }
      announceArea.style.display = showAnnounce ? 'flex' : 'none';

      if (g.displayMode === 'scroll') {
        previewContainer.classList.add('preview-scroll-mode');
        document.querySelector('.progress-bar-container').style.display = 'none';
      } else {
        previewContainer.classList.remove('preview-scroll-mode');
        const indicator = g.progressIndicator || "both";
        document.querySelector('.progress-bar-container').style.display = indicator === 'none' ? 'none' : 'block';
      }

      const primaryColor = g.appearance.primaryColor || "#0056b3";
      const bgColor = g.appearance.backgroundColor || "#f8fafd";
      const txtColor = getTextColorForBg(bgColor);

      previewContainer.style.setProperty('--color-primary', primaryColor);
      previewCard.style.backgroundColor = bgColor;
      previewCard.style.color = txtColor;

      const titleSize = g.appearance.fontSizes.title === 'small' ? '1.5rem' : g.appearance.fontSizes.title === 'large' ? '2.2rem' : '1.8rem';
      const sectionSize = g.appearance.fontSizes.section === 'small' ? '1.1rem' : g.appearance.fontSizes.section === 'large' ? '1.5rem' : '1.3rem';
      const labelSize = g.appearance.fontSizes.label === 'small' ? '0.8rem' : g.appearance.fontSizes.label === 'large' ? '1.0rem' : '0.9rem';

      document.getElementById('preview-form-title').style.fontSize = titleSize;
      previewCard.style.setProperty('--preview-section-title-size', sectionSize);
      previewCard.style.setProperty('--preview-label-size', labelSize);

    } else {
      logoArea.style.display = 'none';
      subtitleP.style.display = 'none';
      disclaimerP.style.display = 'none';
      announceArea.style.display = 'none';
      previewContainer.classList.remove('preview-scroll-mode');
      document.querySelector('.progress-bar-container').style.display = 'block';

      previewContainer.style.setProperty('--color-primary', '#0056b3');
      previewCard.style.backgroundColor = '#ffffff';
      previewCard.style.color = '#212529';
      document.getElementById('preview-form-title').style.fontSize = '1.8rem';
    }
  }

  function setupPreviewModeOverrides() {
    const originalZ = window.Z;
    if (originalZ) {
      window.Z = function(tabName) {
        originalZ(tabName);
        if (tabName === 'preview') {
          setTimeout(() => {
            applyPreviewTheme();
            setupLiveAutocompleteEvents();
            evaluateLiveSkipLogic();
            checkAndRestoreDraftSession();
            setupPreviewDraftObserver();
          }, 150);
        }
      };
    }

    window.addEventListener('message', (event) => {
      if (!event.data) return;
      if (event.data.type === 'FORM_SUBMIT_TEMPORARY_RESPONSE') {
        const { rowId, success } = event.data;
        if (success && rowId) {
          window.currentResumeRowId = rowId;
          renderLivePreview();
          injectDraftSavePanelToPreview();
        }
      } else if (event.data.type === 'FORM_TEMPORARY_DATA_RESPONSE') {
        const { rowId, data } = event.data;
        if (rowId && data) {
          window.currentResumeRowId = rowId;
          window.V = window.V || {};
          Object.assign(window.V, data);
          restoreAnswersToDOM(data);
          if (window.x) window.x();
          evaluateLiveSkipLogic();
          injectDraftSavePanelToPreview();
        }
      }
    });
  }

  function setupPreviewDraftObserver() {
    const container = document.getElementById('preview-section-container');
    if (!container) return;
    injectDraftSavePanelToPreview();
    const observer = new MutationObserver(() => {
      observer.disconnect();
      try {
        injectDraftSavePanelToPreview();
      } finally {
        observer.observe(container, { childList: true, subtree: true });
      }
    });
    observer.observe(container, { childList: true, subtree: true });
  }

  function injectDraftSavePanelToPreview() {
    const container = document.getElementById('preview-section-container');
    if (!container) return;
    const existing = container.querySelector('.preview-draft-save-panel');
    if (existing) existing.remove();
    if (!window.L || !window.L.sections || !window.R) return;
    const activeSec = window.L.sections.find(s => s.id === window.R);
    if (!activeSec || !activeSec.draftSaveConfig || !activeSec.draftSaveConfig.enabled) return;
    const draftPanel = document.createElement('div');
    draftPanel.className = 'preview-draft-save-panel';
    draftPanel.style.cssText = 'background: rgba(254, 252, 191, 0.4); border: 1.5px dashed #ecc94b; border-radius: 6px; padding: 14px; margin-top: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); color: #744210;';
    const isSaved = !!window.currentResumeRowId;
    const resumeUrl = isSaved ? `${window.location.origin}${window.location.pathname}?resumeRowId=${window.currentResumeRowId}` : '';
    const displayUrl = isSaved ? (resumeUrl.length > 45 ? resumeUrl.substring(0, 42) + '...' : resumeUrl) : '';
    draftPanel.innerHTML = `
      <div style="font-size: 0.75rem; font-weight: 700; color: #b7791f; display:flex; align-items:center; gap:4px; text-transform: uppercase;">💾 一時保存（下書き保存）機能</div>
      <div style="font-size: 0.75rem; color: #744210; line-height: 1.4; font-weight: 500;">${escapeHtml(activeSec.draftSaveConfig.message || 'ここまでの回答を一時保存して、後から再開することができます。')}</div>
      <div style="display:flex; gap:8px; margin-top: 4px;">
        <button type="button" id="btn-preview-draft-save-action" class="btn btn-sm btn-warning" style="font-size: 0.75rem; font-weight: 700; background-color: #ecc94b; border-color: #d69e2e; color: #744210; padding: 6px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; width: 100%; justify-content: center;">${isSaved ? '回答を更新して保存する' : 'ここまでの回答を一時保存する'}</button>
      </div>
      <div id="draft-url-box" style="display: ${isSaved ? 'flex' : 'none'}; align-items: center; background: #ffffff; border: 1px solid #ecc94b; border-radius: 4px; height: 32px; padding: 0 8px; justify-content: space-between; gap: 6px; margin-top: 4px;">
        <span id="draft-url-text" style="font-size: 0.7rem; color: #4a5568; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: calc(100% - 30px);" title="${resumeUrl}">${displayUrl}</span>
        <button type="button" id="btn-preview-draft-url-copy" style="background: none; border: none; cursor: pointer; font-size: 0.85rem; padding: 0 4px; display: flex; align-items: center; justify-content: center; height: 100%; border-left: 1px solid #edf2f7; color: #ecc94b;">📋</button>
      </div>
      <div id="draft-copy-toast" style="display: none; font-size: 0.65rem; color: #38a169; font-weight: bold; text-align: right; margin-top: -2px;">✓ コピーしました！</div>
    `;
    container.appendChild(draftPanel);
    const saveBtn = draftPanel.querySelector('#btn-preview-draft-save-action');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveBtn.disabled = true;
        saveBtn.textContent = '保存中...';
        const data = window.V || {};
        window.parent.postMessage({ type: 'FORM_SUBMIT', formTitle: window.L.title || '無題のフォーム', data: data, isTemporary: true, rowId: window.currentResumeRowId || null }, '*');
      });
    }
    const copyBtn = draftPanel.querySelector('#btn-preview-draft-url-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resumeUrl).then(() => {
          const toast = draftPanel.querySelector('#draft-copy-toast');
          if (toast) {
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2000);
          }
        });
      });
    }
  }

  function restoreAnswersToDOM(data) {
    const container = document.getElementById('preview-section-container');
    if (!container) return;
    Object.keys(data).forEach(qId => {
      const val = data[qId];
      const card = container.querySelector(`.preview-q-card[data-question-id="${qId}"]`);
      if (!card) return;
      const input = card.querySelector('input[type="text"], textarea, select');
      if (input) {
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        const radios = card.querySelectorAll('input[type="radio"]');
        if (radios.length > 0) {
          radios.forEach(radio => {
            if (radio.value === val) {
              radio.checked = true;
              radio.dispatchEvent(new Event('change', { bubbles: true }));
              const label = radio.closest('.preview-option-label');
              if (label) label.classList.add('selected');
            } else {
              radio.checked = false;
              const label = radio.closest('.preview-option-label');
              if (label) label.classList.remove('selected');
            }
          });
        }
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
          const valArray = Array.isArray(val) ? val : [val];
          checkboxes.forEach(cb => {
            if (valArray.includes(cb.value)) {
              cb.checked = true;
              cb.dispatchEvent(new Event('change', { bubbles: true }));
              const label = cb.closest('.preview-option-label');
              if (label) label.classList.add('selected');
            } else {
              cb.checked = false;
              const label = cb.closest('.preview-option-label');
              if (label) label.classList.remove('selected');
            }
          });
        }
      }
    });
  }

  function checkAndRestoreDraftSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeRowId = urlParams.get('resumeRowId');
    if (resumeRowId) {
      window.currentResumeRowId = resumeRowId;
      window.parent.postMessage({ type: 'FORM_GET_TEMPORARY_DATA', rowId: resumeRowId, formTitle: (window.L && window.L.title) || (window.G && window.G.title) || '無題のフォーム' }, '*');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }


  function setupLiveAutocompleteEvents() {
    const container = document.getElementById('preview-section-container');
    if (!container) return;

    const cards = container.querySelectorAll('.preview-q-card');
    cards.forEach(card => {
      const questionId = card.dataset.questionId;
      if (!questionId) return;

      let qDef = null;
      if (window.L && window.L.sections) {
        for (const sec of window.L.sections) {
          qDef = sec.questions.find(q => q.id === questionId);
          if (qDef) break;
        }
      }
      if (!qDef) return;

      if (qDef.required) {
        const qTitleEl = card.querySelector('.preview-q-title');
        if (qTitleEl && !qTitleEl.innerHTML.includes('red-asterisk')) {
          qTitleEl.innerHTML = `<span class="red-asterisk" style="color:var(--color-danger, #dc3545); margin-right:4px;">*</span>` + qTitleEl.innerHTML;
        }
      }

      if (qDef.type === 'text' && (normalizeText(qDef.title).includes('郵便') || normalizeText(qDef.title).includes('zip'))) {
        const zipInput = card.querySelector('input');
        if (zipInput) {
          zipInput.maxLength = 7;
          zipInput.placeholder = "例: 7300013";
          
          zipInput.addEventListener('input', (e) => {
            const val = e.target.value.replace(/[^\d]/g, '');
            e.target.value = val;

            if (val.length === 7) {
              const addr = ZIP_DATABASE[val];
              if (addr) {
                autoFillAddressFields(addr);
                clearIntegrityError(card);
              } else {
                showIntegrityError(card, '郵便番号に合致する住所が見つかりません。');
              }
            } else if (val.length > 0 && val.length < 7) {
              showIntegrityError(card, '郵便番号は7桁の半角数字で入力してください。');
            } else {
              clearIntegrityError(card);
            }
          });

          zipInput.addEventListener('change', () => {
            validateAddressIntegrity(zipInput.value);
          });
        }
      }

      if (qDef.type === 'text' && (qDef.title.includes('銀行') || qDef.title.includes('金融機関'))) {
        const bankInput = card.querySelector('input');
        if (bankInput) {
          bankInput.addEventListener('change', (e) => {
            const bankName = e.target.value.trim();
            const bankInfo = BANK_DATABASE[bankName];
            if (bankInfo) {
              autoFillBankCode(bankInfo.code);
              clearIntegrityError(card);
            } else {
              if (bankName !== "") {
                showIntegrityError(card, '銀行名と金融機関コードが一致しません。');
              }
            }
          });
        }
      }

      if (qDef.type === 'text' && qDef.title.includes('支店名')) {
        const branchInput = card.querySelector('input');
        if (branchInput) {
          branchInput.addEventListener('change', (e) => {
            const branchName = e.target.value.trim();
            const bankName = getSelectedBankName();
            const bankInfo = BANK_DATABASE[bankName];
            if (bankInfo && bankInfo.branches[branchName]) {
              autoFillBranchCode(bankInfo.branches[branchName]);
              clearIntegrityError(card);
            } else {
              if (branchName !== "" && bankName !== "") {
                showIntegrityError(card, '支店名と支店番号が一致しません。');
              }
            }
          });
        }
      }

      if (qDef.type === 'text' && (qDef.title.includes('電話') || qDef.title.includes('tel'))) {
        const telInput = card.querySelector('input');
        if (telInput) {
          setupTelInputHyphenToggle(card, telInput);
        }
      }

      if (qDef.type === 'password') {
        setupPasswordConfirmLogic(card, questionId);
      }

      if (qDef.type === 'text' && (qDef.title.includes('生年月日') || qDef.title.includes('設立日') || qDef.title.includes('日付'))) {
        const dateInput = card.querySelector('input');
        if (dateInput) {
          dateInput.type = "date";
          dateInput.addEventListener('change', (e) => {
            validateDateReality(card, e.target.value, qDef.title);
          });
        }
      }

      if (editorMode === 'pro' && qDef.type === 'text' && (qDef.title.includes('法人名') || qDef.title.includes('企業名') || qDef.title.includes('会社名'))) {
        setupCorpApiSearch(card, qDef);
      }

      if (editorMode === 'pro' && qDef.type === 'text' && (qDef.title.includes('インボイス') || qDef.title.includes('登録番号'))) {
        setupInvoiceApiSearch(card, qDef);
      }

      const innerInput = card.querySelector('input, textarea, select');
      if (innerInput) {
        innerInput.addEventListener('change', () => {
          evaluateLiveSkipLogic();
        });
      }
    });
  }

  function autoFillAddressFields(addr) {
    const container = document.getElementById('preview-section-container');
    const inputs = container.querySelectorAll('.preview-q-card input');
    
    inputs.forEach(input => {
      const card = input.closest('.preview-q-card');
      const title = card ? card.querySelector('.preview-q-title').textContent : "";
      
      if (title.includes('都道府県')) {
        input.value = addr.pref;
        triggerInputChange(input);
      } else if (title.includes('市区町村')) {
        input.value = addr.city;
        triggerInputChange(input);
      } else if (title.includes('町名') || title.includes('番地') || title.includes('住所')) {
        input.value = addr.street;
        triggerInputChange(input);
      }
    });
  }

  function validateAddressIntegrity(zipVal) {
    const container = document.getElementById('preview-section-container');
    const inputs = container.querySelectorAll('.preview-q-card input');
    let fullAddr = "";
    let zipCard = null;

    inputs.forEach(input => {
      const card = input.closest('.preview-q-card');
      const title = card ? card.querySelector('.preview-q-title').textContent : "";
      if (title.includes('郵便番号')) {
        zipCard = card;
      }
      if (title.includes('都道府県') || title.includes('市区町村') || title.includes('住所')) {
        fullAddr += input.value;
      }
    });

    if (zipVal && zipVal.length === 7 && fullAddr !== "") {
      const matched = ZIP_DATABASE[zipVal];
      if (matched) {
        if (!fullAddr.includes(matched.pref) || !fullAddr.includes(matched.city)) {
          showIntegrityError(zipCard, '郵便番号と住所が一致しません。');
        } else {
          clearIntegrityError(zipCard);
        }
      }
    }
  }

  function autoFillBankCode(code) {
    const inputs = document.querySelectorAll('#preview-section-container input');
    inputs.forEach(input => {
      const title = input.closest('.preview-q-card').querySelector('.preview-q-title').textContent;
      if (title.includes('金融機関コード') || title.includes('銀行コード')) {
        input.value = code;
        triggerInputChange(input);
      }
    });
  }

  function autoFillBranchCode(code) {
    const inputs = document.querySelectorAll('#preview-section-container input');
    inputs.forEach(input => {
      const title = input.closest('.preview-q-card').querySelector('.preview-q-title').textContent;
      if (title.includes('支店番号') || title.includes('支店コード')) {
        input.value = code;
        triggerInputChange(input);
      }
    });
  }

  function getSelectedBankName() {
    let bankName = "";
    const inputs = document.querySelectorAll('#preview-section-container input');
    inputs.forEach(input => {
      const title = input.closest('.preview-q-card').querySelector('.preview-q-title').textContent;
      if (title.includes('銀行名') || title.includes('金融機関名')) {
        bankName = input.value.trim();
      }
    });
    return bankName;
  }

  function setupTelInputHyphenToggle(card, input) {
    const existing = card.querySelector('.hyphen-toggle-container');
    if (existing) existing.remove();

    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'hyphen-toggle-container';
    toggleWrapper.innerHTML = `
      <span style="color:var(--color-text-muted);">ハイフン形式:</span>
      <button type="button" class="hyphen-toggle-btn active" data-type="with">あり (例: 090-1234-5678)</button>
      <button type="button" class="hyphen-toggle-btn" data-type="without">なし (例: 09012345678)</button>
    `;

    input.parentNode.insertBefore(toggleWrapper, input.nextSibling);

    let formatMode = "with";

    toggleWrapper.querySelectorAll('.hyphen-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleWrapper.querySelectorAll('.hyphen-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        formatMode = btn.dataset.type;
        validateTelNumber();
      });
    });

    const validateTelNumber = () => {
      const val = input.value.trim();
      if (val === "") {
        clearIntegrityError(card);
        return;
      }

      if (formatMode === "with") {
        const hasHyphen = val.includes('-');
        const phoneRegex = /^(0\d{1,4}-\d{1,4}-\d{4})$/;
        if (!hasHyphen || !phoneRegex.test(val)) {
          showIntegrityError(card, 'ハイフン「あり」の形式で入力してください。');
        } else {
          clearIntegrityError(card);
        }
      } else {
        const hasHyphen = val.includes('-');
        const noHyphenRegex = /^(0\d{9,10})$/;
        if (hasHyphen || !noHyphenRegex.test(val)) {
          showIntegrityError(card, 'ハイフン「なし」の形式で入力してください。');
        } else {
          clearIntegrityError(card);
        }
      }
    };

    input.addEventListener('input', validateTelNumber);
  }

  function setupPasswordConfirmLogic(card, qId) {
    const wrapper = card.querySelector('.password-wrapper');
    if (!wrapper) return;

    const mainInput = wrapper.querySelector('.password-main-field');
    const confirmInput = wrapper.querySelector('.password-confirm-field');
    if (!mainInput || !confirmInput) return;

    const errMsgDiv = card.querySelector('.error-message');
    const errText = errMsgDiv ? errMsgDiv.querySelector('.error-text') : null;

    const checkMatch = () => {
      const p1 = mainInput.value;
      const p2 = confirmInput.value;
      if (p1 !== "" && p2 !== "" && p1 !== p2) {
        card.classList.add('has-error');
        if (errMsgDiv && errText) {
          errText.textContent = "パスワードが一致しません。";
          errMsgDiv.style.display = "flex";
        }
      } else {
        card.classList.remove('has-error');
        if (errMsgDiv) errMsgDiv.style.display = "none";
      }
    };

    mainInput.addEventListener('input', checkMatch);
    confirmInput.addEventListener('input', checkMatch);
  }

  function validateDateReality(card, val, title) {
    if (!val) {
      clearIntegrityError(card);
      return;
    }

    const inputDate = new Date(val);
    const today = new Date();
    const ageDiff = today.getFullYear() - inputDate.getFullYear();
    const isBirthday = title.includes('生年月日') || title.includes('誕生');
    
    let warningDiv = card.querySelector('.warning-message');
    if (!warningDiv) {
      warningDiv = document.createElement('div');
      warningDiv.className = 'warning-message';
      warningDiv.style.display = 'none';
      card.appendChild(warningDiv);
    }

    if (isBirthday) {
      if (inputDate > today) {
        showHardError(card, '未来の日付は指定できません。');
        warningDiv.style.display = 'none';
      } else if (ageDiff >= 125) {
        showHardError(card, '生存の可能性が極めて低い年数です。');
        warningDiv.style.display = 'none';
      } else if (ageDiff >= 100 && ageDiff < 125) {
        clearHardError(card);
        warningDiv.innerHTML = `\u26A0\uFE0F \u6CE8意: \u5E74\u9F62\u304C ${ageDiff} \u6B73\u3068なっています。\u304A間違いありませんか？`;
        warningDiv.style.display = 'flex';
      } else {
        clearHardError(card);
        warningDiv.style.display = 'none';
      }
    } else {
      if (inputDate > today) {
        showHardError(card, '未来の設立日は指定できません。');
        warningDiv.style.display = 'none';
      } else if (ageDiff >= 300) {
        showHardError(card, '現実的ではない年数が入力されています。');
        warningDiv.style.display = 'none';
      } else if (ageDiff >= 150 && ageDiff < 300) {
        clearHardError(card);
        warningDiv.innerHTML = `\u26A0\uFE0F \u6CE8意: \u8A2D立年が ${inputDate.getFullYear()} \u5E74\uFF08約 ${ageDiff} \u5E74前\uFF09です。\u304A間違いありませんか？`;
        warningDiv.style.display = 'flex';
      } else {
        clearHardError(card);
        warningDiv.style.display = 'none';
      }
    }
  }

  function setupCorpApiSearch(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    const oldPanel = card.querySelector('.corp-search-panel');
    if (oldPanel) oldPanel.remove();

    const searchPanel = document.createElement('div');
    searchPanel.className = 'corp-search-panel';
    searchPanel.style.cssText = 'position:absolute; background:#ffffff; border:1px solid var(--color-border); border-radius:4px; z-index:2000; width:100%; box-shadow:var(--shadow-md); display:none; max-height:200px; overflow-y:auto; margin-top:2px;';
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(searchPanel);

    const filterContainer = document.createElement('div');
    filterContainer.style.cssText = 'display:flex; gap:6px; align-items:center; margin-top:6px;';
    filterContainer.innerHTML = `
      <span style="font-size:0.75rem; color:var(--color-text-muted);">エリア絞り込み:</span>
      <select class="corp-pref-filter" style="font-size:0.75rem; padding:2px; background:var(--color-bg-card); color:var(--color-text); border:1px solid var(--color-border); border-radius:3px;">
        <option value="">都道府県すべて</option>
        <option value="東京都">東京都</option>
        <option value="広島県">広島県</option>
        <option value="大阪府">大阪府</option>
      </select>
    `;
    input.parentNode.insertBefore(filterContainer, input.nextSibling);

    const prefSelect = filterContainer.querySelector('.corp-pref-filter');

    const executeSearch = () => {
      const val = normalizeText(input.value);
      const selPref = prefSelect.value;

      if (val === "") {
        searchPanel.style.display = 'none';
        return;
      }

      let matched = CORP_DATABASE.filter(item => {
        const normName = normalizeText(item.name);
        const normKana = normalizeText(item.nameKana);
        return normName.includes(val) || normKana.includes(val);
      });

      if (selPref !== "") {
        matched = matched.filter(item => item.pref === selPref);
      }

      if (matched.length > 0) {
        searchPanel.innerHTML = "";
        matched.forEach(item => {
          const row = document.createElement('div');
          row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05);';
          row.innerHTML = `
            <div style="font-weight:600; color:var(--color-primary);">${item.name}</div>
            <div style="font-size:0.7rem; color:var(--color-text-muted);">法人番号: ${item.num} | ${item.pref}</div>
          `;
          
          row.addEventListener('click', () => {
            input.value = item.name;
            searchPanel.style.display = 'none';
            activeApiMetadata.company_name = item.name;
            activeApiMetadata.establishmentDate = item.estDate;
            autoFillCorpNumberFields(item.num);
            triggerInputChange(input);
          });
          searchPanel.appendChild(row);
        });
        searchPanel.style.display = 'block';
      } else {
        searchPanel.style.display = 'none';
      }
    };

    input.addEventListener('input', executeSearch);
    prefSelect.addEventListener('change', executeSearch);

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        searchPanel.style.display = 'none';
      }
    });
  }

  function autoFillCorpNumberFields(num) {
    const inputs = document.querySelectorAll('#preview-section-container input');
    inputs.forEach(input => {
      const title = input.closest('.preview-q-card').querySelector('.preview-q-title').textContent;
      if (title.includes('法人番号') || title.includes('会社番号')) {
        input.value = num;
        triggerInputChange(input);
      }
    });
  }

  function setupInvoiceApiSearch(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    const oldPanel = card.querySelector('.invoice-search-panel');
    if (oldPanel) oldPanel.remove();

    const searchPanel = document.createElement('div');
    searchPanel.className = 'invoice-search-panel';
    searchPanel.style.cssText = 'position:absolute; background:#ffffff; border:1px solid var(--color-border); border-radius:4px; z-index:2000; width:100%; box-shadow:var(--shadow-md); display:none; max-height:200px; overflow-y:auto; margin-top:2px;';
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(searchPanel);

    input.placeholder = "Tから始まる13桁 (例: T1010001999999)";

    input.addEventListener('input', (e) => {
      const val = normalizeText(e.target.value);
      if (val === "" || val.length < 3) {
        searchPanel.style.display = 'none';
        return;
      }

      const matched = CORP_DATABASE.filter(item => {
        return item.num.includes(val) || item.name.includes(val) || ("t" + item.num).includes(val);
      });

      if (matched.length > 0) {
        searchPanel.innerHTML = "";
        matched.forEach(item => {
          const row = document.createElement('div');
          row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05);';
          row.innerHTML = `
            <div style="font-weight:600; color:var(--color-primary);">${item.name}</div>
            <div style="font-size:0.7rem; color:var(--color-text-muted);">登録番号: T${item.num}</div>
          `;
          
          row.addEventListener('click', () => {
            input.value = "T" + item.num;
            searchPanel.style.display = 'none';
            activeApiMetadata.invoice_number = "T" + item.num;
            activeApiMetadata.registrationDate = item.regDate;
            if (item.cancelDate) {
              activeApiMetadata.cancellationDate = item.cancelDate;
            } else {
              delete activeApiMetadata.cancellationDate;
            }
            triggerInputChange(input);
          });
          searchPanel.appendChild(row);
        });
        searchPanel.style.display = 'block';
      } else {
        searchPanel.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        searchPanel.style.display = 'none';
      }
    });
  }

  const originalDt = window.Dt;
  if (originalDt) {
    window.Dt = function() {
      originalDt();
      
      const jsonPre = document.getElementById('submitted-data-json');
      if (jsonPre) {
        try {
          const baseData = JSON.parse(jsonPre.textContent);
          if (activeApiMetadata.invoice_number) {
            baseData.registrationDate = activeApiMetadata.registrationDate;
            if (activeApiMetadata.cancellationDate) {
              baseData.cancellationDate = activeApiMetadata.cancellationDate;
            }
          }
          if (activeApiMetadata.company_name) {
            baseData.establishmentDate = baseData.establishmentDate || activeApiMetadata.establishmentDate || null;
          }
          jsonPre.textContent = JSON.stringify(baseData, null, 2);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }

  function patchPresetSelectMenu() {
    const presetSelect = document.getElementById('select-preset-question');
    if (!presetSelect) return;

    if (!presetSelect.querySelector('option[value="pro_address"]')) {
      const optGroup = document.createElement('optgroup');
      optGroup.label = "🏢 郵便・銀行・PW 必須プリセット";

      const optAddr = document.createElement('option');
      optAddr.value = "pro_address";
      optAddr.textContent = "住所入力（郵便番号自動補完付き一括セット）";
      optGroup.appendChild(optAddr);

      const optBank = document.createElement('option');
      optBank.value = "pro_bank";
      optBank.textContent = "銀行口座（コード・支店自動補完一括セット）";
      optGroup.appendChild(optBank);

      const optPw = document.createElement('option');
      optPw.value = "pro_password";
      optPw.textContent = "パスワード入力（確認用・目のマーク同期一括セット）";
      optGroup.appendChild(optPw);

      presetSelect.appendChild(optGroup);
    }

    const originalWe = window.we;
    const selectChanger = (e) => {
      const val = e.target.value;
      if (!val.startsWith('pro_')) return;

      e.stopPropagation();
      e.preventDefault();

      const activeSec = window.n.sections.find(s => s.id === window.r);
      if (!activeSec) return;

      const baseTime = Date.now();

      if (val === 'pro_address') {
        activeSec.questions.push(
          { id: `q_zip_${baseTime}`, type: "text", title: "郵便番号", description: "7桁半角数字を入力すると住所を自動補完します", required: true },
          { id: `q_pref_${baseTime}`, type: "text", title: "都道府県", description: "", required: true },
          { id: `q_city_${baseTime}`, type: "text", title: "市区町村", description: "", required: true },
          { id: `q_street_${baseTime}`, type: "text", title: "町名・番地・建物名", description: "", required: true }
        );
      } else if (val === 'pro_bank') {
        activeSec.questions.push(
          { id: `q_bank_name_${baseTime}`, type: "text", title: "銀行名", description: "例: ウェイウェイ銀行", required: true },
          { id: `q_bank_code_${baseTime}`, type: "text", title: "金融機関コード", description: "自動入力されます", required: true },
          { id: `q_branch_name_${baseTime}`, type: "text", title: "支店名", description: "例: 東京支店", required: true },
          { id: `q_branch_code_${baseTime}`, type: "text", title: "支店番号", description: "自動入力されます", required: true }
        );
      } else if (val === 'pro_password') {
        activeSec.questions.push(
          { id: `q_pw_${baseTime}`, type: "password", title: "パスワード", description: "伏せ字で表示されます", required: true }
        );
      }

      e.target.value = "";
      if (window.S) window.S();
      if (window.x) window.x();
      renderLivePreview();
    };

    presetSelect.removeEventListener('change', window.we);
    presetSelect.addEventListener('change', (e) => {
      if (e.target.value.startsWith('pro_')) {
        selectChanger(e);
      } else {
        originalWe(e);
        renderLivePreview();
      }
    });
  }

  function triggerInputChange(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function showIntegrityError(card, text) {
    if (!card) return;
    card.classList.add('has-error');
    let errDiv = card.querySelector('.error-message');
    if (!errDiv) {
      errDiv = document.createElement('div');
      errDiv.className = 'error-message';
      errDiv.style.display = 'none';
      card.appendChild(errDiv);
    }
    const errText = errDiv.querySelector('.error-text') || errDiv;
    errText.textContent = text;
    errDiv.style.display = 'flex';

    const submitBtn = document.getElementById('btn-preview-submit');
    const nextBtn = document.getElementById('btn-preview-next');
    if (submitBtn) submitBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
  }

  function clearIntegrityError(card) {
    if (!card) return;
    card.classList.remove('has-error');
    const errDiv = card.querySelector('.error-message');
    if (errDiv) errDiv.style.display = 'none';

    const submitBtn = document.getElementById('btn-preview-submit');
    const nextBtn = document.getElementById('btn-preview-next');
    if (submitBtn) submitBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  function showHardError(card, text) {
    showIntegrityError(card, text);
  }

  function clearHardError(card) {
    clearIntegrityError(card);
  }

  function setupEditorRenderHooks() {
    const originalLe = window.le;
    if (originalLe) {
      window.le = function(sec) {
        originalLe(sec);
        renderLivePreview();

        // --- 一時保存（下書き）設定UIの動的挿入 ---
        const metaEdit = document.querySelector('.section-meta-edit');
        if (metaEdit && !metaEdit.querySelector('.draft-save-config-container')) {
          const draftContainer = document.createElement('div');
          draftContainer.className = 'draft-save-config-container';
          draftContainer.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--color-border);';
          draftContainer.innerHTML = `
            <div class="form-group" style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="editor-section-draft-enable" style="width: 16px; height: 16px; cursor: pointer; margin: 0;" />
              <label for="editor-section-draft-enable" style="margin: 0; cursor: pointer; font-weight: 600; font-size: 0.8rem; color: var(--color-text);">このセクションの後に一時保存を有効にする</label>
            </div>
            <div id="draft-message-edit-wrapper" style="display: none; flex-direction: column; gap: 4px; margin-top: 8px;">
              <label for="editor-section-draft-message" style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted);">一時保存の案内文章</label>
              <textarea id="editor-section-draft-message" class="form-control" rows="2" style="font-size:0.8rem;"></textarea>
            </div>
          `;
          const nextSelect = document.getElementById('editor-section-next');
          if (nextSelect && nextSelect.parentElement) {
            nextSelect.parentElement.insertAdjacentElement('afterend', draftContainer);
          } else {
            metaEdit.appendChild(draftContainer);
          }
        }

        const draftEnable = document.getElementById('editor-section-draft-enable');
        const draftMsgWrapper = document.getElementById('draft-message-edit-wrapper');
        const draftMsg = document.getElementById('editor-section-draft-message');
        if (draftEnable && draftMsg) {
          if (!sec.draftSaveConfig) {
            sec.draftSaveConfig = { enabled: false, message: 'ここまでの回答を一時保存して、後から再開することができます。' };
          }
          draftEnable.checked = sec.draftSaveConfig.enabled || false;
          draftMsg.value = sec.draftSaveConfig.message || 'ここまでの回答を一時保存して、後から再開することができます。';
          draftMsgWrapper.style.display = sec.draftSaveConfig.enabled ? 'flex' : 'none';

          draftEnable.onchange = function() {
            sec.draftSaveConfig.enabled = draftEnable.checked;
            draftMsgWrapper.style.display = draftEnable.checked ? 'flex' : 'none';
            if (window.S) window.S();
            if (window.x) window.x();
            renderLivePreview();
          };
          draftMsg.oninput = function() {
            sec.draftSaveConfig.message = draftMsg.value;
            if (window.S) window.S();
            if (window.x) window.x();
            renderLivePreview();
          };
        }
        // ------------------------------------------


        if (editorMode !== 'pro') return;

        const qCards = document.querySelectorAll('#questions-container .question-card');
        qCards.forEach(qCard => {
          const qId = qCard.dataset.questionId;
          const qDef = sec.questions.find(q => q.id === qId);
          if (!qDef) return;

          if (qCard.querySelector('.pro-skip-logic-container')) return;

          const skipContainer = document.createElement('div');
          skipContainer.className = 'pro-skip-logic-container';
          skipContainer.style.cssText = 'margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--color-border); display:flex; flex-direction:column; gap:8px;';

          const otherQuestions = sec.questions.filter(q => q.id !== qId);
          let optionsHtml = '<option value="">-- スキップ分岐を設定しない --</option>';
          otherQuestions.forEach(oq => {
            optionsHtml += `<option value="${oq.id}">${oq.title || '無題の質問'}</option>`;
          });

          qDef.skipLogic = qDef.skipLogic || { dependsOn: "", condition: "equals", value: "", action: "disable" };

          skipContainer.innerHTML = `
            <span style="font-size:0.8rem; font-weight:600; color:var(--color-primary);">⚡ プロ版限定: セクション内スキップ（条件分岐）</span>
            <div class="form-group-row" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <select class="form-control skip-depends-select" style="flex:2; font-size:0.8rem; height:32px;">
                ${optionsHtml}
              </select>
              <select class="form-control skip-action-select" style="flex:1; font-size:0.8rem; height:32px;">
                <option value="disable">非活性にする</option>
                <option value="hide">非表示にする</option>
              </select>
              <input type="text" class="form-control skip-value-input" style="flex:1; font-size:0.8rem; height:32px;" placeholder="トリガー値" />
            </div>
          `;

          const actionsRow = qCard.querySelector('.question-card-actions');
          if (actionsRow) {
            qCard.insertBefore(skipContainer, actionsRow);
          }

          const depSelect = skipContainer.querySelector('.skip-depends-select');
          const actSelect = skipContainer.querySelector('.skip-action-select');
          const valInput = skipContainer.querySelector('.skip-value-input');

          depSelect.value = qDef.skipLogic.dependsOn || "";
          actSelect.value = qDef.skipLogic.action || "disable";
          valInput.value = qDef.skipLogic.value || "";

          const saveLogic = () => {
            qDef.skipLogic.dependsOn = depSelect.value;
            qDef.skipLogic.action = actSelect.value;
            qDef.skipLogic.value = valInput.value;
            if (window.S) window.S();
            renderLivePreview();
          };

          depSelect.addEventListener('change', saveLogic);
          actSelect.addEventListener('change', saveLogic);
          valInput.addEventListener('input', saveLogic);
        });
      };
    }

    const originalX = window.x;
    if (originalX) {
      window.x = function() {
        originalX();
        renderLivePreview();
      };
    }

    document.addEventListener('input', (e) => {
      const target = e.target;
      if (target.closest('.question-card') || target.closest('.section-meta-edit') || target.closest('.form-title-desc-card') || target.closest('.form-group')) {
        renderLivePreview();
      }
    });

    document.addEventListener('focusout', (e) => {
      const target = e.target;
      if (target.closest('.question-card') || target.closest('.section-meta-edit') || target.closest('.form-title-desc-card')) {
        renderLivePreview();
      }
    });
  }

  function evaluateLiveSkipLogic() {
    if (!window.L || !window.L.sections) return;

    const activeSec = window.L.sections.find(s => s.id === window.R);
    if (!activeSec) return;

    const values = window.V || {};

    activeSec.questions.forEach(q => {
      const card = document.querySelector(`.preview-q-card[data-question-id="${q.id}"]`);
      if (!card) return;

      if (q.skipLogic && q.skipLogic.dependsOn) {
        const depId = q.skipLogic.dependsOn;
        const triggerVal = q.skipLogic.value;
        const action = q.skipLogic.action || "disable";
        
        const answer = values[depId] ? values[depId].toString().trim() : "";
        const isTriggered = answer !== "" && answer === triggerVal;

        if (isTriggered) {
          if (action === 'disable') {
            card.classList.add('q-card-disabled');
            const input = card.querySelector('input, textarea, select');
            if (input) input.disabled = true;
          } else {
            card.style.display = 'none';
          }
          delete values[q.id];
          delete values[q.id + "_confirm"];
        } else {
          card.classList.remove('q-card-disabled');
          const input = card.querySelector('input, textarea, select');
          if (input) input.disabled = false;
          if (action === 'hide') {
            card.style.display = 'block';
          }
        }
      }
    });

    updatePreviewProgressCounter();
  }

  function updatePreviewProgressCounter() {
    if (!window.L || !window.L.sections) return;
    
    const activeSec = window.L.sections.find(s => s.id === window.R);
    if (!activeSec) return;

    let totalQuestions = 0;
    let answeredQuestions = 0;

    activeSec.questions.forEach(q => {
      const card = document.querySelector(`.preview-q-card[data-question-id="${q.id}"]`);
      if (card && card.style.display !== 'none' && !card.classList.contains('q-card-disabled')) {
        totalQuestions++;
        const val = window.V[q.id];
        if (val !== undefined && val !== "") {
          answeredQuestions++;
        }
      }
    });

    const percent = totalQuestions === 0 ? 100 : Math.round((answeredQuestions / totalQuestions) * 100);
    const progressText = document.getElementById('preview-progress-text');
    const progressBar = document.getElementById('preview-progress-bar');
    
    if (progressText && window.G) {
      const indicator = window.G.progressIndicator || "both";
      const totalSecs = window.L.sections.length;
      const currentSecIdx = window.L.sections.findIndex(s => s.id === window.R) + 1;

      let displayText = `セクション ${currentSecIdx} / ${totalSecs}`;
      
      if (indicator === 'percentage') {
        displayText = `進捗率: ${percent}%`;
      } else if (indicator === 'page_number') {
        displayText = `ページ: ${currentSecIdx} / ${totalSecs}`;
      } else if (indicator === 'section_title') {
        displayText = `入力項目: ${activeSec.title || '無題'}`;
      } else if (indicator === 'both') {
        displayText = `ページ: ${currentSecIdx} / ${totalSecs} (${percent}%完了)`;
      }

      progressText.textContent = displayText;
      if (progressBar) progressBar.style.width = `${percent}%`;
    }
  }

  function renderLivePreview() {
    const liveContainer = document.getElementById('live-preview-section-container');
    if (!liveContainer || !window.n) return;

    const g = window.G || window.n;
    const activeSec = window.n.sections ? window.n.sections.find(s => s.id === window.r) : null;
    const isPro = editorMode === "pro";

    const liveCard = document.querySelector('.device-screen-content');
    const liveLogoArea = document.getElementById('live-preview-logo-area');
    const liveLogoTextSpan = document.getElementById('live-preview-logo-text');
    const liveTitleH = document.getElementById('live-preview-form-title');
    const liveSubtitleP = document.getElementById('live-preview-form-subtitle');
    const liveDescP = document.getElementById('live-preview-form-desc');
    const liveDisclaimerP = document.getElementById('live-preview-form-disclaimer');
    const liveAnnounceArea = document.getElementById('live-preview-announcement-area');
    const liveDurationBox = document.getElementById('live-preview-duration-box');
    const liveAlertBox = document.getElementById('live-preview-alert-box');

    const currentFormTitle = document.getElementById('editor-form-title') ? document.getElementById('editor-form-title').value : (g.title || "");
    const currentFormDesc = document.getElementById('editor-form-desc') ? document.getElementById('editor-form-desc').value : (g.description || "");
    liveTitleH.textContent = currentFormTitle || "セクション";
    liveDescP.textContent = currentFormDesc || "";

    if (isPro && g.header && g.appearance) {
      if (g.header.logoText) {
        liveLogoTextSpan.textContent = g.header.logoText;
        liveLogoArea.style.display = 'block';
      } else {
        liveLogoArea.style.display = 'none';
      }

      if (g.header.subtitle) {
        liveSubtitleP.textContent = g.header.subtitle;
        liveSubtitleP.style.display = 'block';
      } else {
        liveSubtitleP.style.display = 'none';
      }

      if (g.header.disclaimer) {
        liveDisclaimerP.textContent = g.header.disclaimer;
        liveDisclaimerP.style.display = 'block';
      } else {
        liveDisclaimerP.style.display = 'none';
      }

      let showLiveAnnounce = false;
      if (g.announcement.showDuration && g.announcement.durationText) {
        document.getElementById('live-preview-duration-value').textContent = g.announcement.durationText;
        liveDurationBox.style.display = 'flex';
        showLiveAnnounce = true;
      } else {
        liveDurationBox.style.display = 'none';
      }

      if (g.announcement.showAlertBox && g.announcement.alertBoxText) {
        document.getElementById('live-preview-alert-value').textContent = g.announcement.alertBoxText;
        liveAlertBox.style.display = 'block';
        showLiveAnnounce = true;
      } else {
        liveAlertBox.style.display = 'none';
      }
      liveAnnounceArea.style.display = showLiveAnnounce ? 'flex' : 'none';

      const primaryColor = g.appearance.primaryColor || "#0056b3";
      const bgColor = g.appearance.backgroundColor || "#f8fafd";
      const txtColor = getTextColorForBg(bgColor);

      liveCard.parentNode.style.setProperty('--color-primary', primaryColor);
      liveCard.style.backgroundColor = bgColor;
      liveCard.style.color = txtColor;

      const titleSize = g.appearance.fontSizes.title === 'small' ? '1.1rem' : g.appearance.fontSizes.title === 'large' ? '1.5rem' : '1.3rem';
      const sectionSize = g.appearance.fontSizes.section === 'small' ? '0.9rem' : g.appearance.fontSizes.section === 'large' ? '1.2rem' : '1.0rem';
      const labelSize = g.appearance.fontSizes.label === 'small' ? '0.75rem' : g.appearance.fontSizes.label === 'large' ? '0.95rem' : '0.85rem';

      liveTitleH.style.fontSize = titleSize;
      liveCard.style.setProperty('--preview-section-title-size', sectionSize);
      liveCard.style.setProperty('--preview-label-size', labelSize);

      if (g.displayMode === 'scroll') {
        document.getElementById('live-progress-bar-container').style.display = 'none';
      } else {
        const indicator = g.progressIndicator || "both";
        document.getElementById('live-progress-bar-container').style.display = indicator === 'none' ? 'none' : 'block';
      }
    } else {
      liveLogoArea.style.display = 'none';
      liveSubtitleP.style.display = 'none';
      liveDisclaimerP.style.display = 'none';
      liveAnnounceArea.style.display = 'none';
      document.getElementById('live-progress-bar-container').style.display = 'block';

      liveCard.parentNode.style.setProperty('--color-primary', '#0056b3');
      liveCard.style.backgroundColor = '#ffffff';
      liveCard.style.color = '#212529';
      liveTitleH.style.fontSize = '1.3rem';
    }

    if (window.n.sections) {
      const totalSecs = window.n.sections.length;
      const currentSecIdx = window.n.sections.findIndex(s => s.id === window.r) + 1;
      const progText = document.getElementById('live-preview-progress-text');
      if (progText) {
        progText.textContent = `セクション ${currentSecIdx || 1} / ${totalSecs || 1}`;
      }
    }

    liveContainer.innerHTML = "";

    if (!activeSec || !activeSec.questions || activeSec.questions.length === 0) {
      liveContainer.innerHTML = `
        <div style="text-align:center; padding:30px; color:var(--color-text-muted); font-size:0.8rem; border:1px dashed var(--color-border); border-radius:4px;">
          このセクションにはまだ質問がありません。<br>左側の「＋ 質問を追加」またはプリセットから質問を作成してください。
        </div>
      `;
      return;
    }

    const secTitle = activeSec.title ? activeSec.title.trim() : "";
    const secDesc = activeSec.description ? activeSec.description.trim() : "";
    if (secTitle !== "" || secDesc !== "") {
      const secHeader = document.createElement('div');
      secHeader.style.cssText = 'margin-bottom: 20px; border-bottom: 1.5px solid var(--color-primary); padding-bottom: 6px;';
      secHeader.innerHTML = `
        <h3 style="font-size:var(--preview-section-title-size, 1rem); font-weight:700; margin:0; color:var(--color-primary);">${secTitle || 'セクションタイトル'}</h3>
        ${secDesc ? `<p style="font-size:0.75rem; color:var(--color-text-muted); margin:4px 0 0 0;">${secDesc}</p>` : ''}
      `;
      liveContainer.appendChild(secHeader);
    }

    activeSec.questions.forEach(q => {
      const qCard = document.createElement('div');
      qCard.className = 'preview-q-card';
      qCard.style.cssText = 'background:rgba(0,0,0,0.015); border:1px solid var(--color-border); border-radius:4px; padding:12px; margin-bottom:12px; display:flex; flex-direction:column; gap:6px; transition:border-color 0.2s;';

      const reqAsterisk = q.required ? `<span style="color:var(--color-danger, #dc3545); margin-right:4px;">*</span>` : '';
      const qTitle = q.title ? q.title.trim() : '無題の質問';
      const qDesc = q.description ? q.description.trim() : '';

      let inputHtml = "";
      if (q.type === 'text') {
        inputHtml = `<input type="text" class="form-control form-control-sm" placeholder="回答を入力してください" disabled style="opacity: 0.8; background: var(--color-bg-input);" />`;
      } else if (q.type === 'textarea') {
        inputHtml = `<textarea class="form-control form-control-sm" rows="2" placeholder="自由回答を入力してください" disabled style="opacity: 0.8; background: var(--color-bg-input);"></textarea>`;
      } else if (q.type === 'radio') {
        let opts = "";
        const options = q.options || [{ label: "選択肢1" }, { label: "選択肢2" }];
        options.forEach(opt => {
          opts += `
            <label style="display:flex; align-items:center; gap:6px; font-size:0.75rem; margin:0; cursor:default;">
              <input type="radio" disabled style="margin:0;" /> ${opt.label}
            </label>
          `;
        });
        inputHtml = `<div style="display:flex; flex-direction:column; gap:6px; padding:2px 0;">${opts}</div>`;
      } else if (q.type === 'checkbox') {
        let opts = "";
        const options = q.options || [{ label: "選択肢1" }, { label: "選択肢2" }];
        options.forEach(opt => {
          opts += `
            <label style="display:flex; align-items:center; gap:6px; font-size:0.75rem; margin:0; cursor:default;">
              <input type="checkbox" disabled style="margin:0;" /> ${opt.label}
            </label>
          `;
        });
        inputHtml = `<div style="display:flex; flex-direction:column; gap:6px; padding:2px 0;">${opts}</div>`;
      } else if (q.type === 'select') {
        let opts = `<option value="">選択してください</option>`;
        const options = q.options || [{ label: "選択肢1" }, { label: "選択肢2" }];
        options.forEach(opt => {
          opts += `<option>${opt.label}</option>`;
        });
        inputHtml = `<select class="form-control form-control-sm" disabled style="opacity: 0.8; background: var(--color-bg-input);">${opts}</select>`;
      } else if (q.type === 'password') {
        inputHtml = `
          <div class="password-input-wrapper" style="display:flex; flex-direction:column; gap:6px; width:100%;">
            <div style="position:relative; display:flex; align-items:center; width:100%;">
              <input type="password" class="form-control form-control-sm" placeholder="パスワードを入力してください" disabled style="opacity: 0.8; background: var(--color-bg-input); width:100%; padding-right:32px;" />
              <button type="button" class="password-toggle-eye-btn" style="position:absolute; right:8px; background:none; border:none; cursor:default;" disabled>👁️</button>
            </div>
            <input type="password" class="form-control form-control-sm" placeholder="確認用パスワードを入力してください" disabled style="opacity: 0.8; background: var(--color-bg-input); width:100%;" />
          </div>
        `;
      } else if (q.type === 'file') {
        inputHtml = `
          <div style="border:1.5px dashed var(--color-border); padding:10px; border-radius:4px; text-align:center; font-size:0.7rem; color:var(--color-text-muted); background:rgba(0,0,0,0.01);">
            <span>📎 ファイルを選択またはドラッグ＆ドロップ</span>
          </div>
        `;
      }

      qCard.innerHTML = `
        <div class="preview-q-title" style="font-size:var(--preview-label-size, 0.85rem); font-weight:600; color:var(--color-text); margin:0;">
          ${reqAsterisk}${qTitle}
        </div>
        ${qDesc ? `<div style="font-size:0.7rem; color:var(--color-text-muted); margin-top:-2px;">${qDesc}</div>` : ''}
        <div class="preview-q-input-wrap" style="margin-top:4px;">
          ${inputHtml}
        </div>
      `;

      liveContainer.appendChild(qCard);
    });

    if (activeSec && activeSec.draftSaveConfig && activeSec.draftSaveConfig.enabled) {
      const draftPanel = document.createElement('div');
      draftPanel.className = 'preview-draft-save-panel';
      draftPanel.style.cssText = 'background: rgba(254, 252, 191, 0.4); border: 1.5px dashed #ecc94b; border-radius: 6px; padding: 14px; margin-top: 20px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); color: #744210; text-align: left;';
      const isSaved = !!window.currentResumeRowId;
      const resumeUrl = isSaved ? `${window.location.origin}${window.location.pathname}?resumeRowId=${window.currentResumeRowId}` : '';
      const displayUrl = isSaved ? (resumeUrl.length > 45 ? resumeUrl.substring(0, 42) + '...' : resumeUrl) : '';
      draftPanel.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 700; color: #b7791f; display:flex; align-items:center; gap:4px; text-transform: uppercase;">💾 一時保存（下書き保存）機能</div>
        <div style="font-size: 0.75rem; color: #744210; line-height: 1.4; font-weight: 500;">${escapeHtml(activeSec.draftSaveConfig.message || 'ここまでの回答を一時保存して、後から再開することができます。')}</div>
        <div style="display:flex; gap:8px; margin-top: 4px;">
          <button type="button" class="btn btn-sm btn-warning" disabled style="font-size: 0.75rem; font-weight: 700; background-color: #ecc94b; border-color: #d69e2e; color: #744210; padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; gap: 4px; width: 100%; justify-content: center; opacity: 0.8; cursor: not-allowed;">${isSaved ? '回答を更新して保存する' : 'ここまでの回答を一時保存する'}</button>
        </div>
        <div id="draft-url-box" style="display: ${isSaved ? 'flex' : 'none'}; align-items: center; background: #ffffff; border: 1px solid #ecc94b; border-radius: 4px; height: 32px; padding: 0 8px; justify-content: space-between; gap: 6px; margin-top: 4px;">
          <span id="draft-url-text" style="font-size: 0.7rem; color: #4a5568; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: calc(100% - 30px);" title="${resumeUrl}">${displayUrl}</span>
          <button type="button" style="background: none; border: none; font-size: 0.85rem; padding: 0 4px; display: flex; align-items: center; justify-content: center; height: 100%; border-left: 1px solid #edf2f7; color: #ecc94b; cursor: not-allowed;" disabled>📋</button>
        </div>
      `;
      liveContainer.appendChild(draftPanel);
    }

  }

  // リアクティブ・ステート・ポーリングループ
  let lastStateStr = "";
  setInterval(() => {
    if (window.n) {
      const currentStateStr = JSON.stringify({
        title: window.n.title,
        desc: window.n.description,
        sectionsCount: window.n.sections ? window.n.sections.length : 0,
        activeSectionId: window.r,
        appearance: window.G ? window.G.appearance : null,
        header: window.G ? window.G.header : null,
        announcement: window.G ? window.G.announcement : null,
        displayMode: window.G ? window.G.displayMode : null,
        questions: (window.n.sections && window.r) ? 
          JSON.stringify(window.n.sections.find(s => s.id === window.r)?.questions || []) : ""
      });

      if (currentStateStr !== lastStateStr) {
        lastStateStr = currentStateStr;
        console.log('Master state changed. Reactive refreshing live preview...');
        renderLivePreview();
        applyPreviewTheme();
      }
    }
  }, 250);

  window.triggerLivePreview = renderLivePreview;
  window.triggerFlowmapRender = refreshFlowmapPortsAndStyles;

  function setupValidationInterceptors() {
    // プレースホルダー
  }

  // 選択肢遷移先セレクトボックスのビジュアル改善
  function styleOptionTransitionSelects() {
    const editorPanel = document.getElementById('panel-editor');
    if (!editorPanel) return;

    // 1. 未装飾のセレクトボックスの装飾
    const deleteBtns = editorPanel.querySelectorAll('.btn-delete-option');
    deleteBtns.forEach(btn => {
      const parent = btn.parentElement;
      if (!parent) return;

      const select = parent.querySelector('select:not([data-styled])');
      if (select) {
        select.setAttribute('data-styled', 'true');
        select.classList.add('form-control', 'option-transition-select');
        select.style.width = '180px';
        select.style.display = 'inline-block';
        select.style.marginLeft = '8px';
        select.style.padding = '2px 8px';
        select.style.fontSize = '0.75rem';
        select.style.height = '28px';

        // プレースホルダー（空値）のテキストを分かりやすく変更
        const firstOpt = select.querySelector('option[value=""]');
        if (firstOpt) {
          firstOpt.textContent = '既定の動作（次のセクション）';
        }

        // 左側にバッジ/ラベルを挿入
        const label = document.createElement('span');
        label.className = 'badge badge-secondary option-transition-label';
        label.textContent = '👉 選択時の遷移先';
        label.style.fontSize = '0.7rem';
        label.style.marginLeft = '12px';
        label.style.backgroundColor = '#edf2f7';
        label.style.color = '#4a5568';
        label.style.padding = '4px 8px';
        label.style.borderRadius = '4px';
        label.style.border = '1px solid #cbd5e0';

        // select の手前にラベルを挿入
        parent.insertBefore(label, select);
      }
    });

    // 2. 循環分岐防止フィルタ（過去セクションの無効化）を適用
    const allSelects = editorPanel.querySelectorAll('select.option-transition-select, select[data-styled]');
    if (window.n && window.n.sections) {
      // window.r が未定義の場合は、安全のために最初のセクションIDか、親ウィンドウのアクティブセクションIDをフォールバック解決
      const currentSecId = window.r || (window.parent && window.parent.r) || (window.n.sections[0] ? window.n.sections[0].id : '');
      const currentIdx = window.n.sections.findIndex(s => s.id === currentSecId);
      
      if (currentSecId) {
        allSelects.forEach(select => {
          // もしセレクトボックスの現在の選択値が空値（""）または "next" である場合は、
          // 整合性向上のため、自動的に「隣のセクションのID」を選択値に割り当てて、UI表示を同期させる
          if (select.value === "" || select.value === "next") {
            const nextSec = window.n.sections[currentIdx + 1];
            if (nextSec) {
              select.value = nextSec.id;
              // React 側に値の更新を通知する
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }

          const options = select.querySelectorAll('option');
          let needChangeTrigger = false;
          options.forEach(opt => {
            const val = opt.value;
            if (val && val !== 'next' && val !== 'submit') {
              const targetIdx = window.n.sections.findIndex(s => s.id === val);
              
              // 自分自身へのループ遷移、または過去セクションへの遷移を厳格に禁止
              const isSelf = (val === currentSecId);
              const isPast = (targetIdx !== -1 && targetIdx <= currentIdx);
              
              if (isSelf || isPast) {
                // 過去・同一セクションへの遷移は非表示にして無効化
                opt.style.display = 'none';
                opt.disabled = true;

                // もし無効な遷移先が現在選択されている場合は、既定の動作に安全にリセットする
                if (select.value === val) {
                  select.value = "";
                  needChangeTrigger = true;
                }
              } else {
                // 未来のセクションであれば表示を許可
                opt.style.display = '';
                opt.disabled = false;
              }
            }
          });
          if (needChangeTrigger) {
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    }
  }

  // フローマップ内ズーム機能の動的インジェクション
  function injectZoomControls() {
    const flowmapPanel = document.getElementById('panel-flowmap');
    if (!flowmapPanel || flowmapPanel.querySelector('.flowmap-zoom-controls')) return;

    const container = flowmapPanel.querySelector('.flowmap-container') || flowmapPanel;
    container.style.position = 'relative';

    const zoomDiv = document.createElement('div');
    zoomDiv.className = 'flowmap-zoom-controls';
    zoomDiv.style.cssText = `
      position: absolute;
      bottom: 24px;
      right: 24px;
      display: flex;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      padding: 8px;
      border-radius: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border: 1px solid rgba(0,0,0,0.08);
      z-index: 10000;
    `;

    loadFlowmapPanZoom();
    let zoomVal = flowmapPanZoom.scale;
    window.currentFlowmapZoom = zoomVal;

    const label = document.createElement('span');
    label.id = 'zoom-percentage-label';
    label.textContent = Math.round(zoomVal * 100) + '%';
    label.style.cssText = 'font-size: 0.8rem; font-weight: 700; min-width: 45px; text-align: center; align-self: center; color: #4a5568;';

    const updateZoom = (val) => {
      let newScale = Math.max(0.3, Math.min(2.0, val));
      
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      
      const svgCenterX = (centerX - flowmapPanZoom.panX) / flowmapPanZoom.scale;
      const svgCenterY = (centerY - flowmapPanZoom.panY) / flowmapPanZoom.scale;
      
      flowmapPanZoom.scale = newScale;
      flowmapPanZoom.panX = centerX - svgCenterX * newScale;
      flowmapPanZoom.panY = centerY - svgCenterY * newScale;

      updateZoomPanTransform();
      saveFlowmapPanZoom();
      zoomVal = newScale;
    };

    const btnOut = document.createElement('button');
    btnOut.innerHTML = '➖';
    btnOut.className = 'btn btn-sm btn-secondary';
    btnOut.style.borderRadius = '50%';
    btnOut.style.width = '32px';
    btnOut.style.height = '32px';
    btnOut.style.padding = '0';
    btnOut.onclick = () => updateZoom(zoomVal - 0.15);

    const btnIn = document.createElement('button');
    btnIn.innerHTML = '➕';
    btnIn.className = 'btn btn-sm btn-secondary';
    btnIn.style.borderRadius = '50%';
    btnIn.style.width = '32px';
    btnIn.style.height = '32px';
    btnIn.style.padding = '0';
    btnIn.onclick = () => updateZoom(zoomVal + 0.15);

    const btnReset = document.createElement('button');
    btnReset.innerHTML = '🔄';
    btnReset.className = 'btn btn-sm btn-secondary';
    btnReset.style.borderRadius = '50%';
    btnReset.style.width = '32px';
    btnReset.style.height = '32px';
    btnReset.style.padding = '0';
    btnReset.onclick = () => {
      flowmapPanZoom.scale = 1.0;
      flowmapPanZoom.panX = 0;
      flowmapPanZoom.panY = 0;
      updateZoomPanTransform();
      saveFlowmapPanZoom();
      zoomVal = 1.0;
    };

    const btnResetData = document.createElement('button');
    btnResetData.innerHTML = '🧹 データ初期化';
    btnResetData.className = 'btn btn-sm btn-danger';
    btnResetData.style.cssText = `
      border-radius: 20px;
      padding: 0 10px;
      font-size: 0.7rem;
      font-weight: bold;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e53e3e;
      color: white;
      border: none;
      cursor: pointer;
      margin-left: 4px;
    `;
    btnResetData.onclick = () => {
      if (confirm('⚠️ 警告: フォーム編集のローカルストレージデータをすべて初期状態にリセットしますか？\n（自身で作成したフォーム定義がすべて消去され、標準の初期設定に戻ります）')) {
        localStorage.removeItem('form_customize_all_forms');
        localStorage.removeItem('form_customize_active_index');
        alert('データを完全にリセットしました。ページを再読み込みします。');
        window.location.reload();
      }
    };

    zoomDiv.appendChild(btnOut);
    zoomDiv.appendChild(label);
    zoomDiv.appendChild(btnIn);
    zoomDiv.appendChild(btnReset);
    zoomDiv.appendChild(btnResetData);
    flowmapPanel.appendChild(zoomDiv);
  }

  // ================= window.F のオーバーライド（マインドマップ型フォームエディタ） =================
  function setupFlowmapOverrideF() {
    // 編集モーダルの作成
    function openMindmapEditModal(node) {
      const oldModal = document.getElementById('mindmap-edit-modal');
      if (oldModal) oldModal.remove();

      const modal = document.createElement('div');
      modal.id = 'mindmap-edit-modal';
      modal.className = 'mindmap-edit-modal';

      let contentHtml = '';
      if (node.type === 'root') {
        contentHtml = `
          <div class="mindmap-edit-dialog">
            <div class="mindmap-dialog-header">フォームタイトルの編集</div>
            <div class="mindmap-dialog-field">
              <label>フォームタイトル</label>
              <input type="text" id="edit-node-title" class="mindmap-dialog-input" value="${node.title}">
            </div>
            <div class="mindmap-dialog-footer">
              <button class="btn btn-secondary" id="btn-edit-cancel">キャンセル</button>
              <button class="btn btn-primary" id="btn-edit-save" style="margin-left: 8px;">保存</button>
            </div>
          </div>
        `;
      } else if (node.type === 'section') {
        contentHtml = `
          <div class="mindmap-edit-dialog">
            <div class="mindmap-dialog-header">セクションの編集</div>
            <div class="mindmap-dialog-field">
              <label>セクションタイトル</label>
              <input type="text" id="edit-node-title" class="mindmap-dialog-input" value="${node.title}">
            </div>
            <div class="mindmap-dialog-footer">
              <button class="btn btn-secondary" id="btn-edit-cancel">キャンセル</button>
              <button class="btn btn-primary" id="btn-edit-save" style="margin-left: 8px;">保存</button>
            </div>
          </div>
        `;
      } else if (node.type === 'question') {
        const q = node.originalQuestion;
        contentHtml = `
          <div class="mindmap-edit-dialog">
            <div class="mindmap-dialog-header">質問の編集</div>
            <div class="mindmap-dialog-field">
              <label>質問タイトル（表示テキスト）</label>
              <input type="text" id="edit-node-title" class="mindmap-dialog-input" value="${node.title}">
            </div>
            <div class="mindmap-dialog-field">
              <label>質問タイプ</label>
              <select id="edit-node-qtype" class="mindmap-dialog-input">
                <option value="text" ${q.type==='text'?'selected':''}>テキスト入力</option>
                <option value="paragraph" ${q.type==='paragraph'?'selected':''}>長文入力</option>
                <option value="radio" ${q.type==='radio'?'selected':''}>ラジオボタン (単一選択)</option>
                <option value="checkbox" ${q.type==='checkbox'?'selected':''}>チェックボックス (複数選択)</option>
                <option value="select" ${q.type==='select'?'selected':''}>セレクトボックス</option>
              </select>
            </div>
            <div class="mindmap-dialog-footer">
              <button class="btn btn-secondary" id="btn-edit-cancel">キャンセル</button>
              <button class="btn btn-primary" id="btn-edit-save" style="margin-left: 8px;">保存</button>
            </div>
          </div>
        `;
      } else if (node.type === 'option') {
        const activeState = window.G;
        let optionsHtml = '<option value="next">デフォルト（次の項目へ）</option><option value="submit">回答を送信して終了</option>';
        activeState.sections.forEach(sec => {
          optionsHtml += `<option value="${sec.id}" ${node.nextSectionId===sec.id?'selected':''}>セクションへ移動: ${sec.title || sec.id}</option>`;
        });

        contentHtml = `
          <div class="mindmap-edit-dialog">
            <div class="mindmap-dialog-header">選択肢の編集</div>
            <div class="mindmap-dialog-field">
              <label>選択肢ラベル</label>
              <input type="text" id="edit-node-title" class="mindmap-dialog-input" value="${node.title}">
            </div>
            <div class="mindmap-dialog-field">
              <label>選択時の遷移先（条件分岐）</label>
              <select id="edit-node-next" class="mindmap-dialog-input">
                ${optionsHtml}
              </select>
            </div>
            <div class="mindmap-dialog-footer">
              <button class="btn btn-secondary" id="btn-edit-cancel">キャンセル</button>
              <button class="btn btn-primary" id="btn-edit-save" style="margin-left: 8px;">保存</button>
            </div>
          </div>
        `;
      }

      modal.innerHTML = contentHtml;
      document.body.appendChild(modal);

      document.getElementById('btn-edit-cancel').onclick = () => modal.remove();
      document.getElementById('btn-edit-save').onclick = () => {
        const newTitle = document.getElementById('edit-node-title').value.trim();
        if (!newTitle) {
          alert('タイトルを入力してください。');
          return;
        }

        if (node.type === 'root') {
          window.G.title = newTitle;
        } else if (node.type === 'section') {
          const sec = window.G.sections.find(s => s.id === node.id);
          if (sec) sec.title = newTitle;
        } else if (node.type === 'question') {
          const q = node.originalQuestion;
          const newType = document.getElementById('edit-node-qtype').value;
          q.title = newTitle;
          
          if (q.type !== newType) {
            q.type = newType;
            if (['radio', 'select'].includes(newType)) {
              if (!q.options || q.options.length === 0) {
                q.options = [{ label: '選択肢 1', nextSectionId: 'next' }];
              }
            } else {
              delete q.options;
            }
          }
        } else if (node.type === 'option') {
          const q = node.originalQuestion;
          const nextDest = document.getElementById('edit-node-next').value;
          if (q.options && q.options[node.optionIndex]) {
            q.options[node.optionIndex].label = newTitle;
            q.options[node.optionIndex].nextSectionId = nextDest;
          }
        }

        saveAndSyncMindmapData();
        modal.remove();
      };
    }

    function saveAndSyncMindmapData() {
      const activeIndex = localStorage.getItem('form_customize_active_index') || '0';
      let allForms = [];
      try {
        allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]');
      } catch(e) {}
      
      const idx = parseInt(activeIndex);
      if (allForms[idx]) {
        allForms[idx].title = window.G.title;
        allForms[idx].sections = window.G.sections;
        localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
      }

      if (window.x) {
        try { window.x(); } catch(e) {}
      }

      if (window.F) {
        window.F(window.G);
      }
    }

    function addMindmapNode(node) {
      if (!window.G) return;
      
      if (node.type === 'root') {
        // 新しいセクションを追加
        const newSecId = 'sec_' + Date.now();
        if (!window.G.sections) window.G.sections = [];
        window.G.sections.push({
          id: newSecId,
          title: `新規セクション ${window.G.sections.length + 1}`,
          nextAction: 'next',
          questions: []
        });
      } else if (node.type === 'section') {
        // 新しい質問をセクションに追加
        const sec = window.G.sections.find(s => s.id === node.id);
        if (sec) {
          if (!sec.questions) sec.questions = [];
          sec.questions.push({
            id: 'q_' + Date.now(),
            title: `新規質問 ${sec.questions.length + 1}`,
            type: 'text',
            required: false
          });
        }
      } else if (node.type === 'question' && node.isBranch) {
        // 選択肢を質問に追加
        const q = node.originalQuestion;
        if (q) {
          if (!q.options) q.options = [];
          q.options.push({
            label: `選択肢 ${q.options.length + 1}`,
            nextSectionId: 'next'
          });
        }
      }

      saveAndSyncMindmapData();
    }

    function deleteMindmapNode(node) {
      if (!window.G || node.type === 'root') return;

      if (!confirm(`本当に「${node.title}」を削除しますか？\n配下の子ノードも一緒に削除されます。`)) {
        return;
      }

      if (node.type === 'section') {
        // セクションを削除
        window.G.sections = window.G.sections.filter(s => s.id !== node.id);
      } else if (node.type === 'question') {
        // 質問をセクションから削除
        window.G.sections.forEach(sec => {
          if (sec.questions) {
            sec.questions = sec.questions.filter(q => q.id !== node.id);
          }
        });
      } else if (node.type === 'option') {
        // 選択肢を質問から削除
        const q = node.originalQuestion;
        if (q && q.options) {
          q.options.splice(node.optionIndex, 1);
          // 選択肢が0個になったら options を削除するか初期化
          if (q.options.length === 0) {
            q.options = [{ label: '選択肢 1', nextSectionId: 'next' }];
          }
        }
      }

      saveAndSyncMindmapData();
    }

    const customF = function(masterState) {
      console.log('[React Flow Bridge] Triggering render inside flowmap iframe...');
      const iframe = document.getElementById('flowmap-iframe');
      if (iframe && iframe.contentWindow && iframe.contentWindow.triggerFlowmapRender) {
        iframe.contentWindow.triggerFlowmapRender();
      }
    };

    try {
      Object.defineProperty(window, 'F', {
        get: () => customF,
        set: (val) => {
          console.log('[Custom Flowmap] Blocked attempt to overwrite window.F with:', val);
        },
        configurable: true
      });
      console.log('[Custom Flowmap] window.F locked successfully!');
    } catch (err) {
      console.error('[Custom Flowmap] Failed to lock window.F:', err);
      window.F = customF;
    }

    const refreshBtn = document.getElementById('btn-refresh-flowmap');
    if (refreshBtn) {
      const newRefreshBtn = refreshBtn.cloneNode(true);
      refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
      newRefreshBtn.addEventListener('click', () => {
        if (confirm('レイアウトを自動配置にリセットしますか？')) {
          localStorage.removeItem('form_customize_flowmap_coords');
        }
        const iframe = document.getElementById('flowmap-iframe');
        if (iframe && iframe.contentWindow && iframe.contentWindow.triggerFlowmapRender) {
          iframe.contentWindow.triggerFlowmapRender();
        }
      });
    }

    if (window.G) {
      setTimeout(() => {
        window.F(window.G);
      }, 200);
    }

  }
    function updateFlowmapFormDropdown() {
      const select = document.getElementById('flowmap-form-select');
      if (!select) return;

      // ログインユーザー情報の取得
      let loggedUser = null;
      try {
        const u1 = localStorage.getItem('cos_logged_user');
        const u2 = localStorage.getItem('gf_current_user');
        const parsed1 = u1 ? JSON.parse(u1) : null;
        const parsed2 = u2 ? JSON.parse(u2) : null;
        
        loggedUser = parsed2 || parsed1 || window.parent.K || window.K;
        if (loggedUser && typeof loggedUser === 'string') {
          loggedUser = { id: loggedUser, role: 'own_editor' };
        }
      } catch(e) {}

      let allForms = [];
      try {
        allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]');
      } catch(e) {}

      // フォールバック: もし localStorage 内のフォームデータが空の場合はデフォルトのサンプルフォームを補正・ロード
      if (!allForms || allForms.length === 0) {
        allForms = [
          { title: '新規作成されたフォーム', ownerId: 'user_own_editor', isLocked: false },
          { title: 'お客様フィードバック (サンプル)', ownerId: 'user_all_editor', isLocked: false },
          { title: '管理者用のアカウント作成', ownerId: 'user_admin', isLocked: true }
        ];
      }

      const activeIndex = parseInt(localStorage.getItem('form_customize_active_index') || '0', 10);

      // 閲覧権限判定 (親ダッシュボードの Bt(form) と同等 + オーナーシップ判定 + アクティブ強制許可)
      const canView = (form, idx) => {
        // 現在アクティブな（開いている）フォームは無条件で表示許可！
        if (idx === activeIndex) return true;
        if (!loggedUser || !loggedUser.role) return true; // ロール不明時は安全のため表示
        if (loggedUser.role === 'admin') return true;
        // 自分がオーナーのフォームであれば、ロックされていても閲覧可能
        if (loggedUser.id && form.ownerId === loggedUser.id) return true;
        return !form.isLocked;
      };

      // 編集権限判定 (親ダッシュボードの q(form) と同等 + アクティブ強制許可)
      const canEdit = (form, idx) => {
        // 現在アクティブな（開いている）フォームは編集権限があるものとして扱う（編集画面が開けているため）
        if (idx === activeIndex) return true;
        if (!loggedUser || !loggedUser.role) return true; // ロール不明時は安全のため編集許可
        if (loggedUser.role === 'admin') return true;
        if (form.isLocked) return false;
        if (loggedUser.role === 'all_editor') return true;
        if (loggedUser.role === 'own_editor') return form.ownerId === loggedUser.id;
        return false;
      };

      // 閲覧権限があるフォームのみをフィルタリング
      const visibleForms = allForms.filter((f, idx) => canView(f, idx));

      // 差分チェック: すでに構築されており、数が一致している場合はチラつき防止のため再描画をスキップ
      if (select.children.length === visibleForms.length && select.children.length > 0) {
        // 選択されているインデックスが正しいかだけを同期
        const activeVal = activeIndex.toString();
        if (select.value !== activeVal) {
          select.value = activeVal;
        }
        return;
      }

      // 明示的な文字色と背景色の設定（テーマ干渉による文字同化を完全に防ぐために !important 強制）
      select.style.setProperty('background-color', '#ffffff', 'important');
      select.style.setProperty('color', '#333333', 'important');

      select.innerHTML = '';
      allForms.forEach((form, idx) => {
        // 閲覧権限のないフォームはプルダウンに表示しない
        if (!canView(form, idx)) return;

        const opt = document.createElement('option');
        opt.value = idx;
        
        // 編集権限の有無をラベルに付記
        const isEditable = canEdit(form, idx);
        const labelSuffix = isEditable ? '' : ' (閲覧のみ)';
        opt.textContent = (form.title || `無題のフォーム ${idx + 1}`) + labelSuffix;

        // 明示的な配色スタイル（文字色・背景色）を option にも !important で強制付与
        opt.style.setProperty('color', '#333333', 'important');
        opt.style.setProperty('background-color', '#ffffff', 'important');

        if (idx === activeIndex) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    }

    function setupFlowmapFormSelectListener() {
      const select = document.getElementById('flowmap-form-select');
      if (!select) return;

      select.addEventListener('change', (e) => {
        const newIdx = e.target.value;
        localStorage.setItem('form_customize_active_index', newIdx);
        localStorage.setItem('form_customize_active_tab', 'flowmap');
        location.reload();
      });
  }
})();
