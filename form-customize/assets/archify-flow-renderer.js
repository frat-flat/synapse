/**
 * Archify Flow Renderer
 * フォームの分岐構造を美しいSVGダイアグラムとして描画し、
 * ルート道筋（Route Probe）のハイライト表示やリアルタイム同期を提供する軽量モジュール。
 */
(function(window) {
  'use strict';

  class ArchifyFlowRenderer {
    constructor(options = {}) {
      this.containerId = options.containerId || 'overview-flowmap-container';
      this.svgId = options.svgId || 'archify-flowmap-svg';
      this.viewportId = options.viewportId || 'archify-flowmap-viewport';
      
      this.state = null;
      this.graph = { nodes: [], edges: [], lanes: [] };
      this.selectedNodeId = null;
      this.highlightedRoute = { nodes: new Set(), edges: new Set() };
      
      // ビューポート変換（パン・ズーム）
      this.scale = 1.0;
      this.translateX = 40;
      this.translateY = 40;
      this.isPanning = false;
      this.panStartX = 0;
      this.panStartY = 0;

      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      
      const viewport = document.getElementById(this.viewportId);
      const svg = document.getElementById(this.svgId);
      if (!viewport || !svg) return;

      this.setupDefs(svg);
      this.bindEvents(viewport, svg);
      this.initialized = true;
    }

    setupDefs(svg) {
      // 矢印マーカーおよびエフェクトのSVG defs
      let defs = svg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);
      }
      defs.innerHTML = `
        <marker id="marker-arrow-default" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>
        <marker id="marker-arrow-section" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <marker id="marker-arrow-branch" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
        </marker>
        <marker id="marker-arrow-highlight" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
        </marker>
        <filter id="glow-highlight" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#10b981" flood-opacity="0.4" />
        </filter>
        <filter id="node-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.08" />
        </filter>
      `;
    }

    bindEvents(viewport, svg) {
      // パン（背景ドラッグ）
      viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('.archify-node-group') || e.target.closest('.archify-edge-group')) {
          return;
        }
        this.isPanning = true;
        this.panStartX = e.clientX - this.translateX;
        this.panStartY = e.clientY - this.translateY;
        viewport.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isPanning) return;
        this.translateX = e.clientX - this.panStartX;
        this.translateY = e.clientY - this.panStartY;
        this.applyTransform();
      });

      window.addEventListener('mouseup', () => {
        if (this.isPanning) {
          this.isPanning = false;
          viewport.style.cursor = 'grab';
        }
      });

      // ズーム（ホイールスクロール）
      viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const prevScale = this.scale;
        if (e.deltaY < 0) {
          this.scale = Math.min(this.scale * zoomFactor, 2.5);
        } else {
          this.scale = Math.max(this.scale / zoomFactor, 0.35);
        }

        // マウス位置を中心にズーム
        this.translateX = mouseX - (mouseX - this.translateX) * (this.scale / prevScale);
        this.translateY = mouseY - (mouseY - this.translateY) * (this.scale / prevScale);
        this.applyTransform();
      }, { passive: false });

      // 背景クリックでハイライト解除
      viewport.addEventListener('click', (e) => {
        if (e.target.closest('.archify-node-group') || e.target.closest('.archify-edge-group')) {
          return;
        }
        this.clearHighlight();
      });

      // コントロールボタン
      const btnFit = document.getElementById('btn-flow-fit');
      if (btnFit) btnFit.addEventListener('click', () => this.fitView());

      const btnZoomIn = document.getElementById('btn-flow-zoom-in');
      if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.zoom(1.2));

      const btnZoomOut = document.getElementById('btn-flow-zoom-out');
      if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.zoom(0.8));

      const btnReset = document.getElementById('btn-flow-reset-route');
      if (btnReset) btnReset.addEventListener('click', () => this.clearHighlight());
    }

    applyTransform() {
      const g = document.getElementById('archify-flow-main-group');
      if (g) {
        g.setAttribute('transform', `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`);
      }
    }

    zoom(multiplier) {
      const viewport = document.getElementById(this.viewportId);
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const prevScale = this.scale;
      this.scale = Math.min(Math.max(this.scale * multiplier, 0.35), 2.5);

      this.translateX = cx - (cx - this.translateX) * (this.scale / prevScale);
      this.translateY = cy - (cy - this.translateY) * (this.scale / prevScale);
      this.applyTransform();
    }

    fitView() {
      const viewport = document.getElementById(this.viewportId);
      if (!viewport || !this.graph.nodes.length) return;

      const rect = viewport.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // バウンディングボックス計算
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.graph.nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + n.width);
        maxY = Math.max(maxY, n.y + n.height);
      });
      this.graph.lanes.forEach(l => {
        minX = Math.min(minX, l.x);
        minY = Math.min(minY, l.y);
        maxX = Math.max(maxX, l.x + l.width);
        maxY = Math.max(maxY, l.y + l.height);
      });

      const padding = 50;
      const graphWidth = (maxX - minX) + padding * 2;
      const graphHeight = (maxY - minY) + padding * 2;

      const scaleX = rect.width / graphWidth;
      const scaleY = rect.height / graphHeight;
      this.scale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.4), 1.2);

      this.translateX = (rect.width - graphWidth * this.scale) / 2 - minX * this.scale + padding * this.scale;
      this.translateY = (rect.height - graphHeight * this.scale) / 2 - minY * this.scale + padding * this.scale;
      this.applyTransform();
    }

    // グラフ中間表現（IR）の構築
    buildGraph(state) {
      if (!state) return { nodes: [], edges: [], lanes: [] };

      const sections = state.sections || [];
      const nodes = [];
      const edges = [];
      const lanes = [];

      const colWidth = 260;
      const colGap = 90;
      const rowHeight = 76;
      const startX = 220;
      const startY = 80;

      const nodeWidth = 240;
      const nodeHeight = 58;

      const getSectionTargetId = (secId) => {
        const sec = sections.find(s => s.id === secId);
        if (sec && sec.questions && sec.questions.length > 0) {
          return sec.questions[0].id;
        }
        return 'submit';
      };

      // 1. 各セクションのノードとレーンを配置
      sections.forEach((sec, secIdx) => {
        const secX = startX + secIdx * (colWidth + colGap);
        let curY = startY + 44; // セクションヘッダー分の余白

        (sec.questions || []).forEach((q, qIdx) => {
          // 都道府県項目や、回答で行き先が変わらない通常の選択項目は、選択肢ノードを一切展開しない
          const isPrefectureQuestion = (q.title && q.title.includes('都道府県')) || q.dataKey === 'pref' || q.type === 'prefecture';
          
          let branchingOpts = [];
          if (!isPrefectureQuestion && Array.isArray(q.options) && q.options.length > 0) {
            // 有効なジャンプ先（nextや空文字以外）を持つ選択肢のみを抽出
            const validTargets = q.options.filter(opt => {
              if (!opt || !opt.nextSectionId) return false;
              const target = opt.nextSectionId.trim();
              return target !== '' && target !== 'next' && target !== 'same' && target !== sec.id;
            });

            // 全選択肢が同一の行き先を指している場合は分岐（分岐によって道が分かれること）ではないため除外
            const uniqueTargets = new Set(validTargets.map(opt => opt.nextSectionId.trim()));
            if (uniqueTargets.size >= 1 && validTargets.length <= 12) {
              // 選択肢によって行き先が分かれる場合、または特定の選択肢だけ別のセクションへジャンプする場合のみ採用
              branchingOpts = validTargets;
            }
          }

          const hasBranch = branchingOpts.length > 0;

          // 質問ノード
          nodes.push({
            id: q.id,
            type: 'question',
            title: q.title || `質問 ${qIdx + 1}`,
            subText: this.getQuestionTypeLabel(q.type),
            secId: sec.id,
            secIdx: secIdx,
            x: secX + 10,
            y: curY,
            width: nodeWidth,
            height: nodeHeight,
            hasBranch: hasBranch
          });

          // セクション内直列エッジ
          if (qIdx > 0) {
            const prevQ = sec.questions[qIdx - 1];
            edges.push({
              id: `edge-${prevQ.id}-${q.id}`,
              from: prevQ.id,
              to: q.id,
              type: 'sequence',
              dashed: false,
              color: '#94a3b8'
            });
          }

          curY += rowHeight;

          // 分岐選択肢ノード（回答によって真に行き先が変わる選択肢のみ表示）
          if (hasBranch) {
            branchingOpts.forEach((opt) => {
              const originalIdx = q.options.indexOf(opt);
              const optId = `${q.id}_opt_${opt.id || originalIdx}`;

              nodes.push({
                id: optId,
                type: 'option',
                title: opt.label || `選択肢 ${originalIdx + 1}`,
                subText: '➔ ' + this.getBranchTargetLabel(opt.nextSectionId, sections, sec.id),
                parentQId: q.id,
                secId: sec.id,
                secIdx: secIdx,
                x: secX + 30,
                y: curY,
                width: nodeWidth - 20,
                height: 44,
                targetId: opt.nextSectionId
              });

              // 質問から選択肢への縦エッジ
              edges.push({
                id: `edge-${q.id}-${optId}`,
                from: q.id,
                to: optId,
                type: 'option-link',
                dashed: true,
                color: '#cbd5e0'
              });

              curY += rowHeight - 16;
            });
          }
        });

        const laneHeight = Math.max(curY - startY + 16, 140);
        lanes.push({
          id: `lane_${sec.id}`,
          secId: sec.id,
          title: sec.title || `セクション ${secIdx + 1}`,
          index: secIdx + 1,
          x: secX,
          y: startY,
          width: colWidth,
          height: laneHeight
        });
      });

      // 2. 開始ノード（🏁 フォーム開始）
      nodes.push({
        id: 'root',
        type: 'root',
        title: state.title || 'フォーム開始',
        subText: 'Start',
        x: 40,
        y: startY + 44,
        width: 140,
        height: nodeHeight
      });

      if (sections.length > 0) {
        const firstTarget = getSectionTargetId(sections[0].id);
        edges.push({
          id: 'edge-root-first',
          from: 'root',
          to: firstTarget,
          type: 'start',
          dashed: false,
          color: '#3b82f6'
        });
      }

      // 3. 終了ノード（🏁 送信完了）
      const lastColX = startX + sections.length * (colWidth + colGap);
      nodes.push({
        id: 'submit',
        type: 'submit',
        title: '🏁 回答完了・送信',
        subText: 'ゴール',
        x: lastColX + 20,
        y: startY + 44,
        width: 160,
        height: nodeHeight
      });

      // 4. セクション間デフォルト遷移エッジ
      sections.forEach((sec, secIdx) => {
        if (!sec.questions || sec.questions.length === 0) return;
        const lastQ = sec.questions[sec.questions.length - 1];
        const branchingOpts = (lastQ.options || []).filter(opt => opt && opt.nextSectionId && opt.nextSectionId !== 'next');
        
        // 全選択肢に個別分岐がある場合はセクション末尾のデフォルト遷移を省略
        if (branchingOpts.length > 0 && branchingOpts.length === (lastQ.options || []).length) return;

        let act = sec.nextAction || 'next';
        let targetId = '';
        let label = '次のセクションへ';

        if (act === 'next') {
          const nextSec = sections[secIdx + 1];
          targetId = nextSec ? getSectionTargetId(nextSec.id) : 'submit';
        } else if (act === 'submit') {
          targetId = 'submit';
          label = '送信して完了';
        } else {
          targetId = getSectionTargetId(act);
          label = '指定先へ';
        }

        if (targetId) {
          edges.push({
            id: `edge-sec-next-${lastQ.id}`,
            from: lastQ.id,
            to: targetId,
            type: 'section-transition',
            label: label,
            dashed: true,
            color: '#3b82f6'
          });
        }
      });

      // 5. 分岐選択肢からの遷移エッジ（実体のあるoptionノードからのみ接続）
      const existingOptNodeIds = new Set(nodes.filter(n => n.type === 'option').map(n => n.id));
      sections.forEach(sec => {
        (sec.questions || []).forEach(q => {
          (q.options || []).forEach((opt, originalIdx) => {
            const optId = `${q.id}_opt_${opt.id || originalIdx}`;
            if (!existingOptNodeIds.has(optId)) return;

            let targetId = opt.nextSectionId;
            let label = `「${opt.label}」選択時`;

            if (targetId === 'submit') {
              targetId = 'submit';
            } else if (targetId && targetId !== 'next' && targetId !== 'same') {
              targetId = getSectionTargetId(targetId);
            } else {
              targetId = null;
            }

            if (targetId) {
              edges.push({
                id: `edge-branch-${optId}`,
                from: optId,
                to: targetId,
                type: 'branch',
                label: label,
                dashed: true,
                color: '#f97316'
              });
            }
          });
        });
      });

      return { nodes, edges, lanes };
    }

    getQuestionTypeLabel(type) {
      const map = {
        text: 'テキスト入力',
        paragraph: '長文テキスト',
        radio: '単一選択 (ラジオ)',
        checkbox: '複数選択 (チェック)',
        select: 'ドロップダウン',
        date: '日付選択',
        postal: '郵便番号 (自動補完)',
        address: '住所'
      };
      return map[type] || '質問';
    }

    getBranchTargetLabel(act, sections, currentSecId) {
      if (!act || act === 'next') return '次の項目';
      if (act === 'submit') return '🏁 送信完了';
      const targetSec = sections.find(s => s.id === act);
      return targetSec ? `セクション「${targetSec.title || '無題'}」` : '指定セクション';
    }

    // 描画実行
    render(state) {
      this.init();
      if (!state) return;
      this.state = state;
      this.graph = this.buildGraph(state);

      const svg = document.getElementById(this.svgId);
      if (!svg) return;

      // 既存グループをクリア
      let g = document.getElementById('archify-flow-main-group');
      if (!g) {
        g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = 'archify-flow-main-group';
        svg.appendChild(g);
      }
      g.innerHTML = '';

      // 1. レーン（セクション背景）の描画
      const lanesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      lanesGroup.className.baseVal = 'archify-lanes-layer';
      this.graph.lanes.forEach(lane => {
        lanesGroup.appendChild(this.createLaneElement(lane));
      });
      g.appendChild(lanesGroup);

      // 2. エッジ（接続線）の描画
      const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      edgesGroup.className.baseVal = 'archify-edges-layer';
      this.graph.edges.forEach(edge => {
        const edgeEl = this.createEdgeElement(edge);
        if (edgeEl) edgesGroup.appendChild(edgeEl);
      });
      g.appendChild(edgesGroup);

      // 3. ノード（質問・選択肢カード）の描画
      const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodesGroup.className.baseVal = 'archify-nodes-layer';
      this.graph.nodes.forEach(node => {
        nodesGroup.appendChild(this.createNodeElement(node));
      });
      g.appendChild(nodesGroup);

      this.applyTransform();

      // 初回ならフィット
      if (this.translateX === 40 && this.translateY === 40) {
        setTimeout(() => this.fitView(), 60);
      } else {
        // 再描画時に選択ノードのルートを再適用
        if (this.selectedNodeId) {
          this.highlightRouteForNode(this.selectedNodeId);
        }
      }
    }

    createLaneElement(lane) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.className.baseVal = 'archify-lane-group';
      g.dataset.secId = lane.secId;

      // 背景枠
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', lane.x);
      rect.setAttribute('y', lane.y);
      rect.setAttribute('width', lane.width);
      rect.setAttribute('height', lane.height);
      rect.setAttribute('rx', '10');
      rect.setAttribute('fill', '#f8fafc');
      rect.setAttribute('stroke', '#e2e8f0');
      rect.setAttribute('stroke-width', '1.5');
      rect.setAttribute('stroke-dasharray', '4 4');
      g.appendChild(rect);

      // ヘッダーテキスト
      const headerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      headerText.setAttribute('class', 'archify-lane-title');
      headerText.setAttribute('x', lane.x + 12);
      headerText.setAttribute('y', lane.y + 22);
      headerText.setAttribute('fill', '#64748b');
      headerText.setAttribute('font-size', '11');
      headerText.setAttribute('font-weight', '700');
      headerText.setAttribute('letter-spacing', '0.05em');
      headerText.textContent = `SECTION ${lane.index} : ${lane.title}`;
      g.appendChild(headerText);

      return g;
    }

    createNodeElement(node) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.className.baseVal = `archify-node-group node-type-${node.type}`;
      g.id = `archify-node-${node.id}`;
      g.dataset.nodeId = node.id;
      g.style.cursor = 'pointer';

      // カラー設定
      let borderColor = '#cbd5e0';
      let borderLeftColor = '#3b82f6';
      let bgColor = '#ffffff';

      if (node.type === 'question') {
        borderLeftColor = node.hasBranch ? '#f59e0b' : '#10b981';
      } else if (node.type === 'option') {
        borderLeftColor = '#f97316';
        bgColor = '#fffaf0';
      } else if (node.type === 'root') {
        borderLeftColor = '#3b82f6';
      } else if (node.type === 'submit') {
        borderLeftColor = '#ef4444';
        bgColor = '#fef2f2';
      }

      // 背景カード
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', node.x);
      rect.setAttribute('y', node.y);
      rect.setAttribute('width', node.width);
      rect.setAttribute('height', node.height);
      rect.setAttribute('rx', '6');
      rect.setAttribute('fill', bgColor);
      rect.setAttribute('stroke', borderColor);
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('filter', 'url(#node-shadow)');
      g.appendChild(rect);

      // 左端のアクセントバー
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', node.x);
      bar.setAttribute('y', node.y);
      bar.setAttribute('width', '5');
      bar.setAttribute('height', node.height);
      bar.setAttribute('rx', '2');
      bar.setAttribute('fill', borderLeftColor);
      g.appendChild(bar);

      // タイトル（質問名 / 選択肢名）
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('class', 'archify-node-title');
      title.setAttribute('x', node.x + 14);
      title.setAttribute('y', node.y + (node.subText ? 22 : node.height / 2 + 5));
      title.setAttribute('fill', '#1e293b');
      title.setAttribute('font-size', '12');
      title.setAttribute('font-weight', '600');
      title.textContent = this.truncateText(node.title, node.width > 200 ? 18 : 13);
      g.appendChild(title);

      // サブテキスト（質問タイプ / 分岐先）
      if (node.subText) {
        const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        sub.setAttribute('class', 'archify-node-subtext');
        sub.setAttribute('x', node.x + 14);
        sub.setAttribute('y', node.y + 40);
        sub.setAttribute('fill', node.type === 'option' ? '#ea580c' : '#64748b');
        sub.setAttribute('font-size', '10');
        sub.setAttribute('font-weight', node.type === 'option' ? '600' : '400');
        sub.textContent = this.truncateText(node.subText, 22);
        g.appendChild(sub);
      }

      // クリックで道筋（Route Probe）ハイライト
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        this.highlightRouteForNode(node.id);
      });

      return g;
    }

    createEdgeElement(edge) {
      const fromNode = this.graph.nodes.find(n => n.id === edge.from);
      const toNode = this.graph.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.className.baseVal = `archify-edge-group edge-type-${edge.type}`;
      g.id = `archify-${edge.id}`;
      g.dataset.edgeId = edge.id;
      g.dataset.from = edge.from;
      g.dataset.to = edge.to;

      // 始点と終点の計算
      let x1, y1, x2, y2;
      let pathD = '';

      if (edge.type === 'sequence') {
        // 同一セクション内の縦接続
        x1 = fromNode.x + fromNode.width / 2;
        y1 = fromNode.y + fromNode.height;
        x2 = toNode.x + toNode.width / 2;
        y2 = toNode.y;
        pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else if (edge.type === 'option-link') {
        // 質問から選択肢への縦分岐
        x1 = fromNode.x + 20;
        y1 = fromNode.y + fromNode.height;
        x2 = toNode.x;
        y2 = toNode.y + toNode.height / 2;
        pathD = `M ${x1} ${y1} V ${y2} H ${x2}`;
      } else {
        // セクション間遷移または分岐（右から左へのスムーズベジェ）
        x1 = fromNode.x + fromNode.width;
        y1 = fromNode.y + fromNode.height / 2;
        x2 = toNode.x;
        y2 = toNode.y + toNode.height / 2;

        const deltaX = Math.max(Math.abs(x2 - x1) * 0.45, 40);
        pathD = `M ${x1} ${y1} C ${x1 + deltaX} ${y1}, ${x2 - deltaX} ${y2}, ${x2} ${y2}`;
      }

      // パス本体
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', edge.color || '#94a3b8');
      path.setAttribute('stroke-width', edge.type === 'branch' ? '2' : '1.5');
      if (edge.dashed) {
        path.setAttribute('stroke-dasharray', '5 4');
      }

      // マーカー
      let markerId = 'marker-arrow-default';
      if (edge.type === 'branch') markerId = 'marker-arrow-branch';
      else if (edge.type === 'section-transition' || edge.type === 'start') markerId = 'marker-arrow-section';
      path.setAttribute('marker-end', `url(#${markerId})`);

      g.appendChild(path);

      // ラベル（分岐条件など）
      if (edge.label) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 6;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY);
        text.setAttribute('fill', edge.type === 'branch' ? '#ea580c' : '#2563eb');
        text.setAttribute('font-size', '9');
        text.setAttribute('font-weight', '600');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = edge.label;
        g.appendChild(text);
      }

      // クリックでエッジ関連ノードをハイライト
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        this.highlightRouteForNode(edge.from);
      });

      return g;
    }

    truncateText(str, max) {
      if (!str) return '';
      return str.length > max ? str.substring(0, max) + '…' : str;
    }

    // ルート道筋（Route Probe）ハイライト
    highlightRouteForNode(nodeId) {
      this.selectedNodeId = nodeId;
      const reachableDownstream = new Set([nodeId]);
      const reachableUpstream = new Set([nodeId]);
      const activeEdges = new Set();

      // 1. 下流（Downstream: どこへ行くか）探索 (BFS)
      const queueDown = [nodeId];
      while (queueDown.length > 0) {
        const curr = queueDown.shift();
        this.graph.edges.forEach(edge => {
          if (edge.from === curr) {
            activeEdges.add(edge.id);
            if (!reachableDownstream.has(edge.to)) {
              reachableDownstream.add(edge.to);
              queueDown.push(edge.to);
            }
          }
        });
      }

      // 2. 上流（Upstream: どこから来たか）探索 (BFS)
      const queueUp = [nodeId];
      while (queueUp.length > 0) {
        const curr = queueUp.shift();
        this.graph.edges.forEach(edge => {
          if (edge.to === curr) {
            activeEdges.add(edge.id);
            if (!reachableUpstream.has(edge.from)) {
              reachableUpstream.add(edge.from);
              queueUp.push(edge.from);
            }
          }
        });
      }

      const allActiveNodes = new Set([...reachableDownstream, ...reachableUpstream]);
      this.highlightedRoute = { nodes: allActiveNodes, edges: activeEdges };

      // DOMクラスの更新
      const svg = document.getElementById(this.svgId);
      if (!svg) return;

      // ノードのハイライト／ディミング
      this.graph.nodes.forEach(node => {
        const el = document.getElementById(`archify-node-${node.id}`);
        if (!el) return;

        if (allActiveNodes.has(node.id)) {
          el.classList.add('is-active-route');
          el.classList.remove('is-dimmed');
          if (node.id === nodeId) {
            el.classList.add('is-focused-node');
          } else {
            el.classList.remove('is-focused-node');
          }
        } else {
          el.classList.remove('is-active-route', 'is-focused-node');
          el.classList.add('is-dimmed');
        }
      });

      // エッジのハイライト／ディミング
      this.graph.edges.forEach(edge => {
        const el = document.getElementById(`archify-${edge.id}`);
        if (!el) return;

        const path = el.querySelector('path');
        if (activeEdges.has(edge.id)) {
          el.classList.add('is-active-route');
          el.classList.remove('is-dimmed');
          if (path) {
            path.setAttribute('stroke', '#10b981');
            path.setAttribute('stroke-width', '2.8');
            path.setAttribute('marker-end', 'url(#marker-arrow-highlight)');
          }
        } else {
          el.classList.remove('is-active-route');
          el.classList.add('is-dimmed');
          if (path) {
            path.setAttribute('stroke', edge.color || '#94a3b8');
            path.setAttribute('stroke-width', edge.type === 'branch' ? '2' : '1.5');
            let m = 'marker-arrow-default';
            if (edge.type === 'branch') m = 'marker-arrow-branch';
            else if (edge.type === 'section-transition' || edge.type === 'start') m = 'marker-arrow-section';
            path.setAttribute('marker-end', `url(#${m})`);
          }
        }
      });
    }

    // ハイライト全解除
    clearHighlight() {
      this.selectedNodeId = null;
      this.highlightedRoute = { nodes: new Set(), edges: new Set() };

      const svg = document.getElementById(this.svgId);
      if (!svg) return;

      svg.querySelectorAll('.is-active-route, .is-focused-node, .is-dimmed').forEach(el => {
        el.classList.remove('is-active-route', 'is-focused-node', 'is-dimmed');
      });

      // エッジのスタイルを元に戻す
      this.graph.edges.forEach(edge => {
        const el = document.getElementById(`archify-${edge.id}`);
        if (!el) return;
        const path = el.querySelector('path');
        if (path) {
          path.setAttribute('stroke', edge.color || '#94a3b8');
          path.setAttribute('stroke-width', edge.type === 'branch' ? '2' : '1.5');
          let m = 'marker-arrow-default';
          if (edge.type === 'branch') m = 'marker-arrow-branch';
          else if (edge.type === 'section-transition' || edge.type === 'start') m = 'marker-arrow-section';
          path.setAttribute('marker-end', `url(#${m})`);
        }
      });
    }
  }

  window.ArchifyFlowRenderer = ArchifyFlowRenderer;
  window.archifyRenderer = new ArchifyFlowRenderer();

})(window);
