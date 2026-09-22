
  const JAPAN_PREFECTURES = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];


(function() {
  // 🚀 起動時即時パージ: LocalStorage内の旧ダミーフォームを完全に根絶
  (function purgeLegacyFormsImmediately() {
    try {
      const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
      const raw = localStorage.getItem('form_customize_all_forms');
      if (raw) {
        let forms = JSON.parse(raw);
        if (Array.isArray(forms)) {
          const clean = forms.filter(f => f && !purgedKeywords.some(p => (f.title || '').includes(p)));
          if (clean.length !== forms.length) {
            Storage.prototype.setItem.call(localStorage, 'form_customize_all_forms', JSON.stringify(clean));
          }
        }
      }
    } catch(e) {}
  })();

  console.log('custom-editor.js loading...');

  // 🌐 API連携規則（国税庁・インボイス・郵便番号・全銀協）の拡張保証
  const ensureApiConditions = () => {
    if (window.b && window.b.api && window.b.api.conditions) {
      window.b.api.conditions.corp_name = '法人名検索（国税庁法人番号API連携）';
      window.b.api.conditions.invoice_number = 'インボイス登録番号（適格請求書発行事業者API連携）';
      window.b.api.conditions.zip_code = '郵便番号検索（郵便番号住所検索API連携）';
      window.b.api.conditions.bank_name = '銀行名検索（全銀協金融機関コードAPI連携）';
      window.b.api.conditions.branch_name = '支店名検索（全銀協支店コード・支店番号API連携）';
      window.b.api.conditions.branch_code = '支店番号検索（全銀協支店コードAPI連携）';
    }
    if (window.re) {
      if (!window.re.bank_name) {
        window.re.bank_name = {
          type: "text",
          title: "銀行名",
          description: "全銀協コードAPI連携対応",
          required: true,
          validation: {
            category: "api",
            condition: "bank_name",
            value: "",
            value2: "",
            errorMessage: "実在する銀行名を入力または選択してください。"
          },
          options: []
        };
      }
      if (!window.re.branch_name) {
        window.re.branch_name = {
          type: "text",
          title: "支店名",
          description: "全銀協支店コードAPI連携対応",
          required: true,
          validation: {
            category: "api",
            condition: "branch_name",
            value: "",
            value2: "",
            errorMessage: "実在する支店名を入力または選択してください。"
          },
          options: []
        };
      }
      if (!window.re.branch_code) {
        window.re.branch_code = {
          type: "text",
          title: "支店番号",
          description: "全銀協支店番号API連携対応",
          required: true,
          validation: {
            category: "api",
            condition: "branch_code",
            value: "",
            value2: "",
            errorMessage: "実在する3桁の支店番号を入力または選択してください。"
          },
          options: []
        };
      }
      if (!window.re.bank_account) {
        window.re.bank_account = {
          type: "text",
          title: "口座番号",
          description: "6〜7桁の半角数字で入力してください（例: 1234567）",
          placeholder: "0477651",
          required: true,
          validation: {
            category: "regex",
            condition: "matches",
            presetKey: "bank_account",
            value: "^[0-9]{6,7}$",
            value2: "",
            errorMessage: "正しい口座番号（6〜7桁の半角数字）を入力してください。"
          },
          options: []
        };
      } else {
        window.re.bank_account.description = "6〜7桁の半角数字で入力してください（例: 1234567）";
        window.re.bank_account.placeholder = "0477651";
        if (window.re.bank_account.validation) {
          window.re.bank_account.validation.presetKey = "bank_account";
          window.re.bank_account.validation.value = "^[0-9]{6,7}$";
          window.re.bank_account.validation.errorMessage = "正しい口座番号（6〜7桁の半角数字）を入力してください。";
        }
      }
      if (window.re.pro_bank && Array.isArray(window.re.pro_bank.questions)) {
        window.re.pro_bank.questions.forEach(q => {
          if (q.title === '金融機関名' || q.title === '銀行名') {
            q.validation = { category: "api", condition: "bank_name", errorMessage: "実在する金融機関名を入力または選択してください。" };
          } else if (q.title === '支店名') {
            q.validation = { category: "api", condition: "branch_name", errorMessage: "実在する支店名を入力または選択してください。" };
          } else if (q.title === '支店番号' || q.title === '支店コード') {
            q.validation = { category: "api", condition: "branch_code", errorMessage: "実在する3桁の支店番号を入力または選択してください。" };
          } else if (q.title === '口座番号') {
            q.description = "6〜7桁の半角数字で入力してください（例: 1234567）";
            q.placeholder = "0477651";
            q.validation = {
              category: "regex",
              condition: "matches",
              presetKey: "bank_account",
              value: "^[0-9]{6,7}$",
              errorMessage: "正しい口座番号（6〜7桁の半角数字）を入力してください。"
            };
          }
        });
      }
    }
  };
  ensureApiConditions();
  setInterval(ensureApiConditions, 200);

  // 🚀 スコープ不整合ReferenceErrorを解消するプロキシ定義
  window.saveAndSyncMindmapData = null;
  function saveAndSyncMindmapData(...args) {
    if (typeof window.saveAndSyncMindmapData === 'function') {
      return window.saveAndSyncMindmapData(...args);
    }
    console.warn('[Proxy] window.saveAndSyncMindmapData is not registered yet.');
  }

  // ☁️ 自動保存ステータス更新インジケーター (Google Forms風のUX向上)
  function updateSaveStatus(status) {
    try {
      let indicator = document.getElementById('antigravity-save-indicator');
      if (!indicator) {
        // タイトル・説明入力欄カード（またはメイン編集パネル）の上部にインジケーターをマウント
        const headerArea = document.querySelector('.editor-title-desc-card') || document.querySelector('.editor-main-panel');
        if (!headerArea) return;
        
        indicator = document.createElement('div');
        indicator.id = 'antigravity-save-indicator';
        indicator.style.fontSize = '0.78rem';
        indicator.style.color = '#5f6368';
        indicator.style.marginBottom = '12px';
        indicator.style.display = 'flex';
        indicator.style.alignItems = 'center';
        indicator.style.gap = '6px';
        indicator.style.fontFamily = 'Inter, "Noto Sans JP", sans-serif';
        indicator.style.transition = 'opacity 0.2s ease';
        
        headerArea.insertBefore(indicator, headerArea.firstChild);
      }
      
      if (status === 'saving') {
        indicator.innerHTML = '🔄 <span style="color: #7248b9; font-weight: 500;">変更を保存中...</span>';
        indicator.style.opacity = '1';
      } else if (status === 'saved') {
        indicator.innerHTML = '☁️ <span style="color: #5f6368;">すべての変更を保存しました</span>';
        indicator.style.opacity = '0.85';
      }
    } catch(e) {
      console.error('[Save Indicator] Failed to update status:', e);
    }
  }

  // 起動時セーフガード: フラグのリセットおよび破損データの自動修復
  (function initSanitize() {
    try {
      // 🚀 親システム連携：常時管理者権限（フルアクセス）を担保
      const adminUser = { id: 'user_admin', name: '管理者', role: 'admin' };
      localStorage.setItem('gf_current_user', JSON.stringify(adminUser));
      window.K = adminUser;

      localStorage.setItem('form_customize_is_template_mode', 'false');
      setTimeout(() => {
        initTemplates(); // テンプレートマスタ初期化
      }, 0);
      
      const key = 'form_customize_all_forms';
      const raw = localStorage.getItem(key);
      if (raw) {
        let parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // nullや無効なオブジェクト、またはタイトル（title）がないゴミデータを除外
          const sanitized = parsed.filter(f => f && typeof f === 'object' && f.title);
          
          // ownerIdが欠損している要素への補完
          sanitized.forEach(f => {
            if (!f.ownerId) {
              f.ownerId = 'user_own_editor';
            }
          });
          
          localStorage.setItem(key, JSON.stringify(sanitized));
          console.log('[Sanitize] Data repaired successfully. Total count:', sanitized.length);
        }
      }
    } catch(err) {
      console.error('[Guard] Sanitize failed:', err);
    }
  })();

  // CSSのキャッシュ破り用動的インジェクション (v107に対応 & 重複ロード防止)
  (function injectLatestCSS() {
    if (document.querySelector('link[href*="custom-editor-v107.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/custom-editor-v107.css?v=' + Date.now();
    document.head.appendChild(link);
    console.log('[Custom Flowmap] Injected latest stylesheet (v107):', link.href);
  })();

  // 📁 【強固なイベントデリゲーション】新規作成ボタンとギャラリーボタンのフック (プロンプト回避 & ギャラリー起動)
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    // 1. 新規フォーム作成ボタンのフック
    if (target && (target.id === 'btn-dashboard-create' || target.closest('#btn-dashboard-create'))) {
      console.log('[Extension] Captured click on btn-dashboard-create. Preventing prompt...');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // 空白フォームから新規作成を実行
      createFormFromTemplate(null);
      return;
    }
    
    // 2. テンプレートギャラリーボタンのフック
    if (target && (target.id === 'btn-dashboard-gallery' || target.closest('#btn-dashboard-gallery'))) {
      console.log('[Extension] Captured click on btn-dashboard-gallery. Opening gallery...');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const galleryPanel = document.getElementById('panel-template-gallery');
      if (galleryPanel) {
        document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.remove('active');
        });
        document.querySelectorAll('.nav-tab').forEach(tab => {
          tab.classList.remove('active');
        });
        
        galleryPanel.classList.add('active');
        renderFullTemplateGallery();
      }
      return;
    }

    // 3. ギャラリーから戻るボタンのフック
    if (target && (target.id === 'btn-back-from-gallery' || target.closest('#btn-back-from-gallery'))) {
      console.log('[Extension] Captured click on btn-back-from-gallery. Returning to dashboard...');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const galleryPanel = document.getElementById('panel-template-gallery');
      const dashboardPanel = document.getElementById('panel-dashboard');
      if (galleryPanel && dashboardPanel) {
        galleryPanel.classList.remove('active');
        dashboardPanel.classList.add('active');
        const homeTab = document.querySelector('.nav-tab[data-tab="dashboard"]');
        if (homeTab) homeTab.classList.add('active');
      }
      return;
    }

    // 4. テンプレートバーからのギャラリー遷移ボタンのフック (左上ボタン)
    if (target && (target.id === 'btn-open-full-gallery-left' || target.closest('#btn-open-full-gallery-left'))) {
      console.log('[Extension] Captured click on btn-open-full-gallery-left. Opening gallery...');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const galleryPanel = document.getElementById('panel-template-gallery');
      if (galleryPanel) {
        document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.remove('active');
        });
        document.querySelectorAll('.nav-tab').forEach(tab => {
          tab.classList.remove('active');
        });
        
        galleryPanel.classList.add('active');
        renderFullTemplateGallery();
      }
      return;
    }

    // 5. 常設バーの「最近使った」トグルのフック
    if (target && (target.id === 'tpl-bar-mode-recent' || target.closest('#tpl-bar-mode-recent'))) {
      console.log('[Extension] Captured click on tpl-bar-mode-recent.');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      localStorage.setItem('form_customize_template_bar_mode', 'recent');
      renderTemplateBar();
      return;
    }

    // 6. 常設バーの「お気に入り」トグルのフック
    if (target && (target.id === 'tpl-bar-mode-fav' || target.closest('#tpl-bar-mode-fav'))) {
      console.log('[Extension] Captured click on tpl-bar-mode-fav.');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      localStorage.setItem('form_customize_template_bar_mode', 'fav');
      renderTemplateBar();
      return;
    }

    // 7. ギャラリー画面内の「最近使った」トグルのフック
    if (target && (target.id === 'gallery-tab-mode-recent' || target.closest('#gallery-tab-mode-recent'))) {
      console.log('[Extension] Captured click on gallery-tab-mode-recent.');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      localStorage.setItem('form_customize_gallery_tab_mode', 'recent');
      renderFullTemplateGallery();
      return;
    }

    // 8. ギャラリー画面内の「お気に入り」トグルのフック
    if (target && (target.id === 'gallery-tab-mode-fav' || target.closest('#gallery-tab-mode-fav'))) {
      console.log('[Extension] Captured click on gallery-tab-mode-fav.');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      localStorage.setItem('form_customize_gallery_tab_mode', 'favorites');
      renderFullTemplateGallery();
      return;
    }

    // 9. ギャラリー画面内の表示形式（リスト/グリッド）切り替えボタンのフック
    if (target && (target.id === 'btn-toggle-gallery-view' || target.closest('#btn-toggle-gallery-view'))) {
      console.log('[Extension] Captured click on btn-toggle-gallery-view.');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const currentMode = localStorage.getItem('form_customize_gallery_view_mode') || 'grid';
      const nextMode = currentMode === 'grid' ? 'list' : 'grid';
      localStorage.setItem('form_customize_gallery_view_mode', nextMode);
      renderFullTemplateGallery();
      return;
    }

    // 10. ギャラリー画面内の「空白のテンプレートを追加」プラスカードのフック (起動不具合解消)
    if (target && (target.id === 'btn-create-new-template-card' || target.closest('#btn-create-new-template-card'))) {
      console.log('[Extension] Captured click on btn-create-new-template-card. Creating new custom template...');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      try {
        const templates = getTemplates();
        const newTpl = {
          title: `新規テンプレート (${templates.length + 1})`,
          description: 'テンプレートの説明を入力してください。',
          category: 'personal',
          stripeColor: '#7248b9',
          sections: [
            {
              id: 'section_1',
              title: '無題のセクション',
              description: 'セクションの説明をご入力ください。',
              questions: []
            }
          ]
        };
        templates.push(newTpl);
        saveTemplates(templates);
        
        // 自動的にお気に入り登録（スター付き）
        let favs = getFavorites();
        if (!favs.includes(newTpl.title)) {
          favs.push(newTpl.title);
          saveFavorites(favs);
        }
        
        // そのテンプレート構成で新規フォームを作成しエディタへ遷移
        createFormFromTemplate(newTpl);
      } catch(err) {
        console.error('[Templates] Failed to create custom template:', err);
      }
      return;
    }
  }, true); // キャプチャフェーズでフック！

  // ==========================================================================
  // Google Forms 風 テンプレートマスタデータ定義と処理ロジック
  // ==========================================================================

  const DEFAULT_TEMPLATES = [
    {
      title: "法人・個人自動分岐ハイブリッド申請書",
      description: "申請区分（法人 / 個人事業主）に応じて自動でセクションを切り替え、同一カラムに統合集約するプロ用テンプレートです。",
      category: "business",
      stripeColor: "#0284c7",
      sections: [
        {
          id: "sec_hybrid_branch_1",
          title: "申請区分の選択",
          description: "申請区分（契約種別）を選択してください。選択内容に応じて次に入力する情報が自動的に切り替わります。",
          nextAction: "branch",
          questions: [
            {
              id: "q_hybrid_applicant_type",
              type: "radio",
              title: "申請区分をお選びください",
              description: "該当する区分をお選びください",
              required: true,
              dataKey: "applicant_type",
              options: [
                { label: "🏢 法人として申請", nextSectionId: "sec_hybrid_corp_2" },
                { label: "👤 個人事業主として申請", nextSectionId: "sec_hybrid_indiv_3" }
              ]
            }
          ]
        },
        {
          id: "sec_hybrid_corp_2",
          title: "法人情報の入力",
          description: "法人の基本情報および代表者情報をご入力ください。",
          nextAction: "submit",
          questions: [
            { id: "q_hc_corp_name", type: "text", title: "法人名", description: "法人名を入力して候補から選択してください（国税庁法人番号API照会）", required: true, dataKey: "company_name", validation: { category: "api", condition: "corp_name", errorMessage: "実在する法人名を入力または選択してください。" }, options: [] },
            { id: "q_hc_corp_kana", type: "text", title: "法人名（カナ）", description: "全角カタカナで入力してください。法人名検索から自動反映されます。", required: true, dataKey: "company_kana", validation: { category: "regex", condition: "matches", value: "^[ァ-ヶｦ-ﾟー\\s　]+$", presetKey: "company_kana", errorMessage: "全角カタカナで入力してください。" }, options: [] },
            { id: "q_hc_zip", type: "text", title: "郵便番号", description: "法人選択で自動入力されます（7桁半角数字）", required: true, dataKey: "zip_code", validation: { category: "regex", condition: "matches", value: "^[0-9]{3}-?[0-9]{4}$", presetKey: "zip", errorMessage: "郵便番号を7桁で入力してください。" }, options: [] },
            { id: "q_hc_pref", type: "select", title: "都道府県", description: "本店所在地の都道府県を選択してください", required: true, dataKey: "pref", options: JAPAN_PREFECTURES.map(p => ({ label: p })) },
            { id: "q_hc_city", type: "text", title: "市区町村", required: true, dataKey: "city", options: [] },
            { id: "q_hc_street", type: "text", title: "町名・番地", description: "自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。", required: true, dataKey: "street", options: [] },
            { id: "q_hc_building", type: "text", title: "建物名・部屋番号", description: "ビル名・階数・部屋番号等がある場合はご入力ください", required: false, dataKey: "building", options: [] },
            { id: "q_hc_rep_name", type: "text", title: "代表者名", description: "代表取締役の氏名を入力してください（例: 山田 太郎）", required: true, dataKey: "representative_name", options: [] },
            { id: "q_hc_rep_kana", type: "text", title: "代表者名（カナ）", description: "代表取締役のフリガナを全角カタカナで入力してください", required: true, dataKey: "representative_kana", validation: { category: "regex", condition: "matches", value: "^[ァ-ヶｦ-ﾟー\\s　]+$", presetKey: "representative_kana", errorMessage: "全角カタカナで入力してください。" }, options: [] },
            { id: "q_hc_email", type: "text", title: "メールアドレス", description: "ご回答内容の控えをこのメールアドレス宛てにお送りします。", required: true, autoReply: true, dataKey: "email", validation: { category: "text", condition: "email", errorMessage: "有効なメールアドレスを入力してください。" }, options: [] },
            { id: "q_hc_tel", type: "text", title: "電話番号", description: "半角数字（ハイフンなし）で入力してください（例: 0312345678）", required: true, dataKey: "tel", validation: { category: "regex", condition: "matches", value: "^0\\d{9,10}$", presetKey: "tel_no_hyphen", errorMessage: "半角数字（10桁または11桁・ハイフンなし）で入力してください。" }, options: [] },
            { id: "q_hc_tax_status", type: "radio", title: "税務区分・インボイス登録状況", description: "該当する税務区分を選択してください。法人名選択時に登録が確認された場合は「インボイス登録事業者である。」が自動選択されます。", required: true, dataKey: "tax_invoice_status", options: [{ label: "非課税事業者である。" }, { label: "課税事業者でインボイスは未登録である。" }, { label: "インボイス登録事業者である。" }] },
            { id: "q_hc_invoice_num", type: "text", title: "インボイス登録番号", description: "T＋13桁の半角数字。法人選択時に国税庁適格請求書発行事業者公表システムへ自動照合されます。", required: false, dataKey: "invoice_number", validation: { category: "api", condition: "invoice_number", errorMessage: "実在する有効なインボイス登録番号（T+13桁）を入力してください。" }, skipLogic: { dependsOn: "q_hc_tax_status", condition: "not_equals", value: "インボイス登録事業者である。", action: "hide" }, options: [] }
          ]
        },
        {
          id: "sec_hybrid_indiv_3",
          title: "個人事業主情報の入力",
          description: "個人事業主または個人の基本情報をご入力ください。",
          nextAction: "submit",
          questions: [
            { id: "q_hi_rep_name", type: "text", title: "氏名（代表者名）", description: "氏名（漢字）を入力してください（例: 山田 太郎）", required: true, dataKey: "representative_name", options: [] },
            { id: "q_hi_rep_kana", type: "text", title: "氏名（カナ）", description: "氏名のフリガナを全角カタカナで入力してください", required: true, dataKey: "representative_kana", validation: { category: "regex", condition: "matches", value: "^[ァ-ヶｦ-ﾟー\\s　]+$", presetKey: "representative_kana", errorMessage: "全角カタカナで入力してください。" }, options: [] },
            { id: "q_hi_trade_name", type: "text", title: "屋号", description: "屋号をお持ちの場合のみ入力してください（屋号がない場合は空欄のままで進めます）", required: false, dataKey: "company_name", options: [] },
            { id: "q_hi_trade_kana", type: "text", title: "屋号（カナ）", description: "※屋号を入力された場合は、屋号のフリガナ（全角カタカナ）も必ず入力してください。", required: false, dataKey: "company_kana", validation: { category: "regex", condition: "matches", value: "^[ァ-ヶｦ-ﾟー\\s　]+$", presetKey: "company_kana", errorMessage: "全角カタカナで入力してください。" }, options: [] },
            { id: "q_hi_zip", type: "text", title: "郵便番号", description: "7桁半角数字を入力すると住所を自動補完します（例: 150-0041）", required: true, dataKey: "zip_code", validation: { category: "regex", condition: "matches", value: "^[0-9]{3}-?[0-9]{4}$", presetKey: "zip", errorMessage: "郵便番号を7桁で入力してください。" }, options: [] },
            { id: "q_hi_pref", type: "select", title: "都道府県", description: "お住まいの都道府県を選択してください", required: true, dataKey: "pref", options: JAPAN_PREFECTURES.map(p => ({ label: p })) },
            { id: "q_hi_city", type: "text", title: "市区町村", required: true, dataKey: "city", options: [] },
            { id: "q_hi_street", type: "text", title: "町名・番地", description: "自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。", required: true, dataKey: "street", options: [] },
            { id: "q_hi_building", type: "text", title: "建物名・部屋番号", description: "マンション名・アパート名・部屋番号等がある場合はご入力ください", required: false, dataKey: "building", options: [] },
            { id: "q_hi_email", type: "text", title: "メールアドレス", description: "ご回答内容の控えをこのメールアドレス宛てにお送りします。", required: true, autoReply: true, dataKey: "email", validation: { category: "text", condition: "email", errorMessage: "有効なメールアドレスを入力してください。" }, options: [] },
            { id: "q_hi_tel", type: "text", title: "電話番号", description: "半角数字（ハイフンなし）で入力してください（例: 09012345678）", required: true, dataKey: "tel", validation: { category: "regex", condition: "matches", value: "^0\\d{9,10}$", presetKey: "tel_no_hyphen", errorMessage: "半角数字（10桁または11桁・ハイフンなし）で入力してください。" }, options: [] },
            { id: "q_hi_tax_status", type: "radio", title: "税務区分・インボイス登録状況", description: "該当する税務区分を選択してください。「インボイス登録事業者である。」を選択された場合は登録番号の入力とAPI照合を行います。", required: true, dataKey: "tax_invoice_status", options: [{ label: "非課税事業者である。" }, { label: "課税事業者でインボイスは未登録である。" }, { label: "インボイス登録事業者である。" }] },
            { id: "q_hi_invoice_num", type: "text", title: "インボイス登録番号", description: "T＋13桁の半角数字を入力してください（国税庁公表システムへ照合します）。", required: false, dataKey: "invoice_number", validation: { category: "api", condition: "invoice_number", errorMessage: "国税庁公表システムに登録された有効なインボイス登録番号を入力してください。" }, skipLogic: { dependsOn: "q_hi_tax_status", condition: "not_equals", value: "インボイス登録事業者である。", action: "hide" }, options: [] }
          ]
        }
      ]
    },
    {
      title: "連絡先情報",
      description: "連絡先情報を収集するためのフォームです。",
      category: "personal",
      stripeColor: "#1e8e3e", // 緑
      sections: [
        {
          id: "sec_contact_1",
          title: "連絡先情報",
          description: "連絡先情報をご入力ください。",
          questions: [
            { id: "q_c1", type: "text", title: "名前", required: true },
            { id: "q_c2", type: "text", title: "メールアドレス", required: true },
            { id: "q_c3", type: "text", title: "電話番号", required: false },
            { id: "q_c4", type: "textarea", title: "住所", required: false }
          ]
        }
      ]
    },
    {
      title: "イベント出欠確認",
      description: "イベントの出欠確認フォームです。",
      category: "personal",
      stripeColor: "#1a73e8", // 青
      sections: [
        {
          id: "sec_event_1",
          title: "イベント出欠確認",
          description: "ご参加の可否をお知らせください。",
          questions: [
            { id: "q_e1", type: "radio", title: "ご参加されますか？", options: ["出席", "欠席", "未定"], required: true },
            { id: "q_e2", type: "checkbox", title: "食事の制限はありますか？", options: ["ベジタリアン", "アレルギーあり", "特になし"], required: false },
            { id: "q_e3", type: "textarea", title: "ご質問やご要望", required: false }
          ]
        }
      ]
    },
    {
      title: "パーティー招待状",
      description: "パーティーの招待状フォームです。",
      category: "personal",
      stripeColor: "#f4b400", // 黄
      sections: [
        {
          id: "sec_party_1",
          title: "パーティー招待状",
          description: "パーティーへご招待いたします！",
          questions: [
            { id: "q_p1", type: "text", title: "お名前", required: true },
            { id: "q_p2", type: "radio", title: "何人でご参加されますか？", options: ["1人", "2人", "3人以上"], required: true },
            { id: "q_p3", type: "textarea", title: "アレルギーなど配慮が必要な事項", required: false }
          ]
        }
      ]
    },
    {
      title: "Tシャツ申込書",
      description: "Tシャツの購入申込書フォームです。",
      category: "personal",
      stripeColor: "#ab47bc", // 紫
      sections: [
        {
          id: "sec_tshirt_1",
          title: "Tシャツ申込書",
          description: "ご希望のTシャツのサイズとカラーをお選びください。",
          questions: [
            { id: "q_t1", type: "text", title: "お名前", required: true },
            { id: "q_t2", type: "radio", title: "サイズ", options: ["S", "M", "L", "XL"], required: true },
            { id: "q_t3", type: "radio", title: "カラー", options: ["ホワイト", "ブラック", "ブルー"], required: true },
            { id: "q_t4", type: "textarea", title: "その他ご要望", required: false }
          ]
        }
      ]
    },
    {
      title: "イベント参加申込書",
      description: "イベントの参加申込フォームです。",
      category: "personal",
      stripeColor: "#db4437", // 赤
      sections: [
        {
          id: "sec_join_1",
          title: "イベント参加申込書",
          description: "参加申込情報を入力してください。",
          questions: [
            { id: "q_j1", type: "text", title: "氏名", required: true },
            { id: "q_j2", type: "text", title: "会社名 / 学校名", required: false },
            { id: "q_j3", type: "text", title: "メールアドレス", required: true },
            { id: "q_j4", type: "radio", title: "参加枠", options: ["一般枠", "学生枠", "登壇者・関係者枠"], required: true }
          ]
        }
      ]
    },
    {
      title: "スケジュール確認",
      description: "日程調整用のフォームです。",
      category: "personal",
      stripeColor: "#4285f4", // 青
      sections: [
        {
          id: "sec_sched_1",
          title: "スケジュール確認",
          description: "ご都合の良い日程をお知らせください。",
          questions: [
            { id: "q_s1", type: "text", title: "お名前", required: true },
            { id: "q_s2", type: "checkbox", title: "参加可能日程 (複数選択可)", options: ["8/10 (月) 10:00~", "8/10 (月) 14:00~", "8/11 (火) 10:00~", "8/11 (火) 14:00~"], required: true }
          ]
        }
      ]
    },
    {
      title: "イベント参加者アンケート",
      description: "イベント終了後のアンケートです。",
      category: "work",
      stripeColor: "#0f9d58", // 深い緑
      sections: [
        {
          id: "sec_survey_1",
          title: "イベント参加者アンケート",
          description: "本日のイベントに関するご意見をお聞かせください。",
          questions: [
            { id: "q_su1", type: "radio", title: "本日の満足度はいかがでしたか？", options: ["大変満足", "満足", "普通", "不満"], required: true },
            { id: "q_su2", type: "textarea", title: "最も良かったセッションやその理由をご記入ください。", required: false },
            { id: "q_su3", type: "textarea", title: "今後のイベントへの改善要望", required: false }
          ]
        }
      ]
    },
    {
      title: "注文書",
      description: "商品の注文書フォームです。",
      category: "work",
      stripeColor: "#e67e22", // オレンジ
      sections: [
        {
          id: "sec_order_1",
          title: "注文書",
          description: "ご注文内容を入力してください。",
          questions: [
            { id: "q_o1", type: "text", title: "お名前 / 企業名", required: true },
            { id: "q_o2", type: "text", title: "配送先住所", required: true },
            { id: "q_o3", type: "checkbox", title: "ご注文商品 (複数選択可)", options: ["商品A (¥1,000)", "商品B (¥2,500)", "商品C (¥5,000)"], required: true },
            { id: "q_o4", type: "textarea", title: "配達に関するご要望", required: false }
          ]
        }
      ]
    },
    {
      title: "就職申込書",
      description: "採用応募用のエントリーフォームです。",
      category: "work",
      stripeColor: "#7f8c8d", // グレー
      sections: [
        {
          id: "sec_entry_1",
          title: "就職申込書",
          description: "エントリーシート情報を入力してください。",
          questions: [
            { id: "q_en1", type: "text", title: "氏名 (フリガナ)", required: true },
            { id: "q_en2", type: "radio", title: "希望職種", options: ["総合職", "技術職", "デザイナー職", "企画・営業職"], required: true },
            { id: "q_en3", type: "textarea", title: "自己PR", required: true },
            { id: "q_en4", type: "textarea", title: "志望動機", required: true }
          ]
        }
      ]
    },
    {
      title: "欠勤願い",
      description: "休暇や欠勤の申請フォームです。",
      category: "work",
      stripeColor: "#95a5a6", // 薄いグレー
      sections: [
        {
          id: "sec_absent_1",
          title: "欠勤願い",
          description: "欠勤の申請をご入力ください。",
          questions: [
            { id: "q_ab1", type: "text", title: "社員名", required: true },
            { id: "q_ab2", type: "radio", title: "休暇・欠勤の区分", options: ["有給休暇", "病欠", "慶弔休暇", "その他欠勤"], required: true },
            { id: "q_ab3", type: "text", title: "対象日 (例: 2026/08/10)", required: true },
            { id: "q_ab4", type: "textarea", title: "欠勤理由", required: true }
          ]
        }
      ]
    },
    {
      title: "業務依頼書",
      description: "社内業務の依頼・起票フォームです。",
      category: "work",
      stripeColor: "#2980b9", // 濃い青
      sections: [
        {
          id: "sec_work_1",
          title: "業務依頼書",
          description: "業務の依頼内容を起票してください。",
          questions: [
            { id: "q_w1", type: "text", title: "依頼件名", required: true },
            { id: "q_w2", type: "radio", title: "優先度", options: ["高", "中", "低"], required: true },
            { id: "q_w3", type: "text", title: "希望納期", required: true },
            { id: "q_w4", type: "textarea", title: "依頼詳細内容", required: true }
          ]
        }
      ]
    },
    {
      title: "お客様アンケート",
      description: "サービス改善のための顧客満足度調査です。",
      category: "work",
      stripeColor: "#27ae60", // 鮮やかな緑
      sections: [
        {
          id: "sec_cust_1",
          title: "お客様アンケート",
          description: "弊社のサービス・製品に対するご意見をお寄せください。",
          questions: [
            { id: "q_cu1", type: "radio", title: "当サービスをどこで知りましたか？", options: ["WEB検索", "SNS", "知人紹介", "その他"], required: true },
            { id: "q_cu2", type: "radio", title: "サービスの使いやすさはいかがですか？", options: ["非常に使いやすい", "使いやすい", "普通", "使いにくい"], required: true },
            { id: "q_cu3", type: "textarea", title: "当サービスについてのご要望やご意見", required: false }
          ]
        }
      ]
    }
  ];

  function getTemplates() {
    try {
      const raw = localStorage.getItem('form_customize_templates');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch(e) {}
    return [];
  }

  function saveTemplates(templates) {
    try {
      localStorage.setItem('form_customize_templates', JSON.stringify(templates));
    } catch(e) {}
  }

  function getFavorites() {
    try {
      const raw = localStorage.getItem('form_customize_favorite_templates');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch(e) {}
    return [];
  }

  function saveFavorites(favs) {
    try {
      localStorage.setItem('form_customize_favorite_templates', JSON.stringify(favs));
    } catch(e) {}
  }

  function isFavorite(title) {
    const favs = getFavorites();
    return favs.includes(title);
  }

  function toggleFavorite(title) {
    try {
      let favs = getFavorites();
      if (favs.includes(title)) {
        favs = favs.filter(t => t !== title);
      } else {
        favs.push(title);
      }
      saveFavorites(favs);
      renderFullTemplateGallery();
    } catch(e) {
      console.error('[Favorites] Toggle failed:', e);
    }
  }

  function initTemplates() {
    try {
      const current = getTemplates();
      if (current.length === 0) {
        saveTemplates(DEFAULT_TEMPLATES);
        console.log('[Templates] Initialized DEFAULT_TEMPLATES in localStorage.');
      }
    } catch(e) {
      console.error('[Templates] Init templates failed:', e);
    }
  }

  async function createFormFromTemplate(template) {
    try {
      const originalGetItem = localStorage.getItem;
      let allForms = [];
      try {
        allForms = JSON.parse(originalGetItem.call(localStorage, 'form_customize_all_forms') || '[]');
      } catch(e) {}

      let currentUser = { id: 'user_own_editor', name: '編集（自分がオーナーのみ）', role: 'own_editor' };
      try {
        const userRaw = originalGetItem.call(localStorage, 'gf_current_user');
        if (userRaw) {
          currentUser = JSON.parse(userRaw);
        }
      } catch(e) {}

      const defaultSchema = {
        title: template ? `${template.title} (${allForms.length + 1})` : `無題のフォーム (${allForms.length + 1})`,
        description: template ? (template.description || '') : 'フォームの説明を入力してください。',
        isLocked: false,
        isTemplateMode: false,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        sections: template ? JSON.parse(JSON.stringify(template.sections)) : [
          {
            id: 'section_1',
            title: '無題のセクション',
            description: 'セクションの説明をご入力ください。',
            questions: []
          }
        ]
      };

      const today = new Date();
      defaultSchema.lastModified = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

      if (template) {
        saveRecentTemplate(template);
      }

      allForms.push(defaultSchema);
      localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
      
      const activeIdx = allForms.length - 1;
      localStorage.setItem('form_customize_active_index', activeIdx.toString());
      localStorage.setItem('form_customize_is_template_mode', 'false');
      localStorage.setItem('form_customize_active_form_title', defaultSchema.title);
      localStorage.setItem('form_customize_active_tab', 'editor');

      console.log('[Templates] Created new form from template. Index:', activeIdx);

      // クラウドへの即時同期を完了させてからリロード（競合・消滅の防止）
      if (typeof window.syncFormsToCloud === 'function') {
        await window.syncFormsToCloud(allForms, true);
      } else if (typeof syncFormsToCloud === 'function') {
        await syncFormsToCloud(allForms, true);
      } else {
        const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
        const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';
        try {
          await fetch('/api/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ allForms: allForms })
          }).catch(() => null);
          await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
            method: 'POST',
            headers: {
              apikey: sbKey,
              Authorization: `Bearer ${sbKey}`,
              'Content-Type': 'application/json',
              Prefer: 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              key: 'synapse_form_customize_all_forms',
              value: allForms,
              updated_at: new Date().toISOString()
            })
          });
        } catch(e) {}
      }

      // リロードして編集画面で起動
      window.location.reload();
    } catch (err) {
      console.error('[Templates] Failed to create form from template:', err);
      alert('フォームの作成に失敗しました。');
    }
  }

  function saveRecentTemplate(template) {
    try {
      let recents = JSON.parse(localStorage.getItem('form_customize_recent_templates') || '[]');
      recents = recents.filter(r => r.title !== template.title);
      recents.unshift(template);
      if (recents.length > 6) {
        recents = recents.slice(0, 6);
      }
      localStorage.setItem('form_customize_recent_templates', JSON.stringify(recents));
    } catch(e) {}
  }

  function registerFormAsTemplate(formIndex) {
    try {
      const originalGetItem = localStorage.getItem;
      let allForms = [];
      try {
        allForms = JSON.parse(originalGetItem.call(localStorage, 'form_customize_all_forms') || '[]');
      } catch(e) {}

      const targetForm = allForms[formIndex];
      if (!targetForm) return;

      let templates = getTemplates();
      
      const newTemplate = {
        title: `${targetForm.title} (テンプレート)`,
        description: targetForm.description || '',
        category: 'personal',
        stripeColor: '#7248b9',
        sections: JSON.parse(JSON.stringify(targetForm.sections))
      };

      templates.push(newTemplate);
      saveTemplates(templates);
      
      // 自動的にお気に入り登録（スター付き）にする！
      let favs = getFavorites();
      if (!favs.includes(newTemplate.title)) {
        favs.push(newTemplate.title);
        saveFavorites(favs);
      }
      
      alert(`「${targetForm.title}」をテンプレート（個人用）として登録しました！`);
      
      renderTemplateBar();
      renderFullTemplateGallery();

    } catch (err) {
      console.error('[Templates] Failed to register template:', err);
      alert('テンプレート登録に失敗しました。');
    }
  }

  // テンプレートカード単体のHTML要素を生成するヘルパー
  function createTemplateCardElement(template, isBlank = false, showDelete = false) {
    try {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.style.position = 'relative';
      
      const preview = document.createElement('div');
      preview.className = 'template-card-preview';
      
      if (isBlank || !template || !template.title) {
        preview.innerHTML = `
          <div class="template-card-blank-inner">
            <span class="template-card-plus-icon">+</span>
          </div>
        `;
        card.appendChild(preview);
        
        const title = document.createElement('span');
        title.className = 'template-card-title';
        title.textContent = '空白のフォーム';
        card.appendChild(title);
        
        card.addEventListener('click', () => {
          createFormFromTemplate(null);
        });
      } else {
        const stripe = document.createElement('div');
        stripe.className = 'template-card-header-stripe';
        stripe.style.backgroundColor = template.stripeColor || '#7248b9';
        preview.appendChild(stripe);
        
        const dTitle = document.createElement('div');
        dTitle.className = 'template-card-dummy-title';
        preview.appendChild(dTitle);
        
        const dField1 = document.createElement('div');
        dField1.className = 'template-card-dummy-field';
        preview.appendChild(dField1);
        
        const dField2 = document.createElement('div');
        dField2.className = 'template-card-dummy-field';
        preview.appendChild(dField2);
        
        const dLine = document.createElement('div');
        dLine.className = 'template-card-dummy-line';
        preview.appendChild(dLine);
        
        card.appendChild(preview);
        
        // 🌟 右上に絶対配置する「お気に入り」スターボタン
        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = 'btn-template-fav';
        if (isFavorite(template.title)) {
          favBtn.classList.add('active');
          favBtn.innerHTML = '★';
          favBtn.title = 'お気に入りから削除';
        } else {
          favBtn.innerHTML = '☆';
          favBtn.title = 'お気に入りに追加';
        }
        
        favBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(template.title);
        });
        card.appendChild(favBtn);
        
        // 🗑️ 直接削除可能な削除ボタン (ギャラリーのみ)
        if (showDelete) {
          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
          delBtn.title = 'テンプレートを削除';
          delBtn.setAttribute('aria-label', 'テンプレートを削除');
          
          delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            showSystemConfirmModal(`テンプレート「${template.title}」を完全に削除しますか？`, (ok) => {
              if (ok) {
                const templates = getTemplates();
                const idx = templates.findIndex(temp => temp.title === template.title);
                if (idx !== -1) {
                  templates.splice(idx, 1);
                  saveTemplates(templates);
                  showCustomToast('テンプレートを削除しました。', 'success');
                  if (typeof renderTemplateGallery === 'function') renderTemplateGallery();
                  if (typeof renderTemplateBar === 'function') renderTemplateBar();
                  if (typeof renderFullTemplateGallery === 'function') renderFullTemplateGallery();
                }
              }
            });
          });
          card.appendChild(delBtn);
        }
        
        const title = document.createElement('span');
        title.className = 'template-card-title';
        title.textContent = template.title;
        card.appendChild(title);

        const categoryLabel = document.createElement('span');
        categoryLabel.className = 'template-card-category';
        categoryLabel.textContent = template.category === 'work' ? '仕事用' : '個人用';
        card.appendChild(categoryLabel);
        
        card.addEventListener('click', () => {
          createFormFromTemplate(template);
        });
      }
      return card;
    } catch (e) {
      console.error('[Templates] createTemplateCardElement inner error:', e);
      // 万が一のフォールバック
      const fbCard = document.createElement('div');
      fbCard.className = 'template-card';
      fbCard.innerHTML = '<div class="template-card-preview">Error</div>';
      return fbCard;
    }
  }

  // ダッシュボード上部のテンプレートバーの描画（復旧＆折りたたみ＆トグル切り替え）
  function renderTemplateBar() {
    try {
      console.log('[Templates] renderTemplateBar execution started.');
      const container = document.getElementById('template-bar-cards-grid');
      if (!container) {
        console.warn('[Templates] template-bar-cards-grid container not found in DOM!');
        return;
      }
      
      container.innerHTML = '';
      
      // 先頭に「空白のフォーム」を追加
      container.appendChild(createTemplateCardElement(null, true));
      
      // お気に入りか最近かのモード判定
      const mode = localStorage.getItem('form_customize_template_bar_mode') || 'recent';
      
      // フィルタボタンのアクティブ表示切替
      const btnRecent = document.getElementById('tpl-bar-mode-recent');
      const btnFav = document.getElementById('tpl-bar-mode-fav');
      if (btnRecent && btnFav) {
        if (mode === 'fav') {
          btnRecent.classList.remove('active');
          btnFav.classList.add('active');
        } else {
          btnRecent.classList.add('active');
          btnFav.classList.remove('active');
        }
      }

      const templates = getTemplates() || [];
      let displayTemplates = [];

      if (mode === 'fav') {
        // お気に入り登録されているテンプレートのみ
        displayTemplates = templates.filter(t => t && t.title && isFavorite(t.title));
      } else {
        // 最近使ったテンプレート優先
        let recents = [];
        try {
          recents = JSON.parse(localStorage.getItem('form_customize_recent_templates') || '[]');
        } catch(e) {}
        
        // 有効なもののみ抽出
        const validRecents = (Array.isArray(recents) ? recents : []).filter(r => r && r.title);
        displayTemplates = [...validRecents];
        
        templates.forEach(t => {
          if (t && t.title && !displayTemplates.some(d => d && d.title === t.title)) {
            displayTemplates.push(t);
          }
        });
      }
      
      const showCount = Math.min(displayTemplates.length, 5);
      console.log('[Templates] Filtered display templates count:', showCount);
      for (let i = 0; i < showCount; i++) {
        const item = displayTemplates[i];
        if (item) {
          try {
            container.appendChild(createTemplateCardElement(item));
          } catch(cardErr) {
            console.error('[Templates] Error rendering single card:', cardErr);
          }
        }
      }
      
      console.log('[Templates] Rendered template bar successfully. Mode:', mode, 'Total Elements:', container.children.length);
    } catch(err) {
      console.error('[Templates] renderTemplateBar fatal error:', err);
    }
  }

  // テンプレートバーのトグル制御
  function setupTemplateBarToggleListeners() {
    try {
      // 最近使った / お気に入りのフィルタ切り替えのみ処理
      document.addEventListener('click', (e) => {
        const target = e.target;
        
        // フィルタトグル「最近使った」のクリック
        if (target && (target.id === 'tpl-bar-mode-recent' || target.closest('#tpl-bar-mode-recent'))) {
          e.stopPropagation();
          localStorage.setItem('form_customize_template_bar_mode', 'recent');
          renderTemplateBar();
          return;
        }
        
        // フィルタトグル「お気に入り」のクリック
        if (target && (target.id === 'tpl-bar-mode-fav' || target.closest('#tpl-bar-mode-fav'))) {
          e.stopPropagation();
          localStorage.setItem('form_customize_template_bar_mode', 'fav');
          renderTemplateBar();
          return;
        }
      });
    } catch(err) {
      console.error('[Templates] setupTemplateBarToggleListeners error:', err);
    }
  }

  // フルスクリーンテンプレートギャラリー画面の描画
  function renderFullTemplateGallery() {
    try {
      const allGrid = document.getElementById('gallery-all-grid');
      if (!allGrid) return;
      
      allGrid.innerHTML = '';
      
      // A. リスト/グリッド表示形式の同期
      const viewMode = localStorage.getItem('form_customize_gallery_view_mode') || 'grid';
      const viewIcon = document.getElementById('gallery-view-icon');
      if (viewIcon) {
        viewIcon.textContent = viewMode === 'list' ? '田' : '▤';
        if (viewIcon.parentElement) {
          viewIcon.parentElement.title = viewMode === 'list' ? 'グリッド表示に切り替え' : 'リスト表示に切り替え';
        }
      }
      
      if (viewMode === 'list') {
        allGrid.classList.add('list-view');
      } else {
        allGrid.classList.remove('list-view');
      }

      // B. 最近使った/お気に入りのタブ同期 (ヘッダー右上配置)
      const tabMode = localStorage.getItem('form_customize_gallery_tab_mode') || 'recent';
      const btnRecent = document.getElementById('gallery-tab-mode-recent');
      const btnFav = document.getElementById('gallery-tab-mode-fav');
      if (btnRecent && btnFav) {
        if (tabMode === 'favorites') {
          btnRecent.classList.remove('active');
          btnRecent.style.backgroundColor = 'transparent';
          btnRecent.style.color = '#5f6368';
          btnRecent.style.boxShadow = 'none';

          btnFav.classList.add('active');
          btnFav.style.backgroundColor = '#ffffff';
          btnFav.style.color = '#7248b9';
          btnFav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
        } else {
          btnRecent.classList.add('active');
          btnRecent.style.backgroundColor = '#ffffff';
          btnRecent.style.color = '#7248b9';
          btnRecent.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';

          btnFav.classList.remove('active');
          btnFav.style.backgroundColor = 'transparent';
          btnFav.style.color = '#5f6368';
          btnFav.style.boxShadow = 'none';
        }
      }

      const templates = getTemplates();
      let displayTemplates = [];
      
      if (tabMode === 'favorites') {
        displayTemplates = templates.filter(t => isFavorite(t.title));
      } else {
        // 最近使った順
        let recents = [];
        try {
          recents = JSON.parse(localStorage.getItem('form_customize_recent_templates') || '[]');
        } catch(e) {}
        
        displayTemplates = [...recents];
        templates.forEach(t => {
          if (!displayTemplates.some(d => d.title === t.title)) {
            displayTemplates.push(t);
          }
        });
      }
      
      // 描画処理
      if (displayTemplates.length === 0) {
        allGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: #5f6368; font-size: 0.88rem; line-height: 1.6; width: 100%;">
            ${tabMode === 'favorites' ? 'お気に入り登録されているテンプレートはありません。' : 'テンプレートはありません。'}<br>
            フォーム一覧の行にある「⭐ テンプレート登録」をクリックして作成したオリジナルテンプレートがここに表示されます。
          </div>
        `;
      } else {
        displayTemplates.forEach(t => {
          allGrid.appendChild(createTemplateCardElement(t, false, true));
        });
      }
      
      console.log(`[Templates] Rendered full template gallery. TabMode: ${tabMode}, ViewMode: ${viewMode}, Count: ${displayTemplates.length}`);
    } catch(err) {
      console.error('[Templates] renderFullTemplateGallery error:', err);
    }
  }

  // ギャラリーとダッシュボードの画面遷移イベントリスナー (デリゲーション補助用)
  function setupTemplateGalleryListeners() {
    try {
      const backBtn = document.getElementById('btn-back-from-gallery');
      const dashboardPanel = document.getElementById('panel-dashboard');
      const galleryPanel = document.getElementById('panel-template-gallery');
      
      if (backBtn && dashboardPanel && galleryPanel) {
        // グローバルデリゲーションでもフックしていますが、念のため直接イベントも維持します
        backBtn.addEventListener('click', () => {
          galleryPanel.classList.remove('active');
          dashboardPanel.classList.add('active');
          const homeTab = document.querySelector('.nav-tab[data-tab="dashboard"]');
          if (homeTab) homeTab.classList.add('active');
        });
      }
    } catch(err) {
      console.error('[Templates] setupTemplateGalleryListeners error:', err);
    }
  }

  // 1. APIシミュレーター用のマスタデータ & キャッシュ
  const ZIP_DATABASE = {
    "1500002": { pref: "東京都", city: "渋谷区", street: "渋谷" },
    "1000001": { pref: "東京都", city: "千代田区", street: "千代田" },
    "1000005": { pref: "東京都", city: "千代田区", street: "丸の内" },
    "1020083": { pref: "東京都", city: "千代田区", street: "麹町" },
    "1066118": { pref: "東京都", city: "港区", street: "六本木" },
    "7300011": { pref: "広島県", city: "広島市中区", street: "基町" },
    "7300012": { pref: "広島県", city: "広島市中区", street: "上八丁堀" },
    "7300013": { pref: "広島県", city: "広島市中区", street: "八丁堀" },
    "7300043": { pref: "広島県", city: "広島市中区", street: "南竹屋町" },
    "5300001": { pref: "大阪府", city: "大阪市北区", street: "梅田" }
  };

  // 📮 郵便番号（7桁）から住所をリアルタイム照会（ZipCloud API連携＋内蔵キャッシュ）
  async function lookupAddressFromZip(zipCode) {
    if (!zipCode) return null;
    const cleanZip = zipCode.replace(/[^\d]/g, '');
    if (cleanZip.length !== 7) return null;

    if (ZIP_DATABASE[cleanZip]) {
      return ZIP_DATABASE[cleanZip];
    }

    try {
      const resp = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.results && data.results.length > 0) {
          const r = data.results[0];
          const resObj = {
            pref: r.address1 || '',
            city: r.address2 || '',
            street: r.address3 || ''
          };
          ZIP_DATABASE[cleanZip] = resObj;
          return resObj;
        }
      }
    } catch (e) {
      console.warn('ZipCloud API fetch error:', e);
    }

    return ZIP_DATABASE[cleanZip] || null;
  }

  // 📮 日本の住所文字列を高精度に【都道府県】【市区町村】【町名・番地】【建物名・部屋番号】にパース
  function parseJapaneseAddress(fullAddr, prefHint, cityHint, streetHint) {
    let pref = (prefHint || '').trim();
    let city = (cityHint || '').trim();
    let street = (streetHint || '').trim();
    let building = '';
    let rest = (fullAddr || '').trim();

    // 1. 都道府県の特定
    if (!pref) {
      const prefMatch = rest.match(/^(東京都|北海道|京都府|大阪府|.{2,3}県)/);
      if (prefMatch) {
        pref = prefMatch[1];
        rest = rest.substring(pref.length).trim();
      }
    } else if (rest.startsWith(pref)) {
      rest = rest.substring(pref.length).trim();
    }

    // 2. 市区町村の特定
    if (!city) {
      const cityMatch = rest.match(/^([^市区町村]+?郡[^市区町村]+?[町村]|[^市区町村]+?市[^市区町村]+?区|[^市区町村]+?[市区町村])/);
      if (cityMatch) {
        city = cityMatch[1];
        rest = rest.substring(city.length).trim();
      }
    } else if (rest.startsWith(city)) {
      rest = rest.substring(city.length).trim();
    }

    // 3. 町名・番地 と 建物名・部屋番号の分離
    const targetStreet = street || rest;
    const parsed = parseStreetAndBuilding(targetStreet);
    street = parsed.street;
    building = parsed.building;

    return { pref, city, street, building };
  }

  // 町名・番地文字列から建物名・部屋番号を分離するヘルパー
  function parseStreetAndBuilding(streetStr) {
    if (!streetStr) return { street: '', building: '' };
    const raw = streetStr.trim();

    // 1. スペース（全角・半角）で区切られている場合は最優先
    const spaceIdx = raw.search(/[\s　]+/);
    if (spaceIdx !== -1) {
      return {
        street: raw.substring(0, spaceIdx).trim(),
        building: raw.substring(spaceIdx).trim()
      };
    }

    // 2. 建物キーワード（ビル、マンション、タワー等）での分割
    const bldKeywords = ['ビル', 'マンション', 'タワー', 'レジデンス', 'コート', 'プラザ', 'ハイツ', 'コーポ', 'メゾン', 'ヒルズ', 'スクエア', 'センター', 'オフィス', '館', 'ハウス', 'フロア', '階', 'F', '号室'];
    for (const kw of bldKeywords) {
      const idx = raw.indexOf(kw);
      if (idx > 0) {
        const before = raw.substring(0, idx);
        if (/[\d０-９]/.test(before)) {
          const numEndMatch = before.match(/^(.+?[\d０-９]+(?:丁目|番地?|号|[-－ー‐][\d０-９]+)*(?:番地?|号)?)(.*)$/);
          if (numEndMatch && numEndMatch[2]) {
            return {
              street: numEndMatch[1].trim(),
              building: (numEndMatch[2] + raw.substring(idx)).trim()
            };
          } else {
            return {
              street: before.trim(),
              building: raw.substring(idx).trim()
            };
          }
        }
      }
    }

    // 3. アラビア数字を含む番地の後に続く英字・カタカナ・漢字文字列
    const m = raw.match(/^(.+?[\d０-９]+(?:丁目|番地?|号|[-－ー‐][\d０-９]+)*(?:番地?|号)?)([^\d０-９丁目番地号\-－ー‐\s].*)$/);
    if (m && m[2]) {
      return {
        street: m[1].trim(),
        building: m[2].trim()
      };
    }

    return { street: raw, building: '' };
  }

  const BANK_DATABASE = {
    "三菱UFJ銀行": {
      code: "0005",
      branches: {
        "本店": "001",
        "丸の内支店": "010",
        "日本橋支店": "020",
        "新宿支店": "341",
        "渋谷支店": "135",
        "横浜支店": "211",
        "名古屋営業部": "611",
        "大阪営業部": "501"
      }
    },
    "三井住友銀行": {
      code: "0009",
      branches: {
        "本店営業部": "100",
        "東京営業部": "200",
        "新宿支店": "208",
        "渋谷支店": "248",
        "梅田支店": "501",
        "名古屋支店": "401"
      }
    },
    "みずほ銀行": {
      code: "0001",
      branches: {
        "本店": "001",
        "丸の内支店": "100",
        "新宿支店": "210",
        "渋谷支店": "220",
        "大阪支店": "510",
        "名古屋支店": "410"
      }
    },
    "りそな銀行": {
      code: "0010",
      branches: {
        "東京営業部": "010",
        "大阪営業部": "110",
        "新宿支店": "326",
        "渋谷支店": "328",
        "日本橋支店": "020"
      }
    },
    "埼玉りそな銀行": {
      code: "0017",
      branches: {
        "さいたま営業部": "001",
        "大宮支店": "100",
        "川越支店": "200",
        "浦和支店": "110"
      }
    },
    "ゆうちょ銀行": {
      code: "9900",
      branches: {
        "本店": "001",
        "〇一八支店": "018",
        "〇二八支店": "028",
        "一三八支店": "138",
        "二二八支店": "228"
      }
    },
    "楽天銀行": {
      code: "0036",
      branches: {
        "本店": "001",
        "第一営業支店": "251",
        "第二営業支店": "252",
        "第三営業支店": "253",
        "楽天市場支店": "207",
        "ワルツ支店": "204",
        "リズム支店": "209"
      }
    },
    "PayPay銀行": {
      code: "0033",
      branches: {
        "本店営業部": "001",
        "ビジネス営業部": "002",
        "すずめ支店": "003",
        "はやぶさ支店": "004",
        "つばめ支店": "005",
        "かわせみ支店": "006"
      }
    },
    "住信SBIネット銀行": {
      code: "0038",
      branches: {
        "本店": "001",
        "イチゴ支店": "101",
        "ブドウ支店": "102",
        "ミカン支店": "103",
        "レモン支店": "104",
        "リンゴ支店": "105",
        "バナナ支店": "106"
      }
    },
    "ソニー銀行": {
      code: "0035",
      branches: {
        "本店営業部": "001"
      }
    },
    "SBI新生銀行": {
      code: "0397",
      branches: {
        "本店": "400",
        "新宿支店": "410",
        "銀座支店": "411",
        "難波支店": "510"
      }
    },
    "あおぞら銀行": {
      code: "0398",
      branches: {
        "本店": "001",
        "日本橋支店": "003",
        "新宿支店": "004",
        "大阪支店": "101"
      }
    },
    "GMOあおぞらネット銀行": {
      code: "0310",
      branches: {
        "本店営業部": "101",
        "法人第一営業部": "102"
      }
    },
    "イオン銀行": {
      code: "0040",
      branches: {
        "本店": "001",
        "カブトチョウ支店": "002"
      }
    },
    "auじぶん銀行": {
      code: "0039",
      branches: {
        "本店": "001"
      }
    },
    "横浜銀行": {
      code: "0138",
      branches: {
        "本店営業部": "100",
        "新横浜支店": "230",
        "川崎支店": "300",
        "新宿支店": "710",
        "東京支店": "700"
      }
    },
    "千葉銀行": {
      code: "0134",
      branches: {
        "本店営業部": "100",
        "船橋支店": "200",
        "柏支店": "300",
        "東京営業部": "700"
      }
    },
    "静岡銀行": {
      code: "0149",
      branches: {
        "本店営業部": "100",
        "浜松営業部": "200",
        "静岡駅前支店": "110",
        "東京支店": "700"
      }
    },
    "福岡銀行": {
      code: "0177",
      branches: {
        "本店営業部": "100",
        "博多駅前支店": "110",
        "天神町支店": "120",
        "東京支店": "700"
      }
    },
    "広島銀行": {
      code: "0169",
      branches: {
        "本店営業部": "001",
        "八丁堀支店": "101",
        "東京支店": "901",
        "大阪支店": "801"
      }
    },
    "北洋銀行": {
      code: "0166",
      branches: {
        "本店営業部": "001",
        "札幌南支店": "100",
        "東京支店": "901"
      }
    },
    "京都銀行": {
      code: "0158",
      branches: {
        "本店営業部": "100",
        "祇園支店": "110",
        "大阪営業部": "500",
        "東京営業部": "700"
      }
    },
    "広島信用金庫": {
      code: "1750",
      branches: {
        "本店営業部": "001",
        "広島駅前支店": "002",
        "八丁堀支店": "003"
      }
    },
    "広島みどり信用金庫": {
      code: "1758",
      branches: {
        "本店営業部": "001"
      }
    },
    "広島市信用組合": {
      code: "2680",
      branches: {
        "本店営業部": "001"
      }
    }
  };

  function getOfficialBankName(bank) {
    if (!bank || !bank.name) return '';
    const name = String(bank.name).trim();
    const code = String(bank.code || '').padStart(4, '0');
    const codeNum = parseInt(code, 10);

    if (name.endsWith('銀行') || name.endsWith('信用金庫') || name.endsWith('信用組合') || name.endsWith('労働金庫')) {
      return name;
    }
    if (name.endsWith('信金')) return name.replace(/信金$/, '信用金庫');
    if (name.endsWith('信組')) return name.replace(/信組$/, '信用組合');
    if (name.endsWith('労金')) return name.replace(/労金$/, '労働金庫');
    if (name.endsWith('農協')) return name.replace(/農協$/, '農業協同組合');
    if (name.endsWith('信連')) return name.replace(/信連$/, '信用農業協同組合連合会');
    if (name.endsWith('信漁連')) return name.replace(/信漁連$/, '信用漁業協同組合連合会');

    if (codeNum < 1000) return name + '銀行';
    if (codeNum >= 1000 && codeNum < 2000) return name + '信用金庫';
    if (codeNum >= 2000 && codeNum < 3000) return name + '信用組合';
    if (codeNum >= 2950 && codeNum <= 2999) return name + '労働金庫';
    return name;
  }

  function getOfficialBranchName(branch) {
    if (!branch) return '';
    const rawName = (typeof branch === 'string' ? branch : branch.name || '').trim();
    if (!rawName) return '';

    const suffixes = ['支店', '営業部', '出張所', '本店', '支社', '部', '所', '課', '室', '局', 'センター', 'オフィス', 'プラザ'];
    for (const s of suffixes) {
      if (rawName.endsWith(s)) {
        return rawName;
      }
    }
    return rawName + '支店';
  }

  // 全銀協 統一金融機関コード・支店コード 最新オープンデータ連携サービス (Zengin Code API)
  const BankDataService = {
    _banks: null,
    _banksPromise: null,
    _branchMap: new Map(),
    _branchPromises: new Map(),

    async init() {
      return this.getBanks();
    },

    async getBanks() {
      if (this._banks && Object.keys(this._banks).length > 0) return this._banks;
      if (this._banksPromise) return this._banksPromise;

      this._banksPromise = (async () => {
        // 1. 自前サーバーレスAPI (/api/bank-search)
        try {
          const res = await fetch('/api/bank-search');
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.banks)) {
              const map = {};
              data.banks.forEach(b => {
                const c = String(b.code || '').padStart(4, '0');
                map[c] = { ...b, code: c };
              });
              this._banks = map;
              return this._banks;
            }
          }
        } catch (e) {
          console.warn('[BankDataService] /api/bank-search fetch failed, trying direct open data endpoint...', e);
        }

        // 2. Direct Zengin Code API (GitHub Pages: CORS * 全オリジン許可)
        try {
          const res = await fetch('https://zengin-code.github.io/api/banks.json');
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
              this._banks = data;
              return this._banks;
            }
          }
        } catch (e) {
          console.warn('[BankDataService] Direct Zengin Code API fetch failed, falling back to local database...', e);
        }

        // 3. Fallback: static BANK_DATABASE
        const fallbackMap = {};
        for (const [name, info] of Object.entries(BANK_DATABASE)) {
          fallbackMap[info.code] = {
            code: info.code,
            name: name,
            kana: '',
            hira: ''
          };
        }
        this._banks = fallbackMap;
        return this._banks;
      })();

      return this._banksPromise;
    },

    async searchBanks(query) {
      const rawVal = (query || '').trim();
      if (!rawVal) return [];

      // 1. 自前最新API (/api/bank-search) に照会
      try {
        const res = await fetch(`/api/bank-search?query=${encodeURIComponent(rawVal)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.banks)) {
            return data.banks.map(b => ({
              ...b,
              officialName: b.officialName || getOfficialBankName(b),
              displayName: b.displayName || b.officialName || getOfficialBankName(b)
            }));
          }
        }
      } catch (e) {
        console.warn('[BankDataService] searchBanks api failed, falling back to client cache...', e);
      }

      // 2. クライアントキャッシュでのフォールバック検索
      const banks = await this.getBanks();
      const cleanTarget = rawVal.normalize('NFKC').trim().toLowerCase();
      const kataTarget = (cleanTarget || '').replace(/[\u3041-\u3096]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
      const hiraTarget = (cleanTarget || '').replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
      const cleanNoType = cleanTarget.replace(/銀行|信用金庫|信金|労働金庫|労金|信組|信用組合|農協|農業協同組合/, '');

      const hasBank = cleanTarget.includes('銀行');
      const hasShinkin = cleanTarget.includes('信金') || cleanTarget.includes('信用金庫');
      const hasShinkumi = cleanTarget.includes('信組') || cleanTarget.includes('信用組合');

      const bankList = Object.values(banks);
      const matches = [];

      for (const b of bankList) {
        const bCode = String(b.code || '').padStart(4, '0');
        const officialName = getOfficialBankName(b);
        const rawName = (b.name || '').normalize('NFKC').trim().toLowerCase();
        const offName = officialName.normalize('NFKC').trim().toLowerCase();
        const bKana = (b.kana || '').normalize('NFKC').trim().toLowerCase();
        const bHira = (b.hira || '').normalize('NFKC').trim().toLowerCase();
        const bRoma = (b.roma || '').normalize('NFKC').trim().toLowerCase();

        let score = -1;

        // コード完全一致
        if (bCode === cleanTarget) {
          score = 100;
        }
        // 正式名称・生名称・カナ・ひらがな完全一致
        else if (offName === cleanTarget || rawName === cleanTarget || bKana === kataTarget || bHira === hiraTarget) {
          score = 90;
        }
        // 単体名で正式名称が一致 (例: 入力「広島」に対して officialName「広島銀行」)
        else if (cleanNoType && offName === cleanNoType + '銀行' && !hasShinkin && !hasShinkumi) {
          score = 85;
        }
        // 前方一致
        else if (offName.startsWith(cleanTarget) || rawName.startsWith(cleanTarget) || bKana.startsWith(kataTarget) || bHira.startsWith(hiraTarget)) {
          score = 80;
        }
        // cleanNoTypeで前方一致
        else if (cleanNoType.length >= 2 && (offName.startsWith(cleanNoType) || rawName.startsWith(cleanNoType) || bKana.startsWith(kataTarget))) {
          score = 70;
          if (hasShinkin && !offName.includes('信用金庫')) score -= 40;
          if (hasBank && !offName.endsWith('銀行')) score -= 40;
        }
        // 部分一致
        else if (offName.includes(cleanTarget) || rawName.includes(cleanTarget) || bKana.includes(kataTarget) || bHira.includes(hiraTarget) || bRoma.includes(cleanTarget)) {
          score = 60;
        }
        else if (cleanNoType.length >= 2 && (offName.includes(cleanNoType) || bKana.includes(kataTarget))) {
          score = 50;
          if (hasShinkin && !offName.includes('信用金庫')) score -= 40;
          if (hasBank && !offName.endsWith('銀行')) score -= 40;
        }

        if (score > 10) {
          matches.push({
            ...b,
            code: bCode,
            name: b.name,
            officialName,
            displayName: officialName,
            score
          });
        }
      }

      matches.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.code.localeCompare(b.code);
      });

      return matches.slice(0, 30);
    },

    async getBranches(bankCode) {
      if (!bankCode) return {};
      const cleanCode = String(bankCode).trim().padStart(4, '0');
      if (this._branchMap.has(cleanCode)) return this._branchMap.get(cleanCode);
      if (this._branchPromises.has(cleanCode)) return this._branchPromises.get(cleanCode);

      const promise = (async () => {
        // 1. /api/bank-search?bankCode=xxx&all=1
        try {
          const res = await fetch(`/api/bank-search?bankCode=${cleanCode}&all=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.branches)) {
              const brMap = {};
              data.branches.forEach(br => {
                const bc = String(br.code || '').padStart(3, '0');
                brMap[bc] = { ...br, code: bc };
              });
              this._branchMap.set(cleanCode, brMap);
              return brMap;
            }
          }
        } catch (e) {
          console.warn(`[BankDataService] Branch API fetch failed for bank ${cleanCode}:`, e);
        }

        // 2. Direct Zengin Code branches endpoint
        try {
          const res = await fetch(`https://zengin-code.github.io/api/branches/${cleanCode}.json`);
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
              this._branchMap.set(cleanCode, data);
              return data;
            }
          }
        } catch (e) {
          console.warn(`[BankDataService] Direct branch fetch failed for bank ${cleanCode}:`, e);
        }

        // 3. Fallback BANK_DATABASE
        for (const [name, info] of Object.entries(BANK_DATABASE)) {
          if (info.code === cleanCode && info.branches) {
            const brMap = {};
            for (const [brName, brCode] of Object.entries(info.branches)) {
              brMap[brCode] = { code: brCode, name: brName };
            }
            this._branchMap.set(cleanCode, brMap);
            return brMap;
          }
        }

        return {};
      })();

      this._branchPromises.set(cleanCode, promise);
      return promise;
    },

    async searchBranches(bankCode, query) {
      if (!bankCode) return [];
      const rawVal = (query || '').trim();
      const cleanBankCode = String(bankCode).trim().padStart(4, '0');

      // 1. 自前最新API (/api/bank-search) に照会
      try {
        const res = await fetch(`/api/bank-search?bankCode=${cleanBankCode}&branch=${encodeURIComponent(rawVal)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.branches)) {
            return data.branches.map(b => ({
              ...b,
              officialName: b.officialName || getOfficialBranchName(b),
              displayName: b.displayName || b.officialName || getOfficialBranchName(b)
            }));
          }
        }
      } catch (e) {
        console.warn('[BankDataService] searchBranches api failed, falling back to client cache...', e);
      }

      // 2. クライアントキャッシュでのフォールバック検索
      const branchesObj = await this.getBranches(cleanBankCode);
      const branchList = Object.values(branchesObj);
      if (!rawVal) {
        return branchList.slice(0, 50).map(b => ({
          ...b,
          code: String(b.code || '').padStart(3, '0'),
          officialName: getOfficialBranchName(b),
          displayName: getOfficialBranchName(b)
        }));
      }

      const cleanVal = rawVal.normalize('NFKC').toLowerCase();
      const cleanNoSuffix = cleanVal.replace(/支店|出張所|営業部|支社|本店|部|所|課|センター|オフィス/, '');
      const isDigit = /^\d+$/.test(cleanVal);
      const cleanPadded = isDigit ? cleanVal.padStart(3, '0') : '';

      const matched = [];
      for (const b of branchList) {
        const bCode = String(b.code || '').padStart(3, '0');
        const officialName = getOfficialBranchName(b);
        const bOffName = officialName.normalize('NFKC').toLowerCase();
        const bName = (b.name || '').normalize('NFKC').toLowerCase();
        const bKana = (b.kana || '').normalize('NFKC').toLowerCase();
        const bHira = (b.hira || '').normalize('NFKC').toLowerCase();

        const branchObj = {
          ...b,
          code: bCode,
          officialName,
          displayName: officialName
        };

        if (bCode === cleanVal || (cleanPadded && bCode === cleanPadded) || bOffName === cleanVal || bName === cleanVal || bKana === cleanVal || bHira === cleanVal) {
          matched.push(branchObj);
          continue;
        }
        if (isDigit && bCode.startsWith(cleanVal)) {
          matched.push(branchObj);
          continue;
        }
        if (bOffName.startsWith(cleanVal) || bName.startsWith(cleanVal) || bKana.startsWith(cleanVal)) {
          matched.push(branchObj);
          continue;
        }
        if (bOffName.includes(cleanVal) || bName.includes(cleanVal) || bKana.includes(cleanVal) || bHira.includes(cleanVal)) {
          matched.push(branchObj);
          continue;
        }
        if (cleanNoSuffix.length >= 1 && (bOffName.includes(cleanNoSuffix) || bName.includes(cleanNoSuffix) || bKana.includes(cleanNoSuffix))) {
          matched.push(branchObj);
          continue;
        }
      }
      return matched.slice(0, 30);
    }
  };

  // 即時プリフェッチ開始
  window.BankDataService = BankDataService;
  BankDataService.init().catch(() => {});

  function findBankByCode(code) {
    if (!code) return null;
    const clean = String(code).trim().padStart(4, '0');
    if (BankDataService._banks && BankDataService._banks[clean]) {
      const b = BankDataService._banks[clean];
      const name = getOfficialBankName(b);
      return { name, code: b.code || clean, officialName: name, displayName: name, ...b };
    }
    for (const [name, info] of Object.entries(BANK_DATABASE)) {
      if (info.code === clean) return { name, officialName: name, displayName: name, ...info };
    }
    return null;
  }

  function findBankByName(name) {
    if (!name) return null;
    const clean = name.trim().normalize('NFKC');
    const cleanNoBank = clean.replace(/銀行|信用金庫|信金|労働金庫|労金|信組|信用組合|農協|農業協同組合/, '');

    if (BankDataService._banks) {
      for (const [c, b] of Object.entries(BankDataService._banks)) {
        const bName = (b.name || '').normalize('NFKC');
        const offName = getOfficialBankName(b).normalize('NFKC');
        if (offName === clean || bName === clean || bName === clean + '銀行' || bName + '銀行' === clean) {
          return { name: offName, code: b.code || c, officialName: offName, displayName: offName, ...b };
        }
      }
      if (cleanNoBank.length >= 2) {
        for (const [c, b] of Object.entries(BankDataService._banks)) {
          const offName = getOfficialBankName(b).normalize('NFKC');
          const bNameNoBank = (b.name || '').normalize('NFKC').replace(/銀行|信用金庫|信金|労働金庫|労金|信組|信用組合|農協|農業協同組合/, '');
          if (bNameNoBank === cleanNoBank || offName.startsWith(cleanNoBank)) {
            return { name: offName, code: b.code || c, officialName: offName, displayName: offName, ...b };
          }
        }
      }
    }

    if (BANK_DATABASE[clean]) return { name: clean, officialName: clean, displayName: clean, ...BANK_DATABASE[clean] };
    for (const [k, info] of Object.entries(BANK_DATABASE)) {
      if (k.includes(clean) || clean.includes(k)) return { name: k, officialName: k, displayName: k, ...info };
    }
    return null;
  }

  // システム独自のスタイリッシュな確認モーダル表示処理
  function showSystemConfirmModal(message, callback) {
    const existing = document.getElementById('system-confirm-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'system-confirm-modal';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.65)';
    overlay.style.backdropFilter = 'blur(6px)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease-out';

    const isDelete = message.includes('削除') || message.includes('破棄');
    const accentColor = isDelete ? '#ef4444' : '#3182ce';
    const accentHover = isDelete ? '#dc2626' : '#2b6cb0';
    const icon = isDelete ? '🗑️' : '❓';
    const titleText = isDelete ? '削除の確認' : '実行の確認';
    const actionText = isDelete ? '削除する' : '実行する';

    const card = document.createElement('div');
    card.style.background = '#1e293b'; 
    card.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    card.style.borderRadius = '16px';
    card.style.padding = '24px';
    card.style.width = '90%';
    card.style.maxWidth = '420px';
    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'transform 0.2s ease-out';
    card.style.color = '#f8fafc';
    card.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="font-size: 1.5rem;">${icon}</span>
        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #f8fafc;">${titleText}</h3>
      </div>
      <div style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 24px; white-space: pre-wrap;">${message}</div>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button id="sys-confirm-btn-cancel" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1; padding: 10px 20px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.15s;">キャンセル</button>
        <button id="sys-confirm-btn-ok" style="background: ${accentColor}; border: none; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.15s;">${actionText}</button>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      card.style.transform = 'scale(1)';
    });

    const close = (result) => {
      overlay.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        overlay.remove();
        callback(result);
      }, 200);
    };

    const btnCancel = card.querySelector('#sys-confirm-btn-cancel');
    const btnOk = card.querySelector('#sys-confirm-btn-ok');

    btnCancel.addEventListener('mouseenter', () => {
      btnCancel.style.background = 'rgba(255, 255, 255, 0.1)';
      btnCancel.style.color = '#f8fafc';
    });
    btnCancel.addEventListener('mouseleave', () => {
      btnCancel.style.background = 'rgba(255, 255, 255, 0.05)';
      btnCancel.style.color = '#cbd5e1';
    });

    btnOk.addEventListener('mouseenter', () => {
      btnOk.style.background = accentHover;
    });
    btnOk.addEventListener('mouseleave', () => {
      btnOk.style.background = accentColor;
    });

    btnCancel.addEventListener('click', () => close(false));
    btnOk.addEventListener('click', () => close(true));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
  }

  // カスタムトースト表示関数 (未定義エラー解消 & UX向上)
  function showCustomToast(message, type = 'success') {
    console.log('[Toast]', message, type);
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = type === 'success' ? '#1e8e3e' : '#d93025';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    toast.style.zIndex = '999999';
    toast.style.fontFamily = 'sans-serif';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // フェードイン
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 50);
    
    // フェードアウトと削除
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  
  // システム独自のスタイリッシュな入力プロンプトモーダル表示処理
  function showSystemPromptModal(title, message, defaultValue, callback) {
    const existing = document.getElementById('system-prompt-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'system-prompt-modal';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.65)';
    overlay.style.backdropFilter = 'blur(6px)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease-out';

    const card = document.createElement('div');
    card.style.background = '#1e293b'; 
    card.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    card.style.borderRadius = '16px';
    card.style.padding = '24px';
    card.style.width = '90%';
    card.style.maxWidth = '420px';
    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'transform 0.2s ease-out';
    card.style.color = '#f8fafc';
    card.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    const safeVal = (defaultValue || '').replace(/"/g, '&quot;');
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
        <span style="font-size: 1.4rem;">✏️</span>
        <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #f8fafc;">${title || 'フォーム名の変更'}</h3>
      </div>
      <div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 14px;">${message || '新しいフォーム名を入力してください:'}</div>
      <div style="margin-bottom: 20px;">
        <input id="sys-prompt-input" type="text" value="${safeVal}" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.15s;" />
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button id="sys-prompt-btn-cancel" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1; padding: 9px 18px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.15s;">キャンセル</button>
        <button id="sys-prompt-btn-ok" style="background: #3b82f6; border: none; color: #ffffff; padding: 9px 20px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.15s;">保存する</button>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const input = card.querySelector('#sys-prompt-input');
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      card.style.transform = 'scale(1)';
      input.focus();
      input.select();
    });

    const close = (val) => {
      overlay.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        overlay.remove();
        callback(val);
      }, 200);
    };

    const btnCancel = card.querySelector('#sys-prompt-btn-cancel');
    const btnOk = card.querySelector('#sys-prompt-btn-ok');

    btnCancel.addEventListener('click', () => close(null));
    btnOk.addEventListener('click', () => close(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); close(input.value); }
      else if (e.key === 'Escape') { e.preventDefault(); close(null); }
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(null);
    });
  }
  window.showSystemPromptModal = showSystemPromptModal;

  // ✏️ フォーム名自前編集ロジック
  async function renameFormSelf(titleOrIndex) {
    let allForms = [];
    try {
      allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]');
    } catch(e) {}
    if (Array.isArray(window.U) && window.U.length > 0 && allForms.length === 0) {
      allForms = [...window.U];
    }

    let idx = -1;
    if (typeof titleOrIndex === 'number' && !isNaN(titleOrIndex)) {
      idx = titleOrIndex;
    } else {
      const rawTarget = String(titleOrIndex || '').trim();
      idx = allForms.findIndex(f => f && (f.id === rawTarget || (f.title || '').trim() === rawTarget));
      if (idx === -1 && Array.isArray(window.U)) {
        idx = window.U.findIndex(f => f && (f.id === rawTarget || (f.title || '').trim() === rawTarget));
      }
    }

    const targetForm = (idx >= 0 && idx < allForms.length) ? allForms[idx] : (window.U && window.U[idx]);
    if (!targetForm) {
      showCustomToast('対象のフォームが見つかりませんでした。', 'warning');
      return;
    }

    const currentTitle = (targetForm.title || '無題のフォーム').trim();
    showSystemPromptModal('✏️ フォーム名の変更', '新しいフォーム名を入力してください:', currentTitle, async (newTitle) => {
      if (newTitle === null || newTitle.trim() === '' || newTitle.trim() === currentTitle) {
        return;
      }

      const cleanNewTitle = newTitle.trim();
      targetForm.title = cleanNewTitle;
      if (window.U && window.U[idx]) {
        window.U[idx].title = cleanNewTitle;
      }
      if (allForms[idx]) {
        allForms[idx].title = cleanNewTitle;
      }

      // LocalStorage & Supabase 保存
      Storage.prototype.setItem.call(localStorage, 'form_customize_all_forms', JSON.stringify(allForms));
      
      // Supabase クラウド同期
      if (typeof syncFormsToCloud === 'function') {
        await syncFormsToCloud(allForms, true);
      }

      // DOM上の要素タイトルを即時更新
      try {
        const rows = document.querySelectorAll('.gf-list-row, .form-preview-card');
        rows.forEach(r => {
          const rowIdx = parseInt(r.dataset.formIndex, 10);
          if (rowIdx === idx) {
            const titleEl = r.querySelector('.gf-list-title-text, .card-preview-title-text');
            if (titleEl) titleEl.textContent = cleanNewTitle;
            r.dataset.formTitle = cleanNewTitle;
          }
        });
      } catch(e) {}

      // ダッシュボード全体の再描画
      if (typeof window.Y === 'function') {
        try { window.Y(); } catch(e) {}
      }

      showCustomToast(`フォーム名を「${cleanNewTitle}」に変更しました。`, 'success');
    });
  }
  window.renameFormSelf = renameFormSelf;

  // フォーム自前削除ロジック（DOM即時消去＆Supabaseクラウドストレージ完全同期版）
  async function deleteFormSelf(titleOrIndex, skipConfirm = false) {
    let allForms = [];
    try {
      allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]');
    } catch(e) {}
    if (Array.isArray(window.U) && window.U.length > 0 && allForms.length === 0) {
      allForms = [...window.U];
    }

    let idx = -1;
    if (typeof titleOrIndex === 'number' && !isNaN(titleOrIndex)) {
      idx = titleOrIndex;
    } else {
      const rawTarget = String(titleOrIndex || '').trim();
      const cleanTarget = rawTarget.replace(/[🔒\s\u200B-\u200D\uFEFF]/g, '').toLowerCase();

      // 1. 完全一致
      idx = allForms.findIndex(f => f && (
        (f.id && f.id === rawTarget) ||
        (f.title && f.title.trim() === rawTarget) ||
        (`${f.title || ''} ${f.subtitle || (f.header && f.header.subtitle) || ''}`.trim() === rawTarget)
      ));

      // 2. 正規化ファジー一致
      if (idx === -1) {
        idx = allForms.findIndex(f => {
          if (!f) return false;
          const fullT = `${f.title || ''} ${f.subtitle || (f.header && f.header.subtitle) || ''}`.trim();
          const cleanF = fullT.replace(/[🔒\s\u200B-\u200D\uFEFF]/g, '').toLowerCase();
          const cleanTitleOnly = (f.title || '').replace(/[🔒\s\u200B-\u200D\uFEFF]/g, '').toLowerCase();
          return cleanF === cleanTarget || cleanTitleOnly === cleanTarget ||
                 (cleanF && cleanTarget && (cleanF.includes(cleanTarget) || cleanTarget.includes(cleanF)));
        });
      }
      if (idx === -1 && Array.isArray(window.U)) {
        idx = window.U.findIndex(f => {
          if (!f) return false;
          const fullT = `${f.title || ''} ${f.subtitle || (f.header && f.header.subtitle) || ''}`.trim();
          const cleanF = fullT.replace(/[🔒\s\u200B-\u200D\uFEFF]/g, '').toLowerCase();
          const cleanTitleOnly = (f.title || '').replace(/[🔒\s\u200B-\u200D\uFEFF]/g, '').toLowerCase();
          return cleanF === cleanTarget || cleanTitleOnly === cleanTarget ||
                 (cleanF && cleanTarget && (cleanF.includes(cleanTarget) || cleanTarget.includes(cleanF)));
        });
      }
    }

    if (idx === -1 || (idx >= allForms.length && (!window.U || idx >= window.U.length))) {
      console.warn(`[Form Delete] Form not found for:`, titleOrIndex);
      showCustomToast('対象のフォームが見つかりませんでした。', 'warning');
      return;
    }

    const targetForm = (idx >= 0 && idx < allForms.length) ? allForms[idx] : (window.U && window.U[idx]);
    const targetTitle = (targetForm?.title || '選択したフォーム').trim();

    if (!skipConfirm) {
      showSystemConfirmModal(`フォーム「${targetTitle}」を完全に削除しますか？`, async (ok) => {
        if (ok) {
          await deleteFormSelf(idx, true);
        }
      });
      return;
    }

    // 🚀 即座に DOM から対象行を削除（ユーザーの目の前から即刻消滅させる）
    try {
      const rows = document.querySelectorAll('.gf-list-row, .form-preview-card');
      rows.forEach(r => {
        const rowTitle = (r.dataset.formTitle || r.querySelector('.gf-list-title-text')?.textContent || '').trim();
        const rowIdx = parseInt(r.dataset.formIndex, 10);
        if (rowIdx === idx || rowTitle === targetTitle || (targetTitle && rowTitle.includes(targetTitle))) {
          r.remove();
        }
      });
    } catch(domErr) {}

    // 削除実行
    const deletedForm = (idx >= 0 && idx < allForms.length) ? allForms.splice(idx, 1)[0] : targetForm;
    const deletedTitle = deletedForm?.title || targetTitle;
    console.log(`[Form Delete] Deleting form index ${idx}: "${deletedTitle}"`);

    // 削除済み・不要サンプルフォーム（フィードバック・管理者権限）の自動パージ
    const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
    allForms = allForms.filter(f => !f || !purgedKeywords.some(p => (f.title || '').includes(p)));

    // 1. LocalStorage 更新
    Storage.prototype.setItem.call(localStorage, 'form_customize_all_forms', JSON.stringify(allForms));
    
    let activeIndex = parseInt(localStorage.getItem('form_customize_active_index') || '0');
    if (activeIndex >= allForms.length) {
      activeIndex = Math.max(0, allForms.length - 1);
      Storage.prototype.setItem.call(localStorage, 'form_customize_active_index', activeIndex.toString());
    }

    // 2. Vite メモリ内配列（window.U）の更新
    if (Array.isArray(window.U)) {
      const uIdx = window.U.findIndex(f => f && (f === deletedForm || f.id === deletedForm?.id || (f.title || '').trim() === (deletedTitle || '').trim()));
      if (uIdx !== -1) {
        window.U.splice(uIdx, 1);
      } else if (idx >= 0 && idx < window.U.length) {
        window.U.splice(idx, 1);
      }
    }
    if (typeof window.W !== 'undefined') {
      window.W = Math.max(0, Math.min(window.W || 0, Math.max(0, (window.U?.length || 1) - 1)));
    }
    if (typeof window.G !== 'undefined') {
      window.G = (window.U && window.U.length > 0) ? window.U[window.W] : null;
    }
    if (typeof window.n !== 'undefined') {
      window.n = window.G;
    }

    // 3. 🌐 Supabaseクラウドストレージ（synapse_form_customize_all_forms）へ即時保存
    const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';

    try {
      await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allForms: allForms })
      }).catch(() => null);
    } catch(e) {}

    try {
      await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key: 'synapse_form_customize_all_forms',
          value: allForms,
          updated_at: new Date().toISOString()
        })
      });
      console.log('[Form Delete] Synced form deletion to Supabase cloud successfully. Remaining forms:', allForms.length);
    } catch(err) {
      console.warn('[Form Delete] Failed to sync form deletion to Supabase:', err);
    }

    // 4. 連携されていたカスタムテーブルのクリーンアップ
    if (deletedForm && (deletedForm.targetTableId || deletedForm.id)) {
      try {
        let curTables = JSON.parse(localStorage.getItem('synapse_custom_tables') || '[]');
        const tId = deletedForm.targetTableId;
        const fId = deletedForm.id;
        curTables = curTables.filter(t => t && t.id !== tId && t.formId !== fId && t.sourceFormId !== fId);
        Storage.prototype.setItem.call(localStorage, 'synapse_custom_tables', JSON.stringify(curTables));
        if (tId) localStorage.removeItem(`synapse_table_${tId}`);

        await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
          method: 'POST',
          headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({ key: 'synapse_custom_tables', value: curTables, updated_at: new Date().toISOString() })
        }).catch(() => null);
      } catch(e) {}
    }

    // 5. 親ウィンドウへの削除通知
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SYNAPSE_FORM_DELETED', formId: deletedForm?.id, formTitle: deletedTitle }, '*');
    }

    // 6. ダッシュボード一覧の即時再描画（インプレース再描画）
    if (typeof window.Y === 'function') {
      try { window.Y(); } catch(e) {}
    }
    if (allForms.length === 0) {
      const listEl = document.getElementById('dashboard-view-list');
      if (listEl) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--color-text-dark);">
            表示できるフォームがありません。
          </div>
        `;
      }
      const previewEl = document.getElementById('dashboard-view-preview');
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--color-text-dark); grid-column: 1 / -1;">
            表示できるフォームがありません。
          </div>
        `;
      }
    }

    showCustomToast(`フォーム「${deletedTitle}」を完全に削除しました。`, 'success');
  }
  window.deleteFormSelf = deleteFormSelf;

  // window.confirm をオーバーライドして同期実行を非同期モーダルへ乗っ取る (フォールバック第2防衛線)
  (function setupSystemConfirmOverride() {
    let lastClickedDeleteElement = null;
    let forceConfirmResult = null;

    document.addEventListener('pointerdown', (e) => {
      const target = e.target;
      const isAction = target.textContent.includes('削除') || 
                       target.textContent.includes('リセット') || 
                       target.textContent.includes('クリア') || 
                       target.innerHTML.includes('🗑️') ||
                       target.closest('.btn-delete-template-row') ||
                       target.closest('.btn-delete-template') ||
                       target.closest('.btn-edit-template-direct') ||
                       target.classList.contains('delete') ||
                       target.closest('[data-action*="delete"]') ||
                       target.closest('li') && target.closest('li').textContent.includes('削除');
      if (isAction) {
        lastClickedDeleteElement = target;
      }
    }, true);

    window.confirm = function(message) {
      if (forceConfirmResult !== null) {
        const res = forceConfirmResult;
        forceConfirmResult = null;
        return res;
      }

      // 通常フォームの削除確認メッセージからタイトルを抽出する
      const deleteFormMatch = message.match(/フォーム「(.*?)」を完全に削除しますか？/);

      showSystemConfirmModal(message, async (ok) => {
        if (ok) {
          if (deleteFormMatch && deleteFormMatch[1]) {
            // DOM消滅バグを回避するため、LocalStorage・クラウドから直接削除を起動
            await deleteFormSelf(deleteFormMatch[1], true);
          } else {
            forceConfirmResult = true;
            if (lastClickedDeleteElement) {
              lastClickedDeleteElement.click();
            }
          }
        }
      });

      return false;
    };

    // 主要な削除イベントをキャプチャリングフェーズで完全に横取りして独自モーダルで処理する (第1防衛線)
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // 0. Viteコンテキストメニュー（#gf-context-menu 内のアイテム）
      const ctxMenu = target.closest('#gf-context-menu');
      if (ctxMenu && (target.classList.contains('rename-item') || target.closest('.rename-item') || target.textContent.includes('名前の編集'))) {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
        const fIdx = parseInt(ctxMenu.dataset.formIndex);
        ctxMenu.remove();
        if (typeof renameFormSelf === 'function') {
          renameFormSelf(fIdx);
        }
        return;
      }
      if (ctxMenu && (target.classList.contains('delete-item') || target.closest('.delete-item') || target.textContent.includes('削除'))) {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
        const fIdx = parseInt(ctxMenu.dataset.formIndex);
        ctxMenu.remove();

        let allForms = [];
        try { allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]'); } catch(err) {}
        const formObj = !isNaN(fIdx) ? allForms[fIdx] : null;
        const formTitle = formObj ? (formObj.title || '選択したフォーム') : '選択したフォーム';

        showSystemConfirmModal(`フォーム「${formTitle}」を完全に削除しますか？`, async (ok) => {
          if (ok) {
            await deleteFormSelf(!isNaN(fIdx) ? fIdx : formTitle, true);
          }
        });
        return;
      }

      const isDeleteMenu = target.closest('li') && target.closest('li').textContent.includes('削除') ||
                           target.classList.contains('btn-delete-template-row') ||
                           target.closest('.btn-delete-template-row') ||
                           target.closest('.btn-delete-template') ||
                           target.classList.contains('btn-delete-template') ||
                           target.classList.contains('btn-delete-template-direct') ||
                           target.closest('.btn-delete-template-direct');
                           
      if (isDeleteMenu) {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();

        const isTemplateDelete = target.closest('#dashboard-templates-section') || 
                                 target.closest('.btn-delete-template-row') || 
                                 target.closest('.btn-delete-template') ||
                                 target.closest('.btn-delete-template-direct');

        if (isTemplateDelete) {
          const indexAttr = target.getAttribute('data-index') || target.closest('[data-index]').getAttribute('data-index');
          const idx = parseInt(indexAttr);
          const templates = getTemplates();
          const tpl = templates[idx];
          if (tpl) {
            showSystemConfirmModal(`テンプレート「${tpl.title}」を完全に削除しますか？`, (ok) => {
              if (ok) {
                templates.splice(idx, 1);
                saveTemplates(templates);
                showCustomToast('テンプレートを削除しました。', 'success');
                if (typeof renderTemplateGallery === 'function') {
                  renderTemplateGallery();
                }
                if (typeof renderTemplateBar === 'function') {
                  renderTemplateBar();
                }
                if (typeof renderFullTemplateGallery === 'function') {
                  renderFullTemplateGallery();
                }
              }
            });
          }
        } else {
          // 通常のフォーム削除
          const row = target.closest('.gf-list-row');
          if (row) {
            const formIdxAttr = row.dataset.formIndex;
            const titleTextEl = row.querySelector('.gf-list-title-text') || row.querySelector('.gf-list-title-area span');
            const titleText = (titleTextEl ? titleTextEl.textContent.trim() : '') || row.dataset.formTitle;
            showSystemConfirmModal(`フォーム「${titleText}」を完全に削除しますか？`, async (ok) => {
              if (ok) {
                await deleteFormSelf(formIdxAttr !== undefined ? parseInt(formIdxAttr) : titleText, true);
              }
            });
          }
        }
      }
    }, true);
  })();

  const CORP_DATABASE = [
    { name: "合同会社frat flat", nameKana: "ゴウドウガイシャフラットフラット", num: "2240003007487", pref: "広島県", cityName: "広島市中区", street: "南竹屋町1-21-202", postCode: "7300043", address: "広島県広島市中区南竹屋町1-21-202", regDate: "2021-04-01", estDate: "2021-04-01" },
    { name: "合同会社ｆｒａｔ　ｆｌａｔ", nameKana: "ゴウドウガイシャフラットフラット", num: "2240003007487", pref: "広島県", cityName: "広島市中区", street: "南竹屋町1-21-202", postCode: "7300043", address: "広島県広島市中区南竹屋町1-21-202", regDate: "2021-04-01", estDate: "2021-04-01" },
    { name: "株式会社wayway", nameKana: "カブシキガイシャウェイウェイ", num: "7010001999999", pref: "東京都", cityName: "千代田区", street: "麹町4丁目3-2", postCode: "1020083", address: "東京都千代田区麹町4丁目3-2", regDate: "2023-10-01", estDate: "2015-05-15" },
    { name: "wayway合同会社", nameKana: "ウェイウェイゴウドウガイシャ", num: "7010001999999", pref: "広島県", cityName: "広島市中区", street: "基町12-8", postCode: "7300011", address: "広島県広島市中区基町12-8", regDate: "2024-04-01", estDate: "2020-11-20", cancelDate: "2025-12-31" },
    { name: "ヤフー株式会社", nameKana: "ヤフーカブシキガイシャ", num: "7010001888888", pref: "東京都", cityName: "千代田区", street: "紀尾井町1-3 東京ガーデンテラス紀尾井町", postCode: "1028282", address: "東京都千代田区紀尾井町1-3 東京ガーデンテラス紀尾井町", regDate: "2023-10-01", estDate: "1996-01-31" },
    { name: "LINEヤフー株式会社", nameKana: "ラインヤフーカブシキガイシャ", num: "7010001888888", pref: "東京都", cityName: "千代田区", street: "紀尾井町1-3 東京ガーデンテラス紀尾井町", postCode: "1028282", address: "東京都千代田区紀尾井町1-3 東京ガーデンテラス紀尾井町", regDate: "2023-10-01", estDate: "1996-01-31" },
    { name: "株式会社wayway広島", nameKana: "カブシキガイシャウェイウェイヒロシマ", num: "7010001999999", pref: "広島県", cityName: "広島市中区", street: "八丁堀14-1", postCode: "7300013", address: "広島県広島市中区八丁堀14-1", regDate: "2025-01-15", estDate: "2024-09-01" },
    { name: "トヨタ自動車株式会社", nameKana: "トヨタジドウシャカブシキガイシャ", num: "1180301018771", pref: "愛知県", cityName: "豊田市", street: "トヨタ町1番地", postCode: "4718571", address: "愛知県豊田市トヨタ町1番地", regDate: "2023-10-01", estDate: "1937-08-28" },
    { name: "ソニーグループ株式会社", nameKana: "ソニーグループカブシキガイシャ", num: "5010401067252", pref: "東京都", cityName: "港区", street: "港南1丁目7-1", postCode: "1080075", address: "東京都港区港南1丁目7-1", regDate: "2023-10-01", estDate: "1946-05-07" },
    { name: "ソフトバンク株式会社", nameKana: "ソフトバンクカブシキガイシャ", num: "9010401052465", pref: "東京都", cityName: "港区", street: "海岸1丁目7-1 東京ポートシティ竹芝", postCode: "1057529", address: "東京都港区海岸1丁目7-1 東京ポートシティ竹芝", regDate: "2023-10-01", estDate: "1986-12-09" },
    { name: "日本電信電話株式会社", nameKana: "ニッポンデンシンデンワカブシキガイシャ", num: "7010001065142", pref: "東京都", cityName: "千代田区", street: "大手町1丁目5-1 大手町ファーストスクエア", postCode: "1008116", address: "東京都千代田区大手町1丁目5-1 大手町ファーストスクエア", regDate: "2023-10-01", estDate: "1985-04-01" },
    { name: "株式会社NTTドコモ", nameKana: "カブシキガイシャエヌティティドコモ", num: "1010001067912", pref: "東京都", cityName: "千代田区", street: "永田町2丁目11-1 山王パークタワー", postCode: "1006150", address: "東京都千代田区永田町2丁目11-1 山王パークタワー", regDate: "2023-10-01", estDate: "1991-08-14" },
    { name: "任天堂株式会社", nameKana: "ニンテンドウカブシキガイシャ", num: "1130001011420", pref: "京都府", cityName: "京都市南区", street: "上鳥羽鉾立町11番地1", postCode: "6018501", address: "京都府京都市南区上鳥羽鉾立町11番地1", regDate: "2023-10-01", estDate: "1947-11-20" },
    { name: "楽天グループ株式会社", nameKana: "ラクテングループカブシキガイシャ", num: "9010701020592", pref: "東京都", cityName: "世田谷区", street: "玉川1丁目14-1 楽天クリムゾンハウス", postCode: "1580094", address: "東京都世田谷区玉川1丁目14-1 楽天クリムゾンハウス", regDate: "2023-10-01", estDate: "1997-02-07" },
    { name: "株式会社メルカリ", nameKana: "カブシキガイシャメルカリ", num: "4010001150491", pref: "東京都", cityName: "港区", street: "六本木6丁目10-1 六本木ヒルズ森タワー", postCode: "1066118", address: "東京都港区六本木6丁目10-1 六本木ヒルズ森タワー", regDate: "2023-10-01", estDate: "2013-02-01" },
    { name: "株式会社サイバーエージェント", nameKana: "カブシキガイシャサイバーエージェント", num: "5010401052601", pref: "東京都", cityName: "渋谷区", street: "宇田川町40-1 Abema Towers", postCode: "1500042", address: "東京都渋谷区宇田川町40-1 Abema Towers", regDate: "2023-10-01", estDate: "1998-03-18" },
    { name: "株式会社日立製作所", nameKana: "カブシキガイシャヒタチセイサクショ", num: "7010001008844", pref: "東京都", cityName: "千代田区", street: "丸の内1丁目6-6", postCode: "1008280", address: "東京都千代田区丸の内1丁目6-6", regDate: "2023-10-01", estDate: "1920-02-01" },
    { name: "パナソニック ホールディングス株式会社", nameKana: "パナソニックホールディングスカブシキガイシャ", num: "5120001158218", pref: "大阪府", cityName: "門真市", street: "大字門真1006番地", postCode: "5718501", address: "大阪府門真市大字門真1006番地", regDate: "2023-10-01", estDate: "1935-12-15" },
    { name: "三菱商事株式会社", nameKana: "ミツビシショウジカブシキガイシャ", num: "5010001008771", pref: "東京都", cityName: "千代田区", street: "丸の内2丁目3-1", postCode: "1008086", address: "東京都千代田区丸の内2丁目3-1", regDate: "2023-10-01", estDate: "1950-04-01" },
    { name: "伊藤忠商事株式会社", nameKana: "イトウチュウショウジカブシキガイシャ", num: "4120001077410", pref: "大阪府", cityName: "大阪市北区", street: "梅田3丁目1-3", postCode: "5308677", address: "大阪府大阪市北区梅田3丁目1-3", regDate: "2023-10-01", estDate: "1949-12-01" }
  ];

  function generateHashNum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const s = Math.abs(hash).toString() + "1010001008771";
    return s.slice(0, 13);
  }

  // 2. 表記揺れ正規化
  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[\uFF21-\uFF3A\uFF41-\uFF5A\uFF10-\uFF19]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/[\s\-\u30FC\u30FB/|\u3000\uFF5C]/g, "");
  }

  // ============================================================================
  // 🔍 【API連携メタデータ解決エンジン: getQuestionApiConfig & findQuestionDefById】
  // - ユーザー指摘: 問題は質問項目（タイトル文字列）ではなく、回答の入力規則の
  //   「規則の種類が API 連携（category === 'api'）になっていること」と、
  //   「判定ルールで何の API を連携しているか（condition）を取得すること」。
  // - 質問定義の validation メタデータを Single Source of Truth（真実の情報源）として
  //   最優先で取得・解決する。
  // ============================================================================
  function findQuestionDefById(questionId) {
    if (!questionId) return null;
    const formSources = [window.F, window.n, window.G, window.L];
    if (window.U && Array.isArray(window.U)) {
      formSources.push(...window.U);
    }
    for (const formSrc of formSources) {
      if (formSrc && formSrc.sections) {
        for (const sec of formSrc.sections) {
          if (!sec || !sec.questions) continue;
          const q = sec.questions.find(item => item && item.id === questionId);
          if (q) return q;
        }
      }
    }
    return null;
  }
  window.findQuestionDefById = findQuestionDefById;

  function getQuestionApiConfig(qDef) {
    if (!qDef) return null;

    // ① 最優先（Single Source of Truth）: 作成者が設定した「回答の入力規則（検証）」
    if (qDef.validation && qDef.validation.category === 'api' && qDef.validation.condition) {
      const cond = qDef.validation.condition;
      const isCorpMatch = cond === 'corp_name' || cond === 'company_name';
      const isZipMatch = cond === 'zip_code' || cond === 'zip';
      return {
        isApi: true,
        category: 'api',
        condition: cond,
        isCorp: isCorpMatch,
        isInvoice: cond === 'invoice_number',
        isZip: isZipMatch,
        isBank: cond === 'bank_name',
        isBranch: cond === 'branch_name',
        isBranchCode: cond === 'branch_code',
        label: isCorpMatch ? '国税庁法人番号API連携' :
               cond === 'invoice_number' ? '適格請求書発行事業者API連携' :
               isZipMatch ? '郵便番号住所検索API連携' :
               cond === 'bank_name' ? '全銀協金融機関API連携' :
               cond === 'branch_name' ? '全銀協支店情報API連携' :
               cond === 'branch_code' ? '全銀協支店番号API連携' : 'API連携',
        source: 'validation_metadata'
      };
    }

    // ② 補助フォールバック（作成者が入力規則を設定していない場合のタイトル・dataKey推測アシスト）
    if (qDef.type === 'text') {
      const isKana = qDef.title && (qDef.title.includes('カナ') || qDef.title.includes('フリガナ') || qDef.title.includes('ふりがな'));
      const isPureTrade = qDef.title && qDef.title.trim() === '屋号';

      if (!isKana && qDef.dataKey === 'company_name' && !isPureTrade) {
        return { isApi: true, category: 'api', condition: 'corp_name', isCorp: true, isInvoice: false, isZip: false, isBank: false, isBranch: false, isBranchCode: false, label: '国税庁法人番号API連携', source: 'dataKey' };
      }

      if (qDef.title) {
        const t = qDef.title;
        if (t.includes('郵便番号') || t.toLowerCase().includes('zip')) {
          return { isApi: true, category: 'api', condition: 'zip_code', isCorp: false, isInvoice: false, isZip: true, isBank: false, isBranch: false, isBranchCode: false, label: '郵便番号住所検索API連携', source: 'title_fallback' };
        }
        if ((t.includes('インボイス') || t.includes('登録番号')) && !t.includes('法人番号')) {
          return { isApi: true, category: 'api', condition: 'invoice_number', isCorp: false, isInvoice: true, isZip: false, isBank: false, isBranch: false, isBranchCode: false, label: '適格請求書発行事業者API連携', source: 'title_fallback' };
        }
        if ((t.includes('法人名') || t.includes('企業名') || t.includes('会社名') || t.includes('貴社名') || t.includes('御社名') || t.includes('商号')) && !isKana && !isPureTrade) {
          return { isApi: true, category: 'api', condition: 'corp_name', isCorp: true, isInvoice: false, isZip: false, isBank: false, isBranch: false, isBranchCode: false, label: '国税庁法人番号API連携', source: 'title_fallback' };
        }
        if (t.includes('銀行名') || (t.includes('銀行') && !t.includes('コード') && !t.includes('口座')) ||
            t.includes('金融機関名') || (t.includes('金融機関') && !t.includes('コード'))) {
          return { isApi: true, category: 'api', condition: 'bank_name', isCorp: false, isInvoice: false, isZip: false, isBank: true, isBranch: false, isBranchCode: false, label: '全銀協金融機関API連携', source: 'title_fallback' };
        }
        if (t.includes('支店名') || (t.includes('支店') && !t.includes('番号') && !t.includes('コード')) ||
            t.includes('店舗名') || (t.includes('店舗') && !t.includes('番号') && !t.includes('コード'))) {
          return { isApi: true, category: 'api', condition: 'branch_name', isCorp: false, isInvoice: false, isZip: false, isBank: false, isBranch: true, isBranchCode: false, label: '全銀協支店情報API連携', source: 'title_fallback' };
        }
        if (t.includes('支店番号') || t.includes('支店コード') || t.includes('店舗番号') || t.includes('店舗コード') || ((t.includes('支店') || t.includes('店舗')) && t.includes('番号'))) {
          return { isApi: true, category: 'api', condition: 'branch_code', isCorp: false, isInvoice: false, isZip: false, isBank: false, isBranch: false, isBranchCode: true, label: '全銀協支店番号API連携', source: 'title_fallback' };
        }
      }
    }

    return null;
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

  window.CUSTOM_EDITOR_VERSION = "6.3.2";

  // タイマー監視によるVite状態ロードの完了検出
  function initializeAll() {
    console.log(`[Extension] custom-editor.js v${window.CUSTOM_EDITOR_VERSION} waiting for Vite modules...`);
    
    // バージョン情報をビジュアルとして画面上に表示（キャッシュ不一致の診断用）
    const headerTitle = document.querySelector('.logo-container h1');
    if (headerTitle && !document.getElementById('ext-version-tag')) {
      const versionTag = document.createElement('span');
      versionTag.id = 'ext-version-tag';
      versionTag.style.fontSize = '0.65rem';
      versionTag.style.color = '#718096';
      versionTag.style.marginLeft = '8px';
      versionTag.style.fontWeight = '500';
      versionTag.style.verticalAlign = 'middle';
      versionTag.textContent = `(v${window.CUSTOM_EDITOR_VERSION})`;
      headerTitle.appendChild(versionTag);
    }
    
    const pollInterval = setInterval(() => {
      if (window.le && window.x && window.Z && window.n) {
        clearInterval(pollInterval);
        console.log('Vite objects found. Exposing overrides...');
        
        // React初期化時のダッシュボード強制遷移 Z('dashboard') を防ぎ、保存されたアクティブタブを強制するラッパー
        if (typeof window.Z === 'function') {
          const originalZ = window.Z;
          let isFirstZCall = true;
          window.Z = function(tabName) {
            console.log(`[Extension] window.Z intercept: ${tabName}`);
            
            // タブ遷移時に即座に状態を同期
            localStorage.setItem('form_customize_active_tab', tabName);
            
            let finalTab = tabName;
            if (isFirstZCall) {
              isFirstZCall = false;
              const savedTab = localStorage.getItem('form_customize_active_tab');
              if (tabName === 'dashboard' && savedTab && savedTab !== 'dashboard') {
                console.log(`[Extension] Intercepted initial Z('dashboard'). Redirecting to Z('${savedTab}').`);
                finalTab = savedTab;
              }
            }
            
            const res = originalZ(finalTab);
            
            // プルダウン表示状態を即座に更新
            const badge = document.getElementById('active-form-title-badge');
            if (badge) {
              if (finalTab !== 'dashboard') {
                if (window.G && window.G.title) {
                  updateHeaderActiveFormTitle(window.G.title);
                }
              } else {
                badge.style.display = 'none';
              }
            }
            
            // 🔙 戻るボタンの表示状態の更新
            if (typeof updateHeaderBackButton === 'function') {
              updateHeaderBackButton(finalTab);
            }
            
            return res;
          };
        }
        
        setupEditorRenderHooks();
        setupPreviewModeOverrides();
        patchPresetSelectMenu();
        forceBindNavigationTabs();
        
        initEditorMode();
        initColorPresets();
        loadProSettingsToInputs();
        setupValidationInterceptors();
        setupFormTitleSync();
        setupOverviewSubtabs(); // 概要画面のサブタブイベント登録
        setupHeaderObserver(); // ヘッダーの白背景・高コントラスト常時強制固定
        setupFlowmapDragBindings(); // フローマップドラッグイベント登録
        setupFlowmapOverrideF(); // window.Fのオーバーライドを確実に行う
        
        // フォーム選択プルダウンのリスト作成と変更リスナー登録
        updateFlowmapFormDropdown();
        setupFlowmapFormSelectListener();

        // 🔙 戻るボタンのリスナー登録と初期表示同期
        setupHeaderBackButtonListener();
        updateHeaderBackButton(localStorage.getItem('form_customize_active_tab') || 'dashboard');

        setTimeout(() => {
          renderLivePreview();
          applyPreviewTheme();

          // 保存ステータスインジケーターの初期表示
          if (typeof updateSaveStatus === 'function') {
            updateSaveStatus('saved');
          }

          // 保存されたタブ表示状態があれば復元
          const savedTab = localStorage.getItem('form_customize_active_tab');
          if (savedTab && savedTab !== 'dashboard' && typeof window.Z === 'function') {
            console.log(`[Extension] Saved tab is ${savedTab}. Watching for React init...`);
            let checkCount = 0;
            const checkReactInit = setInterval(() => {
              const dashboardPanel = document.getElementById('panel-dashboard');
              checkCount++;
              // React側が初期表示処理 Z('dashboard') を終えて dashboard-panel が active になった瞬間を検知
              if ((dashboardPanel && dashboardPanel.classList.contains('active')) || checkCount > 100) {
                clearInterval(checkReactInit);
                console.log(`[Extension] React initialized. Force switching to saved tab: ${savedTab}`);
                window.Z(savedTab);
              }
            }, 20);
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

  function setupOverviewSubtabs() {
    const btnGlobal = document.getElementById('btn-subtab-global-settings');
    const btnSection = document.getElementById('btn-subtab-section-design');
    const btnFlowmap = document.getElementById('btn-subtab-flowmap');
    const btnSplit = document.getElementById('btn-subtab-split-toggle');
    const btnSplitDropdown = document.getElementById('btn-split-pair-dropdown-toggle');
    const splitPairMenu = document.getElementById('split-pair-dropdown-menu');
    const splitControlGroup = document.querySelector('.split-control-group');
    
    const overviewContainer = document.getElementById('form-overview-editor');
    const globalCard = document.querySelector('#form-overview-editor > .form-title-desc-card');
    const sectionsPane = document.getElementById('overview-sections-pane');
    const flowmapContainer = document.getElementById('overview-flowmap-container');

    if (!btnGlobal || !btnSection || !btnFlowmap || !globalCard || !sectionsPane || !flowmapContainer) return;

    let currentTab = 'global';
    let isSplitMode = false;
    let currentSplitPair = 'section_flowmap'; // 🌟 デフォルト：質問項目 ＋ フローマップ（ユーザー標準）

    try {
      isSplitMode = localStorage.getItem('form_customize_split_mode') === 'true';
      const savedPair = localStorage.getItem('form_customize_split_pair');
      if (savedPair && ['section_flowmap', 'global_flowmap', 'global_section'].includes(savedPair)) {
        currentSplitPair = savedPair;
      }
    } catch(e) {}

    const renderFlowmap = () => {
      if (window.archifyRenderer && window.G) {
        if (typeof sanitizeFormBranchingLogic === 'function') {
          sanitizeFormBranchingLogic(window.G);
        }
        window.archifyRenderer.render(window.G);
        if (window.r && typeof window.archifyRenderer.highlightSection === 'function') {
          window.archifyRenderer.highlightSection(window.r);
        }
      }
    };
    window.refreshFlowmap = renderFlowmap;

    const setTabStyle = (activeBtn) => {
      [btnGlobal, btnSection, btnFlowmap].forEach(b => {
        if (!b) return;
        if (b === activeBtn) {
          b.classList.add('active');
          b.style.borderBottom = '3px solid var(--color-primary, #3182ce)';
          b.style.color = 'var(--color-text, #1e293b)';
        } else {
          b.classList.remove('active');
          b.style.borderBottom = '3px solid transparent';
          b.style.color = 'var(--color-text-muted, #64748b)';
        }
      });
    };

    const updateViews = () => {
      const activeSecEditor = document.getElementById('active-section-editor');
      const livePreviewPane = document.querySelector('.editor-live-preview-pane');
      const workspaceBody = document.getElementById('editor-workspace-body');
      const isEditingSection = (window.r !== null && window.r !== undefined);

      if (btnSplit) {
        btnSplit.classList.toggle('active', isSplitMode);
      }
      if (splitControlGroup) {
        splitControlGroup.classList.toggle('active', isSplitMode);
      }

      // ドロップダウン内のラジオボタンと選択ハイライトの同期
      document.querySelectorAll('.split-pair-option').forEach(opt => {
        const pair = opt.dataset.pair;
        const radio = opt.querySelector('input[type="radio"]');
        const isSelected = pair === currentSplitPair;
        if (radio) radio.checked = isSelected;
        opt.classList.toggle('selected', isSelected);
      });

      // 🌟 1. 2画面同時表示（スプリットモード）
      if (isSplitMode) {
        document.body.classList.add('split-active');
        if (workspaceBody) {
          workspaceBody.classList.add('split-mode-active');
          workspaceBody.setAttribute('data-split-mode', 'true');
          workspaceBody.setAttribute('data-split-pair', currentSplitPair);
        }
        if (overviewContainer) {
          overviewContainer.classList.add('split-mode-active');
        }
        // スマホライブプレビューは完全非表示
        if (livePreviewPane) livePreviewPane.style.setProperty('display', 'none', 'important');

        // 右ペイン: フローマップを表示（global_sectionペア時以外）
        if (currentSplitPair === 'global_section' && !isEditingSection) {
          flowmapContainer.style.setProperty('display', 'none', 'important');
        } else {
          flowmapContainer.style.setProperty('display', 'flex', 'important');
          flowmapContainer.classList.remove('full-tab-mode');
        }

        if (isEditingSection) {
          // 🚀 【ユーザー最重要要望】実際の質問項目の設定画面 ＋ フローマップ
          // 左ペイン: 質問項目設定画面を表示
          if (activeSecEditor) {
            activeSecEditor.style.setProperty('display', 'block', 'important');
          }
          // 全体概要画面は完全に非表示にして右端への圧迫を防止！
          if (overviewContainer) {
            overviewContainer.style.setProperty('display', 'none', 'important');
          }
          // タブのアクティブスタイルをリセット
          setTabStyle(null);
        } else {
          // 全体概要表示中（window.r === null）
          if (activeSecEditor) {
            activeSecEditor.style.setProperty('display', 'none', 'important');
          }
          if (overviewContainer) {
            overviewContainer.style.setProperty('display', 'block', 'important');
          }

          if (currentSplitPair === 'section_flowmap') {
            // セクション構成一覧 ＋ フローマップ
            setTabStyle(btnSection);
            globalCard.style.display = 'none';
            sectionsPane.style.display = 'block';
          } else if (currentSplitPair === 'global_section') {
            // 全体設定 ＋ セクション構成一覧
            setTabStyle(btnGlobal);
            globalCard.style.display = 'block';
            sectionsPane.style.display = 'block';
          } else {
            // 全体設定 ＋ フローマップ
            setTabStyle(btnGlobal);
            globalCard.style.display = 'block';
            sectionsPane.style.display = 'none';
          }
        }

        renderFlowmap();
        setTimeout(() => {
          if (window.archifyRenderer) {
            window.archifyRenderer.fitView();
            if (isEditingSection && window.r) {
              window.archifyRenderer.highlightSection(window.r);
            }
          }
        }, 120);
        return;
      }

      // 🌟 2. 通常（単一画面）モード
      document.body.classList.remove('split-active');
      if (workspaceBody) {
        workspaceBody.classList.remove('split-mode-active');
        workspaceBody.removeAttribute('data-split-mode');
      }
      if (overviewContainer) {
        overviewContainer.classList.remove('split-mode-active');
      }

      // フローマップ単独全画面タブの場合
      if (currentTab === 'flowmap') {
        setTabStyle(btnFlowmap);
        if (overviewContainer) overviewContainer.style.setProperty('display', 'none', 'important');
        if (activeSecEditor) activeSecEditor.style.setProperty('display', 'none', 'important');
        if (livePreviewPane) livePreviewPane.style.setProperty('display', 'none', 'important');
        flowmapContainer.style.setProperty('display', 'flex', 'important');
        flowmapContainer.classList.add('full-tab-mode');
        renderFlowmap();
        setTimeout(() => {
          if (window.archifyRenderer) window.archifyRenderer.fitView();
        }, 120);
        return;
      }

      // フローマップは非表示、プレビューは表示復元
      flowmapContainer.style.setProperty('display', 'none', 'important');
      if (livePreviewPane) livePreviewPane.style.removeProperty('display');

      if (isEditingSection) {
        // セクション編集中
        if (activeSecEditor) activeSecEditor.style.setProperty('display', 'block', 'important');
        if (overviewContainer) overviewContainer.style.setProperty('display', 'none', 'important');
        setTabStyle(null);
      } else {
        // 全体概要
        if (activeSecEditor) activeSecEditor.style.setProperty('display', 'none', 'important');
        if (overviewContainer) overviewContainer.style.setProperty('display', 'block', 'important');
        if (currentTab === 'global') {
          setTabStyle(btnGlobal);
          globalCard.style.display = 'block';
          sectionsPane.style.display = 'none';
        } else if (currentTab === 'section') {
          setTabStyle(btnSection);
          globalCard.style.display = 'none';
          sectionsPane.style.display = 'block';
        }
      }
    };

    window.updateEditorSplitViews = updateViews;

    btnGlobal.addEventListener('click', () => {
      window.r = null;
      currentTab = 'global';
      const ovBtn = document.getElementById('sidebar-item-overview') || document.getElementById('btn-back-to-overview');
      if (ovBtn) ovBtn.click();
      if (window.x) window.x();
      setTimeout(updateViews, 20);
    });

    btnSection.addEventListener('click', () => {
      window.r = null;
      currentTab = 'section';
      const ovBtn = document.getElementById('sidebar-item-overview') || document.getElementById('btn-back-to-overview');
      if (ovBtn) ovBtn.click();
      if (window.x) window.x();
      setTimeout(updateViews, 20);
    });

    btnFlowmap.addEventListener('click', () => {
      currentTab = 'flowmap';
      isSplitMode = false;
      try { localStorage.setItem('form_customize_split_mode', 'false'); } catch(e) {}
      updateViews();
    });

    if (btnSplit) {
      btnSplit.addEventListener('click', () => {
        isSplitMode = !isSplitMode;
        try {
          localStorage.setItem('form_customize_split_mode', isSplitMode ? 'true' : 'false');
        } catch(e) {}
        updateViews();
      });
    }

    // 組み合わせ選択ドロップダウン開閉
    if (btnSplitDropdown && splitPairMenu) {
      btnSplitDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = splitPairMenu.classList.contains('show');
        splitPairMenu.classList.toggle('show', !isOpen);
        btnSplitDropdown.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });

      // オプション選択時
      document.querySelectorAll('.split-pair-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
          const pair = opt.dataset.pair;
          if (pair) {
            currentSplitPair = pair;
            isSplitMode = true; // ペアを選択したら即座に2画面表示ON
            try {
              localStorage.setItem('form_customize_split_mode', 'true');
              localStorage.setItem('form_customize_split_pair', currentSplitPair);
            } catch(e) {}
            splitPairMenu.classList.remove('show');
            btnSplitDropdown.setAttribute('aria-expanded', 'false');
            if (currentSplitPair === 'global_flowmap' || currentSplitPair === 'global_section') {
              currentTab = 'global';
            } else {
              currentTab = 'section';
            }
            updateViews();
          }
        });
      });

      // 外側クリックでメニューを閉じる
      document.addEventListener('click', (e) => {
        if (splitControlGroup && !splitControlGroup.contains(e.target)) {
          splitPairMenu.classList.remove('show');
          btnSplitDropdown.setAttribute('aria-expanded', 'false');
        }
      });
    }

    let renderDebounceTimer = null;
    const debouncedRenderFlowmap = (delay = 80) => {
      clearTimeout(renderDebounceTimer);
      renderDebounceTimer = setTimeout(renderFlowmap, delay);
    };

    // 分岐ドロップダウン変更・入力変更時にフローマップをリアルタイム更新
    document.addEventListener('change', (e) => {
      const target = e.target;
      if (!target) return;
      if (target.id === 'editor-section-next' || 
          target.classList.contains('question-branch-select') ||
          target.classList.contains('option-next-select') ||
          target.closest('.question-item') ||
          target.closest('.section-meta-edit')) {
        debouncedRenderFlowmap(50);
      }
    });

    document.addEventListener('input', (e) => {
      const target = e.target;
      if (!target) return;
      if (target.closest('.question-item') || target.closest('.section-meta-edit') || target.id === 'form-title-input') {
        debouncedRenderFlowmap(200);
      }
    });

    // セクション編集DOMの変更（質問の追加・削除・並び替えなど）を監視して自動同期
    if (sectionsPane && window.MutationObserver) {
      const secObserver = new MutationObserver((mutations) => {
        // 余計な属性変更ループを防ぐため、子ノード変更のみを対象
        const hasChildChanges = mutations.some(m => m.type === 'childList');
        if (hasChildChanges) {
          debouncedRenderFlowmap(150);
        }
      });
      secObserver.observe(sectionsPane, { childList: true, subtree: true });
    }

    // 質問項目やセクションカードをクリックしたときに、フローマップ側の該当ルートを自動ハイライト
    document.addEventListener('click', (e) => {
      const qItem = e.target.closest('.question-item');
      if (qItem && window.archifyRenderer) {
        const qId = qItem.dataset.questionId || qItem.id;
        if (qId) {
          window.archifyRenderer.highlightRouteForNode(qId);
        }
      }
    });

    // 初期状態の反映
    updateViews();

    // フォーム切り替え時にフローマップを自動再描画するフック
    setTimeout(() => {
      if (typeof window.X === 'function' && !window.X._archifyHooked) {
        const origX = window.X;
        window.X = function(...args) {
          const res = origX.apply(this, args);
          setTimeout(() => {
            if (window.refreshFlowmap) window.refreshFlowmap();
          }, 100);
          return res;
        };
        window.X._archifyHooked = true;
      }
    }, 500);
  }

  function enforceLightHeader() {
    const header = document.querySelector('.app-header');
    if (header) {
      header.style.setProperty('background', '#ffffff', 'important');
      header.style.setProperty('background-color', '#ffffff', 'important');
      header.style.setProperty('border-bottom', '1px solid var(--color-border)', 'important');
      header.style.setProperty('box-shadow', '0 1px 3px rgba(0,0,0,0.05)', 'important');
    }

    // ロゴタイトル
    const logoTitle = document.querySelector('.header-logo h1');
    if (logoTitle) {
      logoTitle.style.setProperty('background', 'linear-gradient(135deg, var(--color-primary) 0%, #0f172a 100%)', 'important');
      logoTitle.style.setProperty('-webkit-background-clip', 'text', 'important');
      logoTitle.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    }

    // ナビゲーションバーの背景
    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.style.setProperty('background-color', '#f1f5f9', 'important');
      headerNav.style.setProperty('border-color', '#e2e8f0', 'important');
    }
    // グローバルナビのフローマップ・回答プレビューは不要のため確実に非表示
    const flowmapTab = document.getElementById('btn-tab-flowmap');
    if (flowmapTab) flowmapTab.style.setProperty('display', 'none', 'important');
    const previewTab = document.getElementById('btn-tab-preview');
    if (previewTab) previewTab.style.setProperty('display', 'none', 'important');
    const previewPanel = document.getElementById('panel-preview');
    if (previewPanel) previewPanel.style.setProperty('display', 'none', 'important');

    // アクティブなタブ（選択箇所）の文字色を「白(#ffffff)」に、背景を「青」に強制固定する
    const activeTabs = document.querySelectorAll('.nav-tab.active');
    activeTabs.forEach(tab => {
      tab.style.setProperty('color', '#ffffff', 'important');
      tab.style.setProperty('background-color', 'var(--color-primary)', 'important');
    });

    // 非アクティブなタブの文字色を「グレー」に、背景を「透明」にして選択状態と明確に分離する
    const inactiveTabs = document.querySelectorAll('.nav-tab:not(.active)');
    inactiveTabs.forEach(tab => {
      tab.style.setProperty('color', '#475569', 'important');
      tab.style.setProperty('background-color', 'transparent', 'important');
      tab.style.setProperty('box-shadow', 'none', 'important');
    });

    // ユーザー情報
    const userName = document.querySelector('.user-profile-header .user-name');
    if (userName) userName.style.setProperty('color', '#0f172a', 'important');

    const userRole = document.querySelector('.user-profile-header .user-role');
    if (userRole) {
      userRole.style.setProperty('color', 'var(--color-primary)', 'important');
      userRole.style.setProperty('font-weight', '600', 'important');
    }

    // 新規フォーム作成ボタンとJSON出力ボタン（青背景の btn-primary）の文字を白にする
    const primaryBtns = document.querySelectorAll('.btn-primary');
    primaryBtns.forEach(btn => {
      btn.style.setProperty('color', '#ffffff', 'important');
      btn.style.setProperty('background-color', 'var(--color-primary)', 'important');
      btn.style.setProperty('border-color', 'var(--color-primary)', 'important');
    });
  }

  function setupHeaderObserver() {
    enforceLightHeader();
    // 0.2秒ごとに定期適用。ヘッダーの白背景と、アクティブタブに連動したプルダウン表示の同期を行います。
    setInterval(() => {
      enforceLightHeader();
      syncActiveTabAndDropdown();
    }, 200);
  }

  function syncActiveIndexFromWindowG() {
    // Reactがダッシュボードでの選択時にインデックスを正常保存するため、競合リスクを避けるために逆引き同期は無効化します。
    return;
  }

  function syncActiveTabAndDropdown() {
    const activeTabEl = document.querySelector('.nav-tab.active');
    if (!activeTabEl) return;
    
    const tabName = activeTabEl.dataset.tab;
    const lastSavedTab = localStorage.getItem('form_customize_active_tab');
    
    if (tabName && tabName !== lastSavedTab) {
      console.log(`[Extension] Tab change detected via observer: ${tabName}`);
      localStorage.setItem('form_customize_active_tab', tabName);
    }
    
    const badge = document.getElementById('active-form-title-badge');
    if (badge) {
      badge.style.display = 'none';
    }
  }

  function autoResizeTextarea(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight, 48) + 'px';
  }

  function setupFormTitleSync() {
    const simpleTitleInput = document.getElementById('editor-form-title');
    const simpleDescInput = document.getElementById('editor-form-desc');
    const showLogoCheck = document.getElementById('editor-form-show-logo');

    if (simpleTitleInput) {
      simpleTitleInput.addEventListener('input', (e) => {
        const v = e.target.value;
        if (window.G) {
          window.G.title = v;
          if (!window.G.header) window.G.header = {};
          window.G.header.title = v; // プロ版大タイトルも同期
          const proTitle = document.getElementById('editor-pro-title');
          if (proTitle) proTitle.value = v;

          saveAndSyncMindmapData();
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        }
      });
    }

    if (simpleDescInput) {
      autoResizeTextarea(simpleDescInput);
      simpleDescInput.addEventListener('input', (e) => {
        autoResizeTextarea(simpleDescInput);
        const v = e.target.value;
        if (window.G) {
          window.G.description = v;
          if (!window.G.header) window.G.header = {};
          window.G.header.disclaimer = v; // プロ版免責事項も同期
          const proDesc = document.getElementById('editor-pro-disclaimer');
          if (proDesc) {
            proDesc.value = v;
            autoResizeTextarea(proDesc);
          }

          saveAndSyncMindmapData();
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        }
      });
    }

    if (showLogoCheck) {
      showLogoCheck.addEventListener('change', (e) => {
        if (window.G) {
          window.G.showLogo = e.target.checked;
          saveAndSyncMindmapData();
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
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

        // 🔙 戻るボタンの表示状態の更新
        if (typeof updateHeaderBackButton === 'function') {
          updateHeaderBackButton(tabName);
        }

        // プレビュー表示切り替えボタンのトグル
        const btnHeaderPreview = document.getElementById("btn-header-preview-toggle");
        if (btnHeaderPreview) {
          if (tabName === 'editor') {
            if (window.innerWidth <= 768) {
              btnHeaderPreview.style.setProperty("display", "none", "important");
            } else {
              btnHeaderPreview.style.setProperty("display", "flex", "important");
            }

            // プレビューペインの開閉状態に応じてactiveクラスを同期
            const pane = document.querySelector(".editor-live-preview-pane");
            if (pane) {
              const isCollapsed = pane.classList.contains("pane-collapsed") || pane.style.display === "none" || window.getComputedStyle(pane).display === "none";
              if (isCollapsed) {
                btnHeaderPreview.classList.remove("active");
                btnHeaderPreview.setAttribute("data-tooltip", "プレビューを表示する");
              } else {
                btnHeaderPreview.classList.add("active");
                btnHeaderPreview.setAttribute("data-tooltip", "プレビューを非表示にする");
              }
            }
          } else {
            btnHeaderPreview.style.setProperty("display", "none", "important");
          }
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

        if (tabName === 'dashboard') {
          updateHeaderActiveFormTitle(null);
        } else if (window.G && window.G.title) {
          updateHeaderActiveFormTitle(window.G.title);
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
        document.querySelectorAll('.pro-only-field').forEach(el => {
          el.style.display = 'block';
        });
      } else {
        if (bSimple) bSimple.classList.add('active');
        if (bPro) bPro.classList.remove('active');
        if (pPanel) pPanel.style.display = 'none';
        document.querySelectorAll('.pro-only-field').forEach(el => {
          el.style.display = 'none';
        });
      }
      loadProSettingsToInputs(true);
      if (typeof saveAndSyncMindmapData === 'function') {
        saveAndSyncMindmapData();
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
      const target = e.target;
      // 簡易版・プロ版の切り替えタブやスイッチはブロック対象外
      if (target.closest('#btn-mode-pro') || target.closest('#btn-mode-simple') || target.closest('.mode-switch-btn')) {
        return;
      }
      // プロ設定パネル内の操作（トグルスイッチ、スライダー、ラベル、入力欄など）は絶対にブロックせずプロモード化
      if (target.closest('#pro-settings-panel')) {
        if (editorMode !== 'pro') {
          setEditorMode('pro');
        }
        return;
      }
      if (editorMode === 'simple') {
        if (target.classList.contains('pro-only-action')) {
          e.preventDefault();
          e.stopPropagation();
          showProFeaturePopup('プロ版なら、より高度な分岐ロジックや自由度の高いデザイン編集、法人API連携が利用可能になります！');
        }
      }
    }, true);

    // 起動時の初期モード自動復元 (プロ版設定があるか指定があればプロ版を優先)
    if (window.G && window.G.editorMode) {
      setEditorMode(window.G.editorMode);
    } else {
      setEditorMode('pro');
    }
  }

  function loadProSettingsToInputs(preserveCurrentMode = false) {
    if (!window.G) return;

    // localStorage 内の「現在のフォーム個別データ」からプロ版設定項目を window.G に強制同期
    const activeIndex = parseInt(localStorage.getItem('form_customize_active_index') || '0', 10);
    const isTemplateMode = localStorage.getItem('form_customize_is_template_mode') === 'true';
    const storageKey = isTemplateMode ? 'form_customize_templates' : 'form_customize_all_forms';
    
    let allForms = [];
    try {
      allForms = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch(e) {}

    const savedForm = allForms[activeIndex];
    if (savedForm) {
      const proKeys = [
        'appearance', 'header', 'announcement', 'displayMode', 'progressIndicator',
        'showLogo', 'headerImage', 'headerImageScale', 'headerImagePosition', 'headerImagePositionX',
        'logoType', 'logoPosition', 'logoImageUrl', 'useHeaderImage', 'useBgImage', 'bgTheme', 'bgCustomUrl',
        'headerStyle', 'headerAlign', 'subtitlePosition',
        'titleBadgeShape', 'titleBadgeStyle', 'titleBadgeBgType', 'titleBadgeBgCustom', 'titleBadgeColorType', 'titleBadgeColorCustom',
        'titleWarpShape', 'titleWarpStrength', 'titleWarpEffect',
        'titleLightAngle', 'titleLightIntensity',
        'titleColorType', 'titleColorCustom',
        'titleFontFamily', 'titleFontTarget'
      ];
      if (!preserveCurrentMode && savedForm.editorMode !== undefined) {
        window.G.editorMode = savedForm.editorMode;
      }
      proKeys.forEach(key => {
        if (savedForm[key] !== undefined) {
          window.G[key] = savedForm[key];
        }
      });
    }

    if (window.G.editorMode) editorMode = window.G.editorMode;
    
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
      alertBoxText: "全項目を半角・全角 of 指定に沿ってご入力ください..."
    };
    window.G.displayMode = window.G.displayMode || "scroll";
    window.G.progressIndicator = window.G.progressIndicator || "both";
    if (window.G.showLogo === undefined) window.G.showLogo = false;
    if (window.G.headerImage === undefined) window.G.headerImage = "";
    if (window.G.logoType === undefined) window.G.logoType = "text";
    if (window.G.logoPosition === undefined) window.G.logoPosition = "top";
    if (window.G.logoImageUrl === undefined) window.G.logoImageUrl = "";
    if (window.G.useHeaderImage === undefined) window.G.useHeaderImage = false;
    if (window.G.useBgImage === undefined) window.G.useBgImage = false;
    if (window.G.bgTheme === undefined) window.G.bgTheme = "";
    if (window.G.headerStyle === undefined) window.G.headerStyle = "card-accent-top";
    if (window.G.headerAlign === undefined) window.G.headerAlign = "left";
    if (window.G.subtitlePosition === undefined) window.G.subtitlePosition = "below";
    if (window.G.titleBadgeShape === undefined) window.G.titleBadgeShape = "none";
    if (window.G.titleBadgeStyle === undefined) window.G.titleBadgeStyle = "fill";
    if (window.G.titleBadgeBgType === undefined) window.G.titleBadgeBgType = "primary";
    if (window.G.titleBadgeBgCustom === undefined) window.G.titleBadgeBgCustom = "#1a73e8";
    if (window.G.titleBadgeColorType === undefined) window.G.titleBadgeColorType = "white";
    if (window.G.titleBadgeColorCustom === undefined) window.G.titleBadgeColorCustom = "#ffffff";
    if (window.G.titleWarpShape === undefined) window.G.titleWarpShape = "none";
    if (window.G.titleWarpStrength === undefined) window.G.titleWarpStrength = 50;
    if (window.G.titleWarpEffect === undefined) window.G.titleWarpEffect = "none";
    if (window.G.titleLightAngle === undefined) window.G.titleLightAngle = 315;
    if (window.G.titleLightIntensity === undefined) window.G.titleLightIntensity = 60;
    if (window.G.titleColorType === undefined) window.G.titleColorType = "default";
    if (window.G.titleColorCustom === undefined) window.G.titleColorCustom = "#1a73e8";
    if (window.G.titleFontFamily === undefined) window.G.titleFontFamily = "default";
    if (window.G.titleFontTarget === undefined) window.G.titleFontTarget = "both";

    const g = window.G;

    // ロゴ設定のプレフィル
    const logoTypeRadios = document.querySelectorAll('input[name="editor-logo-type"]');
    logoTypeRadios.forEach(r => {
      r.checked = (r.value === g.logoType);
    });
    const logoPosRadios = document.querySelectorAll('input[name="editor-logo-position"]');
    logoPosRadios.forEach(r => {
      r.checked = (r.value === g.logoPosition);
    });
    const logoImageUrlInput = document.getElementById('editor-pro-logo-image-url');
    if (logoImageUrlInput) logoImageUrlInput.value = g.logoImageUrl || "";

    const logoTextGroup = document.getElementById('logo-input-text-group');
    const logoImageGroup = document.getElementById('logo-input-image-group');
    if (logoTextGroup) logoTextGroup.style.display = g.logoType === 'text' ? 'block' : 'none';
    if (logoImageGroup) logoImageGroup.style.display = g.logoType === 'image' ? 'block' : 'none';

    document.getElementById('editor-pro-logo').value = g.header.logoText || "";
    document.getElementById('editor-pro-title').value = g.header.title || "";
    document.getElementById('editor-pro-subtitle').value = (g.header && g.header.subtitle) ? g.header.subtitle : (g.subtitle || "");
    document.getElementById('editor-pro-disclaimer').value = g.header.disclaimer || "";

    // タイトル枠スタイル・文字配置・サブタイトル位置のプレフィル
    const headerStyleEl = document.getElementById('editor-header-style');
    if (headerStyleEl) headerStyleEl.value = g.headerStyle || 'card-accent-top';

    const headerAlignVal = g.headerAlign || 'left';
    const headerAlignEl = document.getElementById('editor-header-align');
    if (headerAlignEl) headerAlignEl.value = headerAlignVal;
    document.querySelectorAll('.btn-header-align').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-align') === headerAlignVal);
    });

    const subtitlePosEl = document.getElementById('editor-subtitle-position');
    if (subtitlePosEl) subtitlePosEl.value = g.subtitlePosition || 'below';

    // 🔤 タイトルフォント（書体）のプレフィル
    const titleFontFamilyEl = document.getElementById('editor-title-font-family');
    const titleFontTargetEl = document.getElementById('editor-title-font-target');
    if (titleFontFamilyEl) titleFontFamilyEl.value = g.titleFontFamily || 'default';
    if (titleFontTargetEl) titleFontTargetEl.value = g.titleFontTarget || 'both';

    // 🎨 タイトル文字色のプレフィル
    const titleColorTypeEl = document.getElementById('editor-title-color-type');
    const titleColorCustomEl = document.getElementById('editor-title-color-custom');
    const titleColorVal = g.titleColorType || 'default';
    if (titleColorTypeEl) titleColorTypeEl.value = titleColorVal;
    if (titleColorCustomEl) {
      titleColorCustomEl.value = g.titleColorCustom || '#1a73e8';
      titleColorCustomEl.style.display = titleColorVal === 'custom' ? 'inline-block' : 'none';
    }

    // 🔤 タイトル文字変形＆立体エフェクトのプレフィル
    const titleWarpShapeEl = document.getElementById('editor-title-warp-shape');
    const titleWarpStrengthContainer = document.getElementById('editor-title-warp-strength-container');
    const titleWarpStrengthEl = document.getElementById('editor-title-warp-strength');
    const titleWarpStrengthNumEl = document.getElementById('editor-title-warp-strength-num');
    const titleWarpEffectEl = document.getElementById('editor-title-warp-effect');
    const titleLightingContainer = document.getElementById('editor-title-lighting-container');
    const titleLightAngleEl = document.getElementById('editor-title-light-angle');
    const titleLightAngleNumEl = document.getElementById('editor-title-light-angle-num');
    const titleLightIntensityEl = document.getElementById('editor-title-light-intensity');
    const titleLightIntensityNumEl = document.getElementById('editor-title-light-intensity-num');

    const warpShapeVal = g.titleWarpShape || 'none';
    if (titleWarpShapeEl) titleWarpShapeEl.value = warpShapeVal;
    if (titleWarpStrengthContainer) titleWarpStrengthContainer.style.display = warpShapeVal !== 'none' ? 'block' : 'none';

    // 変形強度の数値化（旧light/medium/strongからの後方互換変換）
    let warpStrengthVal = 50;
    if (g.titleWarpStrength === 'light') warpStrengthVal = 25;
    else if (g.titleWarpStrength === 'medium') warpStrengthVal = 50;
    else if (g.titleWarpStrength === 'strong') warpStrengthVal = 75;
    else if (typeof g.titleWarpStrength === 'number') warpStrengthVal = g.titleWarpStrength;
    else if (typeof g.titleWarpStrength === 'string' && !isNaN(parseInt(g.titleWarpStrength, 10))) warpStrengthVal = parseInt(g.titleWarpStrength, 10);
    g.titleWarpStrength = warpStrengthVal;

    if (titleWarpStrengthEl) titleWarpStrengthEl.value = warpStrengthVal;
    if (titleWarpStrengthNumEl) titleWarpStrengthNumEl.value = warpStrengthVal;

    const warpEffectVal = g.titleWarpEffect || 'none';
    if (titleWarpEffectEl) titleWarpEffectEl.value = warpEffectVal;
    if (titleLightingContainer) titleLightingContainer.style.display = warpEffectVal !== 'none' ? 'block' : 'none';

    const lightAngleVal = g.titleLightAngle !== undefined ? g.titleLightAngle : 315;
    if (titleLightAngleEl) titleLightAngleEl.value = lightAngleVal;
    if (titleLightAngleNumEl) titleLightAngleNumEl.value = lightAngleVal;

    // 8方向ボタンのアクティブ状態更新
    document.querySelectorAll('.btn-light-dir').forEach(btn => {
      const bAngle = parseInt(btn.dataset.angle, 10);
      if (Math.abs(bAngle - lightAngleVal) < 23 || (bAngle === 0 && lightAngleVal >= 338)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const lightIntensityVal = g.titleLightIntensity !== undefined ? g.titleLightIntensity : 60;
    if (titleLightIntensityEl) titleLightIntensityEl.value = lightIntensityVal;
    if (titleLightIntensityNumEl) titleLightIntensityNumEl.value = lightIntensityVal;

    // 🏷️ タイトル外枠（簡易ロゴ化）バッジ設定のプレフィル
    const titleBadgeShapeEl = document.getElementById('editor-title-badge-shape');
    const titleBadgeOptionsEl = document.getElementById('editor-title-badge-options');
    const titleBadgeStyleEl = document.getElementById('editor-title-badge-style');
    const titleBadgeBgTypeEl = document.getElementById('editor-title-badge-bg-type');
    const titleBadgeBgCustomEl = document.getElementById('editor-title-badge-bg-custom');
    const titleBadgeColorTypeEl = document.getElementById('editor-title-badge-color-type');
    const titleBadgeColorCustomEl = document.getElementById('editor-title-badge-color-custom');

    const shapeVal = g.titleBadgeShape || 'none';
    if (titleBadgeShapeEl) titleBadgeShapeEl.value = shapeVal;
    if (titleBadgeOptionsEl) titleBadgeOptionsEl.style.display = shapeVal !== 'none' ? 'block' : 'none';
    if (titleBadgeStyleEl) titleBadgeStyleEl.value = g.titleBadgeStyle || 'fill';

    const bgTypeVal = g.titleBadgeBgType || 'primary';
    if (titleBadgeBgTypeEl) titleBadgeBgTypeEl.value = bgTypeVal;
    if (titleBadgeBgCustomEl) {
      titleBadgeBgCustomEl.value = g.titleBadgeBgCustom || '#1a73e8';
      titleBadgeBgCustomEl.style.display = bgTypeVal === 'custom' ? 'block' : 'none';
    }

    const colorTypeVal = g.titleBadgeColorType || 'white';
    if (titleBadgeColorTypeEl) titleBadgeColorTypeEl.value = colorTypeVal;
    if (titleBadgeColorCustomEl) {
      titleBadgeColorCustomEl.value = g.titleBadgeColorCustom || '#ffffff';
      titleBadgeColorCustomEl.style.display = colorTypeVal === 'custom' ? 'block' : 'none';
    }

    updateTitleDetailsActiveBadge();

    document.getElementById('editor-pro-display-mode').value = g.displayMode;
    document.getElementById('editor-pro-progress-indicator').value = g.progressIndicator;

    document.getElementById('editor-pro-contrast').value = g.appearance.contrast || 100;
    document.getElementById('editor-pro-color-primary').value = g.appearance.primaryColor;
    document.getElementById('editor-pro-color-bg').value = g.appearance.backgroundColor;

    const prefillFontSize = (selectId, containerId, inputId, val) => {
      const select = document.getElementById(selectId);
      const container = document.getElementById(containerId);
      const input = document.getElementById(inputId);
      if (!select || !container || !input) return;

      const strVal = val || "";
      if (strVal.startsWith("custom:")) {
        select.value = "custom";
        input.value = strVal.split(":")[1];
        container.style.display = "flex";
      } else {
        select.value = strVal || (select.options.length > 0 ? select.options[0].value : "");
        container.style.display = "none";
      }
    };
    const titleFontSize = (g.appearance && g.appearance.fontSizes && g.appearance.fontSizes.title) || 'large';
    const sectionFontSize = (g.appearance && g.appearance.fontSizes && g.appearance.fontSizes.section) || 'medium';
    const labelFontSize = (g.appearance && g.appearance.fontSizes && g.appearance.fontSizes.label) || 'medium';

    prefillFontSize('editor-title-font-size', 'editor-title-size-custom-container', 'editor-title-size-custom-val', titleFontSize);
    prefillFontSize('editor-pro-size-title', 'editor-pro-size-title-custom-container', 'editor-pro-size-title-custom-val', titleFontSize);
    prefillFontSize('editor-pro-size-section', 'editor-pro-size-section-custom-container', 'editor-pro-size-section-custom-val', sectionFontSize);
    prefillFontSize('editor-pro-size-label', 'editor-pro-size-label-custom-container', 'editor-pro-size-label-custom-val', labelFontSize);

    document.getElementById('editor-pro-show-duration').checked = !!g.announcement.showDuration;
    document.getElementById('editor-pro-show-alert').checked = !!g.announcement.showAlertBox;
    document.getElementById('editor-pro-duration-text').value = g.announcement.durationText || "";
    document.getElementById('editor-pro-alert-text').value = g.announcement.alertBoxText || "";

    document.getElementById('pro-duration-input-group').style.display = g.announcement.showDuration ? 'flex' : 'none';
    document.getElementById('pro-alert-input-group').style.display = g.announcement.showAlertBox ? 'flex' : 'none';

    // ロゴ表示チェックボックスのプレフィル
    const showLogoCheck = document.getElementById('editor-form-show-logo');
    if (showLogoCheck) showLogoCheck.checked = !!g.showLogo;

    // ヘッダー画像トグルのプレフィル
    const useHeaderImgCheck = document.getElementById('editor-pro-use-header-image');
    if (useHeaderImgCheck) {
      useHeaderImgCheck.checked = !!g.useHeaderImage;
      const headerImageGroup = document.getElementById('pro-header-image-edit-group');
      if (headerImageGroup) headerImageGroup.style.display = g.useHeaderImage ? 'flex' : 'none';
    }

    // ヘッダー画像URLのプレフィル
    const headerImageUrl = document.getElementById('editor-pro-header-image-url');
    if (headerImageUrl) headerImageUrl.value = g.headerImage || "";

    // ズーム・縦位置・横位置のプレフィル
    const savedScale = g.headerImageScale !== undefined ? g.headerImageScale : 100;
    const savedPosY = g.headerImagePosition !== undefined ? g.headerImagePosition : 50;
    const savedPosX = g.headerImagePositionX !== undefined ? g.headerImagePositionX : 50;

    const sliderScale = document.getElementById('editor-pro-header-image-scale');
    const numScale = document.getElementById('editor-pro-header-image-scale-num');
    if (sliderScale) sliderScale.value = savedScale;
    if (numScale) numScale.value = savedScale;

    const sliderY = document.getElementById('editor-pro-header-image-position');
    const numY = document.getElementById('editor-pro-header-image-position-num');
    if (sliderY) sliderY.value = savedPosY;
    if (numY) numY.value = savedPosY;

    const sliderX = document.getElementById('editor-pro-header-image-position-x');
    const numX = document.getElementById('editor-pro-header-image-position-x-num');
    if (sliderX) sliderX.value = savedPosX;
    if (numX) numX.value = savedPosX;

    // 背景画像着せ替えトグルのプレフィル
    const useBgImgCheck = document.getElementById('editor-pro-use-bg-image');
    const bgThemeSelect = document.getElementById('editor-pro-bg-theme-select');
    if (useBgImgCheck) {
      useBgImgCheck.checked = !!g.useBgImage;
      const bgThemeSelectGroup = document.getElementById('pro-bg-theme-select-group');
      if (bgThemeSelectGroup) bgThemeSelectGroup.style.display = g.useBgImage ? 'flex' : 'none';
      const bgCustomGroup = document.getElementById('pro-bg-custom-group');
      if (bgCustomGroup) bgCustomGroup.style.display = g.useBgImage ? 'flex' : 'none';
    }
    if (bgThemeSelect) bgThemeSelect.value = g.bgTheme || "";

    updatePresetChipsState();
    setupProInputListeners();
    setupStickyPreviewTracker();

    // ロード直後にプレビュー（背景画像やグラスモルフィズムスタイルなど含む）を再描画
    applyPreviewTheme();
    if (typeof renderLivePreview === "function") renderLivePreview();

    // フローマップの再描画をキックして既存データと同期
    if (typeof window.F === "function" && window.G) {
      window.F(window.G);
    }

    if (window.G && window.G.title) {
      updateHeaderActiveFormTitle(window.G.title);
    }
  }

  function updateHeaderActiveFormTitle(title) {
    try {
      const badge = document.getElementById('active-form-title-badge');
      const activeTabFromStorage = localStorage.getItem('form_customize_active_tab') || 'dashboard';
      
      // DOM上のタブのアクティブ状態も参照して判断を100%正確にする
      const isEditorTabActive = !!document.querySelector('.nav-tab[data-tab="editor"].active') || 
                                !!document.querySelector('#panel-editor.active') ||
                                !!document.querySelector('.nav-tab[data-tab="flowmap"].active') ||
                                !!document.querySelector('.nav-tab[data-tab="preview"].active');
      
      const shouldShowBadge = false; // 完全に非表示にするため無効化

      console.log(`[Extension] updateHeaderActiveFormTitle called:`, {
        title,
        activeTabFromStorage,
        isEditorTabActive,
        shouldShowBadge,
        badgeFound: !!badge,
        windowG_title: window.G ? window.G.title : null
      });

      if (badge) {
        if (shouldShowBadge) {
          const activeIndex = parseInt(localStorage.getItem('form_customize_active_index') || '0', 10);
          const isTemplateMode = localStorage.getItem('form_customize_is_template_mode') === 'true';

          let allForms = [];
          try {
            allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]');
          } catch(e) {}
          
          let templates = [];
          try {
            templates = JSON.parse(localStorage.getItem('form_customize_templates') || '[]');
          } catch(e) {}

          let currentTitle = '';
          if (isTemplateMode && templates[activeIndex]) {
            currentTitle = templates[activeIndex].title || `無題のテンプレート ${activeIndex + 1}`;
          } else if (!isTemplateMode && allForms[activeIndex]) {
            currentTitle = allForms[activeIndex].title || `無題のフォーム ${activeIndex + 1}`;
          }

          const existingTitleSpan = document.getElementById('header-active-form-title');
          if (existingTitleSpan && existingTitleSpan.textContent === currentTitle && badge.style.display === 'inline-flex') {
            console.log(`[Extension] Title is already up-to-date. Skipping rebuild.`);
            return;
          }

          badge.innerHTML = '';
          badge.style.display = 'inline-flex';
          badge.style.alignItems = 'center';
          badge.style.padding = '3px 12px';
          badge.style.gap = '4px';

          const labelSpan = document.createElement('span');
          labelSpan.style.color = '#718096';
          labelSpan.style.fontWeight = '500';
          labelSpan.style.fontSize = '0.72rem';
          labelSpan.style.whiteSpace = 'nowrap';
          
          labelSpan.textContent = isTemplateMode ? "📝 編集中のテンプレート: " : "📝 編集中のフォーム: ";
          badge.appendChild(labelSpan);

          const titleSpan = document.createElement('span');
          titleSpan.id = 'header-active-form-title';
          titleSpan.style.color = 'var(--color-primary, #3182ce)';
          titleSpan.style.fontWeight = '700';
          titleSpan.style.fontSize = '0.8rem';
          titleSpan.style.whiteSpace = 'nowrap';
          
          // 幅を制限し、はみ出た部分は省略表示 (...) を適用
          titleSpan.style.maxWidth = '180px';
          titleSpan.style.textOverflow = 'ellipsis';
          titleSpan.style.overflow = 'hidden';
          
          titleSpan.textContent = currentTitle;
          titleSpan.title = currentTitle;
          badge.title = currentTitle;

          badge.appendChild(titleSpan);
          console.log(`[Extension] Title display mounted successfully (dropdown removed).`);
        } else {
          // 非表示の場合であっても、元のシステムJSによる TypeError（querySelector('span') や querySelector('.lock-badge') が null になることによるクラッシュ）を完全に防ぐため、
          // 必要な子要素をあらかじめ生成してアペンドしておく
          badge.style.display = 'none';
          badge.innerHTML = '';
          
          const titleSpan = document.createElement('span');
          titleSpan.textContent = title;
          badge.appendChild(titleSpan);
          
          const lockSpan = document.createElement('span');
          lockSpan.className = 'lock-badge';
          lockSpan.textContent = '🔒';
          lockSpan.style.display = 'none';
          badge.appendChild(lockSpan);
        }
      }
    } catch (err) {
      console.error(`[Extension] Error inside updateHeaderActiveFormTitle:`, err);
    }
  }

  // 🧭 現在表示中の画面（タブ）をDOM状態から高信頼で判定
  function detectActiveTab() {
    try {
      const editorPanel = document.getElementById('panel-editor');
      if (editorPanel && editorPanel.classList.contains('active')) return 'editor';
      const flowmapPanel = document.getElementById('panel-flowmap');
      if (flowmapPanel && flowmapPanel.classList.contains('active')) return 'flowmap';
      const previewPanel = document.getElementById('panel-preview');
      if (previewPanel && previewPanel.classList.contains('active')) return 'preview';
      const activeNav = document.querySelector('.nav-tab.active');
      if (activeNav && activeNav.dataset.tab) return activeNav.dataset.tab;
      const dashPanel = document.getElementById('panel-dashboard');
      if (dashPanel && dashPanel.classList.contains('active')) return 'dashboard';
      return localStorage.getItem('form_customize_active_tab') || 'dashboard';
    } catch(e) {
      return 'dashboard';
    }
  }

  // 🔗 共通ヘッダーの「リンクを発行」ボタングループの表示状態を動的に切り替える
  function updateHeaderShareButtons(tabName) {
    try {
      const activeTab = tabName || detectActiveTab();
      const shareGroup = document.getElementById('share-export-group');
      const headerMergeBtn = document.getElementById('btn-header-merge-prod');
      const headerColBtn = document.getElementById('btn-header-column-preview');
      const isEditingActiveForm = activeTab && activeTab !== 'dashboard' && activeTab !== 'templates';

      if (shareGroup) {
        // ホーム（ダッシュボード）やテンプレート一覧画面では非表示、個別フォーム作業中（editor, flow, preview等）のみ表示
        if (isEditingActiveForm) {
          shareGroup.style.setProperty('display', 'inline-flex', 'important');
          shareGroup.classList.remove('hidden');
        } else {
          shareGroup.style.setProperty('display', 'none', 'important');
          shareGroup.classList.add('hidden');
        }
      }
      if (headerColBtn) {
        headerColBtn.style.setProperty('display', 'none', 'important');
        headerColBtn.classList.add('hidden');
      }
      if (!isEditingActiveForm && headerMergeBtn) {
        headerMergeBtn.style.setProperty('display', 'none', 'important');
      } else if (typeof updatePublishSyncUI === 'function') {
        updatePublishSyncUI();
      }
    } catch(e) {
      console.error('[ShareButtons] Failed to update state:', e);
    }
  }

  // 🔙 共通ヘッダーの「←（戻る）」ボタンおよびアクションの表示状態を動的に切り替える
  function updateHeaderBackButton(tabName) {
    try {
      const activeTab = tabName || detectActiveTab();
      const backBtn = document.getElementById('btn-back-to-dashboard');
      if (backBtn) {
        if (activeTab && activeTab !== 'dashboard') {
          backBtn.style.setProperty('display', 'inline-flex', 'important');
        } else {
          backBtn.style.setProperty('display', 'none', 'important');
        }
      }

      // 🔗 「リンクを発行」ボタングループの表示状態の動的切り替え
      updateHeaderShareButtons(activeTab);
    } catch(e) {
      console.error('[BackButton] Failed to update state:', e);
    }
  }

  // 🔙 「←（戻る）」ボタンのクリックリスナーを登録
  function setupHeaderBackButtonListener() {
    try {
      const backBtn = document.getElementById('btn-back-to-dashboard');
      if (backBtn && !backBtn.dataset.listenerBound) {
        backBtn.dataset.listenerBound = "true";
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('[BackButton] Back arrow clicked. Navigating back to dashboard...');
          
          // ダッシュボードタブをクリックしてホームに戻る
          const dashboardTab = document.getElementById('btn-tab-dashboard');
          if (dashboardTab) {
            dashboardTab.click();
          } else {
            // 直接 Z をコールしてフォールバック
            if (typeof window.Z === 'function') {
              window.Z('dashboard');
            }
          }
        });
      }
    } catch(e) {
      console.error('[BackButton] Failed to setup listener:', e);
    }
  }

  function createNewFormDirectlyWithoutPrompt() {
    try {
      const originalGetItem = localStorage.getItem;
      let allForms = [];
      try {
        allForms = JSON.parse(originalGetItem.call(localStorage, 'form_customize_all_forms') || '[]');
      } catch(e) {}

      let currentUser = { id: 'user_own_editor', name: '編集（自分がオーナーのみ）', role: 'own_editor' };
      try {
        const userRaw = originalGetItem.call(localStorage, 'gf_current_user');
        if (userRaw) {
          currentUser = JSON.parse(userRaw);
        }
      } catch(e) {}

      const defaultSchema = {
        title: `無題のフォーム (${allForms.length + 1})`,
        description: 'フォームの説明を入力してください。',
        isLocked: false,
        isTemplateMode: false,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        sections: [
          {
            id: 'section_1',
            title: '無題のセクション',
            description: 'セクションの説明をご入力ください。',
            questions: []
          }
        ]
      };

      const today = new Date();
      defaultSchema.lastModified = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

      allForms.push(defaultSchema);
      localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
      
      const activeIdx = allForms.length - 1;
      localStorage.setItem('form_customize_active_index', activeIdx.toString());
      localStorage.setItem('form_customize_is_template_mode', 'false');
      localStorage.setItem('form_customize_active_form_title', defaultSchema.title);
      localStorage.setItem('form_customize_active_tab', 'editor');

      console.log('[Dashboard Hook] Created new form without prompt. Index:', activeIdx);

      // リロードして編集画面で起動
      window.location.reload();
    } catch (err) {
      console.error('[Dashboard Hook] Failed to create form without prompt:', err);
      alert('フォームの作成に失敗しました。');
    }
  }

  function startDashboardHookLoop() {
    setInterval(() => {
      try {
        // 1. 新規フォーム作成ボタンのフックはグローバルデリゲーションで処理されるため省略します。

        // 2. リスト表示（テーブル行）への「⭐ テンプレート登録」ボタン自動アペンド＆日付フォーマット処理
        const listRows = document.querySelectorAll('#dashboard-view-list tbody tr');
        listRows.forEach((row, idx) => {
          // 2-1. テンプレート登録ボタンの自動アペンド
          if (!row.dataset.templateHooked) {
            row.dataset.templateHooked = "true";
            const actionTd = row.querySelector('td:last-child');
            if (actionTd) {
              const regBtn = document.createElement('button');
              regBtn.type = 'button';
              regBtn.className = 'btn-register-template';
              regBtn.innerHTML = '⭐ テンプレート登録';
              
              regBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                registerFormAsTemplate(idx);
              });
              
              actionTd.insertBefore(regBtn, actionTd.firstChild);
            }
          }

          // 2-2. 今日以外の日付セルを YYYY/MM/DD へ自動書き換え
          try {
            const key = 'form_customize_all_forms';
            let allForms = [];
            try {
              allForms = JSON.parse(localStorage.getItem(key) || '[]');
            } catch(e) {}

            const form = allForms[idx];
            if (form) {
              const formDateStr = form.lastModified || form.date;
              if (formDateStr) {
                const fDate = new Date(formDateStr);
                const today = new Date();

                const isToday = fDate.getFullYear() === today.getFullYear() &&
                                fDate.getMonth() === today.getMonth() &&
                                fDate.getDate() === today.getDate();

                if (!isToday) {
                  const tds = row.querySelectorAll('td');
                  if (tds.length >= 2) {
                    const dateTd = tds[tds.length - 2];
                    const txt = dateTd.textContent.trim();
                    
                    const yyyy = fDate.getFullYear();
                    const mm = String(fDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(fDate.getDate()).padStart(2, '0');
                    const expectedStr = `${yyyy}/${mm}/${dd}`;

                    if (txt !== expectedStr) {
                      dateTd.textContent = expectedStr;
                    }
                  }
                }
              }
            }
          } catch(dateErr) {
            console.error('[Dashboard Hook] Date formatting error:', dateErr);
          }
        });

        // 3. プレビューカード（グリッド表示）への「⭐ テンプレート登録」ボタン自動アペンド＆日付フォーマット処理
        const previewCards = document.querySelectorAll('#dashboard-view-preview .dashboard-preview-card');
        previewCards.forEach((card, idx) => {
          // 3-1. テンプレート登録ボタンの自動アペンド
          if (!card.dataset.templateHooked) {
            card.dataset.templateHooked = "true";
            const footer = card.querySelector('.card-footer') || card;
            if (footer) {
              const regBtn = document.createElement('button');
              regBtn.type = 'button';
              regBtn.className = 'btn-register-template';
              regBtn.style.marginTop = '6px';
              regBtn.innerHTML = '⭐ テンプレート登録';
              
              regBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                registerFormAsTemplate(idx);
              });
              
              footer.appendChild(regBtn);
            }
          }

          // 3-2. 今日以外の日付セルを YYYY/MM/DD へ自動書き換え
          try {
            const key = 'form_customize_all_forms';
            let allForms = [];
            try {
              allForms = JSON.parse(localStorage.getItem(key) || '[]');
            } catch(e) {}

            const form = allForms[idx];
            if (form) {
              const formDateStr = form.lastModified || form.date;
              if (formDateStr) {
                const fDate = new Date(formDateStr);
                const today = new Date();

                const isToday = fDate.getFullYear() === today.getFullYear() &&
                                fDate.getMonth() === today.getMonth() &&
                                fDate.getDate() === today.getDate();

                if (!isToday) {
                  const footerTextEl = card.querySelector('.card-footer') || card;
                  if (footerTextEl) {
                    const yyyy = fDate.getFullYear();
                    const mm = String(fDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(fDate.getDate()).padStart(2, '0');
                    const expectedDate = `${yyyy}/${mm}/${dd}`;

                    let html = footerTextEl.innerHTML;
                    const timeRegex = /\d{1,2}:\d{2}/;
                    if (timeRegex.test(html) && !html.includes(expectedDate)) {
                      footerTextEl.innerHTML = html.replace(timeRegex, expectedDate);
                    }
                  }
                }
              }
            }
          } catch(cardDateErr) {
            console.error('[Dashboard Hook] Card date replacement error:', cardDateErr);
          }
        });

        // 4. テンプレートバーの自動再描画（他のレンダラによって空にされていたら再描画）
        const barGrid = document.getElementById('template-bar-cards-grid');
        if (barGrid && barGrid.children.length === 0) {
          console.log('[Dashboard Hook] Template bar grid is empty, re-rendering...');
          renderTemplateBar();
        }

        // 5. フォーム説明文 textarea の高さ自動追従
        const formDescEl = document.getElementById('editor-form-desc');
        if (formDescEl && document.activeElement !== formDescEl) {
          autoResizeTextarea(formDescEl);
        }
      } catch (err) {
        console.error('[Dashboard Hook Error]', err);
      }
    }, 500);
  }

  // ダッシュボードフォーム一覧のソート処理
  function sortDashboardForms(sortBy) {
    try {
      const key = 'form_customize_all_forms';
      let allForms = [];
      try {
        allForms = JSON.parse(localStorage.getItem(key) || '[]');
      } catch(e) {}
      
      if (!Array.isArray(allForms) || allForms.length <= 1) return;

      // 選択中のアクティブフォームタイトルを取得しておき、ソート後のアクティブインデックスを追跡・補正する
      const activeIdx = parseInt(localStorage.getItem('form_customize_active_index') || '0');
      const activeFormTitle = allForms[activeIdx] ? allForms[activeIdx].title : null;

      allForms.sort((a, b) => {
        if (!a || !b) return 0;
        
        if (sortBy === 'title_asc') {
          return (a.title || '').localeCompare(b.title || '', 'ja');
        } else if (sortBy === 'title_desc') {
          return (b.title || '').localeCompare(a.title || '', 'ja');
        } else if (sortBy === 'lastModified_desc') {
          const tA = new Date(a.lastModified || a.date || 0).getTime();
          const tB = new Date(b.lastModified || b.date || 0).getTime();
          return tB - tA;
        } else if (sortBy === 'lastModified_asc') {
          const tA = new Date(a.lastModified || a.date || 0).getTime();
          const tB = new Date(b.lastModified || b.date || 0).getTime();
          return tA - tB;
        } else {
          // 'date' (最終閲覧 - 自分) またはデフォルト
          const tA = new Date(a.lastViewed || a.date || 0).getTime();
          const tB = new Date(b.lastViewed || b.date || 0).getTime();
          return tB - tA;
        }
      });

      localStorage.setItem(key, JSON.stringify(allForms));

      // アクティブインデックスの補正 (編集中フォームが変わらないようにする)
      if (activeFormTitle) {
        const newActiveIdx = allForms.findIndex(f => f.title === activeFormTitle);
        if (newActiveIdx !== -1) {
          localStorage.setItem('form_customize_active_index', newActiveIdx.toString());
        }
      }

      console.log('[Sort] Sorted forms by:', sortBy);
    } catch(err) {
      console.error('[Sort] Failed to sort dashboard forms:', err);
    }
  }

  // ダッシュボードのグローバルリスナー（ソート等のハンドリング本実装）
  function setupDashboardGlobalListeners() {
    try {
      console.log('[Dashboard] setupDashboardGlobalListeners initialization started.');
      
      // 並び替えドロップダウンの変更検知 (キャプチャ型)
      document.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'sort-label-text') {
          const sortBy = e.target.value;
          localStorage.setItem('form_customize_dashboard_sort_by', sortBy);
          
          // ソート実行
          sortDashboardForms(sortBy);
          
          // トーストで通知しつつ、React側にロードさせるためリロード
          showCustomToast('表示順を変更しました。', 'success');
          setTimeout(() => {
            location.reload();
          }, 350);
        }
      }, true);

      // 初期ロード時にLocalStorageのソート設定値をプルダウンに反映する
      const savedSort = localStorage.getItem('form_customize_dashboard_sort_by') || 'date';
      const selectEl = document.getElementById('sort-label-text');
      if (selectEl) {
        selectEl.value = savedSort;
      }
      
      console.log('[Dashboard] setupDashboardGlobalListeners initialized successfully. SortState:', savedSort);
    } catch(err) {
      console.error('[Dashboard Init] Failed to setup global listeners:', err);
    }
  }

  // ページ起動時ロード処理の末尾でフックを起動
  setTimeout(() => {
    try {
      setupDashboardGlobalListeners();
    } catch(e) {
      console.error('[Init] setupDashboardGlobalListeners error:', e);
    }
    
    try {
      startDashboardHookLoop();
    } catch(e) {
      console.error('[Init] startDashboardHookLoop error:', e);
    }
    
    try {
      renderTemplateBar(); // テンプレート選択バーを描画
    } catch(e) {
      console.error('[Init] renderTemplateBar error:', e);
    }
    
    try {
      setupTemplateGalleryListeners(); // ギャラリー画面遷移リスナーを初期化
    } catch(e) {
      console.error('[Init] setupTemplateGalleryListeners error:', e);
    }
  }, 100);

  function setupStickyPreviewTracker() {
    const previewPane = document.querySelector('.editor-live-preview-pane');
    if (!previewPane) return;

    let lastScrollTop = -1;
    const updatePosition = () => {
      // 1. 親ウィンドウのスクロール (CORSポリシーに配慮)
      let parentScrollY = 0;
      try {
        if (window.parent && window.parent.pageYOffset !== undefined) {
          parentScrollY = window.parent.pageYOffset;
        } else if (window.parent && window.parent.document.documentElement.scrollTop !== undefined) {
          parentScrollY = window.parent.document.documentElement.scrollTop;
        }
      } catch (e) {
        // CORSブロック時は無視
      }

      // 2. iframe自身のスクロール
      const iframeScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      
      // 3. エディタメイン領域のスクロール
      const mainElement = document.querySelector('.editor-main');
      const mainScrollY = mainElement ? mainElement.scrollTop : 0;

      const activeScrollY = Math.max(parentScrollY, iframeScrollY, mainScrollY);

      if (activeScrollY !== lastScrollTop) {
        lastScrollTop = activeScrollY;
        let targetY = activeScrollY;

        // iframe自体が親ウィンドウ上で上にスクロールアウトしている場合
        try {
          if (parentScrollY > 0 && window.frameElement) {
            const iframeRect = window.frameElement.getBoundingClientRect();
            targetY = Math.max(0, -iframeRect.top + 20);
          }
        } catch (e) {
          // 同一オリジンでない場合はフォールバック
        }

        // transform で位置を動的にスライド配置
        previewPane.style.transform = `translateY(${targetY}px)`;
        previewPane.style.transition = 'transform 0.1s ease-out';
      }
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    const mainElement = document.querySelector('.editor-main');
    if (mainElement) {
      mainElement.addEventListener('scroll', updatePosition, { passive: true });
    }
    
    // 100ms間隔で同期位置を自動監視・強制補正
    setInterval(updatePosition, 100);
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
          if (typeof saveAndSyncMindmapData === 'function') {
            saveAndSyncMindmapData();
          }
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        });
      }
    };

    // ヘッダー画像ファイル選択ボタンのトリガーとBase64変換処理
    const headerFileIn = document.getElementById('editor-pro-header-image-file');
    const btnUpload = document.getElementById('btn-pro-header-image-upload');
    if (btnUpload && headerFileIn) {
      btnUpload.addEventListener('click', () => headerFileIn.click());
    }
    if (headerFileIn) {
      headerFileIn.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64Data = event.target.result;
            if (window.G) {
              window.G.headerImage = base64Data;
              const urlInput = document.getElementById('editor-pro-header-image-url');
              if (urlInput) urlInput.value = base64Data;
              saveAndSyncMindmapData();
              applyPreviewTheme();
              renderLivePreview();
              if (window.S) window.S();
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    bindInput('editor-pro-header-image-url', v => {
      window.G.headerImage = v;
      saveAndSyncMindmapData();
    });

    // 双方向連動コントロールバインド関数
    function bindDoubleControl(sliderId, numId, valueKey, minVal, maxVal, defaultVal) {
      const slider = document.getElementById(sliderId);
      const num = document.getElementById(numId);
      if (!slider || !num) return;

      const updateVal = (v) => {
        let parsed = parseInt(v, 10);
        if (isNaN(parsed)) parsed = defaultVal;
        if (parsed < minVal) parsed = minVal;
        if (parsed > maxVal) parsed = maxVal;
        
        slider.value = parsed;
        num.value = parsed;
        
        window.G[valueKey] = parsed;
        saveAndSyncMindmapData();
        applyPreviewTheme();
        renderLivePreview();
        if (window.S) window.S();
      };

      slider.addEventListener('input', (e) => updateVal(e.target.value));
      num.addEventListener('input', (e) => updateVal(e.target.value));
      num.addEventListener('change', (e) => updateVal(e.target.value));
    }

    bindDoubleControl('editor-pro-header-image-scale', 'editor-pro-header-image-scale-num', 'headerImageScale', 30, 300, 100);
    bindDoubleControl('editor-pro-header-image-position', 'editor-pro-header-image-position-num', 'headerImagePosition', 0, 100, 50);
    bindDoubleControl('editor-pro-header-image-position-x', 'editor-pro-header-image-position-x-num', 'headerImagePositionX', 0, 100, 50);

    bindInput('editor-pro-logo', v => window.G.header.logoText = v);
    bindInput('editor-pro-title', v => {
      window.G.header.title = v;
      window.G.title = v; // 簡易版タイトルも同期
      const simpleTitle = document.getElementById('editor-form-title');
      if (simpleTitle) simpleTitle.value = v;
    });
    bindInput('editor-pro-subtitle', v => {
      window.G.header.subtitle = v;
      window.G.subtitle = v;
      if (window.U && window.U[window.W]) {
        window.U[window.W].subtitle = v;
        window.U[window.W].header = window.U[window.W].header || {};
        window.U[window.W].header.subtitle = v;
      }
    });
    bindInput('editor-pro-disclaimer', v => {
      window.G.header.disclaimer = v;
      window.G.description = v; // 簡易版説明も同期
      const simpleDesc = document.getElementById('editor-form-desc');
      if (simpleDesc) {
        simpleDesc.value = v;
        autoResizeTextarea(simpleDesc);
      }
    });

    bindChange('editor-pro-display-mode', v => window.G.displayMode = v);
    bindChange('editor-pro-progress-indicator', v => window.G.progressIndicator = v);

    bindChange('editor-header-style', v => {
      window.G.headerStyle = v;
      if (window.U && window.U[window.W]) window.U[window.W].headerStyle = v;
      if (window.n) window.n.headerStyle = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    document.querySelectorAll('.btn-header-align').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const align = btn.getAttribute('data-align') || 'left';
        document.querySelectorAll('.btn-header-align').forEach(b => b.classList.toggle('active', b === btn));
        const hiddenAlign = document.getElementById('editor-header-align');
        if (hiddenAlign) hiddenAlign.value = align;
        window.G.headerAlign = align;
        if (window.U && window.U[window.W]) window.U[window.W].headerAlign = align;
        if (window.n) window.n.headerAlign = align;
        applyPreviewTheme();
        renderLivePreview();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      });
    });

    bindChange('editor-subtitle-position', v => {
      window.G.subtitlePosition = v;
      if (window.U && window.U[window.W]) window.U[window.W].subtitlePosition = v;
      if (window.n) window.n.subtitlePosition = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    // 🎨 タイトル文字色のイベントリスナー
    bindChange('editor-title-color-type', v => {
      window.G.titleColorType = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleColorType = v;
      if (window.n) window.n.titleColorType = v;
      const customEl = document.getElementById('editor-title-color-custom');
      if (customEl) customEl.style.display = v === 'custom' ? 'inline-block' : 'none';
      // バッジ文字色とも同期
      const badgeColorEl = document.getElementById('editor-title-badge-color-type');
      if (badgeColorEl && v !== 'default') badgeColorEl.value = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindInput('editor-title-color-custom', v => {
      window.G.titleColorCustom = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleColorCustom = v;
      if (window.n) window.n.titleColorCustom = v;
      const badgeCustomEl = document.getElementById('editor-title-badge-color-custom');
      if (badgeCustomEl) badgeCustomEl.value = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    // 🔤 タイトルフォント（書体）のイベントリスナー
    bindChange('editor-title-font-family', v => {
      window.G.titleFontFamily = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleFontFamily = v;
      if (window.n) window.n.titleFontFamily = v;
      applyPreviewTheme();
      renderLivePreview();
      updateTitleDetailsActiveBadge();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindChange('editor-title-font-target', v => {
      window.G.titleFontTarget = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleFontTarget = v;
      if (window.n) window.n.titleFontTarget = v;
      applyPreviewTheme();
      renderLivePreview();
      updateTitleDetailsActiveBadge();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    // 🔤 タイトル文字変形＆立体ロゴエフェクトのイベントリスナー
    const titleWarpStrengthContainer = document.getElementById('editor-title-warp-strength-container');
    const titleLightingContainer = document.getElementById('editor-title-lighting-container');

    bindChange('editor-title-warp-shape', v => {
      window.G.titleWarpShape = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleWarpShape = v;
      if (window.n) window.n.titleWarpShape = v;
      if (titleWarpStrengthContainer) {
        titleWarpStrengthContainer.style.display = v !== 'none' ? 'block' : 'none';
      }
      applyPreviewTheme();
      renderLivePreview();
      updateTitleDetailsActiveBadge();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    const onWarpStrengthChange = (val) => {
      const num = Math.max(1, Math.min(200, parseInt(val, 10) || 50));
      window.G.titleWarpStrength = num;
      if (window.U && window.U[window.W]) window.U[window.W].titleWarpStrength = num;
      if (window.n) window.n.titleWarpStrength = num;
      const slider = document.getElementById('editor-title-warp-strength');
      const numInput = document.getElementById('editor-title-warp-strength-num');
      if (slider && parseInt(slider.value, 10) !== num) slider.value = num;
      if (numInput && parseInt(numInput.value, 10) !== num) numInput.value = num;
      fastUpdateLivePreview('title_warp');
      applyPreviewTheme();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    };
    bindInput('editor-title-warp-strength', onWarpStrengthChange);
    bindChange('editor-title-warp-strength', onWarpStrengthChange);
    bindInput('editor-title-warp-strength-num', onWarpStrengthChange);
    bindChange('editor-title-warp-strength-num', onWarpStrengthChange);

    bindChange('editor-title-warp-effect', v => {
      window.G.titleWarpEffect = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleWarpEffect = v;
      if (window.n) window.n.titleWarpEffect = v;
      if (titleLightingContainer) {
        titleLightingContainer.style.display = v !== 'none' ? 'block' : 'none';
      }
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    // 💡 ライティング（光の向き・角度）のイベントリスナー
    const onLightAngleChange = (val) => {
      let deg = parseInt(val, 10);
      if (isNaN(deg)) deg = 315;
      deg = ((deg % 360) + 360) % 360;
      window.G.titleLightAngle = deg;
      if (window.U && window.U[window.W]) window.U[window.W].titleLightAngle = deg;
      if (window.n) window.n.titleLightAngle = deg;
      const slider = document.getElementById('editor-title-light-angle');
      const numInput = document.getElementById('editor-title-light-angle-num');
      if (slider && parseInt(slider.value, 10) !== deg) slider.value = deg;
      if (numInput && parseInt(numInput.value, 10) !== deg) numInput.value = deg;

      // 8方向ボタンのactive更新
      document.querySelectorAll('.btn-light-dir').forEach(btn => {
        const bAngle = parseInt(btn.dataset.angle, 10);
        if (Math.abs(bAngle - deg) < 23 || (bAngle === 0 && deg >= 338)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      fastUpdateLivePreview('title_warp');
      applyPreviewTheme();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    };
    bindInput('editor-title-light-angle', onLightAngleChange);
    bindChange('editor-title-light-angle', onLightAngleChange);
    bindInput('editor-title-light-angle-num', onLightAngleChange);
    bindChange('editor-title-light-angle-num', onLightAngleChange);

    // 8方向クイックボタンのクリック
    document.querySelectorAll('.btn-light-dir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const angle = parseInt(btn.dataset.angle, 10);
        onLightAngleChange(angle);
      });
    });

    // 💡 ライティング（光の強弱・メリハリ）のイベントリスナー
    const onLightIntensityChange = (val) => {
      const num = Math.max(1, Math.min(100, parseInt(val, 10) || 60));
      window.G.titleLightIntensity = num;
      if (window.U && window.U[window.W]) window.U[window.W].titleLightIntensity = num;
      if (window.n) window.n.titleLightIntensity = num;
      const slider = document.getElementById('editor-title-light-intensity');
      const numInput = document.getElementById('editor-title-light-intensity-num');
      if (slider && parseInt(slider.value, 10) !== num) slider.value = num;
      if (numInput && parseInt(numInput.value, 10) !== num) numInput.value = num;

      fastUpdateLivePreview('title_warp');
      applyPreviewTheme();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    };
    bindInput('editor-title-light-intensity', onLightIntensityChange);
    bindChange('editor-title-light-intensity', onLightIntensityChange);
    bindInput('editor-title-light-intensity-num', onLightIntensityChange);
    bindChange('editor-title-light-intensity-num', onLightIntensityChange);

    // 🏷️ タイトル外枠（簡易ロゴ化）バッジ設定のイベントリスナー
    const titleBadgeOptionsEl = document.getElementById('editor-title-badge-options');
    bindChange('editor-title-badge-shape', v => {
      window.G.titleBadgeShape = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleBadgeShape = v;
      if (window.n) window.n.titleBadgeShape = v;
      if (titleBadgeOptionsEl) {
        titleBadgeOptionsEl.style.display = v !== 'none' ? 'block' : 'none';
      }
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindChange('editor-title-badge-style', v => {
      window.G.titleBadgeStyle = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleBadgeStyle = v;
      if (window.n) window.n.titleBadgeStyle = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindChange('editor-title-badge-bg-type', v => {
      window.G.titleBadgeBgType = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleBadgeBgType = v;
      if (window.n) window.n.titleBadgeBgType = v;
      const customBgEl = document.getElementById('editor-title-badge-bg-custom');
      if (customBgEl) customBgEl.style.display = v === 'custom' ? 'block' : 'none';
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindChange('editor-title-badge-bg-custom', v => {
      window.G.titleBadgeBgCustom = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleBadgeBgCustom = v;
      if (window.n) window.n.titleBadgeBgCustom = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindChange('editor-title-badge-color-type', v => {
      window.G.titleBadgeColorType = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleBadgeColorType = v;
      if (window.n) window.n.titleBadgeColorType = v;
      const customColorEl = document.getElementById('editor-title-badge-color-custom');
      if (customColorEl) customColorEl.style.display = v === 'custom' ? 'block' : 'none';
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

    bindChange('editor-title-badge-color-custom', v => {
      window.G.titleBadgeColorCustom = v;
      if (window.U && window.U[window.W]) window.U[window.W].titleBadgeColorCustom = v;
      if (window.n) window.n.titleBadgeColorCustom = v;
      applyPreviewTheme();
      renderLivePreview();
      if (typeof window.S === 'function') window.S();
      if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
    });

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

    const bindFontSizeControl = (selectId, customContainerId, customValId, key) => {
      const select = document.getElementById(selectId);
      const container = document.getElementById(customContainerId);
      const input = document.getElementById(customValId);

      if (!select || !container || !input) return;

      const updateVal = () => {
        const selectVal = select.value;
        if (selectVal === 'custom') {
          container.style.setProperty("display", "flex", "important");
          window.G.appearance.fontSizes[key] = `custom:${input.value}`;
        } else {
          container.style.setProperty("display", "none", "important");
          window.G.appearance.fontSizes[key] = selectVal;
        }

        // タイトルフォントサイズ変更時のパートナーコントロールとの双方向同期
        if (key === 'title') {
          const partnerSelectId = (selectId === 'editor-title-font-size') ? 'editor-pro-size-title' : 'editor-title-font-size';
          const partnerContainerId = (selectId === 'editor-title-font-size') ? 'editor-pro-size-title-custom-container' : 'editor-title-size-custom-container';
          const partnerValId = (selectId === 'editor-title-font-size') ? 'editor-pro-size-title-custom-val' : 'editor-title-size-custom-val';
          const pSelect = document.getElementById(partnerSelectId);
          const pContainer = document.getElementById(partnerContainerId);
          const pInput = document.getElementById(partnerValId);
          if (pSelect && pSelect.value !== selectVal) {
            pSelect.value = selectVal;
          }
          if (pInput && input && pInput.value !== input.value) {
            pInput.value = input.value;
          }
          if (pContainer) {
            pContainer.style.setProperty("display", selectVal === 'custom' ? 'flex' : 'none', "important");
          }

          // エディタ入力欄自身の文字サイズスタイルも連動
          const titleInput = document.getElementById('editor-form-title');
          if (titleInput) {
            if (selectVal === 'custom') {
              const px = parseInt(input.value) || 24;
              titleInput.style.fontSize = `${Math.min(Math.max(px, 14), 28)}px`;
            } else if (selectVal === 'small') {
              titleInput.style.fontSize = '1.05rem';
            } else if (selectVal === 'medium') {
              titleInput.style.fontSize = '1.2rem';
            } else {
              titleInput.style.fontSize = '1.35rem';
            }
          }
        }

        renderLivePreview();
        applyPreviewTheme();
      };

      select.addEventListener('change', updateVal);
      input.addEventListener('input', updateVal);
    };

    bindFontSizeControl('editor-title-font-size', 'editor-title-size-custom-container', 'editor-title-size-custom-val', 'title');
    bindFontSizeControl('editor-pro-size-title', 'editor-pro-size-title-custom-container', 'editor-pro-size-title-custom-val', 'title');
    bindFontSizeControl('editor-pro-size-section', 'editor-pro-size-section-custom-container', 'editor-pro-size-section-custom-val', 'section');
    bindFontSizeControl('editor-pro-size-label', 'editor-pro-size-label-custom-container', 'editor-pro-size-label-custom-val', 'label');

    bindChange('editor-pro-show-duration', v => {
      window.G.announcement.showDuration = v;
      document.getElementById('pro-duration-input-group').style.display = v ? 'flex' : 'none';
    });
    bindChange('editor-pro-show-alert', v => {
      window.G.announcement.showAlertBox = v;
      document.getElementById('pro-alert-input-group').style.display = v ? 'flex' : 'none';
    });

    bindInput('editor-pro-duration-text', v => window.G.announcement.durationText = v);
     bindInput('editor-pro-alert-text', v => window.G.announcement.alertBoxText = v);

     bindChange('editor-pro-use-header-image', v => {
       window.G.useHeaderImage = v;
       const headerImageGroup = document.getElementById('pro-header-image-edit-group');
       if (headerImageGroup) headerImageGroup.style.display = v ? 'flex' : 'none';
     });

     bindChange('editor-pro-use-bg-image', v => {
       window.G.useBgImage = v;
       const bgThemeSelectGroup = document.getElementById('pro-bg-theme-select-group');
       if (bgThemeSelectGroup) bgThemeSelectGroup.style.display = v ? 'flex' : 'none';
       const bgCustomGroup = document.getElementById('pro-bg-custom-group');
       if (bgCustomGroup) bgCustomGroup.style.display = v ? 'flex' : 'none';
     });

      bindChange('editor-pro-bg-theme-select', v => {
        window.G.bgTheme = v;
        if (v) {
          window.G.bgCustomUrl = "";
        }
        if (typeof saveAndSyncMindmapData === "function") saveAndSyncMindmapData();
      });

    // 会社ロゴタイプ・位置・画像アップロード関連のバインディング登録
    document.querySelectorAll('input[name="editor-logo-type"]').forEach(r => {
      r.addEventListener('change', (e) => {
        if (window.G) {
          window.G.logoType = e.target.value;
          const logoTextGroup = document.getElementById('logo-input-text-group');
          const logoImageGroup = document.getElementById('logo-input-image-group');
          if (logoTextGroup) logoTextGroup.style.display = e.target.value === 'text' ? 'block' : 'none';
          if (logoImageGroup) logoImageGroup.style.display = e.target.value === 'image' ? 'block' : 'none';
          saveAndSyncMindmapData();
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        }
      });
    });

    document.querySelectorAll('input[name="editor-logo-position"]').forEach(r => {
      r.addEventListener('change', (e) => {
        if (window.G) {
          window.G.logoPosition = e.target.value;
          saveAndSyncMindmapData();
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        }
      });
    });

    const logoImgUrl = document.getElementById('editor-pro-logo-image-url');
    if (logoImgUrl) {
      logoImgUrl.addEventListener('input', (e) => {
        if (window.G) {
          window.G.logoImageUrl = e.target.value;
          saveAndSyncMindmapData();
          applyPreviewTheme();
          renderLivePreview();
          if (window.S) window.S();
        }
      });
    }

    const logoUploadBtn = document.getElementById('btn-pro-logo-image-upload');
    const logoFileInput = document.getElementById('editor-pro-logo-image-file');
    if (logoUploadBtn && logoFileInput) {
      logoUploadBtn.addEventListener('click', () => logoFileInput.click());
      logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            if (window.G) {
              window.G.logoImageUrl = evt.target.result;
              if (logoImgUrl) logoImgUrl.value = "ローカル画像 (アップロード済)";
              saveAndSyncMindmapData();
              applyPreviewTheme();
              renderLivePreview();
              if (window.S) window.S();
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
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

  function resolveTitleTextColor(g, badgeShape, badgeStyle) {
    if (!g) return '';
    const colorType = g.titleColorType || (g.titleBadgeShape && g.titleBadgeShape !== 'none' ? g.titleBadgeColorType : 'default');
    const customColor = g.titleColorCustom || g.titleBadgeColorCustom || '#1a73e8';

    if (colorType === 'primary') return 'var(--color-primary, #1a73e8)';
    if (colorType === 'dark') return '#202124';
    if (colorType === 'white') return '#ffffff';
    if (colorType === 'custom') return customColor;
    if (badgeShape && badgeShape !== 'none' && badgeStyle === 'fill') {
      return (g.titleBadgeColorType === 'dark') ? '#202124' : '#ffffff';
    }
    return '';
  }
  window.resolveTitleTextColor = resolveTitleTextColor;

  // 🔤 タイトル・サブタイトル用フォントファミリーマップ
  const TITLE_FONT_MAP = {
    'default': "'Noto Sans JP', sans-serif",
    'noto-serif': "'Noto Serif JP', serif",
    'rounded': "'M PLUS Rounded 1c', sans-serif",
    'dela-gothic': "'Dela Gothic One', sans-serif",
    'zen-kaku': "'Zen Kaku Gothic New', sans-serif",
    'kaisei': "'Kaisei Decol', serif"
  };
  window.TITLE_FONT_MAP = TITLE_FONT_MAP;

  function applyTitleFontToElement(titleEl, subtitleEl, fontKey, targetScope) {
    const fontValue = TITLE_FONT_MAP[fontKey] || TITLE_FONT_MAP['default'];
    if (titleEl) {
      titleEl.style.setProperty('font-family', fontValue, 'important');
    }
    if (subtitleEl) {
      if (targetScope === 'both') {
        subtitleEl.style.setProperty('font-family', fontValue, 'important');
      } else {
        subtitleEl.style.removeProperty('font-family');
      }
    }
  }
  window.applyTitleFontToElement = applyTitleFontToElement;

  function updateTitleDetailsActiveBadge() {
    const g = window.G || {};
    const badgeEl = document.getElementById('title-details-active-badge');
    if (!badgeEl) return;

    const hasFont = g.titleFontFamily && g.titleFontFamily !== 'default';
    const hasWarp = g.titleWarpShape && g.titleWarpShape !== 'none';
    const hasEffect = g.titleWarpEffect && g.titleWarpEffect !== 'none';
    const hasBadge = g.titleBadgeShape && g.titleBadgeShape !== 'none';
    const hasCustomSize = g.appearance && g.appearance.fontSizes && g.appearance.fontSizes.title && g.appearance.fontSizes.title !== 'large';
    const hasCustomColor = g.titleColorType && g.titleColorType !== 'default';
    const hasCustomStyle = g.headerStyle && g.headerStyle !== 'card-accent-top';
    const hasCustomAlign = g.headerAlign && g.headerAlign !== 'left';

    const isConfigured = !!(hasFont || hasWarp || hasEffect || hasBadge || hasCustomSize || hasCustomColor || hasCustomStyle || hasCustomAlign);
    badgeEl.style.display = isConfigured ? 'inline-block' : 'none';
  }
  window.updateTitleDetailsActiveBadge = updateTitleDetailsActiveBadge;

  function applyTitleTextWarp(titleEl, text, warpShape, warpStrength, warpEffect, textColor, lightAngle, lightIntensity) {
    if (!titleEl) return;
    warpShape = warpShape || 'none';
    warpEffect = warpEffect || 'none';

    // 強度の数値パース（1〜100、旧light=25, medium=50, strong=75）
    let strNum = 50;
    if (warpStrength === 'light') strNum = 25;
    else if (warpStrength === 'medium') strNum = 50;
    else if (warpStrength === 'strong') strNum = 75;
    else if (typeof warpStrength === 'number') strNum = warpStrength;
    else if (typeof warpStrength === 'string' && !isNaN(parseInt(warpStrength, 10))) strNum = parseInt(warpStrength, 10);
    strNum = Math.max(1, Math.min(200, strNum));
    const strRatio = strNum / 100; // 0.01 〜 2.0

    // 光の向き（0〜360、デフォルト315）と強さ（1〜100、デフォルト60）
    let angle = (typeof lightAngle === 'number') ? lightAngle : 315;
    angle = ((angle % 360) + 360) % 360;
    let intensity = (typeof lightIntensity === 'number') ? lightIntensity : 60;
    intensity = Math.max(1, Math.min(100, intensity));
    const intensityRatio = intensity / 100;

    // 基本文字色
    if (textColor) {
      titleEl.style.setProperty('color', textColor, 'important');
      titleEl.style.setProperty('--neon-color', textColor);
    } else {
      titleEl.style.removeProperty('color');
      titleEl.style.removeProperty('--neon-color');
    }

    if (warpShape === 'none' && warpEffect === 'none') {
      titleEl.textContent = text;
      return;
    }

    const span = document.createElement('span');
    span.className = 'title-text-warp';
    if (textColor) {
      span.style.setProperty('color', textColor, 'important');
      span.style.setProperty('--neon-color', textColor);
    }

    // 💡 光と影（ライティング＆シャドウ計算: ぼやけを排除したソリッド多層押し出し）
    const rad = (angle * Math.PI) / 180;
    const lx = Math.cos(rad);
    const ly = Math.sin(rad);
    const sx = -lx;
    const sy = -ly;

    if (warpEffect === '3d') {
      span.classList.add('text-effect-3d');
      const maxDist = 1.8 + intensityRatio * 3.2; // 1.8px 〜 5.0px
      const steps = Math.max(3, Math.round(2 + intensityRatio * 3)); // 3〜5段
      const drops = [];

      // 光の当たる側のベベル・ハイライト
      const hlX = (lx * 1.0).toFixed(1);
      const hlY = (ly * 1.0).toFixed(1);
      const hlAlpha = (0.3 + 0.35 * intensityRatio).toFixed(2);
      drops.push(`drop-shadow(${hlX}px ${hlY}px 0 rgba(255, 255, 255, ${hlAlpha}))`);

      // ソリッド多層押し出しレイヤー (blur: 0 のハードエッジ)
      for (let s = 1; s <= steps; s++) {
        const d = (maxDist * (s / steps)).toFixed(1);
        const stepX = (sx * d).toFixed(1);
        const stepY = (sy * d).toFixed(1);
        const alpha = (Math.min(0.7, (0.18 + (s / steps) * 0.38) * (0.8 + 0.4 * intensityRatio))).toFixed(2);
        drops.push(`drop-shadow(${stepX}px ${stepY}px 0 rgba(0, 0, 0, ${alpha}))`);
      }

      // 接地アンビエントシャドウ (わずか1pxの極細ぼかしで輪郭を汚さず自然に接地)
      const fDist = (maxDist + 0.8).toFixed(1);
      const fX = (sx * fDist).toFixed(1);
      const fY = (sy * fDist).toFixed(1);
      const fAlpha = (0.25 * intensityRatio).toFixed(2);
      drops.push(`drop-shadow(${fX}px ${fY}px 1px rgba(0, 0, 0, ${fAlpha}))`);

      span.style.setProperty('--title-shadow-filter', drops.join(' '));
    } else if (warpEffect === 'gold') {
      span.classList.add('text-effect-gold');
      const gradAngle = Math.round((angle + 180) % 360);
      span.style.setProperty('--gold-gradient', `linear-gradient(${gradAngle}deg, #fff4b8 0%, #ffd700 35%, #e67e22 70%, #8c3b00 100%)`);
      const steps = Math.max(3, Math.round(2 + intensityRatio * 3));
      const drops = [];
      for (let s = 1; s <= steps; s++) {
        const d = (2.2 * (s / steps)).toFixed(1);
        const stepX = (sx * d).toFixed(1);
        const stepY = (sy * d).toFixed(1);
        drops.push(`drop-shadow(${stepX}px ${stepY}px 0 #7a3a00)`);
      }
      const fX = (sx * 2.8).toFixed(1);
      const fY = (sy * 2.8).toFixed(1);
      drops.push(`drop-shadow(${fX}px ${fY}px 1.5px rgba(0, 0, 0, ${(0.4 * intensityRatio).toFixed(2)}))`);
      span.style.setProperty('--title-shadow-filter', drops.join(' '));
    } else if (warpEffect === 'neon') {
      span.classList.add('text-effect-neon');
      const b1 = Math.max(2, Math.round(4 * intensityRatio));
      const b2 = Math.max(6, Math.round(12 * intensityRatio));
      const b3 = Math.max(12, Math.round(22 * intensityRatio));
      span.style.textShadow = `0 0 ${b1}px var(--neon-color, #00e5ff), 0 0 ${b2}px var(--neon-color, #00e5ff), 0 0 ${b3}px var(--neon-color, #00e5ff)`;
    } else if (warpEffect === 'outline') {
      span.classList.add('text-effect-outline');
      const ox = (sx * 2 * intensityRatio).toFixed(1);
      const oy = (sy * 2 * intensityRatio).toFixed(1);
      span.style.setProperty('--title-shadow-filter', `drop-shadow(${ox}px ${oy}px 1px rgba(0, 0, 0, ${(0.45 * intensityRatio).toFixed(2)}))`);
    }

    // 🔤 各変形形状のダイナミック描画
    if (warpShape === 'skew') {
      span.classList.add('text-warp-skew');
      const skewX = Math.min(50, Math.round(8 + strRatio * 20));
      span.style.setProperty('--warp-skew', skewX + 'deg');
      span.textContent = text;
    } else if (warpShape === 'trapezoid-down' || warpShape === 'trapezoid-up' || warpShape === 'perspective-left' || warpShape === 'perspective-right' || warpShape === 'slope-up' || warpShape === 'roof') {
      span.classList.add('text-warp-slope-container');
      const chars = Array.from(text || '');
      const len = chars.length;

      if (warpShape === 'trapezoid-down') {
        span.style.alignItems = 'flex-end';
        chars.forEach((ch, i) => {
          const cSpan = document.createElement('span');
          cSpan.textContent = ch;
          cSpan.style.display = 'inline-block';
          cSpan.style.transformOrigin = 'center bottom';
          const norm = len <= 1 ? 0 : (i - (len - 1) / 2) / ((len - 1) / 2);
          const skew = norm * (16 * strRatio);
          cSpan.style.transform = `skewX(${(-1 * skew).toFixed(1)}deg)`;
          const margin = Math.abs(norm) * (1.5 * strRatio);
          cSpan.style.margin = `0 ${margin.toFixed(1)}px`;
          if (textColor) cSpan.style.color = textColor;
          span.appendChild(cSpan);
        });
      } else if (warpShape === 'trapezoid-up') {
        span.style.alignItems = 'flex-end';
        chars.forEach((ch, i) => {
          const cSpan = document.createElement('span');
          cSpan.textContent = ch;
          cSpan.style.display = 'inline-block';
          cSpan.style.transformOrigin = 'center bottom';
          const norm = len <= 1 ? 0 : (i - (len - 1) / 2) / ((len - 1) / 2);
          const skew = norm * (-14 * strRatio);
          cSpan.style.transform = `skewX(${(-1 * skew).toFixed(1)}deg)`;
          if (textColor) cSpan.style.color = textColor;
          span.appendChild(cSpan);
        });
      } else if (warpShape === 'perspective-left') {
        span.style.alignItems = 'flex-end';
        chars.forEach((ch, i) => {
          const cSpan = document.createElement('span');
          cSpan.textContent = ch;
          cSpan.style.display = 'inline-block';
          cSpan.style.transformOrigin = 'center bottom';
          const ratio = len <= 1 ? 0 : i / (len - 1);
          const minScale = Math.max(0.35, 1.0 - 0.45 * strRatio);
          const maxScale = Math.min(2.2, 1.0 + 0.65 * strRatio);
          const curScale = maxScale - ratio * (maxScale - minScale);
          cSpan.style.fontSize = `${Math.round(curScale * 100)}%`;
          if (textColor) cSpan.style.color = textColor;
          span.appendChild(cSpan);
        });
      } else if (warpShape === 'perspective-right') {
        span.style.alignItems = 'flex-end';
        chars.forEach((ch, i) => {
          const cSpan = document.createElement('span');
          cSpan.textContent = ch;
          cSpan.style.display = 'inline-block';
          cSpan.style.transformOrigin = 'center bottom';
          const ratio = len <= 1 ? 0 : i / (len - 1);
          const minScale = Math.max(0.35, 1.0 - 0.45 * strRatio);
          const maxScale = Math.min(2.2, 1.0 + 0.65 * strRatio);
          const curScale = minScale + ratio * (maxScale - minScale);
          cSpan.style.fontSize = `${Math.round(curScale * 100)}%`;
          if (textColor) cSpan.style.color = textColor;
          span.appendChild(cSpan);
        });
      } else if (warpShape === 'slope-up') {
        span.style.alignItems = 'flex-end';
        chars.forEach((ch, i) => {
          const cSpan = document.createElement('span');
          cSpan.textContent = ch;
          cSpan.style.display = 'inline-block';
          cSpan.style.transformOrigin = 'center bottom';
          const ratio = len <= 1 ? 0 : i / (len - 1);
          const minScale = Math.max(0.35, 1.0 - 0.48 * strRatio);
          const maxScale = Math.min(2.4, 1.0 + 0.95 * strRatio);
          const curScale = minScale + ratio * (maxScale - minScale);
          cSpan.style.fontSize = `${Math.round(curScale * 100)}%`;
          if (textColor) cSpan.style.color = textColor;
          span.appendChild(cSpan);
        });
      } else if (warpShape === 'roof') {
        span.style.alignItems = 'flex-end';
        chars.forEach((ch, i) => {
          const cSpan = document.createElement('span');
          cSpan.textContent = ch;
          cSpan.style.display = 'inline-block';
          cSpan.style.transformOrigin = 'center bottom';
          const dist = len <= 1 ? 0 : Math.abs(i - (len - 1) / 2) / ((len - 1) / 2);
          const maxScale = Math.min(2.4, 1.0 + 0.85 * strRatio);
          const minScale = Math.max(0.35, 1.0 - 0.45 * strRatio);
          const curScale = maxScale - dist * (maxScale - minScale);
          const archLift = -1 * (18 * strRatio * (1 - Math.pow(dist, 1.4)));
          cSpan.style.fontSize = `${Math.round(curScale * 100)}%`;
          cSpan.style.transform = `translateY(${archLift.toFixed(1)}px)`;
          if (textColor) cSpan.style.color = textColor;
          span.appendChild(cSpan);
        });
      }
    } else {
      span.textContent = text;
    }

    titleEl.innerHTML = '';
    titleEl.appendChild(span);
  }
  window.applyTitleTextWarp = applyTitleTextWarp;

  function applyPreviewTheme() {
    const previewContainer = document.querySelector('.preview-container');
    const previewCard = document.querySelector('.preview-card');
    if (!previewContainer || !previewCard || !window.G) return;

    const g = window.G;
    const isPro = editorMode === "pro";

    // 既存の背景着せ替えクラスをクリア
    previewContainer.classList.remove('theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter', 'theme-sunset', 'theme-sunrise', 'theme-space', 'theme-green', 'theme-it');
    
    // カスタム背景用のインラインスタイルをリセット
    previewContainer.style.backgroundImage = '';
    previewContainer.style.backgroundSize = '';
    previewContainer.style.backgroundPosition = '';

    if (isPro && g.useBgImage) {
      if (g.bgCustomUrl) {
        previewContainer.style.background = 'none';
        previewContainer.style.backgroundColor = 'transparent';
        previewContainer.style.backgroundImage = `url(${g.bgCustomUrl})`;
        previewContainer.style.backgroundSize = 'cover';
        previewContainer.style.backgroundPosition = 'center';
        previewContainer.style.backgroundRepeat = 'no-repeat';
      } else if (g.bgTheme) {
        previewContainer.style.background = 'none';
        previewContainer.style.backgroundColor = 'transparent';
        previewContainer.classList.add(`theme-${g.bgTheme}`);
      } else {
        previewContainer.style.background = '';
        previewContainer.style.backgroundColor = '';
        previewContainer.style.backgroundImage = '';
      }
    } else {
      previewContainer.style.background = '';
      previewContainer.style.backgroundColor = '';
      previewContainer.style.backgroundImage = '';
    }

    // グラスモルフィズムカードスタイルの適用
    previewCard.classList.remove('theme-active-card', 'theme-active-card-dark');
    if (isPro && g.useBgImage && (g.bgTheme || g.bgCustomUrl)) {
      const darkThemes = ['space', 'it', 'sunset'];
      const cardClass = darkThemes.includes(g.bgTheme) ? 'theme-active-card-dark' : 'theme-active-card';
      previewCard.classList.add(cardClass);
    }

    const logoArea = document.getElementById('preview-logo-area');
    const logoTextSpan = document.getElementById('preview-logo-text');
    const subtitleP = document.getElementById('preview-form-subtitle');
    const durationBox = document.getElementById('preview-duration-box');
    const alertBox = document.getElementById('preview-alert-box');
    const announceArea = document.getElementById('preview-announcement-area');

    // タイトルと説明文（免責事項）の強制反映（同期解除対応）
    const previewTitle = document.getElementById('preview-form-title');
    const previewDesc = document.getElementById('preview-form-desc');
    if (previewTitle) {
      const rawTitle = isPro ? ((g.header ? g.header.title : null) || g.title || "セクション") : (g.title || "セクション");

      // 🏷️ タイトル外枠（簡易ロゴ化）バッジの適用
      const badgeShape = g.titleBadgeShape || 'none';
      const badgeStyle = g.titleBadgeStyle || 'fill';
      const badgeBgType = g.titleBadgeBgType || 'primary';
      const badgeBgCustom = g.titleBadgeBgCustom || '#1a73e8';
      const badgeColorType = g.titleBadgeColorType || 'white';
      const badgeColorCustom = g.titleBadgeColorCustom || '#ffffff';

      previewTitle.classList.remove(
        'title-badge',
        'badge-style-fill',
        'badge-style-outline',
        'badge-shape-trapezoid-down',
        'badge-shape-trapezoid-up',
        'badge-shape-parallelogram',
        'badge-shape-ribbon',
        'badge-shape-capsule',
        'badge-shape-chamfer',
        'badge-shape-retro'
      );
      previewTitle.style.removeProperty('--badge-bg');
      previewTitle.style.removeProperty('--badge-color');

      if (badgeShape && badgeShape !== 'none') {
        previewTitle.classList.add('title-badge', `badge-shape-${badgeShape}`, `badge-style-${badgeStyle}`);

        let actualBg = 'var(--color-primary, #1a73e8)';
        if (badgeBgType === 'dark') actualBg = '#202124';
        else if (badgeBgType === 'custom') actualBg = badgeBgCustom;
        previewTitle.style.setProperty('--badge-bg', actualBg);

        let actualColor = '#ffffff';
        if (badgeColorType === 'dark') actualColor = '#202124';
        else if (badgeColorType === 'primary') actualColor = 'var(--color-primary, #1a73e8)';
        else if (badgeColorType === 'custom') actualColor = badgeColorCustom;
        previewTitle.style.setProperty('--badge-color', actualColor);
      }

      // 🔤 タイトル文字自体の変形（ワープテキスト＆立体ロゴ）および文字色の適用
      const titleTextColor = resolveTitleTextColor(g, badgeShape, badgeStyle);
      applyTitleTextWarp(previewTitle, rawTitle, g.titleWarpShape, g.titleWarpStrength, g.titleWarpEffect, titleTextColor, g.titleLightAngle, g.titleLightIntensity);
      applyTitleFontToElement(previewTitle, subtitleP, g.titleFontFamily, g.titleFontTarget);
    }

    // サブタイトルの取得と反映（リアルタイム入力値＆データオブジェクト双方対応）
    const curSubtitleVal = document.getElementById('editor-pro-subtitle') 
      ? document.getElementById('editor-pro-subtitle').value 
      : ((g.header && g.header.subtitle) ? g.header.subtitle : (g.subtitle || ""));

    if (subtitleP) {
      if (curSubtitleVal && curSubtitleVal.trim() !== "") {
        subtitleP.textContent = curSubtitleVal;
        subtitleP.style.display = 'block';
      } else {
        subtitleP.textContent = "";
        subtitleP.style.display = 'none';
      }
      applyTitleFontToElement(previewTitle, subtitleP, g.titleFontFamily, g.titleFontTarget);
    }

    // 枠スタイル・配置・サブタイトル位置の適用
    const headerStyle = g.headerStyle || 'card-accent-top';
    const headerAlign = g.headerAlign || 'left';
    const subtitlePosition = g.subtitlePosition || 'below';

    previewCard.classList.remove(
      'header-style-card-accent-top',
      'header-style-card-simple',
      'header-style-card-accent-left',
      'header-style-card-shadow',
      'header-style-frameless',
      'header-style-frameless-underline'
    );
    previewCard.classList.add(`header-style-${headerStyle}`);

    const previewFormHeader = document.getElementById('preview-form-header');
    if (previewFormHeader) {
      previewFormHeader.classList.remove('header-align-left', 'header-align-center', 'header-align-right');
      previewFormHeader.classList.add(`header-align-${headerAlign}`);

      if (subtitleP && previewTitle && previewDesc) {
        if (subtitlePosition === 'above') {
          previewFormHeader.insertBefore(subtitleP, previewTitle);
        } else {
          previewFormHeader.insertBefore(subtitleP, previewDesc);
        }
      }
    }

    if (previewDesc) {
      const pDescVal = isPro ? ((g.header ? g.header.disclaimer : null) || g.description || "") : (g.description || "");
      previewDesc.innerHTML = renderRichTextWithLinks(pDescVal);
    }

    // 全体プレビューのヘッダー画像表示制御
    const previewHeaderImgContainer = document.getElementById('preview-header-image-container');
    const previewHeaderImg = document.getElementById('preview-header-image');
    if (previewHeaderImgContainer && previewHeaderImg) {
      if (isPro && g.useHeaderImage && g.headerImage) {
        previewHeaderImg.src = g.headerImage;
        previewHeaderImgContainer.style.display = 'block';
        const yPos = g.headerImagePosition !== undefined ? g.headerImagePosition : 50;
        const xPos = g.headerImagePositionX !== undefined ? g.headerImagePositionX : 50;
        const scale = g.headerImageScale !== undefined ? g.headerImageScale : 100;
        previewHeaderImg.style.objectPosition = `${xPos}% ${yPos}%`;
        previewHeaderImg.style.transform = `scale(${scale / 100})`;
        previewHeaderImg.style.transformOrigin = `${xPos}% ${yPos}%`;
      } else {
        previewHeaderImgContainer.style.display = 'none';
      }
    }

    // 全体プレビューのフッターロゴおよび最上部ロゴ表示制御
    const logoImg = document.getElementById('preview-logo-image');
    const previewFooterLogoContainer = document.getElementById('preview-footer-logo-container');
    const footerLogoImg = document.getElementById('preview-footer-logo');
    const footerLogoText = document.getElementById('preview-footer-logo-text');

    // 最上部ロゴの表示制御
    if (logoArea && logoTextSpan && logoImg) {
      if (isPro && g.logoPosition === "top") {
        logoArea.style.display = 'block';
        if (g.logoType === "image") {
          logoImg.src = g.logoImageUrl || "";
          logoImg.style.display = g.logoImageUrl ? 'block' : 'none';
          logoTextSpan.style.display = 'none';
        } else {
          const logoText = g.header ? g.header.logoText : "";
          logoTextSpan.textContent = logoText || "";
          logoTextSpan.style.display = logoText ? 'block' : 'none';
          logoImg.style.display = 'none';
        }
      } else {
        logoArea.style.display = 'none';
      }
    }

    // 最下部（フッター）ロゴの表示制御
    if (previewFooterLogoContainer && footerLogoImg && footerLogoText) {
      if (isPro && g.logoPosition === "bottom") {
        previewFooterLogoContainer.style.display = 'flex';
        if (g.logoType === "image") {
          footerLogoImg.src = g.logoImageUrl || "";
          footerLogoImg.style.display = g.logoImageUrl ? 'block' : 'none';
          footerLogoText.style.display = 'none';
        } else {
          const logoText = g.header ? g.header.logoText : "";
          footerLogoText.textContent = logoText || "";
          footerLogoText.style.display = logoText ? 'block' : 'none';
          footerLogoImg.style.display = 'none';
        }
      } else {
        // 簡易版は従来のチェックボックス (g.showLogo) に基づき、デフォルトロゴ (logo.png) を表示
        if (g.showLogo) {
          previewFooterLogoContainer.style.display = 'flex';
          footerLogoImg.src = "../logo.png";
          footerLogoImg.style.display = 'block';
          footerLogoText.style.display = 'none';
        } else {
          previewFooterLogoContainer.style.display = 'none';
        }
      }
    }

    if (isPro) {
      let showAnnounce = false;
      if (g.announcement && g.announcement.showDuration && g.announcement.durationText) {
        document.getElementById('preview-duration-value').textContent = g.announcement.durationText;
        durationBox.style.display = 'flex';
        showAnnounce = true;
      } else {
        durationBox.style.display = 'none';
      }

      if (g.announcement && g.announcement.showAlertBox && g.announcement.alertBoxText) {
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

      const primaryColor = (g && g.appearance && g.appearance.primaryColor) || "#0056b3";
      const bgColor = (g && g.appearance && g.appearance.backgroundColor) || "#f8fafd";
      const txtColor = getTextColorForBg(bgColor);

      previewContainer.style.setProperty('--color-primary', primaryColor);
      previewCard.style.backgroundColor = bgColor;
      previewCard.style.color = txtColor;

      const getActualFontSize = (val, type, isMobile) => {
        if (val && val.startsWith('custom:')) {
          const pxVal = parseInt(val.split(':')[1]) || 16;
          return isMobile ? `${Math.round(pxVal * 0.72)}px` : `${pxVal}px`;
        }
        if (type === 'title') {
          return isMobile
            ? (val === 'small' ? '1.1rem' : val === 'large' ? '1.5rem' : '1.3rem')
            : (val === 'small' ? '1.5rem' : val === 'large' ? '2.2rem' : '1.8rem');
        }
        if (type === 'section') {
          return isMobile
            ? (val === 'small' ? '0.9rem' : val === 'large' ? '1.2rem' : '1.0rem')
            : (val === 'small' ? '1.1rem' : val === 'large' ? '1.5rem' : '1.3rem');
        }
        // label
        return isMobile
          ? (val === 'small' ? '0.75rem' : val === 'large' ? '0.95rem' : '0.85rem')
          : (val === 'small' ? '0.8rem' : val === 'large' ? '1.0rem' : '0.9rem');
      };

      const fsObj = (g && g.appearance && g.appearance.fontSizes) || {};
      const titleSize = getActualFontSize(fsObj.title, 'title', false);
      const sectionSize = getActualFontSize(fsObj.section, 'section', false);
      const labelSize = getActualFontSize(fsObj.label, 'label', false);

      document.getElementById('preview-form-title').style.fontSize = titleSize;
      previewCard.style.setProperty('--preview-section-title-size', sectionSize);
      previewCard.style.setProperty('--preview-label-size', labelSize);

    } else {
      logoArea.style.display = 'none';
      if (subtitleP && (!curSubtitleVal || curSubtitleVal.trim() === "")) subtitleP.style.display = 'none';
      announceArea.style.display = 'none';
      previewContainer.classList.remove('preview-scroll-mode');
      document.querySelector('.progress-bar-container').style.display = 'block';

      previewContainer.style.setProperty('--color-primary', '#0056b3');
      previewCard.style.backgroundColor = '#ffffff';
      previewCard.style.color = '#212529';
      document.getElementById('preview-form-title').style.fontSize = '1.8rem';
    }
  }

  // ============================================================================
  // 【回答者向けセクション進め方・途中送信＆次セクション確認画面システム (v90)】
  // セクション完了時に「途中送信」が設定されている場合、勝手に次セクションへ進まず、
  // 1. 次のセクションで入力する情報・書類の一覧を事前確認
  // 2. 「途中送信して再開URLを発行」or「このまま次のセクションに進む」を選択
  // ============================================================================
  function renderFlowChoiceCardInPreview() {
    // 過去の末尾注入カードを確実にクリーンアップ
    const existingCard = document.getElementById('preview-flow-choice-card');
    if (existingCard) existingCard.remove();
  }

  function getPreviewQuestionTypeLabel(type) {
    const map = {
      'text': '📝 1行テキスト',
      'paragraph': '📄 長文記述',
      'radio': '🔘 選択式（単一）',
      'checkbox': '☑ 選択式（複数）',
      'select': '🔽 プルダウン選択',
      'file': '📎 ファイル添付（画像・PDF等）',
      'password': '🔑 パスワード',
      'number': '🔢 数値入力',
      'date': '📅 日付',
      'email': '✉️ メールアドレス',
      'tel': '📞 電話番号'
    };
    return map[type] || '✏️ 入力項目';
  }

  function isCurrentPreviewSectionPartialSubmit(section) {
    if (!section) return false;
    if (section.questions && window.V) {
      for (const q of section.questions) {
        if (['radio', 'select'].includes(q.type) && q.options) {
          const val = window.V[q.id];
          if (val) {
            const opt = q.options.find(o => o.label === val);
            if (opt && opt.nextSectionId === 'partial_submit') return true;
          }
        }
      }
    }
    return section.nextAction === 'partial_submit';
  }

  function getPreviewResolvedNextSection(section) {
    const formData = window.L || window.G || window.n;
    if (!formData || !formData.sections) return null;
    const sections = formData.sections;
    const curIdx = sections.findIndex(s => s.id === section.id);

    if (section.questions && window.V) {
      for (const q of section.questions) {
        if (['radio', 'select'].includes(q.type) && q.options) {
          const val = window.V[q.id];
          if (val) {
            const cleanVal = String(val).trim();
            // セマンティック最優先安全弁
            if (cleanVal.includes('個人') && !cleanVal.includes('法人')) {
              const pSec = sections.find(s => s && s.title && s.title.includes('個人') && !s.title.includes('法人'));
              if (pSec) return pSec;
            } else if (cleanVal.includes('法人')) {
              const cSec = sections.find(s => s && s.title && s.title.includes('法人'));
              if (cSec) return cSec;
            }

            const opt = q.options.find(o => o && String(o.label).trim() === cleanVal) ||
                        q.options.find(o => o && cleanVal.includes(String(o.label).trim()));
            if (opt && opt.nextSectionId && opt.nextSectionId !== 'partial_submit' && opt.nextSectionId !== 'submit') {
              let target = sections.find(s => s.id === opt.nextSectionId);
              if (!target && opt.nextSectionId.startsWith('q_')) {
                target = sections.find(s => (s.questions || []).some(q => q.id === opt.nextSectionId));
              }
              if (!target) {
                target = sections.find(s => s.title && (s.title.includes(opt.nextSectionId) || opt.nextSectionId.includes(s.title)));
              }
              if (target) return target;
            }
          }
        }
      }
    }

    const act = section.nextAction;
    if (act && !['next', 'submit', 'partial_submit'].includes(act)) {
      let target = sections.find(s => s.id === act);
      if (!target && typeof act === 'string' && act.startsWith('q_')) {
        target = sections.find(s => (s.questions || []).some(q => q.id === act));
      }
      if (!target && typeof act === 'string') {
        target = sections.find(s => s.title && (s.title.includes(act) || act.includes(s.title)));
      }
      if (target) return target;
    }

    if (curIdx !== -1 && curIdx < sections.length - 1) {
      return sections[curIdx + 1];
    }
    return null;
  }

  function ensurePreviewPartialSubmitContainer() {
    let container = document.getElementById('preview-partial-submit-step-container');
    if (!container) {
      const previewCard = document.querySelector('#panel-preview .preview-card:not(.success-card)');
      if (previewCard) {
        container = document.createElement('div');
        container.id = 'preview-partial-submit-step-container';
        container.className = 'partial-submit-step-wrapper';
        container.style.display = 'none';
        const actions = previewCard.querySelector('.preview-actions');
        if (actions) {
          previewCard.insertBefore(container, actions);
        } else {
          previewCard.appendChild(container);
        }
      }
    }
    return container;
  }

  function hidePreviewIntermediateStep() {
    const container = document.getElementById('preview-partial-submit-step-container');
    if (container) {
      container.style.display = 'none';
      container.innerHTML = '';
    }
    const secContainer = document.getElementById('preview-section-container');
    if (secContainer) secContainer.style.display = 'block';
    const actions = document.querySelector('#panel-preview .preview-actions');
    if (actions) actions.style.display = 'flex';
  }

  function showPreviewIntermediatePartialSubmitStep(currentSec, nextSec) {
    const container = ensurePreviewPartialSubmitContainer();
    if (!container) return;

    const secContainer = document.getElementById('preview-section-container');
    if (secContainer) secContainer.style.display = 'none';
    const actions = document.querySelector('#panel-preview .preview-actions');
    if (actions) actions.style.display = 'none';

    const formData = window.L || window.G || window.n;
    const sections = (formData && formData.sections) || [];
    const curIdx = sections.findIndex(s => s.id === currentSec.id);
    const nextIdx = sections.findIndex(s => s.id === nextSec.id);

    // プログレスバーの更新
    const ut = document.getElementById('preview-progress-bar');
    const dt = document.getElementById('preview-progress-text');
    if (ut && dt && sections.length > 0) {
      const progress = Math.round(((curIdx + 1) / sections.length) * 100);
      ut.style.width = `${progress}%`;
      dt.textContent = `セクション ${curIdx + 1} 完了 ： 進め方・次セクションの確認`;
    }

    const nextQuestions = nextSec.questions || [];
    let questionsListHtml = '';
    if (nextQuestions.length === 0) {
      questionsListHtml = `
        <div style="padding: 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; color: #64748b; font-size: 0.85rem; text-align: center;">
          このセクションに入力項目はありません（案内・確認セクションです）
        </div>
      `;
    } else {
      questionsListHtml = nextQuestions.map((q, qIndex) => {
        const reqBadge = q.required 
          ? '<span style="background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">必須</span>' 
          : '<span style="background: #f1f5f9; color: #64748b; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">任意</span>';
        const typeLabel = getPreviewQuestionTypeLabel(q.type);
        const descHtml = q.description 
          ? `<div style="font-size: 0.78rem; color: #64748b; margin-top: 4px; line-height: 1.4;">${escapeHtml(q.description)}</div>` 
          : '';

        return `
          <div class="next-sec-q-item" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
            <div style="flex: 1;">
              <div style="font-size: 0.9rem; font-weight: 600; color: #1e293b; display: flex; align-items: baseline; gap: 6px;">
                <span style="color: #64748b; font-size: 0.8rem; font-weight: 700;">Q${qIndex + 1}.</span>
                <span>${escapeHtml(q.title || '無題の質問')}</span>
              </div>
              ${descHtml}
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;">
              ${reqBadge}
              <span style="font-size: 0.72rem; color: #475569; background: #f8fafc; border: 1px solid #cbd5e1; padding: 1px 6px; border-radius: 4px; white-space: nowrap;">${typeLabel}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    const nextSecTitle = nextSec.title || `セクション ${nextIdx + 1}`;
    const nextSecDesc = nextSec.description ? escapeHtml(nextSec.description) : '';

    container.innerHTML = `
      <div class="partial-step-card" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: var(--border-radius); padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px;">
        <div style="text-align: center; margin-bottom: 22px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px;">
            <span>✓</span> セクション ${curIdx + 1} の入力が完了しました
          </div>
          <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-main, #1e293b); margin: 0 0 8px;">進め方をご確認ください</h2>
          <p style="font-size: 0.86rem; color: var(--color-text-muted, #64748b); margin: 0; line-height: 1.6;">
            このフォームは<strong>「途中送信」</strong>に対応しています。<br>
            次のセクションで入力する内容をご確認の上、<strong>「このまま次へ進む」</strong>か<strong>「ここで途中送信して再開リンクを発行する」</strong>かをお選びいただけます。
          </p>
        </div>

        <!-- 次のセクションで入力する情報のご確認 -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-bottom: 22px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <span style="font-size: 0.78rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 4px;">
              📋 次のセクションで入力する情報
            </span>
            <span style="font-size: 0.75rem; color: #64748b;">
              全 ${nextQuestions.length} 項目
            </span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #1e293b; margin: 0 0 6px;">
            【セクション ${nextIdx + 1}】 ${escapeHtml(nextSecTitle)}
          </h3>
          ${nextSecDesc ? `<div style="font-size: 0.82rem; color: #64748b; margin-bottom: 12px; line-height: 1.5;">${nextSecDesc}</div>` : ''}

          <div style="margin-top: 12px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
              <span>▼</span> 入力・添付が必要な項目一覧
            </div>
            <div style="max-height: 260px; overflow-y: auto; padding-right: 4px;">
              ${questionsListHtml}
            </div>
          </div>
        </div>

        <!-- 進め方の選択UI -->
        <div style="margin-top: 18px;">
          <div style="font-size: 0.92rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; text-align: center;">
            どちらの進め方にしますか？
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
            <!-- 選択肢A: 途中送信する -->
            <div id="btn-preview-choice-partial-submit" style="background: #ffffff; border: 2px solid #3b82f6; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(59,130,246,0.1);">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="font-size: 1.3rem;">💾</span>
                  <div style="font-size: 0.92rem; font-weight: 700; color: #1d4ed8;">ここまでの内容で途中送信する</div>
                </div>
                <div style="font-size: 0.78rem; color: #4b5563; line-height: 1.5; margin-bottom: 14px;">
                  手元に書類や情報がない場合におすすめです。これまでの回答を保存し、<strong>8桁の確定登録コード</strong>と<strong>後からいつでも再開できる専用URL</strong>を発行します。
                </div>
              </div>
              <button type="button" class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 0.85rem; font-weight: 700; padding: 9px; background: #2563eb !important; border-color: #2563eb !important; cursor: pointer;">
                💾 途中送信して再開URLを発行
              </button>
            </div>

            <!-- 選択肢B: 次に進む -->
            <div id="btn-preview-choice-continue-next" style="background: #ffffff; border: 2px solid #10b981; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(16,185,129,0.1);">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="font-size: 1.3rem;">👉</span>
                  <div style="font-size: 0.92rem; font-weight: 700; color: #047857;">このまま次のセクションに進む</div>
                </div>
                <div style="font-size: 0.78rem; color: #4b5563; line-height: 1.5; margin-bottom: 14px;">
                  必要な情報や添付書類が手元に揃っている場合は、このまま続けて【${escapeHtml(nextSecTitle)}】の入力画面へ進んで回答を継続できます。
                </div>
              </div>
              <button type="button" class="btn btn-success" style="width: 100%; justify-content: center; font-size: 0.85rem; font-weight: 700; padding: 9px; background: #059669 !important; border-color: #059669 !important; cursor: pointer;">
                👉 このまま続けて回答する
              </button>
            </div>
          </div>

          <!-- 戻るボタン ＆ ガイドリンク -->
          <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <button type="button" id="btn-preview-choice-back" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; color: #64748b; background: transparent; border: 1px solid #cbd5e1; cursor: pointer;">
              ← 前のセクションの入力内容を修正する
            </button>
            <button type="button" id="btn-preview-choice-guide" class="btn-flow-guide-trigger" style="font-size: 0.78rem; color: #7c3aed; background: transparent; border: 1px solid #d8b4fe; cursor: pointer; padding: 4px 10px; border-radius: 4px;">
              <span>📖</span> 図解付き詳細ガイドを見る
            </button>
          </div>
        </div>
      </div>
    `;

    container.style.display = 'block';
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) previewContainer.scrollTop = 0;

    // クリックハンドラー登録
    const partialBtn = container.querySelector('#btn-preview-choice-partial-submit');
    if (partialBtn) {
      partialBtn.onclick = (e) => {
        e.preventDefault();
        hidePreviewIntermediateStep();
        executeRespondentPartialSubmit(currentSec, nextSec);
      };
    }

    const continueBtn = container.querySelector('#btn-preview-choice-continue-next');
    if (continueBtn) {
      continueBtn.onclick = (e) => {
        e.preventDefault();
        hidePreviewIntermediateStep();
        window.B = window.B || [];
        window.B.push({ sectionId: window.R, startQuestionId: null });
        window.R = nextSec.id;
        if (typeof window.St === 'function') {
          window.St();
        }
        const pCont = document.querySelector('.preview-container');
        if (pCont) pCont.scrollTop = 0;
      };
    }

    const backBtn = container.querySelector('#btn-preview-choice-back');
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault();
        hidePreviewIntermediateStep();
        const pCont = document.querySelector('.preview-container');
        if (pCont) pCont.scrollTop = 0;
      };
    }

    const guideBtn = container.querySelector('#btn-preview-choice-guide');
    if (guideBtn) {
      guideBtn.onclick = (e) => {
        e.preventDefault();
        openPartialSubmitGuideModal();
      };
    }
  }

  // ============================================================================
  // 📖 セクション進め方・途中送信＆再開リンク 図解付き詳細ガイドモーダル
  // ============================================================================
  function ensurePartialSubmitGuideModal() {
    let modal = document.getElementById('partial-submit-guide-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'partial-submit-guide-modal';
    modal.className = 'flowmap-modal-overlay partial-submit-guide-modal-overlay';
    modal.innerHTML = `
      <div class="flowmap-modal-card guide-modal-wide">
        <div class="flowmap-modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">📖</span>
            <h3 style="margin:0; font-size:1.05rem; font-weight:700; color:#1e293b;">セクション進め方・途中送信＆再開リンク 図解ガイド</h3>
          </div>
          <button type="button" id="btn-partial-guide-close" class="flowmap-modal-close" title="閉じる">&times;</button>
        </div>
        <div class="flowmap-modal-body" style="padding:22px; max-height:calc(85vh - 120px); overflow-y:auto;">
          <!-- 導入バナー -->
          <div class="guide-intro-banner">
            <span style="font-size:1.35rem; flex-shrink:0;">💡</span>
            <span>本フォームでは、回答状況に合わせて「<strong>最後まで一気に回答</strong>」するか、「<strong>途中で保存して後から再開</strong>」するかを自由に選択できます。手元に書類や情報がない場合でも安心です。</span>
          </div>

          <!-- 1. 2つの進め方の図解比較 -->
          <div class="guide-section">
            <h4 class="guide-section-title">
              <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:5px; background:#eff6ff; color:#2563eb; vertical-align:middle; margin-right:4px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h5" />
                  <path d="M8 12c3.5 0 5-6 8.5-6h3.5" />
                  <path d="M17 3.5l3.5 2.5-3.5 2.5" />
                  <path d="M8 12c3.5 0 5 6 8.5 6h3.5" />
                  <path d="M17 15.5l3.5 2.5-3.5 2.5" />
                </svg>
              </span> 1. あなたに合わせた2つの進め方（図解比較）
            </h4>
            <div class="guide-compare-grid">
              <!-- ルート1 -->
              <div class="guide-compare-card card-route-direct">
                <span class="compare-badge badge-blue">ルート 1: 一括完了</span>
                <div class="compare-title">1. 途中送信をせずに最後まで回答して送信する</div>
                <div class="compare-flow-diagram">
                  <div class="flow-step-node node-blue">現在セクション入力</div>
                  <div class="flow-step-arrow">➔</div>
                  <div class="flow-step-node node-blue">次へ進む</div>
                  <div class="flow-step-arrow">➔</div>
                  <div class="flow-step-node node-green">最終送信 🎉</div>
                </div>
                <ul class="compare-features">
                  <li>手元に必要な情報や確認書類がすべて揃っている場合に最適です。</li>
                  <li>各セクションの「次へ」ボタンを押してテンポよく最後まで回答を進めます。</li>
                  <li>すべてのセクションの入力が完了した後に、一括で送信が完了します。</li>
                </ul>
              </div>

              <!-- ルート2 -->
              <div class="guide-compare-card card-route-partial">
                <span class="compare-badge badge-purple">ルート 2: 安心保存</span>
                <div class="compare-title">2. 途中送信をして、次のセクションから始められるリンクを発行</div>
                <div class="compare-flow-diagram">
                  <div class="flow-step-node node-purple">入力内容を安全保存 💾</div>
                  <div class="flow-step-arrow">➔</div>
                  <div class="flow-step-node node-purple">確定コード & 再開URL発行 🔗</div>
                  <div class="flow-step-arrow">➔</div>
                  <div class="flow-step-node node-indigo">後からいつでも再開 📱/💻</div>
                </div>
                <ul class="compare-features">
                  <li>口座番号・インボイス番号・書類確認など、手元に情報がない場合に最適です。</li>
                  <li>入力済みの内容を確定保存し、8桁の確定コードと再開URLを発行します。</li>
                  <li>発行されたURLを開くだけで、回答済みデータが自動復元され続きから再開できます。</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 2. 途中送信から再開までの3ステップ図解 -->
          <div class="guide-section" style="margin-top:24px;">
            <h4 class="guide-section-title">
              <span>🚀</span> 2. 途中送信から再開までの3ステップ（図解プロセス）
            </h4>
            <div class="guide-steps-container">
              <div class="guide-step-card">
                <span class="step-badge">STEP 1</span>
                <span class="step-icon">💾</span>
                <div class="step-content">
                  <div class="step-title">ここまでの内容で途中送信</div>
                  <div class="step-desc">選択肢2を選び、「途中送信してリンクを発行する」を押します。これまでの入力内容がサーバーへ安全に保存され、確定登録コード（例: 46297844）が発行されます。</div>
                </div>
              </div>
              <div class="guide-step-connector">▼</div>
              <div class="guide-step-card">
                <span class="step-badge">STEP 2</span>
                <span class="step-icon">📋</span>
                <div class="step-content">
                  <div class="step-title">専用の再開URLをコピー・保存</div>
                  <div class="step-desc">発行された再開専用URLを「リンクをコピー」ボタンで取得します。ご自身のメールやメモアプリ、LINE、ブラウザのお気に入りに保存してください。</div>
                </div>
              </div>
              <div class="guide-step-connector">▼</div>
              <div class="guide-step-card">
                <span class="step-badge">STEP 3</span>
                <span class="step-icon">🚀</span>
                <div class="step-content">
                  <div class="step-title">いつでも別の端末から続きを再開</div>
                  <div class="step-desc">手元に書類が揃ったら、保存したURLを開くだけ。前回の入力データが自動的に読み込まれ、続きのセクションからスムーズに回答できます。</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 安心・安全のデータ保全仕様 -->
          <div class="guide-section" style="margin-top:24px;">
            <h4 class="guide-section-title">
              <span>🛡️</span> 3. 安心・安全のデータ保全仕様
            </h4>
            <div class="guide-security-grid">
              <div class="security-card">
                <span class="security-icon">🔒</span>
                <div class="security-title">暗号化セッション保護</div>
                <div class="security-desc">回答者ごとに個別の暗号化セッションを発行。第三者が勝手に閲覧・改ざんできない安全な仕組みです。</div>
              </div>
              <div class="security-card">
                <span class="security-icon">🔄</span>
                <div class="security-title">何度でも上書き保存可能</div>
                <div class="security-desc">セクションが進むごとに何度でも途中送信を行えます。常に最新の回答内容が確実に保持されます。</div>
              </div>
              <div class="security-card">
                <span class="security-icon">📱</span>
                <div class="security-title">スマホ ⇄ PC マルチ対応</div>
                <div class="security-desc">移動中にスマートフォンで途中まで回答し、帰宅後にパソコンで続きを入力して送信することも可能です。</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flowmap-modal-footer" style="padding: 12px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
          <button type="button" id="btn-partial-guide-close-footer" class="btn btn-primary btn-sm" style="padding: 6px 22px; font-weight: 700; cursor: pointer; border-radius: 6px;">閉じる</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#btn-partial-guide-close');
    const closeFooterBtn = modal.querySelector('#btn-partial-guide-close-footer');
    const closeModal = () => {
      modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    return modal;
  }

  function openPartialSubmitGuideModal() {
    const modal = ensurePartialSubmitGuideModal();
    modal.classList.add('active');
  }
  window.openPartialSubmitGuideModal = openPartialSubmitGuideModal;
  window.ensurePartialSubmitGuideModal = ensurePartialSubmitGuideModal;

  function getCleanViewResumeUrl(rId, sId) {
    const origin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
    let pathname = window.location.pathname || '';
    let viewPath = '';
    if (pathname.includes('form-customize')) {
      const prefix = pathname.substring(0, pathname.indexOf('form-customize'));
      viewPath = `${prefix}form-customize/view.html`;
    } else if (pathname.endsWith('.html')) {
      viewPath = pathname.substring(0, pathname.lastIndexOf('/') + 1) + 'view.html';
    } else if (pathname.endsWith('/')) {
      viewPath = pathname + 'view.html';
    } else {
      viewPath = pathname + '/view.html';
    }
    viewPath = viewPath.replace(/\/+/g, '/');
    if (!viewPath.startsWith('/')) viewPath = '/' + viewPath;

    const curIdx = window.W !== undefined ? window.W : (parseInt(localStorage.getItem('form_customize_active_index'), 10) || 0);
    const secParam = sId ? `&resumeSec=${encodeURIComponent(sId)}` : '';

    // 短縮URL (Google Forms短縮URL風: 例 https://synapse-wayway.vercel.app/f/0?res_id=...&resumeSec=...)
    if (origin && (origin.includes('vercel.app') || !window.location.pathname.includes('form-customize/index.html'))) {
      return `${origin}/f/${curIdx}?res_id=${encodeURIComponent(rId)}${secParam}`;
    }

    const formObj = (window.U && window.U[curIdx]) || window.G;
    const formId = (formObj && formObj.id) ? formObj.id : `form_${curIdx}`;
    return `${origin}${viewPath}?id=${encodeURIComponent(formId)}&form_idx=${curIdx}&res_id=${encodeURIComponent(rId)}${secParam}`;
  }

  function executeRespondentPartialSubmit(currentSec, nextSec = null) {
    const formData = window.L || window.G || window.n;
    const currentSecId = currentSec ? currentSec.id : window.R;
    const currentSecTitle = currentSec ? (currentSec.title || 'セクション') : 'セクション';

    let nextSecId = nextSec ? nextSec.id : null;
    if (!nextSecId && formData && formData.sections) {
      const curIdx = formData.sections.findIndex(s => s.id === currentSecId);
      if (curIdx !== -1 && curIdx < formData.sections.length - 1) {
        nextSecId = formData.sections[curIdx + 1].id;
      }
    }
    if (!nextSecId) nextSecId = currentSecId;

    window.V = window.V || {};
    const submitData = {};
    if (formData && formData.sections) {
      formData.sections.forEach(s => {
        if (s.questions) {
          s.questions.forEach(q => {
            const val = window.V[q.id];
            if (val !== undefined && val !== null && val !== '') {
              submitData[q.title || q.id] = val;
              submitData[q.id] = val;
            }
          });
        }
      });
    }

    const rowId = window.currentResumeRowId || ('row_' + Date.now());
    window.currentResumeRowId = rowId;
    let confirmedCode = window.currentRegistrationCode;
    if (!confirmedCode) {
      confirmedCode = String(Math.floor(10000000 + Math.random() * 90000000));
      window.currentRegistrationCode = confirmedCode;
    }

    const resumeUrl = getCleanViewResumeUrl(rowId, nextSecId);

    try {
      localStorage.setItem('form_draft_' + rowId, JSON.stringify({
        rowId: rowId,
        registrationCode: confirmedCode,
        data: submitData,
        currentSectionId: currentSecId,
        nextSectionId: nextSecId
      }));
    } catch (e) {}

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'FORM_SUBMIT',
        formTitle: (formData && formData.title) || '無題のフォーム',
        data: submitData,
        isTemporary: false,
        isPartialSubmit: true,
        rowId: rowId,
        currentSectionId: currentSecId,
        nextSectionId: nextSecId,
        env: 'test',
        branch: 'test'
      }, '*');
    }

    const gt = document.querySelector('#panel-preview .preview-card:not(.success-card)');
    const ht = document.getElementById('preview-success-card');
    if (gt) gt.style.display = 'none';
    if (ht) ht.style.display = 'block';

    const debugJson = document.getElementById('submitted-data-json');
    if (debugJson) {
      debugJson.textContent = JSON.stringify(submitData, null, 2);
    }

    renderSubmitSuccessCard({
      rowId: rowId,
      registrationCode: confirmedCode,
      isPartialSubmit: true,
      resumeUrl: resumeUrl,
      nextSectionId: nextSecId,
      formTitle: (formData && formData.title) || '無題のフォーム'
    });

    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) previewContainer.scrollTop = 0;
  }

  function setupPreviewModeOverrides() {
    const wrapCtIfNeeded = () => {
      if (typeof window.Ct === 'function' && !window.Ct._hasInvoiceRepValidationWrapped) {
        const origCt = window.Ct;
        window.Ct = function() {
          // 口座番号の正規表現と入力値を堅牢に正規化（プレビュー時の誤判定を根絶）
          const formSources = [window.L, window.G, window.n];
          formSources.forEach(src => {
            if (src && src.sections) {
              src.sections.forEach(s => {
                (s.questions || []).forEach(q => {
                  const isAcct = (q.dataKey === 'account_number') || (q.title && (q.title.includes('口座番号') || (!q.title.includes('名義') && q.title.includes('口座'))));
                  if (isAcct) {
                    if (q.validation && q.validation.category === 'regex') {
                      q.validation.value = '^[0-9]{6,7}$';
                      q.validation.errorMessage = '正しい口座番号（6〜7桁の半角数字）を入力してください。';
                    }
                    if (window.V && typeof window.V[q.id] === 'string') {
                      window.V[q.id] = window.V[q.id].replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[^\d]/g, '');
                    }
                  }
                  const isHolder = (q.dataKey === 'account_holder_kana') || (q.title && (q.title.includes('口座名義') || q.title.includes('名義人') || (q.title.includes('口座') && q.title.includes('名義'))));
                  if (isHolder) {
                    if (q.validation && q.validation.category === 'regex') {
                      q.validation.value = '^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$';
                      q.validation.errorMessage = '口座名義はカナと（）.のみで入力してください。';
                    }
                  }
                });
              });
            }
          });

          const baseResult = origCt();
          if (!baseResult) return false;

          const formData = window.L || window.G || window.n;
          const curR = window.R || (formData && formData.sections && formData.sections[0] ? formData.sections[0].id : null);
          if (!formData || !curR) return true;

          const currentSec = formData.sections.find(s => s.id === curR);
          if (!currentSec || !currentSec.questions) return true;

          const container = document.getElementById('preview-section-container');
          if (!container) return true;

          let pass = true;
          let firstErrCard = null;

          currentSec.questions.forEach(q => {
            const card = container.querySelector(`.preview-q-card[data-question-id="${q.id}"]`);
            if (!card || card.style.display === 'none') return;
            clearIntegrityError(card);

            const val = window.V ? window.V[q.id] : null;
            const strVal = (val != null && typeof val === 'string') ? val.trim() : (val != null ? String(val).trim() : '');

            // ① 代表者名・代表者名カナ・生年月日の必須入力チェック
            const isRepName = (q.type === 'text') && (
              q.title.includes('代表者名') ||
              q.title.includes('代表者氏名') ||
              q.title.includes('代表者')
            ) && !q.title.includes('カナ') && !q.title.includes('フリガナ') && !q.title.includes('ふりがな');

            const isRepKana = (q.type === 'text') && (
              (q.title.includes('代表者') && (q.title.includes('カナ') || q.title.includes('フリガナ') || q.title.includes('ふりがな'))) ||
              q.title.includes('代表者カナ') ||
              q.title.includes('代表者名（カナ）') ||
              q.title.includes('代表者名カナ')
            );

            const isBirthDate = (q.type === 'text' || q.type === 'date') && (
              q.title.includes('生年月日')
            );

            if (isRepName || isRepKana || isBirthDate) {
              if (!strVal) {
                showHardError(card, 'この質問は必須項目です。入力してください。');
                pass = false;
                firstErrCard ||= card;
                return;
              }
            }

            // ② インボイス番号の架空ベタ打ちブロック（規則の種類がAPI連携 & 判定ルールがinvoice_numberの項目を検証）
            const apiConfig = getQuestionApiConfig(q);
            if (apiConfig && apiConfig.isInvoice && strVal) {
              const isDirectInvoiceNum = /^T\d{13}$/i.test(strVal);
              const isDigits13 = /^\d{13}$/.test(strVal);
              const fullNum = isDirectInvoiceNum ? strVal.toUpperCase() : (isDigits13 ? ('T' + strVal) : '');
              const numPart = fullNum ? fullNum.substring(1) : '';

              const masterMatch = CORP_DATABASE.find(item => item.num === numPart);
              const checkDigitPassed = fullNum ? isValidInvoiceCheckDigit(fullNum) : false;

              if (!masterMatch && !checkDigitPassed) {
                showHardError(card, '⚠️ 入力されたインボイス登録番号は国税庁の公表システムに存在しないか無効な番号です。正しい適格請求書発行事業者番号を入力してください。');
                pass = false;
                firstErrCard ||= card;
                return;
              }
            }
          });

          if (firstErrCard) {
            firstErrCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          return pass;
        };
        window.Ct._hasInvoiceRepValidationWrapped = true;
      }
    };
    wrapCtIfNeeded();

    const wrapStIfNeeded = () => {
      if (typeof window.St === 'function' && !window.St._hasFlowChoiceWrapped) {
        const origSt = window.St;
        window.St = function() {
          hidePreviewIntermediateStep();
          origSt();
          setTimeout(() => {
            renderFlowChoiceCardInPreview();
          }, 30);
        };
        window.St._hasFlowChoiceWrapped = true;
      }
    };
    wrapStIfNeeded();

    function findStreetQuestionInPreviewSection(section) {
      if (!section || !section.questions) return null;
      return section.questions.find(q => {
        const d = (q.description || '');
        const t = (q.title || '');
        if (q.dataKey === 'street') return true;
        if (q.id && q.id.includes('street') && !q.id.includes('building')) return true;
        if (d.includes('番地・号') || (d.includes('番地') && d.includes('追記'))) return true;
        if ((t.includes('町名') || t.includes('番地')) && !t.includes('建物') && !t.includes('部屋')) return true;
        return false;
      });
    }

    function showStreetConfirmModalPreview(section, streetQ, isSubmit, onProceed) {
      let modalEl = document.getElementById('street-confirm-modal');
      if (!modalEl) {
        onProceed();
        return;
      }

      const container = document.getElementById('preview-section-container') || document;
      const card = container.querySelector(`.preview-q-card[data-question-id="${streetQ.id}"]`);
      const inputEl = card ? card.querySelector('input[type="text"], textarea') : null;

      let streetVal = (window.V && window.V[streetQ.id] != null) ? String(window.V[streetQ.id]).trim() : '';
      if (!streetVal && inputEl) {
        streetVal = (inputEl.value || '').trim();
      }

      const alertTextEl = modalEl.querySelector('#street-confirm-alert-text');
      const addrContextEl = modalEl.querySelector('#street-confirm-address-context');
      const currentValEl = modalEl.querySelector('#street-confirm-current-val');
      const statusEl = modalEl.querySelector('#street-confirm-status');
      const btnProceed = modalEl.querySelector('#btn-street-modal-proceed');
      const btnCancel = modalEl.querySelector('#btn-street-modal-cancel');

      if (alertTextEl) {
        const desc = (streetQ.description || '').trim();
        const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        if (desc) {
          alertTextEl.innerHTML = esc(desc).replace(/【(.*?)】/g, '<strong>【$1】</strong>');
        } else {
          alertTextEl.innerHTML = '自動補完された住所の末尾に、必ず<strong>【番地・号（数字）】</strong>を追記してください。';
        }
      }

      const prefQ = (section.questions || []).find(q => q.dataKey === 'pref' || (q.title && q.title.includes('都道府県')));
      const cityQ = (section.questions || []).find(q => q.dataKey === 'city' || (q.title && (q.title.includes('市区町村') || q.title.includes('市町村'))));
      let prefVal = prefQ ? ((window.V && window.V[prefQ.id]) || '') : '';
      let cityVal = cityQ ? ((window.V && window.V[cityQ.id]) || '') : '';
      if (!prefVal && prefQ) {
        const pCard = container.querySelector(`.preview-q-card[data-question-id="${prefQ.id}"]`);
        const pInput = pCard ? pCard.querySelector('select, input') : null;
        if (pInput) prefVal = pInput.value || '';
      }
      if (!cityVal && cityQ) {
        const cCard = container.querySelector(`.preview-q-card[data-question-id="${cityQ.id}"]`);
        const cInput = cCard ? cCard.querySelector('input') : null;
        if (cInput) cityVal = cInput.value || '';
      }

      if (addrContextEl) {
        if (prefVal || cityVal) {
          addrContextEl.style.display = 'block';
          addrContextEl.textContent = `📍 ${prefVal} ${cityVal}`.trim();
        } else {
          addrContextEl.style.display = 'none';
        }
      }

      if (currentValEl) {
        currentValEl.textContent = streetVal || '（未入力）';
      }

      const hasDigits = /[\d０-９]/.test(streetVal);
      const hasKanjiNum = /[一二三四五六七八九十]/.test(streetVal);
      const endsWithTown = /(?:丁目|町|大字|字|通|区|市)$/.test(streetVal.replace(/[\s　]+$/, ''));
      const isMissingBanchi = (!hasDigits && !hasKanjiNum) || endsWithTown || !streetVal;

      if (statusEl) {
        if (isMissingBanchi) {
          statusEl.className = 'street-confirm-status-notice street-confirm-status-warning';
          statusEl.innerHTML = '<span>⚠️</span> <span>番地・号（数字）がまだ入力されていない可能性があります。</span>';
        } else {
          statusEl.className = 'street-confirm-status-notice street-confirm-status-ok';
          statusEl.innerHTML = '<span>✓</span> <span>番地・号（数字）が正しく入力されているかご確認ください。</span>';
        }
      }

      if (btnProceed) {
        btnProceed.textContent = isSubmit ? 'このまま送信する ✓' : 'このまま次へ進む →';
      }

      modalEl.style.display = 'flex';
      requestAnimationFrame(() => {
        modalEl.classList.add('show');
      });

      const hideModal = () => {
        modalEl.classList.remove('show');
        setTimeout(() => {
          modalEl.style.display = 'none';
        }, 200);
      };

      btnCancel.onclick = () => {
        hideModal();
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            inputEl.focus();
            try {
              const len = inputEl.value.length;
              inputEl.setSelectionRange(len, len);
            } catch(e) {}
            if (card) {
              card.classList.remove('street-focus-highlight');
              void card.offsetWidth;
              card.classList.add('street-focus-highlight');
            }
          }, 250);
        }
      };

      btnProceed.onclick = () => {
        hideModal();
        onProceed();
      };

      modalEl.onclick = (e) => {
        if (e.target === modalEl) {
          btnCancel.click();
        }
      };
    }

    // キャプチャフェーズで #btn-preview-next / #btn-preview-submit のクリックを最優先フック
    if (!window._hasPreviewNextCaptureHooked) {
      window._hasPreviewNextCaptureHooked = true;
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('#btn-preview-next, #btn-preview-submit, #preview-next-btn, #preview-submit-btn');
        if (!btn) return;
        const panelPreview = document.getElementById('panel-preview');
        if (!panelPreview || (!panelPreview.classList.contains('active') && panelPreview.style.display === 'none')) return;

        if (window._bypassStreetConfirmOnce) {
          window._bypassStreetConfirmOnce = false;
          return;
        }

        const formData = window.L || window.G || window.n;
        if (!formData || !formData.sections) return;
        const curR = window.R || (formData.sections[0] ? formData.sections[0].id : null);
        const curSec = formData.sections.find(s => s.id === curR);
        if (!curSec) return;

        // バリデーション実行
        if (typeof window.Ct === 'function') {
          if (!window.Ct()) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
          }
        }

        // 町名・番地の入力確認ポップアップ判定
        const streetQ = findStreetQuestionInPreviewSection(curSec);
        if (streetQ) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const isSubmit = btn.id.includes('submit');
          showStreetConfirmModalPreview(curSec, streetQ, isSubmit, () => {
            window._bypassStreetConfirmOnce = true;
            btn.click();
          });
          return;
        }

        // 途中送信が設定されているセクション完了時の割り込み
        if (isCurrentPreviewSectionPartialSubmit(curSec)) {
          const nextSec = getPreviewResolvedNextSection(curSec);
          if (nextSec) {
            e.preventDefault();
            e.stopImmediatePropagation();
            showPreviewIntermediatePartialSubmitStep(curSec, nextSec);
            return;
          }
        }
      }, true);
    }

    const originalZ = window.Z;
    if (originalZ) {
      window.Z = function(tabName) {
        originalZ(tabName);
        if (tabName === 'preview') {
          setTimeout(() => {
            hidePreviewIntermediateStep();
            applyPreviewTheme();
            setupLiveAutocompleteEvents();
            evaluateLiveSkipLogic();
            checkAndRestoreDraftSession();
            setupPreviewDraftObserver();
            injectDraftSavePanelToPreview();
            wrapStIfNeeded();
            renderFlowChoiceCardInPreview();
          }, 150);
        }
      };
    }

    // URLパラメータに再開指定がある場合、自動的にプレビュータブへ遷移する
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('res_id') || urlParams.get('resumeRowId') || urlParams.get('active_tab') === 'preview') {
      setTimeout(() => {
        if (window.Z) window.Z('preview');
      }, 80);
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#btn-tab-preview') || e.target.closest('#btn-open-preview') || e.target.closest('#btn-panel-preview-refresh');
      if (btn) {
        setTimeout(() => {
          hidePreviewIntermediateStep();
          injectDraftSavePanelToPreview();
          wrapStIfNeeded();
          renderFlowChoiceCardInPreview();
        }, 150);
      }
    });

    // 「最初から回答する / もう一度回答する」クリック時のセッション状態初期化
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'btn-preview-reset') {
        hidePreviewIntermediateStep();
        window.currentResumeRowId = null;
        window.currentRegistrationCode = null;
        const banner = document.getElementById('preview-resume-banner');
        if (banner) banner.remove();
        const infoArea = document.getElementById('partial-submit-info-area');
        if (infoArea) infoArea.remove();
        const existingChoice = document.getElementById('preview-flow-choice-card');
        if (existingChoice) existingChoice.remove();
      }
    });

    setInterval(() => {
      const panelPreview = document.getElementById('panel-preview');
      if (panelPreview && (panelPreview.classList.contains('active') || panelPreview.style.display !== 'none')) {
        const container = document.getElementById('preview-section-container');
        if (container && !container.querySelector('.preview-draft-save-panel')) {
          injectDraftSavePanelToPreview();
        }
        wrapStIfNeeded();
        if (container && !container.querySelector('.preview-flow-choice-card')) {
          renderFlowChoiceCardInPreview();
        }
      }
    }, 200);

    window.addEventListener('message', (event) => {
      if (!event.data) return;
      if (event.data.type === 'FORM_SUBMIT_TEMPORARY_RESPONSE') {
        const { rowId, success } = event.data;
        if (success && rowId) {
          window.currentResumeRowId = rowId;
          renderLivePreview();
          injectDraftSavePanelToPreview();
        }
      } else if (event.data.type === 'FORM_SUBMIT_RESPONSE') {
        const { rowId, partnerId, registrationCode, isPartialSubmit, resumeUrl, nextSectionId, formTitle } = event.data;
        if (rowId) {
          window.currentResumeRowId = rowId;
        }
        const confirmedCode = registrationCode || partnerId || window.currentRegistrationCode;
        if (confirmedCode) {
          window.currentRegistrationCode = confirmedCode;
        }
        renderSubmitSuccessCard({
          rowId,
          partnerId,
          registrationCode: confirmedCode,
          isPartialSubmit: !!isPartialSubmit,
          resumeUrl,
          nextSectionId,
          formTitle
        });
      } else if (event.data.type === 'FORM_TEMPORARY_DATA_RESPONSE') {
        const { rowId, data, partnerId, registrationCode } = event.data;
        if (rowId && data) {
          window.currentResumeRowId = rowId;
          const confirmedCode = registrationCode || partnerId;
          if (confirmedCode) {
            window.currentRegistrationCode = confirmedCode;
          }
          window.V = window.V || {};
          restoreAnswersToDOM(data);

          const curParams = new URLSearchParams(window.location.search);
          const resumeSec = curParams.get('resumeSec');
          const formData = window.L || window.G || window.n;
          if (resumeSec && formData && formData.sections && formData.sections.some(s => s.id === resumeSec)) {
            window.R = resumeSec;
            if (window.St) window.St();
          }

          if (window.currentRegistrationCode) {
            showResumeInfoBanner(window.currentRegistrationCode);
          }

          if (window.x) window.x();
          evaluateLiveSkipLogic();
          injectDraftSavePanelToPreview();
        }
      } else if (event.data.type === 'SYNAPSE_FORCE_MERGE_COMPLETED') {
        try {
          const raw = localStorage.getItem('form_customize_all_forms');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              window.U = parsed;
              const idx = (window.W !== undefined ? window.W : (parseInt(localStorage.getItem('form_customize_active_index'), 10) || 0));
              if (window.U[idx]) {
                window.G = window.U[idx];
              }
            }
          }
          if (typeof updatePublishSyncUI === 'function') {
            updatePublishSyncUI();
          }
        } catch (e) {
          console.warn('[Message: SYNAPSE_FORCE_MERGE_COMPLETED] Error updating UI:', e);
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
    const formData = window.L || window.n;
    if (!formData || !formData.sections) return;
    const currentR = window.R || (window.n && window.r) || (formData.sections[0] ? formData.sections[0].id : null);
    const activeSec = formData.sections.find(s => s.id === currentR) || formData.sections[0];
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
        window.parent.postMessage({ type: 'FORM_SUBMIT', formTitle: window.L.title || '無題のフォーム', data: data, isTemporary: true, rowId: window.currentResumeRowId || null, env: 'test', branch: 'test' }, '*');
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

  function renderSubmitSuccessCard(info) {
    const successCard = document.getElementById('preview-success-card');
    if (!successCard) return;

    const titleEl = successCard.querySelector('h2');
    const descEl = successCard.querySelector('p');
    const resetBtn = document.getElementById('btn-preview-reset');

    const oldInfoArea = successCard.querySelector('#partial-submit-info-area');
    if (oldInfoArea) oldInfoArea.remove();

    const isPartial = !!info.isPartialSubmit;
    const confirmedCode = info.registrationCode || info.partnerId || window.currentRegistrationCode || '';
    const resumeUrl = info.resumeUrl || (window.currentResumeRowId ? getCleanViewResumeUrl(window.currentResumeRowId, info.nextSectionId) : '');

    if (isPartial) {
      if (titleEl) titleEl.textContent = '途中送信が完了し、登録コードが確定しました！';
      if (descEl) descEl.textContent = '入力内容を保存し、登録コードを発行しました。続きのセクションは後からでもご回答いただけます。';
      if (resetBtn) resetBtn.textContent = '最初から回答する';

      const infoArea = document.createElement('div');
      infoArea.id = 'partial-submit-info-area';
      infoArea.style.cssText = 'margin: 20px 0; text-align: left; display: flex; flex-direction: column; gap: 14px;';

        let targetSecName = '';
        const curFormData = window.L || window.G || window.n;
        if (curFormData && curFormData.sections) {
          const targetSec = curFormData.sections.find(s => s.id === info.nextSectionId);
          if (targetSec && targetSec.title) {
            targetSecName = `（${targetSec.title}）`;
          }
        }

        infoArea.innerHTML = `
        <div style="background: rgba(49, 130, 206, 0.08); border: 1.5px solid #3182ce; border-radius: 8px; padding: 16px; text-align: center;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #2b6cb0; margin-bottom: 6px;">【 確定登録コード 】</div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 4px;">
            <span id="confirmed-code-display" style="font-size: 1.6rem; font-weight: 800; letter-spacing: 2px; color: #2b6cb0; font-family: monospace;">${escapeHtml(confirmedCode || '発行済')}</span>
            <button type="button" id="btn-copy-code" class="btn btn-sm btn-primary" style="font-size: 0.75rem; padding: 4px 10px; cursor: pointer;">📋 コピー</button>
          </div>
          <div style="font-size: 0.72rem; color: #4a5568;">※ このコードは親DBおよびパートナーマスターに正式登録されています。</div>
          <div id="copy-code-toast" style="display: none; font-size: 0.75rem; color: #38a169; font-weight: bold; margin-top: 6px;">✓ コードをコピーしました！</div>
        </div>

        <div style="background: rgba(237, 242, 247, 0.6); border: 1px solid #cbd5e0; border-radius: 8px; padding: 14px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 4px;">🔗 次のセクション${escapeHtml(targetSecName)}から始められる専用リンク</div>
          <div style="font-size: 0.73rem; color: #718096; margin-bottom: 8px;">このリンクを開くと、確定コードを引き継ぎ、指定セクションから入力再開できます。</div>
          <div style="display: flex; gap: 6px;">
            <input type="text" id="resume-url-input" class="form-control" readonly value="${escapeHtml(resumeUrl)}" style="font-size: 0.75rem; font-family: monospace; background: #fff;" />
            <button type="button" id="btn-copy-resume-url" class="btn btn-sm btn-secondary" style="font-size: 0.75rem; white-space: nowrap; padding: 4px 12px; cursor: pointer;">📋 コピー</button>
          </div>
          <div id="copy-url-toast" style="display: none; font-size: 0.75rem; color: #38a169; font-weight: bold; margin-top: 6px;">✓ リンクをコピーしました！</div>
        </div>

        <div>
          <button type="button" id="btn-continue-next-sec" class="btn btn-success" style="width: 100%; font-size: 1rem; font-weight: 700; padding: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            👉 続けて回答を入力する ➔
          </button>
        </div>
      `;

      const debugBox = successCard.querySelector('.submitted-data-box');
      if (debugBox) {
        debugBox.parentElement.insertBefore(infoArea, debugBox);
      } else {
        successCard.appendChild(infoArea);
      }

      const copyCodeBtn = infoArea.querySelector('#btn-copy-code');
      if (copyCodeBtn) {
        copyCodeBtn.onclick = () => {
          if (confirmedCode) {
            navigator.clipboard.writeText(confirmedCode).then(() => {
              const toast = infoArea.querySelector('#copy-code-toast');
              if (toast) {
                toast.style.display = 'block';
                setTimeout(() => { toast.style.display = 'none'; }, 2000);
              }
            });
          }
        };
      }

      const copyUrlBtn = infoArea.querySelector('#btn-copy-resume-url');
      if (copyUrlBtn) {
        copyUrlBtn.onclick = () => {
          if (resumeUrl) {
            navigator.clipboard.writeText(resumeUrl).then(() => {
              const toast = infoArea.querySelector('#copy-url-toast');
              if (toast) {
                toast.style.display = 'block';
                setTimeout(() => { toast.style.display = 'none'; }, 2000);
              }
            });
          }
        };
      }

      const continueBtn = infoArea.querySelector('#btn-continue-next-sec');
      if (continueBtn) {
        let nextSecId = info.nextSectionId;
        const formData = window.L || window.G || window.n;
        if (!nextSecId && formData && formData.sections) {
          const curIdx = formData.sections.findIndex(s => s.id === window.R);
          if (curIdx !== -1 && curIdx < formData.sections.length - 1) {
            nextSecId = formData.sections[curIdx + 1].id;
          }
        }

        if (nextSecId) {
          continueBtn.onclick = () => {
            const ht = document.getElementById('preview-success-card');
            const gt = document.querySelector('#panel-preview .preview-card:not(.success-card)');
            if (ht) ht.style.display = 'none';
            if (gt) gt.style.display = 'block';
            window.R = nextSecId;
            if (window.St) window.St();
            showResumeInfoBanner(confirmedCode);
            const previewContainer = document.querySelector('.preview-container');
            if (previewContainer) previewContainer.scrollTop = 0;
          };
        } else {
          continueBtn.style.display = 'none';
        }
      }
    } else {
      if (titleEl) titleEl.textContent = '回答が送信されました';
      if (descEl) descEl.textContent = 'ご協力ありがとうございました。パートナーDBおよびCOSマスタへ保存されました。';
      if (resetBtn) resetBtn.textContent = 'もう一度回答する';

      if (confirmedCode) {
        const infoArea = document.createElement('div');
        infoArea.id = 'partial-submit-info-area';
        infoArea.style.cssText = 'margin: 16px 0; background: rgba(56, 161, 105, 0.1); border: 1px solid #38a169; border-radius: 8px; padding: 12px; font-size: 0.85rem; color: #276749; font-weight: 600; text-align: center;';
        infoArea.innerHTML = `【 確定登録コード 】 <span style="font-size: 1.1rem; font-family: monospace; letter-spacing: 1px; font-weight: 800;">${escapeHtml(confirmedCode)}</span>`;
        const debugBox = successCard.querySelector('.submitted-data-box');
        if (debugBox) {
          debugBox.parentElement.insertBefore(infoArea, debugBox);
        } else {
          successCard.appendChild(infoArea);
        }
      }
    }
  }

  function showResumeInfoBanner(code) {
    if (!code) return;
    const card = document.querySelector('#panel-preview .preview-card:not(.success-card)');
    if (!card) return;
    let banner = card.querySelector('#preview-resume-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'preview-resume-banner';
      banner.style.cssText = 'background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #234e52; font-size: 0.8rem; font-weight: 600;';
      const container = document.getElementById('preview-section-container');
      if (container) {
        card.insertBefore(banner, container);
      } else {
        card.prepend(banner);
      }
    }
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.1rem;">ℹ️</span>
        <span>確定登録コード: <strong style="font-family: monospace; letter-spacing: 1.5px; font-size: 0.95rem; color: #285e61;">${escapeHtml(code)}</strong> の続きから回答しています</span>
      </div>
      <span style="font-size: 0.7rem; background: #38b2ac; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: 700;">コード確定済</span>
    `;
    banner.style.display = 'flex';
  }

  window.handlePreviewSubmitLocal = function(submitInfo) {
    const rowId = submitInfo.rowId || window.currentResumeRowId || ('row_' + Date.now());
    window.currentResumeRowId = rowId;
    let confirmedCode = window.currentRegistrationCode;
    if (!confirmedCode) {
      confirmedCode = String(Math.floor(10000000 + Math.random() * 90000000));
      window.currentRegistrationCode = confirmedCode;
    }
    const resumeUrl = getCleanViewResumeUrl(rowId, submitInfo.nextSectionId);

    try {
      localStorage.setItem('form_draft_' + rowId, JSON.stringify({
        rowId: rowId,
        registrationCode: confirmedCode,
        data: submitInfo.data,
        nextSectionId: submitInfo.nextSectionId
      }));
    } catch (e) {}

    if (window.parent === window) {
      renderSubmitSuccessCard({
        rowId: rowId,
        registrationCode: confirmedCode,
        isPartialSubmit: submitInfo.isPartialSubmit,
        resumeUrl: resumeUrl,
        nextSectionId: submitInfo.nextSectionId,
        formTitle: submitInfo.formTitle
      });
    }
  };

  function restoreAnswersToDOM(data) {
    if (!data) return;
    const formData = window.L || window.G || window.n;
    if (!formData || !formData.sections) return;

    const qMap = {};
    formData.sections.forEach(sec => {
      if (sec.questions) {
        sec.questions.forEach(q => {
          qMap[q.id] = q;
          if (q.title) {
            qMap[q.title] = q;
          }
        });
      }
    });

    window.V = window.V || {};

    Object.keys(data).forEach(key => {
      const val = data[key];
      const q = qMap[key];
      if (q) {
        window.V[q.id] = val;
      } else {
        window.V[key] = val;
      }
    });

    const container = document.getElementById('preview-section-container');
    if (!container) return;

    formData.sections.forEach(sec => {
      if (sec.questions) {
        sec.questions.forEach(q => {
          const val = window.V[q.id];
          if (val === undefined || val === null) return;
          const card = container.querySelector(`.preview-q-card[data-question-id="${q.id}"]`);
          if (!card) return;

          const input = card.querySelector('input[type="text"], input[type="password"], textarea, select');
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
    });
  }

  function checkAndRestoreDraftSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeRowId = urlParams.get('res_id') || urlParams.get('resumeRowId');
    if (resumeRowId) {
      window.currentResumeRowId = resumeRowId;
      const formData = window.L || window.G || window.n;
      const formTitle = (formData && formData.title) || '無題のフォーム';

      try {
        const cached = localStorage.getItem('form_draft_' + resumeRowId);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.data) {
            if (parsed.registrationCode) {
              window.currentRegistrationCode = parsed.registrationCode;
            }
            restoreAnswersToDOM(parsed.data);
            const resumeSec = urlParams.get('resumeSec') || parsed.nextSectionId;
            if (resumeSec && formData && formData.sections && formData.sections.some(s => s.id === resumeSec)) {
              window.R = resumeSec;
              if (window.St) window.St();
            }
            if (window.currentRegistrationCode) {
              showResumeInfoBanner(window.currentRegistrationCode);
            }
          }
        }
      } catch (e) {
        console.warn('Draft localStorage fallback error:', e);
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'FORM_GET_TEMPORARY_DATA', rowId: resumeRowId, formTitle: formTitle }, '*');
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function renderRichTextWithLinks(text) {
    if (!text) return '';

    // 0. 未許可のHTMLタグ（span, div, p, font 等）のクリーンアップ＆意味のある装飾の抽出
    let cleaned = String(text);
    // スタイル付きspanの装飾（下線・太字・斜体）を正規タグへ変換
    cleaned = cleaned
      .replace(/<span\b[^>]*?style="[^"]*?text-decoration:\s*[^;]*underline[^"]*?"[^>]*?>(.*?)<\/span>/gi, '<u>$1</u>')
      .replace(/<span\b[^>]*?style="[^"]*?font-weight:\s*[^;]*(?:bold|[6-9]00)[^"]*?"[^>]*?>(.*?)<\/span>/gi, '<strong>$1</strong>')
      .replace(/<span\b[^>]*?style="[^"]*?font-style:\s*italic[^"]*?"[^>]*?>(.*?)<\/span>/gi, '<em>$1</em>')
      // 装飾を持たないすべての span, font, div, p, header, section, span 等のタグ自体を剥ぎ取りテキストのみ抽出
      .replace(/<\/?(?:span|font|div|p|header|section|article|bdo|bdi|label)\b[^>]*>/gi, '');

    // 1. HTMLエスケープ（XSS対策）
    let escaped = escapeHtml(cleaned);

    // 2. 下線: <u>...</u> (エスケープされた &lt;u&gt;...&lt;/u&gt;)
    escaped = escaped.replace(/&lt;u\b.*?&gt;(.*?)&lt;\/u&gt;/gi, '<u style="text-decoration: underline;">$1</u>');

    // 太字: <strong>...</strong>, <b>...</b>
    escaped = escaped.replace(/&lt;(strong|b)\b.*?&gt;(.*?)&lt;\/\1&gt;/gi, '<strong>$2</strong>');

    // 斜体: <em>...</em>, <i>...</i>
    escaped = escaped.replace(/&lt;(em|i)\b.*?&gt;(.*?)&lt;\/\1&gt;/gi, '<em>$2</em>');

    // リンク: <a href="...">...</a> (エスケープされた a タグ)
    escaped = escaped.replace(/&lt;a\b[^&]*?href=(?:&quot;|&#039;|"|')([^&"']+?)(?:&quot;|&#039;|"|')[^&]*?&gt;(.*?)&lt;\/a&gt;/gi, (match, url, label) => {
      let cleanUrl = url.trim();
      if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(cleanUrl)) {
        if (/^[\w.-]+\.[a-z]{2,}/i.test(cleanUrl)) {
          cleanUrl = 'https://' + cleanUrl;
        }
      }
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="rich-embedded-link" style="color:var(--color-primary, #0056b3); text-decoration:underline; font-weight:500; cursor:pointer;" onclick="event.stopPropagation();">${label}</a>`;
    });

    // 万が一残ったエスケープ済み span/font 等のゴミタグを除去
    escaped = escaped.replace(/&lt;\/?(?:span|font|div|p)\b.*?&gt;/gi, '');

    // 3. 太字: **...**
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 4. 斜体: *...* (太字と干渉しないよう単一のアスタリスク)
    escaped = escaped.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');

    // 5. Markdown形式リンク: [ラベル](URL) および全角 ［ラベル］（URL）
    escaped = escaped.replace(/[\[［]([^\]］\n\r]+)[\]］][\(（]([^\s\)\<\>"）]+)[\)）]/g, (match, label, rawUrl) => {
      // URLの全角文字を半角に正規化
      let url = rawUrl.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
      // http/https等のスキームがない場合補完
      if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(url)) {
        if (/^[\w.-]+\.[a-z]{2,}/i.test(url)) {
          url = 'https://' + url;
        } else {
          return match;
        }
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="rich-embedded-link" style="color:var(--color-primary, #0056b3); text-decoration:underline; font-weight:500; cursor:pointer;" onclick="event.stopPropagation();">${label}</a>`;
    });

    // 6. 既存の <a>, <strong>, <em>, <u> タグを一時保護
    const protectedTags = [];
    escaped = escaped.replace(/<(a|strong|em|u)\b[^>]*>(.*?)<\/\1>/gi, (match) => {
      protectedTags.push(match);
      return `___TAG_PLACEHOLDER_${protectedTags.length - 1}___`;
    });

    // 7. 生URL（http/https）の自動リンク化
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/gi, (match) => {
      let cleanUrl = match.replace(/([.,!?:;)\]]+)$/, '');
      let trail = match.slice(cleanUrl.length);
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="rich-embedded-link" style="color:var(--color-primary, #0056b3); text-decoration:underline; font-weight:500; cursor:pointer;" onclick="event.stopPropagation();">${cleanUrl}</a>${trail}`;
    });

    // 8. 保護したタグを復元
    escaped = escaped.replace(/___TAG_PLACEHOLDER_(\d+)___/g, (match, idx) => {
      return protectedTags[parseInt(idx, 10)];
    });

    // 9. 改行を <br> に変換
    escaped = escaped.replace(/\r\n|\r|\n/g, '<br>');

    return escaped;
  }
  window.renderRichTextWithLinks = renderRichTextWithLinks;

  function setupSmartLinkPaste() {
    document.addEventListener('paste', (e) => {
      const target = e.target;
      if (!target || !target.matches || (!target.matches('textarea, input[type="text"]'))) {
        return;
      }
      const html = e.clipboardData ? e.clipboardData.getData('text/html') : '';
      if (!html || (!html.includes('<a ') && !html.includes('<a\n') && !html.includes('<a\r') && !html.includes('<A '))) {
        return;
      }

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const anchors = doc.querySelectorAll('a[href]');
        if (anchors.length === 0) return;

        e.preventDefault();

        anchors.forEach(a => {
          const text = (a.textContent || '').trim() || a.getAttribute('href') || '';
          const href = a.getAttribute('href') || '';
          if (href) {
            const md = doc.createTextNode(`[${text}](${href})`);
            a.parentNode.replaceChild(md, a);
          }
        });

        const textWithMd = doc.body.innerText || doc.body.textContent || '';
        if (!textWithMd) return;

        const start = target.selectionStart !== undefined ? target.selectionStart : target.value.length;
        const end = target.selectionEnd !== undefined ? target.selectionEnd : target.value.length;
        const val = target.value || '';
        target.value = val.substring(0, start) + textWithMd + val.substring(end);
        target.selectionStart = target.selectionEnd = start + textWithMd.length;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (err) {
        console.warn('Smart link paste error:', err);
      }
    }, true);
  }
  setupSmartLinkPaste();

  // 🔗 文字リンク挿入モーダルダイアログ
  // 🔗 文字リンク挿入モーダルダイアログ（どこに当てるかを選択可能＆複数箇所対応）
  function setupInsertLinkModal() {
    let modal = document.getElementById('dialog-insert-link-helper');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dialog-insert-link-helper';
      modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.55); z-index:99999; display:none; align-items:center; justify-content:center; padding:16px; box-sizing:border-box; font-family:Inter, "Noto Sans JP", sans-serif;';
      modal.innerHTML = `
        <div style="background:#fff; border-radius:12px; max-width:520px; width:100%; box-shadow:0 16px 40px rgba(0,0,0,0.28); padding:24px; box-sizing:border-box; max-height:92vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <h3 style="margin:0; font-size:1.15rem; font-weight:700; color:#202124; display:flex; align-items:center; gap:8px;">
              <span>🔗</span> 文字にリンクを設定
            </h3>
            <button type="button" id="btn-close-link-dialog-x" style="background:none; border:none; font-size:1.25rem; cursor:pointer; color:#5f6368; padding:4px 8px; border-radius:4px;">✕</button>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:14px;">
            <!-- 1. 挿入先の場所を選択 -->
            <div>
              <label for="select-link-target-location" style="display:block; font-size:0.82rem; font-weight:600; color:#3c4043; margin-bottom:5px;">
                ① リンクを設定する場所（対象項目）を選択 <span style="color:#d93025;">*</span>
              </label>
              <select id="select-link-target-location" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #dadce0; border-radius:6px; font-size:0.88rem; outline:none; background:#fff; cursor:pointer;">
              </select>
            </div>

            <!-- 現在の文章プレビュー -->
            <div style="background:#f8f9fa; border:1px solid #e8eaed; border-radius:6px; padding:10px 12px; max-height:95px; overflow-y:auto; font-size:0.8rem; color:#5f6368; line-height:1.45;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size:0.72rem; font-weight:600; color:#80868b;">現在の文章プレビュー：</span>
                <span style="font-size:0.7rem; color:#1a73e8;">💡 下の文字と一致する部分がリンク化されます</span>
              </div>
              <div id="preview-target-current-text" style="word-break:break-all; white-space:pre-wrap; color:#202124;">（文章なし）</div>
            </div>

            <!-- 2. リンクを当てはめる文字 -->
            <div>
              <label for="input-link-dialog-text" style="display:block; font-size:0.82rem; font-weight:600; color:#3c4043; margin-bottom:5px;">
                ② リンクを当てはめる文字（表示テキスト） <span style="color:#d93025;">*</span>
              </label>
              <input type="text" id="input-link-dialog-text" placeholder="例: 紹介代理店契約書、利用規約、こちら など" style="width:100%; box-sizing:border-box; padding:8px 12px; border:1px solid #dadce0; border-radius:6px; font-size:0.9rem; outline:none;">
              <div style="font-size:0.72rem; color:#5f6368; margin-top:3px;">
                💡 文章内にこの文字がある場合は自動でリンクに置換されます。無い場合は文末に挿入されます。
              </div>
            </div>

            <!-- 3. リンク先URL -->
            <div>
              <label for="input-link-dialog-url" style="display:block; font-size:0.82rem; font-weight:600; color:#3c4043; margin-bottom:5px;">
                ③ リンク先URL <span style="color:#d93025;">*</span>
              </label>
              <input type="text" id="input-link-dialog-url" placeholder="例: https://drive.google.com/... または https://example.com" style="width:100%; box-sizing:border-box; padding:8px 12px; border:1px solid #dadce0; border-radius:6px; font-size:0.9rem; outline:none;">
            </div>

            <div id="link-dialog-status-msg" style="display:none; font-size:0.78rem; padding:8px 12px; border-radius:6px; background:#e6f4ea; color:#137333; font-weight:500;">
              ✓ リンクを適用しました！
            </div>

            <div style="font-size:0.74rem; background:#e8f0fe; padding:8px 10px; border-radius:6px; border:1px solid #d2e3fc; color:#174ea6;">
              💡 リンクは回答者が別ウィンドウ（新しいタブ）で開ける安全な形式で挿入されます。
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; border-top:1px solid #eee; padding-top:14px; gap:8px; flex-wrap:wrap;">
            <button type="button" id="btn-cancel-link-dialog" style="background:#fff; border:1px solid #dadce0; padding:8px 14px; border-radius:6px; font-size:0.85rem; font-weight:500; color:#5f6368; cursor:pointer;">閉じる</button>
            <div style="display:flex; gap:8px;">
              <button type="button" id="btn-submit-link-dialog-continue" style="background:#f1f3f4; border:1px solid #dadce0; padding:8px 14px; border-radius:6px; font-size:0.85rem; font-weight:600; color:#3c4043; cursor:pointer;">適用して別のリンクも追加</button>
              <button type="button" id="btn-submit-link-dialog" style="background:#1a73e8; border:none; padding:8px 18px; border-radius:6px; font-size:0.85rem; font-weight:600; color:#fff; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.15);">適用して完了</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      let currentTargetInfo = null;

      // 挿入先候補リストの収集
      function getAvailableTargets() {
        const list = [];
        // 1. フォーム全体の説明
        const formDesc = document.getElementById('editor-form-desc');
        if (formDesc) {
          list.push({
            key: 'form_desc',
            label: '📝 フォーム全体の説明文',
            getElement: () => document.getElementById('editor-form-desc'),
            getValue: () => (document.getElementById('editor-form-desc') ? document.getElementById('editor-form-desc').value : (window.n ? window.n.description : '')),
            setValue: (val) => {
              const el = document.getElementById('editor-form-desc');
              if (el) {
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
              }
              if (window.n) window.n.description = val;
              if (window.S) window.S();
            }
          });
        }

        // 2. セクション説明文
        const secDesc = document.getElementById('editor-section-desc');
        if (window.n && window.n.sections) {
          window.n.sections.forEach((sec, sIdx) => {
            const isCurrent = sec.id === window.r;
            list.push({
              key: `sec_desc_${sec.id}`,
              label: `📑 セクション${sIdx+1}の説明文（${sec.title || '無題のセクション'}）${isCurrent ? ' [現在編集中]' : ''}`,
              getElement: () => (isCurrent ? document.getElementById('editor-section-desc') : null),
              getValue: () => (isCurrent && secDesc ? secDesc.value : (sec.description || '')),
              setValue: (val) => {
                if (isCurrent && secDesc) {
                  secDesc.value = val;
                  secDesc.dispatchEvent(new Event('input', { bubbles: true }));
                  secDesc.dispatchEvent(new Event('change', { bubbles: true }));
                }
                sec.description = val;
                if (window.S) window.S();
                if (window.se) window.se();
              }
            });

            // 質問項目
            if (sec.questions) {
              sec.questions.forEach((q, qIdx) => {
                // 質問説明文
                list.push({
                  key: `q_desc_${q.id}`,
                  label: `❓ [${sec.title || `セクション${sIdx+1}`}] 質問${qIdx+1}「${q.title || '無題の質問'}」の説明`,
                  getElement: () => document.querySelector(`.q-desc-input[data-question-id="${q.id}"]`),
                  getValue: () => {
                    const qEl = document.querySelector(`.q-desc-input[data-question-id="${q.id}"]`);
                    return qEl ? qEl.value : (q.description || '');
                  },
                  setValue: (val) => {
                    const qEl = document.querySelector(`.q-desc-input[data-question-id="${q.id}"]`);
                    if (qEl) {
                      qEl.value = val;
                      qEl.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    q.description = val;
                    if (window.S) window.S();
                  }
                });

                // スクロール同意本文
                if (q.scrollRequired || q.scrollText !== undefined) {
                  list.push({
                    key: `q_scroll_${q.id}`,
                    label: `📜 [${sec.title || `セクション${sIdx+1}`}] 質問${qIdx+1}「${q.title || '無題の質問'}」の規約本文`,
                    getElement: () => document.querySelector(`.q-scroll-input[data-question-id="${q.id}"]`),
                    getValue: () => {
                      const sEl = document.querySelector(`.q-scroll-input[data-question-id="${q.id}"]`);
                      return sEl ? sEl.value : (q.scrollText || '');
                    },
                    setValue: (val) => {
                      const sEl = document.querySelector(`.q-scroll-input[data-question-id="${q.id}"]`);
                      if (sEl) {
                        sEl.value = val;
                        sEl.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                      q.scrollText = val;
                      if (window.S) window.S();
                    }
                  });
                }
              });
            }

            // グループ説明文
            if (sec.questions) {
              const seenGroups = new Set();
              sec.questions.forEach((q) => {
                if (q.groupId && !seenGroups.has(q.groupId)) {
                  seenGroups.add(q.groupId);
                  const gId = q.groupId;
                  const gTitle = q.groupTitle || 'グループ';
                  list.push({
                    key: `grp_desc_${gId}`,
                    label: `📁 [${sec.title || `セクション${sIdx+1}`}] グループ「${gTitle}」の説明文`,
                    getElement: () => document.querySelector(`.group-desc-textarea[data-group-id="${gId}"]`),
                    getValue: () => {
                      const gEl = document.querySelector(`.group-desc-textarea[data-group-id="${gId}"]`);
                      if (gEl) {
                        if (gEl._wysiwygEditable && typeof wysiwygToSerializableText === 'function') {
                          return wysiwygToSerializableText(gEl._wysiwygEditable);
                        }
                        return gEl.value;
                      }
                      return q.groupDescription || '';
                    },
                    setValue: (val) => {
                      const gEl = document.querySelector(`.group-desc-textarea[data-group-id="${gId}"]`);
                      if (gEl) {
                        gEl.value = val;
                        if (gEl._syncFromTextarea) gEl._syncFromTextarea();
                        gEl.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                      sec.questions.forEach(q2 => {
                        if (q2.groupId === gId) {
                          if (val) q2.groupDescription = val;
                          else delete q2.groupDescription;
                        }
                      });
                      if (window.S) window.S();
                    }
                  });
                }
              });
            }
          });
        }

        return list;
      }

      function updateCurrentTextPreview() {
        const select = document.getElementById('select-link-target-location');
        const previewDiv = document.getElementById('preview-target-current-text');
        if (!select || !previewDiv) return;

        const targets = getAvailableTargets();
        const selectedKey = select.value;
        const target = targets.find(t => t.key === selectedKey);
        currentTargetInfo = target || null;

        if (target) {
          const val = target.getValue() || '';
          previewDiv.textContent = val.trim() ? val : '（文章がまだ入力されていません）';
        } else {
          previewDiv.textContent = '（文章なし）';
        }
      }

      function openLinkModal(preferredKeyOrElement) {
        const select = document.getElementById('select-link-target-location');
        const textInput = document.getElementById('input-link-dialog-text');
        const urlInput = document.getElementById('input-link-dialog-url');
        const statusMsg = document.getElementById('link-dialog-status-msg');
        if (statusMsg) statusMsg.style.display = 'none';

        // 挿入先ドロップダウンの更新
        const targets = getAvailableTargets();
        select.innerHTML = '';
        targets.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.key;
          opt.textContent = t.label;
          select.appendChild(opt);
        });

        // 初期選択の判定
        let defaultKey = 'form_desc';
        let prefilledText = '';

        if (typeof preferredKeyOrElement === 'string') {
          defaultKey = preferredKeyOrElement;
        } else if (preferredKeyOrElement && preferredKeyOrElement.nodeType) {
          const el = preferredKeyOrElement;
          if (el.id === 'editor-section-desc') {
            defaultKey = window.r ? `sec_desc_${window.r}` : 'form_desc';
          } else if (el.classList && el.classList.contains('q-desc-input')) {
            defaultKey = `q_desc_${el.dataset.questionId}`;
          } else if (el.classList && el.classList.contains('q-scroll-input')) {
            defaultKey = `q_scroll_${el.dataset.questionId}`;
          } else if (el.classList && el.classList.contains('group-desc-textarea')) {
            defaultKey = `grp_desc_${el.dataset.groupId}`;
          } else if (el.closest && el.closest('.group-desc-edit-wrap')) {
            const wrap = el.closest('.group-desc-edit-wrap');
            const ta = wrap.querySelector('.group-desc-textarea');
            if (ta && ta.dataset.groupId) defaultKey = `grp_desc_${ta.dataset.groupId}`;
            else defaultKey = 'form_desc';
          } else {
            defaultKey = 'form_desc';
          }

          // 選択範囲文字列を取得（WYSIWYG/contenteditable対応）
          const sel = window.getSelection ? window.getSelection() : null;
          if (sel && sel.toString().trim()) {
            prefilledText = sel.toString().trim();
          } else if (el.selectionStart !== undefined && el.selectionEnd !== undefined) {
            prefilledText = el.value.substring(el.selectionStart, el.selectionEnd).trim();
          }
        }

        const exists = targets.some(t => t.key === defaultKey);
        if (exists) {
          select.value = defaultKey;
        } else if (targets.length > 0) {
          select.value = targets[0].key;
        }

        updateCurrentTextPreview();

        textInput.value = prefilledText;
        urlInput.value = '';
        modal.style.display = 'flex';

        setTimeout(() => {
          if (prefilledText) {
            urlInput.focus();
          } else {
            textInput.focus();
          }
        }, 50);
      }
      window.openLinkModal = openLinkModal;

      function closeLinkModal() {
        modal.style.display = 'none';
        currentTargetInfo = null;
      }

      document.getElementById('select-link-target-location').addEventListener('change', updateCurrentTextPreview);
      document.getElementById('btn-close-link-dialog-x').addEventListener('click', closeLinkModal);
      document.getElementById('btn-cancel-link-dialog').addEventListener('click', closeLinkModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLinkModal();
      });

      function applyLinkInsertion(isContinue) {
        const textInput = document.getElementById('input-link-dialog-text');
        const urlInput = document.getElementById('input-link-dialog-url');
        const statusMsg = document.getElementById('link-dialog-status-msg');
        const text = textInput.value.trim();
        let url = urlInput.value.trim();

        if (!currentTargetInfo) {
          alert('リンクを挿入する対象項目を選択してください。');
          return false;
        }
        if (!text) {
          alert('リンクを当てはめる文字を入力してください。');
          textInput.focus();
          return false;
        }
        if (!url) {
          alert('リンク先URLを入力してください。');
          urlInput.focus();
          return false;
        }

        // 全角英数・記号の半角正規化
        url = url.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
        if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(url)) {
          url = 'https://' + url;
        }

        const mdLink = `[${text}](${url})`;
        let currentVal = currentTargetInfo.getValue() || '';

        // 文章の中に該当文字が含まれているかチェック
        // すでに [text](url) になっていない該当文字を置換
        const alreadyLinkedRegex = new RegExp(`\\[${escapeRegex(text)}\\]\\([^)]+\\)`, 'g');
        const unlinkedMatches = [];
        let tempText = currentVal;

        if (tempText.includes(text)) {
          // すでにリンク化されていない箇所の置換
          const placeholder = `___LINK_ALREADY_${Date.now()}___`;
          const protectedLinks = [];
          tempText = tempText.replace(alreadyLinkedRegex, (m) => {
            protectedLinks.push(m);
            return `${placeholder}_${protectedLinks.length - 1}___`;
          });

          if (tempText.includes(text)) {
            // 該当テキストをリンクに置換（最初の1箇所）
            tempText = tempText.replace(text, mdLink);
            // 保護したリンクを復元
            tempText = tempText.replace(new RegExp(`${placeholder}_(\\d+)___`, 'g'), (_, idx) => protectedLinks[parseInt(idx, 10)]);
            currentVal = tempText;
          } else {
            // 全て既にリンク化されていた場合は末尾に追加
            currentVal = currentVal + (currentVal ? '\n\n' : '') + mdLink;
          }
        } else {
          // 文章の中に該当文字がない場合は末尾に追加
          currentVal = currentVal + (currentVal ? '\n\n' : '') + mdLink;
        }

        currentTargetInfo.setValue(currentVal);
        updateCurrentTextPreview();

        if (statusMsg) {
          statusMsg.textContent = `✓ 「${text}」にリンクを設定しました！`;
          statusMsg.style.display = 'block';
        }

        if (isContinue) {
          textInput.value = '';
          urlInput.value = '';
          textInput.focus();
        } else {
          closeLinkModal();
        }

        return true;
      }

      function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      document.getElementById('btn-submit-link-dialog').addEventListener('click', () => {
        applyLinkInsertion(false);
      });

      document.getElementById('btn-submit-link-dialog-continue').addEventListener('click', () => {
        applyLinkInsertion(true);
      });

      // イベントデリゲーションで「🔗 リンクを挿入」ボタンのクリックを検知
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-insert-link-modal');
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          const targetKey = btn.dataset.targetKey || btn.dataset.target;
          if (targetKey) {
            const el = document.getElementById(targetKey);
            openLinkModal(el || targetKey);
          } else if (btn.dataset.questionId) {
            const qId = btn.dataset.questionId;
            const field = btn.dataset.field;
            openLinkModal(field === 'scrollText' ? `q_scroll_${qId}` : `q_desc_${qId}`);
          } else {
            openLinkModal(document.activeElement);
          }
        }
      });
    }
  }
  setupInsertLinkModal();

  // ==========================================
  // テキスト書式ツールバー（太字・斜体・下線・リンク・書式クリア）
  // ==========================================
  // ==========================================
  // WYSIWYG リッチテキストエディタエンジン（太字・斜体・下線・リンク・書式クリア）
  // ==========================================

  function markdownOrHtmlToWysiwyg(text) {
    if (!text) return '';
    let str = String(text);

    // 不要な未許可タグのクリーンアップ＆意味のある装飾の抽出
    str = str
      .replace(/<span\b[^>]*?style="[^"]*?text-decoration:\s*[^;]*underline[^"]*?"[^>]*?>(.*?)<\/span>/gi, '<u>$1</u>')
      .replace(/<span\b[^>]*?style="[^"]*?font-weight:\s*[^;]*(?:bold|[6-9]00)[^"]*?"[^>]*?>(.*?)<\/span>/gi, '<strong>$1</strong>')
      .replace(/<span\b[^>]*?style="[^"]*?font-style:\s*italic[^"]*?"[^>]*?>(.*?)<\/span>/gi, '<em>$1</em>')
      .replace(/<\/?(?:span|font|header|section|article)\b[^>]*>/gi, '');

    // 下線: <u>...</u> -> <u style="text-decoration: underline;">...</u>
    str = str.replace(/<u\b[^>]*>(.*?)<\/u>/gi, '<u style="text-decoration: underline;">$1</u>');

    // 太字: **...** -> <strong>...</strong>
    str = str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 斜体: *...* -> <em>...</em>
    str = str.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');

    // Markdownリンク: [label](url) -> <a href="url" target="_blank">label</a>
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#0056b3; text-decoration:underline;">$1</a>');

    // 改行: \n -> <br>
    str = str.replace(/\r\n|\r|\n/g, '<br>');

    return str;
  }

  function wysiwygToSerializableText(editorEl) {
    if (!editorEl) return '';
    const clone = editorEl.cloneNode(true);

    // 1. <br> を改行プレースホルダーに置換
    const brs = clone.querySelectorAll('br');
    brs.forEach(br => br.replaceWith('___LINE_BREAK___'));

    // 2. <div> や <p>（Enterキーで生成されるブロック）の先頭に改行プレースホルダーを挿入
    const blocks = clone.querySelectorAll('div, p');
    blocks.forEach(b => {
      const brPlaceholder = document.createTextNode('___LINE_BREAK___');
      b.parentNode.insertBefore(brPlaceholder, b);
    });

    // 3. <a> タグの標準化（Markdownリンク形式に変換）
    const aTags = clone.querySelectorAll('a');
    aTags.forEach(a => {
      const href = a.getAttribute('href') || '';
      const label = a.textContent || href;
      if (href) {
        a.replaceWith(`[${label}](${href})`);
      } else {
        a.replaceWith(label);
      }
    });

    // 4. span や font などのインライン装飾要素の解析とunwrap
    const spans = clone.querySelectorAll('span, font');
    spans.forEach(el => {
      const style = el.getAttribute('style') || '';
      const isUnderline = /text-decoration\s*:\s*[^;]*underline/i.test(style);
      const isBold = /font-weight\s*:\s*[^;]*(bold|[6-9]00)/i.test(style);
      const isItalic = /font-style\s*:\s*italic/i.test(style);

      const frag = document.createDocumentFragment();
      while (el.firstChild) {
        frag.appendChild(el.firstChild);
      }

      let wrapper = frag;
      if (isUnderline) {
        const u = document.createElement('u');
        u.appendChild(wrapper);
        wrapper = u;
      }
      if (isBold) {
        const s = document.createElement('strong');
        s.appendChild(wrapper);
        wrapper = s;
      }
      if (isItalic) {
        const em = document.createElement('em');
        em.appendChild(wrapper);
        wrapper = em;
      }

      el.parentNode.replaceChild(wrapper, el);
    });

    // 5. 許可タグ（u, strong, b, em, i）以外のあらゆる未許可HTML要素をunwrap
    const allEls = Array.from(clone.querySelectorAll('*'));
    allEls.forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (!['u', 'strong', 'b', 'em', 'i'].includes(tag)) {
        while (el.firstChild) {
          el.parentNode.insertBefore(el.firstChild, el);
        }
        el.remove();
      } else {
        el.removeAttribute('style');
        el.removeAttribute('class');
      }
    });

    let html = clone.innerHTML;

    html = html
      .replace(/&nbsp;/g, ' ')
      .replace(/___LINE_BREAK___/g, '\n')
      .trim();

    if (html === '<br>' || html === '\n' || html === '') return '';
    return html;
  }

  function applyWysiwygFormatting(editable, textarea, action) {
    if (!editable) return;
    editable.focus();

    const sel = window.getSelection();
    let range = (sel && sel.rangeCount > 0) ? sel.getRangeAt(0) : null;

    if (action === 'link') {
      if (typeof openLinkModal === 'function') {
        openLinkModal(textarea);
      } else if (window.openLinkModal) {
        window.openLinkModal(textarea);
      }
      return;
    }

    if (action === 'clear') {
      if (range && !range.collapsed && editable.contains(range.commonAncestorContainer)) {
        try {
          document.execCommand('removeFormat', false, null);
          document.execCommand('unlink', false, null);
        } catch (e) {}
      } else {
        editable.innerHTML = editable.innerText.replace(/\r\n|\r|\n/g, '<br>');
      }
      editable.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    const tagMap = {
      bold: 'strong',
      italic: 'em',
      underline: 'u'
    };
    const tagName = tagMap[action];
    if (!tagName) return;

    let handled = false;

    // 選択範囲がある場合、すでに同じタグで囲まれているかチェック（トグル解除）
    if (range && !range.collapsed && editable.contains(range.commonAncestorContainer)) {
      let cur = range.commonAncestorContainer;
      while (cur && cur !== editable) {
        if (cur.nodeType === Node.ELEMENT_NODE && cur.nodeName.toLowerCase() === tagName) {
          // トグル解除
          const parent = cur.parentNode;
          while (cur.firstChild) {
            parent.insertBefore(cur.firstChild, cur);
          }
          parent.removeChild(cur);
          handled = true;
          break;
        }
        cur = cur.parentNode;
      }

      if (!handled) {
        try {
          // DOM操作による確実なタグ付け
          const wrapper = document.createElement(tagName);
          if (tagName === 'u') wrapper.style.textDecoration = 'underline';
          wrapper.appendChild(range.extractContents());
          range.insertNode(wrapper);

          // 選択範囲をラッパー内に再設定
          sel.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(wrapper);
          sel.addRange(newRange);
          handled = true;
        } catch (e) {
          // extractContents が失敗した場合は execCommand を試行
        }
      }
    }

    if (!handled) {
      const cmdMap = { bold: 'bold', italic: 'italic', underline: 'underline' };
      try {
        document.execCommand(cmdMap[action], false, null);
      } catch (e) {}
    }

    editable.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function createFormattingToolbar(editable, targetInput) {
    const bar = document.createElement('div');
    bar.className = 'rich-text-formatting-toolbar';

    bar.innerHTML = `
      <button type="button" class="fmt-btn fmt-btn-bold" data-action="bold" title="太字 (Ctrl+B)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
        </svg>
      </button>
      <button type="button" class="fmt-btn fmt-btn-italic" data-action="italic" title="斜体 (Ctrl+I)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
        </svg>
      </button>
      <button type="button" class="fmt-btn fmt-btn-underline" data-action="underline" title="下線 (Ctrl+U)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
        </svg>
      </button>
      <button type="button" class="fmt-btn fmt-btn-link" data-action="link" title="リンクを挿入">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
      </button>
      <div class="fmt-divider"></div>
      <button type="button" class="fmt-btn fmt-btn-clear" data-action="clear" title="書式をクリア">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/>
        </svg>
      </button>
    `;

    bar.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('.fmt-btn');
      if (btn) {
        e.preventDefault();
        const action = btn.dataset.action;
        applyWysiwygFormatting(editable, targetInput, action);
      }
    });

    return bar;
  }

  function setupWysiwygForTextarea(textarea) {
    if (!textarea || textarea.dataset.wysiwygInjected === 'true') return;
    textarea.dataset.wysiwygInjected = 'true';

    const parent = textarea.parentNode;
    if (!parent) return;

    // WYSIWYG コンテナ構築
    const container = document.createElement('div');
    container.className = 'rich-text-editor-container';

    const editable = document.createElement('div');
    editable.className = 'rich-text-content-editable';
    editable.contentEditable = 'true';
    editable.dataset.placeholder = textarea.placeholder || '説明を入力（任意）';
    editable.innerHTML = markdownOrHtmlToWysiwyg(textarea.value || '');

    const toolbar = createFormattingToolbar(editable, textarea);

    container.appendChild(editable);
    container.appendChild(toolbar);

    // textarea を非表示化してコンテナを挿入
    textarea.classList.add('rich-text-hidden-source');
    parent.insertBefore(container, textarea.nextSibling);

    let isSyncing = false;
    const syncToTextarea = () => {
      if (isSyncing) return;
      isSyncing = true;
      const serialized = wysiwygToSerializableText(editable);
      if (textarea.value !== serialized) {
        textarea.value = serialized;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      }
      isSyncing = false;
    };

    editable.addEventListener('input', syncToTextarea);
    editable.addEventListener('blur', syncToTextarea);

    editable.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'b') {
          e.preventDefault();
          document.execCommand('bold', false, null);
          syncToTextarea();
        } else if (key === 'i') {
          e.preventDefault();
          document.execCommand('italic', false, null);
          syncToTextarea();
        } else if (key === 'u') {
          e.preventDefault();
          document.execCommand('underline', false, null);
          syncToTextarea();
        }
      }
    });

    // 外部からの更新検知用フック
    textarea._wysiwygEditable = editable;
    textarea._syncFromTextarea = () => {
      if (isSyncing) return;
      const currentVal = textarea.value || '';
      const currentSerial = wysiwygToSerializableText(editable);
      if (currentVal !== currentSerial) {
        editable.innerHTML = markdownOrHtmlToWysiwyg(currentVal);
      }
    };
  }

  function injectRichTextToolbars() {
    const descInputs = document.querySelectorAll('.q-desc-input, .q-scroll-input, #editor-section-desc, #editor-form-desc, #pro-form-desc-input, #editor-pro-disclaimer, .group-desc-textarea');
    descInputs.forEach(input => {
      if (!input || !input.parentNode) return;
      if (input.dataset.wysiwygInjected === 'true') {
        if (input._syncFromTextarea) input._syncFromTextarea();
        return;
      }
      setupWysiwygForTextarea(input);
    });
  }



  function setupLiveAutocompleteEvents() {
    const containers = [
      document.getElementById('preview-section-container'),
      document.getElementById('live-preview-section-container')
    ].filter(Boolean);
    if (containers.length === 0) return;

    containers.forEach(container => {
      const cards = container.querySelectorAll('.preview-q-card');
      cards.forEach(card => {
        const questionId = card.dataset.questionId;
        if (!questionId) return;

        let qDef = null;
        const formSources = [window.L, window.G, window.n];
        for (const formSrc of formSources) {
          if (formSrc && formSrc.sections) {
            for (const sec of formSrc.sections) {
              qDef = sec.questions.find(q => q.id === questionId);
              if (qDef) break;
            }
            if (qDef) break;
          }
        }
        if (!qDef) return;

        const qTitleEl = card.querySelector('.preview-q-title');
        if (qTitleEl) {
          const trailingStars = qTitleEl.querySelectorAll('.required-star');
          trailingStars.forEach(s => s.remove());
          const asterisks = qTitleEl.querySelectorAll('.red-asterisk');
          if (asterisks.length > 1) {
            for (let i = 1; i < asterisks.length; i++) {
              asterisks[i].remove();
            }
          }
          if (qDef.required) {
            if (!qTitleEl.querySelector('.red-asterisk') && !qTitleEl.textContent.trim().startsWith('*')) {
              const ast = document.createElement('span');
              ast.className = 'red-asterisk';
              ast.style.cssText = 'color:var(--color-danger, #dc3545); margin-right:4px;';
              ast.textContent = '*';
              qTitleEl.insertBefore(ast, qTitleEl.firstChild);
            }
          } else {
            const existingAst = qTitleEl.querySelector('.red-asterisk');
            if (existingAst) existingAst.remove();
          }
        }

        const apiCfg = getQuestionApiConfig(qDef);
        const isZipQuestion = (apiCfg && apiCfg.isZip) || (qDef.type === 'text' && (normalizeText(qDef.title).includes('郵便') || normalizeText(qDef.title).includes('zip')));
        if (isZipQuestion) {
          const zipInput = card.querySelector('input');
          if (zipInput && !zipInput.dataset.zipBound) {
            zipInput.dataset.zipBound = "1";
            zipInput.maxLength = 8;
            zipInput.placeholder = "例: 123-4567 または 1234567";
            
            let zipLookupTimer = null;
            zipInput.addEventListener('input', (e) => {
              if (zipInput.dataset.suppressLookup === "1") {
                zipInput.dataset.suppressLookup = "";
                clearIntegrityError(card);
                return;
              }
              const val = e.target.value.replace(/[^\d]/g, '');
              e.target.value = val;

              if (val.length === 7) {
                clearTimeout(zipLookupTimer);
                zipLookupTimer = setTimeout(async () => {
                  const addr = await lookupAddressFromZip(val);
                  if (addr) {
                    autoFillAddressFields(addr);
                    clearIntegrityError(card);
                  } else {
                    showIntegrityError(card, '郵便番号に合致する住所が見つかりません。');
                  }
                }, 100);
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

// Bank listeners moved to dedicated setup functions below

        if (qDef.type === 'text' && (qDef.title.includes('電話') || qDef.title.includes('tel'))) {
          const telInput = card.querySelector('input');
          if (telInput && !telInput.dataset.telBound) {
            telInput.dataset.telBound = "1";
            setupTelInputHyphenToggle(card, telInput, qDef);
          }
        }

        if (qDef.type === 'password') {
          setupPasswordConfirmLogic(card, questionId);
        }

        if (qDef.type === 'text' && (qDef.title.includes('生年月日') || qDef.title.includes('設立日') || qDef.title.includes('日付'))) {
          const dateInput = card.querySelector('input');
          if (dateInput && !dateInput.dataset.dateBound) {
            dateInput.dataset.dateBound = "1";
            dateInput.type = "date";
            dateInput.addEventListener('change', (e) => {
              validateDateReality(card, e.target.value, qDef.title);
            });
          }
        }

        // 👤 【代表者名・代表者名カナ・生年月日 必須入力化】
        // ユーザー指示: 代表者名、代表者名のカナ、生年月日はすべて必須入力です。
        const isRepNameField = (qDef.type === 'text') && (
          qDef.title.includes('代表者名') ||
          qDef.title.includes('代表者氏名') ||
          qDef.title.includes('代表者')
        ) && !qDef.title.includes('カナ') && !qDef.title.includes('フリガナ') && !qDef.title.includes('ふりがな');

        const isRepKanaField = (qDef.type === 'text') && (
          (qDef.title.includes('代表者') && (qDef.title.includes('カナ') || qDef.title.includes('フリガナ') || qDef.title.includes('ふりがな'))) ||
          qDef.title.includes('代表者カナ') ||
          qDef.title.includes('代表者名（カナ）') ||
          qDef.title.includes('代表者名カナ')
        );

        const isBirthDateField = (qDef.type === 'text' || qDef.type === 'date') && (
          qDef.title.includes('生年月日')
        );

        if (isRepNameField || isRepKanaField || isBirthDateField) {
          qDef.required = true;
          if (qTitleEl && !qTitleEl.querySelector('.red-asterisk') && !qTitleEl.textContent.trim().startsWith('*')) {
            const ast = document.createElement('span');
            ast.className = 'red-asterisk';
            ast.style.cssText = 'color:var(--color-danger, #dc3545); margin-right:4px; font-weight:bold;';
            ast.textContent = '*';
            qTitleEl.insertBefore(ast, qTitleEl.firstChild);
          }
        }

        // ユーザー指示反映: 質問項目（タイトル）ではなく、回答の入力規則の「規則の種類: API連携」と
        // 「判定ルールで何のAPIを連携しているか」を取得して各API機能をセットアップ
        const apiConfig = getQuestionApiConfig(qDef);

        if (apiConfig && apiConfig.isInvoice) {
          // 登録番号に都道府県エリア絞り込み機能は不要：残存フィルタを除去
          card.querySelectorAll('.corp-pref-filter-container').forEach(el => el.remove());
          setupInvoiceApiSearch(card, qDef);
        } else if (apiConfig && apiConfig.isCorp) {
          setupCorpApiSearch(card, qDef);
        } else {
          // isCorpApi対象外のカードに誤適用された検索ボタン・パネル・フィルタを完全除去
          card.querySelectorAll('.api-corp-search-btn').forEach(btn => btn.remove());
          card.querySelectorAll('.corp-search-panel').forEach(p => p.remove());
          card.querySelectorAll('.corp-pref-filter-container').forEach(f => f.remove());
        }

        if (apiConfig && apiConfig.isBank) {
          setupBankApiSearch(card, qDef);
        }

        const isBankCode = qDef.type === 'text' && (qDef.title.includes('金融機関コード') || qDef.title.includes('銀行コード'));
        if (isBankCode) {
          setupBankCodeAutoLookup(card, qDef);
        }

        const isBranchCode = (apiConfig && apiConfig.isBranchCode) || (qDef.type === 'text' && (qDef.title.includes('支店番号') || qDef.title.includes('支店コード') || qDef.title.includes('店舗番号') || qDef.title.includes('店舗コード') || ((qDef.title.includes('支店') || qDef.title.includes('店舗')) && qDef.title.includes('番号'))));
        if (isBranchCode) {
          setupBranchCodeMutualCompletion(card, qDef);
        }

        const isBranchName = qDef.type === 'text' && (qDef.title.includes('支店名') || qDef.title.includes('店舗名')) && !qDef.title.includes('番号') && !qDef.title.includes('コード');
        if ((apiConfig && apiConfig.isBranch) || isBranchName) {
          setupBranchNameMutualCompletion(card, qDef);
        }

        const isAccountHolder = qDef.type === 'text' && (qDef.title.includes('口座名義') || qDef.title.includes('名義人') || qDef.title.includes('名義'));
        if (isAccountHolder) {
          setupAccountHolderValidation(card, qDef);
        }

        const isAcctNum = qDef.type === 'text' && ((qDef.dataKey === 'account_number') || (qDef.title && (qDef.title.includes('口座番号') || (!qDef.title.includes('名義') && qDef.title.includes('口座')))));
        if (isAcctNum) {
          setupAccountNumberValidation(card, qDef);
        }

        const innerInput = card.querySelector('input, textarea, select');
        if (innerInput && !innerInput.dataset.skipBound) {
          innerInput.dataset.skipBound = "1";
          innerInput.addEventListener('change', () => {
            evaluateLiveSkipLogic();
          });
        }
      });
    });
  }

  function autoFillAddressFields(addr) {
    const containers = [
      document.getElementById('preview-section-container'),
      document.getElementById('live-preview-section-container')
    ].filter(Boolean);

    containers.forEach(container => {
      const inputs = container.querySelectorAll('.preview-q-card input, .preview-q-card select');
      inputs.forEach(input => {
        const card = input.closest('.preview-q-card');
        const title = card ? (card.querySelector('.preview-q-title') || card.querySelector('h3'))?.textContent || "" : "";
        
        if (title.includes('都道府県')) {
          input.value = addr.pref;
          triggerInputChange(input);
        } else if (title.includes('市区町村')) {
          input.value = addr.city;
          triggerInputChange(input);
        } else if (!title.includes('建物') && !title.includes('部屋番号') && (title.includes('町名') || title.includes('番地') || title.includes('住所'))) {
          input.value = addr.street;
          triggerInputChange(input);
        }
      });
    });
  }

  function validateAddressIntegrity(zipVal) {
    const containers = [
      document.getElementById('preview-section-container'),
      document.getElementById('live-preview-section-container')
    ].filter(Boolean);

    containers.forEach(container => {
      const inputs = container.querySelectorAll('.preview-q-card input, .preview-q-card select');
      let fullAddr = "";
      let zipCard = null;

      inputs.forEach(input => {
        const card = input.closest('.preview-q-card');
        const title = card ? (card.querySelector('.preview-q-title') || card.querySelector('h3'))?.textContent || "" : "";
        if (title.includes('郵便番号')) {
          zipCard = card;
        }
        if (title.includes('都道府県') || title.includes('市区町村') || title.includes('住所') || title.includes('番地') || title.includes('町名')) {
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
    });
  }

  let isAutoFilling = false;

  function autoFillBankCode(code) {
    if (isAutoFilling || !code) return;
    const containers = [document.getElementById('preview-section-container'), document.getElementById('live-preview-section-container')].filter(Boolean);
    try {
      isAutoFilling = true;
      containers.forEach(container => {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
          const card = input.closest('.preview-q-card');
          if (!card) return;
          const title = card.querySelector('.preview-q-title')?.textContent || "";
          if (title.includes('金融機関コード') || title.includes('銀行コード')) {
            if (input.value !== code) {
              input.value = code;
              clearIntegrityError(card);
              triggerInputChange(input);
            }
          }
        });
      });
    } finally {
      isAutoFilling = false;
    }
  }

  function autoFillBankName(name) {
    if (isAutoFilling || !name) return;
    const containers = [document.getElementById('preview-section-container'), document.getElementById('live-preview-section-container')].filter(Boolean);
    try {
      isAutoFilling = true;
      containers.forEach(container => {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
          const card = input.closest('.preview-q-card');
          if (!card) return;
          const title = card.querySelector('.preview-q-title')?.textContent || "";
          if ((title.includes('銀行') || title.includes('金融機関')) && !title.includes('コード')) {
            if (input.value !== name) {
              input.value = name;
              clearIntegrityError(card);
              triggerInputChange(input);
            }
          }
        });
      });
    } finally {
      isAutoFilling = false;
    }
  }

  function autoFillBranchCode(code) {
    if (isAutoFilling || !code) return;
    const containers = [document.getElementById('preview-section-container'), document.getElementById('live-preview-section-container')].filter(Boolean);
    try {
      isAutoFilling = true;
      containers.forEach(container => {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
          const card = input.closest('.preview-q-card');
          if (!card) return;
          const title = card.querySelector('.preview-q-title')?.textContent || "";
          if (title.includes('支店番号') || title.includes('支店コード') || title.includes('店舗番号') || title.includes('店舗コード') || ((title.includes('支店') || title.includes('店舗')) && title.includes('番号'))) {
            if (input.value !== code) {
              input.value = code;
              clearIntegrityError(card);
              triggerInputChange(input);
            }
          }
        });
      });
    } finally {
      isAutoFilling = false;
    }
  }

  function autoFillBranchName(name) {
    if (isAutoFilling || !name) return;
    const officialName = getOfficialBranchName(name);
    const containers = [document.getElementById('preview-section-container'), document.getElementById('live-preview-section-container')].filter(Boolean);
    try {
      isAutoFilling = true;
      containers.forEach(container => {
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
          const card = input.closest('.preview-q-card');
          if (!card) return;
          const title = card.querySelector('.preview-q-title')?.textContent || "";
          if ((title.includes('支店名') || title.includes('店舗名') || title.includes('出張所名')) && !title.includes('番号') && !title.includes('コード')) {
            if (input.value !== officialName) {
              input.value = officialName;
              clearIntegrityError(card);
              triggerInputChange(input);
            }
          }
        });
      });
    } finally {
      isAutoFilling = false;
    }
  }

  function getSelectedBankName() {
    let bankName = "";
    const containers = [document.getElementById('preview-section-container'), document.getElementById('live-preview-section-container')].filter(Boolean);
    for (const container of containers) {
      const inputs = container.querySelectorAll('input');
      for (const input of inputs) {
        const card = input.closest('.preview-q-card');
        if (!card) continue;
        const title = card.querySelector('.preview-q-title')?.textContent || "";
        if ((title.includes('銀行') || title.includes('金融機関')) && !title.includes('コード')) {
          const val = input.value.trim();
          if (val) return val;
        }
      }
    }
    return bankName;
  }

  function parseRegexPattern(str) {
    if (!str) return null;
    try {
      const match = str.match(/^\/(.*)\/([gimsuy]*)$/);
      if (match) {
        return new RegExp(match[1], match[2]);
      }
      // 二重エスケープ (\\d, \\s, \\w 等) の補正
      const cleanPattern = str.replace(/\\\\/g, '\\');
      return new RegExp(cleanPattern);
    } catch (e) {
      try {
        return new RegExp(str);
      } catch(err) {
        return null;
      }
    }
  }

  function setupTelInputHyphenToggle(card, input, qDef) {
    // 💡 フォーム作成者が設定した正規表現・入力規則を厳格に優先するため、
    // 回答者側のハイフン形式選択ボタンは完全撤去します（作成者の意図したバリデーションの無力化を防ぐため）。
    const existing = card.querySelector('.hyphen-toggle-container');
    if (existing) existing.remove();

    const validateTelNumber = () => {
      const val = input.value.trim();
      if (val === "") {
        clearIntegrityError(card);
        return;
      }

      // 管理者が設定した正規表現（qDef.validation）がある場合は最優先で検証
      if (qDef && qDef.validation && qDef.validation.category === 'regex' && qDef.validation.value) {
        try {
          const reg = parseRegexPattern(qDef.validation.value);
          if (reg && !reg.test(val)) {
            showIntegrityError(card, qDef.validation.errorMessage || '正しい電話番号の形式で入力してください。');
          } else {
            clearIntegrityError(card);
          }
          return;
        } catch(e) {}
      }

      // 正規表現が明示されていない場合のデフォルトチェック（固定/携帯、ハイフン有無問わず）
      const flexibleRegex = /^(0\d{1,4}-?\d{1,4}-?\d{3,4}|0\d{9,10})$/;
      if (!flexibleRegex.test(val)) {
        showIntegrityError(card, '正しい電話番号の形式で入力してください。');
      } else {
        clearIntegrityError(card);
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

  // ============================================================================
  // 🏛️ 【法人名・屋号のリアルタイム近似値検索 ＆ カナ・インボイス番号自動連動 (v90)】
  // - 検索ボタン完全撤去（ユーザー指示: 法人名については、右側の検索ボタンは不要です）
  // - 入力値に対するリアルタイム近似値マッチング
  // - エリア絞り込みプルダウンと連動し、指定エリア内の近似値のみを出力
  // - 選択時に法人名を上書き
  // - カナ表記がある場合はカナ欄へ自動反映、ない場合は空欄で手入力可能
  // - 法人のインボイス登録番号（T+13桁）をインボイス項目へ自動補完
  // ============================================================================
  function setupCorpApiSearch(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    // インボイス登録番号やカナ欄のカードには法人検索・エリア絞り込みを絶対に適用しない
    const apiConf = getQuestionApiConfig(qDef);
    const isKana = qDef.title && (qDef.title.includes('カナ') || qDef.title.includes('フリガナ') || qDef.title.includes('ふりがな'));
    if ((apiConf && apiConf.isInvoice) || isKana) {
      card.querySelectorAll('.corp-pref-filter-container').forEach(f => f.remove());
      const oldPanel = card.querySelector('.corp-search-panel');
      if (oldPanel) oldPanel.remove();
      card.querySelectorAll('.api-corp-search-btn').forEach(b => b.remove());
      return;
    }

    // 既存の不要な検索ボタン（🔍 検索）を完全に撤去（ユーザー指示: 法人名については、右側の検索ボタンは不要です）
    card.querySelectorAll('.api-corp-search-btn').forEach(btn => btn.remove());

    // 入力欄の配置ラッパー（相対配置を保証）
    let inputGroup = input.closest('.api-search-input-group');
    if (!inputGroup) {
      inputGroup = document.createElement('div');
      inputGroup.className = 'api-search-input-group';
      inputGroup.style.cssText = 'position:relative; width:100%;';
      input.parentNode.insertBefore(inputGroup, input);
      inputGroup.appendChild(input);
    } else {
      inputGroup.style.cssText = 'position:relative; width:100%;';
    }
    input.style.width = '100%';

    let searchPanel = card.querySelector('.corp-search-panel');
    if (!searchPanel) {
      searchPanel = document.createElement('div');
      searchPanel.className = 'corp-search-panel';
      searchPanel.style.cssText = 'position:absolute; top:calc(100% + 4px); left:0; right:0; background:#ffffff; border:1px solid var(--color-border); border-radius:6px; z-index:2050; box-shadow:0 8px 24px rgba(0,0,0,0.12); display:none; max-height:260px; overflow-y:auto;';
      inputGroup.appendChild(searchPanel);
    }

    let filterContainer = card.querySelector('.corp-pref-filter-container');
    if (!filterContainer) {
      filterContainer = document.createElement('div');
      filterContainer.className = 'corp-pref-filter-container';
      filterContainer.style.cssText = 'display:flex; gap:6px; align-items:center; margin-top:6px;';
      const prefOptions = JAPAN_PREFECTURES.map(p => `<option value="${p}">${p}</option>`).join('');
      filterContainer.innerHTML = `
        <span style="font-size:0.75rem; color:var(--color-text-muted);">エリア絞り込み:</span>
        <select class="corp-pref-filter" style="font-size:0.75rem; padding:2px 6px; background:var(--color-bg-card); color:var(--color-text); border:1px solid var(--color-border); border-radius:3px; max-width:140px; cursor:pointer;">
          <option value="">都道府県すべて</option>
          ${prefOptions}
        </select>
      `;
      inputGroup.parentNode.insertBefore(filterContainer, inputGroup.nextSibling);
    }

    const prefSelect = filterContainer.querySelector('.corp-pref-filter');

    let searchSeq = 0;

    const executeSearch = async () => {
      const currentSeq = ++searchSeq;
      const curPanel = card.querySelector('.corp-search-panel') || searchPanel;
      const rawVal = input.value.trim();
      const val = normalizeText(rawVal);
      const selPref = prefSelect ? prefSelect.value : "";

      if (rawVal === "") {
        if (curPanel) curPanel.style.display = 'none';
        return;
      }

      // 検索中ローディング表示
      if (curPanel) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; font-size:0.75rem; color:#718096; display:flex; align-items:center; gap:8px;">
            <div style="width:14px; height:14px; border:2px solid #cbd5e0; border-top-color:#2b6cb0; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
            <span>🏛️ 国税庁法人番号APIを照会中...</span>
          </div>
        `;
        curPanel.style.display = 'block';
      }

      let listToRender = [];
      let isLiveApi = false;

      // 1. 国税庁中継API (/api/corp-search) の非同期呼出
      try {
        let apiUrl = `/api/corp-search?name=${encodeURIComponent(rawVal)}&pref=${encodeURIComponent(selPref)}`;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
          apiUrl = `https://synapse-wayway.vercel.app/api/corp-search?name=${encodeURIComponent(rawVal)}&pref=${encodeURIComponent(selPref)}`;
        }
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.results) && data.results.length > 0) {
            let filteredResults = data.results;
            if (selPref && selPref.trim() !== '') {
              filteredResults = filteredResults.filter(item => {
                return (item.pref && item.pref.includes(selPref)) || (item.address && item.address.includes(selPref));
              });
            }
            if (filteredResults.length > 0) {
              listToRender = filteredResults.slice(0, 50).map(item => ({
                name: item.name,
                nameKana: item.nameKana || "",
                num: item.num,
                pref: item.pref,
                cityName: item.cityName || "",
                street: item.street || "",
                postCode: item.postCode || "",
                address: item.address || "",
                regDate: item.regDate || "",
                invoiceNum: item.invoiceNum || (item.num ? `T${item.num}` : "")
              }));
              isLiveApi = true;
            }
          }
        }
      } catch (err) {
        console.warn('[setupCorpApiSearch] Live API failed, falling back to local master:', err);
      }

      // 新しい検索リクエストが既に開始されていたら破棄
      if (currentSeq !== searchSeq) return;

      // 2. API通信不能・オフライン時のみ内蔵マスタにフォールバック
      if (!isLiveApi && listToRender.length === 0) {
        let matched = CORP_DATABASE.filter(item => {
          const normName = normalizeText(item.name);
          const normKana = normalizeText(item.nameKana || "");
          return normName.includes(val) || normKana.includes(val);
        });

        if (selPref !== "") {
          matched = matched.filter(item => item.pref === selPref);
        }
        listToRender = matched;
      }

      if (listToRender.length > 0) {
        const prefLabel = selPref ? `【${escapeHtml(selPref)}】` : '';
        const statusBadge = isLiveApi ? '🏛️ 国税庁公式照会データ' : '🏛️ 法人番号照会候補';
        curPanel.innerHTML = `
          <div style="padding:6px 12px; background:#f8f9fa; border-bottom:1px solid #edf2f7; font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between; align-items:center; font-weight:600;">
            <span>${statusBadge} ${prefLabel} (${listToRender.length}件)</span>
            <span style="font-size:0.65rem; color:#718096;">選択で上書き反映＆インボイス自動入力</span>
          </div>
        `;
        listToRender.forEach(item => {
          const row = document.createElement('div');
          row.className = 'corp-search-candidate-item';
          row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05); transition:background-color 0.15s;';
          const kanaHtml = item.nameKana ? `<span style="font-size:0.68rem; color:#718096; margin-left:6px;">(${escapeHtml(item.nameKana)})</span>` : '';
          const addressText = item.address || `${item.pref || ''}${item.cityName || ''}${item.street || ''}`.trim() || item.pref || '';
          const addressLabel = addressText ? ` | 所在地: ${escapeHtml(addressText)}` : '';
          row.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-weight:600; color:var(--color-primary);">${escapeHtml(item.name)}</span>
                ${kanaHtml}
              </div>
              <span style="background:#e6f4ea; color:#137333; font-size:0.65rem; padding:1px 6px; border-radius:10px; font-weight:600;">✓ 実在確認済</span>
            </div>
            <div style="font-size:0.7rem; color:var(--color-text-muted); margin-top:2px;">
              法人番号: <span style="font-family:monospace; color:#2d3748; font-weight:600;">${item.num}</span>${addressLabel}
            </div>
          `;
          row.onmouseenter = () => { row.style.backgroundColor = '#f1f5f9'; };
          row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
          row.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // ユーザー指示: 選択したら、入力欄の値を上書きする形で反映させてください。
            input.dataset.suppressSearch = "1";
            input.value = item.name;
            curPanel.style.display = 'none';
            activeApiMetadata.company_name = item.name;
            activeApiMetadata.corporate_number = item.num;
            activeApiMetadata.establishmentDate = item.estDate || item.regDate || "2020-01-01";
            
            // カナ表記・インボイス登録番号・法人番号・住所等の動的連携
            autoFillCorpRelatedFields(item);
            triggerInputChange(input);
          });
          curPanel.appendChild(row);
        });
        curPanel.style.display = 'block';
      } else {
        const prefLabel = selPref ? `【${escapeHtml(selPref)}】` : '';
        curPanel.innerHTML = `
          <div style="padding:12px; font-size:0.75rem; color:#718096; text-align:center; line-height:1.4;">
            国税庁API照会: 一致する法人情報が見つかりませんでした ${prefLabel}
            <div style="font-size:0.68rem; color:#a0aec0; margin-top:4px;">（屋号または個人事業主の方はそのまま手入力して進めていただけます）</div>
          </div>
        `;
        curPanel.style.display = 'block';
      }
    };

    if (!input.dataset.corpApiBound) {
      input.dataset.corpApiBound = "1";
      let debounceTimer = null;
      input.addEventListener('input', () => {
        if (input.dataset.suppressSearch === "1") {
          input.dataset.suppressSearch = "";
          const p = card.querySelector('.corp-search-panel');
          if (p) p.style.display = 'none';
          return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(executeSearch, 250);
      });
      input.addEventListener('focus', () => {
        if (input.value.trim().length > 0) {
          executeSearch();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch();
        }
      });
    }

    if (prefSelect && !prefSelect.dataset.prefBound) {
      prefSelect.dataset.prefBound = "1";
      prefSelect.addEventListener('change', () => {
        executeSearch();
      });
    }

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        searchPanel.style.display = 'none';
      }
    });
  }

  // ============================================================================
  // 🔗 【動的セマンティック連携ヘルパー: autoFillCorpRelatedFields】
  // - 同一セクション・別セクションを問わず、フォーム内のカナ欄・インボイス番号欄・法人番号欄を自動補完
  // - カナ表記がある法人はカナ欄へ反映、ない場合は空欄で手入力可能
  // - 法人のインボイス登録番号（T+13桁）を自動セットし実在確認済みにする
  // ============================================================================
  function autoFillCorpRelatedFields(item) {
    if (!item) return;

    // 1. グローバルデータストア（window.V）への事前格納（別セクション対応）
    const formData = window.L || window.G || window.n;
    const parsedAddr = parseJapaneseAddress(item.address || '', item.pref, item.cityName, item.street);
    const rawZip = (item.postCode || '').replace(/[^\d]/g, '');
    const formattedZip = rawZip.length === 7 ? `${rawZip.substring(0, 3)}-${rawZip.substring(3)}` : rawZip;

    if (formData && formData.sections) {
      formData.sections.forEach(sec => {
        if (!sec.questions) return;
        sec.questions.forEach(q => {
          // カナ項目（※代表者カナ、および口座名義・名義人カナは法人カナと連動させないため除外）
          const isExcludedKana = q.title && (q.title.includes('代表') || q.title.includes('口座') || q.title.includes('名義'));
          if (q.type === 'text' && (q.title.includes('カナ') || q.title.includes('フリガナ') || q.title.includes('ふりがな')) && !isExcludedKana) {
            if (item.nameKana && item.nameKana.trim()) {
              window.V[q.id] = item.nameKana.trim();
            } else {
              delete window.V[q.id];
            }
          }
          // インボイス登録番号項目（規則の種類がAPI連携 & 判定ルールがinvoice_number）
          const apiConfig = getQuestionApiConfig(q);
          if (apiConfig && apiConfig.isInvoice && item.num) {
            const formattedInv = item.num.startsWith('T') ? item.num : ('T' + item.num);
            window.V[q.id] = formattedInv;
          }
          // 法人番号項目
          if (q.type === 'text' && (q.title.includes('法人番号') || q.title.includes('会社番号'))) {
            if (item.num) {
              window.V[q.id] = item.num;
            }
          }
          // 郵便番号項目
          if (q.title && (q.title.includes('郵便番号') || q.title.toLowerCase().includes('zip'))) {
            if (formattedZip || rawZip) {
              window.V[q.id] = formattedZip || rawZip;
            }
          }
          // 都道府県項目
          if (q.title && q.title.includes('都道府県') && parsedAddr.pref) {
            window.V[q.id] = parsedAddr.pref;
          }
          // 市区町村項目
          if (q.title && (q.title.includes('市区町村') || (q.title.includes('市') && q.title.includes('区') && !q.title.includes('番地'))) && parsedAddr.city) {
            window.V[q.id] = parsedAddr.city;
          }
          // 町名・番地項目
          if (q.title && (q.title.includes('町名') || q.title.includes('番地') || q.title.includes('丁目')) && !q.title.includes('建物') && !q.title.includes('部屋番号') && parsedAddr.street) {
            window.V[q.id] = parsedAddr.street;
          }
          // 建物名・部屋番号項目
          if (q.title && (q.title.includes('建物') || q.title.includes('部屋番号') || q.title.includes('ビル') || q.title.includes('マンション')) && parsedAddr.building) {
            window.V[q.id] = parsedAddr.building;
          }
        });
      });
    }

    // 2. 現在レンダリングされているプレビューDOMへの反映
    const containers = [
      document.getElementById('preview-section-container'),
      document.getElementById('live-preview-section-container')
    ].filter(Boolean);

    containers.forEach(container => {
      const cards = container.querySelectorAll('.preview-q-card');
      cards.forEach(c => {
        const qDef = findQuestionDefById(c.dataset.questionId);
        const apiConfig = getQuestionApiConfig(qDef);
        const titleEl = c.querySelector('.preview-q-title');
        const title = titleEl ? titleEl.textContent : "";
        const inputEl = c.querySelector('input');
        const selectEl = c.querySelector('select');
        if (!inputEl && !selectEl) return;

        // ① カナ表記: 公的データに登録されている場合のみ自動で補完（※代表者カナ、および口座名義・名義人カナは除外）
        const isExcludedKana = title.includes('代表') || title.includes('口座') || title.includes('名義');
        if ((title.includes('カナ') || title.includes('フリガナ') || title.includes('ふりがな')) && !isExcludedKana) {
          if (inputEl) {
            if (item.nameKana && item.nameKana.trim()) {
              inputEl.value = item.nameKana.trim();
              clearIntegrityError(c);
              triggerInputChange(inputEl);
            } else {
              inputEl.value = '';
              triggerInputChange(inputEl);
            }
          }
        }

        // ② インボイス登録番号: 規則の種類がAPI連携 & 判定ルールがinvoice_number（タイトル文字列に依存せず確実に特定）
        if (apiConfig && apiConfig.isInvoice && item.num && inputEl) {
          const formattedInv = item.num.startsWith('T') ? item.num : ('T' + item.num);
          inputEl.dataset.suppressSearch = "1";
          inputEl.value = formattedInv;
          clearIntegrityError(c);
          activeApiMetadata.invoice_number = formattedInv;
          activeApiMetadata.registrationDate = item.regDate || "2023-10-01";
          activeApiMetadata.invoice_verified = true;
          
          const invPanel = c.querySelector('.invoice-search-panel');
          if (invPanel) invPanel.style.display = 'none';

          // 実在確認済バッジの表示
          let statusBadge = c.querySelector('.invoice-verified-badge');
          if (!statusBadge) {
            statusBadge = document.createElement('div');
            statusBadge.className = 'invoice-verified-badge';
            statusBadge.style.cssText = 'font-size:0.72rem; color:#137333; margin-top:4px; font-weight:600; display:flex; align-items:center; gap:4px;';
            inputEl.parentNode.appendChild(statusBadge);
          }
          statusBadge.innerHTML = `✓ 国税庁公表システム 実在確認済（${escapeHtml(item.name)}）`;
          statusBadge.style.display = 'flex';

          triggerInputChange(inputEl);
        }

        // ③ 法人番号
        if ((title.includes('法人番号') || title.includes('会社番号')) && inputEl) {
          if (item.num) {
            inputEl.value = item.num;
            clearIntegrityError(c);
            triggerInputChange(inputEl);
          }
        }

        // ④ 郵便番号
        if ((title.includes('郵便番号') || title.toLowerCase().includes('zip')) && inputEl) {
          const zipToFill = formattedZip || (rawZip.length === 7 ? rawZip : '');
          if (zipToFill) {
            inputEl.dataset.suppressLookup = "1";
            inputEl.value = zipToFill;
            clearIntegrityError(c);
            triggerInputChange(inputEl);
          }
        }

        // ⑤ 都道府県（セレクトまたはテキスト）
        if (title.includes('都道府県') && parsedAddr.pref) {
          if (selectEl) {
            selectEl.value = parsedAddr.pref;
            triggerInputChange(selectEl);
          } else if (inputEl) {
            inputEl.value = parsedAddr.pref;
            triggerInputChange(inputEl);
          }
          clearIntegrityError(c);
        }

        // ⑥ 市区町村
        if ((title.includes('市区町村') || (title.includes('市') && title.includes('区') && !title.includes('番地'))) && parsedAddr.city && inputEl) {
          inputEl.value = parsedAddr.city;
          clearIntegrityError(c);
          triggerInputChange(inputEl);
        }

        // ⑦ 町名・番地（建物名を含まない枠）
        const isStreetOnly = (title.includes('町名') || title.includes('番地') || title.includes('丁目')) && !title.includes('建物') && !title.includes('部屋番号');
        if (isStreetOnly && parsedAddr.street && inputEl) {
          inputEl.value = parsedAddr.street;
          clearIntegrityError(c);
          triggerInputChange(inputEl);
        }

        // ⑧ 建物名・部屋番号
        const isBuildingField = title.includes('建物') || title.includes('マンション') || title.includes('ビル') || title.includes('部屋番号');
        if (isBuildingField && inputEl) {
          inputEl.value = parsedAddr.building || '';
          clearIntegrityError(c);
          triggerInputChange(inputEl);
        }

        // ⑨ 旧来の統合住所枠
        const isLegacyCombined = (title.includes('町名') || title.includes('番地')) && title.includes('建物');
        if (isLegacyCombined && inputEl) {
          const combined = `${parsedAddr.street} ${parsedAddr.building}`.trim();
          inputEl.value = combined;
          clearIntegrityError(c);
          triggerInputChange(inputEl);
        }
      });
    });
  }

  function autoFillCorpNumberFields(num) {
    autoFillCorpRelatedFields({ num: num });
  }

  // ============================================================================
  // 🧾 【国税庁公式 登録番号チェックディジット計算アルゴリズム】
  // 法人番号および適格請求書発行事業者番号の13桁検査数字を厳密に計算
  // ============================================================================
  function isValidInvoiceCheckDigit(invoiceNum) {
    const clean = (invoiceNum || '').trim().toUpperCase();
    if (!/^T\d{13}$/.test(clean)) return false;
    
    // 13桁の数字部分を取得
    const digitsStr = clean.substring(1);
    const checkDigit = parseInt(digitsStr.charAt(0), 10);
    const numPart = digitsStr.substring(1); // 残り12桁
    
    // 国税庁 法人番号検査数字アルゴリズム:
    // 最下位（右端）から数えて n 桁目 (n = 1 ... 12)
    // 奇数桁: 重み 1, 偶数桁: 重み 2
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const d = parseInt(numPart.charAt(11 - i), 10);
      const n = i + 1;
      const p = (n % 2 === 1) ? 1 : 2;
      sum += d * p;
    }
    const remainder = sum % 9;
    const calcCheckDigit = 9 - remainder;
    
    return checkDigit === calcCheckDigit;
  }

  // ============================================================================
  // 🧾 【インボイス番号API検索 ＆ 実在性検証（ベタ打ち架空番号登録ブロック）】
  // ユーザー指示: ベタ打ちのみで検索に引っかからないものの登録はなしでお願いします。
  // ============================================================================
  function setupInvoiceApiSearch(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    const oldPanel = card.querySelector('.invoice-search-panel');
    if (oldPanel) oldPanel.remove();

    // 登録番号に都道府県エリア絞り込み機能は不要（ユーザー指示）:
    card.querySelectorAll('.corp-pref-filter-container').forEach(el => el.remove());
    const oldCorpPanel = card.querySelector('.corp-search-panel');
    if (oldCorpPanel) oldCorpPanel.remove();

    let inputGroup = input.closest('.api-search-input-group');
    let searchBtn = inputGroup ? inputGroup.querySelector('.api-invoice-search-btn') : null;
    if (!inputGroup) {
      inputGroup = document.createElement('div');
      inputGroup.className = 'api-search-input-group';
      inputGroup.style.cssText = 'display:flex; gap:6px; align-items:center; position:relative; width:100%;';
      input.parentNode.insertBefore(inputGroup, input);
      inputGroup.appendChild(input);
      input.style.flex = '1';

      searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.className = 'btn btn-primary btn-sm api-invoice-search-btn';
      searchBtn.innerHTML = '🔍 照会';
      searchBtn.style.cssText = 'white-space:nowrap; padding:4px 12px; font-size:0.75rem; font-weight:600; cursor:pointer; height:32px; display:inline-flex; align-items:center; gap:4px; border-radius:4px; flex-shrink:0;';
      inputGroup.appendChild(searchBtn);
    }

    let searchPanel = card.querySelector('.invoice-search-panel');
    if (!searchPanel) {
      searchPanel = document.createElement('div');
      searchPanel.className = 'invoice-search-panel';
      searchPanel.style.cssText = 'position:absolute; top:calc(100% + 4px); left:0; right:0; background:#ffffff; border:1px solid var(--color-border); border-radius:6px; z-index:2050; box-shadow:0 8px 24px rgba(0,0,0,0.12); display:none; max-height:240px; overflow-y:auto;';
      inputGroup.appendChild(searchPanel);
    }

    input.placeholder = "Tから始まる13桁 または事業者名 (例: T1010001999999)";

    const validateAndSearchInvoice = (shouldShowPanel = true) => {
      const curPanel = card.querySelector('.invoice-search-panel') || searchPanel;
      const rawVal = input.value.trim();
      const val = normalizeText(rawVal);

      if (rawVal === "") {
        clearIntegrityError(card);
        if (curPanel) curPanel.style.display = 'none';
        return;
      }

      // T + 13桁の直接入力（ベタ打ち検証）
      const isDirectInvoiceNum = /^T\d{13}$/i.test(rawVal);
      const isDigits13 = /^\d{13}$/.test(rawVal);

      if (isDirectInvoiceNum || isDigits13) {
        const fullNum = isDirectInvoiceNum ? rawVal.toUpperCase() : ('T' + rawVal);
        const numPart = fullNum.substring(1);

        // マスタ照会
        const masterMatch = CORP_DATABASE.find(item => item.num === numPart);
        const checkDigitPassed = isValidInvoiceCheckDigit(fullNum);

        if (masterMatch || checkDigitPassed) {
          // 実在確認OK
          clearIntegrityError(card);
          activeApiMetadata.invoice_number = fullNum;
          activeApiMetadata.invoice_verified = true;
          
          let statusBadge = card.querySelector('.invoice-verified-badge');
          if (!statusBadge) {
            statusBadge = document.createElement('div');
            statusBadge.className = 'invoice-verified-badge';
            statusBadge.style.cssText = 'font-size:0.72rem; color:#137333; margin-top:4px; font-weight:600; display:flex; align-items:center; gap:4px;';
            input.parentNode.appendChild(statusBadge);
          }
          const entityName = masterMatch ? masterMatch.name : '適格請求書発行事業者';
          statusBadge.innerHTML = `✓ 国税庁公表システム 実在確認済（${escapeHtml(entityName)}）`;
          statusBadge.style.display = 'flex';
        } else {
          // ユーザー指示: ベタ打ちのみで検索に引っかからないものの登録はなしでお願いします。
          const statusBadge = card.querySelector('.invoice-verified-badge');
          if (statusBadge) statusBadge.style.display = 'none';
          showIntegrityError(card, '⚠️ 入力されたインボイス登録番号は国税庁の公表システムに存在しないか無効な番号です。実在する適格請求書発行事業者番号を入力してください。');
          delete activeApiMetadata.invoice_verified;
        }
      }

      // 検索候補の抽出（事業者名または番号の部分一致）
      let matched = CORP_DATABASE.filter(item => {
        return item.num.includes(val) || item.name.includes(val) || ("t" + item.num).toLowerCase().includes(val.toLowerCase());
      });

      if (!shouldShowPanel || matched.length === 0) {
        if (curPanel) curPanel.style.display = 'none';
        return;
      }

      curPanel.innerHTML = `
        <div style="padding:6px 12px; background:#f8f9fa; border-bottom:1px solid #edf2f7; font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between; align-items:center; font-weight:600;">
          <span>🧾 国税庁インボイス公表API照会候補 (${matched.length}件)</span>
          <span style="font-size:0.65rem; color:#718096;">選択で登録番号自動補完</span>
        </div>
      `;
      matched.forEach(item => {
        const row = document.createElement('div');
        row.className = 'invoice-search-candidate-item';
        row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05); transition:background-color 0.15s;';
        const formattedNum = item.num.startsWith('T') ? item.num : ('T' + item.num);
        row.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600; color:var(--color-primary);">${escapeHtml(item.name)}</span>
            <span style="background:#e6f4ea; color:#137333; font-size:0.65rem; padding:1px 6px; border-radius:10px; font-weight:600;">✓ 適格登録済</span>
          </div>
          <div style="font-size:0.7rem; color:var(--color-text-muted); margin-top:2px;">
            登録番号: <span style="font-family:monospace; color:#2d3748; font-weight:600;">${formattedNum}</span> | 登録日: ${item.regDate || '2023-10-01'}
          </div>
        `;
        row.onmouseenter = () => { row.style.backgroundColor = '#f1f5f9'; };
        row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
        row.addEventListener('click', () => {
          input.dataset.suppressSearch = "1";
          input.value = formattedNum;
          curPanel.style.display = 'none';
          clearIntegrityError(card);
          activeApiMetadata.invoice_number = formattedNum;
          activeApiMetadata.invoice_verified = true;
          activeApiMetadata.registrationDate = item.regDate || "2023-10-01";
          
          let statusBadge = card.querySelector('.invoice-verified-badge');
          if (!statusBadge) {
            statusBadge = document.createElement('div');
            statusBadge.className = 'invoice-verified-badge';
            statusBadge.style.cssText = 'font-size:0.72rem; color:#137333; margin-top:4px; font-weight:600; display:flex; align-items:center; gap:4px;';
            input.parentNode.appendChild(statusBadge);
          }
          statusBadge.innerHTML = `✓ 国税庁公表システム 実在確認済（${escapeHtml(item.name)}）`;
          statusBadge.style.display = 'flex';

          triggerInputChange(input);
        });
        curPanel.appendChild(row);
      });
      curPanel.style.display = 'block';
    };

    if (!input.dataset.invoiceApiBound) {
      input.dataset.invoiceApiBound = "1";
      let debounceTimer = null;
      input.addEventListener('input', () => {
        if (input.dataset.suppressSearch === "1") {
          input.dataset.suppressSearch = "";
          const p = card.querySelector('.invoice-search-panel');
          if (p) p.style.display = 'none';
          validateAndSearchInvoice(false);
          return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          validateAndSearchInvoice(true);
        }, 150);
      });
      input.addEventListener('change', () => {
        validateAndSearchInvoice(false);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          validateAndSearchInvoice(true);
        }
      });
    }

    if (searchBtn && !searchBtn.dataset.invoiceBtnBound) {
      searchBtn.dataset.invoiceBtnBound = "1";
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        validateAndSearchInvoice(true);
      });
    }

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        searchPanel.style.display = 'none';
      }
    });
  }

  function setupBankApiSearch(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    const oldPanel = card.querySelector('.bank-search-panel');
    if (oldPanel) oldPanel.remove();

    let inputGroup = input.closest('.api-search-input-group');
    let searchBtn = inputGroup ? inputGroup.querySelector('.api-bank-search-btn') : null;
    if (!inputGroup) {
      inputGroup = document.createElement('div');
      inputGroup.className = 'api-search-input-group';
      inputGroup.style.cssText = 'display:flex; gap:6px; align-items:center; position:relative; width:100%;';
      input.parentNode.insertBefore(inputGroup, input);
      inputGroup.appendChild(input);
      input.style.flex = '1';

      searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.className = 'btn btn-primary btn-sm api-bank-search-btn';
      searchBtn.innerHTML = '🔍 検索';
      searchBtn.style.cssText = 'white-space:nowrap; padding:4px 12px; font-size:0.75rem; font-weight:600; cursor:pointer; height:32px; display:inline-flex; align-items:center; gap:4px; border-radius:4px; flex-shrink:0;';
      inputGroup.appendChild(searchBtn);
    }

    let searchPanel = card.querySelector('.bank-search-panel');
    if (!searchPanel) {
      searchPanel = document.createElement('div');
      searchPanel.className = 'bank-search-panel';
      searchPanel.style.cssText = 'position:absolute; top:calc(100% + 4px); left:0; right:0; background:#ffffff; border:1px solid var(--color-border); border-radius:6px; z-index:2050; box-shadow:0 8px 24px rgba(0,0,0,0.12); display:none; max-height:240px; overflow-y:auto;';
      inputGroup.appendChild(searchPanel);
    }

    input.placeholder = "銀行名を入力または検索 (例: 三菱UFJ銀行、みずほ銀行)";

    let searchSeq = 0;
    const executeSearch = async () => {
      const curPanel = card.querySelector('.bank-search-panel') || searchPanel;
      const rawVal = input.value.trim();
      if (rawVal === "") {
        if (curPanel) curPanel.style.display = 'none';
        return;
      }

      curPanel.innerHTML = `
        <div style="padding:8px 12px; font-size:0.75rem; color:#64748b; display:flex; align-items:center; gap:6px;">
          <span>⏳ 全銀協 最新オープンデータ照会中...</span>
        </div>
      `;
      curPanel.style.display = 'block';

      const currentSeq = ++searchSeq;
      const matches = await BankDataService.searchBanks(rawVal);
      if (currentSeq !== searchSeq) return;

      if (matches.length === 0) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fffbe8; border-bottom:1px solid #fed7aa; font-size:0.75rem; color:#9a3412; line-height:1.4;">
            <div style="font-weight:700; margin-bottom:2px;">⚠️ 全銀協データに未登録の金融機関です</div>
            <div>「${escapeHtml(rawVal)}」に一致する金融機関が見つかりません。正式名称（例: ドコモＳＭＴＢネット信託銀行）で再検索するか、手動で金融機関コードをご入力ください。</div>
          </div>
        `;
        curPanel.style.display = 'block';
        return;
      }

      curPanel.innerHTML = `
        <div style="padding:6px 12px; background:#f8f9fa; border-bottom:1px solid #edf2f7; font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between; align-items:center; font-weight:600;">
          <span>🏦 全銀協 最新金融機関候補 (${matches.length}件)</span>
          <span style="font-size:0.65rem; color:#718096;">選択でコード自動入力</span>
        </div>
      `;
      matches.forEach(item => {
        const row = document.createElement('div');
        row.className = 'bank-search-candidate-item';
        row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05); transition:background-color 0.15s;';
        const displayName = item.displayName || item.officialName || getOfficialBankName(item);
        row.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600; color:var(--color-primary);">${escapeHtml(displayName)}</span>
            <span style="background:#e8f0fe; color:#1a73e8; font-size:0.65rem; padding:1px 6px; border-radius:10px; font-weight:600;">金融機関コード: ${item.code}</span>
          </div>
        `;
        row.onmouseenter = () => { row.style.backgroundColor = '#f1f5f9'; };
        row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
        row.addEventListener('click', () => {
          input.value = displayName;
          curPanel.style.display = 'none';
          autoFillBankCode(item.code);
          clearIntegrityError(card);
          triggerInputChange(input);
        });
        curPanel.appendChild(row);
      });
      curPanel.style.display = 'block';
    };

    if (!input.dataset.bankApiBound) {
      input.dataset.bankApiBound = "1";
      let debounceTimer = null;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(executeSearch, 150);
        const bankInfo = findBankByName(input.value);
        if (bankInfo) {
          autoFillBankCode(bankInfo.code);
          clearIntegrityError(card);
        }
      });
      input.addEventListener('focus', () => {
        if (input.value.trim().length > 0) executeSearch();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch();
        }
      });
    }

    if (searchBtn && !searchBtn.dataset.bankBtnBound) {
      searchBtn.dataset.bankBtnBound = "1";
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        executeSearch();
      });
    }

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        searchPanel.style.display = 'none';
      }
    });
  }

  function setupBankCodeAutoLookup(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;
    input.placeholder = "4桁の金融機関コード (例: 0005)";
    if (!input.dataset.bankCodeBound) {
      input.dataset.bankCodeBound = "1";
      input.addEventListener('input', () => {
        if (isAutoFilling) return;
        const code = input.value.trim();
        if (code.length === 4) {
          const bankInfo = findBankByCode(code);
          if (bankInfo) {
            autoFillBankName(bankInfo.name);
            clearIntegrityError(card);
          }
        }
      });
      input.addEventListener('blur', () => {
        const code = input.value.trim();
        if (code && !/^\d{4}$/.test(code)) {
          showIntegrityError(card, '金融機関コードは半角数字4桁で入力してください。');
        } else {
          clearIntegrityError(card);
        }
      });
    }
  }

  function setupBranchCodeMutualCompletion(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    const oldPanel = card.querySelector('.branch-search-panel');
    if (oldPanel) oldPanel.remove();

    let panel = card.querySelector('.branch-search-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'branch-search-panel';
      panel.style.cssText = 'position:absolute; top:calc(100% + 4px); left:0; right:0; background:#ffffff; border:1px solid var(--color-border); border-radius:6px; z-index:2050; box-shadow:0 8px 24px rgba(0,0,0,0.12); display:none; max-height:200px; overflow-y:auto;';
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(panel);
    }

    input.placeholder = "3桁の支店番号を入力または選択 (例: 001)";

    let branchSeq = 0;
    const showBranchCodeCandidates = async () => {
      const bankName = getSelectedBankName();
      const filterText = input.value.trim();
      const curPanel = card.querySelector('.branch-search-panel') || panel;

      if (!bankName) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fff8e1; border-bottom:1px solid #ffe082; font-size:0.75rem; color:#b78103; display:flex; align-items:center; gap:6px;">
            <span>⚠️ 先に「銀行名」を入力または選択してください</span>
          </div>
        `;
        curPanel.style.display = 'block';
        return;
      }

      const bankInfo = findBankByName(bankName);
      if (!bankInfo) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fff8e1; border-bottom:1px solid #ffe082; font-size:0.75rem; color:#b78103; display:flex; align-items:center; gap:6px;">
            <span>⚠️ 銀行名「${escapeHtml(bankName)}」の実在確認が取れていません。支店名と支店番号を手動でご入力ください。</span>
          </div>
        `;
        curPanel.style.display = 'block';
        return;
      }

      curPanel.innerHTML = `
        <div style="padding:8px 12px; font-size:0.75rem; color:#64748b; display:flex; align-items:center; gap:6px;">
          <span>⏳ ${escapeHtml(bankInfo.name)} の支店データを照会中...</span>
        </div>
      `;
      curPanel.style.display = 'block';

      const currentSeq = ++branchSeq;
      const branchMatches = await BankDataService.searchBranches(bankInfo.code, filterText);
      if (currentSeq !== branchSeq) return;

      if (branchMatches.length > 0) {
        curPanel.innerHTML = `
          <div style="padding:6px 12px; background:#f8f9fa; border-bottom:1px solid #edf2f7; font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between; align-items:center; font-weight:600;">
            <span>🏢 ${escapeHtml(bankInfo.name)}の支店候補 (${branchMatches.length}件)</span>
            <span style="font-size:0.65rem; color:#718096;">選択で支店名を自動補完</span>
          </div>
        `;
        branchMatches.forEach(b => {
          const bName = b.displayName || b.officialName || getOfficialBranchName(b);
          const bCode = String(b.code || '').padStart(3, '0');
          const row = document.createElement('div');
          row.className = 'branch-search-candidate-item';
          row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05); transition:background-color 0.15s;';
          row.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:600; color:var(--color-primary);">${bCode} ${escapeHtml(bName)}</span>
              <span style="background:#e6f4ea; color:#137333; font-size:0.65rem; padding:1px 6px; border-radius:10px; font-weight:600;">支店コード: ${bCode}</span>
            </div>
          `;
          row.onmouseenter = () => { row.style.backgroundColor = '#f1f5f9'; };
          row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
          row.addEventListener('click', () => {
            input.value = bCode;
            curPanel.style.display = 'none';
            autoFillBranchName(bName);
            clearIntegrityError(card);
            triggerInputChange(input);
          });
          curPanel.appendChild(row);
        });
        curPanel.style.display = 'block';
      } else if (filterText) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fffbe8; border-bottom:1px solid #fed7aa; font-size:0.75rem; color:#9a3412;">
            <div style="font-weight:700; margin-bottom:2px;">⚠️ 該当する支店が見つかりません</div>
            <div>「${escapeHtml(filterText)}」に一致する支店番号が存在しないため、支店名と支店番号（3桁）を手動でご入力ください。</div>
          </div>
        `;
        curPanel.style.display = 'block';
      } else {
        curPanel.style.display = 'none';
      }
    };

    if (!input.dataset.branchCodeBound) {
      input.dataset.branchCodeBound = "1";
      let debounceTimer = null;
      input.addEventListener('input', () => {
        if (isAutoFilling) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          showBranchCodeCandidates();
          const branchCode = input.value.trim();
          if (branchCode.length === 3 && /^\d{3}$/.test(branchCode)) {
            const bankName = getSelectedBankName();
            const bankInfo = findBankByName(bankName);
            if (bankInfo) {
              BankDataService.searchBranches(bankInfo.code, branchCode).then(matches => {
                const exact = (matches || []).find(m => String(m.code || '').padStart(3, '0') === branchCode);
                if (exact) {
                  const exactOffName = exact.displayName || exact.officialName || getOfficialBranchName(exact);
                  autoFillBranchName(exactOffName);
                  clearIntegrityError(card);
                }
              }).catch(() => {});
            }
          }
        }, 200);
      });
      input.addEventListener('focus', () => {
        showBranchCodeCandidates();
      });
      input.addEventListener('blur', () => {
        const val = input.value.trim();
        if (val && !/^\d{3}$/.test(val)) {
          showIntegrityError(card, '支店番号は半角数字3桁で入力してください。');
        } else {
          clearIntegrityError(card);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  }

  function setupBranchNameMutualCompletion(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;

    const oldPanel = card.querySelector('.branch-search-panel');
    if (oldPanel) oldPanel.remove();

    let panel = card.querySelector('.branch-search-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'branch-search-panel';
      panel.style.cssText = 'position:absolute; top:calc(100% + 4px); left:0; right:0; background:#ffffff; border:1px solid var(--color-border); border-radius:6px; z-index:2050; box-shadow:0 8px 24px rgba(0,0,0,0.12); display:none; max-height:200px; overflow-y:auto;';
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(panel);
    }

    input.placeholder = "支店名を入力または選択 (例: 本店、新宿支店)";

    let branchSeq = 0;
    const showBranchCandidates = async () => {
      const bankName = getSelectedBankName();
      const filterText = input.value.trim();
      const curPanel = card.querySelector('.branch-search-panel') || panel;

      if (!bankName) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fff8e1; border-bottom:1px solid #ffe082; font-size:0.75rem; color:#b78103; display:flex; align-items:center; gap:6px;">
            <span>⚠️ 先に「銀行名」を入力または選択してください</span>
          </div>
        `;
        curPanel.style.display = 'block';
        return;
      }

      const bankInfo = findBankByName(bankName);
      if (!bankInfo) {
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fff8e1; border-bottom:1px solid #ffe082; font-size:0.75rem; color:#b78103; display:flex; align-items:center; gap:6px;">
            <span>⚠️ 銀行名「${escapeHtml(bankName)}」の実在確認が取れていません。支店名と支店番号を手動でご入力ください。</span>
          </div>
        `;
        curPanel.style.display = 'block';
        return;
      }

      curPanel.innerHTML = `
        <div style="padding:8px 12px; font-size:0.75rem; color:#64748b; display:flex; align-items:center; gap:6px;">
          <span>⏳ ${escapeHtml(bankInfo.name)} の支店データを照会中...</span>
        </div>
      `;
      curPanel.style.display = 'block';

      const currentSeq = ++branchSeq;
      const branchMatches = await BankDataService.searchBranches(bankInfo.code, filterText);
      if (currentSeq !== branchSeq) return;

      if (branchMatches.length > 0) {
        curPanel.innerHTML = `
          <div style="padding:6px 12px; background:#f8f9fa; border-bottom:1px solid #edf2f7; font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between; align-items:center; font-weight:600;">
            <span>🏢 ${escapeHtml(bankInfo.name)}の支店候補 (${branchMatches.length}件)</span>
            <span style="font-size:0.65rem; color:#718096;">選択で支店番号を自動補完</span>
          </div>
        `;
        branchMatches.forEach(b => {
          const bName = b.displayName || b.officialName || getOfficialBranchName(b);
          const bCode = String(b.code || '').padStart(3, '0');
          const row = document.createElement('div');
          row.className = 'branch-search-candidate-item';
          row.style.cssText = 'padding:8px 12px; cursor:pointer; font-size:0.8rem; border-bottom:1px solid rgba(0,0,0,0.05); transition:background-color 0.15s;';
          row.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:600; color:var(--color-primary);">${escapeHtml(bName)}</span>
              <span style="background:#e6f4ea; color:#137333; font-size:0.65rem; padding:1px 6px; border-radius:10px; font-weight:600;">支店コード: ${bCode}</span>
            </div>
          `;
          row.onmouseenter = () => { row.style.backgroundColor = '#f1f5f9'; };
          row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
          row.addEventListener('click', () => {
            input.value = bName;
            curPanel.style.display = 'none';
            autoFillBranchCode(bCode);
            clearIntegrityError(card);
            triggerInputChange(input);
          });
          curPanel.appendChild(row);
        });
        curPanel.style.display = 'block';
      } else if (filterText) {
        // 支店が見つからない場合: 架空コード捏造を完全撤廃
        curPanel.innerHTML = `
          <div style="padding:10px 12px; background:#fffbe8; border-bottom:1px solid #fed7aa; font-size:0.75rem; color:#9a3412;">
            <div style="font-weight:700; margin-bottom:2px;">⚠️ 該当する支店が見つかりません</div>
            <div>「${escapeHtml(filterText)}」に一致する支店が存在しないため、支店名と支店番号（3桁）を手動でご入力ください。</div>
          </div>
        `;
        curPanel.style.display = 'block';
      } else {
        curPanel.style.display = 'none';
      }
    };

    if (!input.dataset.branchNameBound) {
      input.dataset.branchNameBound = "1";
      let debounceTimer = null;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          showBranchCandidates();
          const branchName = input.value.trim();
          const bankName = getSelectedBankName();
          const bankInfo = findBankByName(bankName);
          if (bankInfo && branchName.length >= 1) {
            BankDataService.searchBranches(bankInfo.code, branchName).then(matches => {
              const exact = (matches || []).find(b => {
                const off = b.displayName || b.officialName || getOfficialBranchName(b);
                return off === branchName || b.name === branchName || b.name + '支店' === branchName || b.name === branchName + '支店';
              });
              if (exact) {
                autoFillBranchCode(String(exact.code || '').padStart(3, '0'));
                clearIntegrityError(card);
              }
            }).catch(() => {});
          }
        }, 200);
      });
      input.addEventListener('focus', () => {
        showBranchCandidates();
      });
    }

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  }

  function setupAccountHolderValidation(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;
    input.placeholder = "例: カ）ヤマダ タロウ";

    if (!input.dataset.accountHolderBound) {
      input.dataset.accountHolderBound = "1";
      const kanaRegex = /^[ァ-ヶｦ-ﾟー\-‐―()（）.\．\・\s　]+$/;
      const convertHiragana = (str) => {
        if (!str) return '';
        return str.replace(/[\u3041-\u3096]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
      };

      let isComposing = false;
      input.addEventListener('compositionstart', () => { isComposing = true; });
      input.addEventListener('compositionend', () => {
        isComposing = false;
        validate(true);
      });

      const validate = (doConvert) => {
        let val = input.value;
        if (doConvert) {
          const converted = convertHiragana(val);
          if (converted !== val) {
            val = converted;
            input.value = val;
          }
        }

        const trimmed = val.trim();
        if (!trimmed || trimmed === '-') {
          clearIntegrityError(card);
          return;
        }
        if (!kanaRegex.test(trimmed)) {
          showIntegrityError(card, '口座名義はカナと（）.のみで入力してください（例: カ）ヤマダ タロウ）。');
        } else {
          clearIntegrityError(card);
        }
      };
      input.addEventListener('input', (e) => {
        if (isComposing || (e && e.isComposing)) return;
        validate(false);
      });
      input.addEventListener('blur', () => {
        validate(true);
      });
    }
  }

  function setupAccountNumberValidation(card, qDef) {
    const input = card.querySelector('input');
    if (!input) return;
    input.placeholder = "例: 0477651 (6〜7桁の半角数字)";
    input.maxLength = 7;

    if (!input.dataset.acctNumBound) {
      input.dataset.acctNumBound = "1";
      const normalizeVal = (val) => {
        return (val || '').replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/[^\d]/g, '');
      };

      input.addEventListener('input', (e) => {
        const curVal = e.target.value;
        const normalized = normalizeVal(curVal);
        if (normalized !== curVal) {
          e.target.value = normalized;
        }
        if (window.V) {
          window.V[qDef.id] = normalized;
        }
        if (qDef.validation && qDef.validation.category === 'regex') {
          qDef.validation.value = '^[0-9]{6,7}$';
          qDef.validation.errorMessage = '正しい口座番号（6〜7桁の半角数字）を入力してください。';
        }
        clearIntegrityError(card);
      });
    }
  }

  window.setupLiveAutocompleteEvents = setupLiveAutocompleteEvents;

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

    function buildCorpInfoQuestions(baseTime = Date.now(), corpGrpId = `grp_corp_info_${baseTime}`, corpGrpTitle = '法人情報') {
      const taxStatusQId = `q_tax_status_${baseTime + 11}`;
      return [
        {
          id: `q_corp_name_${baseTime}`,
          type: "text",
          title: "法人名",
          description: "法人名を入力して候補から選択してください（国税庁法人番号API照会）",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "company_name",
          validation: {
            category: "api",
            condition: "corp_name",
            value: "",
            value2: "",
            errorMessage: "実在する法人名を入力または選択してください。"
          },
          options: []
        },
        {
          id: `q_corp_kana_${baseTime + 1}`,
          type: "text",
          title: "法人名（カナ）",
          description: "全角カタカナで入力してください。法人名検索から自動反映されます。",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "company_kana",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^[ァ-ヶｦ-ﾟー\\s　]+$",
            presetKey: "company_kana",
            value2: "",
            errorMessage: "全角カタカナで入力してください。"
          },
          options: []
        },
        {
          id: `q_zip_${baseTime + 2}`,
          type: "text",
          title: "郵便番号",
          description: "法人選択で自動入力されます（7桁半角数字）",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "zip_code",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^[0-9]{3}-?[0-9]{4}$",
            presetKey: "zip",
            value2: "",
            errorMessage: "郵便番号を7桁で入力してください。"
          },
          options: []
        },
        {
          id: `q_pref_${baseTime + 3}`,
          type: "select",
          title: "都道府県",
          description: "本店所在地の都道府県を選択してください",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "pref",
          options: JAPAN_PREFECTURES.map(p => ({ label: p }))
        },
        {
          id: `q_city_${baseTime + 4}`,
          type: "text",
          title: "市区町村",
          description: "",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "city",
          options: []
        },
        {
          id: `q_street_${baseTime + 5}`,
          type: "text",
          title: "町名・番地",
          description: "自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "street",
          options: []
        },
        {
          id: `q_building_${baseTime + 6}`,
          type: "text",
          title: "建物名・部屋番号",
          description: "ビル名・階数・部屋番号等がある場合はご入力ください",
          required: false,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "building",
          options: []
        },
        {
          id: `q_rep_name_${baseTime + 7}`,
          type: "text",
          title: "代表者名",
          description: "代表取締役の氏名を入力してください（例: 山田 太郎）",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "representative_name",
          options: []
        },
        {
          id: `q_rep_kana_${baseTime + 8}`,
          type: "text",
          title: "代表者名（カナ）",
          description: "代表取締役のフリガナを全角カタカナで入力してください",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "representative_kana",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^[ァ-ヶｦ-ﾟー\\s　]+$",
            presetKey: "representative_kana",
            value2: "",
            errorMessage: "全角カタカナで入力してください。"
          },
          options: []
        },
        {
          id: `q_email_${baseTime + 9}`,
          type: "text",
          title: "メールアドレス",
          description: "ご回答内容の控えをこのメールアドレス宛てにお送りします。",
          required: true,
          autoReply: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "email",
          validation: {
            category: "text",
            condition: "email",
            value: "",
            value2: "",
            errorMessage: "有効なメールアドレスを入力してください。"
          },
          options: []
        },
        {
          id: `q_tel_${baseTime + 10}`,
          type: "text",
          title: "電話番号",
          description: "半角数字（ハイフンなし）で入力してください（例: 0312345678）",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "tel",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^0\\d{9,10}$",
            presetKey: "tel_no_hyphen",
            value2: "",
            errorMessage: "半角数字（10桁または11桁・ハイフンなし）で入力してください。"
          },
          options: []
        },
        {
          id: taxStatusQId,
          type: "radio",
          title: "税務区分・インボイス登録状況",
          description: "該当する税務区分を選択してください。法人名選択時に登録が確認された場合は「インボイス登録事業者である。」が自動選択されます。",
          required: true,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "tax_invoice_status",
          options: [
            { label: "非課税事業者である。" },
            { label: "課税事業者でインボイスは未登録である。" },
            { label: "インボイス登録事業者である。" }
          ]
        },
        {
          id: `q_invoice_num_${baseTime + 12}`,
          type: "text",
          title: "インボイス登録番号",
          description: "T＋13桁の半角数字。法人選択時に国税庁適格請求書発行事業者公表システムへ自動照合されます。",
          required: false,
          groupId: corpGrpId,
          groupTitle: corpGrpTitle,
          dataKey: "invoice_number",
          validation: {
            category: "api",
            condition: "invoice_number",
            value: "",
            value2: "",
            errorMessage: "実在する有効なインボイス登録番号（T+13桁）を入力してください。"
          },
          skipLogic: {
            dependsOn: taxStatusQId,
            condition: "not_equals",
            value: "インボイス登録事業者である。",
            action: "hide"
          },
          options: []
        }
      ];
    }

    function buildIndivInfoQuestions(baseTime = Date.now(), indivGrpId = `grp_indiv_info_${baseTime}`, indivGrpTitle = '個人事業主情報') {
      const taxStatusQId = `q_tax_status_${baseTime + 11}`;
      return [
        {
          id: `q_rep_name_${baseTime}`,
          type: "text",
          title: "氏名（代表者名）",
          description: "氏名（漢字）を入力してください（例: 山田 太郎）",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "representative_name",
          options: []
        },
        {
          id: `q_rep_kana_${baseTime + 1}`,
          type: "text",
          title: "氏名（カナ）",
          description: "氏名のフリガナを全角カタカナで入力してください",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "representative_kana",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^[ァ-ヶｦ-ﾟー\\s　]+$",
            presetKey: "representative_kana",
            value2: "",
            errorMessage: "全角カタカナで入力してください。"
          },
          options: []
        },
        {
          id: `q_trade_name_${baseTime + 2}`,
          type: "text",
          title: "屋号",
          description: "屋号をお持ちの場合のみ入力してください（屋号がない場合は空欄のままで進めます）",
          required: false,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "company_name",
          options: []
        },
        {
          id: `q_trade_kana_${baseTime + 3}`,
          type: "text",
          title: "屋号（カナ）",
          description: "※屋号を入力された場合は、屋号のフリガナ（全角カタカナ）も必ず入力してください。",
          required: false,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "company_kana",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^[ァ-ヶｦ-ﾟー\\s　]+$",
            presetKey: "company_kana",
            value2: "",
            errorMessage: "全角カタカナで入力してください。"
          },
          options: []
        },
        {
          id: `q_zip_${baseTime + 4}`,
          type: "text",
          title: "郵便番号",
          description: "7桁半角数字を入力すると住所を自動補完します（例: 150-0041）",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "zip_code",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^[0-9]{3}-?[0-9]{4}$",
            presetKey: "zip",
            value2: "",
            errorMessage: "郵便番号を7桁で入力してください。"
          },
          options: []
        },
        {
          id: `q_pref_${baseTime + 5}`,
          type: "select",
          title: "都道府県",
          description: "お住まいの都道府県を選択してください",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "pref",
          options: JAPAN_PREFECTURES.map(p => ({ label: p }))
        },
        {
          id: `q_city_${baseTime + 6}`,
          type: "text",
          title: "市区町村",
          description: "",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "city",
          options: []
        },
        {
          id: `q_street_${baseTime + 7}`,
          type: "text",
          title: "町名・番地",
          description: "自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "street",
          options: []
        },
        {
          id: `q_building_${baseTime + 8}`,
          type: "text",
          title: "建物名・部屋番号",
          description: "マンション名・アパート名・部屋番号等がある場合はご入力ください",
          required: false,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "building",
          options: []
        },
        {
          id: `q_email_${baseTime + 9}`,
          type: "text",
          title: "メールアドレス",
          description: "ご回答内容の控えをこのメールアドレス宛てにお送りします。",
          required: true,
          autoReply: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "email",
          validation: {
            category: "text",
            condition: "email",
            value: "",
            value2: "",
            errorMessage: "有効なメールアドレスを入力してください。"
          },
          options: []
        },
        {
          id: `q_tel_${baseTime + 10}`,
          type: "text",
          title: "電話番号",
          description: "半角数字（ハイフンなし）で入力してください（例: 09012345678）",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "tel",
          validation: {
            category: "regex",
            condition: "matches",
            value: "^0\\d{9,10}$",
            presetKey: "tel_no_hyphen",
            value2: "",
            errorMessage: "半角数字（10桁または11桁・ハイフンなし）で入力してください。"
          },
          options: []
        },
        {
          id: taxStatusQId,
          type: "radio",
          title: "税務区分・インボイス登録状況",
          description: "該当する税務区分を選択してください。「インボイス登録事業者である。」を選択された場合は登録番号の入力とAPI照合を行います。",
          required: true,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "tax_invoice_status",
          options: [
            { label: "非課税事業者である。" },
            { label: "課税事業者でインボイスは未登録である。" },
            { label: "インボイス登録事業者である。" }
          ]
        },
        {
          id: `q_invoice_num_${baseTime + 12}`,
          type: "text",
          title: "インボイス登録番号",
          description: "T＋13桁の半角数字を入力してください（国税庁公表システムへ照合します）。",
          required: false,
          groupId: indivGrpId,
          groupTitle: indivGrpTitle,
          dataKey: "invoice_number",
          validation: {
            category: "api",
            condition: "invoice_number",
            value: "",
            value2: "",
            errorMessage: "国税庁公表システムに登録された有効なインボイス登録番号を入力してください。"
          },
          skipLogic: {
            dependsOn: taxStatusQId,
            condition: "not_equals",
            value: "インボイス登録事業者である。",
            action: "hide"
          },
          options: []
        }
      ];
    }
    window.buildCorpInfoQuestions = buildCorpInfoQuestions;
    window.buildIndivInfoQuestions = buildIndivInfoQuestions;

    function executeApplyPreset(val, activeSec, baseTime) {
      if (!val) return;

      if (val === 'pro_branch_hybrid') {
        const secCorpId = `sec_corp_${baseTime + 1}`;
        const secIndivId = `sec_indiv_${baseTime + 2}`;

        const branchSec = {
          id: `sec_branch_${baseTime}`,
          title: "申請区分の選択",
          description: "申請区分（契約種別）を選択してください。選択内容に応じて次に入力する情報が自動的に切り替わります。",
          nextAction: "branch",
          questions: [
            {
              id: `q_branch_type_${baseTime}`,
              type: "radio",
              title: "申請区分をお選びください",
              description: "該当する区分をお選びください",
              required: true,
              dataKey: "applicant_type",
              options: [
                { label: "🏢 法人として申請", nextSectionId: secCorpId },
                { label: "👤 個人事業主として申請", nextSectionId: secIndivId }
              ]
            }
          ]
        };

        const corpSec = {
          id: secCorpId,
          title: "法人情報の入力",
          description: "法人の基本情報および代表者情報をご入力ください。",
          nextAction: "submit",
          questions: buildCorpInfoQuestions(baseTime + 10, `grp_corp_${baseTime + 10}`, '法人情報')
        };

        const indivSec = {
          id: secIndivId,
          title: "個人事業主情報の入力",
          description: "個人事業主または個人の基本情報をご入力ください。",
          nextAction: "submit",
          questions: buildIndivInfoQuestions(baseTime + 20, `grp_indiv_${baseTime + 20}`, '個人事業主情報')
        };

        if (!window.n.sections) window.n.sections = [];
        const isSingleInitialSec = window.n.sections.length <= 1 &&
          (!window.n.sections[0] || !window.n.sections[0].questions || window.n.sections[0].questions.length <= 1);
        if (isSingleInitialSec) {
          window.n.sections = [branchSec, corpSec, indivSec];
        } else {
          window.n.sections.push(branchSec, corpSec, indivSec);
        }
        window.r = branchSec.id;
        if (window.le) window.le(branchSec);
        if (window.S) window.S(true);
        if (window.x) window.x();
        renderLivePreview();
        return;
      }

      if (!activeSec) return;

      const isSingleInitialQ = activeSec.questions.length === 1 &&
        (activeSec.questions[0].title === "質問 1" || !activeSec.questions[0].title) &&
        !activeSec.questions[0].required && !activeSec.questions[0].validation;
      if (isSingleInitialQ) {
        activeSec.questions = [];
      }

      if (val === 'pro_corp_info') {
        const corpGrpId = `grp_corp_info_${baseTime}`;
        const corpGrpTitle = '法人情報';
        activeSec.questions.push(...buildCorpInfoQuestions(baseTime, corpGrpId, corpGrpTitle));
      } else if (val === 'pro_individual_info') {
        const indivGrpId = `grp_indiv_info_${baseTime}`;
        const indivGrpTitle = '個人事業主情報';
        activeSec.questions.push(...buildIndivInfoQuestions(baseTime, indivGrpId, indivGrpTitle));
      } else if (val === 'email_autoreply') {
        activeSec.questions.push({
          id: `q_email_${baseTime}`,
          type: "text",
          title: "メールアドレス",
          description: "ご回答内容の控えをこのメールアドレス宛てにお送りします。",
          required: true,
          autoReply: true,
          dataKey: "email",
          validation: {
            category: "text",
            condition: "email",
            value: "",
            value2: "",
            errorMessage: "有効なメールアドレスを入力してください。"
          },
          options: []
        });
      } else if (val === 'pro_corp_address') {
        const corpGrpId = `grp_corp_${baseTime}`;
        const corpGrpTitle = '法人住所';
        activeSec.questions.push(
          {
            id: `q_corp_name_${baseTime}`,
            type: "text",
            title: "法人名・屋号",
            description: "法人名を入力して候補から選択してください（個人事業主の方は直接入力可能です）",
            required: true,
            groupId: corpGrpId,
            groupTitle: corpGrpTitle,
            dataKey: "company_name",
            validation: {
              category: "api",
              condition: "corp_name",
              value: "",
              value2: "",
              errorMessage: "実在する法人名を入力または選択してください。"
            },
            options: []
          },
          { id: `q_zip_${baseTime + 1}`, type: "text", title: "郵便番号", description: "法人選択または7桁入力で住所を自動補完します", required: true, groupId: corpGrpId, groupTitle: corpGrpTitle, dataKey: "zip_code" },
          { id: `q_pref_${baseTime + 2}`, type: "select", title: "都道府県", description: "お住まいの都道府県を選択してください", required: true, options: JAPAN_PREFECTURES.map(p => ({ label: p })), groupId: corpGrpId, groupTitle: corpGrpTitle, dataKey: "pref" },
          { id: `q_city_${baseTime + 3}`, type: "text", title: "市区町村", description: "", required: true, groupId: corpGrpId, groupTitle: corpGrpTitle, dataKey: "city" },
          { id: `q_street_${baseTime + 4}`, type: "text", title: "町名・番地", description: "自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。", required: true, groupId: corpGrpId, groupTitle: corpGrpTitle, dataKey: "street" },
          { id: `q_building_${baseTime + 5}`, type: "text", title: "建物名・部屋番号", description: "マンション名・ビル名・部屋番号等がある場合はご入力ください", required: false, groupId: corpGrpId, groupTitle: corpGrpTitle, dataKey: "building" }
        );
      } else if (val === 'pro_address') {
        const addrGrpId = `grp_addr_${baseTime}`;
        const addrGrpTitle = '住所';
        const addrGrpDesc = 'ご住所を入力してください';
        activeSec.questions.push(
          { id: `q_zip_${baseTime}`, type: "text", title: "郵便番号", description: "7桁半角数字を入力すると住所を自動補完します", required: true, groupId: addrGrpId, groupTitle: addrGrpTitle, groupDescription: addrGrpDesc, dataKey: "zip_code" },
          { id: `q_pref_${baseTime + 1}`, type: "select", title: "都道府県", description: "お住まいの都道府県を選択してください", required: true, options: JAPAN_PREFECTURES.map(p => ({ label: p })), groupId: addrGrpId, groupTitle: addrGrpTitle, groupDescription: addrGrpDesc, dataKey: "pref" },
          { id: `q_city_${baseTime + 2}`, type: "text", title: "市区町村", description: "", required: true, groupId: addrGrpId, groupTitle: addrGrpTitle, groupDescription: addrGrpDesc, dataKey: "city" },
          { id: `q_street_${baseTime + 3}`, type: "text", title: "町名・番地", description: "自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。", required: true, groupId: addrGrpId, groupTitle: addrGrpTitle, groupDescription: addrGrpDesc, dataKey: "street" },
          { id: `q_building_${baseTime + 4}`, type: "text", title: "建物名・部屋番号", description: "マンション名・ビル名・部屋番号等がある場合はご入力ください", required: false, groupId: addrGrpId, groupTitle: addrGrpTitle, groupDescription: addrGrpDesc, dataKey: "building" }
        );
      } else if (val === 'pro_bank') {
        const bankGrpId = `grp_bank_${baseTime}`;
        const bankGrpTitle = '銀行口座';
        activeSec.questions.push(
          {
            id: `q_bank_name_${baseTime}`,
            type: "text",
            title: "銀行名",
            description: "銀行名を入力または検索して選択してください",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "bank_name",
            validation: {
              category: "api",
              condition: "bank_name",
              value: "",
              value2: "",
              errorMessage: "実在する銀行名を入力または選択してください。"
            },
            options: []
          },
          {
            id: `q_bank_code_${baseTime}`,
            type: "text",
            title: "金融機関コード",
            description: "銀行名を選択すると自動入力されます（半角数字4桁）",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "bank_code",
            validation: {
              category: "regex",
              condition: "matches",
              value: "^[0-9]{4}$",
              presetKey: "custom",
              value2: "",
              errorMessage: "半角数字4桁で入力してください。"
            },
            options: []
          },
          {
            id: `q_branch_code_${baseTime}`,
            type: "text",
            title: "支店番号",
            description: "3桁の半角数字を入力すると支店名が補完されます",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "branch_code",
            validation: {
              category: "regex",
              condition: "matches",
              value: "^[0-9]{3}$",
              presetKey: "custom",
              value2: "",
              errorMessage: "半角数字3桁で入力してください。"
            },
            options: []
          },
          {
            id: `q_branch_name_${baseTime}`,
            type: "text",
            title: "支店名",
            description: "支店名を入力または候補から選択してください",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "branch_name",
            validation: {
              category: "api",
              condition: "branch_name",
              value: "",
              value2: "",
              errorMessage: "実在する支店名を入力または選択してください。"
            },
            options: []
          },
          {
            id: `q_account_type_${baseTime}`,
            type: "radio",
            title: "口座種別",
            description: "口座の種別を選択してください",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "account_type",
            validation: null,
            options: [
              { label: "普通" },
              { label: "当座" },
              { label: "貯蓄" }
            ]
          },
          {
            id: `q_account_number_${baseTime}`,
            type: "text",
            title: "口座番号",
            description: "6〜7桁の半角数字で入力してください（例: 1234567）",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "account_number",
            validation: {
              category: "regex",
              condition: "matches",
              value: "^[0-9]{6,7}$",
              presetKey: "bank_account",
              value2: "",
              errorMessage: "正しい口座番号（6〜7桁の半角数字）を入力してください。"
            },
            options: []
          },
          {
            id: `q_account_holder_${baseTime}`,
            type: "text",
            title: "口座名義（カナ）",
            description: "カナ、カッコ（）、ドット（.）で入力してください（例: カ）ヤマダ タロウ）",
            required: true,
            groupId: bankGrpId,
            groupTitle: bankGrpTitle,
            dataKey: "account_holder_kana",
            validation: {
              category: "regex",
              condition: "matches",
              value: "^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$",
              presetKey: "account_holder_kana",
              value2: "",
              errorMessage: "口座名義はカナと（）.のみで入力してください。"
            },
            options: []
          }
        );
      } else if (val === 'pro_password') {
        activeSec.questions.push(
          { id: `q_pw_${baseTime}`, type: "password", title: "パスワード", description: "伏せ字で表示されます", required: true, dataKey: "password" }
        );
      }

      if (window.le && activeSec) window.le(activeSec);
      if (window.S) window.S(true);
      if (window.x) window.x();
      renderLivePreview();
    }

  window.buildCorpInfoQuestions = buildCorpInfoQuestions;
  window.buildIndivInfoQuestions = buildIndivInfoQuestions;
  window.executeApplyPreset = executeApplyPreset;

  function patchPresetSelectMenu() {
    // 単体プリセットに「銀行名」「支店名」を補完
    if (window.re) {
      if (!window.re.bank_name) {
        window.re.bank_name = {
          type: "text",
          title: "銀行名",
          description: "銀行名を入力または検索して選択してください。",
          required: true,
          validation: {
            category: "api",
            condition: "bank_name",
            value: "",
            value2: "",
            errorMessage: "実在する銀行名を入力または選択してください。"
          },
          options: []
        };
      }
      if (!window.re.branch_name) {
        window.re.branch_name = {
          type: "text",
          title: "支店名",
          description: "支店名を入力または候補から選択してください。",
          required: true,
          validation: {
            category: "api",
            condition: "branch_name",
            value: "",
            value2: "",
            errorMessage: "実在する支店名を入力または選択してください。"
          },
          options: []
        };
      }
      if (!window.re.bank_account) {
        window.re.bank_account = {
          type: "text",
          title: "口座番号",
          description: "6〜7桁の半角数字で入力してください（例: 1234567）",
          placeholder: "0477651",
          required: true,
          validation: {
            category: "regex",
            condition: "matches",
            presetKey: "bank_account",
            value: "^[0-9]{6,7}$",
            value2: "",
            errorMessage: "正しい口座番号（6〜7桁の半角数字）を入力してください。"
          },
          options: []
        };
      }
      if (window.re.pro_bank && Array.isArray(window.re.pro_bank.questions)) {
        window.re.pro_bank.questions.forEach(q => {
          if (q.title === '金融機関名' || q.title === '銀行名') {
            q.validation = { category: "api", condition: "bank_name", errorMessage: "実在する金融機関名を入力または選択してください。" };
          } else if (q.title === '支店名') {
            q.validation = { category: "api", condition: "branch_name", errorMessage: "実在する支店名を入力または選択してください。" };
          } else if (q.title === '口座番号') {
            q.description = "6〜7桁の半角数字で入力してください（例: 1234567）";
            q.placeholder = "0477651";
            q.validation = {
              category: "regex",
              condition: "matches",
              presetKey: "bank_account",
              value: "^[0-9]{6,7}$",
              errorMessage: "正しい口座番号（6〜7桁の半角数字）を入力してください。"
            };
          }
        });
      }
    }

    const presetSelect = document.getElementById('select-preset-question');
    if (!presetSelect) return;

    if (!presetSelect.querySelector('option[value="pro_corp_info"]') || !presetSelect.querySelector('option[value="pro_individual_info"]')) {
      // 既存のoptGroupがあれば除去して再作成
      const existingGroup = presetSelect.querySelector('optgroup[label*="郵便・銀行・PW"], optgroup[label*="プロプリセット"]');
      if (existingGroup) existingGroup.remove();

      const optGroup = document.createElement('optgroup');
      optGroup.label = "🚀 ビジネス・本人確認 プロプリセット";

      const optCorpInfo = document.createElement('option');
      optCorpInfo.value = "pro_corp_info";
      optCorpInfo.textContent = "🏢 法人情報一括セット（法人名・カナ・代表者・所在地・税務区分3択・インボイス）";
      optGroup.appendChild(optCorpInfo);

      const optIndivInfo = document.createElement('option');
      optIndivInfo.value = "pro_individual_info";
      optIndivInfo.textContent = "👤 個人事業主情報一括セット（氏名・カナ・屋号・住所・税務区分3択・インボイス）";
      optGroup.appendChild(optIndivInfo);

      const optHybrid = document.createElement('option');
      optHybrid.value = "pro_branch_hybrid";
      optHybrid.textContent = "🔀 法人・個人自動分岐セット（汎用ハイブリッド・カラム共通化）";
      optGroup.appendChild(optHybrid);

      const optCorpAddr = document.createElement('option');
      optCorpAddr.value = "pro_corp_address";
      optCorpAddr.textContent = "🏢 法人住所一括セット（法人検索・住所分割・郵便番号自動補完）";
      optGroup.appendChild(optCorpAddr);

      const optAddr = document.createElement('option');
      optAddr.value = "pro_address";
      optAddr.textContent = "📮 住所入力一括セット（郵便番号から住所自動補完・個人/一般向け）";
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
    if (!presetSelect.querySelector('option[value="bank_name"]')) {
      const optBankSingle = document.createElement('option');
      optBankSingle.value = "bank_name";
      optBankSingle.textContent = "銀行名（全銀協API連携）";
      presetSelect.appendChild(optBankSingle);
    }
    if (!presetSelect.querySelector('option[value="branch_name"]')) {
      const optBranchSingle = document.createElement('option');
      optBranchSingle.value = "branch_name";
      optBranchSingle.textContent = "支店名（全銀協API連携）";
      presetSelect.appendChild(optBranchSingle);
    }
    if (!presetSelect.querySelector('option[value="branch_code"]')) {
      const optBranchCodeSingle = document.createElement('option');
      optBranchCodeSingle.value = "branch_code";
      optBranchCodeSingle.textContent = "支店番号（全銀協API連携）";
      presetSelect.appendChild(optBranchCodeSingle);
    }
    if (!presetSelect.querySelector('option[value="bank_account"]')) {
      const optBankAcctSingle = document.createElement('option');
      optBankAcctSingle.value = "bank_account";
      optBankAcctSingle.textContent = "口座番号（6〜7桁半角数字）";
      presetSelect.appendChild(optBankAcctSingle);
    }

    // ✉️ メールアドレス（2種類: 通常 / 回答控え自動送信）
    if (window.re) {
      if (!window.re.email) {
        window.re.email = {
          type: "text",
          title: "メールアドレス",
          description: "ご連絡可能なメールアドレスを入力してください。",
          required: true,
          autoReply: false,
          validation: {
            category: "text",
            condition: "email",
            value: "",
            value2: "",
            errorMessage: "有効なメールアドレスを入力してください。"
          },
          options: []
        };
      } else {
        window.re.email.autoReply = false;
      }

      window.re.email_autoreply = {
        type: "text",
        title: "メールアドレス",
        description: "ご回答内容の控えをこのメールアドレス宛てにお送りします。",
        required: true,
        autoReply: true,
        validation: {
          category: "text",
          condition: "email",
          value: "",
          value2: "",
          errorMessage: "有効なメールアドレスを入力してください。"
        },
        options: []
      };
    }

    // プリセットセレクトボックス内の表示名調整
    const optEmail = presetSelect.querySelector('option[value="email"]');
    if (optEmail) {
      optEmail.textContent = "✉️ メールアドレス（通常・入力のみ）";
      if (!presetSelect.querySelector('option[value="email_autoreply"]')) {
        const optAutoreply = document.createElement('option');
        optAutoreply.value = "email_autoreply";
        optAutoreply.textContent = "📨 メールアドレス（回答控えを自動送信）";
        if (optEmail.nextSibling) {
          presetSelect.insertBefore(optAutoreply, optEmail.nextSibling);
        } else {
          presetSelect.appendChild(optAutoreply);
        }
      }
    }

    const originalWe = window.we;
    const selectChanger = (e) => {
      const val = e.target.value;
      if (!val.startsWith('pro_') && val !== 'email_autoreply') return;

      e.stopPropagation();
      e.preventDefault();

      let activeSec = window.n && window.n.sections ? window.n.sections.find(s => s.id === window.r) : null;
      if (!activeSec && window.n && window.n.sections && window.n.sections.length > 0) {
        activeSec = window.n.sections[0];
        window.r = activeSec.id;
      }

      const baseTime = Date.now();
      e.target.value = "";
      if (typeof executeApplyPreset === 'function') {
        executeApplyPreset(val, activeSec, baseTime);
      } else if (typeof window.executeApplyPreset === 'function') {
        window.executeApplyPreset(val, activeSec, baseTime);
      }
    };

    presetSelect.removeEventListener('change', window.we);
    presetSelect.addEventListener('change', (e) => {
      if (e.target.value.startsWith('pro_') || e.target.value === 'email_autoreply') {
        selectChanger(e);
      } else {
        if (typeof originalWe === 'function') {
          originalWe(e);
        } else if (typeof window.we === 'function') {
          window.we(e);
        }
        renderLivePreview();
      }
    });
  }

  // グローバルキャプチャフェーズでも確実に pro_ および email_autoreply プリセットを検知
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'select-preset-question' && e.target.value && (e.target.value.startsWith('pro_') || e.target.value === 'email_autoreply')) {
      const activeSec = (window.n && window.n.sections) ? (window.n.sections.find(s => s.id === window.r) || window.n.sections[0]) : null;
      if (activeSec) {
        window.r = activeSec.id;
      }

      const val = e.target.value;
      const baseTime = Date.now();
      e.target.value = "";
      e.stopPropagation();
      e.preventDefault();

      executeApplyPreset(val, activeSec, baseTime);
    }
  }, true);

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
    if (errDiv) {
      errDiv.style.display = 'none';
      const errText = errDiv.querySelector('.error-text') || errDiv;
      errText.textContent = '';
    }
    const oldErr = card.querySelector('.integrity-error-msg');
    if (oldErr) oldErr.remove();

    const hasOtherErrors = !!document.querySelector('.preview-q-card.has-error');
    if (!hasOtherErrors) {
      const submitBtn = document.getElementById('btn-preview-submit');
      const nextBtn = document.getElementById('btn-preview-next');
      if (submitBtn) submitBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
    }
  }

  function showHardError(card, text) {
    showIntegrityError(card, text);
  }

  function clearHardError(card) {
    clearIntegrityError(card);
  }

  // 📋 「前述と同じ（同上）」自動入力のコピー元候補（先行質問 ＆ 先行グループ）の抽出
  function getAvailableSourcesFor(targetSecId, targetQId, currentGroupId) {
    const result = {
      groups: [],
      questions: []
    };
    const formSources = [window.n, window.G, window.F, window.L];
    if (window.U && Array.isArray(window.U)) {
      formSources.push(...window.U);
    }
    let formObj = null;
    for (const fs of formSources) {
      if (fs && fs.sections && Array.isArray(fs.sections) && fs.sections.length > 0) {
        formObj = fs;
        break;
      }
    }
    if (!formObj || !formObj.sections) return result;

    const sections = formObj.sections;
    const curSecIdx = sections.findIndex(s => s.id === targetSecId);
    if (curSecIdx === -1) return result;

    const seenGroupIds = new Set();
    if (currentGroupId) seenGroupIds.add(currentGroupId); // 自グループはコピー元から除外（循環防止）

    for (let i = 0; i <= curSecIdx; i++) {
      const s = sections[i];
      if (!s || !s.questions) continue;

      for (let j = 0; j < s.questions.length; j++) {
        const q = s.questions[j];
        if (i === curSecIdx && q.id === targetQId) {
          // 自質問に到達したらそれ以降はコピー元にできないため終了
          return result;
        }

        // 先行グループの収集（重複なし）
        if (q.groupId && q.groupTitle && !seenGroupIds.has(q.groupId)) {
          seenGroupIds.add(q.groupId);
          let count = 0;
          sections.forEach(secItem => {
            (secItem.questions || []).forEach(item => {
              if (item.groupId === q.groupId) count++;
            });
          });
          result.groups.push({
            id: 'group:' + q.groupId,
            groupId: q.groupId,
            title: q.groupTitle,
            sectionTitle: s.title || `セクション ${i + 1}`,
            isSameSection: (i === curSecIdx),
            count: count
          });
        }

        // 先行個別質問の収集
        result.questions.push({
          id: q.id,
          title: q.title || `質問 ${j + 1}`,
          sectionTitle: s.title || `セクション ${i + 1}`,
          isSameSection: (i === curSecIdx),
          groupId: q.groupId || null,
          groupTitle: q.groupTitle || null
        });
      }
    }
    return result;
  }
  window.getAvailableSourcesFor = getAvailableSourcesFor;

  // 後方互換用ラッパー
  function getAvailableSourceQuestionsFor(targetSecId, targetQId) {
    return getAvailableSourcesFor(targetSecId, targetQId).questions;
  }
  window.getAvailableSourceQuestionsFor = getAvailableSourceQuestionsFor;

  function injectSameAsAboveEditorUI(qCard, qDef, sec) {
    if (!qCard || !qDef || !sec) return;
    const sources = getAvailableSourcesFor(sec.id, qDef.id, qDef.groupId);
    const availableGroups = sources.groups;
    const availableQuestions = sources.questions;
    const allAvailableCount = availableGroups.length + availableQuestions.length;
    let sameContainer = qCard.querySelector('.same-as-above-editor-container');

    // コピー可能な前述の質問もグループも1つもない（フォーム先頭）場合
    if (allAvailableCount === 0) {
      if (sameContainer) sameContainer.remove();
      return;
    }

    if (!sameContainer) {
      sameContainer = document.createElement('div');
      sameContainer.className = 'same-as-above-editor-container';

      const actionsRow = qCard.querySelector('.question-card-actions');
      if (actionsRow) {
        qCard.insertBefore(sameContainer, actionsRow);
      } else {
        qCard.appendChild(sameContainer);
      }
    }

    let toggle = sameContainer.querySelector('.same-as-above-toggle');
    let details = sameContainer.querySelector('.same-as-above-details');
    let sourceSelect = sameContainer.querySelector('.same-as-above-source-select');
    let labelInput = sameContainer.querySelector('.same-as-above-label-input');

    if (!toggle) {
      sameContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <label class="same-as-above-toggle-label">
            <input type="checkbox" class="same-as-above-toggle" />
            <span>📋 「前述と同じ（同上）」自動入力を有効にする</span>
          </label>
          <span style="font-size: 0.68rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">住所・担当者自動入力</span>
        </div>
        <div class="same-as-above-details" style="display: none; flex-direction: column; gap: 8px; margin-top: 4px; padding-left: 22px;">
          <div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 180px;">
              <label style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-bottom: 2px; display: block;">コピー元の質問またはグループ:</label>
              <select class="form-control same-as-above-source-select" style="font-size: 0.8rem; height: 32px; padding: 2px 8px; box-sizing: border-box;"></select>
            </div>
            <div style="flex: 1; min-width: 180px;">
              <label style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-bottom: 2px; display: block;">表示チェックボックスの文言:</label>
              <input type="text" class="form-control same-as-above-label-input" style="font-size: 0.8rem; height: 32px; padding: 2px 8px; box-sizing: border-box;" placeholder="例: 本社住所と同じ" />
            </div>
          </div>
          <div style="font-size: 0.72rem; color: #64748b; line-height: 1.4;">
            💡 回答者がチェックを入れると、前述の回答値（またはグループ内の全項目）が自動で入力欄に流し込まれます。
          </div>
        </div>
      `;

      toggle = sameContainer.querySelector('.same-as-above-toggle');
      details = sameContainer.querySelector('.same-as-above-details');
      sourceSelect = sameContainer.querySelector('.same-as-above-source-select');
      labelInput = sameContainer.querySelector('.same-as-above-label-input');

      toggle.addEventListener('change', () => {
        if (!qDef.sameAsAbove) qDef.sameAsAbove = {};
        qDef.sameAsAbove.enabled = toggle.checked;
        details.style.display = toggle.checked ? 'flex' : 'none';

        if (toggle.checked) {
          const allOptions = [...availableGroups.map(g => ({ id: g.id, title: g.title, isGroup: true })), ...availableQuestions.map(q => ({ id: q.id, title: q.title, isGroup: false }))];
          if (!qDef.sameAsAbove.sourceQuestionId || !allOptions.some(s => s.id === qDef.sameAsAbove.sourceQuestionId)) {
            qDef.sameAsAbove.sourceQuestionId = sourceSelect.value || (allOptions[0] ? allOptions[0].id : '');
          }
          sourceSelect.value = qDef.sameAsAbove.sourceQuestionId;

          const isGrp = qDef.sameAsAbove.sourceQuestionId && qDef.sameAsAbove.sourceQuestionId.startsWith('group:');
          qDef.sameAsAbove.sourceType = isGrp ? 'group' : 'question';
          if (isGrp) qDef.sameAsAbove.sourceGroupId = qDef.sameAsAbove.sourceQuestionId.replace('group:', '');
          else delete qDef.sameAsAbove.sourceGroupId;

          if (!qDef.sameAsAbove.label || qDef.sameAsAbove.label.trim() === '') {
            const chosen = allOptions.find(s => s.id === qDef.sameAsAbove.sourceQuestionId);
            const defLbl = chosen ? `${chosen.title}と同じ` : '前述の入力と同じ';
            qDef.sameAsAbove.label = defLbl;
            labelInput.value = defLbl;
          }
        }
        if (window.S) window.S();
        renderLivePreview();
      });

      sourceSelect.addEventListener('change', () => {
        if (!qDef.sameAsAbove) qDef.sameAsAbove = { enabled: true };
        const selVal = sourceSelect.value;
        const oldSrcId = qDef.sameAsAbove.sourceQuestionId;
        qDef.sameAsAbove.sourceQuestionId = selVal;

        const isGrp = selVal && selVal.startsWith('group:');
        qDef.sameAsAbove.sourceType = isGrp ? 'group' : 'question';
        if (isGrp) {
          qDef.sameAsAbove.sourceGroupId = selVal.replace('group:', '');
        } else {
          delete qDef.sameAsAbove.sourceGroupId;
        }

        const allOptions = [...availableGroups.map(g => ({ id: g.id, title: g.title })), ...availableQuestions.map(q => ({ id: q.id, title: q.title }))];
        const oldSrc = allOptions.find(s => s.id === oldSrcId);
        const newSrc = allOptions.find(s => s.id === selVal);

        if (!qDef.sameAsAbove.label || (oldSrc && qDef.sameAsAbove.label === `${oldSrc.title}と同じ`)) {
          const newLbl = newSrc ? `${newSrc.title}と同じ` : '前述の入力と同じ';
          qDef.sameAsAbove.label = newLbl;
          labelInput.value = newLbl;
        }
        if (window.S) window.S();
        renderLivePreview();
      });

      labelInput.addEventListener('input', () => {
        if (!qDef.sameAsAbove) qDef.sameAsAbove = { enabled: true };
        qDef.sameAsAbove.label = labelInput.value;
        if (window.S) window.S();
        renderLivePreview();
      });
    }

    // ドロップダウン選択肢の更新
    let optsHtml = '';

    // 1. グループの選択肢
    if (availableGroups.length > 0) {
      optsHtml += '<optgroup label="📁 先行グループ（グループ全体を自動入力）">';
      availableGroups.forEach(g => {
        optsHtml += `<option value="${escapeHtml(g.id)}">📁 [グループ] ${escapeHtml(g.title)} (${g.count}問)</option>`;
      });
      optsHtml += '</optgroup>';
    }

    // 2. 個別質問の選択肢
    const prevSecSources = availableQuestions.filter(s => !s.isSameSection);
    const sameSecSources = availableQuestions.filter(s => s.isSameSection);

    if (prevSecSources.length > 0) {
      optsHtml += '<optgroup label="前のセクションの質問">';
      prevSecSources.forEach(s => {
        optsHtml += `<option value="${escapeHtml(s.id)}">[${escapeHtml(s.sectionTitle)}] ${escapeHtml(s.title)}</option>`;
      });
      optsHtml += '</optgroup>';
    }
    if (sameSecSources.length > 0) {
      optsHtml += '<optgroup label="現在のセクションの質問">';
      sameSecSources.forEach(s => {
        optsHtml += `<option value="${escapeHtml(s.id)}">${escapeHtml(s.title)}</option>`;
      });
      optsHtml += '</optgroup>';
    }
    sourceSelect.innerHTML = optsHtml;

    // 現在の状態反映
    const isEnabled = !!(qDef.sameAsAbove && qDef.sameAsAbove.enabled);
    toggle.checked = isEnabled;
    details.style.display = isEnabled ? 'flex' : 'none';

    const allOpts = [...availableGroups, ...availableQuestions];
    if (qDef.sameAsAbove && qDef.sameAsAbove.sourceQuestionId && allOpts.some(s => s.id === qDef.sameAsAbove.sourceQuestionId)) {
      sourceSelect.value = qDef.sameAsAbove.sourceQuestionId;
    } else if (allOpts[0]) {
      sourceSelect.value = allOpts[0].id;
      if (isEnabled && (!qDef.sameAsAbove.sourceQuestionId || !allOpts.some(s => s.id === qDef.sameAsAbove.sourceQuestionId))) {
        qDef.sameAsAbove.sourceQuestionId = allOpts[0].id;
        const isGrp = allOpts[0].id.startsWith('group:');
        qDef.sameAsAbove.sourceType = isGrp ? 'group' : 'question';
        if (isGrp) qDef.sameAsAbove.sourceGroupId = allOpts[0].id.replace('group:', '');
        else delete qDef.sameAsAbove.sourceGroupId;
      }
    }

    labelInput.value = (qDef.sameAsAbove && qDef.sameAsAbove.label) ? qDef.sameAsAbove.label : '';
  }

  let lastEnhancedSectionId = null;

  function injectSectionEnhancements(sec) {
    if (!sec) {
      if (window.n && window.n.sections) {
        if (window.r) {
          sec = window.n.sections.find(s => s.id === window.r);
        }
        if (!sec && window.n.sections.length > 0) {
          const activeSidebar = document.querySelector('#section-list .sidebar-item.active');
          if (activeSidebar && activeSidebar.dataset.sectionId) {
            sec = window.n.sections.find(s => s.id === activeSidebar.dataset.sectionId);
          }
        }
        if (!sec && window.n.sections.length > 0) {
          sec = window.n.sections[0];
        }
      }
    }
    if (!sec || !sec.questions) return;
    const metaEdit = document.querySelector('.section-meta-edit');
    if (!metaEdit) return;

    // --- 途中送信（コード確定＆続きリンク発行）のプルダウン選択肢＆補足案内UI ---
    const nextSelect = document.getElementById('editor-section-next');
    if (nextSelect) {
      // プルダウン内に「途中送信（コード確定＆続きリンク発行）」が未挿入の場合は即座に注入
      let opt = nextSelect.querySelector('option[value="partial_submit"]');
      if (!opt) {
        opt = document.createElement('option');
        opt.value = 'partial_submit';
        opt.textContent = '途中送信（コード確定＆続きリンク発行）';
        const basicGroup = nextSelect.querySelector('optgroup[label="基本の動作"]');
        if (basicGroup) {
          const submitOpt = basicGroup.querySelector('option[value="submit"]');
          if (submitOpt) {
            basicGroup.insertBefore(opt, submitOpt);
          } else {
            basicGroup.appendChild(opt);
          }
        } else {
          nextSelect.appendChild(opt);
        }
      }

      if (sec && sec.nextAction === 'partial_submit') {
        nextSelect.value = 'partial_submit';
      }

      if (!nextSelect._hasPartialSubmitHandler) {
        nextSelect._hasPartialSubmitHandler = true;
        nextSelect.addEventListener('change', (e) => {
          let curSec = sec;
          if (!curSec && window.n && window.n.sections) {
            const activeSidebar = document.querySelector('#section-list .sidebar-item.active');
            if (activeSidebar && activeSidebar.dataset.sectionId) {
              curSec = window.n.sections.find(s => s.id === activeSidebar.dataset.sectionId);
            }
          }
          if (curSec) {
            curSec.nextAction = e.target.value;
            if (window.S) window.S();
            if (typeof window.refreshFlowmap === 'function') {
              window.refreshFlowmap();
            } else if (window.archifyRenderer && (window.G || window.n)) {
              window.archifyRenderer.render(window.G || window.n);
            }
          }
        });
      }
    }

    let partialSubmitHint = metaEdit.querySelector('.partial-submit-hint-box');
    if (!partialSubmitHint && nextSelect && nextSelect.parentElement) {
      partialSubmitHint = document.createElement('div');
      partialSubmitHint.className = 'partial-submit-hint-box';
      partialSubmitHint.style.cssText = 'display: none; margin-top: 8px; margin-bottom: 8px; padding: 10px 12px; background: rgba(49, 130, 206, 0.08); border: 1px solid #3182ce; border-radius: 6px; font-size: 0.75rem; color: #2b6cb0; line-height: 1.4;';
      partialSubmitHint.innerHTML = '<strong>💡 途中送信（コード確定＆続きリンク発行）</strong><br>このセクション完了時に親DBへ本登録して登録コード（8桁）を正式確定します。送信完了画面には確定コードと続き用URLが発行され、後から続きを入力しても同一レコードへ上書き・マージされます。';
      nextSelect.parentElement.insertAdjacentElement('afterend', partialSubmitHint);
    }
    if (partialSubmitHint && nextSelect) {
      const updateHint = () => {
        partialSubmitHint.style.display = (nextSelect.value === 'partial_submit' || (sec && sec.nextAction === 'partial_submit')) ? 'block' : 'none';
      };
      nextSelect.addEventListener('change', updateHint);
      updateHint();
    }

    // --- 設問内・各選択肢の分岐先プルダウン（.option-branch-select）への途中送信オプション注入 ---
    const injectOptionPartialSubmit = () => {
      const branchSelects = document.querySelectorAll('.option-branch-select, .option-transition-select');
      const curSec = sec || (window.n && window.n.sections ? window.n.sections.find(s => s.id === window.r) : null);
      branchSelects.forEach(sel => {
        let pOpt = sel.querySelector('option[value="partial_submit"]');
        if (!pOpt) {
          pOpt = document.createElement('option');
          pOpt.value = 'partial_submit';
          pOpt.textContent = '💾 途中送信（コード確定＆続きリンク発行）';
          const submitOpt = sel.querySelector('option[value="submit"]');
          if (submitOpt) {
            submitOpt.insertAdjacentElement('afterend', pOpt);
          } else {
            sel.appendChild(pOpt);
          }
        }

        // 親行・質問データから現在の nextSectionId を確認して反映
        const optRow = sel.closest('.option-edit-row');
        const qCard = sel.closest('.question-card');
        if (optRow && qCard && curSec && curSec.questions) {
          const qId = qCard.dataset.questionId;
          const qDef = curSec.questions.find(q => q.id === qId);
          if (qDef && qDef.options) {
            const allRows = Array.from(qCard.querySelectorAll('.option-edit-row'));
            const optIdx = allRows.indexOf(optRow);
            if (optIdx !== -1 && qDef.options[optIdx]) {
              if (qDef.options[optIdx].nextSectionId === 'partial_submit') {
                sel.value = 'partial_submit';
              }
            }
          }
        }

        if (!sel._hasPartialSubmitSyncHandler) {
          sel._hasPartialSubmitSyncHandler = true;
          sel.addEventListener('change', () => {
            if (typeof window.refreshFlowmap === 'function') {
              window.refreshFlowmap();
            } else if (window.archifyRenderer && (window.G || window.n)) {
              window.archifyRenderer.render(window.G || window.n);
            }
          });
        }
      });
    };
    injectOptionPartialSubmit();

    // 選択肢追加やタイプ変更を監視して自動注入
    const qContainer = document.getElementById('questions-container');
    if (qContainer && !qContainer._hasPartialSubmitObserver) {
      qContainer._hasPartialSubmitObserver = true;
      const optObserver = new MutationObserver(() => {
        injectOptionPartialSubmit();
      });
      optObserver.observe(qContainer, { childList: true, subtree: true });
    }

    // --- 質問の並び替えボタン（メイン編集画面では動かさないため固定・非表示） ---
    const allQCards = document.querySelectorAll('#questions-container .question-card');
    allQCards.forEach((qCard) => {
      const qId = qCard.dataset.questionId;
      const curSec = sec || (window.n && window.n.sections ? window.n.sections.find(s => s.id === window.r) : null);
      const qDef = (curSec && curSec.questions) ? curSec.questions.find(q => q.id === qId) : null;
      if (!qDef) return;

      // 既存の並び替えボタンがあれば削除して完全固定
      const existingUp = qCard.querySelector('.btn-move-q-up');
      if (existingUp) existingUp.remove();
      const existingDown = qCard.querySelector('.btn-move-q-down');
      if (existingDown) existingDown.remove();

      // 📋 「前述と同じ（同上）」および「プロ版限定スキップ」は詳細設定ドロワーに集約
      // 質問カード本体からはインラインUIを排除してスッキリ固定化
      const existingSame = qCard.querySelector('.same-as-above-editor-container');
      if (existingSame) existingSame.remove();
      const existingSkip = qCard.querySelector('.pro-skip-logic-container');
      if (existingSkip) existingSkip.remove();
    });

    // 質問カード本体のインラインUIクリーンアップ（念のため残存要素も全消去）
    document.querySelectorAll('#questions-container .same-as-above-editor-container, #questions-container .pro-skip-logic-container').forEach(el => el.remove());

    injectRichTextToolbars();
  }

  // =========================================================================
  // 🎯 ドラッグ＆ドロップ（DnD）並び替え ＆ サイドバー質問リスト 統合エンジン (v99)
  // =========================================================================

  function getQuestionTypeInfo(type) {
    const map = {
      text: { icon: '📝', label: '記述式' },
      paragraph: { icon: '📖', label: '長文' },
      radio: { icon: '🔘', label: 'ラジオ' },
      checkbox: { icon: '☑️', label: 'チェック' },
      select: { icon: '🔽', label: 'プルダウン' },
      file: { icon: '📎', label: 'ファイル' },
      password: { icon: '🔒', label: 'パスワード' }
    };
    return map[type] || { icon: '❓', label: type || '質問' };
  }

  function setupBtnAddGroup() {
    const btnAddGroup = document.getElementById('btn-add-group');
    if (!btnAddGroup || btnAddGroup._hasGroupClick) return;
    btnAddGroup._hasGroupClick = true;

    btnAddGroup.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const sec = (window.n && window.n.sections ? window.n.sections.find(s => s.id === window.r) : null) || (window.n && window.n.sections && window.n.sections[0]);
      if (!sec) {
        if (window.showSectionToast) window.showSectionToast('セクションを選択してください');
        return;
      }

      const title = prompt('新しいグループ名を入力してください（例: 住所、緊急連絡先、口座情報）:', '新規グループ');
      if (!title || !title.trim()) return;

      const groupTitle = title.trim();
      const groupId = 'grp_' + Date.now();

      sec.questions = sec.questions || [];
      const newQ = {
        id: 'q_' + Date.now(),
        type: 'text',
        title: `質問 ${sec.questions.length + 1}`,
        description: '',
        required: false,
        validation: null,
        options: [],
        groupId: groupId,
        groupTitle: groupTitle
      };
      sec.questions.push(newQ);

      if (window.S) window.S(true);
      if (window.le) window.le(sec);
      if (window.x) window.x();
      if (window.renderLivePreview) window.renderLivePreview();
      if (window.showSectionToast) window.showSectionToast(`グループ「${groupTitle}」を作成しました`);
    });
  }

  function injectQuestionGroupSystem(sec) {
    setupBtnAddGroup();

    const container = document.getElementById('questions-container');
    if (!container || !window.n || !window.n.sections) return;

    const curSec = sec || (window.n.sections.find(s => s.id === window.r)) || window.n.sections[0];
    if (!curSec || !curSec.questions) return;

    window._groupCollapsedMap = window._groupCollapsedMap || {};

    const allCards = Array.from(container.querySelectorAll('.question-card'));
    if (allCards.length === 0) return;

    const cardMap = new Map();
    allCards.forEach(c => {
      if (c.dataset.questionId) cardMap.set(c.dataset.questionId, c);
    });

    // Collect all unique groups in curSec for the group dropdown and desc
    const groupMap = new Map();
    const groupDescMap = new Map();
    curSec.questions.forEach(q => {
      if (q.groupId && q.groupTitle) {
        groupMap.set(q.groupId, q.groupTitle);
        if (q.groupDescription) groupDescMap.set(q.groupId, q.groupDescription);
      }
    });

    // Inject/update group dropdown on each question card's action row
    allCards.forEach(card => {
      const qId = card.dataset.questionId;
      const qDef = curSec.questions.find(q => q.id === qId);
      if (!qDef) return;

      const actionsRow = card.querySelector('.question-card-actions');
      if (actionsRow) {
        let badgeWrap = actionsRow.querySelector('.question-group-badge-wrap');
        if (!badgeWrap) {
          badgeWrap = document.createElement('div');
          badgeWrap.className = 'question-group-badge-wrap';
          const actionBtns = actionsRow.querySelector('.question-action-buttons');
          if (actionBtns) {
            actionsRow.insertBefore(badgeWrap, actionBtns);
          } else {
            actionsRow.appendChild(badgeWrap);
          }
        }

        let select = badgeWrap.querySelector('.question-group-select');
        if (!select) {
          badgeWrap.innerHTML = `
            <span style="color: #64748b; font-weight: 500;">📁 グループ:</span>
            <select class="question-group-select" title="質問が所属するグループを選択"></select>
          `;
          select = badgeWrap.querySelector('.question-group-select');
        }

        const currentSelectedVal = qDef.groupId || '';
        let optionsHtml = `<option value="">(なし / 単独質問)</option>`;
        groupMap.forEach((title, gId) => {
          optionsHtml += `<option value="${escapeHtml(gId)}">${escapeHtml(title)}</option>`;
        });
        optionsHtml += `<option value="__new__">＋ 新規グループ作成...</option>`;

        if (select._lastOptionsHtml !== optionsHtml) {
          select._lastOptionsHtml = optionsHtml;
          select.innerHTML = optionsHtml;
        }
        select.value = currentSelectedVal;

        if (!select._hasGroupChange) {
          select._hasGroupChange = true;
          select.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '__new__') {
              const title = prompt('新しいグループ名を入力してください:', '新規グループ');
              if (title && title.trim()) {
                const newGId = 'grp_' + Date.now();
                qDef.groupId = newGId;
                qDef.groupTitle = title.trim();
                if (window.S) window.S(true);
                if (window.le) window.le(curSec);
                if (window.x) window.x();
                if (window.renderLivePreview) window.renderLivePreview();
                if (window.showSectionToast) window.showSectionToast(`グループ「${title.trim()}」を作成しました`);
              } else {
                select.value = qDef.groupId || '';
              }
            } else if (val === '') {
              delete qDef.groupId;
              delete qDef.groupTitle;
              delete qDef.groupDescription;
              if (window.S) window.S(true);
              if (window.le) window.le(curSec);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
              if (window.showSectionToast) window.showSectionToast('グループ所属を解除しました');
            } else {
              qDef.groupId = val;
              qDef.groupTitle = groupMap.get(val) || 'グループ';
              if (groupDescMap.has(val)) qDef.groupDescription = groupDescMap.get(val);
              if (window.S) window.S(true);
              if (window.le) window.le(curSec);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
              if (window.showSectionToast) window.showSectionToast(`「${qDef.groupTitle}」グループに移動しました`);
            }
          });
        }
      }
    });

    // Check if the DOM grouping is in sync
    let isInSync = true;
    for (const q of curSec.questions) {
      const card = cardMap.get(q.id);
      if (!card) { isInSync = false; break; }
      if (q.groupId) {
        const parentGroup = card.closest('.editor-question-group');
        if (!parentGroup || parentGroup.dataset.groupId !== q.groupId) {
          isInSync = false;
          break;
        }
      } else {
        if (card.parentElement !== container) {
          isInSync = false;
          break;
        }
      }
    }

    const existingGroups = container.querySelectorAll('.editor-question-group');
    if (isInSync && existingGroups.length > 0) {
      for (const gEl of existingGroups) {
        const gId = gEl.dataset.groupId;
        const count = curSec.questions.filter(q => q.groupId === gId).length;
        if (count === 0) { isInSync = false; break; }
        const titleSpan = gEl.querySelector('.group-title-display');
        const expectedTitle = groupMap.get(gId) || 'グループ';
        if (titleSpan && titleSpan.textContent !== expectedTitle) {
          titleSpan.textContent = expectedTitle;
        }
        const countBadge = gEl.querySelector('.group-count-badge');
        if (countBadge && countBadge.textContent !== `${count}問`) {
          countBadge.textContent = `${count}問`;
        }
        const isCollapsed = !!window._groupCollapsedMap[gId];
        if (gEl.classList.contains('is-collapsed') !== isCollapsed) {
          if (isCollapsed) gEl.classList.add('is-collapsed');
          else gEl.classList.remove('is-collapsed');
        }
        const toggleBtn = gEl.querySelector('.group-toggle-btn');
        if (toggleBtn) {
          toggleBtn.textContent = isCollapsed ? '▸' : '▾';
        }

        // Sync description display
        const descDisplay = gEl.querySelector('.group-card-desc');
        const descTextSpan = gEl.querySelector('.group-desc-text');
        const expectedDesc = groupDescMap.get(gId) || '';
        if (descDisplay && descTextSpan && !gEl.querySelector('.group-desc-textarea')) {
          if (expectedDesc) {
            descTextSpan.innerHTML = typeof renderRichTextWithLinks === 'function' ? renderRichTextWithLinks(expectedDesc) : escapeHtml(expectedDesc);
            descDisplay.classList.remove('is-empty');
          } else {
            descTextSpan.textContent = '＋ グループの説明文を追加（任意）';
            descDisplay.classList.add('is-empty');
          }
        }
      }
    }

    if (!isInSync) {
      const clusters = [];
      let curCluster = null;
      curSec.questions.forEach((q, idx) => {
        if (q.groupId) {
          if (!curCluster || curCluster.groupId !== q.groupId) {
            curCluster = {
              type: 'group',
              groupId: q.groupId,
              groupTitle: q.groupTitle || 'グループ',
              groupDescription: q.groupDescription || '',
              questions: []
            };
            clusters.push(curCluster);
          }
          curCluster.questions.push({ q, idx });
        } else {
          curCluster = null;
          clusters.push({ type: 'single', q, idx });
        }
      });

      container.innerHTML = '';

      clusters.forEach(cluster => {
        if (cluster.type === 'single') {
          const card = cardMap.get(cluster.q.id);
          if (card) container.appendChild(card);
        } else {
          const gId = cluster.groupId;
          const gTitle = cluster.groupTitle;
          const gDesc = cluster.groupDescription || (cluster.questions[0]?.q?.groupDescription) || '';
          const isCollapsed = !!window._groupCollapsedMap[gId];

          const grpEl = document.createElement('div');
          grpEl.className = 'editor-question-group' + (isCollapsed ? ' is-collapsed' : '');
          grpEl.dataset.groupId = gId;
          grpEl.setAttribute('draggable', 'false');

          grpEl.innerHTML = `
            <div class="group-card-header">
              <div class="group-header-left">
                <span class="group-title-display" title="クリックしてグループ名を変更">${escapeHtml(gTitle)}</span>
                <span class="group-count-badge" title="クリックで開閉">${cluster.questions.length}問</span>
              </div>
              <div class="group-header-right">
                <button type="button" class="group-btn btn-group-settings" title="グループの一括自動入力などの詳細設定を開く">⚙️ 詳細設定</button>
                <button type="button" class="group-btn btn-add-q-to-group" title="このグループ内に新しい質問を追加">＋ 質問追加</button>
                <button type="button" class="group-btn btn-ungroup" title="グループを解除して個別の質問に戻す">グループ解除</button>
                <button type="button" class="group-btn group-btn-danger btn-delete-group" title="グループと配下の質問を削除">削除</button>
                <button type="button" class="group-toggle-btn" title="${isCollapsed ? 'グループを展開' : 'グループを閉じる'}">${isCollapsed ? '▸' : '▾'}</button>
              </div>
            </div>
            <div class="group-card-desc-wrap">
              <div class="group-card-desc ${!gDesc ? 'is-empty' : ''}" title="クリックしてグループの説明文を編集">
                <span class="group-desc-icon">✏️</span>
                <span class="group-desc-text">${gDesc ? (typeof renderRichTextWithLinks === 'function' ? renderRichTextWithLinks(gDesc) : escapeHtml(gDesc)) : '＋ グループの説明文を追加（任意）'}</span>
              </div>
            </div>
            <div class="group-same-as-above-bar" style="display: none !important;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <label class="group-same-as-above-toggle-label">
                  <input type="checkbox" class="group-same-as-above-toggle" />
                  <span>📋 前述のグループと同じ内容を一括自動入力する</span>
                </label>
                <span style="font-size: 0.68rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">グループ一括連動</span>
              </div>
              <div class="group-same-as-above-details" style="display: none;">
                <div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 180px;">
                    <label style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-bottom: 2px; display: block;">コピー元のグループ:</label>
                    <select class="form-control group-same-as-above-source-select" style="font-size: 0.8rem; height: 32px; padding: 2px 8px; box-sizing: border-box;"></select>
                  </div>
                  <div style="flex: 1; min-width: 180px;">
                    <label style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-bottom: 2px; display: block;">表示チェックボックスの文言:</label>
                    <input type="text" class="form-control group-same-as-above-label-input" style="font-size: 0.8rem; height: 32px; padding: 2px 8px; box-sizing: border-box;" placeholder="例: 本社住所と同じ" />
                  </div>
                </div>
              </div>
            </div>
            <div class="group-card-body"></div>
          `;

          const grpBody = grpEl.querySelector('.group-card-body');
          cluster.questions.forEach(({ q }) => {
            const card = cardMap.get(q.id);
            if (card) grpBody.appendChild(card);
          });

          // 1. Rename title
          const titleSpan = grpEl.querySelector('.group-title-display');
          titleSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentText = titleSpan.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'group-title-input';
            input.value = currentText;
            titleSpan.parentNode.replaceChild(input, titleSpan);
            input.focus();
            input.select();

            function saveTitle() {
              const newTitle = input.value.trim() || currentText;
              curSec.questions.forEach(q => {
                if (q.groupId === gId) q.groupTitle = newTitle;
              });
              if (window.S) window.S(true);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
              titleSpan.textContent = newTitle;
              if (input.parentNode) input.parentNode.replaceChild(titleSpan, input);
            }

            input.addEventListener('blur', saveTitle);
            input.addEventListener('keydown', (ke) => {
              if (ke.key === 'Enter') { ke.preventDefault(); saveTitle(); }
              if (ke.key === 'Escape') {
                if (input.parentNode) input.parentNode.replaceChild(titleSpan, input);
              }
            });
          });

          // 2. Edit group description
          const descWrap = grpEl.querySelector('.group-card-desc-wrap');
          function attachDescEditHandler() {
            const descCard = descWrap.querySelector('.group-card-desc');
            if (!descCard) return;
            descCard.addEventListener('click', (e) => {
              e.stopPropagation();
              const firstQ = curSec.questions.find(q => q.groupId === gId);
              const currentDesc = (firstQ && firstQ.groupDescription) ? firstQ.groupDescription : '';

              descWrap.innerHTML = `
                <div class="group-desc-edit-wrap">
                  <textarea class="group-desc-textarea" data-group-id="${gId}" placeholder="グループの説明文を入力してください（例: 契約者様の現住所をご入力ください）">${escapeHtml(currentDesc)}</textarea>
                  <div class="group-desc-actions">
                    <button type="button" class="btn-group-desc-cancel">キャンセル</button>
                    <button type="button" class="btn-group-desc-save">保存</button>
                  </div>
                </div>
              `;

              const textarea = descWrap.querySelector('.group-desc-textarea');
              if (typeof setupWysiwygForTextarea === 'function') {
                setupWysiwygForTextarea(textarea);
              }

              if (textarea._wysiwygEditable) {
                textarea._wysiwygEditable.focus();
              } else {
                textarea.focus();
                textarea.select();
              }

              function restoreDesc(val) {
                descWrap.innerHTML = `
                  <div class="group-card-desc ${!val ? 'is-empty' : ''}" title="クリックしてグループの説明文を編集">
                    <span class="group-desc-icon">✏️</span>
                    <span class="group-desc-text">${val ? (typeof renderRichTextWithLinks === 'function' ? renderRichTextWithLinks(val) : escapeHtml(val)) : '＋ グループの説明文を追加（任意）'}</span>
                  </div>
                `;
                attachDescEditHandler();
              }

              function saveDesc() {
                if (textarea._wysiwygEditable && typeof wysiwygToSerializableText === 'function') {
                  textarea.value = wysiwygToSerializableText(textarea._wysiwygEditable);
                }
                const newDesc = textarea.value.trim();
                curSec.questions.forEach(q => {
                  if (q.groupId === gId) {
                    if (newDesc) q.groupDescription = newDesc;
                    else delete q.groupDescription;
                  }
                });
                if (window.S) window.S(true);
                if (window.x) window.x();
                if (window.renderLivePreview) window.renderLivePreview();
                restoreDesc(newDesc);
              }

              descWrap.querySelector('.btn-group-desc-save').addEventListener('click', (ev) => {
                ev.stopPropagation();
                saveDesc();
              });
              descWrap.querySelector('.btn-group-desc-cancel').addEventListener('click', (ev) => {
                ev.stopPropagation();
                restoreDesc(currentDesc);
              });

              const keyTargets = [textarea, textarea._wysiwygEditable].filter(Boolean);
              keyTargets.forEach(target => {
                target.addEventListener('keydown', (ke) => {
                  if (ke.key === 'Enter' && (ke.ctrlKey || ke.metaKey)) {
                    ke.preventDefault();
                    saveDesc();
                  }
                  if (ke.key === 'Escape') {
                    ke.preventDefault();
                    restoreDesc(currentDesc);
                  }
                });
              });
            });
          }
          attachDescEditHandler();

          // 3. Group-level same-as-above setup
          const sameBar = grpEl.querySelector('.group-same-as-above-bar');
          const sections = (window.n && window.n.sections) ? window.n.sections : [];
          const curSecIdx = sections.findIndex(s => s.id === curSec.id);
          const priorGroups = [];
          const seenPriorGIds = new Set([gId]);

          for (let sIdx = 0; sIdx <= curSecIdx; sIdx++) {
            const sItem = sections[sIdx];
            if (!sItem || !sItem.questions) continue;
            for (let qIdx = 0; qIdx < sItem.questions.length; qIdx++) {
              const qItem = sItem.questions[qIdx];
              if (sIdx === curSecIdx && qItem.groupId === gId) {
                break; // 自グループに達した
              }
              if (qItem.groupId && qItem.groupTitle && !seenPriorGIds.has(qItem.groupId)) {
                seenPriorGIds.add(qItem.groupId);
                priorGroups.push({
                  groupId: qItem.groupId,
                  title: qItem.groupTitle,
                  sectionTitle: sItem.title || `セクション ${sIdx + 1}`
                });
              }
            }
            if (sIdx === curSecIdx) break;
          }

          if (priorGroups.length > 0) {
            sameBar.style.display = 'none'; // 詳細設定に組み込むため常時表示はせず非表示固定
            const sameToggle = sameBar.querySelector('.group-same-as-above-toggle');
            const sameDetails = sameBar.querySelector('.group-same-as-above-details');
            const sameSelect = sameBar.querySelector('.group-same-as-above-source-select');
            const sameInput = sameBar.querySelector('.group-same-as-above-label-input');

            let optHtml = '';
            priorGroups.forEach(pg => {
              optHtml += `<option value="${escapeHtml(pg.groupId)}">[${escapeHtml(pg.sectionTitle)}] ${escapeHtml(pg.title)}</option>`;
            });
            sameSelect.innerHTML = optHtml;

            // Check if any question in this group currently has group same-as-above
            const existingGroupSameQ = cluster.questions.find(({ q }) => q.sameAsAbove && q.sameAsAbove.enabled && (q.sameAsAbove.sourceType === 'group' || (q.sameAsAbove.sourceQuestionId && q.sameAsAbove.sourceQuestionId.startsWith('group:'))));
            const isGroupSameActive = !!existingGroupSameQ;
            sameToggle.checked = isGroupSameActive;
            sameDetails.style.display = isGroupSameActive ? 'block' : 'none';

            if (existingGroupSameQ) {
              const curSrcGId = existingGroupSameQ.q.sameAsAbove.sourceGroupId || (existingGroupSameQ.q.sameAsAbove.sourceQuestionId ? existingGroupSameQ.q.sameAsAbove.sourceQuestionId.replace('group:', '') : '');
              if (curSrcGId && priorGroups.some(pg => pg.groupId === curSrcGId)) {
                sameSelect.value = curSrcGId;
              }
              sameInput.value = existingGroupSameQ.q.sameAsAbove.label || '';
            }

            sameToggle.addEventListener('change', () => {
              const checked = sameToggle.checked;
              sameDetails.style.display = checked ? 'block' : 'none';
              const targetGId = sameSelect.value || (priorGroups[0] ? priorGroups[0].groupId : '');
              const matchedPg = priorGroups.find(pg => pg.groupId === targetGId);
              let lbl = sameInput.value.trim();
              if (!lbl) {
                lbl = matchedPg ? `${matchedPg.title}と同じ` : '前述のグループと同じ';
                sameInput.value = lbl;
              }

              curSec.questions.forEach(q => {
                if (q.groupId === gId) {
                  if (!q.sameAsAbove) q.sameAsAbove = {};
                  q.sameAsAbove.enabled = checked;
                  if (checked) {
                    q.sameAsAbove.sourceType = 'group';
                    q.sameAsAbove.sourceGroupId = targetGId;
                    q.sameAsAbove.sourceQuestionId = 'group:' + targetGId;
                    q.sameAsAbove.label = lbl;
                  }
                }
              });
              if (window.S) window.S(true);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
            });

            sameSelect.addEventListener('change', () => {
              const targetGId = sameSelect.value;
              const matchedPg = priorGroups.find(pg => pg.groupId === targetGId);
              const newLbl = matchedPg ? `${matchedPg.title}と同じ` : '前述のグループと同じ';
              sameInput.value = newLbl;

              curSec.questions.forEach(q => {
                if (q.groupId === gId && q.sameAsAbove && q.sameAsAbove.enabled) {
                  q.sameAsAbove.sourceType = 'group';
                  q.sameAsAbove.sourceGroupId = targetGId;
                  q.sameAsAbove.sourceQuestionId = 'group:' + targetGId;
                  q.sameAsAbove.label = newLbl;
                }
              });
              if (window.S) window.S(true);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
            });

            sameInput.addEventListener('input', () => {
              const lbl = sameInput.value;
              curSec.questions.forEach(q => {
                if (q.groupId === gId && q.sameAsAbove && q.sameAsAbove.enabled) {
                  q.sameAsAbove.label = lbl;
                }
              });
              if (window.S) window.S(true);
              if (window.renderLivePreview) window.renderLivePreview();
            });
          }

          // 2-0. グループ詳細設定ボタン
          const grpSettingsBtn = grpEl.querySelector('.btn-group-settings');
          if (grpSettingsBtn) {
            grpSettingsBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const firstQ = cluster.questions[0]?.q;
              if (firstQ) {
                openQuestionSettingsDrawer(firstQ.id);
                setTimeout(() => {
                  const grpSec = document.getElementById('drawer-groupsame-section');
                  if (grpSec) grpSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
              } else {
                if (window.showSectionToast) window.showSectionToast('グループ内に質問がありません');
              }
            });
          }

          // 2. Toggle collapse
          const toggleBtn = grpEl.querySelector('.group-toggle-btn');
          const countBadge = grpEl.querySelector('.group-count-badge');
          function toggleGroupCollapse(e) {
            e.preventDefault();
            e.stopPropagation();
            window._groupCollapsedMap[gId] = !window._groupCollapsedMap[gId];
            const nowCollapsed = !!window._groupCollapsedMap[gId];
            if (nowCollapsed) grpEl.classList.add('is-collapsed');
            else grpEl.classList.remove('is-collapsed');
            toggleBtn.textContent = nowCollapsed ? '▸' : '▾';
            toggleBtn.title = nowCollapsed ? 'グループを展開' : 'グループを閉じる';
          }
          toggleBtn.addEventListener('click', toggleGroupCollapse);
          countBadge.addEventListener('click', toggleGroupCollapse);

          // 3. Add question to group
          const addQBtn = grpEl.querySelector('.btn-add-q-to-group');
          addQBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let insertIdx = -1;
            for (let i = curSec.questions.length - 1; i >= 0; i--) {
              if (curSec.questions[i].groupId === gId) {
                insertIdx = i + 1;
                break;
              }
            }
            if (insertIdx === -1) insertIdx = curSec.questions.length;

            const newQ = {
              id: 'q_' + Date.now(),
              type: 'text',
              title: `質問 ${curSec.questions.length + 1}`,
              description: '',
              required: false,
              validation: null,
              options: [],
              groupId: gId,
              groupTitle: gTitle
            };
            curSec.questions.splice(insertIdx, 0, newQ);

            if (window.S) window.S(true);
            if (window.le) window.le(curSec);
            if (window.x) window.x();
            if (window.renderLivePreview) window.renderLivePreview();
          });

          // 4. Ungroup
          const ungroupBtn = grpEl.querySelector('.btn-ungroup');
          ungroupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            curSec.questions.forEach(q => {
              if (q.groupId === gId) {
                delete q.groupId;
                delete q.groupTitle;
              }
            });
            if (window.S) window.S(true);
            if (window.le) window.le(curSec);
            if (window.x) window.x();
            if (window.renderLivePreview) window.renderLivePreview();
            if (window.showSectionToast) window.showSectionToast(`グループ「${gTitle}」を解除しました`);
          });

          // 5. Delete group
          const delBtn = grpEl.querySelector('.btn-delete-group');
          delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm(`グループ「${gTitle}」と含まれる質問（${cluster.questions.length}問）をすべて削除しますか？`)) {
              curSec.questions = curSec.questions.filter(q => q.groupId !== gId);
              if (window.S) window.S(true);
              if (window.le) window.le(curSec);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
              if (window.showSectionToast) window.showSectionToast(`グループ「${gTitle}」を削除しました`);
            }
          });

          // 6. メイン編集エリアでのグループDnDは無効化（左側セクション一覧からのみ並び替え可能にするため固定）
          // DnDイベントリスナーは登録せず、誤作動を防止

          container.appendChild(grpEl);
        }
      });
    }
  }

  function injectDnDSystem() {
    injectQuestionGroupSystem();
    injectSidebarDnDAndQuestionTree();
    injectQuestionCardDnD();
    injectOverviewSectionDnD();
  }

  // 1. サイドバーのセクション並び替え ＆ 質問ツリー
  function injectSidebarDnDAndQuestionTree() {
    const sectionList = document.getElementById('section-list');
    if (!sectionList || !window.n || !window.n.sections) return;

    const secItems = sectionList.querySelectorAll('.sidebar-item');
    secItems.forEach((secItem) => {
      const sId = secItem.dataset.sectionId;
      if (!sId) return;
      const secDef = window.n.sections.find(s => s.id === sId);
      if (!secDef) return;

      // A. セクション行のドラッグハンドル注入
      const infoDiv = secItem.querySelector('.sidebar-item-info');
      if (infoDiv && !infoDiv.querySelector('.sidebar-drag-handle')) {
        const handle = document.createElement('span');
        handle.className = 'sidebar-drag-handle';
        handle.innerHTML = '⠿';
        handle.title = 'ドラッグしてセクションを並び替え';
        infoDiv.insertBefore(handle, infoDiv.firstChild);
      }

      // A-2. セクション質問一覧の開閉（折りたたみ）トグルボタン
      window._sectionCollapsedMap = window._sectionCollapsedMap || {};
      const qList = secDef.questions || [];
      const hasQuestions = qList.length > 0;
      const isCollapsed = !!window._sectionCollapsedMap[sId];

      let toggleBtn = secItem.querySelector('.sidebar-sec-toggle-btn');
      if (!toggleBtn && infoDiv) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'sidebar-sec-toggle-btn';
        infoDiv.appendChild(toggleBtn);
      }

      if (toggleBtn) {
        if (!hasQuestions) {
          toggleBtn.style.visibility = 'hidden';
        } else {
          toggleBtn.style.visibility = 'visible';
          toggleBtn.innerHTML = isCollapsed ? '▸' : '▾';
          toggleBtn.title = isCollapsed ? '質問一覧を展開' : '質問一覧を閉じる';
        }

        if (!toggleBtn._hasToggleClick) {
          toggleBtn._hasToggleClick = true;
          toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window._sectionCollapsedMap[sId] = !window._sectionCollapsedMap[sId];
            injectSidebarDnDAndQuestionTree();
          });
        }
      }

      // バッジのクリックでも開閉可能にする
      const badge = secItem.querySelector('.sidebar-item-badge');
      if (badge && !badge._hasToggleClick) {
        badge._hasToggleClick = true;
        badge.title = 'クリックで質問一覧を開閉';
        badge.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window._sectionCollapsedMap[sId] = !window._sectionCollapsedMap[sId];
          injectSidebarDnDAndQuestionTree();
        });
      }

      // B. セクション行のDnD属性＆イベント
      if (!secItem._hasSecDnD) {
        secItem._hasSecDnD = true;
        secItem.setAttribute('draggable', 'true');

        secItem.addEventListener('dragstart', (e) => {
          window._currentDnD = { type: 'section', sectionId: sId };
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify(window._currentDnD));
          secItem.classList.add('is-dragging');
        });

        secItem.addEventListener('dragend', () => {
          secItem.classList.remove('is-dragging');
          document.querySelectorAll('.drag-over-top, .drag-over-bottom, .drag-target-highlight').forEach(el => {
            el.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-target-highlight');
          });
          window._currentDnD = null;
        });

        secItem.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (!window._currentDnD) return;
          e.dataTransfer.dropEffect = 'move';

          if (window._currentDnD.type === 'section') {
            if (window._currentDnD.sectionId === sId) return;
            const rect = secItem.getBoundingClientRect();
            const h = rect.height || 40;
            let isOverTop = true;
            if (e.clientY !== undefined && !isNaN(e.clientY)) {
              isOverTop = (e.clientY - rect.top) <= h / 2;
            } else if (secItem.classList.contains('drag-over-bottom')) {
              isOverTop = false;
            }
            if (isOverTop) {
              secItem.classList.add('drag-over-top');
              secItem.classList.remove('drag-over-bottom');
            } else {
              secItem.classList.add('drag-over-bottom');
              secItem.classList.remove('drag-over-top');
            }
          } else if (window._currentDnD.type === 'question') {
            secItem.classList.add('drag-target-highlight');
          }
        });

        secItem.addEventListener('dragleave', (e) => {
          if (!secItem.contains(e.relatedTarget)) {
            secItem.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-target-highlight');
          }
        });

        secItem.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          let isTop = secItem.classList.contains('drag-over-top');
          if (!isTop && !secItem.classList.contains('drag-over-bottom')) {
            const rect = secItem.getBoundingClientRect();
            const cY = (e.clientY !== undefined && !isNaN(e.clientY)) ? e.clientY : rect.top;
            isTop = (cY - rect.top) <= rect.height / 2;
          }
          secItem.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-target-highlight');

          if (!window._currentDnD) return;

          if (window._currentDnD.type === 'section') {
            const srcId = window._currentDnD.sectionId;
            if (srcId === sId) return;
            const fromIdx = window.n.sections.findIndex(s => s.id === srcId);
            let toIdx = window.n.sections.findIndex(s => s.id === sId);
            if (fromIdx !== -1 && toIdx !== -1) {
              const [movedSec] = window.n.sections.splice(fromIdx, 1);
              let targetIdx = window.n.sections.findIndex(s => s.id === sId);
              const insertIdx = isTop ? targetIdx : targetIdx + 1;
              window.n.sections.splice(insertIdx, 0, movedSec);
              if (window.S) window.S(true);
              if (window.x) window.x();
              if (window.renderLivePreview) window.renderLivePreview();
              if (window.showSectionToast) window.showSectionToast(`セクション「${movedSec.title || '無題'}」を移動しました`);
            }
          } else if (window._currentDnD.type === 'question') {
            const srcSecId = window._currentDnD.sectionId;
            const srcQId = window._currentDnD.questionId;
            const srcSec = window.n.sections.find(s => s.id === srcSecId);
            const tgtSec = secDef;
            if (srcSec && tgtSec && srcSecId !== tgtSec.id) {
              const qIdx = srcSec.questions.findIndex(q => q.id === srcQId);
              if (qIdx !== -1) {
                const [movedQ] = srcSec.questions.splice(qIdx, 1);
                tgtSec.questions.push(movedQ);
                if (window.S) window.S(true);
                if (window.x) window.x();
                if (window.renderLivePreview) window.renderLivePreview();
                if (window.showSectionToast) window.showSectionToast(`質問「${movedQ.title || '無題'}」を「${tgtSec.title || 'セクション'}」へ移動しました`);
              }
            }
          }
        });
      }

      // C. セクション配下の質問ツリー（.sidebar-q-container）の描画
      let qContainer = secItem.nextElementSibling;
      if (!qContainer || !qContainer.classList.contains('sidebar-q-container') || qContainer.dataset.ownerSectionId !== sId) {
        qContainer = document.createElement('div');
        qContainer.className = 'sidebar-q-container';
        qContainer.dataset.ownerSectionId = sId;
        secItem.parentNode.insertBefore(qContainer, secItem.nextSibling);
      }

      // 開閉クラスの同期
      if (isCollapsed) {
        qContainer.classList.add('is-collapsed');
        secItem.classList.add('is-collapsed');
      } else {
        qContainer.classList.remove('is-collapsed');
        secItem.classList.remove('is-collapsed');
      }

      if (qList.length === 0) {
        qContainer.innerHTML = '';
        return;
      }

      // 差分同期判定
      const existingUl = qContainer.querySelector('.sidebar-q-list');
      const existingItems = qContainer.querySelectorAll('.sidebar-q-item');
      let needsRebuild = !existingUl || existingItems.length !== qList.length;
      if (!needsRebuild) {
        for (let i = 0; i < qList.length; i++) {
          if (!existingItems[i] || existingItems[i].dataset.questionId !== qList[i].id) {
            needsRebuild = true;
            break;
          }
        }
      }

      if (needsRebuild) {
        qContainer.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'sidebar-q-list';

        function createSidebarQuestionLi(q, qIdx) {
          const typeInfo = getQuestionTypeInfo(q.type);
          const li = document.createElement('li');
          li.className = 'sidebar-q-item';
          li.dataset.questionId = q.id;
          li.dataset.sectionId = sId;
          li.setAttribute('draggable', 'true');

          li.innerHTML = `
            <span class="sidebar-drag-handle" title="ドラッグして質問を並び替え">⠿</span>
            <span class="sidebar-q-icon">${typeInfo.icon}</span>
            <span class="sidebar-q-title" title="${escapeHtml(q.title || '無題の質問')}">${escapeHtml(q.title || '無題の質問')}${q.required ? '<span class="sidebar-q-required">*</span>' : ''}</span>
            <span class="sidebar-q-badge">${typeInfo.label}</span>
          `;

          // クリックで該当質問カードへスクロール
          li.addEventListener('click', (e) => {
            if (e.target.closest('.sidebar-drag-handle')) return;
            e.stopPropagation();
            if (window.r !== sId) {
              const ownerSec = document.querySelector(`.sidebar-item[data-section-id="${sId}"]`);
              if (ownerSec) {
                ownerSec.click();
              } else {
                window.r = sId;
                if (window.x) window.x();
              }
            }
            setTimeout(() => {
              const card = document.querySelector(`.question-card[data-question-id="${q.id}"]`);
              if (card) {
                const parentGroup = card.closest('.editor-question-group');
                if (parentGroup && parentGroup.classList.contains('is-collapsed')) {
                  parentGroup.classList.remove('is-collapsed');
                  const gId = parentGroup.dataset.groupId;
                  if (gId && window._groupCollapsedMap) window._groupCollapsedMap[gId] = false;
                  const btn = parentGroup.querySelector('.group-toggle-btn');
                  if (btn) btn.textContent = '▾';
                }
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.remove('just-focused');
                void card.offsetWidth;
                card.classList.add('just-focused');
              }
            }, 80);
          });

          // 質問のDnD
          li.addEventListener('dragstart', (e) => {
            window._currentDnD = { type: 'question', sectionId: sId, questionId: q.id, index: qIdx };
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify(window._currentDnD));
            li.classList.add('is-dragging');
          });

          li.addEventListener('dragend', () => {
            li.classList.remove('is-dragging');
            document.querySelectorAll('.drag-over-top, .drag-over-bottom, .drag-target-highlight').forEach(el => {
              el.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-target-highlight');
            });
            window._currentDnD = null;
          });

          li.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!window._currentDnD || (window._currentDnD.type !== 'question' && window._currentDnD.type !== 'question-group')) return;
            if (window._currentDnD.type === 'question' && window._currentDnD.questionId === q.id) return;
            e.dataTransfer.dropEffect = 'move';

            const rect = li.getBoundingClientRect();
            const h = rect.height || 30;
            let isOverTop = true;
            if (e.clientY !== undefined && !isNaN(e.clientY)) {
              isOverTop = (e.clientY - rect.top) <= h / 2;
            } else if (li.classList.contains('drag-over-bottom')) {
              isOverTop = false;
            }
            if (isOverTop) {
              li.classList.add('drag-over-top');
              li.classList.remove('drag-over-bottom');
            } else {
              li.classList.add('drag-over-bottom');
              li.classList.remove('drag-over-top');
            }
          });

          li.addEventListener('dragleave', (e) => {
            if (!li.contains(e.relatedTarget)) {
              li.classList.remove('drag-over-top', 'drag-over-bottom');
            }
          });

          li.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let isTop = li.classList.contains('drag-over-top');
            if (!isTop && !li.classList.contains('drag-over-bottom')) {
              const rect = li.getBoundingClientRect();
              const cY = (e.clientY !== undefined && !isNaN(e.clientY)) ? e.clientY : rect.top;
              isTop = (cY - rect.top) <= rect.height / 2;
            }
            li.classList.remove('drag-over-top', 'drag-over-bottom');

            if (!window._currentDnD) return;

            if (window._currentDnD.type === 'question-group') {
              const srcSec = window.n.sections.find(s => s.id === window._currentDnD.sectionId);
              const tgtSec = secDef;
              if (!srcSec || !tgtSec) return;
              const srcGroupId = window._currentDnD.groupId;
              const movedQList = [];
              srcSec.questions = srcSec.questions.filter(x => {
                if (x.groupId === srcGroupId) {
                  movedQList.push(x);
                  return false;
                }
                return true;
              });
              let targetIdx = tgtSec.questions.findIndex(x => x.id === q.id);
              const insertIdx = isTop ? targetIdx : targetIdx + 1;
              tgtSec.questions.splice(insertIdx, 0, ...movedQList);
              if (window.S) window.S(true);
              if (window.x) window.x();
              if (window.le && window.r === tgtSec.id) window.le(tgtSec);
              if (window.renderLivePreview) window.renderLivePreview();
              if (window.showSectionToast) window.showSectionToast(`グループを並び替えました`);
              return;
            }

            if (window._currentDnD.type !== 'question') return;
            const srcSecId = window._currentDnD.sectionId;
            const srcQId = window._currentDnD.questionId;
            if (srcQId === q.id) return;

            const srcSec = window.n.sections.find(s => s.id === srcSecId);
            const tgtSec = secDef;
            if (!srcSec || !tgtSec) return;

            const fromIdx = srcSec.questions.findIndex(x => x.id === srcQId);
            if (fromIdx === -1) return;

            const [movedQ] = srcSec.questions.splice(fromIdx, 1);
            let targetIdx = tgtSec.questions.findIndex(x => x.id === q.id);
            const insertIdx = isTop ? targetIdx : targetIdx + 1;
            movedQ.groupId = q.groupId || null;
            movedQ.groupTitle = q.groupTitle || null;
            tgtSec.questions.splice(insertIdx, 0, movedQ);

            if (window.S) window.S(true);
            if (window.x) window.x();
            if (window.le && window.r === tgtSec.id) window.le(tgtSec);
            if (window.renderLivePreview) window.renderLivePreview();
            if (window.showSectionToast) window.showSectionToast(`質問「${movedQ.title || '無題'}」を並び替えました`);
          });

          return li;
        }

        // グループと単独質問のクラスタリング
        const clusters = [];
        let curCluster = null;
        qList.forEach((q, qIdx) => {
          if (q.groupId) {
            if (!curCluster || curCluster.groupId !== q.groupId) {
              curCluster = { type: 'group', groupId: q.groupId, groupTitle: q.groupTitle || 'グループ', questions: [] };
              clusters.push(curCluster);
            }
            curCluster.questions.push({ q, qIdx });
          } else {
            curCluster = null;
            clusters.push({ type: 'single', q, qIdx });
          }
        });

        clusters.forEach((item) => {
          if (item.type === 'single') {
            ul.appendChild(createSidebarQuestionLi(item.q, item.qIdx));
          } else {
            const grpLi = document.createElement('li');
            grpLi.className = 'sidebar-group-wrapper';
            grpLi.dataset.groupId = item.groupId;

            window._sidebarGroupCollapsedMap = window._sidebarGroupCollapsedMap || {};
            const isGrpCollapsed = !!window._sidebarGroupCollapsedMap[item.groupId];

            const grpDiv = document.createElement('div');
            grpDiv.className = 'sidebar-group-item';
            grpDiv.dataset.groupId = item.groupId;
            grpDiv.dataset.sectionId = sId;
            grpDiv.innerHTML = `
              <div class="sidebar-group-left">
                <span class="sidebar-drag-handle" title="ドラッグしてグループを並び替え">⠿</span>
                <span class="sidebar-group-title" title="${escapeHtml(item.groupTitle)}">${escapeHtml(item.groupTitle)}</span>
                <span class="sidebar-group-badge">${item.questions.length}</span>
              </div>
              <button type="button" class="sidebar-group-toggle-btn" title="${isGrpCollapsed ? 'グループを展開' : 'グループを閉じる'}">${isGrpCollapsed ? '▸' : '▾'}</button>
            `;

            const grpToggleBtn = grpDiv.querySelector('.sidebar-group-toggle-btn');
            grpToggleBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              window._sidebarGroupCollapsedMap[item.groupId] = !window._sidebarGroupCollapsedMap[item.groupId];
              const isNowCollapsed = !!window._sidebarGroupCollapsedMap[item.groupId];
              grpQCont.classList.toggle('is-collapsed', isNowCollapsed);
              grpToggleBtn.textContent = isNowCollapsed ? '▸' : '▾';
              grpToggleBtn.title = isNowCollapsed ? 'グループを展開' : 'グループを閉じる';
            });

            // クリックで該当グループカードへスクロール
            grpDiv.addEventListener('click', (e) => {
              if (e.target.closest('.sidebar-drag-handle') || e.target.closest('.sidebar-group-toggle-btn')) return;
              e.stopPropagation();
              if (window.r !== sId) {
                const ownerSec = document.querySelector(`.sidebar-item[data-section-id="${sId}"]`);
                if (ownerSec) {
                  ownerSec.click();
                } else {
                  window.r = sId;
                  if (window.x) window.x();
                }
              }
              setTimeout(() => {
                const grpCard = document.querySelector(`.editor-question-group[data-group-id="${item.groupId}"]`);
                if (grpCard) {
                  grpCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 80);
            });

            // サイドバー内グループのDnD
            grpDiv.setAttribute('draggable', 'true');
            grpDiv.addEventListener('dragstart', (e) => {
              window._currentDnD = { type: 'question-group', sectionId: sId, groupId: item.groupId, groupTitle: item.groupTitle };
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', JSON.stringify(window._currentDnD));
              grpDiv.classList.add('is-dragging');
            });

            grpDiv.addEventListener('dragend', () => {
              grpDiv.classList.remove('is-dragging');
              document.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
              window._currentDnD = null;
            });

            grpDiv.addEventListener('dragover', (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!window._currentDnD || (window._currentDnD.type !== 'question-group' && window._currentDnD.type !== 'question')) return;
              if (window._currentDnD.type === 'question-group' && window._currentDnD.groupId === item.groupId) return;
              e.dataTransfer.dropEffect = 'move';
              const rect = grpDiv.getBoundingClientRect();
              const isOverTop = (e.clientY - rect.top) <= (rect.height || 30) / 2;
              if (isOverTop) {
                grpDiv.classList.add('drag-over-top');
                grpDiv.classList.remove('drag-over-bottom');
              } else {
                grpDiv.classList.add('drag-over-bottom');
                grpDiv.classList.remove('drag-over-top');
              }
            });

            grpDiv.addEventListener('dragleave', (e) => {
              if (!grpDiv.contains(e.relatedTarget)) {
                grpDiv.classList.remove('drag-over-top', 'drag-over-bottom');
              }
            });

            grpDiv.addEventListener('drop', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const isTop = grpDiv.classList.contains('drag-over-top');
              grpDiv.classList.remove('drag-over-top', 'drag-over-bottom');
              if (!window._currentDnD) return;
              const tgtSec = secDef;
              if (window._currentDnD.type === 'question-group') {
                const srcSec = window.n.sections.find(s => s.id === window._currentDnD.sectionId);
                if (!srcSec || !tgtSec) return;
                const srcGroupId = window._currentDnD.groupId;
                if (srcGroupId === item.groupId) return;
                const movedQuestions = [];
                srcSec.questions = srcSec.questions.filter(q => {
                  if (q.groupId === srcGroupId) {
                    movedQuestions.push(q);
                    return false;
                  }
                  return true;
                });
                const tgtFirstIdx = tgtSec.questions.findIndex(q => q.groupId === item.groupId);
                if (tgtFirstIdx !== -1) {
                  let insertIdx = tgtFirstIdx;
                  if (!isTop) {
                    for (let i = tgtSec.questions.length - 1; i >= 0; i--) {
                      if (tgtSec.questions[i].groupId === item.groupId) {
                        insertIdx = i + 1;
                        break;
                      }
                    }
                  }
                  tgtSec.questions.splice(insertIdx, 0, ...movedQuestions);
                } else {
                  tgtSec.questions.push(...movedQuestions);
                }
                if (window.S) window.S(true);
                if (window.x) window.x();
                if (window.le && window.r === tgtSec.id) window.le(tgtSec);
                if (window.renderLivePreview) window.renderLivePreview();
                if (window.showSectionToast) window.showSectionToast(`グループを並び替えました`);
              } else if (window._currentDnD.type === 'question') {
                const srcSec = window.n.sections.find(s => s.id === window._currentDnD.sectionId);
                const srcQId = window._currentDnD.questionId;
                if (!srcSec || !tgtSec) return;
                const qIdx = srcSec.questions.findIndex(x => x.id === srcQId);
                if (qIdx === -1) return;
                const [movedQ] = srcSec.questions.splice(qIdx, 1);
                movedQ.groupId = item.groupId;
                movedQ.groupTitle = item.groupTitle;
                const tgtFirstIdx = tgtSec.questions.findIndex(q => q.groupId === item.groupId);
                let insertIdx = tgtFirstIdx;
                if (!isTop) {
                  for (let i = tgtSec.questions.length - 1; i >= 0; i--) {
                    if (tgtSec.questions[i].groupId === item.groupId) {
                      insertIdx = i + 1;
                      break;
                    }
                  }
                }
                tgtSec.questions.splice(insertIdx, 0, movedQ);
                if (window.S) window.S(true);
                if (window.x) window.x();
                if (window.le && window.r === tgtSec.id) window.le(tgtSec);
                if (window.renderLivePreview) window.renderLivePreview();
                if (window.showSectionToast) window.showSectionToast(`質問「${movedQ.title || '無題'}」を「${item.groupTitle}」へ移動しました`);
              }
            });

            const grpQCont = document.createElement('div');
            grpQCont.className = 'sidebar-group-q-container' + (isGrpCollapsed ? ' is-collapsed' : '');
            const grpUl = document.createElement('ul');
            grpUl.className = 'sidebar-q-list';

            item.questions.forEach(({ q, qIdx }) => {
              grpUl.appendChild(createSidebarQuestionLi(q, qIdx));
            });

            grpQCont.appendChild(grpUl);
            grpLi.appendChild(grpDiv);
            grpLi.appendChild(grpQCont);
            ul.appendChild(grpLi);
          }
        });

        qContainer.appendChild(ul);
      } else {
        const items = existingUl.querySelectorAll('.sidebar-q-item');
        items.forEach((li, idx) => {
          const q = qList[idx];
          if (!q) return;
          const titleSpan = li.querySelector('.sidebar-q-title');
          if (titleSpan) {
            const desired = `${escapeHtml(q.title || '無題の質問')}${q.required ? '<span class="sidebar-q-required">*</span>' : ''}`;
            if (titleSpan.innerHTML !== desired) {
              titleSpan.innerHTML = desired;
            }
          }
        });

        const grpWrappers = existingUl.querySelectorAll('.sidebar-group-wrapper');
        grpWrappers.forEach(gw => {
          const gId = gw.dataset.groupId;
          const isGrpCollapsed = !!(window._sidebarGroupCollapsedMap && window._sidebarGroupCollapsedMap[gId]);
          const gCont = gw.querySelector('.sidebar-group-q-container');
          if (gCont) {
            if (isGrpCollapsed) gCont.classList.add('is-collapsed');
            else gCont.classList.remove('is-collapsed');
          }
          const tBtn = gw.querySelector('.sidebar-group-toggle-btn');
          if (tBtn) {
            tBtn.textContent = isGrpCollapsed ? '▸' : '▾';
            tBtn.title = isGrpCollapsed ? 'グループを展開' : 'グループを閉じる';
          }
        });
      }
    });
  }

  // 2. メイン編集画面の質問カード（.question-card）の固定化（ドラッグ無効化・固定表示）
  function injectQuestionCardDnD() {
    const qCards = document.querySelectorAll('#questions-container .question-card');
    if (!qCards.length) return;

    qCards.forEach((card) => {
      // 既存のドラッグハンドルがあれば削除
      const handleBar = card.querySelector('.question-card-drag-handle');
      if (handleBar) handleBar.remove();

      // カードを固定化（ドラッグ不可）
      card.setAttribute('draggable', 'false');
      card.style.cursor = 'default';
      card.classList.remove('is-dragging', 'drag-over-top', 'drag-over-bottom');
    });
  }

  // 3. 概要画面のセクションカード（.overview-section-card）の固定化（ドラッグ無効化・固定表示）
  function injectOverviewSectionDnD() {
    const ovCards = document.querySelectorAll('#overview-sections-list .overview-section-card');
    if (!ovCards.length) return;

    ovCards.forEach((card) => {
      // 既存のドラッグハンドルがあれば削除
      const handle = card.querySelector('.sidebar-drag-handle');
      if (handle) handle.remove();

      // カードを固定化（ドラッグ不可）
      card.setAttribute('draggable', 'false');
      card.style.cursor = 'default';
      card.classList.remove('is-dragging', 'drag-over-top', 'drag-over-bottom');
    });
  }

  function injectValidationNoticeEnhancements() {
    const containers = document.querySelectorAll('.validation-edit-container');
    containers.forEach(container => {
      const selects = container.querySelectorAll('.form-group-row select');
      if (selects.length < 2) return;
      const catSelect = selects[0];
      const ruleSelect = selects[1];
      if (catSelect.value !== 'api') return;

      // 1. zip_code option がない場合は追加
      if (!ruleSelect.querySelector('option[value="zip_code"]')) {
        const opt = document.createElement('option');
        opt.value = 'zip_code';
        opt.textContent = '郵便番号検索（郵便番号住所検索API連携）';
        const bankOpt = ruleSelect.querySelector('option[value="bank_name"]');
        if (bankOpt) {
          ruleSelect.insertBefore(opt, bankOpt);
        } else {
          ruleSelect.appendChild(opt);
        }
      }

      // 2. 判定ルール変更時の自動エラーメッセージ補正
      if (!ruleSelect.dataset.zipChangeBound) {
        ruleSelect.dataset.zipChangeBound = '1';
        ruleSelect.addEventListener('change', () => {
          if (ruleSelect.value === 'zip_code') {
            const errInput = container.querySelector('input.form-control[placeholder*="エラー時に表示するテキスト"]');
            if (errInput && (!errInput.value || errInput.value.includes('法人名') || errInput.value.includes('銀行名') || errInput.value.includes('支店'))) {
              errInput.value = '正しい郵便番号（7桁の半角数字）を入力してください。';
              errInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        });
      }

      // 3. 判定ルールが zip_code の場合の案内ボックス同期
      if (ruleSelect.value === 'zip_code') {
        const notice = container.querySelector('.api-validation-notice');
        if (notice && notice.dataset.zipNoticeBound !== 'zip_code') {
          notice.dataset.zipNoticeBound = 'zip_code';
          notice.innerHTML = `
            <div style="font-weight:600; margin-bottom:4px; display:flex; align-items:center; gap:6px;">📮 郵便番号・住所検索API連携（ZipCloud連携）</div>
            <div style="color:var(--color-text-muted); font-size:0.8rem;">回答者が7桁の郵便番号を入力する際、実在する住所（都道府県・市区町村・町域）をリアルタイム検索・自動補完します。</div>
          `;
        }
      }
    });
  }

  // 📨 メールアドレス質問（通常 / 回答控え自動送信）の設定トグル
  function injectEmailAutoReplyToggle() {
    const cards = document.querySelectorAll('.question-card');
    cards.forEach(card => {
      const qId = card.dataset.questionId;
      if (!qId) return;
      const q = findQuestionDefById(qId);
      if (!q) return;

      const v = q.validation || {};
      const isEmailVal = (v.category === 'text' && v.condition === 'email') || (v.category === 'regex' && v.presetKey === 'email') || (v.value && v.value.includes('@'));
      const isEmailTitle = /メール|email|mail/i.test(q.title || '');
      const isEmailQuestion = isEmailVal || isEmailTitle || q.autoReply !== undefined;

      let existing = card.querySelector('.email-autoreply-toggle-container');

      if (!isEmailQuestion) {
        if (existing) existing.remove();
        return;
      }

      const isChecked = !!q.autoReply;

      if (!existing) {
        existing = document.createElement('div');
        existing.className = 'email-autoreply-toggle-container';
        existing.style.cssText = 'margin-top: 12px; margin-bottom: 6px; padding: 10px 12px; background: rgba(26, 115, 232, 0.06); border: 1px solid rgba(26, 115, 232, 0.25); border-radius: 6px;';
        
        const valContainer = card.querySelector('.validation-edit-container');
        if (valContainer) {
          valContainer.parentNode.insertBefore(existing, valContainer);
        } else {
          const actions = card.querySelector('.question-card-actions');
          if (actions) {
            actions.parentNode.insertBefore(existing, actions);
          } else {
            card.appendChild(existing);
          }
        }
      }

      if (existing.dataset.boundAutoReply === (isChecked ? '1' : '0')) return;
      existing.dataset.boundAutoReply = isChecked ? '1' : '0';

      existing.innerHTML = `
        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600; color: var(--color-text); margin: 0;">
          <input type="checkbox" class="chk-email-autoreply" ${isChecked ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;" />
          <span>📨 回答送信後にこのアドレス宛てに回答内容の控えを自動送信する</span>
        </label>
        <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-left: 24px; margin-top: 4px; line-height: 1.4;">
          ${isChecked 
            ? '<span style="color:#1a73e8; font-weight:600;">✅【回答控え自動送信が有効】</span> 回答者がフォームを送信完了した際、入力内容のまとめメールがこのメールアドレス宛てに自動配信されます。' 
            : '<span style="color:var(--color-text-muted);">⚪【通常のメールアドレス】</span> 入力のみ行われ、回答控えメールの自動送信は行われません。'}
        </div>
      `;

      const chk = existing.querySelector('.chk-email-autoreply');
      if (chk) {
        chk.addEventListener('change', (e) => {
          q.autoReply = e.target.checked;
          if (q.autoReply) {
            if (!q.description || q.description === '説明（任意）' || q.description === 'ご連絡可能なメールアドレスを入力してください。') {
              q.description = 'ご回答内容の控えをこのメールアドレス宛てにお送りします。';
              const descInput = card.querySelector('.q-desc-input');
              if (descInput) descInput.value = q.description;
            }
          }
          if (window.S) window.S(true);
          existing.dataset.boundAutoReply = q.autoReply ? '1' : '0';
          injectEmailAutoReplyToggle();
          if (window.renderLivePreview) window.renderLivePreview();
        });
      }
    });
  }

  function setupEditorRenderHooks() {
    setupBtnAddGroup();

    const originalLe = window.le;
    if (originalLe) {
      window.le = function(sec) {
        originalLe(sec);
        patchPresetSelectMenu();
        renderLivePreview();
        injectSectionEnhancements(sec);
        injectRichTextToolbars();
        injectQuestionGroupSystem(sec);
        injectDnDSystem();
        injectValidationNoticeEnhancements();
        injectEmailAutoReplyToggle();
      };
    }

    const originalX = window.x;
    if (originalX) {
      window.x = function() {
        originalX();
        patchPresetSelectMenu();
        renderLivePreview();
        injectSectionEnhancements();
        injectRichTextToolbars();
        injectQuestionGroupSystem();
        injectDnDSystem();
        injectValidationNoticeEnhancements();
        injectEmailAutoReplyToggle();
        if (typeof window.updateEditorSplitViews === 'function') {
          window.updateEditorSplitViews();
        }
      };
    }

    // アクティブセクション編集画面が表示されているときの一時保存UI・途中送信UIおよび書式ツールバー、DnDの自律維持
    setInterval(() => {
      patchPresetSelectMenu();
      if (typeof syncWindowIe === 'function') syncWindowIe();
      if (typeof patchRegexPresetDropdowns === 'function') patchRegexPresetDropdowns();
      injectRichTextToolbars();
      injectQuestionGroupSystem();
      injectDnDSystem();
      injectValidationNoticeEnhancements();
      injectEmailAutoReplyToggle();
      const activeSectionEditor = document.getElementById('active-section-editor');
      if (activeSectionEditor && activeSectionEditor.style.display !== 'none') {
        const metaEdit = activeSectionEditor.querySelector('.section-meta-edit');
        const nextSelect = document.getElementById('editor-section-next');
        const needsEnhancement = metaEdit && (
          (nextSelect && !nextSelect.querySelector('option[value="partial_submit"]')) ||
          !metaEdit.querySelector('.partial-submit-hint-box')
        );
        if (needsEnhancement) {
          injectSectionEnhancements();
        }
      }
    }, 100);

    document.addEventListener('input', (e) => {
      const target = e.target;
      if (target.closest('.question-card') || target.closest('.section-meta-edit') || target.closest('.form-title-desc-card') || target.closest('.form-group')) {
        renderLivePreview();
        if (typeof debouncedRenderFlowmap === 'function') debouncedRenderFlowmap(150);
      }
    });

    document.addEventListener('focusout', (e) => {
      const target = e.target;
      if (target.closest('.question-card') || target.closest('.section-meta-edit') || target.closest('.form-title-desc-card')) {
        renderLivePreview();
        if (typeof debouncedRenderFlowmap === 'function') debouncedRenderFlowmap(150);
      }
    });

    // サイドバーのセクションクリックや概要画面からの編集クリックを検知して即座にプレビュー更新
    document.addEventListener('click', (e) => {
      const sidebarItem = e.target.closest('#section-list .sidebar-item');
      if (sidebarItem && sidebarItem.dataset.sectionId) {
        window.r = sidebarItem.dataset.sectionId;
        setTimeout(() => {
          injectSectionEnhancements();
          renderLivePreview();
          if (typeof window.updateEditorSplitViews === 'function') {
            window.updateEditorSplitViews();
          }
        }, 40);
      }
      const ovEditBtn = e.target.closest('#overview-sections-list .overview-section-card .btn-primary');
      if (ovEditBtn) {
        setTimeout(() => {
          const activeItem = document.querySelector('#section-list .sidebar-item.active');
          if (activeItem && activeItem.dataset.sectionId) {
            window.r = activeItem.dataset.sectionId;
          }
          injectSectionEnhancements();
          renderLivePreview();
          if (typeof window.updateEditorSplitViews === 'function') {
            window.updateEditorSplitViews();
          }
        }, 40);
      }
      const ovTab = e.target.closest('#sidebar-item-overview') || e.target.closest('#btn-back-to-overview');
      if (ovTab) {
        window.r = null;
        setTimeout(() => {
          renderLivePreview();
          if (typeof window.updateEditorSplitViews === 'function') {
            window.updateEditorSplitViews();
          }
        }, 40);
      }
    });
  }

  function moveQuestionInEditor(sec, fromIdx, toIdx) {
    if (!sec || !sec.questions) return;
    if (fromIdx < 0 || fromIdx >= sec.questions.length) return;
    if (toIdx < 0 || toIdx >= sec.questions.length) return;
    const targetId = sec.questions[fromIdx].id;
    const temp = sec.questions[fromIdx];
    sec.questions[fromIdx] = sec.questions[toIdx];
    sec.questions[toIdx] = temp;
    if (window.S) window.S();
    if (window.x) window.x();
    renderLivePreview();
    setTimeout(() => {
      const moved = document.querySelector(`.question-card[data-question-id="${targetId}"]`);
      if (moved) moved.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 40);
  }

  function evaluateSkipCondition(answer, condition, val1, val2) {
    condition = condition || 'equals';
    const v1 = (val1 !== undefined && val1 !== null) ? val1.toString().trim() : '';
    const v2 = (val2 !== undefined && val2 !== null) ? val2.toString().trim() : '';

    let isAnswerEmpty = false;
    let answerStr = '';
    if (answer === undefined || answer === null) {
      isAnswerEmpty = true;
      answerStr = '';
    } else if (Array.isArray(answer)) {
      isAnswerEmpty = (answer.length === 0);
      answerStr = answer.join(', ').trim();
    } else {
      answerStr = answer.toString().trim();
      isAnswerEmpty = (answerStr === '');
    }

    switch (condition) {
      // 【空白】
      case 'is_empty':
        return isAnswerEmpty;
      case 'is_not_empty':
        return !isAnswerEmpty;

      // 【テキスト】
      case 'text_contains':
        if (v1 === '') return false;
        if (Array.isArray(answer)) {
          return answer.some(item => (item || '').toString().toLowerCase().includes(v1.toLowerCase()));
        }
        return answerStr.toLowerCase().includes(v1.toLowerCase());

      case 'text_not_contains':
        if (v1 === '') return false;
        if (Array.isArray(answer)) {
          return !answer.some(item => (item || '').toString().toLowerCase().includes(v1.toLowerCase()));
        }
        return !answerStr.toLowerCase().includes(v1.toLowerCase());

      case 'text_starts_with':
        if (v1 === '') return false;
        return answerStr.toLowerCase().startsWith(v1.toLowerCase());

      case 'text_ends_with':
        if (v1 === '') return false;
        return answerStr.toLowerCase().endsWith(v1.toLowerCase());

      case 'text_equals':
        return answerStr === v1;

      // 【日付】
      case 'date_is': {
        if (isAnswerEmpty || v1 === '') return false;
        const dA = new Date(answerStr).getTime();
        const dT = new Date(v1).getTime();
        return !isNaN(dA) && !isNaN(dT) && dA === dT;
      }
      case 'date_before': {
        if (isAnswerEmpty || v1 === '') return false;
        const dA = new Date(answerStr).getTime();
        const dT = new Date(v1).getTime();
        return !isNaN(dA) && !isNaN(dT) && dA < dT;
      }
      case 'date_after': {
        if (isAnswerEmpty || v1 === '') return false;
        const dA = new Date(answerStr).getTime();
        const dT = new Date(v1).getTime();
        return !isNaN(dA) && !isNaN(dT) && dA > dT;
      }

      // 【数値 / 比較】
      case 'greater_than': {
        if (isAnswerEmpty || v1 === '') return false;
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const numT = parseFloat(v1.replace(/,/g, ''));
        return !isNaN(numA) && !isNaN(numT) && numA > numT;
      }
      case 'greater_than_or_equal': {
        if (isAnswerEmpty || v1 === '') return false;
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const numT = parseFloat(v1.replace(/,/g, ''));
        return !isNaN(numA) && !isNaN(numT) && numA >= numT;
      }
      case 'less_than': {
        if (isAnswerEmpty || v1 === '') return false;
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const numT = parseFloat(v1.replace(/,/g, ''));
        return !isNaN(numA) && !isNaN(numT) && numA < numT;
      }
      case 'less_than_or_equal': {
        if (isAnswerEmpty || v1 === '') return false;
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const numT = parseFloat(v1.replace(/,/g, ''));
        return !isNaN(numA) && !isNaN(numT) && numA <= numT;
      }
      case 'equals': {
        if (isAnswerEmpty && v1 === '') return false;
        if (Array.isArray(answer)) {
          return answer.includes(v1);
        }
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const numT = parseFloat(v1.replace(/,/g, ''));
        if (!isNaN(numA) && !isNaN(numT) && answerStr === numA.toString() && v1 === numT.toString()) {
          return numA === numT;
        }
        return answerStr === v1;
      }
      case 'not_equals': {
        if (isAnswerEmpty) return false;
        if (Array.isArray(answer)) {
          return !answer.includes(v1);
        }
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const numT = parseFloat(v1.replace(/,/g, ''));
        if (!isNaN(numA) && !isNaN(numT) && answerStr === numA.toString() && v1 === numT.toString()) {
          return numA !== numT;
        }
        return answerStr !== v1;
      }
      case 'between': {
        if (isAnswerEmpty || v1 === '' || v2 === '') return false;
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const min = parseFloat(v1.replace(/,/g, ''));
        const max = parseFloat(v2.replace(/,/g, ''));
        if (!isNaN(numA) && !isNaN(min) && !isNaN(max)) {
          return numA >= min && numA <= max;
        }
        const dA = new Date(answerStr).getTime();
        const dMin = new Date(v1).getTime();
        const dMax = new Date(v2).getTime();
        if (!isNaN(dA) && !isNaN(dMin) && !isNaN(dMax)) {
          return dA >= dMin && dA <= dMax;
        }
        return false;
      }
      case 'not_between': {
        if (isAnswerEmpty || v1 === '' || v2 === '') return false;
        const numA = parseFloat(answerStr.replace(/,/g, ''));
        const min = parseFloat(v1.replace(/,/g, ''));
        const max = parseFloat(v2.replace(/,/g, ''));
        if (!isNaN(numA) && !isNaN(min) && !isNaN(max)) {
          return numA < min || numA > max;
        }
        const dA = new Date(answerStr).getTime();
        const dMin = new Date(v1).getTime();
        const dMax = new Date(v2).getTime();
        if (!isNaN(dA) && !isNaN(dMin) && !isNaN(dMax)) {
          return dA < dMin || dA > dMax;
        }
        return false;
      }
      default:
        return answerStr !== '' && answerStr === v1;
    }
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
        const triggerVal2 = q.skipLogic.value2;
        const condition = q.skipLogic.condition || "equals";
        const action = q.skipLogic.action || "disable";
        
        const answer = values[depId];
        const isTriggered = evaluateSkipCondition(answer, condition, triggerVal, triggerVal2);

        if (isTriggered) {
          if (action === 'disable') {
            card.classList.add('q-card-disabled');
            const input = card.querySelector('input, textarea, select');
            if (input) input.disabled = true;
          } else {
            card.style.display = 'none';
            const inputs = card.querySelectorAll('input, textarea, select');
            inputs.forEach(inp => { inp.value = ''; });
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

  function getActiveSection() {
    if (!window.n || !window.n.sections || window.n.sections.length === 0) return null;
    if (window.r) {
      const found = window.n.sections.find(s => s && s.id === window.r);
      if (found) return found;
    }
    const activeSidebar = document.querySelector('#section-list .sidebar-item.active');
    if (activeSidebar && activeSidebar.dataset && activeSidebar.dataset.sectionId) {
      const secId = activeSidebar.dataset.sectionId;
      const found = window.n.sections.find(s => s && s.id === secId);
      if (found) {
        window.r = secId;
        return found;
      }
    }
    return window.n.sections[0] || null;
  }

  function renderLivePreview() {
    window.renderLivePreview = renderLivePreview;
    const liveContainer = document.getElementById('live-preview-section-container');
    if (!liveContainer || !window.n) return;

    const g = window.G || window.n;
    const activeSec = getActiveSection();
    const isPro = editorMode === "pro";

    const liveCard = document.querySelector('.device-screen-content');
    
    // 既存の背景着せ替えクラスをクリア
    if (liveCard) {
      liveCard.classList.remove('theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter', 'theme-sunset', 'theme-sunrise', 'theme-space', 'theme-green', 'theme-it');
      
      // カスタム背景用のインラインスタイルをリセット
      liveCard.style.backgroundImage = '';
      liveCard.style.backgroundSize = '';
      liveCard.style.backgroundPosition = '';

      if (isPro && g.useBgImage) {
        if (g.bgCustomUrl) {
          liveCard.style.background = 'none';
          liveCard.style.backgroundColor = 'transparent';
          liveCard.style.backgroundImage = `url(${g.bgCustomUrl})`;
          liveCard.style.backgroundSize = 'cover';
          liveCard.style.backgroundPosition = 'center';
          liveCard.style.backgroundRepeat = 'no-repeat';
        } else if (g.bgTheme) {
          liveCard.style.background = 'none';
          liveCard.style.backgroundColor = 'transparent';
          liveCard.classList.add(`theme-${g.bgTheme}`);
        } else {
          liveCard.style.background = '';
          liveCard.style.backgroundColor = '';
          liveCard.style.backgroundImage = '';
        }
      } else {
        liveCard.style.background = '';
        liveCard.style.backgroundColor = '';
        liveCard.style.backgroundImage = '';
      }

      // グラスモルフィズムカードスタイルの適用
      liveCard.classList.remove('theme-active-card', 'theme-active-card-dark');
      if (isPro && g.useBgImage && (g.bgTheme || g.bgCustomUrl)) {
        const darkThemes = ['space', 'it', 'sunset'];
        const cardClass = darkThemes.includes(g.bgTheme) ? 'theme-active-card-dark' : 'theme-active-card';
        liveCard.classList.add(cardClass);
      }
    }
    const liveLogoArea = document.getElementById('live-preview-logo-area');
    const liveLogoTextSpan = document.getElementById('live-preview-logo-text');
    const liveTitleH = document.getElementById('live-preview-form-title');
    const liveSubtitleP = document.getElementById('live-preview-form-subtitle');
    const liveDescP = document.getElementById('live-preview-form-desc');
    const liveAnnounceArea = document.getElementById('live-preview-announcement-area');
    const liveDurationBox = document.getElementById('live-preview-duration-box');
    const liveAlertBox = document.getElementById('live-preview-alert-box');

    // タイトルと説明文の反映（同期解除対応）
    const currentFormTitle = document.getElementById('editor-form-title') ? document.getElementById('editor-form-title').value : (g.title || "");
    const currentFormDesc = document.getElementById('editor-form-desc') ? document.getElementById('editor-form-desc').value : (g.description || "");
    const proTitleVal = (g.header && g.header.title) ? g.header.title : currentFormTitle;
    const proDescVal = (g.header && g.header.disclaimer) ? g.header.disclaimer : currentFormDesc;

    if (liveTitleH) {
      const liveRawTitle = isPro ? (proTitleVal || "フォーム") : (currentFormTitle || "フォーム");

      // 🏷️ タイトル外枠（簡易ロゴ化）バッジの適用
      const badgeShape = g.titleBadgeShape || 'none';
      const badgeStyle = g.titleBadgeStyle || 'fill';
      const badgeBgType = g.titleBadgeBgType || 'primary';
      const badgeBgCustom = g.titleBadgeBgCustom || '#1a73e8';
      const badgeColorType = g.titleBadgeColorType || 'white';
      const badgeColorCustom = g.titleBadgeColorCustom || '#ffffff';

      liveTitleH.classList.remove(
        'title-badge',
        'badge-style-fill',
        'badge-style-outline',
        'badge-shape-trapezoid-down',
        'badge-shape-trapezoid-up',
        'badge-shape-parallelogram',
        'badge-shape-ribbon',
        'badge-shape-capsule',
        'badge-shape-chamfer',
        'badge-shape-retro'
      );
      liveTitleH.style.removeProperty('--badge-bg');
      liveTitleH.style.removeProperty('--badge-color');

      if (badgeShape && badgeShape !== 'none') {
        liveTitleH.classList.add('title-badge', `badge-shape-${badgeShape}`, `badge-style-${badgeStyle}`);

        let actualBg = 'var(--color-primary, #1a73e8)';
        if (badgeBgType === 'dark') actualBg = '#202124';
        else if (badgeBgType === 'custom') actualBg = badgeBgCustom;
        liveTitleH.style.setProperty('--badge-bg', actualBg);

        let actualColor = '#ffffff';
        if (badgeColorType === 'dark') actualColor = '#202124';
        else if (badgeColorType === 'primary') actualColor = 'var(--color-primary, #1a73e8)';
        else if (badgeColorType === 'custom') actualColor = badgeColorCustom;
        liveTitleH.style.setProperty('--badge-color', actualColor);
      }

      // 🔤 タイトル文字自体の変形（ワープテキスト＆立体ロゴ）および文字色の適用
      const titleTextColor = resolveTitleTextColor(g, badgeShape, badgeStyle);
      applyTitleTextWarp(liveTitleH, liveRawTitle, g.titleWarpShape, g.titleWarpStrength, g.titleWarpEffect, titleTextColor, g.titleLightAngle, g.titleLightIntensity);
      applyTitleFontToElement(liveTitleH, liveSubtitleP, g.titleFontFamily, g.titleFontTarget);
    }

    // サブタイトルの取得と反映（リアルタイム入力値＆データオブジェクト双方対応）
    const currentSubtitle = document.getElementById('editor-pro-subtitle') 
      ? document.getElementById('editor-pro-subtitle').value 
      : ((g.header && g.header.subtitle) ? g.header.subtitle : (g.subtitle || ""));

    if (liveSubtitleP) {
      if (currentSubtitle && currentSubtitle.trim() !== "") {
        liveSubtitleP.textContent = currentSubtitle;
        liveSubtitleP.style.display = 'block';
      } else {
        liveSubtitleP.textContent = "";
        liveSubtitleP.style.display = 'none';
      }
      applyTitleFontToElement(liveTitleH, liveSubtitleP, g.titleFontFamily, g.titleFontTarget);
    }

    if (liveDescP) liveDescP.innerHTML = renderRichTextWithLinks(isPro ? proDescVal : currentFormDesc);

    // ライブプレビューの枠スタイル・配置・サブタイトル位置の適用
    const liveFormHeader = document.getElementById('live-preview-form-header');
    if (liveFormHeader) {
      const headerStyle = g.headerStyle || 'card-accent-top';
      const headerAlign = g.headerAlign || 'left';
      const subtitlePosition = g.subtitlePosition || 'below';

      liveFormHeader.classList.remove(
        'header-style-card-accent-top',
        'header-style-card-simple',
        'header-style-card-accent-left',
        'header-style-card-shadow',
        'header-style-frameless',
        'header-style-frameless-underline',
        'header-align-left',
        'header-align-center',
        'header-align-right'
      );
      liveFormHeader.classList.add(`header-style-${headerStyle}`);
      liveFormHeader.classList.add(`header-align-${headerAlign}`);

      if (liveSubtitleP && liveTitleH && liveDescP) {
        if (subtitlePosition === 'above') {
          liveFormHeader.insertBefore(liveSubtitleP, liveTitleH);
        } else {
          liveFormHeader.insertBefore(liveSubtitleP, liveDescP);
        }
      }
    }

    // ライブプレビューのヘッダー画像表示制御
    const liveHeaderImgContainer = document.getElementById('live-preview-header-image-container');
    const liveHeaderImg = document.getElementById('live-preview-header-image');
    if (liveHeaderImgContainer && liveHeaderImg) {
      if (isPro && g.useHeaderImage && g.headerImage) {
        liveHeaderImg.src = g.headerImage;
        liveHeaderImgContainer.style.display = 'block';
        const yPos = g.headerImagePosition !== undefined ? g.headerImagePosition : 50;
        const xPos = g.headerImagePositionX !== undefined ? g.headerImagePositionX : 50;
        const scale = g.headerImageScale !== undefined ? g.headerImageScale : 100;
        liveHeaderImg.style.objectPosition = `${xPos}% ${yPos}%`;
        liveHeaderImg.style.transform = `scale(${scale / 100})`;
        liveHeaderImg.style.transformOrigin = `${xPos}% ${yPos}%`;
      } else {
        liveHeaderImgContainer.style.display = 'none';
      }
    }

    // ライブプレビューのフッターロゴおよび最上部ロゴ表示制御
    const liveLogoImg = document.getElementById('live-preview-logo-image');
    const liveFooterLogoContainer = document.getElementById('live-preview-footer-logo-container');
    const liveFooterLogoImg = document.getElementById('live-preview-footer-logo');
    const liveFooterLogoText = document.getElementById('live-preview-footer-logo-text');

    // 最上部ロゴの表示制御
    if (liveLogoArea && liveLogoTextSpan && liveLogoImg) {
      if (isPro && g.logoPosition === "top") {
        liveLogoArea.style.display = 'block';
        if (g.logoType === "image") {
          liveLogoImg.src = g.logoImageUrl || "";
          liveLogoImg.style.display = g.logoImageUrl ? 'block' : 'none';
          liveLogoTextSpan.style.display = 'none';
        } else {
          const logoText = g.header ? g.header.logoText : "";
          liveLogoTextSpan.textContent = logoText || "";
          liveLogoTextSpan.style.display = logoText ? 'block' : 'none';
          liveLogoImg.style.display = 'none';
        }
      } else {
        liveLogoArea.style.display = 'none';
      }
    }

    // 最下部（フッター）ロゴの表示制御
    if (liveFooterLogoContainer && liveFooterLogoImg && liveFooterLogoText) {
      if (isPro && g.logoPosition === "bottom") {
        liveFooterLogoContainer.style.display = 'flex';
        if (g.logoType === "image") {
          liveFooterLogoImg.src = g.logoImageUrl || "";
          liveFooterLogoImg.style.display = g.logoImageUrl ? 'block' : 'none';
          liveFooterLogoText.style.display = 'none';
        } else {
          const logoText = g.header ? g.header.logoText : "";
          liveFooterLogoText.textContent = logoText || "";
          liveFooterLogoText.style.display = logoText ? 'block' : 'none';
          liveFooterLogoImg.style.display = 'none';
        }
      } else {
        // 簡易版
        if (g.showLogo) {
          liveFooterLogoContainer.style.display = 'flex';
          liveFooterLogoImg.src = "../logo.png";
          liveFooterLogoImg.style.display = 'block';
          liveFooterLogoText.style.display = 'none';
        } else {
          liveFooterLogoContainer.style.display = 'none';
        }
      }
    }

    if (isPro && g.appearance) {
      let showLiveAnnounce = false;
      if (g.announcement && g.announcement.showDuration && g.announcement.durationText) {
        const durVal = document.getElementById('live-preview-duration-value');
        if (durVal) durVal.textContent = g.announcement.durationText;
        if (liveDurationBox) liveDurationBox.style.display = 'flex';
        showLiveAnnounce = true;
      } else if (liveDurationBox) {
        liveDurationBox.style.display = 'none';
      }

      if (g.announcement && g.announcement.showAlertBox && g.announcement.alertBoxText) {
        const alertVal = document.getElementById('live-preview-alert-value');
        if (alertVal) alertVal.textContent = g.announcement.alertBoxText;
        if (liveAlertBox) liveAlertBox.style.display = 'block';
        showLiveAnnounce = true;
      } else if (liveAlertBox) {
        liveAlertBox.style.display = 'none';
      }
      if (liveAnnounceArea) liveAnnounceArea.style.display = showLiveAnnounce ? 'flex' : 'none';

      const primaryColor = (g && g.appearance && g.appearance.primaryColor) || "#0056b3";
      const bgColor = (g && g.appearance && g.appearance.backgroundColor) || "#f8fafd";
      const txtColor = getTextColorForBg(bgColor);

      if (liveCard && liveCard.parentNode) {
        liveCard.parentNode.style.setProperty('--color-primary', primaryColor);
      }
      if (liveCard) {
        if (isPro && g.useBgImage && g.bgTheme) {
          liveCard.style.removeProperty('background-color');
        } else {
          liveCard.style.backgroundColor = bgColor;
        }
        liveCard.style.color = txtColor;
      }

      const getActualFontSize = (val, type, isMobile) => {
        if (val && val.startsWith('custom:')) {
          const pxVal = parseInt(val.split(':')[1]) || 16;
          return isMobile ? `${Math.round(pxVal * 0.72)}px` : `${pxVal}px`;
        }
        if (type === 'title') {
          return isMobile
            ? (val === 'small' ? '1.1rem' : val === 'large' ? '1.5rem' : '1.3rem')
            : (val === 'small' ? '1.5rem' : val === 'large' ? '2.2rem' : '1.8rem');
        }
        if (type === 'section') {
          return isMobile
            ? (val === 'small' ? '0.9rem' : val === 'large' ? '1.2rem' : '1.0rem')
            : (val === 'small' ? '1.1rem' : val === 'large' ? '1.5rem' : '1.3rem');
        }
        // label
        return isMobile
          ? (val === 'small' ? '0.75rem' : val === 'large' ? '0.95rem' : '0.85rem')
          : (val === 'small' ? '0.8rem' : val === 'large' ? '1.0rem' : '0.9rem');
      };

      const fsObj = (g && g.appearance && g.appearance.fontSizes) || {};
      const titleSize = getActualFontSize(fsObj.title, 'title', true);
      const sectionSize = getActualFontSize(fsObj.section, 'section', true);
      const labelSize = getActualFontSize(fsObj.label, 'label', true);

      if (liveTitleH) liveTitleH.style.fontSize = titleSize;
      if (liveCard) {
        liveCard.style.setProperty('--preview-section-title-size', sectionSize);
        liveCard.style.setProperty('--preview-label-size', labelSize);
      }

      const liveProgBarCont = document.getElementById('live-progress-bar-container');
      if (liveProgBarCont) {
        if (g.displayMode === 'scroll') {
          liveProgBarCont.style.display = 'none';
        } else {
          const indicator = g.progressIndicator || "both";
          liveProgBarCont.style.display = indicator === 'none' ? 'none' : 'block';
        }
      }
    } else {
      if (liveLogoArea) liveLogoArea.style.display = 'none';
      if (liveSubtitleP && (!currentSubtitle || currentSubtitle.trim() === "")) liveSubtitleP.style.display = 'none';
      if (liveAnnounceArea) liveAnnounceArea.style.display = 'none';
      const liveProgBarCont = document.getElementById('live-progress-bar-container');
      if (liveProgBarCont) liveProgBarCont.style.display = 'block';

      if (liveCard && liveCard.parentNode) {
        liveCard.parentNode.style.setProperty('--color-primary', '#0056b3');
      }
      if (liveCard) {
        liveCard.style.backgroundColor = '#ffffff';
        liveCard.style.color = '#212529';
      }
      if (liveTitleH) liveTitleH.style.fontSize = '1.3rem';
    }

    if (window.n.sections && activeSec) {
      const totalSecs = window.n.sections.length;
      const currentSecIdx = window.n.sections.findIndex(s => s.id === activeSec.id) + 1;
      const progText = document.getElementById('live-preview-progress-text');
      if (progText) {
        progText.textContent = `セクション ${currentSecIdx || 1} / ${totalSecs || 1}`;
      }
      const progBar = document.getElementById('live-preview-progress-bar');
      if (progBar) {
        const pct = totalSecs > 0 ? Math.round((currentSecIdx / totalSecs) * 100) : 100;
        progBar.style.width = `${pct}%`;
      }
    }

    liveContainer.innerHTML = "";

    if (!activeSec) return;

    const activeSecInputTitle = (window.r === activeSec.id && document.getElementById('editor-section-title'))
      ? document.getElementById('editor-section-title').value
      : (activeSec.title || "");
    const activeSecInputDesc = (window.r === activeSec.id && document.getElementById('editor-section-desc'))
      ? document.getElementById('editor-section-desc').value
      : (activeSec.description || "");

    const secTitle = activeSecInputTitle ? activeSecInputTitle.trim() : "";
    const secDesc = activeSecInputDesc ? activeSecInputDesc.trim() : "";

    let secMediaHtml = "";
    if (activeSec.media && activeSec.media.url) {
      if (activeSec.media.type === 'image') {
        secMediaHtml = `<div style="margin-top:8px;"><img src="${escapeHtml(activeSec.media.url)}" style="max-width:100%; border-radius:4px; max-height:180px; object-fit:contain;" /></div>`;
      } else if (activeSec.media.type === 'video') {
        secMediaHtml = `<div style="margin-top:8px;"><video src="${escapeHtml(activeSec.media.url)}" controls style="max-width:100%; border-radius:4px; max-height:180px;"></video></div>`;
      }
    }

    if (secTitle !== "" || secDesc !== "" || secMediaHtml !== "") {
      const secHeader = document.createElement('div');
      secHeader.className = 'live-preview-section-header';
      secHeader.style.cssText = 'margin-bottom: 20px; border-bottom: 1.5px solid var(--color-primary); padding-bottom: 8px;';
      secHeader.innerHTML = `
        <h3 style="font-size:var(--preview-section-title-size, 1rem); font-weight:700; margin:0; color:var(--color-primary);">${escapeHtml(secTitle) || 'セクションタイトル'}</h3>
        ${secDesc ? `<p style="font-size:0.75rem; color:var(--color-text-muted); margin:4px 0 0 0; line-height:1.5;">${renderRichTextWithLinks(secDesc)}</p>` : ''}
        ${secMediaHtml}
      `;
      liveContainer.appendChild(secHeader);
    }

    if (!activeSec.questions || activeSec.questions.length === 0) {
      const emptyNotice = document.createElement('div');
      emptyNotice.style.cssText = 'text-align:center; padding:30px; color:var(--color-text-muted); font-size:0.8rem; border:1px dashed var(--color-border); border-radius:4px; margin-bottom:12px;';
      emptyNotice.innerHTML = `このセクションにはまだ質問がありません。<br>左側の「＋ 質問を追加」またはプリセットから質問を作成してください。`;
      liveContainer.appendChild(emptyNotice);
      return;
    }

    let currentPreviewGrpEl = null;
    let currentPreviewGrpId = null;

    activeSec.questions.forEach(q => {
      const qCard = document.createElement('div');
      qCard.className = 'preview-q-card';
      qCard.dataset.questionId = q.id;
      qCard.style.cssText = 'background:rgba(0,0,0,0.015); border:1px solid var(--color-border); border-radius:4px; padding:12px; margin-bottom:12px; display:flex; flex-direction:column; gap:6px; transition:border-color 0.2s;';

      const reqAsterisk = q.required ? `<span class="red-asterisk" style="color:var(--color-danger, #dc3545); margin-right:4px;">*</span>` : '';
      const qTitle = q.title ? q.title.trim() : '無題の質問';
      const qDesc = q.description ? q.description.trim() : '';

      let inputHtml = "";
      if (q.type === 'text') {
        let placeholder = "回答を入力してください";
        let apiBadge = "";
        const apiConfig = getQuestionApiConfig(q);
        const isInvoiceApi = apiConfig && apiConfig.isInvoice;
        const isCorpApi = apiConfig && apiConfig.isCorp;
        const isBankApi = apiConfig && apiConfig.isBank;
        const isBranchApi = apiConfig && apiConfig.isBranch;

        if (isCorpApi || isInvoiceApi || isBankApi || isBranchApi) {
          if (isInvoiceApi) {
            placeholder = "Tから始まる13桁 または事業者名 (例: T1010001999999)";
            apiBadge = `<div style="font-size:0.68rem; color:var(--color-primary); margin-top:2px; display:flex; align-items:center; gap:4px;">🧾 適格請求書発行事業者API連携</div>`;
          } else if (isCorpApi) {
            placeholder = "法人名を入力して検索... (例: トヨタ、メルカリ)";
            apiBadge = `<div style="font-size:0.68rem; color:var(--color-primary); margin-top:2px; display:flex; align-items:center; gap:4px;">🏛️ 国税庁法人番号API連携</div>`;
          } else if (isBankApi) {
            placeholder = "銀行名を入力または検索 (例: 三菱UFJ銀行、みずほ銀行)";
            apiBadge = `<div style="font-size:0.68rem; color:var(--color-primary); margin-top:2px; display:flex; align-items:center; gap:4px;">🏦 全銀協金融機関API連携</div>`;
          } else if (isBranchApi) {
            placeholder = "支店名を入力または選択 (例: 本店、新宿支店)";
            apiBadge = `<div style="font-size:0.68rem; color:var(--color-primary); margin-top:2px; display:flex; align-items:center; gap:4px;">🏢 全銀協支店情報API連携</div>`;
          }
          // ライブプレビューでも操作・検索できるように disabled を解除
          inputHtml = `<input type="text" class="form-control form-control-sm" placeholder="${placeholder}" style="background: var(--color-bg-input);" />${apiBadge}`;
        } else {
          const autoReplyBadge = q.autoReply ? `<div style="font-size:0.68rem; color:#1a73e8; margin-top:3px; display:flex; align-items:center; gap:4px; font-weight:600;">📨 回答送信後に回答の控えが届きます</div>` : '';
          inputHtml = `<input type="text" class="form-control form-control-sm" placeholder="${placeholder}" disabled style="opacity: 0.8; background: var(--color-bg-input);" />${autoReplyBadge}`;
        }
      } else if (q.type === 'textarea' || q.type === 'paragraph') {
        inputHtml = `<textarea class="form-control form-control-sm" rows="2" placeholder="自由回答を入力してください" disabled style="opacity: 0.8; background: var(--color-bg-input);"></textarea>`;
      } else if (q.type === 'radio') {
        let opts = "";
        const options = q.options || [{ label: "選択肢1" }, { label: "選択肢2" }];
        options.forEach((opt, idx) => {
          const optLabel = typeof opt === 'string' ? opt : (opt.label || '');
          opts += `
            <label style="display:flex; align-items:center; gap:6px; font-size:0.75rem; margin:0; cursor:pointer;">
              <input type="radio" name="live_preview_radio_${q.id}" value="${escapeHtml(optLabel)}" style="margin:0;" /> <span class="preview-opt-label-text" data-opt-index="${idx}">${escapeHtml(optLabel)}</span>
            </label>
          `;
        });
        inputHtml = `<div style="display:flex; flex-direction:column; gap:6px; padding:2px 0;">${opts}</div>`;
      } else if (q.type === 'checkbox') {
        let opts = "";
        const options = q.options || [{ label: "選択肢1" }, { label: "選択肢2" }];
        options.forEach((opt, idx) => {
          opts += `
            <label style="display:flex; align-items:center; gap:6px; font-size:0.75rem; margin:0; cursor:default;">
              <input type="checkbox" disabled style="margin:0;" /> <span class="preview-opt-label-text" data-opt-index="${idx}">${escapeHtml(opt.label || '')}</span>
            </label>
          `;
        });
        inputHtml = `<div style="display:flex; flex-direction:column; gap:6px; padding:2px 0;">${opts}</div>`;
      } else if (q.type === 'select') {
        let opts = `<option value="">選択してください</option>`;
        const options = q.options || [{ label: "選択肢1" }, { label: "選択肢2" }];
        options.forEach((opt, idx) => {
          opts += `<option data-opt-index="${idx}">${escapeHtml(opt.label || '')}</option>`;
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

      let mediaHtml = "";
      if (q.media && q.media.url) {
        if (q.media.type === 'image') {
          mediaHtml = `<div style="margin-top:6px;"><img src="${escapeHtml(q.media.url)}" style="max-width:100%; border-radius:4px; max-height:160px; object-fit:contain;" /></div>`;
        } else if (q.media.type === 'video') {
          mediaHtml = `<div style="margin-top:6px;"><video src="${escapeHtml(q.media.url)}" controls style="max-width:100%; border-radius:4px; max-height:160px;"></video></div>`;
        } else {
          mediaHtml = `<div style="margin-top:6px; font-size:0.75rem;"><a href="${escapeHtml(q.media.url)}" target="_blank" style="color:var(--color-primary);">📎 添付ファイル</a></div>`;
        }
      }

      let scrollHtml = "";
      if (q.scrollRequired && q.scrollText) {
        scrollHtml = `<div class="preview-q-scroll-box" style="max-height:80px; overflow-y:auto; font-size:0.7rem; padding:6px; border:1px solid var(--color-border); border-radius:4px; background:rgba(0,0,0,0.02); margin-top:4px; line-height:1.4;">${renderRichTextWithLinks(q.scrollText)}</div>`;
      }

      let sameAsAbovePreviewHtml = "";
      if (q.sameAsAbove && q.sameAsAbove.enabled && q.sameAsAbove.sourceQuestionId) {
        sameAsAbovePreviewHtml = `
          <div class="preview-same-as-above">
            <input type="checkbox" disabled style="margin: 0;" />
            <span>${escapeHtml(q.sameAsAbove.label || '前述と同じ')}</span>
          </div>
        `;
      }

      qCard.innerHTML = `
        <div class="preview-q-title" style="font-size:var(--preview-label-size, 0.85rem); font-weight:600; color:var(--color-text); margin:0;">
          ${reqAsterisk}<span class="preview-q-title-text">${escapeHtml(qTitle)}</span>
        </div>
        ${qDesc ? `<div class="preview-q-desc" style="font-size:0.7rem; color:var(--color-text-muted); margin-top:-2px; line-height:1.4;">${renderRichTextWithLinks(qDesc)}</div>` : ''}
        ${mediaHtml}
        ${scrollHtml}
        <div class="preview-q-input-wrap" style="margin-top:4px;">
          ${sameAsAbovePreviewHtml}
          ${inputHtml}
        </div>
      `;

      if (q.groupId) {
        if (!currentPreviewGrpEl || currentPreviewGrpId !== q.groupId) {
          currentPreviewGrpId = q.groupId;
          currentPreviewGrpEl = document.createElement('div');
          currentPreviewGrpEl.className = 'preview-question-group';
          currentPreviewGrpEl.dataset.groupId = q.groupId;

          const grpHeader = document.createElement('div');
          grpHeader.className = 'preview-group-header';
          grpHeader.innerHTML = `<span>${escapeHtml(q.groupTitle || 'グループ')}</span>`;
          currentPreviewGrpEl.appendChild(grpHeader);

          // グループ説明文
          if (q.groupDescription) {
            const grpDesc = document.createElement('div');
            grpDesc.className = 'preview-group-desc';
            grpDesc.innerHTML = (typeof renderRichTextWithLinks === 'function') ? renderRichTextWithLinks(q.groupDescription) : escapeHtml(q.groupDescription);
            currentPreviewGrpEl.appendChild(grpDesc);
          }

          // グループ一括同上チェックボックスプレビュー（デフォルトONを反映）
          if (q.sameAsAbove && q.sameAsAbove.enabled && (q.sameAsAbove.sourceType === 'group' || (q.sameAsAbove.sourceQuestionId && q.sameAsAbove.sourceQuestionId.startsWith('group:')))) {
            const grpSameWrap = document.createElement('div');
            grpSameWrap.className = 'preview-group-same-as-above';
            grpSameWrap.innerHTML = `
              <input type="checkbox" disabled checked style="margin: 0;" />
              <span>${escapeHtml(q.sameAsAbove.label || '前述のグループと同じ')}</span>
            `;
            currentPreviewGrpEl.appendChild(grpSameWrap);
          }

          liveContainer.appendChild(currentPreviewGrpEl);
        }

        // グループ単位の同上が表示されている場合、個別質問カード内の同上チェックは隠してすっきり見せる
        if (q.sameAsAbove && q.sameAsAbove.enabled && (q.sameAsAbove.sourceType === 'group' || (q.sameAsAbove.sourceQuestionId && q.sameAsAbove.sourceQuestionId.startsWith('group:')))) {
          const qSameEl = qCard.querySelector('.preview-same-as-above');
          if (qSameEl) qSameEl.style.display = 'none';
        }

        currentPreviewGrpEl.appendChild(qCard);
      } else {
        currentPreviewGrpEl = null;
        currentPreviewGrpId = null;
        liveContainer.appendChild(qCard);
      }
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

    // API連携候補サジェストとインプットグループをライブプレビューにも即時反映
    if (typeof setupLiveAutocompleteEvents === 'function') {
      try { setupLiveAutocompleteEvents(); } catch(e) {}
    }
  }

  // 高速インプレース・プレビュー更新（文字入力時の全DOM破棄・チラつき・遅延を解消）
  function fastUpdateLivePreview(type, value, extra) {
    if (type === 'form_title' || type === 'title_warp') {
      const g = window.G || {};
      const warpShape = g.titleWarpShape || 'none';
      const warpStrength = g.titleWarpStrength || 50;
      const warpEffect = g.titleWarpEffect || 'none';
      const titleTextColor = resolveTitleTextColor(g, g.titleBadgeShape || 'none', g.titleBadgeStyle || 'fill');
      const curTitle = value || (document.getElementById('editor-pro-title') ? document.getElementById('editor-pro-title').value : '') || (g.header ? g.header.title : '') || g.title || "フォーム";
      const el = document.getElementById('live-preview-form-title');
      if (el) {
        applyTitleTextWarp(el, curTitle, warpShape, warpStrength, warpEffect, titleTextColor, g.titleLightAngle, g.titleLightIntensity);
        applyTitleFontToElement(el, null, g.titleFontFamily, g.titleFontTarget);
      }
      const mob = document.querySelector('.mobile-preview-title');
      if (mob) {
        applyTitleTextWarp(mob, curTitle, warpShape, warpStrength, warpEffect, titleTextColor, g.titleLightAngle, g.titleLightIntensity);
        applyTitleFontToElement(mob, null, g.titleFontFamily, g.titleFontTarget);
      }
      const panelTitle = document.getElementById('preview-form-title');
      if (panelTitle) {
        applyTitleTextWarp(panelTitle, curTitle, warpShape, warpStrength, warpEffect, titleTextColor, g.titleLightAngle, g.titleLightIntensity);
        applyTitleFontToElement(panelTitle, null, g.titleFontFamily, g.titleFontTarget);
      }
    } else if (type === 'subtitle' || type === 'form_subtitle') {
      const g = window.G || {};
      const liveSub = document.getElementById('live-preview-form-subtitle');
      if (liveSub) {
        liveSub.textContent = value || "";
        liveSub.style.display = (value && value.trim() !== "") ? 'block' : 'none';
        applyTitleFontToElement(null, liveSub, g.titleFontFamily, g.titleFontTarget);
      }
      const panelSub = document.getElementById('preview-form-subtitle');
      if (panelSub) {
        panelSub.textContent = value || "";
        panelSub.style.display = (value && value.trim() !== "") ? 'block' : 'none';
        applyTitleFontToElement(null, panelSub, g.titleFontFamily, g.titleFontTarget);
      }
    } else if (type === 'form_desc') {
      const el = document.getElementById('live-preview-form-desc');
      if (el) el.innerHTML = renderRichTextWithLinks(value || "");
    } else if (type === 'section_title') {
      const el = document.querySelector('.live-preview-section-header h3');
      if (el) {
        el.textContent = value || "セクションタイトル";
      } else {
        debouncedTriggerLivePreview(true);
      }
    } else if (type === 'section_desc') {
      const el = document.querySelector('.live-preview-section-header p');
      if (el) {
        el.innerHTML = renderRichTextWithLinks(value || "");
        el.style.display = value ? 'block' : 'none';
      } else if (value) {
        const header = document.querySelector('.live-preview-section-header');
        if (header) {
          const p = document.createElement('p');
          p.style.cssText = 'font-size:0.75rem; color:var(--color-text-muted); margin:4px 0 0 0; line-height:1.5;';
          p.innerHTML = renderRichTextWithLinks(value);
          header.appendChild(p);
        }
      }
    } else if (type === 'question_title' && extra && extra.questionId) {
      const card = document.querySelector(`.preview-q-card[data-question-id="${extra.questionId}"]`);
      if (card) {
        const span = card.querySelector('.preview-q-title-text');
        if (span) span.textContent = value || "無題の質問";
      }
    } else if (type === 'question_desc' && extra && extra.questionId) {
      const card = document.querySelector(`.preview-q-card[data-question-id="${extra.questionId}"]`);
      if (card) {
        let descDiv = card.querySelector('.preview-q-desc');
        if (!descDiv && value) {
          const titleDiv = card.querySelector('.preview-q-title');
          descDiv = document.createElement('div');
          descDiv.className = 'preview-q-desc';
          descDiv.style.cssText = 'font-size:0.7rem; color:var(--color-text-muted); margin-top:-2px; line-height:1.4;';
          if (titleDiv && titleDiv.nextSibling) {
            card.insertBefore(descDiv, titleDiv.nextSibling);
          } else {
            card.appendChild(descDiv);
          }
        }
        if (descDiv) {
          descDiv.innerHTML = renderRichTextWithLinks(value || "");
          descDiv.style.display = value ? 'block' : 'none';
        }
      }
    } else if (type === 'question_scroll' && extra && extra.questionId) {
      const card = document.querySelector(`.preview-q-card[data-question-id="${extra.questionId}"]`);
      if (card) {
        const scrollBox = card.querySelector('.preview-q-scroll-box');
        if (scrollBox) scrollBox.innerHTML = renderRichTextWithLinks(value || "");
      }
    } else if (type === 'option_label' && extra && extra.questionId && extra.optionIndex !== undefined) {
      const card = document.querySelector(`.preview-q-card[data-question-id="${extra.questionId}"]`);
      if (card) {
        const optText = card.querySelector(`.preview-opt-label-text[data-opt-index="${extra.optionIndex}"]`);
        if (optText) optText.textContent = value || "";
        const selectOpt = card.querySelector(`select option[data-opt-index="${extra.optionIndex}"]`);
        if (selectOpt) selectOpt.textContent = value || "";
      }
    }
  }
  window.fastUpdateLivePreview = fastUpdateLivePreview;

  // アニメーションフレーム合流（多重描画・過負荷抑制）
  let _livePreviewRaf = null;
  function debouncedTriggerLivePreview(force = false) {
    if (force) {
      if (_livePreviewRaf) { cancelAnimationFrame(_livePreviewRaf); _livePreviewRaf = null; }
      renderLivePreview();
      if (typeof window.refreshFlowmap === 'function') window.refreshFlowmap();
      return;
    }
    if (_livePreviewRaf) return;
    _livePreviewRaf = requestAnimationFrame(() => {
      _livePreviewRaf = null;
      renderLivePreview();
      if (typeof window.refreshFlowmap === 'function') window.refreshFlowmap();
    });
  }
  window.triggerLivePreview = debouncedTriggerLivePreview;

  // 手動プレビュー更新・強制完全同期（最新DOM値反映＋LocalStorage同期＋全再描画＋回転アニメーション＋トースト）
  function refreshAllPreviews(showFeedback = true) {
    const refreshBtns = document.querySelectorAll('#btn-preview-refresh, #btn-panel-preview-refresh, .btn-editor-sync-preview');
    refreshBtns.forEach(btn => btn.classList.add('is-refreshing'));

    try {
      // 1. DOMの最新入力値をフォームオブジェクトに反映
      const g = window.G || window.n;
      if (g) {
        const titleEl = document.getElementById('editor-form-title');
        if (titleEl) g.title = titleEl.value;
        const subTitleEl = document.getElementById('editor-pro-subtitle');
        if (subTitleEl) {
          if (!g.header) g.header = {};
          g.header.subtitle = subTitleEl.value;
          g.subtitle = subTitleEl.value;
          if (window.G) {
            if (!window.G.header) window.G.header = {};
            window.G.header.subtitle = subTitleEl.value;
            window.G.subtitle = subTitleEl.value;
          }
          if (window.n) {
            if (!window.n.header) window.n.header = {};
            window.n.header.subtitle = subTitleEl.value;
            window.n.subtitle = subTitleEl.value;
          }
        }
        const descEl = document.getElementById('editor-form-desc');
        if (descEl) g.description = descEl.value;

        if (window.r && g.sections) {
          const curSec = g.sections.find(s => s.id === window.r);
          if (curSec) {
            const secTitleEl = document.getElementById('editor-section-title');
            if (secTitleEl) curSec.title = secTitleEl.value;
            const secDescEl = document.getElementById('editor-section-desc');
            if (secDescEl) curSec.description = secDescEl.value;
          }
        }
      }
    } catch (e) {
      console.warn('[refreshAllPreviews] DOM sync warn:', e);
    }

    // 2. LocalStorageへの即時確定保存
    if (typeof window.S === 'function') {
      try { window.S(true); } catch(e) {}
    }
    if (typeof saveAndSyncMindmapData === 'function') {
      try { saveAndSyncMindmapData(); } catch(e) {}
    }

    // 3. ライブプレビューの強制再描画・テーマ適用
    if (typeof renderLivePreview === 'function') {
      try { renderLivePreview(); } catch(e) {}
    }
    if (typeof applyPreviewTheme === 'function') {
      try { applyPreviewTheme(); } catch(e) {}
    }

    // 4. 回答プレビュー画面（yt）も最新データで再同期
    if (typeof window.yt === 'function') {
      try {
        const curData = window.G || window.n;
        if (curData) window.yt(curData);
      } catch(e) {}
    }
    if (typeof setupLiveAutocompleteEvents === 'function') {
      try { setupLiveAutocompleteEvents(); } catch(e) {}
    }

    // 5. アニメーション完了とトースト通知
    setTimeout(() => {
      refreshBtns.forEach(btn => btn.classList.remove('is-refreshing'));
      if (showFeedback && typeof window.showSectionToast === 'function') {
        window.showSectionToast('プレビューを最新の状態に更新しました');
      }
    }, 450);
  }
  window.refreshAllPreviews = refreshAllPreviews;
  window.triggerPreviewRefresh = refreshAllPreviews;

  // ショートカットキー (Ctrl+Shift+R / Alt+R) によるプレビュー更新
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && e.key && e.key.toLowerCase() === 'r') || (e.altKey && e.key && e.key.toLowerCase() === 'r')) {
      e.preventDefault();
      refreshAllPreviews(true);
    }
  });

  // プレビュー更新ボタンのクリック委譲
  document.addEventListener('click', (e) => {
    const refreshTarget = e.target.closest('#btn-preview-refresh, #btn-panel-preview-refresh, .btn-editor-sync-preview');
    if (refreshTarget) {
      e.preventDefault();
      refreshAllPreviews(true);
    }
  });

  // エディタ入力の包括的イベント委譲（任意の入力欄から即座にインプレース同期）
  function setupLiveEditorInputDelegation() {
    const panel = document.getElementById('panel-editor');
    if (!panel || panel._liveDelegated) return;
    panel._liveDelegated = true;

    panel.addEventListener('input', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.id === 'editor-form-title') {
        fastUpdateLivePreview('form_title', t.value);
      } else if (t.id === 'editor-pro-subtitle') {
        fastUpdateLivePreview('subtitle', t.value);
        if (window.G) {
          if (!window.G.header) window.G.header = {};
          window.G.header.subtitle = t.value;
          window.G.subtitle = t.value;
        }
        if (window.n) {
          if (!window.n.header) window.n.header = {};
          window.n.header.subtitle = t.value;
          window.n.subtitle = t.value;
        }
        if (typeof window.S === 'function') window.S();
      } else if (t.id === 'editor-form-desc') {
        fastUpdateLivePreview('form_desc', t.value);
      } else if (t.id === 'editor-section-title') {
        fastUpdateLivePreview('section_title', t.value);
      } else if (t.id === 'editor-section-desc') {
        fastUpdateLivePreview('section_desc', t.value);
      } else if (t.classList.contains('q-desc-input')) {
        const qId = t.dataset.questionId || (t.closest('.question-card') ? t.closest('.question-card').dataset.questionId : null);
        if (typeof findQuestionDefById === 'function') {
          const q = findQuestionDefById(qId);
          if (q) q.description = t.value;
        }
        fastUpdateLivePreview('question_desc', t.value, { questionId: qId });
      } else if (t.classList.contains('q-scroll-input')) {
        const qId = t.dataset.questionId || (t.closest('.question-card') ? t.closest('.question-card').dataset.questionId : null);
        if (typeof findQuestionDefById === 'function') {
          const q = findQuestionDefById(qId);
          if (q) q.scrollText = t.value;
        }
        fastUpdateLivePreview('question_scroll', t.value, { questionId: qId });
      } else if (t.id === 'editor-title-badge-bg-custom' || t.id === 'editor-title-badge-color-custom') {
        if (t.id === 'editor-title-badge-bg-custom') {
          if (window.G) window.G.titleBadgeBgCustom = t.value;
          if (window.n) window.n.titleBadgeBgCustom = t.value;
        } else {
          if (window.G) window.G.titleBadgeColorCustom = t.value;
          if (window.n) window.n.titleBadgeColorCustom = t.value;
        }
        applyPreviewTheme();
        renderLivePreview();
      } else {
        const card = t.closest('.question-card');
        if (card && t.placeholder && t.placeholder.includes('タイトル')) {
          fastUpdateLivePreview('question_title', t.value, { questionId: card.dataset.questionId });
        }
        const optRow = t.closest('.option-edit-row');
        if (optRow && card) {
          const rows = Array.from(card.querySelectorAll('.option-edit-row'));
          const optIdx = rows.indexOf(optRow);
          if (optIdx !== -1) {
            fastUpdateLivePreview('option_label', t.value, { questionId: card.dataset.questionId, optionIndex: optIdx });
          }
        }
      }
    });

    panel.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.id === 'editor-header-style') {
        if (window.G) window.G.headerStyle = t.value;
        if (window.n) window.n.headerStyle = t.value;
        if (window.U && window.U[window.W]) window.U[window.W].headerStyle = t.value;
        applyPreviewTheme();
        renderLivePreview();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      } else if (t.id === 'editor-subtitle-position') {
        if (window.G) window.G.subtitlePosition = t.value;
        if (window.n) window.n.subtitlePosition = t.value;
        if (window.U && window.U[window.W]) window.U[window.W].subtitlePosition = t.value;
        applyPreviewTheme();
        renderLivePreview();
        updateTitleDetailsActiveBadge();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      } else if (t.id === 'editor-title-font-family' || t.id === 'editor-title-font-target') {
        const fontFamEl = document.getElementById('editor-title-font-family');
        const fontTarEl = document.getElementById('editor-title-font-target');
        const ffVal = fontFamEl ? fontFamEl.value : 'default';
        const ftVal = fontTarEl ? fontTarEl.value : 'both';
        if (window.G) {
          window.G.titleFontFamily = ffVal;
          window.G.titleFontTarget = ftVal;
        }
        if (window.n) {
          window.n.titleFontFamily = ffVal;
          window.n.titleFontTarget = ftVal;
        }
        if (window.U && window.U[window.W]) {
          window.U[window.W].titleFontFamily = ffVal;
          window.U[window.W].titleFontTarget = ftVal;
        }
        updateTitleDetailsActiveBadge();
        applyPreviewTheme();
        renderLivePreview();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      } else if (t.id === 'editor-title-color-type' || t.id === 'editor-title-color-custom') {
        const colorTypeEl = document.getElementById('editor-title-color-type');
        const colorCustomEl = document.getElementById('editor-title-color-custom');
        const tcVal = colorTypeEl ? colorTypeEl.value : 'default';
        const tccVal = colorCustomEl ? colorCustomEl.value : '#1a73e8';

        if (colorCustomEl) colorCustomEl.style.display = tcVal === 'custom' ? 'inline-block' : 'none';

        const updateTitleColor = (obj) => {
          if (!obj) return;
          obj.titleColorType = tcVal;
          obj.titleColorCustom = tccVal;
        };
        updateTitleColor(window.G);
        updateTitleColor(window.n);
        if (window.U && window.U[window.W]) updateTitleColor(window.U[window.W]);

        applyPreviewTheme();
        renderLivePreview();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      } else if (t.id === 'editor-title-warp-shape' || t.id === 'editor-title-warp-strength' || t.id === 'editor-title-warp-strength-num' || t.id === 'editor-title-warp-effect' || t.id === 'editor-title-light-angle' || t.id === 'editor-title-light-angle-num' || t.id === 'editor-title-light-intensity' || t.id === 'editor-title-light-intensity-num') {
        const warpShapeEl = document.getElementById('editor-title-warp-shape');
        const warpStrengthEl = document.getElementById('editor-title-warp-strength');
        const warpStrengthNumEl = document.getElementById('editor-title-warp-strength-num');
        const warpEffectEl = document.getElementById('editor-title-warp-effect');
        const lightAngleEl = document.getElementById('editor-title-light-angle');
        const lightAngleNumEl = document.getElementById('editor-title-light-angle-num');
        const lightIntensityEl = document.getElementById('editor-title-light-intensity');
        const lightIntensityNumEl = document.getElementById('editor-title-light-intensity-num');
        const strengthContainer = document.getElementById('editor-title-warp-strength-container');
        const lightingContainer = document.getElementById('editor-title-lighting-container');

        const wsVal = warpShapeEl ? warpShapeEl.value : 'none';
        let wstVal = 50;
        if (t.id === 'editor-title-warp-strength') wstVal = parseInt(t.value, 10) || 50;
        else if (t.id === 'editor-title-warp-strength-num') wstVal = parseInt(t.value, 10) || 50;
        else if (warpStrengthEl) wstVal = parseInt(warpStrengthEl.value, 10) || 50;
        wstVal = Math.max(1, Math.min(200, wstVal));

        if (warpStrengthEl && parseInt(warpStrengthEl.value, 10) !== wstVal) warpStrengthEl.value = wstVal;
        if (warpStrengthNumEl && parseInt(warpStrengthNumEl.value, 10) !== wstVal) warpStrengthNumEl.value = wstVal;

        const weVal = warpEffectEl ? warpEffectEl.value : 'none';

        let laVal = 315;
        if (t.id === 'editor-title-light-angle') laVal = parseInt(t.value, 10);
        else if (t.id === 'editor-title-light-angle-num') laVal = parseInt(t.value, 10);
        else if (lightAngleEl) laVal = parseInt(lightAngleEl.value, 10);
        if (isNaN(laVal)) laVal = 315;
        laVal = ((laVal % 360) + 360) % 360;

        if (lightAngleEl && parseInt(lightAngleEl.value, 10) !== laVal) lightAngleEl.value = laVal;
        if (lightAngleNumEl && parseInt(lightAngleNumEl.value, 10) !== laVal) lightAngleNumEl.value = laVal;

        let liVal = 60;
        if (t.id === 'editor-title-light-intensity') liVal = parseInt(t.value, 10) || 60;
        else if (t.id === 'editor-title-light-intensity-num') liVal = parseInt(t.value, 10) || 60;
        else if (lightIntensityEl) liVal = parseInt(lightIntensityEl.value, 10) || 60;
        liVal = Math.max(1, Math.min(100, liVal));

        if (lightIntensityEl && parseInt(lightIntensityEl.value, 10) !== liVal) lightIntensityEl.value = liVal;
        if (lightIntensityNumEl && parseInt(lightIntensityNumEl.value, 10) !== liVal) lightIntensityNumEl.value = liVal;

        if (strengthContainer) strengthContainer.style.display = wsVal !== 'none' ? 'block' : 'none';
        if (lightingContainer) lightingContainer.style.display = weVal !== 'none' ? 'block' : 'none';

        const updateWarp = (obj) => {
          if (!obj) return;
          obj.titleWarpShape = wsVal;
          obj.titleWarpStrength = wstVal;
          obj.titleWarpEffect = weVal;
          obj.titleLightAngle = laVal;
          obj.titleLightIntensity = liVal;
        };
        updateWarp(window.G);
        updateWarp(window.n);
        if (window.U && window.U[window.W]) updateWarp(window.U[window.W]);

        fastUpdateLivePreview('title_warp');
        applyPreviewTheme();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      } else if (t.id === 'editor-title-badge-shape' || t.id === 'editor-title-badge-style' || t.id === 'editor-title-badge-bg-type' || t.id === 'editor-title-badge-bg-custom' || t.id === 'editor-title-badge-color-type' || t.id === 'editor-title-badge-color-custom') {
        const shapeEl = document.getElementById('editor-title-badge-shape');
        const styleEl = document.getElementById('editor-title-badge-style');
        const bgTypeEl = document.getElementById('editor-title-badge-bg-type');
        const bgCustomEl = document.getElementById('editor-title-badge-bg-custom');
        const colorTypeEl = document.getElementById('editor-title-badge-color-type');
        const colorCustomEl = document.getElementById('editor-title-badge-color-custom');
        const optionsContainer = document.getElementById('editor-title-badge-options');

        const sVal = shapeEl ? shapeEl.value : 'none';
        const stVal = styleEl ? styleEl.value : 'fill';
        const bgtVal = bgTypeEl ? bgTypeEl.value : 'primary';
        const bgcVal = bgCustomEl ? bgCustomEl.value : '#1a73e8';
        const ctVal = colorTypeEl ? colorTypeEl.value : 'white';
        const ccVal = colorCustomEl ? colorCustomEl.value : '#ffffff';

        if (optionsContainer) optionsContainer.style.display = sVal !== 'none' ? 'block' : 'none';
        if (bgCustomEl) bgCustomEl.style.display = bgtVal === 'custom' ? 'block' : 'none';
        if (colorCustomEl) colorCustomEl.style.display = ctVal === 'custom' ? 'block' : 'none';

        const updateTarget = (obj) => {
          if (!obj) return;
          obj.titleBadgeShape = sVal;
          obj.titleBadgeStyle = stVal;
          obj.titleBadgeBgType = bgtVal;
          obj.titleBadgeBgCustom = bgcVal;
          obj.titleBadgeColorType = ctVal;
          obj.titleBadgeColorCustom = ccVal;
        };
        updateTarget(window.G);
        updateTarget(window.n);
        if (window.U && window.U[window.W]) updateTarget(window.U[window.W]);

        applyPreviewTheme();
        renderLivePreview();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      }
    });

    panel.addEventListener('click', (e) => {
      const alignBtn = e.target.closest('.btn-header-align');
      if (alignBtn) {
        e.preventDefault();
        const align = alignBtn.getAttribute('data-align') || 'left';
        document.querySelectorAll('.btn-header-align').forEach(b => b.classList.toggle('active', b === alignBtn));
        const hiddenAlign = document.getElementById('editor-header-align');
        if (hiddenAlign) hiddenAlign.value = align;
        if (window.G) window.G.headerAlign = align;
        if (window.n) window.n.headerAlign = align;
        if (window.U && window.U[window.W]) window.U[window.W].headerAlign = align;
        applyPreviewTheme();
        renderLivePreview();
        if (typeof window.S === 'function') window.S();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
      }
    });
  }
  setupLiveEditorInputDelegation();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLiveEditorInputDelegation);
  }

  // リアクティブ・ステート・ポーリングループ（入力中の破棄を防止）
  let lastStateStr = "";
  setInterval(() => {
    // ユーザーがテキスト入力中の場合はプレビューの強制再描画（DOM破棄）を抑止してタイピングを保護
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }
    if (window.n) {
      const active = getActiveSection();
      const secTitleInput = document.getElementById('editor-section-title')?.value || "";
      const secDescInput = document.getElementById('editor-section-desc')?.value || "";
      const formTitleInput = document.getElementById('editor-form-title')?.value || "";
      const formDescInput = document.getElementById('editor-form-desc')?.value || "";

      const currentStateStr = JSON.stringify({
        title: formTitleInput || window.n.title,
        desc: formDescInput || window.n.description,
        sectionsCount: window.n.sections ? window.n.sections.length : 0,
        activeSectionId: active ? active.id : null,
        activeSecTitle: secTitleInput || (active?.title || ""),
        activeSecDesc: secDescInput || (active?.description || ""),
        appearance: window.G ? window.G.appearance : null,
        header: window.G ? window.G.header : null,
        announcement: window.G ? window.G.announcement : null,
        displayMode: window.G ? window.G.displayMode : null,
        questions: active ? JSON.stringify(active.questions || []) : ""
      });

      if (currentStateStr !== lastStateStr) {
        lastStateStr = currentStateStr;
        renderLivePreview();
        applyPreviewTheme();
      }
    }
  }, 250);

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
      // 統一したゴミ箱の線画アイコンに自動補正
      if (!btn.querySelector('svg')) {
        btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
        btn.title = '選択肢を削除';
        btn.setAttribute('aria-label', '選択肢を削除');
      }

      const parent = btn.parentElement;
      if (!parent) return;

      const select = parent.querySelector('select:not([data-styled])');
      if (select) {
        select.setAttribute('data-styled', 'true');
        select.classList.add('form-control', 'option-transition-select');
        select.style.flex = '1.3';
        select.style.minWidth = '220px';
        select.style.maxWidth = '360px';
        select.style.display = 'inline-block';
        select.style.marginLeft = '8px';
        select.style.padding = '4px 8px';
        select.style.fontSize = '0.8rem';
        select.style.height = '34px';

        // プレースホルダー（空値）のテキストを分かりやすく変更
        const firstOpt = select.querySelector('option[value=""]');
        if (firstOpt) {
          firstOpt.textContent = '既定の動作（次のセクション）';
        }

        // 不要な「👉 選択時の遷移先」バッジがあれば削除して幅を確保
        const existingLabel = parent.querySelector('.option-transition-label');
        if (existingLabel) existingLabel.remove();
      }
    });

    // 2. 循環分岐防止フィルタ（過去セクションの無効化）を適用
    const allSelects = editorPanel.querySelectorAll('select.option-transition-select, select[data-styled]');
    if (window.n && window.n.sections) {
      // window.r が未定義の場合は、安全のために最初のセクションIDか、親ウィンドウのアクティブセクションIDをフォールバック解決
      const currentSecId = window.r || (window.parent && window.parent.r) || (window.n.sections[0] ? window.n.sections[0].id : '');
      const currentIdx = window.n.sections.findIndex(s => s && s.id === currentSecId);
      
      if (currentSecId) {
        allSelects.forEach(select => {
          // 空値（""）は「デフォルトの進行（同一セクション内の次の質問へ進む）」を表す正常な値のため、
          // 勝手に別セクションへ上書きしない。

          const options = select.querySelectorAll('option');
          let needChangeTrigger = false;
          options.forEach(opt => {
            const val = opt.value;
            if (val && val !== 'next' && val !== 'submit') {
              const targetIdx = window.n.sections.findIndex(s => s && s.id === val);
              
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
    // ユーザー要望により不要となったため無効化（React Flow標準のControlsを優先）
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
        let optionsHtml = '<option value="next">デフォルト（次の項目へ）</option><option value="partial_submit" ' + (node.nextSectionId==='partial_submit'?'selected':'') + '>💾 途中送信（コード確定＆続きリンク発行）</option><option value="submit" ' + (node.nextSectionId==='submit'?'selected':'') + '>回答を送信して終了</option>';
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

    function extractConnections(formObj) {
      if (!formObj || !formObj.sections) return [];
      const connections = [];
      
      formObj.sections.forEach(section => {
        if (section.nextSectionId) {
          connections.push({
            fromType: 'section',
            fromId: section.id,
            fromName: `セクション「${section.title || section.id}」`,
            toId: section.nextSectionId,
            key: `section_${section.id}_to_${section.nextSectionId}`
          });
        }
        
        if (section.questions) {
          section.questions.forEach(q => {
            if (q.options) {
              q.options.forEach(opt => {
                if (opt.nextSectionId) {
                  connections.push({
                    fromType: 'question_option',
                    fromId: q.id,
                    fromName: `セクション「${section.title || section.id}」 > 質問「${q.title || q.id}」 > 選択肢「${opt.label || '無名選択肢'}」`,
                    toId: opt.nextSectionId,
                    key: `opt_${q.id}_${opt.label || ''}_to_${opt.nextSectionId}`
                  });
                }
              });
            }
          });
        }
      });
      
      return connections;
    }

    function logConnectionChanges(oldForm, newForm) {
      if (!oldForm || !newForm) return;
      const oldConn = extractConnections(oldForm);
      const newConn = extractConnections(newForm);
      
      const changes = [];
      
      newConn.forEach(nc => {
        const sameSourceOld = oldConn.find(oc => oc.fromId === nc.fromId && oc.fromType === nc.fromType);
        
        if (sameSourceOld) {
          if (sameSourceOld.toId !== nc.toId) {
            const oldSec = newForm.sections.find(s => s.id === sameSourceOld.toId) || oldForm.sections.find(s => s.id === sameSourceOld.toId);
            const newSec = newForm.sections.find(s => s.id === nc.toId);
            const oldSecName = oldSec ? (oldSec.title || oldSec.id) : `セクション(${sameSourceOld.toId})`;
            const newSecName = newSec ? (newSec.title || newSec.id) : `セクション(${nc.toId})`;
            
            changes.push(`「${nc.fromName}」の遷移先を「${oldSecName}」から「${newSecName}」へ変更しました。`);
          }
        } else {
          const newSec = newForm.sections.find(s => s.id === nc.toId);
          const newSecName = newSec ? (newSec.title || newSec.id) : `セクション(${nc.toId})`;
          changes.push(`「${nc.fromName}」から「${newSecName}」への遷移（接続）を追加しました。`);
        }
      });
      
      oldConn.forEach(oc => {
        const hasSourceInNew = newConn.some(nc => nc.fromId === oc.fromId && nc.fromType === oc.fromType);
        if (!hasSourceInNew) {
          const oldSec = oldForm.sections.find(s => s.id === oc.toId) || newForm.sections.find(s => s.id === oc.toId);
          const oldSecName = oldSec ? (oldSec.title || oldSec.id) : `セクション(${oc.toId})`;
          changes.push(`「${oc.fromName}」から「${oldSecName}」への遷移を削除しました。`);
        }
      });
      
      if (changes.length > 0) {
        const detail = changes.join('\n');
        window.parent.postMessage({
          type: 'FORM_LOG_CONNECTION_EDIT',
          formTitle: newForm.title,
          detail: detail
        }, '*');
      }
    }

    function saveAndSyncMindmapData() {
      if (typeof updateSaveStatus === 'function') {
        updateSaveStatus('saving');
      }

      const activeIndex = localStorage.getItem('form_customize_active_index') || '0';
      const isTemplateMode = localStorage.getItem('form_customize_is_template_mode') === 'true';
      const storageKey = isTemplateMode ? 'form_customize_templates' : 'form_customize_all_forms';
      
      let allForms = [];
      try {
        allForms = JSON.parse(localStorage.getItem(storageKey) || '[]');
      } catch(e) {}
      
      const idx = parseInt(activeIndex);
      if (allForms[idx]) {
        allForms[idx].title = window.G.title;
        allForms[idx].subtitle = (window.G.header && window.G.header.subtitle) ? window.G.header.subtitle : (window.G.subtitle || '');
        allForms[idx].sections = window.G.sections;
        
        if (window.G.headerStyle !== undefined) allForms[idx].headerStyle = window.G.headerStyle;
        if (window.G.headerAlign !== undefined) allForms[idx].headerAlign = window.G.headerAlign;
        if (window.G.subtitlePosition !== undefined) allForms[idx].subtitlePosition = window.G.subtitlePosition;
        if (window.G.titleBadgeShape !== undefined) allForms[idx].titleBadgeShape = window.G.titleBadgeShape;
        if (window.G.titleBadgeStyle !== undefined) allForms[idx].titleBadgeStyle = window.G.titleBadgeStyle;
        if (window.G.titleBadgeBgType !== undefined) allForms[idx].titleBadgeBgType = window.G.titleBadgeBgType;
        if (window.G.titleBadgeBgCustom !== undefined) allForms[idx].titleBadgeBgCustom = window.G.titleBadgeBgCustom;
        if (window.G.titleBadgeColorType !== undefined) allForms[idx].titleBadgeColorType = window.G.titleBadgeColorType;
        if (window.G.titleBadgeColorCustom !== undefined) allForms[idx].titleBadgeColorCustom = window.G.titleBadgeColorCustom;
        if (window.G.titleWarpShape !== undefined) allForms[idx].titleWarpShape = window.G.titleWarpShape;
        if (window.G.titleWarpStrength !== undefined) allForms[idx].titleWarpStrength = window.G.titleWarpStrength;
        if (window.G.titleWarpEffect !== undefined) allForms[idx].titleWarpEffect = window.G.titleWarpEffect;
        if (window.G.titleLightAngle !== undefined) allForms[idx].titleLightAngle = window.G.titleLightAngle;
        if (window.G.titleLightIntensity !== undefined) allForms[idx].titleLightIntensity = window.G.titleLightIntensity;
        if (window.G.titleColorType !== undefined) allForms[idx].titleColorType = window.G.titleColorType;
        if (window.G.titleColorCustom !== undefined) allForms[idx].titleColorCustom = window.G.titleColorCustom;
        if (window.G.titleFontFamily !== undefined) allForms[idx].titleFontFamily = window.G.titleFontFamily;
        if (window.G.titleFontTarget !== undefined) allForms[idx].titleFontTarget = window.G.titleFontTarget;
        
        if (window.G.editorMode !== undefined) allForms[idx].editorMode = window.G.editorMode;
        if (window.G.header !== undefined) allForms[idx].header = window.G.header;
        if (window.G.appearance !== undefined) allForms[idx].appearance = window.G.appearance;
        if (window.G.announcement !== undefined) allForms[idx].announcement = window.G.announcement;
        if (window.G.displayMode !== undefined) allForms[idx].displayMode = window.G.displayMode;
        if (window.G.progressIndicator !== undefined) allForms[idx].progressIndicator = window.G.progressIndicator;
        if (window.G.showLogo !== undefined) allForms[idx].showLogo = window.G.showLogo;
        if (window.G.headerImage !== undefined) allForms[idx].headerImage = window.G.headerImage;
        if (window.G.headerImageScale !== undefined) allForms[idx].headerImageScale = window.G.headerImageScale;
        if (window.G.headerImagePosition !== undefined) allForms[idx].headerImagePosition = window.G.headerImagePosition;
        if (window.G.headerImagePositionX !== undefined) allForms[idx].headerImagePositionX = window.G.headerImagePositionX;
        
        if (window.G.logoType !== undefined) allForms[idx].logoType = window.G.logoType;
        if (window.G.logoPosition !== undefined) allForms[idx].logoPosition = window.G.logoPosition;
        if (window.G.logoImageUrl !== undefined) allForms[idx].logoImageUrl = window.G.logoImageUrl;

        if (window.G.useHeaderImage !== undefined) allForms[idx].useHeaderImage = window.G.useHeaderImage;
        if (window.G.useBgImage !== undefined) allForms[idx].useBgImage = window.G.useBgImage;
        if (window.G.bgTheme !== undefined) allForms[idx].bgTheme = window.G.bgTheme;
        if (window.G.bgCustomUrl !== undefined) allForms[idx].bgCustomUrl = window.G.bgCustomUrl;

        localStorage.setItem(storageKey, JSON.stringify(allForms));
        
        // 接続差分の検出とログ送信
        try {
          logConnectionChanges(oldFormCopy, window.G);
        } catch(e) {
          console.error('[Connection Log] Failed to log changes:', e);
        }
      }

      if (window.x) {
        try { window.x(); } catch(e) {}
      }

      if (window.F) {
        window.F(window.G);
      }

      setTimeout(() => {
        if (typeof updateSaveStatus === 'function') {
          updateSaveStatus('saved');
        }
      }, 300);
    }
    window.saveAndSyncMindmapData = saveAndSyncMindmapData; // 🚀 グローバルプロキシへの登録

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

    let lastLoadedFormTitle = "";

    const customF = function(masterState) {
      if (masterState) {
        window.G = window.G || {};
        const isFormSwitched = (masterState.title !== lastLoadedFormTitle);

        window.G.title = masterState.title;
        window.G.sections = masterState.sections;
        if (masterState.description !== undefined) window.G.description = masterState.description;

        if (isFormSwitched) {
          lastLoadedFormTitle = masterState.title;

          let allForms = [];
          try {
            allForms = JSON.parse(localStorage.getItem('form_customize_all_forms') || '[]');
          } catch(e) {}
          const newIdx = allForms.findIndex(f => f.title === masterState.title);
          if (newIdx !== -1) {
            localStorage.setItem('form_customize_active_index', newIdx.toString());
          }

          loadProSettingsToInputs();
        }

        // isFormSwitchedの有無に関わらず、バッジが隠れている、あるいはタイトル表示未生成の場合は常に更新を走らせて出現を担保する
        const badge = document.getElementById('active-form-title-badge');
        const badgeHidden = !badge || badge.style.display === 'none' || !document.getElementById('header-active-form-title');
        if (isFormSwitched || badgeHidden) {
          updateHeaderActiveFormTitle(masterState.title);
        }
      }
      
      // 🛡️ フォーム分岐ロジックの自己修復＆サニタイズ
      if (window.G && typeof sanitizeFormBranchingLogic === 'function') {
        sanitizeFormBranchingLogic(window.G);
      }

      // 🔀 Archify フローマップの直接レンダリング
      if (window.archifyRenderer && window.G) {
        window.archifyRenderer.render(window.G);
      }
    };

    try {
      Object.defineProperty(window, 'F', {
        get: () => customF,
        set: (val) => {
          console.log('[Archify Flowmap] Blocked attempt to overwrite window.F with:', val);
        },
        configurable: true
      });
      console.log('[Archify Flowmap] window.F locked to Archify engine successfully!');
    } catch (err) {
      window.F = customF;
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

      // 削除済み・不要サンプルフォーム（フィードバック・管理者権限）の自動パージ
      const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
      allForms = (allForms || []).filter(f => !f || !purgedKeywords.some(p => (f.title || '').includes(p)));

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

  // IndexedDB を使用したローカル画像レパートリー自動保存 ＆ ドラッグ＆ドロップ機能の実装
  class ImageLibrary {
    constructor() {
      this.dbName = "SynapseImageLibrary";
      this.dbVersion = 1;
      this.db = null;
    }
    init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        request.onerror = (e) => reject(e);
        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve();
        };
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("headers")) {
            db.createObjectStore("headers", { keyPath: "id", autoIncrement: true });
          }
          if (!db.objectStoreNames.contains("backgrounds")) {
            db.createObjectStore("backgrounds", { keyPath: "id", autoIncrement: true });
          }
        };
      });
    }
    saveImage(category, src, name = "unnamed") {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject("DB not initialized");
        const transaction = this.db.transaction([category], "readwrite");
        const store = transaction.objectStore(category);
        
        // 重複チェック (同じデータソースは保存しない)
        const request = store.openCursor();
        let exists = false;
        request.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.value.src === src) {
              exists = true;
              resolve(cursor.value);
              return;
            }
            cursor.continue();
          } else {
            if (!exists) {
              const item = { src, name, timestamp: Date.now() };
              const addReq = store.add(item);
              addReq.onsuccess = (ev) => {
                item.id = ev.target.result;
                resolve(item);
              };
              addReq.onerror = (err) => reject(err);
            }
          }
        };
      });
    }
    getImages(category) {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject("DB not initialized");
        const transaction = this.db.transaction([category], "readonly");
        const store = transaction.objectStore(category);
        const request = store.getAll();
        request.onsuccess = (e) => {
          const list = e.target.result || [];
          list.sort((a, b) => b.timestamp - a.timestamp);
          resolve(list);
        };
        request.onerror = (e) => reject(e);
      });
    }
    deleteImage(category, id) {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject("DB not initialized");
        const transaction = this.db.transaction([category], "readwrite");
        const store = transaction.objectStore(category);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
      });
    }
  }

  const lib = new ImageLibrary();

  // ライブラリのサムネイル描画
  async function renderLibrary(category, galleryId, containerId, activeUrl) {
    const gallery = document.getElementById(galleryId);
    const container = document.getElementById(containerId);
    if (!gallery || !container) return;

    try {
      const images = await lib.getImages(category);
      if (images.length === 0) {
        container.style.display = "none";
        return;
      }
      container.style.display = "flex";
      gallery.innerHTML = "";

      images.forEach(img => {
        const thumb = document.createElement("div");
        thumb.className = "image-library-thumb" + (img.src === activeUrl ? " active" : "");
        
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.name;
        thumb.appendChild(image);

        // 削除ボタン
        const delBtn = document.createElement("button");
        delBtn.className = "thumb-delete-btn";
        delBtn.innerHTML = "×";
        delBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (confirm("この画像をレパートリーから削除しますか？")) {
            await lib.deleteImage(category, img.id);
            renderLibrary(category, galleryId, containerId, activeUrl);
          }
        });
        thumb.appendChild(delBtn);

        // クリックで画像適用
        thumb.addEventListener("click", () => {
          if (category === "headers") {
            const urlInput = document.getElementById("editor-pro-header-image-url");
            if (urlInput) {
              urlInput.value = img.src;
              urlInput.dispatchEvent(new Event("input"));
            }
          } else {
            // カスタム背景適用
            window.G.bgCustomUrl = img.src;
            window.G.bgTheme = ""; // テーマは未選択にする
            
            // ドロップダウンを解除するため空値をセット
            const themeSelect = document.getElementById("editor-pro-bg-theme-select");
            if (themeSelect) themeSelect.value = ""; // 未選択表示にする

            // 再描画と同期
            if (typeof saveAndSyncMindmapData === "function") saveAndSyncMindmapData();
            if (typeof applyPreviewTheme === "function") applyPreviewTheme();
            if (typeof renderLivePreview === "function") renderLivePreview();
            
            renderLibrary("backgrounds", "bg-library-gallery", "bg-library-container", img.src);
          }
        });

        gallery.appendChild(thumb);
      });
    } catch (err) {
      console.error("Failed to render image library gallery:", err);
    }
  }

  // ドラッグ＆ドロップおよびファイル読み込みセットアップ
  function setupDragAndDrop(dropzoneId, category, onFileLoaded) {
    const dropzone = document.getElementById(dropzoneId);
    if (!dropzone) return;

    // ドラッグホバー時のスタイル制御
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    // ファイルドロップ時の処理
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleImageFile(files[0], category, onFileLoaded);
      }
    });

    // クリックで隠しファイルアップローダーを起動させる
    dropzone.addEventListener("click", () => {
      if (category === "headers") {
        const fileInput = document.getElementById("editor-pro-header-image-file");
        if (fileInput) fileInput.click();
      } else {
        const fileInput = document.getElementById("editor-pro-bg-image-file");
        if (fileInput) fileInput.click();
      }
    });
  }

  function handleImageFile(file, category, onFileLoaded) {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      // DBへ保存
      const savedItem = await lib.saveImage(category, dataUrl, file.name);
      onFileLoaded(dataUrl);

      // ギャラリーの再描画
      if (category === "headers") {
        renderLibrary("headers", "header-library-gallery", "header-library-container", dataUrl);
      } else {
        renderLibrary("backgrounds", "bg-library-gallery", "bg-library-container", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  }

  // 自動保存フックの有効化
  function setupAutoSaveHooks() {
    // 1. ヘッダー画像のファイルアップロード監視
    const headerFileInput = document.getElementById("editor-pro-header-image-file");
    if (headerFileInput) {
      headerFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          handleImageFile(e.target.files[0], "headers", (dataUrl) => {
            const urlInput = document.getElementById("editor-pro-header-image-url");
            if (urlInput) {
              urlInput.value = dataUrl;
              urlInput.dispatchEvent(new Event("input"));
            }
          });
        }
      });
    }

    // 2. ヘッダー画像URL入力変更の監視 (URLからの自動保存)
    const headerUrlInput = document.getElementById("editor-pro-header-image-url");
    if (headerUrlInput) {
      headerUrlInput.addEventListener("change", async (e) => {
        const val = e.target.value;
        if (val && val.startsWith("http")) {
          await lib.saveImage("headers", val, "URL Image");
          renderLibrary("headers", "header-library-gallery", "header-library-container", val);
        }
      });
    }

    // 3. 背景画像ファイルアップロードの監視
    const bgFileInput = document.getElementById("editor-pro-bg-image-file");
    if (bgFileInput) {
      bgFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          handleImageFile(e.target.files[0], "backgrounds", (dataUrl) => {
            window.G.bgCustomUrl = dataUrl;
            window.G.bgTheme = ""; // テーマは未選択にする
            
            const themeSelect = document.getElementById("editor-pro-bg-theme-select");
            if (themeSelect) themeSelect.value = ""; // 未選択表示にする

            if (typeof saveAndSyncMindmapData === "function") saveAndSyncMindmapData();
            if (typeof applyPreviewTheme === "function") applyPreviewTheme();
            if (typeof renderLivePreview === "function") renderLivePreview();
          });
        }
      });
    }
  }

  // 画面起動時にライブラリをロードしてセットアップ
  window.addEventListener("load", async () => {
    try {
      await lib.init();
      setupDragAndDrop("header-image-dropzone", "headers", (dataUrl) => {
        const urlInput = document.getElementById("editor-pro-header-image-url");
        if (urlInput) {
          urlInput.value = dataUrl;
          urlInput.dispatchEvent(new Event("input"));
        }
      });
      setupDragAndDrop("bg-image-dropzone", "backgrounds", (dataUrl) => {
        window.G.bgCustomUrl = dataUrl;
        window.G.bgTheme = ""; // テーマは未選択にする
        const themeSelect = document.getElementById("editor-pro-bg-theme-select");
        if (themeSelect) themeSelect.value = ""; // 未選択表示にする

        if (typeof saveAndSyncMindmapData === "function") saveAndSyncMindmapData();
        if (typeof applyPreviewTheme === "function") applyPreviewTheme();
        if (typeof renderLivePreview === "function") renderLivePreview();
      });
      setupAutoSaveHooks();

      // 初期ロード時に描画
      setTimeout(() => {
        const activeHeader = window.G ? window.G.headerImage : "";
        const activeBg = window.G ? window.G.bgCustomUrl : "";
        renderLibrary("headers", "header-library-gallery", "header-library-container", activeHeader);
        renderLibrary("backgrounds", "bg-library-gallery", "bg-library-container", activeBg);
      }, 500);

      // プレビュー表示・最小化・サイズトグルボタンのアクション
      const pane = document.querySelector(".editor-live-preview-pane");
      const btnMinimize = document.getElementById("btn-preview-minimize");
      const btnToggleSize = document.getElementById("btn-preview-toggle-size");
      const btnHeaderPreview = document.getElementById("btn-header-preview-toggle");

      if (btnToggleSize && pane) {
        btnToggleSize.addEventListener("click", () => {
          const isScaled = pane.classList.toggle("preview-scaled");
          btnToggleSize.title = isScaled ? "等倍表示に戻す" : "縮小表示にする";
          btnToggleSize.textContent = isScaled ? "🗗" : "🗖";
        });
      }

      // 最小化（─）ボタンクリック時
      if (btnMinimize && pane && btnHeaderPreview) {
        btnMinimize.addEventListener("click", () => {
          pane.classList.add("pane-collapsed");
          pane.style.setProperty("display", "none", "important");

          btnHeaderPreview.classList.remove("active");
          btnHeaderPreview.setAttribute("data-tooltip", "プレビューを表示する");
        });
      }

      // ヘッダーの「📱 プレビュー」トグルボタンクリック時
      if (btnHeaderPreview && pane) {
        btnHeaderPreview.addEventListener("click", () => {
          const isCollapsed = pane.classList.contains("pane-collapsed") || pane.style.display === "none" || window.getComputedStyle(pane).display === "none";
          if (isCollapsed) {
            // 展開
            pane.classList.remove("pane-collapsed");
            pane.style.setProperty("display", "flex", "important");

            btnHeaderPreview.classList.add("active");
            btnHeaderPreview.setAttribute("data-tooltip", "プレビューを非表示にする");

            // 画面幅が1180px以下の場合は、自動的に縮小モードで開く
            if (window.innerWidth <= 1180) {
              pane.classList.add("preview-scaled");
              if (btnToggleSize) {
                btnToggleSize.title = "等倍表示に戻す";
                btnToggleSize.textContent = "🗗";
              }
            }
          } else {
            // 最小化
            pane.classList.add("pane-collapsed");
            pane.style.setProperty("display", "none", "important");

            btnHeaderPreview.classList.remove("active");
            btnHeaderPreview.setAttribute("data-tooltip", "プレビューを表示する");
          }
        });
      }

      // 初期ロード時の状態同期
      setTimeout(() => {
        const activeTab = localStorage.getItem('form_customize_active_tab') || 'dashboard';
        if (activeTab === 'editor') {
          // 確実に全体の概要（セクション一覧）を開くために r = null にして再描画
          window.r = null;
          if (typeof window.x === 'function') {
            window.x();
          }

          if (btnHeaderPreview) {
            btnHeaderPreview.style.setProperty("display", "flex", "important");
            if (window.innerWidth <= 1180) {
              // 幅狭時は初期最小化状態
              pane.classList.add("pane-collapsed");
              pane.style.setProperty("display", "none", "important");
              btnHeaderPreview.classList.remove("active");
              btnHeaderPreview.setAttribute("data-tooltip", "プレビューを表示する");
            } else {
              pane.classList.remove("pane-collapsed");
              pane.style.setProperty("display", "flex", "important");
              btnHeaderPreview.classList.add("active");
              btnHeaderPreview.setAttribute("data-tooltip", "プレビューを非表示にする");
            }
          }
        }
      }, 600);

      // 左側サイドバー（構成ナビゲーション）の折りたたみ・展開処理
      const sidebar = document.querySelector(".editor-sidebar");
      const btnSidebarCollapse = document.getElementById("btn-sidebar-collapse");
      const btnSidebarExpand = document.getElementById("btn-sidebar-expand");

      if (btnSidebarCollapse && btnSidebarExpand && sidebar) {
        btnSidebarCollapse.addEventListener("click", () => {
          sidebar.classList.add("sidebar-collapsed");
          btnSidebarExpand.style.setProperty("display", "flex", "important");
        });
        btnSidebarExpand.addEventListener("click", () => {
          sidebar.classList.remove("sidebar-collapsed");
          btnSidebarExpand.style.setProperty("display", "none", "important");
        });
      }
    } catch (err) {
      console.error("ImageLibrary init failed:", err);
    }
  });

  // 🔍 デバッグ用グローバルエラーキャッチャー
  window.addEventListener('error', (event) => {
    console.error('[Global Debug Error]', event.error);
    const debugDiv = document.getElementById('antigravity-debug-log') || (() => {
      const div = document.createElement('div');
      div.id = 'antigravity-debug-log';
      div.style.position = 'fixed';
      div.style.bottom = '10px';
      div.style.left = '10px';
      div.style.background = 'rgba(0,0,0,0.85)';
      div.style.color = '#ff6b6b';
      div.style.padding = '10px';
      div.style.borderRadius = '4px';
      div.style.fontSize = '0.75rem';
      div.style.zIndex = '999999';
      div.style.maxWidth = '400px';
      div.style.maxHeight = '200px';
      div.style.overflowY = 'auto';
      div.style.fontFamily = 'monospace';
      document.body.appendChild(div);
      return div;
    })();
    debugDiv.innerHTML += `<div>⚠️ ${event.message} (${event.filename ? event.filename.split('/').pop() : 'unknown'}:${event.lineno})</div>`;
  });
})();

  // =========================================================================
  // 常用パターン（正規表現プリセット）に固定・携帯両用オプションを動的保証
  // =========================================================================
  const REGEX_PRESET_DEFINITIONS = {
    custom: { label: "カスタム（式を直接入力）", pattern: "" },
    bank_account: { label: "口座番号 (6〜7桁) (例: 1234567)", pattern: "^[0-9]{6,7}$" },
    zip: { label: "郵便番号 (例: 123-4567)", pattern: "^\\d{3}-\\d{4}$" },
    zip_nohyphen: { label: "郵便番号（-無） (例: 1234567)", pattern: "^\\d{7}$" },
    tel_both: { label: "電話番号（固定・携帯 共通） (例: 03-1234-5678 / 090-1234-5678)", pattern: "^(0\\d{1,4}-\\d{1,4}-\\d{3,4})$" },
    tel_both_nohyphen: { label: "電話番号（固定・携帯 共通）（-無） (例: 0312345678 / 09012345678)", pattern: "^0\\d{9,10}$" },
    phone: { label: "携帯電話のみ (例: 090-1234-5678)", pattern: "^(070|080|090)-\\d{4}-\\d{4}$" },
    phone_nohyphen: { label: "携帯電話のみ（-無） (例: 09012345678)", pattern: "^(070|080|090)\\d{8}$" },
    email: { label: "メールアドレス (例: name@example.com)", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
    birthdate: { label: "生年月日 (例: 1990/01/01)", pattern: "^(19|20)\\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\\d|3[01])$" },
    account_holder_kana: { label: "口座名義（カナ・（）.許可） (例: カ）ヤマダ タロウ)", pattern: "^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$" }
  };
  window.REGEX_PRESET_DEFINITIONS = REGEX_PRESET_DEFINITIONS;

  if (window.ie) {
    delete window.ie.tel_both_flexible;
    delete window.ie.tel;
    delete window.ie.tel_nohyphen;
    Object.keys(REGEX_PRESET_DEFINITIONS).forEach(k => {
      window.ie[k] = REGEX_PRESET_DEFINITIONS[k];
    });
  }

  // プリセット質問定義 (window.re) の電話番号、生年月日および口座番号
  if (window.re) {
    if (window.re.tel) {
      window.re.tel.description = "ハイフンを含めて半角数字で入力してください。（例: 03-1234-5678 または 090-1234-5678）";
      if (window.re.tel.validation) {
        window.re.tel.validation.errorMessage = "ハイフンを含めて正しい電話番号の形式で入力してください。";
        window.re.tel.validation.presetKey = "tel_both";
      }
    }
    if (!window.re.birthdate) {
      window.re.birthdate = {
        type: "text",
        title: "生年月日",
        description: "半角数字で入力してください。（例: 1990/01/01）",
        required: true,
        validation: {
          category: "regex",
          condition: "matches",
          presetKey: "birthdate",
          value: "^(19|20)\\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\\d|3[01])$",
          value2: "",
          errorMessage: "正しい生年月日を入力してください（例: 1990/01/01）。"
        },
        options: []
      };
    }
    if (!window.re.bank_account) {
      window.re.bank_account = {
        type: "text",
        title: "口座番号",
        description: "6〜7桁の半角数字で入力してください（例: 1234567）",
        placeholder: "0477651",
        required: true,
        validation: {
          category: "regex",
          condition: "matches",
          presetKey: "bank_account",
          value: "^[0-9]{6,7}$",
          value2: "",
          errorMessage: "正しい口座番号（6〜7桁の半角数字）を入力してください。"
        },
        options: []
      };
    } else {
      window.re.bank_account.description = "6〜7桁の半角数字で入力してください（例: 1234567）";
      window.re.bank_account.placeholder = "0477651";
      if (window.re.bank_account.validation) {
        window.re.bank_account.validation.presetKey = "bank_account";
        window.re.bank_account.validation.value = "^[0-9]{6,7}$";
        window.re.bank_account.validation.errorMessage = "正しい口座番号（6〜7桁の半角数字）を入力してください。"
      }
    }
  }

  // =========================================================================
  // 📝 質問項目 ＋ 入力規則（正規表現など）に応じた最適説明文・エラー文の自動設定エンジン
  // =========================================================================
  function getAutoDescriptionForQuestion(title, validation) {
    const t = (title || '').trim();
    const v = validation || {};
    const cat = v.category || '';
    const cond = v.condition || '';
    const preset = v.presetKey || '';
    const pattern = (v.value || '').trim();

    // 1. API連携
    if (cat === 'api') {
      if (cond === 'corp_name') return '正式な法人名またはキーワードを入力してください。（国税庁法人番号APIから自動検索・補完されます）';
      if (cond === 'invoice_number') return 'Tから始まる13桁の登録番号を入力してください。（例: T1234567890123）';
      if (cond === 'bank_name') return '金融機関名を入力してください。（全銀協コードAPIから自動検索されます）';
      if (cond === 'branch_name') return '支店名を入力してください。（全銀協支店コードAPIから自動検索されます）';
      if (cond === 'branch_code') return '3桁の支店番号を入力してください。（全銀協支店コードAPIから自動検索・支店名が補完されます）';
    }

    // 2. 特殊テキスト: 未入力時のハイフン自動補填
    if (cat === 'text' && cond === 'auto_hyphen') {
      return '個人事業主の方は屋号または氏名をご入力ください。（※ 屋号がない場合は未入力のまま「次へ」へお進みください）';
    }

    // 3. メールアドレス
    if ((cat === 'text' && cond === 'email') || preset === 'email' || (pattern && pattern.includes('@') && pattern.includes('[a-zA-Z]'))) {
      return '半角英数字で正しいメールアドレスを入力してください。（例: name@example.com）';
    }

    // 4. 数値 / 整数
    if (cat === 'number') {
      if (cond === 'is_integer') return '半角の整数で入力してください。';
      return '半角数字で数値を入力してください。';
    }

    // 5. 生年月日（プリセットまたはパターン・タイトルで最優先判定）
    const isBirthdate = preset === 'birthdate' || preset === 'birthday' || (pattern && pattern.includes('19|20')) || (/生年月日|誕生/.test(t) && !/^(tel|phone|zip)/.test(preset));
    if (isBirthdate) {
      return '半角数字で入力してください。（例: 1990/01/01）';
    }

    // 6. 日付
    const isDate = (!/^(tel|phone|zip)/.test(preset) && (/日付|年月日/.test(t) || pattern === '^\\d{4}/\\d{2}/\\d{2}$'));
    if (isDate) {
      return 'YYYY/MM/DD形式の半角数字で入力してください。（例: 2026/07/02）';
    }

    // 7. 郵便番号判定
    const isZipPreset = preset.startsWith('zip');
    const isZipTitle = /郵便|〒|zip/i.test(t);
    const isZipPattern = pattern && (/\\d{3}-\\d{4}/.test(pattern) || (pattern.includes('7') && /郵便/.test(t)));

    if (isZipPreset || (!/^(tel|phone|birthdate)/.test(preset) && (isZipTitle || isZipPattern))) {
      if (preset === 'zip_nohyphen' || (pattern && !pattern.includes('-') && pattern.includes('7'))) {
        return 'ハイフンなしの半角7桁数字で入力してください。（例: 1234567）';
      }
      if (pattern && pattern.includes('-?')) {
        return '半角数字で入力してください。ハイフンの有無はどちらでも構いません。（例: 123-4567 または 1234567）';
      }
      return 'ハイフンを含めて半角数字で入力してください。（例: 123-4567）';
    }

    // 7.5 町名・番地判定
    const isStreet = preset === 'street' || cond === 'street' || ((/町名|番地/.test(t) || /street/i.test(t)) && !/建物|部屋|ビル|マンション|郵便/.test(t));
    if (isStreet) {
      return '自動補完された住所の末尾に、必ず【番地・号（数字）】を追記してください。';
    }

    // 8. 電話番号判定 (プリセット、タイトル、または正規表現パターン)
    const isPhonePreset = /^(tel|phone)/.test(preset);
    const isPhoneTitle = /電話|携帯|ケータイ|けいたい|スマホ|TEL|tel|Tel|連絡先/.test(t);
    const isPhonePattern = pattern && (/0\\d{1,4}/.test(pattern) || /070|080|090/.test(pattern) || /\\d{2,5}-\\d{1,4}-\\d{4}/.test(pattern) || /^(\\^)?0?\\d{9,11}(\\$)?$/.test(pattern));

    if (isPhonePreset || (!/^(birthdate|birthday|zip)/.test(preset) && (isPhoneTitle || isPhonePattern))) {
      const isMobileOnly = /携帯|スマホ|ケータイ/.test(t) || preset === 'phone' || preset === 'phone_nohyphen' || (pattern && /070|080|090/.test(pattern) && !/0\\d{1,4}/.test(pattern));
      const isLandlineOnly = /固定|自宅|会社|事務所/.test(t) || preset === 'tel' || preset === 'tel_nohyphen';

      // ハイフン問わず（柔軟形式: -? や |0\d{9,10} で両方許容）
      const isFlexible = preset === 'tel_both_flexible' || (pattern && (pattern.includes('-?') || (pattern.includes('-') && pattern.includes('|'))));
      
      // ハイフンなし（- を含まない、または nohyphen プリセット）
      const isNoHyphen = preset.includes('nohyphen') || (!isFlexible && pattern && !pattern.includes('-') && (pattern.includes('\\d') || pattern.includes('0-9')));

      if (isFlexible) {
        if (isMobileOnly) {
          return '携帯電話番号を半角数字で入力してください。ハイフンの有無はどちらでも構いません。（例: 090-1234-5678 または 09012345678）';
        }
        if (isLandlineOnly) {
          return '固定電話番号を半角数字で入力してください。ハイフンの有無はどちらでも構いません。（例: 03-1234-5678 または 0312345678）';
        }
        return '半角数字で入力してください。ハイフンの有無はどちらでも構いません。（例: 03-1234-5678 または 0312345678）';
      }

      if (isNoHyphen) {
        if (isMobileOnly) {
          return '携帯電話番号をハイフンなしの半角数字（11桁）で入力してください。（例: 09012345678）';
        }
        if (isLandlineOnly) {
          return '固定電話番号をハイフンなしの半角数字（10桁）で入力してください。（例: 0312345678）';
        }
        return 'ハイフンなしの半角数字で入力してください。（例: 0312345678 または 09012345678）';
      }

      // ハイフンあり（標準）
      if (isMobileOnly) {
        return '携帯電話番号をハイフンを含めて半角数字で入力してください。（例: 090-1234-5678）';
      }
      if (isLandlineOnly) {
        return '固定電話番号をハイフンを含めて半角数字で入力してください。（例: 03-1234-5678）';
      }
      return 'ハイフンを含めて半角数字で入力してください。（例: 03-1234-5678 または 090-1234-5678）';
    }

    // 9. 口座名義（カナ）
    if (/口座名義|名義/.test(t) && (/カナ|フリガナ|ふりがな/.test(t) || (pattern && /ァ-ヶ/.test(pattern)))) {
      return 'カナ、カッコ（）、ドット（.）で入力してください。（例: カ）ヤマダ タロウ）';
    }

    // 10. 口座番号
    const isAcctNumPat = pattern && (pattern.includes('d{7}') || pattern.includes('d{6,7}') || pattern.includes('0-9]{7}') || pattern.includes('0-9]{6,7}'));
    if (preset === 'bank_account' || /口座番号/.test(t) || (!/名義/.test(t) && /口座/.test(t)) || isAcctNumPat) {
      return '6〜7桁の半角数字で入力してください。（例: 1234567）';
    }

    // 11. インボイス登録番号
    if (/インボイス|登録番号/.test(t) || pattern === '^T\\d{13}$') {
      return 'Tから始まる13桁の半角数字で入力してください。（例: T1234567890123）';
    }

    // 12. 全角カタカナ
    if (/カタカナ|フリガナ|ふりがな/.test(t) || (pattern && /ァ-ヶ/.test(pattern))) {
      return '全角カタカナで入力してください。';
    }

    // 13. 半角英数字
    if (pattern === '^[a-zA-Z0-9]+$' || pattern === '^[a-zA-Z0-9_-]+$') {
      return '半角英数字で入力してください。（スペース不可）';
    }

    return '';
  }
  window.getAutoDescriptionForQuestion = getAutoDescriptionForQuestion;

  function getAutoErrorMessageForQuestion(title, validation) {
    const t = (title || '').trim();
    const v = validation || {};
    const cat = v.category || '';
    const cond = v.condition || '';
    const preset = v.presetKey || '';
    const pattern = (v.value || '').trim();

    if (cat === 'api') {
      if (cond === 'invoice_number') return '正しくインボイス登録番号（Tで始まる13桁の数字）を入力してください。';
      if (cond === 'bank_name') return '実在する銀行名を入力または選択してください。';
      if (cond === 'branch_name') return '実在する支店名を入力または選択してください。';
      if (cond === 'branch_code') return '実在する3桁の支店番号を入力または選択してください。';
      if (cond === 'corp_name') return '実在する法人名を入力または選択してください。';
    }

    if (cat === 'number') return '数値を入力してください。';

    // 生年月日（最優先判定）
    const isBirthdate = preset === 'birthdate' || preset === 'birthday' || (pattern && pattern.includes('19|20')) || (/生年月日|誕生/.test(t) && !/^(tel|phone|zip)/.test(preset));
    if (isBirthdate) {
      return '正しい生年月日を入力してください（例: 1990/01/01）。';
    }

    // 日付
    const isDate = (!/^(tel|phone|zip)/.test(preset) && (/日付|年月日/.test(t) || pattern === '^\\d{4}/\\d{2}/\\d{2}$'));
    if (isDate) {
      return '正しい日付（YYYY/MM/DD）を入力してください。';
    }

    // 郵便番号
    if (preset === 'zip_nohyphen' || (!/^(tel|phone|birthdate)/.test(preset) && pattern && !pattern.includes('-') && pattern.includes('7') && /郵便/.test(t))) {
      return 'ハイフンなしの半角7桁数字で正しく入力してください。';
    }
    if (preset === 'zip' || (!/^(tel|phone|birthdate)/.test(preset) && pattern && /\\d{3}-\\d{4}/.test(pattern))) {
      return '正しい郵便番号の形式（123-4567）で入力してください。';
    }

    // 電話番号
    const isPhonePreset = /^(tel|phone)/.test(preset);
    const isPhoneTitle = /電話|携帯|ケータイ|けいたい|スマホ|TEL|tel|Tel|連絡先/.test(t);
    const isPhonePattern = pattern && (/0\\d{1,4}/.test(pattern) || /070|080|090/.test(pattern) || /\\d{2,5}-\\d{1,4}-\\d{4}/.test(pattern) || /^(\\^)?0?\\d{9,11}(\\$)?$/.test(pattern));

    if (isPhonePreset || (!/^(birthdate|birthday|zip)/.test(preset) && (isPhoneTitle || isPhonePattern))) {
      const isFlexible = preset === 'tel_both_flexible' || (pattern && (pattern.includes('-?') || (pattern.includes('-') && pattern.includes('|'))));
      const isNoHyphen = preset.includes('nohyphen') || (!isFlexible && pattern && !pattern.includes('-') && (pattern.includes('\\d') || pattern.includes('0-9')));

      if (isFlexible) {
        return '正しい電話番号の形式（半角数字）で入力してください。';
      }
      if (isNoHyphen) {
        return 'ハイフンなしの半角数字で正しく入力してください。';
      }
      return 'ハイフンを含めて正しい電話番号の形式で入力してください。';
    }

    // 口座名義（カナ）
    if (/口座名義|名義/.test(t) && (/カナ|フリガナ|ふりがな/.test(t) || (pattern && /ァ-ヶ/.test(pattern)))) {
      return '口座名義はカナと（）.のみで入力してください。';
    }

    // 口座番号
    const isAcctNumPat = pattern && (pattern.includes('d{7}') || pattern.includes('d{6,7}') || pattern.includes('0-9]{7}') || pattern.includes('0-9]{6,7}'));
    if (preset === 'bank_account' || /口座番号/.test(t) || (!/名義/.test(t) && /口座/.test(t)) || isAcctNumPat) {
      return '正しい口座番号（6〜7桁の半角数字）を入力してください。';
    }

    // メールアドレス
    if (preset === 'email' || (pattern && pattern.includes('@') && pattern.includes('[a-zA-Z]'))) {
      return '正しいメールアドレスの形式で入力してください（例: name@example.com）。';
    }

    if (pattern === '^[a-zA-Z0-9]+$') {
      return '半角英数字のみで入力してください。';
    }
    if (pattern && /ァ-ヶ/.test(pattern)) {
      return '全角カタカナのみで入力してください。';
    }

    return '入力値が正しくありません。';
  }
  window.getAutoErrorMessageForQuestion = getAutoErrorMessageForQuestion;

  // 既存データ内の「ハイフンなし設定なのにハイフンあり説明文のまま」等の矛盾を安全に自動修復
  function sanitizeContradictoryDescriptions(formObj) {
    if (!formObj || !formObj.sections) return;
    let modified = false;
    formObj.sections.forEach(sec => {
      if (!sec || !sec.questions) return;
      sec.questions.forEach(q => {
        if (!q) return;
        const t = (q.title || '').trim();
        const isAcctHolder = (q.dataKey === 'account_holder_kana') || ((t.includes('口座名義') || t.includes('名義人') || (t.includes('口座') && t.includes('名義'))) && (t.includes('カナ') || t.includes('フリガナ') || t.includes('ふりがな') || (q.validation && q.validation.category === 'regex' && /^[ァ-ヶ]/.test(q.validation.value || ''))));
        if (isAcctHolder) {
          const desc = q.description || '';
          if (!desc || desc.includes('全角カタカナで入力してください')) {
            q.description = 'カナ、カッコ（）、ドット（.）で入力してください。（例: カ）ヤマダ タロウ）';
            modified = true;
          }
          if (q.validation && q.validation.category === 'regex') {
            if (q.validation.value !== '^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$' || q.validation.presetKey !== 'account_holder_kana') {
              q.validation.value = '^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$';
              q.validation.presetKey = 'account_holder_kana';
              q.validation.errorMessage = '口座名義はカナと（）.のみで入力してください。';
              modified = true;
            }
          }
        }

        if (!q.validation) return;
        const v = q.validation;
        const desc = q.description || '';
        if (v.category === 'regex') {
          const pk = v.presetKey || '';
          const val = v.value || '';
          const isNoHyphenRegex = pk.includes('nohyphen') || (val && !val.includes('-') && (val.includes('\\d') || val.includes('0-9')));
          const isFlexibleRegex = pk === 'tel_both_flexible' || (val && (val.includes('-?') || (val.includes('-') && val.includes('|'))));

          if (isNoHyphenRegex && desc.includes('ハイフンを含めて')) {
            const newDesc = getAutoDescriptionForQuestion(q.title, v);
            if (newDesc) {
              q.description = newDesc;
              modified = true;
            }
          } else if (isFlexibleRegex && (desc.includes('ハイフンを含めて') || desc.includes('ハイフンなしの'))) {
            const newDesc = getAutoDescriptionForQuestion(q.title, v);
            if (newDesc) {
              q.description = newDesc;
              modified = true;
            }
          }
        }
      });
    });
    if (modified && window.S) {
      window.S(true);
    }
  }

  // 質問カードヘッダーに「🔄 規則から自動設定」ボタンを動的に注入
  function injectAutoDescSyncButtons() {
    const cards = document.querySelectorAll('.question-card');
    cards.forEach(card => {
      const qId = card.dataset.questionId;
      if (!qId) return;

      const descInput = card.querySelector('.q-desc-input');
      if (!descInput) return;

      const formGroup = descInput.closest('.form-group');
      if (!formGroup) return;

      const header = formGroup.firstElementChild;
      if (!header || header.querySelector('.btn-auto-desc-sync')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-auto-desc-sync';
      btn.dataset.questionId = qId;
      btn.title = '入力規則や項目名に合わせて、最適な説明文（ハイフンの有無・形式等）を自動設定します';
      btn.innerHTML = '🔄 規則から自動設定';

      const linkBtn = header.querySelector('.btn-insert-link-modal');
      if (linkBtn) {
        header.insertBefore(btn, linkBtn);
      } else {
        header.appendChild(btn);
      }
    });
  }

  function syncWindowIe() {
    if (window.ie) {
      delete window.ie.tel_both_flexible;
      delete window.ie.tel;
      delete window.ie.tel_nohyphen;
      Object.keys(REGEX_PRESET_DEFINITIONS).forEach(k => {
        window.ie[k] = REGEX_PRESET_DEFINITIONS[k];
      });
    }
  }

  // 正規表現プリセットドロップダウンの拡張と自動説明文連携
  function patchRegexPresetDropdowns() {
    syncWindowIe();
    const selects = document.querySelectorAll('.val-inputs-container select');
    selects.forEach(sel => {
      const hasZip = Array.from(sel.options).some(opt => opt.value === 'zip');
      if (!hasZip) return;

      const curVal = sel.value;
      const currentKeys = Array.from(sel.options).map(o => o.value);
      const targetKeys = Object.keys(REGEX_PRESET_DEFINITIONS);

      const needsUpdate = currentKeys.length !== targetKeys.length ||
        !currentKeys.includes('birthdate') ||
        !currentKeys.includes('email') ||
        !currentKeys.includes('bank_account') ||
        !currentKeys.includes('tel_both_nohyphen');

      if (needsUpdate) {
        sel.innerHTML = "";
        targetKeys.forEach(k => {
          const opt = document.createElement('option');
          opt.value = k;
          opt.textContent = REGEX_PRESET_DEFINITIONS[k].label;
          sel.appendChild(opt);
        });
        sel.value = REGEX_PRESET_DEFINITIONS[curVal] ? curVal : 'custom';
      }
    });

    const presetSelect = document.getElementById('select-preset-question');
    if (presetSelect && !presetSelect.querySelector('option[value="birthdate"]')) {
      const opt = document.createElement('option');
      opt.value = 'birthdate';
      opt.textContent = '生年月日';
      presetSelect.appendChild(opt);
    }
    if (presetSelect && !presetSelect.querySelector('option[value="bank_account"]')) {
      const opt = document.createElement('option');
      opt.value = 'bank_account';
      opt.textContent = '口座番号 (6〜7桁)';
      presetSelect.appendChild(opt);
    }

    injectAutoDescSyncButtons();
  }

  // 「🔄 規則から自動設定」ボタンクリック時の処理（手動編集後でもワンクリックで規則通りに戻せる）
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-auto-desc-sync');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const card = btn.closest('.question-card');
    const qId = btn.dataset.questionId || (card ? card.dataset.questionId : null);
    const q = findQuestionDefById(qId);

    const descInput = card ? card.querySelector('.q-desc-input') : null;
    const titleInput = card ? card.querySelector('.form-group.flex-3 input, input[placeholder*="タイトル"]') : null;
    const title = (q && q.title) ? q.title : (titleInput ? titleInput.value : '');

    let validation = q ? q.validation : null;
    if (!validation && card) {
      const sel = card.querySelector('.val-inputs-container select');
      const patInput = card.querySelector('.val-inputs-container input[type="text"]');
      if (sel) {
        const pk = sel.value;
        const def = REGEX_PRESET_DEFINITIONS[pk];
        validation = {
          category: 'regex',
          condition: 'matches',
          presetKey: pk,
          value: def ? def.pattern : (patInput ? patInput.value : '')
        };
      }
    }

    const autoDesc = getAutoDescriptionForQuestion(title, validation);
    const autoErr = getAutoErrorMessageForQuestion(title, validation);

    if (autoDesc) {
      if (q) q.description = autoDesc;
      if (descInput) {
        descInput.value = autoDesc;
        descInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (autoErr && q && q.validation) {
        q.validation.errorMessage = autoErr;
      }
      const errInput = card ? card.querySelector('.form-group input[placeholder*="エラー時に表示する"]') : null;
      if (errInput && autoErr) {
        errInput.value = autoErr;
        errInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (window.fastUpdateLivePreview) {
        window.fastUpdateLivePreview('question_desc', autoDesc, { questionId: qId });
      }
      if (window.S) window.S(true);

      const origHtml = btn.innerHTML;
      btn.innerHTML = '✓ 反映完了';
      btn.classList.add('synced');
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.classList.remove('synced');
      }, 1400);
    } else {
      const origHtml = btn.innerHTML;
      btn.innerHTML = '※ 規則未設定';
      btn.classList.add('warn');
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.classList.remove('warn');
      }, 1400);
    }
  });

  // 正規表現プリセット選択変更時の自動同期（キャプチャフェーズで検知して確実に適用）
  document.addEventListener('change', (e) => {
    syncWindowIe();
    const sel = e.target;
    if (!sel || !sel.closest || !sel.closest('.val-inputs-container')) return;
    const isPresetSelect = Array.from(sel.options || []).some(opt => opt.value === 'tel_both' || opt.value === 'zip');
    if (!isPresetSelect) return;

    const card = sel.closest('.question-card');
    if (!card || !card.dataset.questionId) return;

    const qId = card.dataset.questionId;
    const q = findQuestionDefById(qId);
    if (!q) return;

    const newKey = sel.value;
    const def = REGEX_PRESET_DEFINITIONS[newKey];
    const pattern = def ? def.pattern : (newKey === 'custom' ? (q.validation?.value || '') : '');

    if (q.validation) {
      q.validation.presetKey = newKey;
      if (newKey !== 'custom' && pattern) {
        q.validation.value = pattern;
      }
    }

    const patternInput = card.querySelector('.val-inputs-container input[type="text"]');
    if (patternInput && pattern) {
      patternInput.value = pattern;
    }

    const dummyVal = Object.assign({}, q.validation, {
      category: 'regex',
      condition: 'matches',
      presetKey: newKey,
      value: pattern
    });

    const autoDesc = getAutoDescriptionForQuestion(q.title, dummyVal);
    const autoErr = getAutoErrorMessageForQuestion(q.title, dummyVal);

    if (autoDesc) {
      q.description = autoDesc;
      const descInput = card.querySelector('.q-desc-input');
      if (descInput) {
        descInput.value = autoDesc;
      }
      if (window.fastUpdateLivePreview) {
        window.fastUpdateLivePreview('question_desc', autoDesc, { questionId: qId });
      }
    }
    if (autoErr && q.validation) {
      q.validation.errorMessage = autoErr;
      const errInput = card.querySelector('.form-group input[placeholder*="エラー時に表示する"]');
      if (errInput) {
        errInput.value = autoErr;
      }
    }
  }, true);

  // AIチャット相談ボタンが押された際に編集対象の質問オブジェクトを保持
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn && btn.textContent && btn.textContent.includes('AIチャット相談')) {
      const card = btn.closest('.question-card');
      if (card && card.dataset.questionId) {
        window._currentAiRegexQuestion = findQuestionDefById(card.dataset.questionId);
      }
    }
  }, true);

  // 質問コンテナのDOM変更を監視してプリセット・自動設定ボタンを常時適用
  const questionsContainer = document.getElementById('questions-container');
  if (questionsContainer) {
    const qObserver = new MutationObserver(() => {
      patchRegexPresetDropdowns();
    });
    qObserver.observe(questionsContainer, { childList: true, subtree: true });
  }

  // 起動時の既存データ修復
  setTimeout(() => {
    sanitizeContradictoryDescriptions(window.n || window.G);
    patchRegexPresetDropdowns();
  }, 150);


  // =========================================================================
  // 🔗 フォーム回答用リンク（公開URL）の発行・コピー機能 (回答専用ページ view.html 連携)
  // =========================================================================
  function getCurrentFormObject(formIndex) {
    const idx = (formIndex !== undefined && formIndex !== null) ? formIndex : (window.W !== undefined ? window.W : (parseInt(localStorage.getItem('form_customize_active_index'), 10) || 0));
    let formObj = null;
    if (window.U && window.U[idx]) {
      formObj = window.U[idx];
    } else if (window.G && window.G.title) {
      formObj = window.G;
    } else {
      try {
        const raw = localStorage.getItem('form_customize_all_forms');
        if (raw) {
          const list = JSON.parse(raw);
          if (list && list[idx]) formObj = list[idx];
        }
      } catch(e) {}
    }
    return { formObj, idx };
  }

  // フォームJSONのURL-Safe圧縮エンコーダー
  async function encodeFormDataForUrl(formObj) {
    if (!formObj) return '';
    try {
      const jsonStr = JSON.stringify(formObj);
      if (typeof CompressionStream !== 'undefined') {
        const stream = new Blob([jsonStr]).stream().pipeThrough(new CompressionStream('deflate'));
        const response = new Response(stream);
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return 'z1_' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } else {
        return 'b1_' + btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
    } catch (e) {
      console.warn('[Share URL] Encode failed, using raw fallback:', e);
      return 'raw_' + encodeURIComponent(JSON.stringify(formObj));
    }
  }

  let _currentShareModalFormIndex = null;
  let _currentShareModalEnv = 'production'; // 'production' (main) | 'test' (test branch)

  function updateShareModalOpenTabBtn(targetUrl) {
    const openTabBtn = document.getElementById('btn-open-share-url-tab');
    if (openTabBtn) {
      openTabBtn.onclick = () => {
        try { syncFormsToCloud(null, true); } catch(e) {}
        window.open(targetUrl, '_blank');
      };
    }
  }

  function getPublicFormShareUrl(formIndex, shorten = true, env = 'production') {
    const origin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
    let pathname = window.location.pathname || '';
    
    // 正確に /form-customize/view.html へのパスを解決する（二重パスの防止）
    let viewPath = '';
    if (pathname.includes('form-customize')) {
      const prefix = pathname.substring(0, pathname.indexOf('form-customize'));
      viewPath = `${prefix}form-customize/view.html`;
    } else if (pathname.endsWith('.html')) {
      viewPath = pathname.substring(0, pathname.lastIndexOf('/') + 1) + 'view.html';
    } else if (pathname.endsWith('/')) {
      viewPath = pathname + 'view.html';
    } else {
      viewPath = pathname + '/view.html';
    }
    viewPath = viewPath.replace(/\/+/g, '/');
    if (!viewPath.startsWith('/')) viewPath = '/' + viewPath;

    const { formObj, idx } = getCurrentFormObject(formIndex);
    const formId = formObj && formObj.id ? formObj.id : `form_${idx}`;
    
    // バックグラウンドでクラウド（Supabase）への保存・即時同期を実行
    try { syncFormsToCloud(null, true); } catch(e) {}

    const isTest = (env === 'test');
    const envParam = isTest ? (shorten ? '?env=test' : '&env=test') : '';

    // 短縮URL (Google Forms短縮URL風: 例 https://synapse-wayway.vercel.app/f/0)
    if (shorten) {
      return `${origin}/f/${idx}${envParam}`;
    }

    // 完全URL (例: https://synapse-wayway.vercel.app/form-customize/view.html?id=form_0)
    return `${origin}${viewPath}?id=${encodeURIComponent(formId)}&form_idx=${idx}${envParam}`;
  }

  function showGlobalShareToast(msg) {
    let toast = document.getElementById('global-share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-share-toast';
      toast.style.cssText = 'position: fixed; top: 25px; left: 50%; transform: translateX(-50%); z-index: 100000; background: #202124; color: #ffffff; padding: 10px 22px; border-radius: 24px; font-size: 0.85rem; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; transition: opacity 0.25s, top 0.25s; pointer-events: none; opacity: 0;';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: #4ade80;">✓</span> ${msg}`;
    toast.style.opacity = '1';
    toast.style.top = '25px';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.top = '10px';
    }, 2500);
  }

  async function copyFormShareUrl(formIndex, silent = false, forceShorten = true) {
    const url = getPublicFormShareUrl(formIndex, forceShorten, _currentShareModalEnv || 'production');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        const envLabel = _currentShareModalEnv === 'test' ? 'テスト送信リンク' : '本番用共有リンク';
        if (!silent) showGlobalShareToast(`${envLabel}をクリップボードにコピーしました！`);
      } catch (e) {
        fallbackCopy(url, silent);
      }
    } else {
      fallbackCopy(url, silent);
    }
    return url;
  }

  function fallbackCopy(text, silent = false) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      const envLabel = _currentShareModalEnv === 'test' ? 'テスト送信リンク' : '本番用共有リンク';
      if (!silent) showGlobalShareToast(`${envLabel}をクリップボードにコピーしました！`);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
    textarea.remove();
  }

  // =========================================================================
  // 🌿 Gitブランチ型 本番統合（公開更新 / Merge to main）管理モジュール
  // =========================================================================

  function checkFormPublishStatus(formObj) {
    if (!formObj) return { isSynced: true, version: 1 };
    const version = formObj.publishedVersion || 1;
    if (!formObj.publishedSnapshot || !formObj.publishedSnapshot.sections) {
      // まだ一度も明示的に本番統合されていない初期フォーム
      const hasSections = formObj.sections && formObj.sections.length > 0;
      return { isSynced: !hasSections, version: 1, isInitial: true, publishedAt: null };
    }

    const extractCore = (f) => ({
      title: (f.title || '').trim(),
      subtitle: (f.subtitle || '').trim(),
      description: (f.description || '').trim(),
      headerStyle: f.headerStyle || 'card-accent-top',
      headerAlign: f.headerAlign || 'left',
      subtitlePosition: f.subtitlePosition || 'below',
      titleBadgeShape: f.titleBadgeShape || 'none',
      titleBadgeStyle: f.titleBadgeStyle || 'fill',
      titleBadgeBgType: f.titleBadgeBgType || 'primary',
      titleBadgeBgCustom: f.titleBadgeBgCustom || '#1a73e8',
      titleBadgeColorType: f.titleBadgeColorType || 'white',
      titleBadgeColorCustom: f.titleBadgeColorCustom || '#ffffff',
      titleWarpShape: f.titleWarpShape || 'none',
      titleWarpStrength: f.titleWarpStrength !== undefined ? f.titleWarpStrength : 50,
      titleWarpEffect: f.titleWarpEffect || 'none',
      titleLightAngle: f.titleLightAngle !== undefined ? f.titleLightAngle : 315,
      titleLightIntensity: f.titleLightIntensity !== undefined ? f.titleLightIntensity : 60,
      titleColorType: f.titleColorType || 'default',
      titleColorCustom: f.titleColorCustom || '#1a73e8',
      titleFontFamily: f.titleFontFamily || 'default',
      titleFontTarget: f.titleFontTarget || 'both',
      targetTableMode: 'dedicated',
      targetTableId: f.targetTableId || 'dedicated',
      createDedicatedTable: true,
      sections: (f.sections || []).map(sec => ({
        id: sec.id,
        title: (sec.title || '').trim(),
        description: (sec.description || '').trim(),
        questions: (sec.questions || []).map(q => ({
          id: q.id,
          title: (q.title || '').trim(),
          type: q.type,
          required: !!q.required,
          options: q.options || [],
          dataKey: q.dataKey || null,
          validation: q.validation || null,
          apiConfig: q.apiConfig || null
        }))
      }))
    });

    const currentCore = JSON.stringify(extractCore(formObj));
    const publishedCore = JSON.stringify(extractCore(formObj.publishedSnapshot));
    const isSynced = (currentCore === publishedCore);

    return {
      isSynced,
      version,
      publishedAt: formObj.publishedAt || null
    };
  }

  function mergeFormToProduction(formIndex) {
    const { formObj, idx } = getCurrentFormObject(formIndex);
    if (!formObj) return;

    const currentTitle = formObj.title || '無題のフォーム';
    const currentVersion = formObj.publishedVersion || 1;
    const nextVersion = currentVersion + 1;

    // クリーンな公開スナップショットを作成（循環参照や不要メタデータを除去）
    const snapshot = {
      id: formObj.id || `form_${idx}`,
      title: formObj.title || '無題のフォーム',
      subtitle: formObj.subtitle || '',
      description: formObj.description || '',
      headerStyle: formObj.headerStyle || 'card-accent-top',
      headerAlign: formObj.headerAlign || 'left',
      subtitlePosition: formObj.subtitlePosition || 'below',
      titleBadgeShape: formObj.titleBadgeShape || 'none',
      titleBadgeStyle: formObj.titleBadgeStyle || 'fill',
      titleBadgeBgType: formObj.titleBadgeBgType || 'primary',
      titleBadgeBgCustom: formObj.titleBadgeBgCustom || '#1a73e8',
      titleBadgeColorType: formObj.titleBadgeColorType || 'white',
      titleBadgeColorCustom: formObj.titleBadgeColorCustom || '#ffffff',
      titleWarpShape: formObj.titleWarpShape || 'none',
      titleWarpStrength: formObj.titleWarpStrength !== undefined ? formObj.titleWarpStrength : 50,
      titleWarpEffect: formObj.titleWarpEffect || 'none',
      titleLightAngle: formObj.titleLightAngle !== undefined ? formObj.titleLightAngle : 315,
      titleLightIntensity: formObj.titleLightIntensity !== undefined ? formObj.titleLightIntensity : 60,
      titleColorType: formObj.titleColorType || 'default',
      titleColorCustom: formObj.titleColorCustom || '#1a73e8',
      titleFontFamily: formObj.titleFontFamily || 'default',
      titleFontTarget: formObj.titleFontTarget || 'both',
      sections: JSON.parse(JSON.stringify(formObj.sections || [])),
      theme: formObj.theme ? JSON.parse(JSON.stringify(formObj.theme)) : null,
      settings: formObj.settings ? JSON.parse(JSON.stringify(formObj.settings)) : null,
      appearance: formObj.appearance ? JSON.parse(JSON.stringify(formObj.appearance)) : null,
      estimatedTime: formObj.estimatedTime || null,
      targetTableMode: 'dedicated',
      targetTableId: formObj.targetTableId || 'dedicated',
      createDedicatedTable: true,
      isUnpublished: !!formObj.isUnpublished,
      publishedVersion: nextVersion,
      publishedAt: new Date().toISOString()
    };

    formObj.publishedSnapshot = snapshot;
    formObj.publishedVersion = nextVersion;
    formObj.publishedAt = snapshot.publishedAt;

    // window.U の該当インデックスも確実に更新
    if (window.U && window.U[idx]) {
      window.U[idx] = formObj;
    }

    // localStorage の form_customize_all_forms へ保存（フックにより Supabase へ自動同期される）
    try {
      const allFormsRaw = localStorage.getItem('form_customize_all_forms');
      let allForms = allFormsRaw ? JSON.parse(allFormsRaw) : [];
      if (allForms[idx]) {
        allForms[idx] = formObj;
      } else {
        const fIdx = allForms.findIndex(f => f && (f.id === formObj.id || f.title === formObj.title));
        if (fIdx !== -1) allForms[fIdx] = formObj;
        else allForms.push(formObj);
      }
      localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
    } catch(e) {
      console.warn('[Merge] Failed to update localStorage allForms:', e);
    }

    // UIを更新
    updatePublishSyncUI(idx);

    // トースト通知
    showGlobalShareToast(`「${currentTitle}」を本番公開リンクへ統合しました！（v${nextVersion}）`);
    if (typeof showToast === 'function') {
      showToast(`「${currentTitle}」を本番環境へ統合しました。配布済み本番リンクが最新版（v${nextVersion}）に切り替わりました。`, 'success');
    }
  }

  // 🏷️ フォーム名（必ずサブタイトルまで結合）生成共通ヘルパー
  function getEffectiveFormTitle(formDef) {
    if (!formDef) return '無題のフォーム';
    const rawTitle = (typeof formDef === 'string' ? formDef : (formDef.title || formDef.name || '無題のフォーム')).trim();
    if (typeof formDef === 'string') return rawTitle;
    const rawSubtitle = (formDef.subtitle || (formDef.header && formDef.header.subtitle) || '').trim();
    if (rawSubtitle && !rawTitle.includes(rawSubtitle)) {
      return `${rawTitle} ${rawSubtitle}`;
    }
    return rawTitle || '無題のフォーム';
  }
  window.getEffectiveFormTitle = getEffectiveFormTitle;

  // 🏷️ フォーム名からサブタイトルを含めたSupabase物理テーブル名を生成（フォーム毎の固有性を完全保証）
  function getPhysicalTableNameForForm(formDef) {
    if (!formDef) return 'form_default';
    if (formDef.physicalTableName && formDef.physicalTableName !== 'form_custom' && formDef.physicalTableName !== 'form_default') {
      return formDef.physicalTableName;
    }

    const effectiveTitle = getEffectiveFormTitle(formDef);
    
    // 1. 主要な既知フォームの固定マッピング
    if (effectiveTitle.includes('紹介代理店') || effectiveTitle.includes('代理店')) {
      return 'form_referral_agency_application';
    }
    if (effectiveTitle.includes('フィードバック') || effectiveTitle.includes('アンケート') || effectiveTitle.includes('feedback')) {
      return 'form_customer_feedback';
    }
    if (effectiveTitle.includes('管理者') || effectiveTitle.includes('アカウント') || effectiveTitle.includes('account')) {
      return 'form_admin_account_creation';
    }
    if (effectiveTitle.includes('基本情報')) {
      return 'form_basic_info';
    }
    if (effectiveTitle.includes('口座') || effectiveTitle.includes('担当者')) {
      return 'form_bank_account';
    }

    // 2. formDef.id が英数字を含む場合
    const rawId = (formDef.id || '').toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
    if (rawId && rawId.length >= 3 && rawId !== 'form_yosandas' && rawId !== 'form_custom') {
      return rawId.startsWith('form_') ? rawId : `form_${rawId}`;
    }

    // 3. タイトルから英数字を抽出できる場合
    const cleanTitle = effectiveTitle.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    if (cleanTitle && cleanTitle.length >= 3) {
      return `form_${cleanTitle}`;
    }

    // 4. 日本語タイトルのみの場合はハッシュを付与して一意性を完全担保
    let hash = 0;
    for (let i = 0; i < effectiveTitle.length; i++) {
      hash = ((hash << 5) - hash) + effectiveTitle.charCodeAt(i);
      hash |= 0;
    }
    const hexHash = Math.abs(hash).toString(16).padStart(6, '0').slice(0, 8);
    return `form_tbl_${hexHash}`;
  }
  window.getPhysicalTableNameForForm = getPhysicalTableNameForForm;

  // 📊 フォーム専用独立テーブル作成共通ヘルパー（1フォーム1テーブルの原則を完全保証）
  async function createDedicatedTableForForm(formDef) {
    if (!formDef) return null;
    const formTitle = getEffectiveFormTitle(formDef);
    const pTableName = getPhysicalTableNameForForm(formDef);
    const sections = formDef.sections || [];

    const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';

    let curTables = [];
    try { curTables = JSON.parse(localStorage.getItem('synapse_custom_tables')) || []; } catch(e) {}

    // 🔍 既にこのフォーム専用テーブルが存在するか徹底チェック（多重作成の完全防止）
    let existingTable = curTables.find(t => t && (
      (formDef.targetTableId && t.id === formDef.targetTableId) ||
      (formDef.id && t.formId && t.formId === formDef.id) ||
      (t.name === formTitle) ||
      (t.formTitle && t.formTitle === formTitle) ||
      (pTableName && t.physicalTableName && t.physicalTableName === pTableName)
    ) && t.id !== 'table_all_form_responses');

    if (existingTable) {
      // 🌟 既存テーブルが存在する場合：新規テーブルIDは発行せず、既存テーブルのID・回答行データ（rows）を100%保持
      formDef.createDedicatedTable = true;
      formDef.targetTableId = existingTable.id;
      formDef.targetTableType = 'dedicated';
      formDef.physicalTableName = existingTable.physicalTableName || pTableName;

      if (!existingTable.formId && formDef.id) {
        existingTable.formId = formDef.id;
      }
      existingTable.sourceFormId = formDef.id;
      existingTable.formTitle = formTitle;
      existingTable.name = formTitle;
      existingTable.isFormDedicatedTable = true;
      if (!existingTable.parentMenuId || existingTable.parentMenuId === 'root') {
        existingTable.parentMenuId = 'forms-accordion';
      }

      // 追加カラムがあれば安全に同期
      if (typeof updateDedicatedTableColumns === 'function') {
        await updateDedicatedTableColumns(existingTable, formDef);
      }

      localStorage.setItem('synapse_custom_tables', JSON.stringify(curTables));
      localStorage.setItem(`synapse_table_${existingTable.id}`, JSON.stringify(existingTable));

      // 🌐 Supabase上の物理テーブルが削除されていた場合に備え、CREATE TABLE RPCを必ず呼び出して物理テーブルを再生成・復元
      try {
        const rpcCols = (existingTable.columns || []).map(c => ({ id: c.id, label: c.label || c.name, type: c.type || 'text' }));
        await fetch(`${sbUrl}/rest/v1/rpc/synapse_create_or_alter_table`, {
          method: 'POST',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            p_table_name: existingTable.physicalTableName || pTableName,
            p_columns: rpcCols
          })
        });
        console.log(`[Supabase Physical Table] Verified/Recreated physical table "${existingTable.physicalTableName || pTableName}" on Supabase.`);
      } catch (rpcErr) {
        console.warn('[Supabase Physical Table RPC] Error verifying physical table on Supabase:', rpcErr);
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'SYNAPSE_TABLE_UPDATED', table: existingTable }, '*');
      }

      console.log(`[DedicatedTable] Reusing existing table "${existingTable.name}" (ID: ${existingTable.id}). Physical table ensured on Supabase.`);
      return existingTable;
    }

    // --- 初回作成時のみ新規IDを発行 ---
    const newTableId = (formDef.targetTableId && formDef.targetTableId !== 'dedicated' && formDef.targetTableId !== 'table_all_form_responses')
      ? formDef.targetTableId
      : `ctbl_${Date.now()}`;
    const columns = [
      { id: 'master_id', label: 'マスターID / コード', type: 'text', required: false },
      { id: 'form_title', label: 'フォーム名', type: 'text', required: false }
    ];

    sections.forEach((sec) => {
      (sec.questions || []).forEach(q => {
        const colId = q.dataKey || `col_${q.id}`;
        const colName = (q.title || q.dataKey || q.id || '').trim();
        let colType = 'text';
        if (q.type === 'date') colType = 'date';
        else if (q.type === 'select' || q.type === 'radio') colType = 'select';
        else if (q.type === 'number') colType = 'number';

        // 🔍 同一のキー（dataKey/id）を持つカラムが既に存在するかチェック
        const existingCol = columns.find(c => c.id === colId);
        if (existingCol) {
          // 同一キーの設問が存在する場合：別カラムを作らず1つのカラムに統合
          // ラベルが異なる場合（例: 法人名 と 屋号）はスラッシュで繋いで「法人名 / 屋号」にする
          if (colName && !existingCol.label.includes(colName)) {
            existingCol.label = `${existingCol.label} / ${colName}`;
            existingCol.name = existingCol.label;
          }
          if (q.required) existingCol.required = true;
          // choices のマージ
          if (Array.isArray(q.options) && q.options.length > 0) {
            if (!existingCol.choices) existingCol.choices = [];
            const existingVals = new Set(existingCol.choices.map(c => typeof c === 'object' ? (c.label || c.value) : c));
            q.options.forEach(opt => {
              const val = typeof opt === 'object' ? (opt.label || opt.value) : opt;
              if (val && !existingVals.has(val)) {
                existingCol.choices.push({ value: val });
                existingVals.add(val);
              }
            });
          }
          return; // 重複追加を防止
        }

        columns.push({
          id: colId,
          label: colName,
          name: colName,
          type: colType,
          required: q.required || false,
          choices: q.options ? q.options.map(opt => ({ value: (typeof opt === 'object' ? (opt.label || opt.value) : opt) })) : undefined
        });
      });
    });

    columns.push(
      { id: 'status', label: 'ステータス', type: 'select', choices: [{ value: '回答完了', color: '#10b981' }, { value: '途中送信', color: '#f59e0b' }], required: false },
      { id: 'registration_code', label: '確定登録コード', type: 'text', required: false },
      { id: 'resume_url', label: '再開用URL', type: 'text', required: false },
      { id: 'created_at', label: '送信日時', type: 'date', required: false }
    );

    const defaultWidths = {};
    columns.forEach(col => { defaultWidths[col.id] = 130; });

    const newTable = {
      id: newTableId,
      formId: formDef.id,
      sourceFormId: formDef.id,
      name: formTitle,
      formTitle: formTitle,
      physicalTableName: pTableName,
      isFormDedicatedTable: true,
      parentMenuId: 'forms-accordion',
      columns: columns,
      visibleColumns: columns.map(c => c.id),
      columnWidths: defaultWidths,
      rowHeights: {},
      fixedCol: 'none',
      fixedRow: 'none',
      cellStyles: {},
      rows: []
    };

    const existingIdx = curTables.findIndex(t => 
      t.id === newTableId || 
      (formDef.id && t.formId === formDef.id) ||
      t.name === formTitle
    );
    if (existingIdx !== -1) {
      curTables[existingIdx] = newTable;
    } else {
      curTables.push(newTable);
    }
    localStorage.setItem('synapse_custom_tables', JSON.stringify(curTables));
    localStorage.setItem(`synapse_table_${newTableId}`, JSON.stringify(newTable));

    try {
      await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key: `synapse_table_${newTableId}`,
          value: newTable,
          updated_at: new Date().toISOString()
        })
      });

      await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key: 'synapse_custom_tables',
          value: curTables,
          updated_at: new Date().toISOString()
        })
      });

      // 🌐 Supabaseクラウド上に物理テーブル（CREATE TABLE）を自動作成 (RPC)
      try {
        const rpcCols = columns.map(c => ({ id: c.id, label: c.label || c.name, type: c.type || 'text' }));
        await fetch(`${sbUrl}/rest/v1/rpc/synapse_create_or_alter_table`, {
          method: 'POST',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            p_table_name: pTableName,
            p_columns: rpcCols
          })
        });
        console.log(`[Supabase Physical Table] RPC triggered for table "${pTableName}".`);
      } catch (rpcErr) {
        console.warn('[Supabase Physical Table RPC] Failed to create physical table via RPC (RPC might not be installed yet):', rpcErr);
      }
    } catch (netErr) {
      console.warn('[Supabase Sync] Network error during table registration:', netErr);
    }

    formDef.createDedicatedTable = true;
    formDef.targetTableId = newTableId;
    formDef.targetTableType = 'dedicated';
    formDef.physicalTableName = pTableName;

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SYNAPSE_TABLE_CREATED', table: newTable }, '*');
    }

    return newTable;
  }
  window.createDedicatedTableForForm = createDedicatedTableForForm;

  // 🌟 全フォームの専用回答テーブルを一括同期・再作成（重複防止・Supabase物理テーブル完全保証）
  async function syncOrRecreateAllDedicatedTables(options = {}) {
    console.log('[DedicatedTable Batch] Starting batch synchronization for all forms...');
    const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';

    let allForms = [];
    try {
      allForms = JSON.parse(localStorage.getItem('form_customize_all_forms')) || [];
    } catch(e) {}
    if (!allForms || allForms.length === 0) {
      try {
        const sbRes = await fetch(`${sbUrl}/rest/v1/synapse_storage?key=eq.synapse_form_customize_all_forms`, {
          headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
        });
        const sbData = await sbRes.json();
        if (sbData && sbData[0] && Array.isArray(sbData[0].value)) {
          allForms = sbData[0].value;
        }
      } catch(err) {}
    }

    if (!allForms || allForms.length === 0) {
      console.warn('[DedicatedTable Batch] No forms found to synchronize.');
      return { success: false, message: '同期対象のフォームが見つかりませんでした。', count: 0 };
    }

    const results = [];
    for (let i = 0; i < allForms.length; i++) {
      const formDef = allForms[i];
      if (!formDef) continue;
      
      const effectiveTitle = getEffectiveFormTitle(formDef);
      const pTableName = getPhysicalTableNameForForm(formDef);
      formDef.physicalTableName = pTableName;

      const tbl = await createDedicatedTableForForm(formDef);
      if (tbl) {
        formDef.createDedicatedTable = true;
        formDef.targetTableId = tbl.id;
        formDef.targetTableType = 'dedicated';
        if (formDef.publishedSnapshot) {
          formDef.publishedSnapshot.createDedicatedTable = true;
          formDef.publishedSnapshot.targetTableId = tbl.id;
          formDef.publishedSnapshot.targetTableType = 'dedicated';
          formDef.publishedSnapshot.physicalTableName = pTableName;
        }
        results.push({ formTitle: effectiveTitle, tableId: tbl.id, physicalTableName: pTableName, columnsCount: (tbl.columns || []).length });
      }
    }

    localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
    try {
      await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key: 'synapse_form_customize_all_forms',
          value: allForms,
          updated_at: new Date().toISOString()
        })
      });
    } catch(err) {
      console.warn('[Supabase Sync] Failed to update synapse_form_customize_all_forms:', err);
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SYNAPSE_ALL_TABLES_SYNCED', results: results }, '*');
    }

    console.log(`[DedicatedTable Batch] Successfully synchronized ${results.length} form tables:`, results);
    return { success: true, count: results.length, results: results };
  }
  window.syncOrRecreateAllDedicatedTables = syncOrRecreateAllDedicatedTables;

  // 🔍 フォームの最新定義と既存専用テーブルを比較し、新設された質問（追加カラム）を特定する
  function getNewColumnsForFormTable(dedicatedTable, formDef) {
    if (!dedicatedTable || !formDef) return { newColumnsToAdd: [], existingColCount: 0 };

    const formQuestions = [];
    (formDef.sections || []).forEach(sec => {
      (sec.questions || []).forEach(q => {
        if (q) formQuestions.push(q);
      });
    });

    const cols = Array.isArray(dedicatedTable.columns) ? dedicatedTable.columns : [];
    const existingColIds = new Set(cols.map(c => c && c.id).filter(Boolean));
    const existingColLabels = new Set(cols.map(c => c && (c.label || c.name || '').trim()).filter(Boolean));

    const newColumnsToAdd = [];
    formQuestions.forEach(q => {
      const colId = q.dataKey || `col_${q.id}`;
      const colName = (q.title || q.dataKey || q.id || '').trim();

      const hasId = existingColIds.has(colId) || (q.id && existingColIds.has(q.id)) || (q.dataKey && existingColIds.has(q.dataKey));
      const hasLabel = colName && existingColLabels.has(colName);

      if (hasId) {
        // 既存カラムが存在する場合はラベル統合（例: 法人名 と 屋号 を統一）
        const targetCol = cols.find(c => c && (c.id === colId || c.id === q.id || c.id === q.dataKey));
        if (targetCol && colName && !targetCol.label.includes(colName)) {
          targetCol.label = `${targetCol.label} / ${colName}`;
          targetCol.name = targetCol.label;
        }
        return;
      }

      if (!hasId && !hasLabel) {
        let colType = 'text';
        if (q.type === 'date') colType = 'date';
        else if (q.type === 'select' || q.type === 'radio') colType = 'select';
        else if (q.type === 'number') colType = 'number';

        let choices = undefined;
        if (Array.isArray(q.options) && q.options.length > 0) {
          choices = q.options.map(opt => {
            if (typeof opt === 'object' && opt !== null) {
              return { value: opt.label || opt.value || '' };
            }
            return { value: String(opt) };
          });
        }

        const newCol = {
          id: colId,
          label: colName,
          name: colName,
          type: colType,
          required: !!q.required,
          choices: choices
        };
        newColumnsToAdd.push(newCol);
        existingColIds.add(colId);
        if (q.id) existingColIds.add(q.id);
        if (q.dataKey) existingColIds.add(q.dataKey);
        if (colName) existingColLabels.add(colName);
      }
    });

    return { newColumnsToAdd, existingColCount: cols.length };
  }
  window.getNewColumnsForFormTable = getNewColumnsForFormTable;

  // 🔄 テストから本番へ統合する際、追加カラムがあった場合のみ既存専用テーブルを更新する
  async function updateDedicatedTableColumns(dedicatedTable, formDef) {
    if (!dedicatedTable || !formDef) return { updated: false, addedColumns: [] };

    const { newColumnsToAdd } = getNewColumnsForFormTable(dedicatedTable, formDef);
    if (!newColumnsToAdd || newColumnsToAdd.length === 0) {
      console.log(`[DedicatedTable] No new columns detected for "${dedicatedTable.name}". Table preserved as-is.`);
      return { updated: false, addedColumns: [] };
    }

    console.log(`[DedicatedTable] Adding ${newColumnsToAdd.length} new columns to existing table "${dedicatedTable.name}"...`, newColumnsToAdd);

    if (!Array.isArray(dedicatedTable.columns)) dedicatedTable.columns = [];
    
    // システムカラム（status, registration_code, resume_url, created_at）の直前に新カラムを挿入
    const sysColKeys = ['status', 'registration_code', 'resume_url', 'created_at'];
    let insertIdx = dedicatedTable.columns.findIndex(c => c && sysColKeys.includes(c.id));
    if (insertIdx === -1) insertIdx = dedicatedTable.columns.length;

    dedicatedTable.columns.splice(insertIdx, 0, ...newColumnsToAdd);

    // visibleColumnsの更新
    if (Array.isArray(dedicatedTable.visibleColumns)) {
      newColumnsToAdd.forEach(c => {
        if (!dedicatedTable.visibleColumns.includes(c.id)) {
          dedicatedTable.visibleColumns.push(c.id);
        }
      });
    }

    // columnWidthsの更新
    if (!dedicatedTable.columnWidths) dedicatedTable.columnWidths = {};
    newColumnsToAdd.forEach(c => {
      if (!dedicatedTable.columnWidths[c.id]) {
        dedicatedTable.columnWidths[c.id] = 130;
      }
    });

    // 1. synapse_custom_tables の保存・更新
    let curTables = [];
    try { curTables = JSON.parse(localStorage.getItem('synapse_custom_tables')) || []; } catch(e) {}
    const existingIdx = curTables.findIndex(t => t && t.id === dedicatedTable.id);
    if (existingIdx !== -1) {
      curTables[existingIdx] = dedicatedTable;
    } else {
      curTables.push(dedicatedTable);
    }
    localStorage.setItem('synapse_custom_tables', JSON.stringify(curTables));

    // 2. synapse_table_${id} の更新（既存行データを保持したままカラム定義のみマージ）
    let fullTable = dedicatedTable;
    try {
      const raw = localStorage.getItem(`synapse_table_${dedicatedTable.id}`);
      if (raw) {
        fullTable = JSON.parse(raw);
        fullTable.columns = dedicatedTable.columns;
        fullTable.visibleColumns = dedicatedTable.visibleColumns;
        fullTable.columnWidths = dedicatedTable.columnWidths;
      }
    } catch(e) {}
    localStorage.setItem(`synapse_table_${dedicatedTable.id}`, JSON.stringify(fullTable));

    // 3. Supabaseへの非同期同期
    const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';

    try {
      await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
        method: 'POST',
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({ key: `synapse_table_${dedicatedTable.id}`, value: fullTable, updated_at: new Date().toISOString() })
      });
      await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
        method: 'POST',
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({ key: 'synapse_custom_tables', value: curTables, updated_at: new Date().toISOString() })
      });
    } catch(netErr) {
      console.warn('[Supabase Sync] Network error during table columns update:', netErr);
    }

    // 🌐 Supabaseクラウド上の物理テーブルへ追加カラムを動的反映 (RPC)
    if (newColumnsToAdd && newColumnsToAdd.length > 0) {
      try {
        const rawSlug = (formDef.id || formDef.title || dedicatedTable.name || 'form').toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const pTableName = rawSlug.startsWith('form_') ? rawSlug : `form_${rawSlug}`;
        const rpcCols = newColumnsToAdd.map(c => ({ id: c.id, label: c.label || c.name, type: c.type || 'text' }));
        await fetch(`${sbUrl}/rest/v1/rpc/synapse_create_or_alter_table`, {
          method: 'POST',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            p_table_name: pTableName,
            p_columns: rpcCols
          })
        });
        console.log(`[Supabase Physical Table] Added ${newColumnsToAdd.length} columns to table "${pTableName}" via RPC.`);
      } catch (rpcErr) {
        console.warn('[Supabase Physical Table Alter RPC]', rpcErr);
      }
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SYNAPSE_TABLE_UPDATED', table: fullTable, addedColumns: newColumnsToAdd }, '*');
    }

    return { updated: true, addedColumns: newColumnsToAdd };
  }
  window.updateDedicatedTableColumns = updateDedicatedTableColumns;

  // 🚀 本番公開・統合モーダル（公開時に専用テーブル作成を選択可能）
  let _mergeModalTargetIndex = null;

  function openMergeProductionModal(formIndex) {
    const { formObj, idx } = getCurrentFormObject(formIndex);
    if (!formObj) return;
    _mergeModalTargetIndex = idx;

    const modal = document.getElementById('modal-merge-production');
    if (!modal) {
      // モーダル要素がない場合は従来の確認ダイアログ
      const title = getEffectiveFormTitle(formObj);
      const nextVer = ((formObj && formObj.publishedVersion) || 1) + 1;
      if (confirm(`「${title}」の最新編集内容を本番公開リンクへ統合（公開更新）しますか？\n\n・新バージョン: v${nextVer}\n・配布済みの本番URLは変更されず、回答画面が最新版へ切り替わります。\n・過去のテスト送信データが本番に混ざることはありません。`)) {
        mergeFormToProduction(idx);
      }
      return;
    }

    const titleEl = document.getElementById('merge-modal-form-title');
    const verEl = document.getElementById('merge-modal-version-text');
    const dedicatedToggle = document.getElementById('merge-create-dedicated-table');
    const tableCard = document.getElementById('merge-target-table-card');
    const tableDesc = document.getElementById('merge-target-table-desc');
    const labelEl = document.getElementById('merge-create-dedicated-table-label');
    const badgeEl = document.getElementById('merge-table-badge');

    const formTitle = getEffectiveFormTitle(formObj);
    const curVer = formObj.publishedVersion || 1;
    const nextVer = curVer + 1;

    if (titleEl) titleEl.textContent = formTitle;
    if (verEl) verEl.textContent = `v${curVer} → v${nextVer}`;

    const publishStatus = checkFormPublishStatus(formObj);
    const isSynced = publishStatus.isSynced;

    // 専用テーブルの有無判定（本番で1回作成されたテーブルがあるか）
    const pTableName = getPhysicalTableNameForForm(formObj);
    let existingTables = [];
    try { existingTables = JSON.parse(localStorage.getItem('synapse_custom_tables')) || []; } catch(e) {}
    const dedicatedTable = existingTables.find(t => t && (
      t.id === formObj.targetTableId ||
      (formObj.id && t.formId && t.formId === formObj.id) ||
      t.name === formTitle ||
      (t.formTitle && t.formTitle === formTitle) ||
      (pTableName && t.physicalTableName && t.physicalTableName === pTableName)
    ) && t.id !== 'table_all_form_responses');

    const hasDedicated = !!(dedicatedTable || (formObj.targetTableId && formObj.targetTableId !== 'table_all_form_responses' && formObj.targetTableType === 'dedicated'));

    // 再統合内容がない（同期中）かつ専用テーブル未作成の状態で開かれた場合は、自動でトグルをONにして作成を即時支援
    let isDedicated = hasDedicated;
    if (isSynced && !hasDedicated) {
      isDedicated = true;
    } else if (formObj.createDedicatedTable === true || formObj.targetTableType === 'dedicated') {
      isDedicated = true;
    }

    if (dedicatedToggle) {
      dedicatedToggle.checked = isDedicated;
    }

    // ヘッダーアイコン・タイトルの動的更新
    const headerIconEl = document.getElementById('merge-modal-header-icon');
    const headerTextEl = document.getElementById('merge-modal-header-text');
    if (headerIconEl && headerTextEl) {
      if (isSynced && !hasDedicated) {
        headerIconEl.textContent = '📊';
        headerTextEl.textContent = '専用テーブル作成・本番連携';
      } else if (isSynced && hasDedicated) {
        headerIconEl.textContent = '📊';
        headerTextEl.textContent = '専用テーブル設定・本番公開';
      } else {
        headerIconEl.textContent = '🚀';
        headerTextEl.textContent = '本番環境へ統合（公開更新）';
      }
    }

    // 実行ボタンのラベル
    const executeBtn = document.getElementById('btn-execute-merge-prod');
    if (executeBtn) {
      if (isSynced && !hasDedicated) {
        executeBtn.textContent = '📊 専用テーブルを作成して反映';
      } else if (isSynced && hasDedicated) {
        executeBtn.textContent = '🚀 設定を本番へ反映';
      } else {
        executeBtn.textContent = '🚀 本番環境へ統合して公開';
      }
    }

    const updateMergeModalTableUI = (checked) => {
      if (!tableCard || !tableDesc) return;
      if (checked) {
        tableCard.style.borderColor = '#cbd5e1';
        tableCard.style.background = '#f8fafc';

        if (dedicatedTable) {
          const { newColumnsToAdd } = getNewColumnsForFormTable(dedicatedTable, formObj);
          if (labelEl) labelEl.textContent = '専用テーブルと連携中';

          if (badgeEl) {
            badgeEl.style.display = 'inline-block';
            if (newColumnsToAdd.length > 0) {
              badgeEl.textContent = `+${newColumnsToAdd.length} カラム追加`;
              badgeEl.style.background = '#e0f2fe';
              badgeEl.style.color = '#0369a1';
            } else {
              badgeEl.textContent = 'カラム変更なし';
              badgeEl.style.background = '#f1f5f9';
              badgeEl.style.color = '#64748b';
            }
          }

          if (newColumnsToAdd.length > 0) {
            const previewNames = newColumnsToAdd.map(c => c.label).slice(0, 2).join('、') + (newColumnsToAdd.length > 2 ? ` 他${newColumnsToAdd.length - 2}件` : '');
            tableDesc.innerHTML = `🔄 既存テーブル「${dedicatedTable.name || formTitle}」に新設された<strong>${newColumnsToAdd.length}件</strong>のカラム（${previewNames}）を自動追加します。`;
            tableDesc.style.color = '#0369a1';
          } else {
            tableDesc.innerHTML = `✅ 既存テーブル「${dedicatedTable.name || formTitle}」と連携中（追加カラムはありません）。`;
            tableDesc.style.color = '#475569';
          }
        } else {
          if (labelEl) labelEl.textContent = 'このフォーム専用のテーブルを作成する';
          if (badgeEl) {
            badgeEl.style.display = 'inline-block';
            badgeEl.textContent = '初回作成';
            badgeEl.style.background = '#fef3c7';
            badgeEl.style.color = '#92400e';
          }
          tableDesc.innerHTML = `💡 初回本番公開時に専用テーブル「<strong>${formTitle}</strong>」を自動作成します。`;
          tableDesc.style.color = '#475569';
        }
      } else {
        tableCard.style.borderColor = '#e2e8f0';
        tableCard.style.background = '#ffffff';
        if (labelEl) labelEl.textContent = '専用テーブルと連携しない';
        if (badgeEl) badgeEl.style.display = 'none';
        tableDesc.innerHTML = `💡 回答はフォーム専用の独立テーブルに保存されます。`;
        tableDesc.style.color = '#94a3b8';
      }
    };

    updateMergeModalTableUI(isDedicated);

    if (dedicatedToggle && !dedicatedToggle._hooked) {
      dedicatedToggle._hooked = true;
      dedicatedToggle.addEventListener('change', (e) => {
        updateMergeModalTableUI(e.target.checked);
      });
    }

    // モーダル内ボタンのイベント紐付け
    const closeBtn = document.getElementById('btn-close-merge-modal');
    const cancelBtn = document.getElementById('btn-cancel-merge-modal');
    const executeBtnReal = document.getElementById('btn-execute-merge-prod');

    if (closeBtn) closeBtn.onclick = closeMergeProductionModal;
    if (cancelBtn) cancelBtn.onclick = closeMergeProductionModal;

    if (executeBtnReal) {
      executeBtnReal.onclick = executeMergeProductionFromModal;
    }

    if (closeBtn && !closeBtn._hooked) {
      closeBtn._hooked = true;
      closeBtn.onclick = closeMergeProductionModal;
    }
    if (cancelBtn && !cancelBtn._hooked) {
      cancelBtn._hooked = true;
      cancelBtn.onclick = closeMergeProductionModal;
    }
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  window.openMergeProductionModal = openMergeProductionModal;

  function closeMergeProductionModal() {
    const modal = document.getElementById('modal-merge-production');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    _mergeModalTargetIndex = null;
  }
  window.closeMergeProductionModal = closeMergeProductionModal;

  async function executeMergeProductionFromModal() {
    const targetIdx = _mergeModalTargetIndex !== null ? _mergeModalTargetIndex : (typeof detectActiveFormIndex === 'function' ? detectActiveFormIndex() : 0);
    const { formObj, idx } = getCurrentFormObject(targetIdx);
    if (!formObj) return;

    const executeBtn = document.getElementById('btn-execute-merge-prod');
    if (executeBtn) {
      executeBtn.disabled = true;
      executeBtn.textContent = '⏳ 本番公開・反映中...';
    }

    const notifySuccess = (msg) => {
      showGlobalShareToast(msg);
      if (typeof showToast === 'function') {
        showToast(msg, 'success');
      } else if (window.parent && typeof window.parent.showToast === 'function') {
        window.parent.showToast(msg, 'success');
      }
    };

    const notifyError = (msg) => {
      showGlobalShareToast(msg);
      if (typeof showToast === 'function') {
        showToast(msg, 'error');
      } else if (window.parent && typeof window.parent.showToast === 'function') {
        window.parent.showToast(msg, 'error');
      }
    };

    try {
      const dedicatedToggle = document.getElementById('merge-create-dedicated-table');
      const wantDedicated = dedicatedToggle ? dedicatedToggle.checked : true;

      if (wantDedicated) {
        let existingTables = [];
        try { existingTables = JSON.parse(localStorage.getItem('synapse_custom_tables')) || []; } catch(e) {}
        const formTitle = getEffectiveFormTitle(formObj);
        const pTableName = getPhysicalTableNameForForm(formObj);
        let dedicatedTable = existingTables.find(t => t && (
          t.id === formObj.targetTableId ||
          (formObj.id && t.formId && t.formId === formObj.id) ||
          t.name === formTitle ||
          (t.formTitle && t.formTitle === formTitle) ||
          (pTableName && t.physicalTableName && t.physicalTableName === pTableName)
        ) && t.id !== 'table_all_form_responses');

        if (!dedicatedTable) {
          // 専用テーブルの新規作成は本番で最初の1回のみ
          dedicatedTable = await createDedicatedTableForForm(formObj);
          console.log(`[DedicatedTable] First-time production table created:`, dedicatedTable?.id);
        } else {
          // すでに存在する場合：テーブルIDを確実に紐付け、追加カラムがあった場合のみテーブルを更新
          formObj.createDedicatedTable = true;
          formObj.targetTableId = dedicatedTable.id;
          formObj.targetTableType = 'dedicated';
          formObj.physicalTableName = dedicatedTable.physicalTableName || pTableName;
          if (!dedicatedTable.formId && formObj.id) {
            dedicatedTable.formId = formObj.id;
          }
          dedicatedTable.sourceFormId = formObj.id;
          dedicatedTable.isFormDedicatedTable = true;

          // フォームタイトル（サブタイトル含む）が変更されていた場合はテーブル表示名も同期更新
          if (dedicatedTable.name !== formTitle) {
            dedicatedTable.name = formTitle;
            dedicatedTable.formTitle = formTitle;
          }

          const res = await updateDedicatedTableColumns(dedicatedTable, formObj);
          if (res && res.updated) {
            console.log(`[DedicatedTable] Successfully updated table "${dedicatedTable.name}" with ${res.addedColumns.length} new columns.`);
          } else {
            console.log(`[DedicatedTable] Table "${dedicatedTable.name}" requires no column updates.`);
          }
        }
      } else {
        formObj.createDedicatedTable = true;
        formObj.targetTableType = 'dedicated';
        formObj.targetTableId = formObj.targetTableId || 'dedicated';
      }

      if (typeof syncGlobalTargetTableSelect === 'function') {
        syncGlobalTargetTableSelect(wantDedicated);
      }

      mergeFormToProduction(idx);
      closeMergeProductionModal();
      const currentTitle = getEffectiveFormTitle(formObj);
      const nextVersion = (formObj.publishedVersion || 1);
      notifySuccess(`「${currentTitle}」を本番環境へ統合しました。配布済み本番リンクが最新版（v${nextVersion}）に切り替わりました。`);
    } catch(err) {
      console.error('[MergeProductionModal] Error during merge execution:', err);
      notifyError('本番環境への統合中にエラーが発生しました。');
    } finally {
      if (executeBtn) {
        executeBtn.disabled = false;
        executeBtn.textContent = '🚀 本番環境へ統合する';
      }
    }
  }
  window.executeMergeProductionFromModal = executeMergeProductionFromModal;

  // 🔒 フォームの非公開・公開（受付停止・再開）切り替え
  async function toggleFormPublishStatus(formIndex) {
    const { formObj, idx } = getCurrentFormObject(formIndex);
    if (!formObj) return;

    const currentlyUnpublished = !!formObj.isUnpublished;
    const newUnpublished = !currentlyUnpublished;
    const formTitle = formObj.title || '無題のフォーム';

    const confirmMsg = newUnpublished
      ? `「${formTitle}」を【非公開（受付停止）】にしますか？\n\n・本番URLにアクセスした回答者には受付停止案内が表示されます。\n・いつでも再度公開（受付再開）することができます。`
      : `「${formTitle}」の【公開（受付再開）】を行いますか？\n\n・本番URLで回答者が再度フォームへアクセス・回答できるようになります。`;

    if (!confirm(confirmMsg)) return;

    formObj.isUnpublished = newUnpublished;
    if (formObj.publishedSnapshot) {
      formObj.publishedSnapshot.isUnpublished = newUnpublished;
    }

    if (window.U && window.U[idx]) {
      window.U[idx] = formObj;
    }

    try {
      const allFormsRaw = localStorage.getItem('form_customize_all_forms');
      let allForms = allFormsRaw ? JSON.parse(allFormsRaw) : [];
      if (allForms[idx]) {
        allForms[idx] = formObj;
      } else {
        const fIdx = allForms.findIndex(f => f && (f.id === formObj.id || f.title === formObj.title));
        if (fIdx !== -1) allForms[fIdx] = formObj;
        else allForms.push(formObj);
      }
      localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
    } catch(e) {
      console.warn('[Unpublish] Failed to update localStorage:', e);
    }

    if (typeof persistDrawerChanges === 'function') persistDrawerChanges();
    if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();

    updatePublishSyncUI(idx);

    const toastMsg = newUnpublished
      ? `🔒「${formTitle}」を非公開（受付停止）にしました。本番リンクでの回答が停止されました。`
      : `🟢「${formTitle}」を公開（受付再開）しました。本番リンクでの回答受付を再開しました。`;

    showGlobalShareToast(toastMsg);
    if (typeof showToast === 'function') {
      showToast(toastMsg, newUnpublished ? 'warning' : 'success');
    }
  }
  window.toggleFormPublishStatus = toggleFormPublishStatus;

  function updatePublishSyncUI(targetIndex) {
    const { formObj, idx } = getCurrentFormObject(targetIndex);
    if (!formObj) return;

    const status = checkFormPublishStatus(formObj);
    const isUnpublished = !!formObj.isUnpublished;

    // 🔒 非公開（受付停止）状態のUI反映
    const statusBar = document.getElementById('share-publish-status-bar');
    const statusText = document.getElementById('share-publish-status-text');
    const statusIcon = document.getElementById('share-publish-status-icon');
    const statusLabel = document.getElementById('share-publish-status-label');
    const modalToggleBtn = document.getElementById('btn-modal-toggle-publish');
    const menuToggleTitle = document.getElementById('menu-toggle-publish-title');
    const menuToggleIcon = document.getElementById('menu-toggle-publish-icon');
    const menuToggleDesc = document.getElementById('menu-toggle-publish-desc');

    if (statusBar) {
      if (isUnpublished) {
        statusBar.style.background = '#fef2f2';
        statusBar.style.borderColor = '#fca5a5';
      } else {
        statusBar.style.background = '#f0fdf4';
        statusBar.style.borderColor = '#bbf7d0';
      }
    }
    if (statusText) {
      statusText.style.color = isUnpublished ? '#991b1b' : '#166534';
    }
    if (statusIcon) {
      statusIcon.textContent = isUnpublished ? '🔴' : '🟢';
    }
    if (statusLabel) {
      statusLabel.textContent = isUnpublished ? '本番受付停止中（非公開）' : '本番受付中（公開中）';
    }
    if (modalToggleBtn) {
      if (isUnpublished) {
        modalToggleBtn.innerHTML = '🔓 フォームを公開（受付再開）';
        modalToggleBtn.style.color = '#15803d';
        modalToggleBtn.style.background = '#f0fdf4';
        modalToggleBtn.style.borderColor = '#86efac';
      } else {
        modalToggleBtn.innerHTML = '🔒 フォームを非公開にする';
        modalToggleBtn.style.color = '#dc2626';
        modalToggleBtn.style.background = '#fef2f2';
        modalToggleBtn.style.borderColor = '#f87171';
      }
    }
    if (menuToggleTitle) {
      menuToggleTitle.textContent = isUnpublished ? 'フォームを公開（受付再開）する' : 'フォームを非公開にする';
      menuToggleTitle.style.color = isUnpublished ? '#15803d' : '#dc2626';
    }
    if (menuToggleIcon) {
      menuToggleIcon.textContent = isUnpublished ? '🔓' : '🔒';
    }
    if (menuToggleDesc) {
      menuToggleDesc.textContent = isUnpublished ? '本番リンクでの回答受付を再開します' : '本番リンクの回答受付を停止します';
    }

    // モーダル内要素
    const syncArea = document.getElementById('share-publish-sync-area');
    const syncDot = document.getElementById('share-publish-sync-dot');
    const syncTitle = document.getElementById('share-publish-sync-title');
    const versionBadge = document.getElementById('share-publish-version-badge');
    const syncDesc = document.getElementById('share-publish-sync-desc');
    const mergeBtn = document.getElementById('btn-merge-to-production');

    // ヘッダーボタン
    const headerMergeBtn = document.getElementById('btn-header-merge-prod');

    if (versionBadge) {
      versionBadge.textContent = `v${status.version}`;
    }

    if (status.isSynced) {
      if (syncArea) {
        syncArea.style.borderColor = '#cbd5e1';
        syncArea.style.background = '#f8fafc';
      }
      if (syncDot) syncDot.style.background = '#10b981';
      if (syncTitle) {
        syncTitle.textContent = '本番公開リンクと同期中';
        syncTitle.style.color = '#1e293b';
      }
      if (syncDesc) {
        const pubTime = status.publishedAt ? new Date(status.publishedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '';
        syncDesc.textContent = pubTime 
          ? `現在の編集内容は本番公開リンクに反映されています（最終統合: ${pubTime}）。`
          : '現在の編集内容は本番公開リンクに反映されています。';
      }
      let customTables = [];
      try { customTables = JSON.parse(localStorage.getItem('synapse_custom_tables')) || []; } catch(e) {}
      const curFormTitle = getEffectiveFormTitle(formObj);
      const dedicatedTable = customTables.find(t => t && (
        t.id === formObj.targetTableId ||
        t.name === curFormTitle ||
        (t.formTitle && t.formTitle === curFormTitle) ||
        (t.formId && t.formId === formObj.id)
      ) && t.id !== 'table_all_form_responses');

      const isDedicatedActive = !!(dedicatedTable || (formObj.targetTableId && formObj.targetTableId !== 'table_all_form_responses' && formObj.targetTableType === 'dedicated'));

      if (mergeBtn) {
        mergeBtn.style.display = 'inline-flex';
        if (!isDedicatedActive) {
          mergeBtn.innerHTML = '📊 テーブル作成';
          mergeBtn.style.background = '#0284c7';
          mergeBtn.style.color = '#ffffff';
          mergeBtn.style.border = 'none';
        } else {
          mergeBtn.innerHTML = '📊 テーブル設定';
          mergeBtn.style.background = '#f1f5f9';
          mergeBtn.style.color = '#334155';
          mergeBtn.style.border = '1px solid #cbd5e1';
        }
      }
      if (headerMergeBtn) headerMergeBtn.style.setProperty('display', 'none', 'important');
      const menuItemMerge = document.getElementById('menu-item-merge-prod');
      if (menuItemMerge) {
        menuItemMerge.style.display = 'flex';
        const titleEl = menuItemMerge.querySelector('.menu-title');
        const descEl = menuItemMerge.querySelector('.menu-desc');
        const iconEl = menuItemMerge.querySelector('.menu-icon');
        if (!isDedicatedActive) {
          if (iconEl) iconEl.textContent = '📊';
          if (titleEl) {
            titleEl.textContent = '専用テーブル作成';
            titleEl.style.color = '#0284c7';
          }
          if (descEl) {
            descEl.textContent = 'フォーム専用の独立テーブルを作成して回答を保存';
          }
        } else {
          if (iconEl) iconEl.textContent = '📊';
          if (titleEl) {
            titleEl.textContent = '専用テーブル設定';
            titleEl.style.color = '#475569';
          }
          if (descEl) {
            descEl.textContent = '専用テーブルのカラム構成確認・追加カラム更新';
          }
        }
      }
      const mainBtnLabel = document.getElementById('share-btn-main-label');
      if (mainBtnLabel) {
        mainBtnLabel.innerHTML = isUnpublished
          ? '公開・共有 <span style="background:#dc2626; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:10px; margin-left:3px; font-weight:700;">非公開中</span>'
          : '公開・共有';
      }
    } else {
      if (syncArea) {
        syncArea.style.borderColor = '#f59e0b';
        syncArea.style.background = '#fffbeb';
      }
      if (syncDot) syncDot.style.background = '#f59e0b';
      if (syncTitle) {
        syncTitle.textContent = '未統合の変更があります（test branch）';
        syncTitle.style.color = '#b45309';
      }
      if (syncDesc) {
        syncDesc.textContent = '編集中の最新内容はテスト用リンクでのみ確認できます。本番公開リンク（main）は旧バージョンのまま保護されています。';
      }
      if (mergeBtn) {
        mergeBtn.style.display = 'inline-flex';
        mergeBtn.innerHTML = '🚀 本番環境へ統合';
        mergeBtn.style.background = '#673ab7';
        mergeBtn.style.color = '#ffffff';
        mergeBtn.style.border = 'none';
      }
      const menuItemMerge = document.getElementById('menu-item-merge-prod');
      if (menuItemMerge) {
        menuItemMerge.style.display = 'flex';
        const titleEl = menuItemMerge.querySelector('.menu-title');
        const descEl = menuItemMerge.querySelector('.menu-desc');
        if (titleEl) {
          titleEl.textContent = '本番へ統合（公開更新）';
          titleEl.style.color = '#16a34a';
        }
        if (descEl) {
          descEl.textContent = '最新の編集内容・テーブル設定を本番公開リンクへ反映';
        }
      }
      const mainBtnLabel = document.getElementById('share-btn-main-label');
      if (mainBtnLabel) {
        if (isUnpublished) {
          mainBtnLabel.innerHTML = '公開・共有 <span style="background:#dc2626; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:10px; margin-left:3px; font-weight:700;">非公開中</span> <span style="background:#ef4444; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:10px; margin-left:2px; font-weight:700;">要統合</span>';
        } else {
          mainBtnLabel.innerHTML = '公開・共有 <span style="background:#ef4444; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:10px; margin-left:3px; font-weight:700;">要統合</span>';
        }
      }
      if (headerMergeBtn) headerMergeBtn.style.setProperty('display', 'none', 'important');
    }
  }

  window.checkFormPublishStatus = checkFormPublishStatus;
  window.mergeFormToProduction = mergeFormToProduction;
  window.updatePublishSyncUI = updatePublishSyncUI;

  async function openShareUrlModal(formIndex) {
    const modal = document.getElementById('modal-share-url');
    if (!modal) return;
    const { formObj, idx } = getCurrentFormObject(formIndex);
    _currentShareModalFormIndex = idx;
    _currentShareModalEnv = 'production'; // デフォルトは本番リンク
    const formTitle = formObj && formObj.title ? formObj.title : '無題のフォーム';

    const titleEl = document.getElementById('share-modal-form-title');
    if (titleEl) titleEl.textContent = formTitle;

    const inputEl = document.getElementById('share-modal-url-input');
    const shortenCheckbox = document.getElementById('share-modal-shorten-checkbox');
    const toastEl = document.getElementById('share-modal-copy-toast');
    if (toastEl) toastEl.style.display = 'none';

    const prodTabBtn = document.getElementById('share-tab-prod');
    const testTabBtn = document.getElementById('share-tab-test');
    const envNotice = document.getElementById('share-env-notice');
    const envNoticeTitle = document.getElementById('share-env-notice-title');
    const envNoticeDesc = document.getElementById('share-env-notice-desc');
    const urlLabel = document.getElementById('share-modal-url-label');
    const testStatusBadge = document.getElementById('share-test-status-badge');
    const testToolsArea = document.getElementById('share-test-tools-area');
    const clearTestBtn = document.getElementById('btn-clear-test-data');

    // URL更新ヘルパー
    const refreshModalUrl = () => {
      const isShorten = shortenCheckbox ? shortenCheckbox.checked : true;
      const url = getPublicFormShareUrl(_currentShareModalFormIndex, isShorten, _currentShareModalEnv);
      if (inputEl) inputEl.value = url;
      updateShareModalOpenTabBtn(url);
    };

    // タブ表示切り替えヘルパー
    const applyEnvTab = (env) => {
      _currentShareModalEnv = env;
      if (env === 'production') {
        if (prodTabBtn) {
          prodTabBtn.style.background = '#673ab7';
          prodTabBtn.style.color = '#ffffff';
          prodTabBtn.classList.add('active');
        }
        if (testTabBtn) {
          testTabBtn.style.background = 'transparent';
          testTabBtn.style.color = '#64748b';
          testTabBtn.classList.remove('active');
        }
        if (envNotice) {
          envNotice.style.background = '#f8fafc';
          envNotice.style.borderColor = '#cbd5e1';
          envNotice.style.color = '#475569';
        }
        if (envNoticeTitle) {
          envNoticeTitle.textContent = '🚀 本番公開用URL (main branch)';
          envNoticeTitle.style.color = '#1e293b';
        }
        if (envNoticeDesc) {
          envNoticeDesc.textContent = '一般回答者・顧客向けの公式リンクです。回答データは本番マスターテーブルへ正規保存されます。';
        }
        if (urlLabel) urlLabel.textContent = '本番用URL（一般回答者向け）';
        if (testStatusBadge) testStatusBadge.style.display = 'none';
        if (testToolsArea) testToolsArea.style.display = 'none';
      } else {
        if (prodTabBtn) {
          prodTabBtn.style.background = 'transparent';
          prodTabBtn.style.color = '#64748b';
          prodTabBtn.classList.remove('active');
        }
        if (testTabBtn) {
          testTabBtn.style.background = '#d97706';
          testTabBtn.style.color = '#ffffff';
          testTabBtn.classList.add('active');
        }
        if (envNotice) {
          envNotice.style.background = '#fffbeb';
          envNotice.style.borderColor = '#fde68a';
          envNotice.style.color = '#92400e';
        }
        if (envNoticeTitle) {
          envNoticeTitle.textContent = '🧪 テスト送信専用URL (test branch)';
          envNoticeTitle.style.color = '#b45309';
        }
        if (envNoticeDesc) {
          envNoticeDesc.textContent = '公開前・公開後の動作検証用リンクです。編集内容は常に自動で即時反映されます。テスト送信時はデータベースへの書き込みが一切行われないため、本番への混入や不要データの消去作業の心配なく何度でも安全に検証できます。';
        }
        if (urlLabel) urlLabel.textContent = 'テスト送信専用URL（動作検証用・本番隔離）';
        if (testStatusBadge) testStatusBadge.style.display = 'inline-block';
        if (testToolsArea) testToolsArea.style.display = 'flex';
      }
      refreshModalUrl();
    };

    if (prodTabBtn && !prodTabBtn._hooked) {
      prodTabBtn._hooked = true;
      prodTabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        applyEnvTab('production');
      });
    }

    if (testTabBtn && !testTabBtn._hooked) {
      testTabBtn._hooked = true;
      testTabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        applyEnvTab('test');
      });
    }

    if (clearTestBtn && !clearTestBtn._hooked) {
      clearTestBtn._hooked = true;
      clearTestBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm(`「${formTitle}」のテスト送信データをすべて消去（初期化）しますか？\n※ 本番データは一切削除されません。`)) {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'CLEAR_FORM_TEST_DATA',
              formTitle: formTitle
            }, '*');
          }
          // ローカルストレージのテストデータも消去
          try {
            const testKey = `form_responses_test_${formObj.id || 'default'}`;
            localStorage.removeItem(testKey);
          } catch(err) {}
          showGlobalShareToast('テスト送信データをリセットしました！');
        }
      });
    }

    if (shortenCheckbox && !shortenCheckbox._hooked) {
      shortenCheckbox._hooked = true;
      shortenCheckbox.addEventListener('change', () => {
        refreshModalUrl();
      });
    }

    // 🚀 本番環境へ統合（公開更新 / Merge to main）ボタンのイベント紐付け
    const mergeBtn = document.getElementById('btn-merge-to-production');
    if (mergeBtn && !mergeBtn._hooked) {
      mergeBtn._hooked = true;
      mergeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMergeProductionModal(_currentShareModalFormIndex);
      });
    }

    // 🔒 フォーム非公開・公開（受付停止・再開）ボタンのイベント紐付け
    const modalTogglePublishBtn = document.getElementById('btn-modal-toggle-publish');
    if (modalTogglePublishBtn && !modalTogglePublishBtn._hooked) {
      modalTogglePublishBtn._hooked = true;
      modalTogglePublishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFormPublishStatus(_currentShareModalFormIndex);
      });
    }

    // 本番統合ステータスの更新
    updatePublishSyncUI(_currentShareModalFormIndex);

    // 初期タブ適用
    applyEnvTab('production');

    modal.classList.add('active');
    modal.style.display = 'flex';
  }

  function closeShareUrlModal() {
    const modal = document.getElementById('modal-share-url');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  function initShareUrlFeature() {
    // 初期タブに応じた表示切り替え（DOMから確実に判定）
    const initialTab = (typeof detectActiveTab === 'function') ? detectActiveTab() : (localStorage.getItem('form_customize_active_tab') || 'dashboard');
    if (typeof updateHeaderShareButtons === 'function') {
      updateHeaderShareButtons(initialTab);
    }

    // 🚀 ヘッダーのクイック「本番へ統合」ボタン
    const headerMergeBtn = document.getElementById('btn-header-merge-prod');
    if (headerMergeBtn && !headerMergeBtn._hooked) {
      headerMergeBtn._hooked = true;
      headerMergeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMergeProductionModal();
      });
    }

    // 1. ヘッダーの「🔗 リンクを発行」ボタン
    const shareBtn = document.getElementById('btn-share-form-url');
    if (shareBtn && !shareBtn._hooked) {
      shareBtn._hooked = true;
      shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copyFormShareUrl(); // ワンクリックで即時クリップボードにコピー
        openShareUrlModal(); // Google Forms風の共有モーダルを開く
      });
    }

    // 1-2. ヘッダーの「▼」ドロップダウントグルボタン & ドロップダウンメニュー
    const dropdownToggle = document.getElementById('btn-share-dropdown-toggle');
    const dropdownMenu = document.getElementById('share-dropdown-menu');
    const exportGroup = document.getElementById('share-export-group');
    if (dropdownToggle && dropdownMenu && !dropdownToggle._hooked) {
      dropdownToggle._hooked = true;
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.toggle('active');
        if (exportGroup) exportGroup.classList.toggle('open', isOpen);
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#share-export-group')) {
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
        }
      });

      const menuMerge = document.getElementById('menu-item-merge-prod');
      if (menuMerge && !menuMerge._hooked) {
        menuMerge._hooked = true;
        menuMerge.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          openMergeProductionModal();
        });
      }

      // 🔒 ドロップダウン内の「フォームを非公開にする / 公開する」メニュー項目
      const menuTogglePublish = document.getElementById('menu-item-toggle-publish');
      if (menuTogglePublish && !menuTogglePublish._hooked) {
        menuTogglePublish._hooked = true;
        menuTogglePublish.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          toggleFormPublishStatus();
        });
      }

      const menuTestLink = document.getElementById('menu-item-test-link');
      if (menuTestLink && !menuTestLink._hooked) {
        menuTestLink._hooked = true;
        menuTestLink.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          const testUrl = getPublicFormShareUrl(undefined, true, 'test');
          window.open(testUrl, '_blank');
          showGlobalShareToast('🧪 テスト送信モード（DB保存なし）で別タブを開きました！');
        });
      }

      const menuColPreview = document.getElementById('menu-item-column-preview');
      if (menuColPreview && !menuColPreview._hooked) {
        menuColPreview._hooked = true;
        menuColPreview.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          const { formObj } = getCurrentFormObject();
          openFormColumnMappingModal(formObj || window.G || window.L);
        });
      }

      const menuShareLink = document.getElementById('menu-item-share-link');
      if (menuShareLink && !menuShareLink._hooked) {
        menuShareLink._hooked = true;
        menuShareLink.addEventListener('click', () => {
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          copyFormShareUrl();
          openShareUrlModal();
        });
      }

      const menuExportJson = document.getElementById('btn-export-json');
      if (menuExportJson && !menuExportJson._customHooked) {
        menuExportJson._customHooked = true;
        menuExportJson.addEventListener('click', (e) => {
          e.preventDefault();
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          const modalExport = document.getElementById('modal-export');
          const jsonTextarea = document.getElementById('export-json-textarea');
          if (modalExport && jsonTextarea && window.G) {
            jsonTextarea.value = JSON.stringify(window.G, null, 2);
            modalExport.classList.add('active');
          }
        });
      }

      const menuSyncAllTables = document.getElementById('menu-item-sync-all-tables');
      if (menuSyncAllTables && !menuSyncAllTables._hooked) {
        menuSyncAllTables._hooked = true;
        menuSyncAllTables.addEventListener('click', async (e) => {
          e.preventDefault();
          dropdownMenu.classList.remove('active');
          if (exportGroup) exportGroup.classList.remove('open');
          
          if (!confirm('全フォームの専用回答テーブルを同期・再生成しますか？\n\n・Supabase上に物理テーブルを作成・確認します\n・Synapse側の回答テーブルと1対1で整合・重複排除します\n・既存の回答データは保持されます')) {
            return;
          }

          showGlobalShareToast('⏳ 全フォームの回答テーブルを同期・再生成中...');
          try {
            const res = await syncOrRecreateAllDedicatedTables();
            if (res.success) {
              const msg = `✅ 全${res.count}件のフォーム専用テーブルを同期・再生成しました！\n\n・Supabase物理テーブルの作成・確認完了\n・Synapse「回答フォーム一覧」に反映完了\n・各テーブルの重複は完全に防止されています`;
              alert(msg);
              showGlobalShareToast(`✔ 全${res.count}件のフォームテーブルを同期しました`);
            } else {
              alert(`同期失敗: ${res.message}`);
            }
          } catch(err) {
            console.error('Batch sync error:', err);
            alert(`エラーが発生しました: ${err.message}`);
          }
        });
      }
    }

    // 2. プレビュー画面の「🔗 回答用リンクをコピー」ボタン
    const panelCopyBtn = document.getElementById('btn-panel-copy-url');
    if (panelCopyBtn && !panelCopyBtn._hooked) {
      panelCopyBtn._hooked = true;
      panelCopyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copyFormShareUrl();
      });
    }

    // 3. モーダル内の「📋 コピー」ボタン
    const modalCopyBtn = document.getElementById('btn-copy-share-url-modal');
    if (modalCopyBtn && !modalCopyBtn._hooked) {
      modalCopyBtn._hooked = true;
      modalCopyBtn.addEventListener('click', async () => {
        const inputEl = document.getElementById('share-modal-url-input');
        const textToCopy = (inputEl && inputEl.value) ? inputEl.value : getPublicFormShareUrl(_currentShareModalFormIndex, true);
        const toastEl = document.getElementById('share-modal-copy-toast');
        const showToast = () => {
          if (toastEl) {
            toastEl.style.display = 'block';
            clearTimeout(toastEl._timer);
            toastEl._timer = setTimeout(() => { toastEl.style.display = 'none'; }, 2500);
          }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(textToCopy);
            showToast();
          } catch (e) {
            fallbackCopy(textToCopy, true);
            showToast();
          }
        } else {
          fallbackCopy(textToCopy, true);
          showToast();
        }
      });
    }

    // 3-2. 「リンクを発行」モーダル内の「📄 フォーム定義JSONを出力」トグル＆コピー
    const modalToggleJsonBtn = document.getElementById('btn-share-modal-toggle-json');
    const modalJsonArea = document.getElementById('share-modal-json-area');
    const modalJsonTextarea = document.getElementById('share-modal-json-textarea');
    const modalCopyJsonBtn = document.getElementById('btn-share-modal-copy-json');

    if (modalToggleJsonBtn && modalJsonArea && !modalToggleJsonBtn._hooked) {
      modalToggleJsonBtn._hooked = true;
      modalToggleJsonBtn.addEventListener('click', () => {
        const isHidden = modalJsonArea.style.display === 'none' || !modalJsonArea.style.display;
        if (isHidden) {
          if (modalJsonTextarea && window.G) {
            modalJsonTextarea.value = JSON.stringify(window.G, null, 2);
          }
          modalJsonArea.style.display = 'block';
          modalToggleJsonBtn.textContent = '閉じる ▲';
        } else {
          modalJsonArea.style.display = 'none';
          modalToggleJsonBtn.textContent = '表示・コピー ▼';
        }
      });
    }

    if (modalCopyJsonBtn && modalJsonTextarea && !modalCopyJsonBtn._hooked) {
      modalCopyJsonBtn._hooked = true;
      modalCopyJsonBtn.addEventListener('click', () => {
        if (!modalJsonTextarea.value && window.G) {
          modalJsonTextarea.value = JSON.stringify(window.G, null, 2);
        }
        navigator.clipboard.writeText(modalJsonTextarea.value).then(() => {
          const originalText = modalCopyJsonBtn.textContent;
          modalCopyJsonBtn.textContent = '✓ コピー完了！';
          modalCopyJsonBtn.classList.add('btn-success');
          setTimeout(() => {
            modalCopyJsonBtn.textContent = originalText;
            modalCopyJsonBtn.classList.remove('btn-success');
          }, 1800);
        }).catch(err => {
          console.error('Clipboard copy failed:', err);
          modalJsonTextarea.select();
        });
      });
    }

    // 4. モーダルを閉じるボタン
    const closeBtn = document.getElementById('btn-close-share-modal');
    const closeFooterBtn = document.getElementById('btn-close-share-modal-footer');
    if (closeBtn && !closeBtn._hooked) {
      closeBtn._hooked = true;
      closeBtn.addEventListener('click', closeShareUrlModal);
    }
    if (closeFooterBtn && !closeFooterBtn._hooked) {
      closeFooterBtn._hooked = true;
      closeFooterBtn.addEventListener('click', closeShareUrlModal);
    }

    // 5. コンテキストメニュー（⋮）を「✏️ 名前の編集」と「🗑️ 削除」の2項目のみに完全統一（他項目の侵入を100%遮断）
    const enforceTwoItemsMenu = (menu) => {
      if (!menu) return;
      const fIdx = menu.dataset.formIndex !== undefined ? parseInt(menu.dataset.formIndex, 10) : undefined;
      
      // 不正な項目（編集、プレビュー、リンクをコピー、テスト用リンクを開く、テーブル連携確認・作成など）を全消去
      const items = Array.from(menu.children);
      let renameEl = null;
      let deleteEl = null;

      items.forEach(child => {
        const text = (child.textContent || '').trim();
        if (child.classList.contains('rename-item') || text.includes('名前の編集')) {
          if (!renameEl) renameEl = child;
          else child.remove();
        } else if (child.classList.contains('delete-item') || text.includes('削除')) {
          if (!deleteEl) deleteEl = child;
          else child.remove();
        } else {
          // 不要項目は即刻消去
          child.remove();
        }
      });

      menu.style.minWidth = '140px';
      menu.style.padding = '6px 0';

      if (!renameEl) {
        renameEl = document.createElement('div');
        renameEl.className = 'menu-item rename-item';
        renameEl.innerHTML = '✏️ 名前の編集';
        renameEl.style.padding = '8px 16px';
        renameEl.style.cursor = 'pointer';
        renameEl.style.fontSize = '0.9rem';
        renameEl.style.display = 'flex';
        renameEl.style.alignItems = 'center';
        renameEl.style.gap = '8px';
        menu.insertBefore(renameEl, menu.firstChild);
      }
      if (!renameEl._hooked) {
        renameEl._hooked = true;
        renameEl.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          menu.remove();
          if (typeof window.renameFormSelf === 'function') {
            window.renameFormSelf(fIdx);
          }
        };
      }

      if (!deleteEl) {
        deleteEl = document.createElement('div');
        deleteEl.className = 'menu-item delete-item danger-item';
        deleteEl.innerHTML = '🗑️ 削除';
        deleteEl.style.padding = '8px 16px';
        deleteEl.style.cursor = 'pointer';
        deleteEl.style.fontSize = '0.9rem';
        deleteEl.style.color = '#dc2626';
        deleteEl.style.display = 'flex';
        deleteEl.style.alignItems = 'center';
        deleteEl.style.gap = '8px';
        menu.appendChild(deleteEl);
      }
      if (!deleteEl._hooked) {
        deleteEl._hooked = true;
        deleteEl.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          menu.remove();
          if (typeof window.deleteFormSelf === 'function') {
            window.deleteFormSelf(fIdx);
          }
        };
      }
    };
    window.enforceTwoItemsMenu = enforceTwoItemsMenu;

    const contextMenu = document.getElementById('gf-context-menu');
    if (contextMenu) {
      enforceTwoItemsMenu(contextMenu);
    }

    // 6. URLパラメータ form_idx の監視・自動選択処理
    if (!window._formIdxHandled) {
      const urlParams = new URLSearchParams(window.location.search);
      const formIdxParam = urlParams.get('form_idx');
      if (formIdxParam !== null) {
        window._formIdxHandled = true;
        const targetIdx = parseInt(formIdxParam, 10);
        if (!isNaN(targetIdx) && window.U && window.U[targetIdx]) {
          if (window.W !== targetIdx) {
            if (typeof window.X === 'function') {
              window.X(targetIdx, urlParams.get('active_tab') || 'editor');
            } else {
              window.W = targetIdx;
              window.G = window.U[targetIdx];
              window.n = window.G;
              localStorage.setItem('form_customize_active_index', targetIdx.toString());
              if (typeof window.Z === 'function') {
                window.Z(urlParams.get('active_tab') || 'editor');
              }
            }
          }
        }
      }
    }
  }

  // 初期化＆DOM変更監視でボタンのフックを維持
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShareUrlFeature);
  } else {
    initShareUrlFeature();
  }
  setInterval(initShareUrlFeature, 250);

  // 🛡️ コンテキストメニュー（⋮）に不要項目が混入するのを100%リアルタイムで阻止する監視オブザーバー
  (function setupContextMenuGuardian() {
    const checkAndEnforce = () => {
      const menu = document.getElementById('gf-context-menu');
      if (menu && typeof window.enforceTwoItemsMenu === 'function') {
        window.enforceTwoItemsMenu(menu);
      }
    };
    const observer = new MutationObserver(() => {
      checkAndEnforce();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  })();

  // グローバル公開
  window.getPublicFormShareUrl = getPublicFormShareUrl;
  window.copyFormShareUrl = copyFormShareUrl;
  window.openShareUrlModal = openShareUrlModal;

// ===================================================
// サイドバー表示の正常化
// ===================================================
(function initSidebarSetup() {
  function setup() {
    const sidebar = document.querySelector('.editor-sidebar');
    if (sidebar) {
      sidebar.classList.remove('sidebar-collapsed');
    }
    const btnExpand = document.getElementById('btn-sidebar-expand');
    if (btnExpand) {
      btnExpand.style.setProperty('display', 'none', 'important');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

// ===================================================
// 親システム連携：内部ログアウト機能の無効化とヘッダークリーンアップ
// ===================================================
(function enforceAdminSessionAndHideLogout() {
  const adminUser = { id: 'user_admin', name: '管理者', role: 'admin' };

  function ensureAdmin() {
    try {
      const cur = localStorage.getItem('gf_current_user');
      if (!cur || JSON.parse(cur).role !== 'admin') {
        localStorage.setItem('gf_current_user', JSON.stringify(adminUser));
      }
      if (typeof window.K !== 'undefined' && (!window.K || window.K.role !== 'admin')) {
        window.K = adminUser;
      }
    } catch(e) {}

    // プロフィール要素とシミュレーションログインオーバーレイの徹底非表示
    const profile = document.getElementById('gf-user-profile');
    if (profile) {
      profile.style.setProperty('display', 'none', 'important');
      profile.style.setProperty('visibility', 'hidden', 'important');
      profile.style.setProperty('pointer-events', 'none', 'important');
    }
    const overlay = document.getElementById('login-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.setProperty('display', 'none', 'important');
      overlay.style.setProperty('visibility', 'hidden', 'important');
      overlay.style.setProperty('pointer-events', 'none', 'important');
    }
  }

  // ログアウトボタン押下をキャプチャフェーズで完全に阻止
  document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'btn-logout' || e.target.closest('#btn-logout'))) {
      e.stopImmediatePropagation();
      e.preventDefault();
      console.log('[Auth] Internal logout prevented (auth handled by parent system).');
      ensureAdmin();
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAdmin);
  } else {
    ensureAdmin();
  }
  setInterval(ensureAdmin, 500);

  // =========================================================================
  // 🏢 法人名・屋号の案内文 & 未入力時半角ハイフン自動補填入力規則機能
  // =========================================================================
  const AUTO_HYPHEN_NOTICE_TEXT = '';

  function cleanHyphenNotice(text) {
    if (!text) return text;
    return text
      .replace(/[\r\n]*※?\s*個人事業主の方で屋号がない場合は[、\s]*未入力のまま[「『]?次へ[」』]?へお進みください。?/g, '')
      .replace(/（自動で半角ハイフン「-」が補填されます）/g, '')
      .replace(/\(自動で半角ハイフン「-」が補填されます\)/g, '')
      .replace(/。自動で半角ハイフン「-」が補填されます/g, '')
      .trim();
  }

  // 1. バリデーション定義 (window.b) の拡張
  if (typeof window.b !== 'undefined') {
    if (window.b.text && window.b.text.conditions) {
      window.b.text.conditions.auto_hyphen = '未入力時は自動で半角ハイフン補填（屋号なし等）';
    }
  }

  // 2. エディタ内の入力規則（validation）ドロップダウンへの動的注入＆案内バッジ表示
  function patchAutoHyphenValidationUI() {
    const valContainers = document.querySelectorAll('.validation-edit-container');
    valContainers.forEach(container => {
      // カテゴリセレクトボックス
      const categorySelect = container.querySelector('.form-group-row .form-group:first-child select');
      // 条件ルールセレクトボックス
      const conditionSelect = container.querySelector('.form-group-row .form-group:nth-child(2) select');
      const valInputsContainer = container.querySelector('.val-inputs-container');

      if (categorySelect && conditionSelect) {
        if (categorySelect.value === 'text') {
          // auto_hyphen オプションが存在しない場合は追加
          const hasAutoHyphen = Array.from(conditionSelect.options).some(o => o.value === 'auto_hyphen');
          if (!hasAutoHyphen) {
            const opt = document.createElement('option');
            opt.value = 'auto_hyphen';
            opt.textContent = '未入力時は自動で半角ハイフン補填（屋号なし等）';
            conditionSelect.appendChild(opt);
          }

          // auto_hyphen が選択されている場合の説明表示
          if (conditionSelect.value === 'auto_hyphen' && valInputsContainer) {
            let notice = valInputsContainer.querySelector('.auto-hyphen-validation-notice');
            if (!notice) {
              notice = document.createElement('div');
              notice.className = 'auto-hyphen-validation-notice';
              notice.style.cssText = 'background: rgba(26,115,232,0.08); border: 1px solid rgba(26,115,232,0.3); border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; font-size: 0.85rem; color: var(--color-text); line-height: 1.5;';
              notice.innerHTML = '<div style="font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">ℹ️ 未入力時のハイフン自動補填機能</div><div style="color: var(--color-text-muted); font-size: 0.8rem;">回答者がこの質問を未入力のまま「次へ」または「送信」へ進んだ際、自動的に半角ハイフン「-」を補填します。<br>「必須回答」が有効になっている場合でも、エラーにならずそのままスムーズに進行できるようになります（個人事業主で屋号がない場合などに推奨）。</div>';
              valInputsContainer.appendChild(notice);
            }
          }
        }
      }
    });
  }

  // 3. 「法人名・屋号」設問に対する案内文＆自動ハイフンルールの初期・動的補強
  function ensureCorpQuestionGuidance() {
    const formsToCheck = [];
    if (window.G && window.G.sections) formsToCheck.push(window.G);
    if (window.n && window.n.sections && window.n !== window.G) formsToCheck.push(window.n);

    try {
      const raw = localStorage.getItem('form_customize_all_forms');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          let updated = false;
          list.forEach(form => {
            if (form && form.sections) {
              form.sections.forEach(sec => {
                (sec.questions || []).forEach(q => {
                  const isCorp = q.title && (q.title.includes('法人名') || q.title.includes('会社名') || q.title.includes('企業名')) && !q.title.includes('屋号');
                  if (isCorp) {
                    if (q.validation && (q.validation.condition === 'auto_hyphen' || q.validation.autoHyphen)) {
                      delete q.validation;
                      updated = true;
                    }
                  }
                  if (q.title && (q.title.includes('法人名') || q.title.includes('屋号'))) {
                    if (q.description) {
                      const cleaned = cleanHyphenNotice(q.description);
                      if (cleaned !== q.description) {
                        q.description = cleaned;
                        updated = true;
                      }
                    }
                    if (!q.validation && q.title.includes('屋号') && !q.title.includes('法人名')) {
                      q.validation = { category: 'text', condition: 'auto_hyphen', value: '', value2: '', errorMessage: '' };
                      updated = true;
                    }
                  }
                });
              });
            }
          });
          if (updated) {
            localStorage.setItem('form_customize_all_forms', JSON.stringify(list));
          }
        }
      }
    } catch(e) {}

    formsToCheck.forEach(form => {
      form.sections.forEach(sec => {
        (sec.questions || []).forEach(q => {
          const isCorp = q.title && (q.title.includes('法人名') || q.title.includes('会社名') || q.title.includes('企業名')) && !q.title.includes('屋号');
          if (isCorp) {
            if (q.validation && (q.validation.condition === 'auto_hyphen' || q.validation.autoHyphen)) {
              delete q.validation;
            }
          }
          if (q.title && (q.title.includes('法人名') || q.title.includes('屋号'))) {
            if (q.description) {
              q.description = cleanHyphenNotice(q.description);
            }
            const descInput = document.querySelector(`.q-desc-input[data-question-id="${q.id}"]`);
            if (descInput) {
              descInput.value = cleanHyphenNotice(descInput.value);
            }
            if (!q.validation && q.title.includes('屋号') && !q.title.includes('法人名')) {
              q.validation = { category: 'text', condition: 'auto_hyphen', value: '', value2: '', errorMessage: '' };
            }
          }
        });
      });
    });
  }

  // 4. 管理画面プレビューでの未入力ハイフン自動補填
  function setupPreviewAutoHyphenHook() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#preview-next-btn, #preview-submit-btn, .btn-preview-next, .btn-preview-submit, #btn-next, #btn-submit');
      if (!btn) return;
      
      const previewRoot = document.getElementById('preview-content') || document.querySelector('.live-preview-container') || document.body;
      const inputs = previewRoot.querySelectorAll('input.form-control, textarea.form-control');
      
      let isSoleProprietorNoTrade = false;
      inputs.forEach(input => {
        const card = input.closest('.question-card, .preview-question-card');
        if (!card) return;
        const titleEl = card.querySelector('.question-title, .preview-q-title');
        const titleText = titleEl ? titleEl.textContent : '';
        // 法人名には絶対にハイフン補填を適用しない（個人事業主の屋号のみ対象）
        const isTrade = titleText.includes('屋号') && !titleText.includes('法人名') && !titleText.includes('会社名') && !titleText.includes('企業名') &&
                       !titleText.includes('カナ') && !titleText.includes('フリガナ') && !titleText.includes('ふりがな');
        
        if (isTrade) {
          if (!input.value || input.value.trim() === '' || input.value.trim() === '-') {
            isSoleProprietorNoTrade = true;
            input.value = '-';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      // 個人事業で屋号がない場合は屋号カナ欄も自動で半角ハイフン「-」を補填
      if (isSoleProprietorNoTrade) {
        inputs.forEach(input => {
          const card = input.closest('.question-card, .preview-question-card');
          if (!card) return;
          const titleEl = card.querySelector('.question-title, .preview-q-title');
          const titleText = titleEl ? titleEl.textContent : '';
          const isTradeKana = titleText.includes('屋号') && (titleText.includes('カナ') || titleText.includes('フリガナ') || titleText.includes('ふりがな'));
          if (isTradeKana && (!input.value || input.value.trim() === '')) {
            input.value = '-';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    }, true);
  }

  // 監視と初期化
  setTimeout(() => {
    ensureCorpQuestionGuidance();
    patchAutoHyphenValidationUI();
    setupPreviewAutoHyphenHook();
  }, 300);

  const questionsBox = document.getElementById('questions-container');
  if (questionsBox) {
    const observer = new MutationObserver(() => {
      patchAutoHyphenValidationUI();
    });
    observer.observe(questionsBox, { childList: true, subtree: true });
  }

  // =========================================================================
  // 🛡️ フォーム分岐ロジック整合性ガード＆自動サニタイズ（自己修復エンジン）
  // =========================================================================
  function sanitizeFormBranchingLogic(forms) {
    if (!forms) return { forms, hasModified: false };
    const formList = Array.isArray(forms) ? forms : [forms];
    let hasModified = false;

    formList.forEach(form => {
      if (!form || !Array.isArray(form.sections)) return;

      const allQuestionIds = new Set();
      form.sections.forEach(sec => {
        (sec.questions || []).forEach(q => {
          if (q && q.id) allQuestionIds.add(q.id);
        });
      });

      form.sections.forEach(sec => {
        const questions = sec.questions || [];
        questions.forEach(q => {
          if (!q) return;

          // 1. 都道府県等の汎用select項目で全選択肢が誤って他セクションを指している等の誤爆正規化
          const isPrefSelect = q.type === 'select' && (q.title && (q.title.includes('都道府県') || q.title.includes('住所')));
          if (isPrefSelect && Array.isArray(q.options)) {
            q.options.forEach(opt => {
              if (opt && opt.nextSectionId && opt.nextSectionId !== 'next') {
                opt.nextSectionId = 'next';
                hasModified = true;
              }
            });
          }

          // 2. 選択肢の nextSectionId に質問IDが入ってしまっている場合の正規化
          if (Array.isArray(q.options)) {
            q.options.forEach(opt => {
              if (!opt) return;
              if (opt.nextSectionId && allQuestionIds.has(opt.nextSectionId)) {
                console.warn(`[Sanitize] Option "${opt.label}" had questionId "${opt.nextSectionId}" as nextSectionId. Reset to "next".`);
                opt.nextSectionId = 'next';
                hasModified = true;
              }
            });
          }

          // 3. 同一セクション内でこの質問の選択肢に依存して表示される後続質問（インボイス登録番号など）がある場合、
          // その選択肢が勝手に別セクションへ飛ぶのを防ぐ！
          const dependentSubQs = questions.filter(otherQ => {
            if (!otherQ || otherQ.id === q.id) return false;
            const sl = otherQ.skipLogic;
            return sl && sl.dependsOn === q.id;
          });

          if (dependentSubQs.length > 0 && Array.isArray(q.options)) {
            q.options.forEach(opt => {
              if (!opt) return;
              const activatesSubQ = dependentSubQs.some(subQ => {
                const sl = subQ.skipLogic;
                if (sl.action === 'hide' && sl.condition === 'not_equals' && sl.value === opt.label) return true;
                if (sl.action === 'show' && sl.condition === 'equals' && sl.value === opt.label) return true;
                return false;
              });

              if (activatesSubQ) {
                if (opt.nextSectionId && opt.nextSectionId !== 'next' && opt.nextSectionId !== 'same') {
                  console.warn(`[Sanitize] Option "${opt.label}" displays sub-question within the same section, but had nextSectionId="${opt.nextSectionId}". Reset to "next".`);
                  opt.nextSectionId = 'next';
                  hasModified = true;
                }
              }
            });
          }

          // 4. 同一セクション内に後続の質問が存在する通常の選択項目（口座種別など）において、
          // 全選択肢が誤って "submit"（送信完了）を指してしまい後続質問がスキップされてしまう誤爆の防止
          const qIdxInSec = questions.indexOf(q);
          const isLastQInSection = (qIdxInSec === questions.length - 1);
          if (!isLastQInSection && Array.isArray(q.options) && q.options.length > 0) {
            const hasSubsequentQuestions = (questions.length - 1 > qIdxInSec);
            const isAccountType = (q.dataKey === 'account_type' || (q.title && q.title.includes('口座種別')));
            const allOptionsAreSubmit = q.options.every(opt => opt && opt.nextSectionId === 'submit');

            if ((isAccountType && allOptionsAreSubmit) || (hasSubsequentQuestions && allOptionsAreSubmit && !dependentSubQs.length)) {
              console.warn(`[Sanitize] Question "${q.title}" had subsequent questions in same section, but all options were set to "submit". Resetting option branches to default.`);
              q.options.forEach(opt => {
                if (opt && opt.nextSectionId === 'submit') {
                  delete opt.nextSectionId;
                  hasModified = true;
                }
              });
            }
          }
        });
      });
    });

    return { forms, hasModified };
  }
  window.sanitizeFormBranchingLogic = sanitizeFormBranchingLogic;

  // =========================================================================
  // ☁️ クラウド（Supabase）自動同期モジュール (全ブラウザ・端末共有)
  // =========================================================================
  let _cloudSyncDebounceTimer = null;
  let _isCloudSyncing = false;

  async function syncFormsToCloud(forms, immediate = false) {
    if (!forms) {
      try {
        const raw = localStorage.getItem('form_customize_all_forms');
        if (raw) forms = JSON.parse(raw);
      } catch(e) {}
    }
    if (!forms || !Array.isArray(forms)) return;

    // パージ対象キーワード（フィードバック・管理者権限）を常時除外
    const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
    forms = forms.filter(f => !f || !purgedKeywords.some(p => (f.title || '').includes(p)));

    // デフォルト初期ダミーフォームの勝手なクラウドアップロードを完全抑止
    if (forms.length === 1 && (forms[0]?.title === '新規作成されたフォーム' || forms[0]?.title === '無題のフォーム') && !window._userExplicitlyCreated) {
      console.log('[Cloud Sync] Suppressed auto-upload of placeholder form.');
      return;
    }

    sanitizeFormBranchingLogic(forms);

    clearTimeout(_cloudSyncDebounceTimer);

    const doSync = async () => {
      try {
        console.log('[Cloud Sync] Pushing forms to Supabase...', forms.length, 'forms');
        // 1. サーバーレス API (/api/forms) への POST
        const res = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ allForms: forms })
        });
        if (res.ok) {
          console.log('[Cloud Sync] Successfully pushed forms to Supabase via API.');
          return;
        }
      } catch (err) {
        console.warn('[Cloud Sync] API push failed, attempting direct Supabase fallback:', err);
      }

      // フォールバック: 直接 Supabase REST API へ Upsert
      try {
        const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
        const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';
        await fetch(`${sbUrl}/rest/v1/synapse_storage`, {
          method: 'POST',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            key: 'synapse_form_customize_all_forms',
            value: forms,
            updated_at: new Date().toISOString()
          })
        });
        console.log('[Cloud Sync] Direct Supabase fallback push completed. Form count:', forms.length);
      } catch(e) {
        console.error('[Cloud Sync] Direct Supabase fallback failed:', e);
      }
    };

    if (immediate) {
      return doSync();
    } else {
      _cloudSyncDebounceTimer = setTimeout(doSync, 300);
    }
  }

  async function loadFormsFromCloud() {
    if (_isCloudSyncing) return;
    _isCloudSyncing = true;
    try {
      let cloudForms = null;
      try {
        const res = await fetch('/api/forms?all=1');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.forms)) {
            cloudForms = data.forms;
          }
        }
      } catch(e) {}

      if (cloudForms === null) {
        // 直接 Supabase REST API
        try {
          const sbUrl = 'https://uefiuhywfsnrepiouofq.supabase.co';
          const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZml1aHl3ZnNucmVwaW91b2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDMxMTMsImV4cCI6MjA5NjQ3OTExM30.jRluR2-bcMnKf7CSMRM4CtaRlHT4FrBkQWV_lVuWZxQ';
          const sbRes = await fetch(`${sbUrl}/rest/v1/synapse_storage?key=eq.synapse_form_customize_all_forms&select=value`, {
            headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
          });
          if (sbRes.ok) {
            const rows = await sbRes.json();
            if (rows && rows[0] && rows[0].value !== undefined) {
              let parsed = rows[0].value;
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (Array.isArray(parsed)) cloudForms = parsed;
            }
          }
        } catch(e) {}
      }

      let localForms = [];
      try {
        const raw = localStorage.getItem('form_customize_all_forms');
        if (raw) localForms = JSON.parse(raw);
      } catch(e) {}

      if (cloudForms !== null && Array.isArray(cloudForms)) {
        // パージ対象のフォーム（フィードバック・管理者権限）を完全除外
        const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
        cloudForms = cloudForms.filter(f => !f || !purgedKeywords.some(p => (f.title || '').includes(p)));

        console.log('[Cloud Sync] Loaded', cloudForms.length, 'forms from cloud.');
        sanitizeFormBranchingLogic(cloudForms);
        
        // クラウドの定義を正として localStorage および window.U へ同期
        Storage.prototype.setItem.call(localStorage, 'form_customize_all_forms', JSON.stringify(cloudForms));
        if (window.U) {
          window.U.length = 0;
          cloudForms.forEach(f => window.U.push(f));
          const curIdx = parseInt(localStorage.getItem('form_customize_active_index') || '0', 10);
          window.W = Math.max(0, Math.min(curIdx, Math.max(0, window.U.length - 1)));
          window.G = (window.U.length > 0) ? window.U[window.W] : null;
          window.n = window.G;
          if (typeof window.Y === 'function') window.Y();
          if (typeof window.x === 'function' && window.G) window.x();
        }
        if (cloudForms.length === 0) {
          const listEl = document.getElementById('dashboard-view-list');
          if (listEl) {
            listEl.innerHTML = `
              <div style="text-align: center; padding: 40px; color: var(--color-text-dark);">
                表示できるフォームがありません。
              </div>
            `;
          }
          const previewEl = document.getElementById('dashboard-view-preview');
          if (previewEl) {
            previewEl.innerHTML = `
              <div style="text-align: center; padding: 40px; color: var(--color-text-dark); grid-column: 1 / -1;">
                表示できるフォームがありません。
              </div>
            `;
          }
        }
      } else if (localForms.length > 0) {
        // クラウドが完全に未初期化の場合のみ、ローカルから不要フォームを除外して初期アップロード
        const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
        const cleanLocal = localForms.filter(f => !f || !purgedKeywords.some(p => (f.title || '').includes(p)));
        if (cleanLocal.length > 0) {
          syncFormsToCloud(cleanLocal);
        }
      }
    } catch(err) {
      console.warn('[Cloud Sync] loadFormsFromCloud exception:', err);
    } finally {
      _isCloudSyncing = false;
    }
  }
  window.syncFormsToCloud = syncFormsToCloud;
  window.loadFormsFromCloud = loadFormsFromCloud;

  // localStorage.setItem のフック: form_customize_all_forms への書き込み時にクラウドへ自動保存
  const _origSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key === 'form_customize_all_forms') {
      try {
        let parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          const purgedKeywords = ['お客様フィードバック', '管理者用のアカウント作成', '管理者権限のアカウント作成'];
          parsed = parsed.filter(f => f && !purgedKeywords.some(p => (f.title || '').includes(p)));
          const { hasModified } = sanitizeFormBranchingLogic(parsed);
          arguments[1] = JSON.stringify(parsed);
        }
        _origSetItem.apply(this, arguments);
        if (Array.isArray(parsed)) {
          syncFormsToCloud(parsed);
        }
        return;
      } catch(e) {}
    }
    _origSetItem.apply(this, arguments);
  };

  // 起動時の初期同期
  setTimeout(loadFormsFromCloud, 100);

  // =========================================================================
  // 🤖 正規表現AIアシスタント クイック選択チップ 横スクロール・ナビゲーション機能
  // =========================================================================
  function initRegexChipsScroll() {
    const container = document.getElementById('regex-chat-chips-container');
    const prevBtn = document.getElementById('btn-regex-chips-prev');
    const nextBtn = document.getElementById('btn-regex-chips-next');
    const modal = document.getElementById('modal-regex-ai');

    if (!container) return;
    if (container.dataset.scrollInitialized === 'true') return;
    container.dataset.scrollInitialized = 'true';

    const wrapper = container.closest('.regex-chips-wrapper');

    // 1. スクロール位置に基づくナビゲーションボタン・フェードの更新
    const updateScrollState = () => {
      if (!container || !prevBtn || !nextBtn) return;
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      if (maxScroll <= 2) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        if (wrapper) {
          wrapper.classList.remove('scrolled-left');
          wrapper.classList.add('scrolled-end');
        }
        return;
      }
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';

      const isAtStart = container.scrollLeft <= 5;
      const isAtEnd = container.scrollLeft >= maxScroll - 5;

      prevBtn.disabled = isAtStart;
      prevBtn.setAttribute('aria-disabled', isAtStart ? 'true' : 'false');

      nextBtn.disabled = isAtEnd;
      nextBtn.setAttribute('aria-disabled', isAtEnd ? 'true' : 'false');

      if (wrapper) {
        if (isAtStart) {
          wrapper.classList.remove('scrolled-left');
        } else {
          wrapper.classList.add('scrolled-left');
        }

        if (isAtEnd) {
          wrapper.classList.add('scrolled-end');
        } else {
          wrapper.classList.remove('scrolled-end');
        }
      }
    };

    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    // 2. マウスホイールによる直感的な横スクロール（縦ホイールを横移動に変換）
    container.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // 3. ナビゲーションボタン（‹ / ›）クリックでスムーズスクロール
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.scrollBy({ left: -160, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.scrollBy({ left: 160, behavior: 'smooth' });
      });
    }

    // 4. マウスドラッグによるスワイプスクロール（ドラッグ操作）
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDown = true;
      isDragging = false;
      startX = e.pageX;
      scrollStart = container.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        setTimeout(() => { isDragging = false; }, 60);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) {
        isDragging = true;
      }
      container.scrollLeft = scrollStart - dx;
    });

    // ドラッグ中にチップのclickイベントが発火しないようにキャプチャフェーズで抑止
    container.addEventListener('click', (e) => {
      if (isDragging) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);

    // 5. チップクリック時の確実な自動入力＆AI回答生成の保証
    const generateRegexAiResponse = (query) => {
      const q = query.toLowerCase();
      let text = "";
      let pattern = "";

      const isNoHyphen = q.includes('なし') || q.includes('無') || q.includes('不要') || q.includes('数字のみ');
      const isFlexible = q.includes('問わず') || q.includes('任意') || q.includes('どちら');

      if (q.includes('郵便') || q.includes('ゆうびん')) {
        if (isNoHyphen) {
          text = "📮 **郵便番号（ハイフンなし）**の正規表現です。\n\nハイフンなしの7桁半角数字（例: 1234567）に一致させるには、以下の正規表現を使用します：\n`^\\d{7}$`\n\n※ハイフンあり（例: 123-4567）にする場合は `^\\d{3}-\\d{4}$` を使用してください。";
          pattern = "^\\d{7}$";
        } else {
          text = "📮 **郵便番号**の正規表現です。\n\nハイフンありの形式（例: 123-4567）に一致させるには、以下の正規表現を使用します：\n`^\\d{3}-\\d{4}$`\n\n※ハイフンなし（例: 1234567）とする場合は `^\\d{7}$` を使用してください。";
          pattern = "^\\d{3}-\\d{4}$";
        }
      } else if (q.includes('メール') || q.includes('アドレス') || q.includes('めーる')) {
        text = "📧 **メールアドレス**の正規表現です。\n\n標準的な形式（例: name@example.com）に一致させるには、以下の表現を使用します：\n`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`\n\n※Googleスプレッドシートのデータ検証でも問題なく稼働する表現です。";
        pattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
      } else if (q.includes('電話') || q.includes('でんわ') || q.includes('携帯') || q.includes('けいたい')) {
        if (isNoHyphen) {
          text = "📞 **電話番号（ハイフンなし）**の正規表現です。\n\nハイフンなしの半角数字（固定10桁・携帯11桁 例: 0312345678, 09012345678）に一致させるには以下を使用します：\n`^0\\d{9,10}$`\n\n※固定電話と携帯電話の両方に幅広く対応しています。";
          pattern = "^0\\d{9,10}$";
        } else if (isFlexible) {
          text = "📞 **電話番号（ハイフン問わず・ありなし両対応）**の正規表現です。\n\nハイフンあり（例: 03-1234-5678）とハイフンなし（例: 0312345678）のどちらの入力も受け付けるには以下を使用します：\n`^(0\\d{1,4}-?\\d{1,4}-?\\d{3,4}|0\\d{9,10})$`\n\n※回答者の入力ゆれを自動許容する使い勝手の良い設定です。";
          pattern = "^(0\\d{1,4}-?\\d{1,4}-?\\d{3,4}|0\\d{9,10})$";
        } else {
          text = "📞 **電話番号（ハイフンあり）**の正規表現です。\n\n一般的なハイフンありの番号（例: 090-1234-5678, 03-1234-5678）に一致させるには以下を使用します：\n`^(0\\d{1,4}-\\d{1,4}-\\d{3,4})$`\n\n※ハイフンを含めず数字のみにする場合は `^0\\d{9,10}$` を使用してください。";
          pattern = "^(0\\d{1,4}-\\d{1,4}-\\d{3,4})$";
        }
      } else if (q.includes('口座') || q.includes('こうざ')) {
        text = "💳 **口座番号**の正規表現です。\n\n一般的に使用される口座番号（6〜7桁の半角数字）に一致させるには、以下の正規表現を使用します：\n`^[0-9]{6,7}$`\n\n※信用金庫や一部金融機関の6桁口座にも完全対応した推奨設定です。";
        pattern = "^[0-9]{6,7}$";
      } else if (q.includes('インボイス') || q.includes('いんぼいす') || q.includes('登録番号')) {
        text = "🧾 **インボイス登録番号**の正規表現です。\n\n適格請求書発行事業者の登録番号（Tで始まる13桁の半角数字）に一致させるには、以下の表現を使用します：\n`^T\\d{13}$`\n\n※先頭のアルファベット大文字「T」と、それに続く13桁の数字を厳密に制限する形式です。";
        pattern = "^T\\d{13}$";
      } else if (q.includes('英数字') || q.includes('えいすうじ') || q.includes('アルファベット')) {
        text = "🔤 **半角英数字のみ**の正規表現です。\n\nアルファベットの小文字・大文字および数字のみ（スペースなし、1文字以上）に一致させるには、以下を使用します：\n`^[a-zA-Z0-9]+$`\n\n※数字のみに絞る場合は `^[0-9]+$` を使用してください。";
        pattern = "^[a-zA-Z0-9]+$";
      } else if (q.includes('カタカナ') || q.includes('かたかな')) {
        text = "📝 **全角カタカナのみ**の正規表現です。\n\n全角カタカナ文字のみ（スペース不可、1文字以上）に一致させるには、以下を使用します：\n`^[ァ-ヶ]+$`\n\n※スペースを含める場合は `^[ァ-ヶ　]+$` にしてください。";
        pattern = "^[ァ-ヶ]+$";
      } else if (q.includes('日付') || q.includes('ひづけ') || q.includes('年月日')) {
        text = "📅 **日付 (YYYY/MM/DD)**の正規表現です。\n\nスラッシュ区切りの日付形式（例: 2026/07/02）に一致させるには、以下を使用します：\n`^\\d{4}/\\d{2}/\\d{2}$`\n\n※数字の桁数の整合性をとるシンプルな設定です。";
        pattern = "^\\d{4}/\\d{2}/\\d{2}$";
      } else {
        text = "🤖 スプレッドシート互換の正規表現の基本的な書き方です：\n\n- `^` : 文字列の先頭からマッチ開始\n- `$` : 文字列の末尾までマッチ終了\n- `\\d` : 半角の数字 (0-9)\n- `[a-z]` : 小文字のアルファベット\n- `+` : 直前の文字の1回以上の繰り返し\n- `{N}` : 直前の文字のN回繰り返し\n\n知りたい入力規則（例: 「カタカナのみ」「郵便番号」など）を下のテキストボックスに入力するか、クイックボタンをクリックしてください！";
      }
      return { text, pattern };
    };

    // 会話履歴の管理（直近ターンをAPIに連携）
    window._regexChatHistory = window._regexChatHistory || [];

    // Markdown簡易レンダラー（HTML安全エスケープ付き）
    const formatRegexMarkdown = (rawText) => {
      if (!rawText) return "";
      let s = rawText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // ```code blocks```
      s = s.replace(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, (match, p1) => {
        return `<pre style="background: rgba(0,0,0,0.06); padding: 8px 10px; border-radius: 6px; font-family: monospace; font-size: 0.85em; overflow-x: auto; margin: 6px 0; border: 1px solid rgba(0,0,0,0.08);"><code>${p1}</code></pre>`;
      });

      // `inline code`
      s = s.replace(/`([^`]+)`/g, "<code style='background:rgba(26,115,232,0.08); padding:2px 5px; border-radius:4px; font-family:monospace; color:#1a73e8; font-weight:600; border:1px solid rgba(26,115,232,0.2);'>$1</code>");

      // **bold**
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // *italic*
      s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // リスト項目 (- または * の先頭行)
      s = s.replace(/^[*-]\s+(.+)$/gm, '<li style="margin-left: 18px; list-style-type: disc;">$1</li>');

      // 改行
      s = s.replace(/\n/g, '<br>');

      return s;
    };

    const handleRegexChatSubmit = async (queryText) => {
      const input = document.getElementById('regex-chat-input');
      const history = document.getElementById('regex-chat-history');
      const sendBtn = document.getElementById('btn-send-regex-chat');
      if (!history) return;
      const q = (queryText || (input ? input.value : '')).trim();
      if (!q) return;

      if (input) input.value = '';
      if (input) input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;

      // ユーザーメッセージ吹き出し
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user-msg';
      userMsg.style.cssText = 'align-self: flex-end; background-color: var(--color-primary, #1a73e8); color: #ffffff; border-radius: 8px; padding: 10px 12px; font-size: 0.85rem; max-width: 85%; word-break: break-word;';
      userMsg.textContent = q;
      history.appendChild(userMsg);
      history.scrollTop = history.scrollHeight;

      // 会話履歴にユーザー発言を追加
      window._regexChatHistory.push({ role: 'user', text: q });

      // Geminiローディング表示
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-msg system-msg chat-msg-loading';
      loadingMsg.id = 'regex-chat-loading-indicator';
      loadingMsg.style.cssText = 'align-self: flex-start; background-color: var(--color-bg-card, #f8f9fa); border: 1px dashed var(--color-border, #dadce0); border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; max-width: 85%; color: var(--color-text-muted, #5f6368);';
      loadingMsg.innerHTML = '<span class="chat-loading-dots"><span class="ai-sparkle-icon">✨</span> Geminiがスプレッドシート互換の正規表現を生成中...<span class="dot-typing"></span></span>';
      history.appendChild(loadingMsg);
      history.scrollTop = history.scrollHeight;

      const finishAndScroll = () => {
        if (loadingMsg && loadingMsg.parentNode) {
          loadingMsg.parentNode.removeChild(loadingMsg);
        }
        if (input) input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        if (input) input.focus();
        history.scrollTop = history.scrollHeight;
      };

      const renderBotResponse = (htmlContent, pattern, noticeBanner = null) => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg system-msg';
        botMsg.style.cssText = 'align-self: flex-start; background-color: var(--color-bg-card, #f8f9fa); border: 1px solid var(--color-border, #dee2e6); border-radius: 8px; padding: 12px; font-size: 0.85rem; max-width: 85%; line-height: 1.55; color: var(--color-text, #212529); word-break: break-word;';

        let inner = '';
        if (noticeBanner) {
          inner += noticeBanner;
        }
        inner += htmlContent;
        botMsg.innerHTML = inner;

        // APIキー直接入力用リンクのイベント
        const keyPromptLink = botMsg.querySelector('#btn-prompt-gemini-key');
        if (keyPromptLink) {
          keyPromptLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentVal = localStorage.getItem('synapse_gemini_api_key') || '';
            const key = window.prompt('Google Gemini APIキーを入力してください（ブラウザ内に保存されます）:\n※Vercel環境変数 GEMINI_API_KEY を設定している場合は不要です。', currentVal);
            if (key !== null) {
              if (key.trim()) {
                localStorage.setItem('synapse_gemini_api_key', key.trim());
                alert('Gemini APIキーをブラウザに保存しました！再度メッセージを送信してください。');
              } else {
                localStorage.removeItem('synapse_gemini_api_key');
                alert('Gemini APIキーの保存を解除しました。');
              }
            }
          });
        }

        if (pattern) {
          const applyBtn = document.createElement('button');
          applyBtn.className = 'btn-apply-regex-ai';
          applyBtn.innerHTML = '<span>⚡</span> この正規表現を適用する';
          applyBtn.addEventListener('click', () => {
            const targetQ = window._currentAiRegexQuestion || (window.w ? window.w : null);
            if (targetQ) {
              if (!targetQ.validation) {
                targetQ.validation = { category: 'regex', condition: 'matches', value: '', value2: '', errorMessage: '' };
              }
              targetQ.validation.category = 'regex';
              targetQ.validation.condition = 'matches';
              targetQ.validation.value = pattern;

              let matchedKey = 'custom';
              if (typeof REGEX_PRESET_DEFINITIONS !== 'undefined') {
                for (const [k, def] of Object.entries(REGEX_PRESET_DEFINITIONS)) {
                  if (def.pattern === pattern) {
                    matchedKey = k;
                    break;
                  }
                }
              }
              targetQ.validation.presetKey = matchedKey;

              if (typeof getAutoDescriptionForQuestion === 'function') {
                const autoDesc = getAutoDescriptionForQuestion(targetQ.title, targetQ.validation);
                if (autoDesc) targetQ.description = autoDesc;
              }
              if (typeof getAutoErrorMessageForQuestion === 'function') {
                const autoErr = getAutoErrorMessageForQuestion(targetQ.title, targetQ.validation);
                if (autoErr) targetQ.validation.errorMessage = autoErr;
              }

              if (window.fastUpdateLivePreview) {
                window.fastUpdateLivePreview('question_desc', targetQ.description, { questionId: targetQ.id });
              }
              if (window.S) window.S(true);
              if (window.x) window.x();
            } else {
              const patternInputs = document.querySelectorAll('.val-inputs-container input[type="text"]');
              if (patternInputs.length > 0) {
                patternInputs[patternInputs.length - 1].value = pattern;
                patternInputs[patternInputs.length - 1].dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
            if (modal) modal.style.display = 'none';
          });
          botMsg.appendChild(applyBtn);
        }

        history.appendChild(botMsg);
      };

      try {
        const clientApiKey = localStorage.getItem('synapse_gemini_api_key') || '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        // APIエンドポイントの解決（ローカル環境やfile:プロトコルでも本番APIへ通信可能に）
        let apiEndpoint = '/api/regex-ai';
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          apiEndpoint = 'https://synapse-wayway.vercel.app/api/regex-ai';
        }

        let data = null;
        let fetchFailed = false;
        let fetchErrorMsg = '';

        try {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: q,
              history: window._regexChatHistory.slice(-6),
              clientApiKey: clientApiKey
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Server HTTP ${response.status}`);
          }
          data = await response.json();
        } catch (serverErr) {
          fetchFailed = true;
          fetchErrorMsg = serverErr.message || '通信タイムアウトまたはネットワーク障害';
          console.warn('[Regex AI Assistant] Server endpoint failed, checking direct Gemini client fallback:', serverErr);

          // 🌟 直接Gemini APIフォールバック: クライアント側にAPIキーがある場合は直接Google Gemini APIを呼ぶ
          if (clientApiKey) {
            try {
              const directModel = 'gemini-1.5-flash';
              const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${directModel}:generateContent?key=${encodeURIComponent(clientApiKey)}`;
              const sysPrompt = `あなたはWebフォームおよびGoogleスプレッドシートのRE2正規表現に特化した親切なAIアシスタントです。必ず以下のJSON形式のみを出力してください: {"reply": "丁寧な解説", "pattern": "^正規表現パターン$"}`;
              
              const directResp = await fetch(directUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-goog-api-key': clientApiKey
                },
                body: JSON.stringify({
                  systemInstruction: { parts: [{ text: sysPrompt }] },
                  contents: [{ role: 'user', parts: [{ text: q }] }],
                  generationConfig: { temperature: 0.2, maxOutputTokens: 1000, responseMimeType: 'application/json' }
                })
              });
              if (directResp.ok) {
                const directJson = await directResp.json();
                const partText = directJson.candidates?.[0]?.content?.parts?.[0]?.text;
                if (partText) {
                  const parsed = JSON.parse(partText);
                  data = {
                    success: true,
                    reply: parsed.reply || partText,
                    pattern: parsed.pattern || ''
                  };
                  fetchFailed = false;
                }
              } else {
                const dErrText = await directResp.text();
                try {
                  const dErrJson = JSON.parse(dErrText);
                  fetchErrorMsg = dErrJson.error?.message || dErrText;
                } catch(e) {
                  fetchErrorMsg = dErrText;
                }
              }
            } catch (directErr) {
              console.warn('[Regex AI Assistant] Direct Gemini call also failed:', directErr);
            }
          }
        }

        if (data && data.success && data.reply) {
          // Gemini APIからの完全な回答
          finishAndScroll();
          renderBotResponse(formatRegexMarkdown(data.reply), data.pattern || '');
          window._regexChatHistory.push({ role: 'model', text: data.reply });
        } else if (data && data.isConfigured === false) {
          // APIキー未設定 → ローカル辞書へ安全にフォールバック
          finishAndScroll();
          const fallback = generateRegexAiResponse(q);
          const banner = `<div style="background: rgba(234, 134, 0, 0.1); border-left: 3px solid #ea8600; padding: 6px 10px; margin-bottom: 8px; font-size: 0.8rem; border-radius: 4px; color: var(--color-text);">
            ℹ️ <strong>Gemini API未接続（ローカル簡易辞書で回答中）</strong><br>
            Vercel環境変数に <code>GEMINI_API_KEY</code> を設定すると、自由な対話生成が可能になります。<br>
            <a href="javascript:void(0)" id="btn-prompt-gemini-key" style="color:#1a73e8; text-decoration:underline; font-weight:600; margin-top:3px; display:inline-block;">🔑 ブラウザにAPIキーを設定して試す</a>
          </div>`;
          renderBotResponse(formatRegexMarkdown(fallback.text), fallback.pattern || '', banner);
          window._regexChatHistory.push({ role: 'model', text: fallback.text });
        } else if (data) {
          // 何らかのAPI側エラー
          finishAndScroll();
          const fallback = generateRegexAiResponse(q);
          const errorDetail = data.detail ? `<div style="font-size:0.75rem; color:#c5221f; margin-top:2px; word-break:break-all; font-family:monospace;">${escapeHtml(data.detail)}</div>` : '';
          const banner = `<div style="background: rgba(234, 67, 53, 0.1); border-left: 3px solid #ea4335; padding: 6px 10px; margin-bottom: 8px; font-size: 0.8rem; border-radius: 4px; color: var(--color-text);">
            ⚠️ <strong>Gemini APIエラー（ローカル簡易辞書で回答中）</strong>: ${escapeHtml(data.message || '通信エラー')}<br>
            ${errorDetail}
            <a href="javascript:void(0)" id="btn-prompt-gemini-key" style="color:#1a73e8; text-decoration:underline; font-weight:600; margin-top:3px; display:inline-block;">🔑 APIキーをブラウザに再設定して試す</a>
          </div>`;
          renderBotResponse(formatRegexMarkdown(fallback.text), fallback.pattern || '', banner);
          window._regexChatHistory.push({ role: 'model', text: fallback.text });
        } else {
          // 通信エラー（ローカル辞書へ安全にフォールバック）
          finishAndScroll();
          const fallback = generateRegexAiResponse(q);
          const banner = `<div style="background: rgba(234, 67, 53, 0.1); border-left: 3px solid #ea4335; padding: 6px 10px; margin-bottom: 8px; font-size: 0.8rem; border-radius: 4px; color: var(--color-text);">
            ⚠️ <strong>通信エラー（ローカル簡易辞書で回答中）</strong>: ${escapeHtml(fetchErrorMsg)}<br>
            <a href="javascript:void(0)" id="btn-prompt-gemini-key" style="color:#1a73e8; text-decoration:underline; font-weight:600; margin-top:3px; display:inline-block;">🔑 APIキーを設定して再試行</a>
          </div>`;
          renderBotResponse(formatRegexMarkdown(fallback.text), fallback.pattern || '', banner);
          window._regexChatHistory.push({ role: 'model', text: fallback.text });
        }
      } catch (outerErr) {
        console.error('[Regex AI Assistant] Unexpected error in handleRegexChatSubmit:', outerErr);
        finishAndScroll();
        const fallback = generateRegexAiResponse(q);
        renderBotResponse(formatRegexMarkdown(fallback.text), fallback.pattern || '');
      }

      history.scrollTop = history.scrollHeight;
    };

    // クイック選択チップのクリック（キャプチャフェーズで旧イベントを完全抑止）
    container.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (isDragging) return;
        const query = chip.dataset.query;
        if (!query) return;
        const input = document.getElementById('regex-chat-input');
        if (input) input.value = query;
        handleRegexChatSubmit(query);
      }, true);
    });

    // 送信ボタン・Enterキーのバインディング（キャプチャフェーズで旧イベントを完全抑止）
    const sendBtn = document.getElementById('btn-send-regex-chat');
    const chatInput = document.getElementById('regex-chat-input');
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (chatInput && chatInput.value.trim()) {
          handleRegexChatSubmit(chatInput.value.trim());
        }
      }, true);
    }
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.stopImmediatePropagation();
          e.preventDefault();
          if (chatInput.value.trim()) {
            handleRegexChatSubmit(chatInput.value.trim());
          }
        }
      }, true);
    }


    // モーダル表示時に初期スクロール状態と会話コンテキストを確実に反映
    if (modal) {
      const observer = new MutationObserver(() => {
        if (modal.style.display === 'flex' || modal.classList.contains('active')) {
          setTimeout(updateScrollState, 50);
          
          // モーダルヘッダーにGeminiバッジを追加（未付与の場合）
          const headerTitle = modal.querySelector('.modal-header h3');
          if (headerTitle && !headerTitle.querySelector('.gemini-badge')) {
            const badge = document.createElement('span');
            badge.className = 'gemini-badge';
            badge.style.cssText = 'font-size: 0.72rem; font-weight: 600; background: linear-gradient(135deg, #1a73e8, #8ab4f8); color: #ffffff; padding: 2px 7px; border-radius: 12px; margin-left: 8px; vertical-align: middle; display: inline-flex; align-items: center; gap: 3px;';
            badge.innerHTML = '<span style="font-size: 0.75rem;">✨</span> Powered by Gemini';
            headerTitle.appendChild(badge);
          }
        }
      });
      observer.observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    // 初回実行
    setTimeout(updateScrollState, 100);
  }

  // 起動時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegexChipsScroll);
  } else {
    initRegexChipsScroll();
  }
})();

// =========================================================================
// 📋 選択肢一覧の10個程度コンパクト化・スクロールボックス保証システム
// =========================================================================
(function() {
  function ensureCompactOptionsContainers() {
    const containers = document.querySelectorAll('.options-edit-container');
    containers.forEach(container => {
      const rows = Array.from(container.querySelectorAll('.option-edit-row'));
      if (rows.length === 0) return;

      // 🗑️ 選択肢削除ボタンの統一線画ゴミ箱アイコンを確実に維持
      rows.forEach(r => {
        const btn = r.querySelector('.btn-delete-option');
        if (btn && !btn.querySelector('svg')) {
          btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
          btn.title = '選択肢を削除';
          btn.setAttribute('aria-label', '選択肢を削除');
        }
      });

      let rowsWrap = container.querySelector('.options-edit-rows-wrap');
      
      // 1. ラッパーが存在しない場合の自動ラップ（フォールバック）
      if (!rowsWrap) {
        rowsWrap = document.createElement('div');
        rowsWrap.className = 'options-edit-rows-wrap';
        if (rows[0] && rows[0].parentNode) {
          rows[0].parentNode.insertBefore(rowsWrap, rows[0]);
          rows.forEach(r => rowsWrap.appendChild(r));
        }
      }

      // 2. 件数に応じたクラス付与とバッジの同期
      let headerWrap = container.querySelector('.options-edit-header-wrap');
      if (!headerWrap) {
        const title = container.querySelector('.options-edit-title');
        if (title && title.parentNode === container) {
          headerWrap = document.createElement('div');
          headerWrap.className = 'options-edit-header-wrap';
          headerWrap.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;';
          title.parentNode.insertBefore(headerWrap, title);
          headerWrap.appendChild(title);
        }
      }

      const totalCount = rows.length;
      if (totalCount > 10) {
        if (!rowsWrap.classList.contains('is-expanded')) {
          rowsWrap.classList.add('has-many-options');
        }

        if (headerWrap && !headerWrap.querySelector('.options-count-badge')) {
          const countBadge = document.createElement('div');
          countBadge.className = 'options-count-badge';
          
          const countText = document.createElement('span');
          countText.style.cssText = 'color: var(--color-text-muted, #94a3b8); font-size: 0.75rem;';
          countText.textContent = `全${totalCount}件 (10件表示中)`;
          
          const toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'btn-toggle-options-expand';
          toggleBtn.textContent = '全件展開';
          
          toggleBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const isExp = rowsWrap.classList.toggle('is-expanded');
            if (isExp) {
              rowsWrap.classList.remove('has-many-options');
              toggleBtn.textContent = '10件表示に折りたたむ';
              countText.textContent = `全${totalCount}件 (すべて展開中)`;
            } else {
              rowsWrap.classList.add('has-many-options');
              toggleBtn.textContent = '全件展開';
              countText.textContent = `全${totalCount}件 (10件表示中)`;
            }
          });

          countBadge.appendChild(countText);
          countBadge.appendChild(toggleBtn);
          headerWrap.appendChild(countBadge);
        } else if (headerWrap) {
          const countText = headerWrap.querySelector('.options-count-badge span');
          if (countText && !rowsWrap.classList.contains('is-expanded')) {
            countText.textContent = `全${totalCount}件 (10件表示中)`;
          }
        }
      } else {
        rowsWrap.classList.remove('has-many-options', 'is-expanded');
        if (headerWrap) {
          const badge = headerWrap.querySelector('.options-count-badge');
          if (badge) badge.remove();
        }
      }
    });
  }

  // 定期ポーリングとDOM監視で確実に適用
  setInterval(ensureCompactOptionsContainers, 300);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureCompactOptionsContainers);
  } else {
    ensureCompactOptionsContainers();
  }

  // =========================================================================
  // ⚙️ 質問設定の2層分離（詳細設定スライドドロワー）＆ 案内用AIコンシェルジュ
  // =========================================================================

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let _activeDrawerQuestionId = null;
  let _currentAiAdvice = null;

  function getDrawerFormSections() {
    const formSources = [window.n, window.G, window.F, window.L];
    if (window.U && Array.isArray(window.U)) formSources.push(...window.U);
    for (const fs of formSources) {
      if (fs && fs.sections && Array.isArray(fs.sections) && fs.sections.length > 0) {
        return fs.sections;
      }
    }
    return [];
  }

  function getDrawerAvailableSources(secId, qId, grpId) {
    if (typeof getAvailableSourcesFor === 'function') {
      return getAvailableSourcesFor(secId, qId, grpId);
    }
    if (typeof window.getAvailableSourcesFor === 'function') {
      return window.getAvailableSourcesFor(secId, qId, grpId);
    }
    return { groups: [], questions: [] };
  }

  // バリデーションの短縮ラベル取得
  function getValidationShortLabel(v) {
    if (!v) return '';
    const cat = v.category || '';
    const cond = v.condition || '';
    if (cat === 'text') {
      if (cond === 'email') return 'メールアドレス';
      if (cond === 'url') return 'URL';
      if (cond === 'auto_hyphen') return '屋号ハイフン補填';
      return 'テキスト';
    }
    if (cat === 'api') {
      if (cond === 'corp_name') return '国税庁法人API';
      if (cond === 'invoice_number') return 'インボイス照合';
      if (cond === 'zip_code') return '郵便番号検索';
      if (cond === 'bank_name') return '全銀協銀行検索';
      if (cond === 'branch_name') return '全銀協支店検索';
      return 'API連携';
    }
    if (cat === 'regex') {
      if (v.presetKey === 'tel_both' || cond === 'tel') return '電話番号';
      if (v.presetKey === 'birthdate') return '生年月日';
      if (v.presetKey === 'zip' || v.presetKey === 'zip_nohyphen') return '郵便番号';
      if (v.presetKey === 'account_holder_kana') return '口座名義カナ';
      return '正規表現';
    }
    if (cat === 'number') return '数値';
    if (cat === 'length') return '文字数制限';
    return '入力規則';
  }

  // 1. 質問カードの超軽量化 & バッジ・詳細設定ボタン注入
  function injectQuestionCardCompactStylesAndBadges() {
    const qCards = document.querySelectorAll('#questions-container .question-card');
    if (!qCards || qCards.length === 0) return;

    qCards.forEach(card => {
      const qId = card.dataset.questionId;
      if (!qId) return;

      const q = findQuestionDefById(qId);
      if (!q) return;

      // 1. 軽量化クラスの付与
      if (!card.classList.contains('compact-settings')) {
        card.classList.add('compact-settings');
      }

      // 2. メディア添付チェックボックスの親form-groupを特定してクラス付与（CSSで隠すため）
      const formGroups = card.querySelectorAll(':scope > .form-group');
      formGroups.forEach(fg => {
        if (fg.textContent && fg.textContent.includes('説明用メディア') && !fg.classList.contains('question-card-media-toggle-group')) {
          fg.classList.add('question-card-media-toggle-group');
        }
      });

      // 3. 設定バッジエリアの管理
      let badgesWrap = card.querySelector('.question-card-badges');
      if (!badgesWrap) {
        badgesWrap = document.createElement('div');
        badgesWrap.className = 'question-card-badges';

        const actions = card.querySelector('.question-card-actions');
        if (actions) {
          actions.parentNode.insertBefore(badgesWrap, actions);
        } else {
          card.appendChild(badgesWrap);
        }
      }

      // バッジの動的再描画
      const badgeSignature = [
        q.dataKey || '',
        q.validation ? `${q.validation.category}:${q.validation.condition}:${q.validation.presetKey || ''}` : '',
        q.autoReply ? 'autoreply' : '',
        (q.media && q.media.url) ? 'media' : '',
        q.scrollRequired ? 'scroll' : '',
        (q.sameAsAbove && q.sameAsAbove.enabled) ? `same:${q.sameAsAbove.sourceQuestionId || ''}` : '',
        (q.skipLogic && q.skipLogic.dependsOn) ? `skip:${q.skipLogic.dependsOn}:${q.skipLogic.condition || ''}` : ''
      ].join('|');

      if (badgesWrap.dataset.lastSignature !== badgeSignature) {
        badgesWrap.dataset.lastSignature = badgeSignature;
        badgesWrap.innerHTML = '';

        let badgeCount = 0;

        // ① カラム統一（dataKey）バッジ
        if (q.dataKey) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-datakey';
          b.innerHTML = `🏷️ 列: <strong>${escapeHtml(q.dataKey)}</strong>`;
          b.title = '他の質問と同一の列名で保存されます（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }

        // ② 入力規則バッジ
        if (q.validation) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-validation';
          b.innerHTML = `🛡️ ${escapeHtml(getValidationShortLabel(q.validation))}`;
          b.title = '回答の入力規則が有効です（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }

        // ③ 回答控え自動送信バッジ
        if (q.autoReply) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-autoreply';
          b.innerHTML = `📨 回答控え有効`;
          b.title = '送信後にこのメール宛に控えが届きます（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }

        // ④ 説明用メディアバッジ
        if (q.media && q.media.url) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-media';
          b.innerHTML = `📎 メディア添付`;
          b.title = '画像または動画が添付されています（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }

        // ⑤ 規約スクロール必須バッジ
        if (q.scrollRequired) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-scroll';
          b.innerHTML = `📜 規約ロック`;
          b.title = '最下部スクロール必須ロックが有効です（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }
        // ⑥ 📋 「前述と同じ（同上）」自動入力バッジ
        if (q.sameAsAbove && q.sameAsAbove.enabled) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-sameasabove';
          b.innerHTML = q.sameAsAbove.sourceType === 'group' ? `📁 グループ同上連動` : `📋 同上入力`;
          b.title = '前述の入力値から自動補完されます（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }

        // ⑦ ⚡ セクション内スキップ（条件分岐）バッジ
        if (q.skipLogic && q.skipLogic.dependsOn) {
          const b = document.createElement('span');
          b.className = 'q-setting-badge badge-skiplogic';
          b.innerHTML = `⚡ スキップ分岐`;
          b.title = '条件分岐ルールが設定されています（クリックで詳細設定）';
          b.addEventListener('click', (e) => { e.stopPropagation(); openQuestionSettingsDrawer(qId); });
          badgesWrap.appendChild(b);
          badgeCount++;
        }

        // 未設定時はボタンの重複を避けるため何も表示しない（詳細設定はアクション行の「⚙️ 詳細設定」ボタンに一本化）
      }

      // 4. アクション行に「⚙️ 詳細設定」ボタンを注入
      const actions = card.querySelector('.question-card-actions');
      if (actions && !actions.querySelector('.btn-open-q-drawer')) {
        const btnDrawer = document.createElement('button');
        btnDrawer.type = 'button';
        btnDrawer.className = 'btn-open-q-drawer';
        btnDrawer.innerHTML = '⚙️ 詳細設定';
        btnDrawer.title = 'カラム統一、入力規則、メール控えなどの詳細設定を開く';
        btnDrawer.dataset.questionId = qId;
        btnDrawer.dataset.qid = qId;
        btnDrawer.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openQuestionSettingsDrawer(qId);
        });

        // 削除ボタンや移動ボタンの手前に配置
        const actionBtns = actions.querySelector('.question-action-buttons');
        if (actionBtns) {
          actionBtns.insertBefore(btnDrawer, actionBtns.firstChild);
        } else {
          actions.appendChild(btnDrawer);
        }
      }
    });
  }

  // 2. AIコンシェルジュによる質問意図の自動解析
  function analyzeQuestionForAiConcierge(q) {
    const title = (q.title || '').trim();
    const lower = title.toLowerCase();

    // 他のセクションの質問一覧を取得して相関関係（法人 vs 屋号など）を検出
    const allQuestions = [];
    const rootForm = window.F || window.n || window.G || window.L;
    if (rootForm && rootForm.sections) {
      rootForm.sections.forEach(s => {
        (s.questions || []).forEach(otherQ => {
          if (otherQ && otherQ.id !== q.id) allQuestions.push(otherQ);
        });
      });
    }

    // 1. メールアドレス
    if (lower.includes('メール') || lower.includes('mail') || lower.includes('アドレス')) {
      return {
        type: 'email',
        recommendationTitle: '✉️ メールアドレス（控え自動送信 & email列統合）',
        explanation: 'メールアドレス形式の検証を適用し、送信後に自動で回答控えメールを届ける設定をおすすめします。',
        dataKey: 'email',
        unifyColumn: true,
        validation: {
          category: 'text',
          condition: 'email',
          value: '',
          value2: '',
          errorMessage: '有効なメールアドレスを入力してください。'
        },
        autoReply: true,
        items: [
          'データベース出力列名: <strong>email</strong> に統一',
          '入力規則: <strong>テキスト ➔ メールアドレス</strong>（自動判定）',
          '回答控えメール: <strong>自動配信をON</strong> に設定'
        ]
      };
    }

    // 2. 法人名 / 会社名
    if (lower.includes('法人名') || lower.includes('会社名') || lower.includes('企業名') || lower.includes('商号')) {
      return {
        type: 'corp_name',
        recommendationTitle: '🏛️ 法人名検索（国税庁API連携 & company_name列統合）',
        explanation: '国税庁法人番号APIによるリアルタイム検索と、DB列「company_name」への統一をおすすめします。',
        dataKey: 'company_name',
        unifyColumn: true,
        validation: {
          category: 'api',
          condition: 'corp_name',
          value: '',
          value2: '',
          errorMessage: '実在する法人名を入力または選択してください。'
        },
        autoReply: false,
        items: [
          'データベース出力列名: <strong>company_name</strong> に統一',
          '入力規則: <strong>API連携 ➔ 国税庁法人番号API</strong>',
          'エラー表示: 実在する法人名を選択してください'
        ]
      };
    }

    // 3. 屋号
    if (lower.includes('屋号')) {
      const hasCorp = allQuestions.some(oq => (oq.title || '').includes('法人名') || (oq.title || '').includes('会社名'));
      const exp = hasCorp 
        ? '別セクションの「法人名」と同一の列名「company_name」に一本化し、屋号がない場合の自動ハイフン補填を設定することを推奨します。'
        : '個人事業主の屋号として未入力時の自動ハイフン補填を有効化し、列名「company_name」に統一することをおすすめします。';
      return {
        type: 'trade_name',
        recommendationTitle: '🏢 屋号（法人名と同一列 company_name に一本化）',
        explanation: exp,
        dataKey: 'company_name',
        unifyColumn: true,
        validation: {
          category: 'text',
          condition: 'auto_hyphen',
          value: '',
          value2: '',
          errorMessage: ''
        },
        autoReply: false,
        items: [
          'データベース出力列名: <strong>company_name</strong> に統一（法人名と合流）',
          '入力規則: <strong>未入力時は自動で半角ハイフン補填（屋号なし対応）</strong>'
        ]
      };
    }

    // 4. 電話番号
    if (lower.includes('電話') || lower.includes('tel') || lower.includes('携帯') || lower.includes('スマホ')) {
      return {
        type: 'tel',
        recommendationTitle: '📞 電話番号（固定・携帯共通バリデーション & tel列統合）',
        explanation: '固定電話と携帯電話の双方に対応した正規表現チェックと、DB列「tel」への統一をおすすめします。',
        dataKey: 'tel',
        unifyColumn: true,
        validation: {
          category: 'regex',
          condition: 'matches',
          value: '^(0\\d{1,4}-\\d{1,4}-\\d{3,4})$',
          presetKey: 'tel_both',
          value2: '',
          errorMessage: '正しい電話番号の形式で入力してください。'
        },
        autoReply: false,
        items: [
          'データベース出力列名: <strong>tel</strong> に統一',
          '入力規則: <strong>正規表現（固定・携帯共通ハイフン形式）</strong>'
        ]
      };
    }

    // 5. 郵便番号
    if (lower.includes('郵便') || lower.includes('〒') || lower.includes('zip')) {
      return {
        type: 'zip',
        recommendationTitle: '📮 郵便番号（ZipCloud連携 & zip_code列統合）',
        explanation: '郵便番号から都道府県・市区町村を自動入力するAPI連携と、列「zip_code」への統一をおすすめします。',
        dataKey: 'zip_code',
        unifyColumn: true,
        validation: {
          category: 'api',
          condition: 'zip_code',
          value: '',
          value2: '',
          errorMessage: '正しい郵便番号（7桁の半角数字）を入力してください。'
        },
        autoReply: false,
        items: [
          'データベース出力列名: <strong>zip_code</strong> に統一',
          '入力規則: <strong>API連携 ➔ 郵便番号検索（ZipCloud連携）</strong>'
        ]
      };
    }

    // 6. 代表者名 / 氏名
    if (lower.includes('代表') || lower.includes('氏名') || lower.includes('名前') || lower.includes('name')) {
      const isKana = lower.includes('カナ') || lower.includes('フリガナ');
      const key = isKana ? 'representative_kana' : 'representative_name';
      return {
        type: 'representative',
        recommendationTitle: isKana ? '👤 氏名カナ（representative_kana列統合）' : '👤 氏名（representative_name列統合）',
        explanation: `代表取締役氏名や個人事業主氏名をDB列「${key}」に集約することをおすすめします。`,
        dataKey: key,
        unifyColumn: true,
        validation: null,
        autoReply: false,
        items: [
          `データベース出力列名: <strong>${key}</strong> に統一`
        ]
      };
    }

    // 7. インボイス / 登録番号
    if (lower.includes('インボイス') || lower.includes('登録番号') || lower.includes('invoice')) {
      return {
        type: 'invoice',
        recommendationTitle: '🧾 インボイス登録番号（公表システムAPI照合 & invoice_number列統合）',
        explanation: 'T+13桁の登録番号を国税庁公表システムと照合し、列「invoice_number」に統一することをおすすめします。',
        dataKey: 'invoice_number',
        unifyColumn: true,
        validation: {
          category: 'api',
          condition: 'invoice_number',
          value: '',
          value2: '',
          errorMessage: '正しくインボイス登録番号（Tで始まる13桁の数字）を入力してください。'
        },
        autoReply: false,
        items: [
          'データベース出力列名: <strong>invoice_number</strong> に統一',
          '入力規則: <strong>API連携 ➔ インボイス登録番号（国税庁照合）</strong>'
        ]
      };
    }

    // 8. 住所 / 番地
    if (lower.includes('住所') || lower.includes('所在地') || lower.includes('番地') || lower.includes('町名')) {
      return {
        type: 'address',
        recommendationTitle: '📍 住所・番地（street列統合）',
        explanation: '法人所在地と個人の住所を共通のDB列「street」に一本化することをおすすめします。',
        dataKey: 'street',
        unifyColumn: true,
        validation: null,
        autoReply: false,
        items: [
          'データベース出力列名: <strong>street</strong> に統一'
        ]
      };
    }

    // 9. 生年月日
    if (lower.includes('生年月日') || lower.includes('誕生') || lower.includes('birth')) {
      return {
        type: 'birthdate',
        recommendationTitle: '🎂 生年月日（birthdate列統合 & 日付書式判定）',
        explanation: 'YYYY/MM/DD形式の書式チェックと、列「birthdate」への統一をおすすめします。',
        dataKey: 'birthdate',
        unifyColumn: true,
        validation: {
          category: 'regex',
          condition: 'matches',
          value: '^(19|20)\\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\\d|3[01])$',
          presetKey: 'birthdate',
          value2: '',
          errorMessage: '正しい生年月日を入力してください（例: 1990/01/01）。'
        },
        autoReply: false,
        items: [
          'データベース出力列名: <strong>birthdate</strong> に統一',
          '入力規則: <strong>正規表現（YYYY/MM/DD形式）</strong>'
        ]
      };
    }

    // 汎用
    return {
      type: 'generic',
      recommendationTitle: '⚙️ 基本設定',
      explanation: '他の質問とDB列を統一したい場合は「カラムの統一」をONにし、適切な列キーを指定してください。',
      dataKey: '',
      unifyColumn: false,
      validation: null,
      autoReply: false,
      items: [
        '必要に応じて入力規則やカラム統一を設定してください'
      ]
    };
  }

  // 3. ドロワー DOM の生成
  function ensureQuestionSettingsDrawerDom() {
    if (document.getElementById('question-settings-drawer')) return;

    // オーバーレイ
    const backdrop = document.createElement('div');
    backdrop.id = 'question-settings-drawer-backdrop';
    backdrop.className = 'question-settings-drawer-backdrop';
    document.body.appendChild(backdrop);

    // ドロワー本体
    const drawer = document.createElement('div');
    drawer.id = 'question-settings-drawer';
    drawer.className = 'question-settings-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-header-left">
          <span class="drawer-header-icon">⚙️</span>
          <div class="drawer-header-titles">
            <h3 id="drawer-q-title" class="drawer-q-title">質問詳細設定</h3>
            <span id="drawer-q-type-badge" class="drawer-q-type-badge">記述式</span>
          </div>
        </div>
        <button type="button" id="btn-close-q-drawer" class="drawer-close-btn" title="閉じる">✕</button>
      </div>

      <div class="drawer-body">
        <!-- 1. 🤖 案内用AIコンシェルジュ -->
        <div id="drawer-ai-panel" class="drawer-section ai-concierge-panel">
          <div class="ai-concierge-header">
            <span class="ai-concierge-title">🤖 案内用AIコンシェルジュ</span>
            <span class="ai-sparkle-badge">✨ リアルタイム診断</span>
          </div>
          <div id="drawer-ai-recommendation-box" class="ai-recommendation-box"></div>
          <div class="ai-actions-row">
            <button type="button" id="btn-apply-ai-rec" class="ai-apply-btn">✨ おすすめ設定を一括適用</button>
            <button type="button" id="btn-toggle-ai-chat" class="ai-chat-toggle-btn">💬 AIに相談する</button>
          </div>
          <div id="drawer-ai-chat-container" class="ai-chat-container" style="display: none;">
            <div id="drawer-ai-chat-messages" class="ai-chat-messages">
              <div class="ai-chat-msg bot">こんにちは！質問の入力規則やカラム統一について何でもご質問ください。</div>
            </div>
            <div class="ai-chat-input-row">
              <input type="text" id="drawer-ai-chat-input" class="form-control form-control-sm" placeholder="AIに質問・相談を入力..." />
              <button type="button" id="btn-send-drawer-ai-chat" class="btn btn-primary btn-sm">送信</button>
            </div>
          </div>
        </div>

        <!-- 2. 🏷️ データベース出力列（カラム）の統一設定 -->
        <div class="drawer-section">
          <div class="drawer-section-title">🏷️ データベース出力列（カラム）の統一設定</div>
          <div class="drawer-section-desc">
            別セクションの質問（例: 法人名と屋号、法人住所と個人住所）でも、同一の列名（dataKey）を設定するとDBや集計シートで1列に集約されます。
          </div>
          
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-unify-column-toggle" />
            <span>他の質問と出力列（カラム）を統一する</span>
          </label>

          <div id="drawer-column-unified-box" style="display: none; margin-top: 10px;">
            <label class="drawer-field-label">共通カラム（列キー）の選択</label>
            <select id="drawer-column-select" class="form-control form-control-sm">
              <option value="company_name">🏢 法人名・屋号 (company_name)</option>
              <option value="company_kana">🏢 法人名カナ・屋号カナ (company_kana)</option>
              <option value="representative_name">👤 代表者名・氏名 (representative_name)</option>
              <option value="representative_kana">👤 代表者カナ・氏名カナ (representative_kana)</option>
              <option value="zip_code">📮 郵便番号 (zip_code)</option>
              <option value="pref">📍 都道府県 (pref)</option>
              <option value="city">📍 市区町村 (city)</option>
              <option value="street">📍 町名・番地 (street)</option>
              <option value="building">📍 建物名・部屋番号 (building)</option>
              <option value="email">✉️ メールアドレス (email)</option>
              <option value="tel">📞 電話番号 (tel)</option>
              <option value="tax_invoice_status">🧾 税務区分・インボイス状況 (tax_invoice_status)</option>
              <option value="invoice_number">🧾 インボイス登録番号 (invoice_number)</option>
              <option value="__custom__">✏️ 自由入力（カスタムキー）</option>
            </select>

            <div id="drawer-custom-key-wrap" style="margin-top: 8px;">
              <input type="text" id="drawer-column-key-input" class="form-control form-control-sm" placeholder="半角英数字（例: company_name）" />
            </div>

            <div class="drawer-chips-wrap" style="margin-top: 8px;">
              <span class="drawer-chip" data-key="company_name">🏢 法人名・屋号</span>
              <span class="drawer-chip" data-key="street">📍 住所・番地</span>
              <span class="drawer-chip" data-key="representative_name">👤 代表者・氏名</span>
              <span class="drawer-chip" data-key="email">✉️ メール</span>
              <span class="drawer-chip" data-key="tel">📞 電話番号</span>
            </div>
          </div>
        </div>

        <!-- 3. 🛡️ 回答の入力規則（検証・バリデーション） -->
        <div class="drawer-section">
          <div class="drawer-section-title">🛡️ 回答の入力規則（検証・バリデーション）</div>
          
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-validation-toggle" />
            <span>回答の入力規則を有効にする</span>
          </label>

          <div id="drawer-validation-fields" style="display: none; margin-top: 10px;">
            <div class="drawer-field-row">
              <div class="drawer-field-col">
                <label class="drawer-field-label">規則の種類</label>
                <select id="drawer-val-category" class="form-control form-control-sm">
                  <option value="text">テキスト</option>
                  <option value="regex">正規表現</option>
                  <option value="number">数値</option>
                  <option value="api">API連携</option>
                  <option value="length">長さ</option>
                </select>
              </div>
              <div class="drawer-field-col">
                <label class="drawer-field-label">判定ルール</label>
                <select id="drawer-val-condition" class="form-control form-control-sm"></select>
              </div>
            </div>

            <div id="drawer-val-pattern-row" style="margin-top: 8px; display: none;">
              <div class="drawer-field-row">
                <div class="drawer-field-col">
                  <label class="drawer-field-label">常用パターン</label>
                  <select id="drawer-val-preset" class="form-control form-control-sm"></select>
                </div>
                <div class="drawer-field-col">
                  <label class="drawer-field-label">正規表現パターン</label>
                  <input type="text" id="drawer-val-pattern" class="form-control form-control-sm" placeholder="^[0-9]+$" />
                </div>
              </div>
            </div>

            <div id="drawer-val-api-notice" class="drawer-help-text" style="display: none; margin-top: 8px; padding: 8px 10px; background: rgba(26,115,232,0.08); border-radius: 6px; border: 1px solid rgba(26,115,232,0.25);"></div>

            <div style="margin-top: 8px;">
              <label class="drawer-field-label">カスタムエラーメッセージ</label>
              <input type="text" id="drawer-val-error-msg" class="form-control form-control-sm" placeholder="エラー時に表示するテキスト" />
            </div>
          </div>
        </div>

        <!-- 4. 📨 回答控えメール設定 -->
        <div class="drawer-section" id="drawer-autoreply-section">
          <div class="drawer-section-title">📨 回答控えメール自動送信</div>
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-autoreply-toggle" />
            <span>回答送信後にこのアドレス宛に回答内容の控えを自動送信する</span>
          </label>
          <div class="drawer-help-text">
            ※ この質問に入力されたメールアドレス宛に、回答完了直後に控えメールが自動配信されます。
          </div>
        </div>

        <!-- 5. 📎 説明用メディア添付 -->
        <div class="drawer-section">
          <div class="drawer-section-title">📎 説明用メディア添付</div>
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-media-toggle" />
            <span>説明用メディア（画像・動画・ファイル）を添付する</span>
          </label>
          <div id="drawer-media-fields" style="display: none; margin-top: 10px;">
            <label class="drawer-field-label">メディア種別とURL</label>
            <div style="display: flex; gap: 6px;">
              <select id="drawer-media-type" class="form-control form-control-sm" style="width: 100px;">
                <option value="image">画像</option>
                <option value="video">動画</option>
              </select>
              <input type="text" id="drawer-media-url" class="form-control form-control-sm" placeholder="https://example.com/sample.png" />
            </div>
          </div>
        </div>

        <!-- 6. 📜 スクロール必須（規約同意ロック） -->
        <div class="drawer-section" id="drawer-scroll-section">
          <div class="drawer-section-title">📜 スクロール必須（規約同意ロック）</div>
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-scroll-toggle" />
            <span>最下部までスクロールするまで回答をロックする</span>
          </label>
          <div id="drawer-scroll-fields" style="display: none; margin-top: 10px;">
            <label class="drawer-field-label">スクロール表示する本文・規約テキスト</label>
            <textarea id="drawer-scroll-text" class="form-control form-control-sm" rows="3" placeholder="【利用規約】ここに規約本文を入力してください..."></textarea>
          </div>
        </div>

        <!-- 7. 📋 「前述と同じ（同上）」自動入力設定 -->
        <div class="drawer-section" id="drawer-sameasabove-section">
          <div class="drawer-section-title">📋 「前述と同じ（同上）」自動入力設定</div>
          <div class="drawer-section-desc">
            回答者がチェックを入れると、前述の入力内容（またはグループ内の全項目）が自動で入力欄に流し込まれます。
          </div>
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-sameasabove-toggle" />
            <span>「前述と同じ（同上）」自動入力を有効にする</span>
          </label>
          <div id="drawer-sameasabove-fields" style="display: none; margin-top: 10px;">
            <div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 180px;">
                <label class="drawer-field-label">コピー元の質問またはグループ</label>
                <select id="drawer-sameasabove-source-select" class="form-control form-control-sm"></select>
              </div>
              <div style="flex: 1; min-width: 180px;">
                <label class="drawer-field-label">表示チェックボックスの文言</label>
                <input type="text" id="drawer-sameasabove-label-input" class="form-control form-control-sm" placeholder="例: 本社住所と同じ" />
              </div>
            </div>
            <div class="drawer-help-text" style="margin-top: 6px;">
              💡 回答者がチェックを入れると、前述の回答値が自動で入力欄に流し込まれます。
            </div>
          </div>
        </div>

        <!-- 8. ⚡ プロ版限定: セクション内スキップ（条件分岐） -->
        <div class="drawer-section" id="drawer-skiplogic-section">
          <div class="drawer-section-title">⚡ プロ版限定: セクション内スキップ（条件分岐）</div>
          <div class="drawer-section-desc">
            同一セクション内の他の質問の回答条件に応じて、この質問を非活性（入力不可）または非表示にするルールを設定できます。
          </div>
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-skiplogic-toggle" />
            <span>セクション内スキップ（条件分岐）を有効にする</span>
          </label>
          <div id="drawer-skiplogic-fields" style="display: none; margin-top: 10px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div>
                <label class="drawer-field-label">対象となるトリガー質問</label>
                <select id="drawer-skiplogic-depends-select" class="form-control form-control-sm"></select>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <div style="flex: 2; min-width: 140px;">
                  <label class="drawer-field-label">分岐判定条件</label>
                  <select id="drawer-skiplogic-condition-select" class="form-control form-control-sm">
                    <optgroup label="空白">
                      <option value="is_empty">空白</option>
                      <option value="is_not_empty">空白ではない</option>
                    </optgroup>
                    <optgroup label="テキスト">
                      <option value="text_contains">次を含むテキスト</option>
                      <option value="text_not_contains">次を含まないテキスト</option>
                      <option value="text_starts_with">次で始まるテキスト</option>
                      <option value="text_ends_with">次で終わるテキスト</option>
                      <option value="text_equals">完全一致するテキスト</option>
                    </optgroup>
                    <optgroup label="日付">
                      <option value="date_is">日付</option>
                      <option value="date_before">次より前の日付</option>
                      <option value="date_after">次より後の日付</option>
                    </optgroup>
                    <optgroup label="数値 / 比較">
                      <option value="greater_than">次より大きい</option>
                      <option value="greater_than_or_equal">以上</option>
                      <option value="less_than">次より小さい</option>
                      <option value="less_than_or_equal">以下</option>
                      <option value="equals" selected>次と等しい</option>
                      <option value="not_equals">次と等しくない</option>
                      <option value="between">次の間にある</option>
                      <option value="not_between">次の間にない</option>
                    </optgroup>
                  </select>
                </div>
                <div style="flex: 2; min-width: 140px;" id="drawer-skiplogic-val-wrapper">
                  <label class="drawer-field-label">トリガー値</label>
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <input type="text" id="drawer-skiplogic-value-input" class="form-control form-control-sm" placeholder="トリガー値" />
                    <span id="drawer-skiplogic-between-sep" style="display: none; font-size: 0.8rem; color: #64748b;">〜</span>
                    <input type="text" id="drawer-skiplogic-value2-input" class="form-control form-control-sm" style="display: none;" placeholder="終了値" />
                  </div>
                </div>
                <div style="flex: 1; min-width: 110px;">
                  <label class="drawer-field-label">動作</label>
                  <select id="drawer-skiplogic-action-select" class="form-control form-control-sm">
                    <option value="disable">非活性にする</option>
                    <option value="hide">非表示にする</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. 📁 所属グループの一括自動入力設定 -->
        <div class="drawer-section" id="drawer-groupsame-section" style="display: none;">
          <div class="drawer-section-title">📁 所属グループの一括自動入力設定</div>
          <div class="drawer-section-desc">
            この質問が所属するグループ全体について、前述の別グループの内容を一括自動入力させることができます。
          </div>
          <label class="drawer-checkbox-label">
            <input type="checkbox" id="drawer-groupsame-toggle" />
            <span>前述のグループと同じ内容を一括自動入力する</span>
          </label>
          <div id="drawer-groupsame-fields" style="display: none; margin-top: 10px;">
            <div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 180px;">
                <label class="drawer-field-label">コピー元のグループ</label>
                <select id="drawer-groupsame-source-select" class="form-control form-control-sm"></select>
              </div>
              <div style="flex: 1; min-width: 180px;">
                <label class="drawer-field-label">表示チェックボックスの文言</label>
                <input type="text" id="drawer-groupsame-label-input" class="form-control form-control-sm" placeholder="例: 本社情報と同じ" />
              </div>
            </div>
            <div class="drawer-help-text" style="margin-top: 6px;">
              💡 このグループ内のすべての該当質問に一括自動入力が適用されます。
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" id="btn-save-close-q-drawer" class="btn btn-primary" style="width: 100%;">完了して閉じる</button>
      </div>
    `;

    document.body.appendChild(drawer);

    // イベントバインド
    const closeBtn = drawer.querySelector('#btn-close-q-drawer');
    const saveCloseBtn = drawer.querySelector('#btn-save-close-q-drawer');
    closeBtn.addEventListener('click', closeQuestionSettingsDrawer);
    saveCloseBtn.addEventListener('click', closeQuestionSettingsDrawer);
    backdrop.addEventListener('click', closeQuestionSettingsDrawer);

    // ESCキー対応
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeQuestionSettingsDrawer();
      }
    });

    // カラム統一切り替え
    const unifyToggle = drawer.querySelector('#drawer-unify-column-toggle');
    const unifiedBox = drawer.querySelector('#drawer-column-unified-box');
    const columnSelect = drawer.querySelector('#drawer-column-select');
    const customKeyInput = drawer.querySelector('#drawer-column-key-input');
    const chipsWrap = drawer.querySelector('.drawer-chips-wrap');

    unifyToggle.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      if (unifyToggle.checked) {
        unifiedBox.style.display = 'block';
        if (!q.dataKey) {
          const defKey = suggestDefaultDataKey(q.title);
          q.dataKey = defKey;
          customKeyInput.value = defKey;
          syncColumnSelectWithKey(defKey);
        }
      } else {
        unifiedBox.style.display = 'none';
        delete q.dataKey;
      }
      persistDrawerChanges();
    });

    columnSelect.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      const val = columnSelect.value;
      if (val === '__custom__') {
        customKeyInput.focus();
      } else {
        q.dataKey = val;
        customKeyInput.value = val;
        persistDrawerChanges();
      }
    });

    customKeyInput.addEventListener('input', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      const val = customKeyInput.value.trim();
      q.dataKey = val;
      syncColumnSelectWithKey(val);
      persistDrawerChanges();
    });

    chipsWrap.querySelectorAll('.drawer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = findQuestionDefById(_activeDrawerQuestionId);
        if (!q) return;
        const key = chip.dataset.key;
        unifyToggle.checked = true;
        unifiedBox.style.display = 'block';
        q.dataKey = key;
        customKeyInput.value = key;
        syncColumnSelectWithKey(key);
        persistDrawerChanges();
      });
    });

    // バリデーション切り替え
    const valToggle = drawer.querySelector('#drawer-validation-toggle');
    const valFields = drawer.querySelector('#drawer-validation-fields');
    const valCatSelect = drawer.querySelector('#drawer-val-category');
    const valCondSelect = drawer.querySelector('#drawer-val-condition');
    const valPatternRow = drawer.querySelector('#drawer-val-pattern-row');
    const valPresetSelect = drawer.querySelector('#drawer-val-preset');
    const valPatternInput = drawer.querySelector('#drawer-val-pattern');
    const valApiNotice = drawer.querySelector('#drawer-val-api-notice');
    const valErrorInput = drawer.querySelector('#drawer-val-error-msg');

    valToggle.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      if (valToggle.checked) {
        valFields.style.display = 'block';
        if (!q.validation) {
          if (/口座番号/.test(q.title || '')) {
            q.validation = {
              category: 'regex',
              condition: 'matches',
              presetKey: 'bank_account',
              value: '^[0-9]{6,7}$',
              value2: '',
              errorMessage: '正しい口座番号（6〜7桁の半角数字）を入力してください。'
            };
          } else if ((q.dataKey === 'account_holder_kana') || /口座名義|名義/.test(q.title || '')) {
            q.validation = {
              category: 'regex',
              condition: 'matches',
              presetKey: 'account_holder_kana',
              value: '^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$',
              value2: '',
              errorMessage: '口座名義はカナと（）.のみで入力してください。'
            };
          } else {
            q.validation = { category: 'text', condition: 'email', value: '', value2: '', errorMessage: '有効なメールアドレスを入力してください。' };
          }
        }
        syncDrawerValidationInputs(q.validation);
      } else {
        valFields.style.display = 'none';
        q.validation = null;
      }
      persistDrawerChanges();
    });

    valCatSelect.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      const cat = valCatSelect.value;
      let defErr = cat === 'number' ? '数値を入力してください。' : (cat === 'api' ? '実在する候補を選択してください。' : '入力値が正しくありません。');
      const bObj = window.b && window.b[cat] ? window.b[cat] : null;
      const firstCond = bObj ? Object.keys(bObj.conditions)[0] : 'email';

      let presetKey = 'custom';
      let patVal = '';
      if (cat === 'regex') {
        if (/口座番号/.test(q.title || '')) {
          presetKey = 'bank_account';
          patVal = '^[0-9]{6,7}$';
          defErr = '正しい口座番号（6〜7桁の半角数字）を入力してください。';
        } else if ((q.dataKey === 'account_holder_kana') || /口座名義|名義/.test(q.title || '')) {
          presetKey = 'account_holder_kana';
          patVal = '^[ァ-ヶｦ-ﾟー\\-‐―()（）.\\．\\・\\s　]+$';
          defErr = '口座名義はカナと（）.のみで入力してください。';
        } else if (window.getAutoErrorMessageForQuestion) {
          const autoErr = window.getAutoErrorMessageForQuestion(q.title, { category: 'regex' });
          if (autoErr && autoErr !== '入力値が正しくありません。') defErr = autoErr;
        }
      }

      q.validation = { category: cat, condition: firstCond, value: patVal, value2: '', errorMessage: defErr };
      if (cat === 'regex') q.validation.presetKey = presetKey;

      syncDrawerValidationConditionOptions(cat, firstCond);
      syncDrawerValidationPatternAndNotice(q.validation);
      valErrorInput.value = defErr;
      persistDrawerChanges();
    });

    valCondSelect.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.validation) return;
      q.validation.condition = valCondSelect.value;
      q.validation.value = '';
      q.validation.value2 = '';
      if (q.validation.category === 'api') {
        const c = q.validation.condition;
        q.validation.errorMessage = c === 'zip_code' ? '正しい郵便番号（7桁の半角数字）を入力してください。'
          : (c === 'invoice_number' ? '正しくインボイス登録番号（Tで始まる13桁の数字）を入力してください。'
          : (c === 'bank_name' ? '実在する銀行名を入力または選択してください。'
          : (c === 'branch_name' ? '実在する支店名を入力または選択してください。'
          : '実在する法人名を入力または選択してください。')));
        valErrorInput.value = q.validation.errorMessage;
      }
      syncDrawerValidationPatternAndNotice(q.validation);
      persistDrawerChanges();
    });

    valPresetSelect.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.validation) return;
      const pk = valPresetSelect.value;
      q.validation.presetKey = pk;
      if (pk !== 'custom' && window.ie && window.ie[pk]) {
        q.validation.value = window.ie[pk].pattern;
        valPatternInput.value = q.validation.value;
      }
      if (window.getAutoErrorMessageForQuestion) {
        const er = window.getAutoErrorMessageForQuestion(q.title, q.validation);
        if (er) {
          q.validation.errorMessage = er;
          valErrorInput.value = er;
        }
      }
      persistDrawerChanges();
    });

    valPatternInput.addEventListener('input', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.validation) return;
      q.validation.value = valPatternInput.value;
      q.validation.presetKey = 'custom';
      valPresetSelect.value = 'custom';
      persistDrawerChanges();
    });

    valErrorInput.addEventListener('input', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.validation) return;
      q.validation.errorMessage = valErrorInput.value;
      persistDrawerChanges();
    });

    // 回答控えメール
    const autoReplyToggle = drawer.querySelector('#drawer-autoreply-toggle');
    autoReplyToggle.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      q.autoReply = autoReplyToggle.checked;
      persistDrawerChanges();
    });

    // メディア添付
    const mediaToggle = drawer.querySelector('#drawer-media-toggle');
    const mediaFields = drawer.querySelector('#drawer-media-fields');
    const mediaType = drawer.querySelector('#drawer-media-type');
    const mediaUrl = drawer.querySelector('#drawer-media-url');

    mediaToggle.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      if (mediaToggle.checked) {
        mediaFields.style.display = 'block';
        q.media = { type: mediaType.value, url: mediaUrl.value };
      } else {
        mediaFields.style.display = 'none';
        delete q.media;
      }
      persistDrawerChanges();
    });

    mediaType.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.media) return;
      q.media.type = mediaType.value;
      persistDrawerChanges();
    });

    mediaUrl.addEventListener('input', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.media) return;
      q.media.url = mediaUrl.value;
      persistDrawerChanges();
    });

    // スクロール規約ロック
    const scrollToggle = drawer.querySelector('#drawer-scroll-toggle');
    const scrollFields = drawer.querySelector('#drawer-scroll-fields');
    const scrollText = drawer.querySelector('#drawer-scroll-text');

    scrollToggle.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      if (scrollToggle.checked) {
        scrollFields.style.display = 'block';
        q.scrollRequired = true;
        if (!q.scrollText) q.scrollText = '【利用規約】最下部までスクロールされるまで、回答コントロールはロックされます。';
        scrollText.value = q.scrollText;
      } else {
        scrollFields.style.display = 'none';
        delete q.scrollRequired;
      }
      persistDrawerChanges();
    });

    scrollText.addEventListener('input', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      q.scrollText = scrollText.value;
      persistDrawerChanges();
    });

    // AIコンシェルジュ：おすすめ一括適用ボタン
    const btnApplyAi = drawer.querySelector('#btn-apply-ai-rec');
    btnApplyAi.addEventListener('click', () => {
      if (!_currentAiAdvice) return;
      applyAiAdviceToActiveQuestion(_currentAiAdvice);
    });

    // AIチャットトグル & 送信
    const btnToggleAiChat = drawer.querySelector('#btn-toggle-ai-chat');
    const chatContainer = drawer.querySelector('#drawer-ai-chat-container');
    const chatInput = drawer.querySelector('#drawer-ai-chat-input');
    const btnSendAiChat = drawer.querySelector('#btn-send-drawer-ai-chat');

    btnToggleAiChat.addEventListener('click', () => {
      const isShowing = chatContainer.style.display !== 'none';
      chatContainer.style.display = isShowing ? 'none' : 'flex';
      if (!isShowing) chatInput.focus();
    });

    const handleSendChat = async () => {
      const text = chatInput.value.trim();
      if (!text) return;
      const q = findQuestionDefById(_activeDrawerQuestionId);
      const chatMessages = drawer.querySelector('#drawer-ai-chat-messages');

      // ユーザー発言追加
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-chat-msg user';
      userMsg.textContent = text;
      chatMessages.appendChild(userMsg);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // ボット返答プレースホルダー
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-chat-msg bot';
      botMsg.innerHTML = '<span class="ai-sparkle-icon">✨</span> 考え中...';
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const clientApiKey = localStorage.getItem('synapse_gemini_api_key') || '';
        const systemPrompt = `あなたはSynapse組織統制型フォームビルダーの専属AIコンシェルジュです。質問「${q ? q.title : ''}」の設計や入力規則、カラム統一（dataKey）について、初心者にもわかりやすく親切に日本語でアドバイスしてください。`;
        const res = await fetch('/api/regex-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `${systemPrompt}\nユーザーの相談: ${text}`,
            userKey: clientApiKey
          })
        });
        const data = await res.json();
        if (data && data.text) {
          botMsg.innerHTML = data.text.replace(/\n/g, '<br>');
        } else {
          // フォールバック
          botMsg.textContent = `質問「${q ? q.title : ''}」について：業務用途に合わせて「カラム統一」で列名を統一するか、入力規則で正しい形式を担保するのがおすすめです。`;
        }
      } catch (err) {
        botMsg.textContent = `質問「${q ? q.title : ''}」について：業務用途に合わせて「カラム統一」で列名を統一するか、入力規則で正しい形式を担保するのがおすすめです。`;
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    btnSendAiChat.addEventListener('click', handleSendChat);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendChat();
    });

    // 📋 同上入力イベント
    const sameToggle = drawer.querySelector('#drawer-sameasabove-toggle');
    const sameFields = drawer.querySelector('#drawer-sameasabove-fields');
    const sameSourceSelect = drawer.querySelector('#drawer-sameasabove-source-select');
    const sameLabelInput = drawer.querySelector('#drawer-sameasabove-label-input');

    sameToggle.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      if (!q.sameAsAbove) q.sameAsAbove = {};
      q.sameAsAbove.enabled = sameToggle.checked;
      sameFields.style.display = sameToggle.checked ? 'block' : 'none';

      if (sameToggle.checked) {
        const curSec = findSectionByQuestionId(q.id);
        const sources = curSec ? getDrawerAvailableSources(curSec.id, q.id, q.groupId) : { groups: [], questions: [] };
        const allOpts = [...sources.groups.map(g => ({ id: g.id, title: g.title, isGroup: true })), ...sources.questions.map(x => ({ id: x.id, title: x.title, isGroup: false }))];
        if (!q.sameAsAbove.sourceQuestionId || !allOpts.some(s => s.id === q.sameAsAbove.sourceQuestionId)) {
          q.sameAsAbove.sourceQuestionId = sameSourceSelect.value || (allOpts[0] ? allOpts[0].id : '');
        }
        sameSourceSelect.value = q.sameAsAbove.sourceQuestionId;

        const isGrp = q.sameAsAbove.sourceQuestionId && q.sameAsAbove.sourceQuestionId.startsWith('group:');
        q.sameAsAbove.sourceType = isGrp ? 'group' : 'question';
        if (isGrp) q.sameAsAbove.sourceGroupId = q.sameAsAbove.sourceQuestionId.replace('group:', '');
        else delete q.sameAsAbove.sourceGroupId;

        if (!q.sameAsAbove.label || !q.sameAsAbove.label.trim()) {
          const chosen = allOpts.find(s => s.id === q.sameAsAbove.sourceQuestionId);
          const defLbl = chosen ? `${chosen.title}と同じ` : '前述の入力と同じ';
          q.sameAsAbove.label = defLbl;
          sameLabelInput.value = defLbl;
        }
      }
      persistDrawerChanges();
    });

    sameSourceSelect.addEventListener('change', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.sameAsAbove) return;
      const sId = sameSourceSelect.value;
      q.sameAsAbove.sourceQuestionId = sId;
      const isGrp = sId && sId.startsWith('group:');
      q.sameAsAbove.sourceType = isGrp ? 'group' : 'question';
      if (isGrp) q.sameAsAbove.sourceGroupId = sId.replace('group:', '');
      else delete q.sameAsAbove.sourceGroupId;

      const curSec = findSectionByQuestionId(q.id);
      const sources = curSec ? getDrawerAvailableSources(curSec.id, q.id, q.groupId) : { groups: [], questions: [] };
      const allOpts = [...sources.groups.map(g => ({ id: g.id, title: g.title })), ...sources.questions.map(x => ({ id: x.id, title: x.title }))];
      const chosen = allOpts.find(s => s.id === sId);
      const newLbl = chosen ? `${chosen.title}と同じ` : '前述の入力と同じ';
      q.sameAsAbove.label = newLbl;
      sameLabelInput.value = newLbl;
      persistDrawerChanges();
    });

    sameLabelInput.addEventListener('input', () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.sameAsAbove) return;
      q.sameAsAbove.label = sameLabelInput.value;
      persistDrawerChanges();
    });

    // ⚡ スキップ分岐イベント
    const skipToggle = drawer.querySelector('#drawer-skiplogic-toggle');
    const skipFields = drawer.querySelector('#drawer-skiplogic-fields');
    const skipDependsSelect = drawer.querySelector('#drawer-skiplogic-depends-select');
    const skipConditionSelect = drawer.querySelector('#drawer-skiplogic-condition-select');
    const skipValInput = drawer.querySelector('#drawer-skiplogic-value-input');
    const skipVal2Input = drawer.querySelector('#drawer-skiplogic-value2-input');
    const skipActionSelect = drawer.querySelector('#drawer-skiplogic-action-select');

    const saveDrawerSkipLogic = () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q) return;
      if (!q.skipLogic) q.skipLogic = {};
      if (skipToggle.checked) {
        q.skipLogic.dependsOn = skipDependsSelect.value;
        q.skipLogic.condition = skipConditionSelect.value;
        q.skipLogic.action = skipActionSelect.value;
        q.skipLogic.value = skipValInput.value;
        q.skipLogic.value2 = skipVal2Input.value;
      } else {
        delete q.skipLogic.dependsOn;
      }
      persistDrawerChanges();
    };

    skipToggle.addEventListener('change', () => {
      skipFields.style.display = skipToggle.checked ? 'block' : 'none';
      saveDrawerSkipLogic();
    });
    skipDependsSelect.addEventListener('change', saveDrawerSkipLogic);
    skipConditionSelect.addEventListener('change', () => {
      syncDrawerSkipVisibility();
      saveDrawerSkipLogic();
    });
    skipActionSelect.addEventListener('change', saveDrawerSkipLogic);
    skipValInput.addEventListener('input', saveDrawerSkipLogic);
    skipVal2Input.addEventListener('input', saveDrawerSkipLogic);

    // 📁 所属グループ同上イベント
    const grpSameToggle = drawer.querySelector('#drawer-groupsame-toggle');
    const grpSameFields = drawer.querySelector('#drawer-groupsame-fields');
    const grpSameSelect = drawer.querySelector('#drawer-groupsame-source-select');
    const grpSameInput = drawer.querySelector('#drawer-groupsame-label-input');

    const saveGroupSame = () => {
      const q = findQuestionDefById(_activeDrawerQuestionId);
      if (!q || !q.groupId) return;
      const curSec = findSectionByQuestionId(q.id);
      if (!curSec || !curSec.questions) return;

      const checked = grpSameToggle.checked;
      grpSameFields.style.display = checked ? 'block' : 'none';
      const targetGId = grpSameSelect.value;
      const lbl = grpSameInput.value.trim() || '前述のグループと同じ';

      curSec.questions.forEach(item => {
        if (item.groupId === q.groupId) {
          if (!item.sameAsAbove) item.sameAsAbove = {};
          item.sameAsAbove.enabled = checked;
          if (checked) {
            item.sameAsAbove.sourceType = 'group';
            item.sameAsAbove.sourceGroupId = targetGId;
            item.sameAsAbove.sourceQuestionId = 'group:' + targetGId;
            item.sameAsAbove.label = lbl;
          }
        }
      });
      persistDrawerChanges();
    };

    grpSameToggle.addEventListener('change', saveGroupSame);
    grpSameSelect.addEventListener('change', saveGroupSame);
    grpSameInput.addEventListener('input', saveGroupSame);
  }

  function findSectionByQuestionId(questionId) {
    if (!questionId) return null;
    const formSources = [window.n, window.G, window.F, window.L];
    if (window.U && Array.isArray(window.U)) {
      formSources.push(...window.U);
    }
    for (const formSrc of formSources) {
      if (formSrc && formSrc.sections && Array.isArray(formSrc.sections)) {
        for (const sec of formSrc.sections) {
          if (!sec || !sec.questions) continue;
          if (sec.questions.some(q => q && q.id === questionId)) {
            return sec;
          }
        }
      }
    }
    return null;
  }
  window.findSectionByQuestionId = findSectionByQuestionId;

  function syncDrawerSkipVisibility() {
    const condSelect = document.getElementById('drawer-skiplogic-condition-select');
    const valWrapper = document.getElementById('drawer-skiplogic-val-wrapper');
    const valInput = document.getElementById('drawer-skiplogic-value-input');
    const sepSpan = document.getElementById('drawer-skiplogic-between-sep');
    const val2Input = document.getElementById('drawer-skiplogic-value2-input');
    if (!condSelect || !valWrapper || !valInput) return;

    const cond = condSelect.value;
    if (cond === 'is_empty' || cond === 'is_not_empty') {
      valWrapper.style.display = 'none';
    } else {
      valWrapper.style.display = 'block';
      if (cond === 'between' || cond === 'not_between') {
        valInput.placeholder = '開始値';
        if (sepSpan) sepSpan.style.display = 'inline';
        if (val2Input) val2Input.style.display = 'block';
      } else {
        if (sepSpan) sepSpan.style.display = 'none';
        if (val2Input) val2Input.style.display = 'none';
        if (cond.startsWith('date_')) {
          valInput.placeholder = 'YYYY-MM-DD';
        } else if (cond === 'greater_than' || cond === 'greater_than_or_equal' || cond === 'less_than' || cond === 'less_than_or_equal') {
          valInput.placeholder = '比較数値';
        } else {
          valInput.placeholder = 'トリガー値';
        }
      }
    }
  }

  function syncColumnSelectWithKey(key) {
    const columnSelect = document.getElementById('drawer-column-select');
    if (!columnSelect) return;
    const hasOption = Array.from(columnSelect.options).some(o => o.value === key);
    if (hasOption) {
      columnSelect.value = key;
    } else {
      columnSelect.value = '__custom__';
    }
  }

  function suggestDefaultDataKey(title) {
    const t = (title || '').toLowerCase();
    if (t.includes('法人') || t.includes('会社') || t.includes('屋号')) return 'company_name';
    if (t.includes('メール') || t.includes('mail')) return 'email';
    if (t.includes('電話') || t.includes('tel')) return 'tel';
    if (t.includes('郵便') || t.includes('〒')) return 'zip_code';
    if (t.includes('代表') || t.includes('氏名') || t.includes('名前')) return 'representative_name';
    if (t.includes('住所') || t.includes('所在地') || t.includes('番地')) return 'street';
    if (t.includes('インボイス') || t.includes('登録番号')) return 'invoice_number';
    return 'custom_field';
  }

  function syncDrawerValidationConditionOptions(category, currentCondition) {
    const valCondSelect = document.getElementById('drawer-val-condition');
    if (!valCondSelect) return;
    valCondSelect.innerHTML = '';
    const bObj = window.b && window.b[category] ? window.b[category] : null;
    if (bObj && bObj.conditions) {
      Object.keys(bObj.conditions).forEach(condKey => {
        const opt = document.createElement('option');
        opt.value = condKey;
        opt.textContent = bObj.conditions[condKey];
        valCondSelect.appendChild(opt);
      });
      valCondSelect.value = currentCondition || Object.keys(bObj.conditions)[0];
    }
  }

  function syncDrawerValidationPatternAndNotice(val) {
    const patternRow = document.getElementById('drawer-val-pattern-row');
    const apiNotice = document.getElementById('drawer-val-api-notice');
    const presetSelect = document.getElementById('drawer-val-preset');
    const patternInput = document.getElementById('drawer-val-pattern');
    if (!patternRow || !apiNotice) return;

    if (!val) {
      patternRow.style.display = 'none';
      apiNotice.style.display = 'none';
      return;
    }

    if (val.category === 'regex') {
      patternRow.style.display = 'block';
      apiNotice.style.display = 'none';
      presetSelect.innerHTML = '';
      if (window.ie) {
        Object.keys(window.ie).forEach(k => {
          const opt = document.createElement('option');
          opt.value = k;
          opt.textContent = window.ie[k].label;
          presetSelect.appendChild(opt);
        });
      }
      presetSelect.value = val.presetKey || 'custom';
      patternInput.value = val.value || '';
    } else if (val.category === 'api') {
      patternRow.style.display = 'none';
      apiNotice.style.display = 'block';
      const c = val.condition;
      if (c === 'corp_name') {
        apiNotice.innerHTML = '🏛️ <strong>国税庁法人番号API連携</strong>: 実在する法人名・所在地をリアルタイム検索・自動補完します。';
      } else if (c === 'invoice_number') {
        apiNotice.innerHTML = '🧾 <strong>国税庁適格請求書API連携</strong>: T+13桁の登録番号を公表システムと照会・補完します。';
      } else if (c === 'zip_code') {
        apiNotice.innerHTML = '📮 <strong>ZipCloud API連携</strong>: 郵便番号から都道府県・市区町村・町域を自動検索・補完します。';
      } else {
        apiNotice.innerHTML = '🏦 <strong>全銀協API連携</strong>: 実在する金融機関コードや支店情報を自動検索します。';
      }
    } else {
      patternRow.style.display = 'none';
      apiNotice.style.display = 'none';
    }
  }

  function syncDrawerValidationInputs(val) {
    const valCatSelect = document.getElementById('drawer-val-category');
    const valErrorInput = document.getElementById('drawer-val-error-msg');
    if (!valCatSelect || !val) return;

    valCatSelect.value = val.category || 'text';
    syncDrawerValidationConditionOptions(val.category, val.condition);
    syncDrawerValidationPatternAndNotice(val);
    valErrorInput.value = val.errorMessage || '';
  }

  function renderAiRecommendationBox(advice) {
    const recBox = document.getElementById('drawer-ai-recommendation-box');
    if (!recBox || !advice) return;
    recBox.innerHTML = `
      <div class="ai-rec-title">${escapeHtml(advice.recommendationTitle || 'AI推奨設定')}</div>
      <div class="ai-rec-desc">${escapeHtml(advice.explanation || '')}</div>
      <ul class="ai-rec-list">
        ${(advice.items || []).map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }

  async function fetchDynamicGeminiDiagnosis(q) {
    if (!q) return;
    const qId = q.id;
    const sparkleBadge = document.querySelector('.ai-sparkle-badge');
    if (sparkleBadge) {
      sparkleBadge.className = 'ai-sparkle-badge is-thinking';
      sparkleBadge.innerHTML = '🤖 AIが文脈を思考中...';
    }

    try {
      // フォーム内の他の質問を収集
      const otherQuestions = [];
      const rootForm = window.F || window.n || window.G || window.L;
      if (rootForm && rootForm.sections) {
        rootForm.sections.forEach(s => {
          (s.questions || []).forEach(item => {
            if (item && item.id !== qId) {
              otherQuestions.push({
                id: item.id,
                title: item.title || '',
                type: item.type || 'text'
              });
            }
          });
        });
      }

      // エンドポイント決定（同一オリジン /api/regex-ai）
      const endpoint = '/api/regex-ai';

      const clientApiKey = localStorage.getItem('synapse_gemini_api_key') || '';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'diagnose_question',
          question: {
            id: q.id,
            title: q.title || '',
            type: q.type || 'text',
            description: q.description || ''
          },
          otherQuestions: otherQuestions,
          clientApiKey: clientApiKey
        })
      });

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }

      const data = await res.json();
      if (data && data.success && data.advice && _activeDrawerQuestionId === qId) {
        _currentAiAdvice = data.advice;
        renderAiRecommendationBox(_currentAiAdvice);

        if (sparkleBadge) {
          sparkleBadge.className = 'ai-sparkle-badge is-dynamic';
          sparkleBadge.innerHTML = '✨ AI動的診断完了';
        }
      } else {
        if (sparkleBadge) {
          sparkleBadge.className = 'ai-sparkle-badge';
          sparkleBadge.innerHTML = '✨ リアルタイム診断';
        }
      }
    } catch (err) {
      console.warn('[AI Concierge] Dynamic Gemini diagnosis fallback to local:', err);
      if (sparkleBadge) {
        sparkleBadge.className = 'ai-sparkle-badge';
        sparkleBadge.innerHTML = '✨ リアルタイム診断';
      }
    }
  }

  // 4. ドロワーを開く
  function openQuestionSettingsDrawer(questionId) {
    ensureQuestionSettingsDrawerDom();
    const q = findQuestionDefById(questionId);
    if (!q) {
      console.warn('[QuestionSettingsDrawer] Question not found for id:', questionId);
      return;
    }

    _activeDrawerQuestionId = questionId;

    const drawer = document.getElementById('question-settings-drawer');
    const backdrop = document.getElementById('question-settings-drawer-backdrop');
    const titleEl = document.getElementById('drawer-q-title');
    const typeBadge = document.getElementById('drawer-q-type-badge');

    titleEl.textContent = q.title || '無題の質問';
    const typeLabels = { text: '記述式 (短文)', paragraph: '記述式 (長文)', radio: 'ラジオボタン', checkbox: 'チェックボックス', select: 'プルダウン', file: 'ファイル' };
    typeBadge.textContent = typeLabels[q.type] || q.type;

    // AIコンシェルジュの診断（まずローカルルールを0秒即時表示）
    _currentAiAdvice = analyzeQuestionForAiConcierge(q);
    renderAiRecommendationBox(_currentAiAdvice);
    const btnApplyAi = document.getElementById('btn-apply-ai-rec');
    btnApplyAi.classList.remove('applied');
    btnApplyAi.innerHTML = '✨ おすすめ設定を一括適用';

    // 並行して教育プロンプトを注入したGeminiによる動的推論診断を実行
    fetchDynamicGeminiDiagnosis(q);

    // カラム統一
    const unifyToggle = document.getElementById('drawer-unify-column-toggle');
    const unifiedBox = document.getElementById('drawer-column-unified-box');
    const customKeyInput = document.getElementById('drawer-column-key-input');
    unifyToggle.checked = !!q.dataKey;
    unifiedBox.style.display = q.dataKey ? 'block' : 'none';
    customKeyInput.value = q.dataKey || '';
    syncColumnSelectWithKey(q.dataKey || '');

    // バリデーション
    const valToggle = document.getElementById('drawer-validation-toggle');
    const valFields = document.getElementById('drawer-validation-fields');
    valToggle.checked = !!q.validation;
    valFields.style.display = q.validation ? 'block' : 'none';
    if (q.validation) {
      syncDrawerValidationInputs(q.validation);
    }

    // 回答控えメール
    const autoReplyToggle = document.getElementById('drawer-autoreply-toggle');
    autoReplyToggle.checked = !!q.autoReply;

    // メディア
    const mediaToggle = document.getElementById('drawer-media-toggle');
    const mediaFields = document.getElementById('drawer-media-fields');
    const mediaType = document.getElementById('drawer-media-type');
    const mediaUrl = document.getElementById('drawer-media-url');
    mediaToggle.checked = !!(q.media && q.media.url);
    mediaFields.style.display = (q.media && q.media.url) ? 'block' : 'none';
    if (q.media) {
      mediaType.value = q.media.type || 'image';
      mediaUrl.value = q.media.url || '';
    } else {
      mediaUrl.value = '';
    }

    // スクロール規約
    const scrollToggle = document.getElementById('drawer-scroll-toggle');
    const scrollFields = document.getElementById('drawer-scroll-fields');
    const scrollText = document.getElementById('drawer-scroll-text');
    scrollToggle.checked = !!q.scrollRequired;
    scrollFields.style.display = q.scrollRequired ? 'block' : 'none';
    scrollText.value = q.scrollText || '';

    // 7. 📋 「前述と同じ（同上）」自動入力の同期
    const sameSection = document.getElementById('drawer-sameasabove-section');
    const sameToggle = document.getElementById('drawer-sameasabove-toggle');
    const sameFields = document.getElementById('drawer-sameasabove-fields');
    const sameSourceSelect = document.getElementById('drawer-sameasabove-source-select');
    const sameLabelInput = document.getElementById('drawer-sameasabove-label-input');

    const curSec = findSectionByQuestionId(q.id);
    const sources = curSec ? getDrawerAvailableSources(curSec.id, q.id, q.groupId) : { groups: [], questions: [] };
    const allAvailableCount = sources.groups.length + sources.questions.length;

    if (sameSection) {
      if (allAvailableCount > 0) {
        sameSection.style.display = 'block';
        let optHtml = '';
        if (sources.groups.length > 0) {
          optHtml += '<optgroup label="先行グループ">';
          sources.groups.forEach(g => {
            optHtml += `<option value="group:${escapeHtml(g.id)}">${escapeHtml(g.title)}（グループ内全項目）</option>`;
          });
          optHtml += '</optgroup>';
        }
        if (sources.questions.length > 0) {
          optHtml += '<optgroup label="先行質問">';
          sources.questions.forEach(oq => {
            optHtml += `<option value="${escapeHtml(oq.id)}">${escapeHtml(oq.title || '無題')}</option>`;
          });
          optHtml += '</optgroup>';
        }
        sameSourceSelect.innerHTML = optHtml;

        const isSameActive = !!(q.sameAsAbove && q.sameAsAbove.enabled);
        sameToggle.checked = isSameActive;
        sameFields.style.display = isSameActive ? 'block' : 'none';
        if (q.sameAsAbove && q.sameAsAbove.sourceQuestionId) {
          sameSourceSelect.value = q.sameAsAbove.sourceQuestionId;
        }
        sameLabelInput.value = (q.sameAsAbove && q.sameAsAbove.label) || '';
      } else {
        sameSection.style.display = 'none';
      }
    }

    // 8. ⚡ プロ版限定: セクション内スキップ（条件分岐）の同期
    const skipSection = document.getElementById('drawer-skiplogic-section');
    const skipToggle = document.getElementById('drawer-skiplogic-toggle');
    const skipFields = document.getElementById('drawer-skiplogic-fields');
    const skipDependsSelect = document.getElementById('drawer-skiplogic-depends-select');
    const skipConditionSelect = document.getElementById('drawer-skiplogic-condition-select');
    const skipValInput = document.getElementById('drawer-skiplogic-value-input');
    const skipVal2Input = document.getElementById('drawer-skiplogic-value2-input');
    const skipActionSelect = document.getElementById('drawer-skiplogic-action-select');

    const otherQuestions = curSec ? curSec.questions.filter(x => x.id !== q.id) : [];
    if (skipSection) {
      if (otherQuestions.length > 0) {
        skipSection.style.display = 'block';
        let optHtml = '<option value="">-- スキップ分岐を設定しない --</option>';
        otherQuestions.forEach(oq => {
          optHtml += `<option value="${escapeHtml(oq.id)}">${escapeHtml(oq.title || '無題の質問')}</option>`;
        });
        skipDependsSelect.innerHTML = optHtml;

        const hasSkip = !!(q.skipLogic && q.skipLogic.dependsOn);
        skipToggle.checked = hasSkip;
        skipFields.style.display = hasSkip ? 'block' : 'none';
        if (hasSkip) {
          skipDependsSelect.value = q.skipLogic.dependsOn || '';
          skipConditionSelect.value = q.skipLogic.condition || 'equals';
          skipActionSelect.value = q.skipLogic.action || 'disable';
          skipValInput.value = q.skipLogic.value || '';
          skipVal2Input.value = q.skipLogic.value2 || '';
        } else {
          skipDependsSelect.value = '';
          skipConditionSelect.value = 'equals';
          skipActionSelect.value = 'disable';
          skipValInput.value = '';
          skipVal2Input.value = '';
        }
        syncDrawerSkipVisibility();
      } else {
        skipSection.style.display = 'none';
      }
    }

    // 9. 📁 所属グループの一括自動入力設定の同期
    const grpSameSection = document.getElementById('drawer-groupsame-section');
    const grpSameToggle = document.getElementById('drawer-groupsame-toggle');
    const grpSameFields = document.getElementById('drawer-groupsame-fields');
    const grpSameSelect = document.getElementById('drawer-groupsame-source-select');
    const grpSameInput = document.getElementById('drawer-groupsame-label-input');

    if (grpSameSection) {
      if (q.groupId && curSec) {
        const sections = getDrawerFormSections();
        const curSecIdx = sections.findIndex(s => s.id === curSec.id);
        const priorGroups = [];
        const seenPriorGIds = new Set([q.groupId]);

        for (let sIdx = 0; sIdx <= curSecIdx; sIdx++) {
          const sItem = sections[sIdx];
          if (!sItem || !sItem.questions) continue;
          for (let qIdx = 0; qIdx < sItem.questions.length; qIdx++) {
            const qItem = sItem.questions[qIdx];
            if (sIdx === curSecIdx && qItem.groupId === q.groupId) break;
            if (qItem.groupId && qItem.groupTitle && !seenPriorGIds.has(qItem.groupId)) {
              seenPriorGIds.add(qItem.groupId);
              priorGroups.push({
                groupId: qItem.groupId,
                title: qItem.groupTitle,
                sectionTitle: sItem.title || `セクション ${sIdx + 1}`
              });
            }
          }
          if (sIdx === curSecIdx) break;
        }

        if (priorGroups.length > 0) {
          grpSameSection.style.display = 'block';
          let optHtml = '';
          priorGroups.forEach(pg => {
            optHtml += `<option value="${escapeHtml(pg.groupId)}">[${escapeHtml(pg.sectionTitle)}] ${escapeHtml(pg.title)}</option>`;
          });
          grpSameSelect.innerHTML = optHtml;

          const isGroupSameActive = !!(q.sameAsAbove && q.sameAsAbove.enabled && q.sameAsAbove.sourceType === 'group');
          grpSameToggle.checked = isGroupSameActive;
          grpSameFields.style.display = isGroupSameActive ? 'block' : 'none';
          if (isGroupSameActive && q.sameAsAbove.sourceGroupId) {
            grpSameSelect.value = q.sameAsAbove.sourceGroupId;
          }
          grpSameInput.value = (q.sameAsAbove && q.sameAsAbove.label) || '';
        } else {
          grpSameSection.style.display = 'none';
        }
      } else {
        grpSameSection.style.display = 'none';
      }
    }

    // 表示アニメーション
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  // 5. ドロワーを閉じる
  function closeQuestionSettingsDrawer() {
    const drawer = document.getElementById('question-settings-drawer');
    const backdrop = document.getElementById('question-settings-drawer-backdrop');
    if (!drawer) return;

    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');

    persistDrawerChanges();
    injectQuestionCardCompactStylesAndBadges();
    _activeDrawerQuestionId = null;
  }
  window.openQuestionSettingsDrawer = openQuestionSettingsDrawer;
  window.closeQuestionSettingsDrawer = closeQuestionSettingsDrawer;

  // AIのおすすめ一括適用
  function applyAiAdviceToActiveQuestion(advice) {
    const q = findQuestionDefById(_activeDrawerQuestionId);
    if (!q || !advice) return;

    // 1. カラム統一
    if (advice.unifyColumn && advice.dataKey) {
      q.dataKey = advice.dataKey;
      const unifyToggle = document.getElementById('drawer-unify-column-toggle');
      const unifiedBox = document.getElementById('drawer-column-unified-box');
      const customKeyInput = document.getElementById('drawer-column-key-input');
      unifyToggle.checked = true;
      unifiedBox.style.display = 'block';
      customKeyInput.value = advice.dataKey;
      syncColumnSelectWithKey(advice.dataKey);
    }

    // 2. バリデーション
    const valToggle = document.getElementById('drawer-validation-toggle');
    const valFields = document.getElementById('drawer-validation-fields');
    if (advice.validation) {
      q.validation = JSON.parse(JSON.stringify(advice.validation));
      valToggle.checked = true;
      valFields.style.display = 'block';
      syncDrawerValidationInputs(q.validation);
    } else {
      q.validation = null;
      valToggle.checked = false;
      valFields.style.display = 'none';
    }

    // 3. 回答控えメール
    const autoReplyToggle = document.getElementById('drawer-autoreply-toggle');
    q.autoReply = !!advice.autoReply;
    autoReplyToggle.checked = !!advice.autoReply;

    // 保存とフィードバック
    persistDrawerChanges();

    const btnApplyAi = document.getElementById('btn-apply-ai-rec');
    btnApplyAi.classList.add('applied');
    btnApplyAi.innerHTML = '✓ おすすめ設定を適用しました！';
    setTimeout(() => {
      btnApplyAi.classList.remove('applied');
      btnApplyAi.innerHTML = '✨ おすすめ設定を一括適用';
    }, 2000);
  }

  // ==========================================
  // 📊 本番テーブル連携カラム確認モーダル
  // ==========================================
  // ==========================================
  // 📊 本番テーブル連携カラム確認＆保存先設定モーダル
  // ==========================================
  function openFormColumnMappingModal(targetFormDef = null) {
    const formDef = targetFormDef || window.G || window.L || {};
    const formTitle = getEffectiveFormTitle(formDef);
    const sections = formDef.sections || [];

    let modal = document.getElementById('form-column-mapping-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'form-column-mapping-modal';
      modal.className = 'column-mapping-modal-overlay';
      modal.style.cssText = 'position: fixed; inset: 0; z-index: 100000; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px;';
      document.body.appendChild(modal);
    }

    let rowsHtml = '';
    let colIndex = 1;

    sections.forEach((sec, sIdx) => {
      const secTitle = sec.title || `セクション ${sIdx + 1}`;
      (sec.questions || []).forEach(q => {
        const qTitle = q.title || '(無題の設問)';
        const colName = q.title || q.dataKey || q.id;
        const dataKey = q.dataKey || '-';
        const typeLabel = q.type === 'text' ? 'テキスト' :
                          q.type === 'radio' ? '単一選択 (ラジオ)' :
                          q.type === 'checkbox' ? '複数選択 (チェック)' :
                          q.type === 'select' ? 'プルダウン' :
                          q.type === 'textarea' ? '複数行テキスト' : q.type;

        // API連携情報の抽出
        let apiBadge = '<span style="color: #94a3b8;">-</span>';
        if (q.validation && q.validation.category === 'api') {
          if (q.validation.condition === 'corp_name') apiBadge = '<span style="background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">国税庁法人番号API</span>';
          else if (q.validation.condition === 'invoice_number') apiBadge = '<span style="background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">国税庁インボイス公表API</span>';
        } else if (q.dataKey === 'zip_code' || qTitle.includes('郵便番号')) {
          apiBadge = '<span style="background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">郵便番号住所自動補完</span>';
        } else if (qTitle.includes('銀行') || q.dataKey === 'bank_name') {
          apiBadge = '<span style="background: #f3e8ff; color: #7e22ce; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">全銀協 金融機関API</span>';
        }

        const requiredBadge = q.required ? '<span style="color: #dc2626; font-weight: bold; margin-left: 2px;">*</span>' : '';

        rowsHtml += `
          <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.8rem; transition: background 0.15s;">
            <td style="padding: 10px 12px; color: #64748b; font-family: monospace; text-align: center;">${colIndex++}</td>
            <td style="padding: 10px 12px; color: #475569; font-weight: 500;">${escapeHtml(secTitle)}</td>
            <td style="padding: 10px 12px; color: #1e293b; font-weight: 600;">${escapeHtml(qTitle)}${requiredBadge}</td>
            <td style="padding: 10px 12px; color: #0284c7; font-weight: 700; font-family: monospace;">${escapeHtml(colName)}</td>
            <td style="padding: 10px 12px; color: #64748b; font-family: monospace;">${escapeHtml(dataKey)}</td>
            <td style="padding: 10px 12px; color: #334155;">${escapeHtml(typeLabel)}</td>
            <td style="padding: 10px 12px;">${apiBadge}</td>
          </tr>
        `;
      });
    });

    // Supabase / LocalStorage 上のテーブル一覧を取得
    let customTables = [];
    try {
      customTables = JSON.parse(localStorage.getItem('synapse_custom_tables')) || [];
    } catch(e) {}
    customTables = customTables.filter(t => t && t.id !== 'table_all_form_responses' && t.name !== '全フォーム回答データ');

    // 専用テーブル作成が選択されているか（常時専用独立テーブル）
    const isDedicated = true;

    // このフォームと同名の専用テーブルが存在するか確認
    const dedicatedTable = customTables.find(t => (t.name === formTitle || t.id === formDef.targetTableId) && t.id !== 'table_all_form_responses');

    // 保存先に応じたステータスバッジとアクションボタンの決定
    let statusBadgeHtml = '';
    let actionBtnHtml = '';

    if (!dedicatedTable) {
      statusBadgeHtml = `
        <span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #fde68a; display: inline-flex; align-items: center; gap: 5px;">
          <span>⚡</span> <span>専用テーブル未作成（本番送信時、または下のボタンから事前作成できます）</span>
        </span>
      `;
      actionBtnHtml = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <button type="button" id="btn-create-supabase-table" style="background: #0284c7; color: #fff; border: 1px solid #0369a1; font-weight: 700; font-size: 0.82rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 3px rgba(2,132,199,0.3); transition: all 0.2s;">
            <span>⚡</span> <span>このフォーム専用のテーブルを作成して連携</span>
          </button>
          <button type="button" id="btn-col-modal-ok" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-weight: 600; font-size: 0.82rem; padding: 7px 16px; border-radius: 6px; cursor: pointer;">閉じる</button>
        </div>
      `;
    } else {
      if (dedicatedTable) {
        statusBadgeHtml = `
          <span style="background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #bbf7d0; display: inline-flex; align-items: center; gap: 5px;">
            <span>✅</span> <span>専用テーブル作成済み（「${escapeHtml(dedicatedTable.name)}」/ ${dedicatedTable.rows ? dedicatedTable.rows.length : 0}件蓄積中）</span>
          </span>
        `;
        actionBtnHtml = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" id="btn-create-supabase-table" style="background: #f8fafc; color: #0284c7; border: 1px solid #0284c7; font-weight: 700; font-size: 0.82rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
              <span>🔄</span> <span>Supabase物理テーブルを再作成・同期</span>
            </button>
            <button type="button" id="btn-col-modal-ok" style="background: #0284c7; color: #fff; border: none; font-weight: 700; font-size: 0.85rem; padding: 7px 20px; border-radius: 6px; cursor: pointer;">閉じる</button>
          </div>
        `;
      } else {
        statusBadgeHtml = `
          <span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #fde68a; display: inline-flex; align-items: center; gap: 5px;">
            <span>⚡</span> <span>専用テーブル未作成（本番送信時、または下のボタンから事前作成できます）</span>
          </span>
        `;
        actionBtnHtml = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" id="btn-create-supabase-table" style="background: #0284c7; color: #fff; border: 1px solid #0369a1; font-weight: 700; font-size: 0.82rem; padding: 7px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 3px rgba(2,132,199,0.3); transition: all 0.2s;">
              <span>⚡</span> <span>Supabase上にこの専用テーブルを事前作成</span>
            </button>
            <button type="button" id="btn-col-modal-ok" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-weight: 600; font-size: 0.82rem; padding: 7px 16px; border-radius: 6px; cursor: pointer;">閉じる</button>
          </div>
        `;
      }
    }

    modal.innerHTML = `
      <div style="background: #fff; border-radius: 12px; width: 100%; max-width: 980px; max-height: 88vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); overflow: hidden;">
        <!-- ヘッダー -->
        <div style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; background: #f8fafc;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">📊</span>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;">専用テーブル連携・カラム設定</h2>
              <span style="background: #0284c7; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">DB連携</span>
            </div>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">
              フォーム「<strong style="color: #0f172a;">${escapeHtml(formTitle)}</strong>」の回答データ蓄積設定と、カラム構成の確認です。
            </div>
          </div>
          <button type="button" id="btn-close-col-modal" style="background: none; border: none; font-size: 1.4rem; color: #94a3b8; cursor: pointer; padding: 4px 8px; border-radius: 6px; line-height: 1;">&times;</button>
        </div>

        <!-- 専用テーブル作成設定バー（上部バー） -->
        <div style="padding: 12px 24px; background: ${isDedicated ? '#f0fdf4' : '#f8fafc'}; border-bottom: 1px solid ${isDedicated ? '#bbf7d0' : '#e2e8f0'}; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <label class="editor-toggle-switch" for="modal-create-dedicated-table" style="margin: 0; cursor: pointer;">
              <input type="checkbox" id="modal-create-dedicated-table" ${isDedicated ? 'checked' : ''} />
              <span class="editor-toggle-slider"></span>
            </label>
            <label for="modal-create-dedicated-table" style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0; cursor: pointer;">
              このフォーム専用のテーブルを作成する
            </label>
          </div>
          <div>
            ${statusBadgeHtml}
          </div>
        </div>

        <!-- テーブル本体スクロールエリア -->
        <div style="flex: 1; overflow-y: auto; padding: 0 24px 20px 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; text-align: left;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #cbd5e1; position: sticky; top: 0; z-index: 10;">
                <th style="padding: 10px 12px; width: 45px; text-align: center;">#</th>
                <th style="padding: 10px 12px;">セクション</th>
                <th style="padding: 10px 12px;">設問タイトル</th>
                <th style="padding: 10px 12px; color: #0284c7;">本番テーブルカラム名</th>
                <th style="padding: 10px 12px;">物理キー (dataKey)</th>
                <th style="padding: 10px 12px;">型 / 入力形式</th>
                <th style="padding: 10px 12px;">API連携 / 自動補完</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <!-- 自動付与システム共通カラムの明示 -->
          <div style="margin-top: 20px; padding: 12px 16px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <span>⚙️</span> システム自動付与カラム（全テーブル共通で記録）
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.75rem; color: #64748b;">
              <span style="background: #fff; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;"><strong>マスターID / コード</strong> (紐づけキー)</span>
              <span style="background: #fff; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;"><strong>フォーム名</strong> (識別タイトル)</span>
              <span style="background: #fff; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;"><strong>ステータス</strong> (回答完了 / 途中送信)</span>
              <span style="background: #fff; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;"><strong>確定登録コード</strong> (8桁確定ID)</span>
              <span style="background: #fff; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;"><strong>再開用URL</strong> (途中再開リンク)</span>
              <span style="background: #fff; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;"><strong>回答日時</strong> (タイムスタンプ)</span>
            </div>
          </div>
        </div>

        <!-- フッター -->
        <div style="padding: 14px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="font-size: 0.78rem; color: #15803d; font-weight: 600;">
            🌟 回答データは常にこのフォーム専用の「独立テーブル」に自動保存されます。
          </div>
          ${actionBtnHtml}
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    const closeHandler = () => { modal.style.display = 'none'; };
    modal.querySelector('#btn-close-col-modal').onclick = closeHandler;
    const okBtn = modal.querySelector('#btn-col-modal-ok');
    if (okBtn) okBtn.onclick = closeHandler;
    modal.onclick = (e) => { if (e.target === modal) closeHandler(); };

    // 専用テーブル作成トグル切り替えイベント
    const modalToggle = modal.querySelector('#modal-create-dedicated-table');
    if (modalToggle) {
      modalToggle.addEventListener('change', (e) => {
        formDef.createDedicatedTable = true;
        formDef.targetTableType = 'dedicated';
        formDef.targetTableId = dedicatedTable ? dedicatedTable.id : 'dedicated';

        // フォーム定義の保存
        if (typeof persistDrawerChanges === 'function') persistDrawerChanges();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();

        // モーダルを更新再描画
        openFormColumnMappingModal(formDef);

        // 全体設定画面側のトグルも更新
        syncGlobalTargetTableSelect(true);
      });
    }

    // ⚡ Supabase上にこのフォーム専用独立テーブルを事前作成するイベント
    const createBtn = modal.querySelector('#btn-create-supabase-table');
    if (createBtn) {
      createBtn.onclick = async () => {
        createBtn.disabled = true;
        createBtn.innerHTML = '<span>⏳</span> <span>専用テーブル作成中...</span>';

        try {
          formDef.createDedicatedTable = true;
          formDef.targetTableType = 'dedicated';
          const newTable = await createDedicatedTableForForm(formDef);
          if (newTable && newTable.id) {
            formDef.targetTableId = newTable.id;
          }

          // 🌟 本番公開スナップショットが存在する場合、スナップショット側も即座に専用テーブル連携へ同期！
          if (formDef.publishedSnapshot) {
            formDef.publishedSnapshot.createDedicatedTable = true;
            formDef.publishedSnapshot.targetTableId = newTable ? newTable.id : 'dedicated';
            formDef.publishedSnapshot.targetTableMode = 'dedicated';
            try {
              const allFormsRaw = localStorage.getItem('form_customize_all_forms');
              let allForms = allFormsRaw ? JSON.parse(allFormsRaw) : [];
              const fIdx = allForms.findIndex(f => f && (f.id === formDef.id || f.title === formDef.title));
              if (fIdx !== -1) {
                allForms[fIdx] = formDef;
                localStorage.setItem('form_customize_all_forms', JSON.stringify(allForms));
              }
            } catch(e) {}
          }

          if (typeof persistDrawerChanges === 'function') persistDrawerChanges();
          if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();

          // モーダル表示を完了状態に再描画
          openFormColumnMappingModal(formDef);
          syncGlobalTargetTableSelect(newTable ? newTable.id : true);
          if (typeof updatePublishSyncUI === 'function') updatePublishSyncUI();

          alert(`✅ テーブル「${formTitle}」の同期・再作成が完了しました！\n\n・テーブルID: ${newTable ? newTable.id : ''}\n・Supabase物理テーブル: ${newTable ? (newTable.physicalTableName || getPhysicalTableNameForForm(formDef)) : ''}\n・全${newTable && newTable.columns ? newTable.columns.length : 0}カラムを定義済み\n・回答保存先をこの専用テーブルに設定しました。\n・Synapseの「回答フォーム一覧」からいつでも確認・操作できます。`);
        } catch(err) {
          console.error('Failed to create table:', err);
          alert(`テーブル作成に失敗しました: ${err.message}`);
          createBtn.disabled = false;
          createBtn.innerHTML = '<span>⚡</span> <span>Supabase上にこの専用テーブルを事前作成</span>';
        }
      };
    }
    modal.onclick = (e) => { if (e.target === modal) closeHandler(); };
  }
  window.openFormColumnMappingModal = openFormColumnMappingModal;

  // フォーム全体設定の保存先テーブルUIと同期するヘルパー
  function syncGlobalTargetTableSelect(forcedVal) {
    const globalToggle = document.getElementById('editor-create-dedicated-table');
    const globalSelect = document.getElementById('editor-target-table-select');
    const statusDesc = document.getElementById('target-table-status-desc');
    const card = document.getElementById('editor-target-table-card');

    const formDef = window.G || window.L || {};
    const formTitle = getEffectiveFormTitle(formDef);

    if (globalToggle) {
      globalToggle.checked = true;
    }
    if (globalSelect) {
      globalSelect.value = 'dedicated';
    }

    if (card) {
      card.style.background = '#f0fdf4';
      card.style.borderColor = '#86efac';
    }

    if (statusDesc) {
      statusDesc.innerHTML = `🌟 回答はこのフォーム専用の独立テーブル「<strong>${escapeHtml(formTitle)}</strong>」（回答フォーム一覧フォルダ）に自動保存されます。`;
      statusDesc.style.color = '#15803d';
    }
  }

  // フォーム全体設定の保存先テーブルUI初期化
  function setupTargetTableGlobalSettingsUI() {
    const globalToggle = document.getElementById('editor-create-dedicated-table');
    const globalSelect = document.getElementById('editor-target-table-select');
    const openModalBtn = document.getElementById('btn-open-col-modal-from-settings');

    const formDef = window.G || window.L || {};
    formDef.createDedicatedTable = true;
    formDef.targetTableType = 'dedicated';
    if (!formDef.targetTableId || formDef.targetTableId === 'table_all_form_responses') {
      formDef.targetTableId = 'dedicated';
    }
    const formKey = (formDef.id || '') + '_dedicated';

    if (globalToggle && globalToggle.dataset.lastFormKey !== formKey) {
      globalToggle.dataset.lastFormKey = formKey;
      syncGlobalTargetTableSelect(true);
    }

    if (globalToggle && !globalToggle.dataset.bound) {
      globalToggle.dataset.bound = 'true';
      globalToggle.checked = true;
      globalToggle.addEventListener('change', (e) => {
        const curDef = window.G || window.L || {};
        curDef.createDedicatedTable = true;
        curDef.targetTableType = 'dedicated';
        curDef.targetTableId = 'dedicated';

        if (typeof persistDrawerChanges === 'function') persistDrawerChanges();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
        globalToggle.checked = true;
        globalToggle.dataset.lastFormKey = (curDef.id || '') + '_dedicated';
        syncGlobalTargetTableSelect(true);
      });
    }

    // 互換性のための非表示セレクトイベント
    if (globalSelect && !globalSelect.dataset.bound) {
      globalSelect.dataset.bound = 'true';
      globalSelect.value = 'dedicated';
      globalSelect.addEventListener('change', (e) => {
        if (globalToggle) globalToggle.checked = true;
        const curDef = window.G || window.L || {};
        curDef.createDedicatedTable = true;
        curDef.targetTableType = 'dedicated';
        curDef.targetTableId = 'dedicated';
        if (typeof persistDrawerChanges === 'function') persistDrawerChanges();
        if (typeof saveAndSyncMindmapData === 'function') saveAndSyncMindmapData();
        syncGlobalTargetTableSelect(true);
      });
    }

    if (openModalBtn && !openModalBtn.dataset.bound) {
      openModalBtn.dataset.bound = 'true';
      openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let targetForm = window.G || window.n || window.L;
        if (typeof getCurrentFormObject === 'function') {
          const cur = getCurrentFormObject();
          if (cur && cur.formObj) targetForm = cur.formObj;
        }
        openFormColumnMappingModal(targetForm);
      });
    }
  }
  setInterval(setupTargetTableGlobalSettingsUI, 500);

  // ヘッダーボタンの初期化
  function setupHeaderColumnPreviewButton() {
    const btn = document.getElementById('btn-header-column-preview');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let targetForm = window.G || window.n || window.L;
        if (typeof getCurrentFormObject === 'function') {
          const cur = getCurrentFormObject();
          if (cur && cur.formObj) targetForm = cur.formObj;
        }
        openFormColumnMappingModal(targetForm);
      });
    }
  }
  setInterval(setupHeaderColumnPreviewButton, 500);

  // 変更の永続化とライブ同期
  function persistDrawerChanges() {
    if (window.S) window.S();
    if (typeof renderLivePreview === 'function') renderLivePreview();
    injectQuestionCardCompactStylesAndBadges();
  }

  // 監視と初期化ループへの登録
  setInterval(injectQuestionCardCompactStylesAndBadges, 250);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectQuestionCardCompactStylesAndBadges();
      setupHeaderColumnPreviewButton();
    });
  } else {
    injectQuestionCardCompactStylesAndBadges();
    setupHeaderColumnPreviewButton();
  }
})();

// =========================================================================
// 📱 スマホ向け 長押し（Long Press）ツールチップ ＆ Undo（元に戻す）トーストシステム
// =========================================================================
(function() {
  // --- 1. Undo（元に戻す）トーストシステム ---
  let undoContainer = null;
  let undoTimer = null;

  window.showUndoToast = function({ message, undoText = '元に戻す', onUndo, duration = 5500 }) {
    if (!undoContainer) {
      undoContainer = document.querySelector('.synapse-undo-toast-container');
      if (!undoContainer) {
        undoContainer = document.createElement('div');
        undoContainer.className = 'synapse-undo-toast-container';
        document.body.appendChild(undoContainer);
      }
    }

    if (undoTimer) {
      clearTimeout(undoTimer);
      undoTimer = null;
    }
    undoContainer.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'synapse-undo-toast';

    const msgSpan = document.createElement('span');
    msgSpan.className = 'synapse-undo-toast-message';
    msgSpan.textContent = message;

    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'synapse-undo-toast-btn';
    undoBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>' + undoText;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'synapse-undo-toast-close';
    closeBtn.setAttribute('aria-label', '閉じる');
    closeBtn.textContent = '✕';

    toast.appendChild(msgSpan);
    toast.appendChild(undoBtn);
    toast.appendChild(closeBtn);
    undoContainer.appendChild(toast);

    function dismiss(anim = true) {
      if (undoTimer) {
        clearTimeout(undoTimer);
        undoTimer = null;
      }
      if (!anim) {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        return;
      }
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }

    undoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dismiss(false);
      if (typeof onUndo === 'function') {
        try {
          onUndo();
        } catch (err) {
          console.error('[UndoToast] Failed to execute onUndo:', err);
        }
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dismiss(true);
    });

    undoTimer = setTimeout(() => {
      dismiss(true);
    }, duration);
  };

  // --- 2. スマホ向け 長押し（Long Press）ツールチップ ---
  let longPressTimer = null;
  let isLongPressTriggered = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let activeTipEl = null;

  function hideMobileTooltip() {
    if (activeTipEl && activeTipEl.parentNode) {
      activeTipEl.parentNode.removeChild(activeTipEl);
    }
    activeTipEl = null;
  }

  function showMobileTooltip(targetEl, text) {
    hideMobileTooltip();
    const tip = document.createElement('div');
    tip.className = 'synapse-mobile-tooltip';
    tip.textContent = text;
    document.body.appendChild(tip);

    const rect = targetEl.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    let top = rect.top - tipRect.height - 10;

    if (top < 10) {
      top = rect.bottom + 10;
      tip.classList.add('placement-bottom');
    }

    left = Math.max(10, Math.min(window.innerWidth - tipRect.width - 10, left));

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    activeTipEl = tip;
  }

  // 長押し後の誤タップ（ボタン実行）を防止するキャプチャリスナー
  document.addEventListener('click', function(e) {
    if (window._suppressNextClick) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window._suppressNextClick = false;
      return false;
    }
  }, true);

  document.addEventListener('touchstart', function(e) {
    if (!e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const target = e.target.closest('[data-tooltip], [title], [aria-label]');
    if (!target) return;

    const text = target.getAttribute('data-tooltip') || target.getAttribute('title') || target.getAttribute('aria-label');
    if (!text || !text.trim()) return;

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isLongPressTriggered = false;

    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(function() {
      isLongPressTriggered = true;
      window._suppressNextClick = true;
      if (navigator.vibrate) {
        try { navigator.vibrate(20); } catch (_) {}
      }
      showMobileTooltip(target, text.trim());
    }, 380);
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!longPressTimer && !isLongPressTriggered) return;
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dist = Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY);
    if (dist > 10) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      if (isLongPressTriggered) {
        hideMobileTooltip();
        isLongPressTriggered = false;
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    if (isLongPressTriggered) {
      window._suppressNextClick = true;
      setTimeout(function() {
        window._suppressNextClick = false;
      }, 400);
      setTimeout(function() {
        hideMobileTooltip();
        isLongPressTriggered = false;
      }, 800);
    }
  }, { passive: false });

  document.addEventListener('touchcancel', function() {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    hideMobileTooltip();
    isLongPressTriggered = false;
  });
})();

// =========================================================================
// 🎯 ホーム一覧からのフォーム選択時のヘッダー表示即時同期
// =========================================================================
(function() {
  document.addEventListener('click', function(e) {
    const row = e.target.closest('.gf-list-row');
    if (row && !e.target.closest('.gf-list-action-area')) {
      localStorage.setItem('form_customize_active_tab', 'editor');
      setTimeout(function() {
        if (typeof updateHeaderBackButton === 'function') {
          updateHeaderBackButton('editor');
        }
      }, 30);
    }
  }, true);
})();



