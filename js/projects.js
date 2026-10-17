document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems  = document.querySelectorAll('#projects-grid .projects-item');
  const subNav        = document.getElementById('sub-residential');
  const projectsGrid  = document.getElementById('projects-grid');

  const mapView   = document.getElementById('map-view');
  const mapTitle  = document.getElementById('map-title');
  const mapTitleText = document.getElementById('map-title-text');
  const mapHint   = document.getElementById('map-hint');
  const mapList   = document.getElementById('map-list');

  if (!filterButtons.length || !projectItems.length) return;

  const SUB_FILTERS = new Set(['living', 'kitchen', 'bath', 'patio']);

  // ═══════════════════════════════════════════════
  // エリア定義 — HTML の data-area と id を対応させる
  // 新しいエリアを増やすときはここに1行足すだけ
  // （該当する data-area を持つプロジェクトがあるエリアだけピンが出る）
  // ═══════════════════════════════════════════════
  const AREAS = [
    { id: 'lwv',         name: 'Laguna Woods', lat: 33.6106, lng: -117.7231 },
    { id: 'irvine',      name: 'Irvine',       lat: 33.6846, lng: -117.8265 },
    { id: 'westminster', name: 'Westminster',  lat: 33.7514, lng: -117.9940 },
    { id: 'gardengrove', name: 'Garden Grove', lat: 33.7743, lng: -117.9380 },
    { id: 'downey',      name: 'Downey',       lat: 33.9401, lng: -118.1332 }
  ];

  // 郡名ラベル（地図上の文字）
  const REGION_LABELS = [
    { text: 'LOS ANGELES',   lat: 34.07, lng: -118.05, main: true  },
    { text: 'ORANGE',        lat: 33.80, lng: -117.62, main: true  },
    { text: 'VENTURA',       lat: 34.28, lng: -118.95, main: false },
    { text: 'SAN BERNARDINO',lat: 34.07, lng: -117.50, main: false },
    { text: 'RIVERSIDE',     lat: 33.80, lng: -117.46, main: false },
    { text: 'SAN DIEGO',     lat: 33.25, lng: -117.25, main: false }
  ];

  // 地図の表示範囲（LA・オレンジ郡 + 車で行ける周辺だけ）
  const FIT_BOUNDS = [[33.50, -118.45], [34.12, -117.40]];
  const MAX_BOUNDS = [[33.05, -119.40], [34.80, -116.60]];

  // ベースマップの設定
  //   mode 'vector' : タイル(地図画像)を使わず、GeoJSON から郡とフリーウェイを描く（APIキー不要・見た目を完全に制御できる）
  //   mode 'tiles'  : CARTO のタイル地図（道路や地形が細かく出る）
  //   vector モードで counties.geojson が見つからないときは、自動で tiles に切り替わる
  const BASEMAP = {
    mode: 'vector',
    counties: '/data/counties.geojson',
    freeways: '/data/freeways.geojson',   // 任意。なければフリーウェイなしで表示
    tileUrl:  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
  };

  // ═══════════════════════════════════════════════
  // Utility: 表示列数を取得
  // ═══════════════════════════════════════════════
  const getColumnCount = (grid = projectsGrid) => {
    const fallback = window.innerWidth <= 900 ? 2 : 5;
    if (!grid) return fallback;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    return cols || fallback;
  };

  // ═══════════════════════════════════════════════
  // Kenburns reveal — 1アイテム
  // ═══════════════════════════════════════════════
  const revealOneItem = (item, delay) => {
    const img = item.querySelector('img');

    item.style.setProperty('--reveal-delay', `${delay}ms`);
    item.style.display = 'block';
    item.classList.remove('is-show', 'is-exit');

    if (img) {
      img.style.transition = 'none';
      img.style.transform  = 'scale(1.12)';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.classList.add('is-show');

        if (img) {
          setTimeout(() => {
            img.style.transition = `transform 1400ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`;
            img.style.transform  = 'scale(1.0)';
          }, 16);

          setTimeout(() => {
            img.style.transition = '';
            img.style.transform  = '';
          }, delay + 1500);
        }
      });
    });
  };

  // ═══════════════════════════════════════════════
  // 複数アイテムを列・行オフセット付きで reveal
  // ═══════════════════════════════════════════════
  const revealItems = (items, cols = getColumnCount()) => {
    if (!items.length) return;
    const COL_DELAY = 60;
    const ROW_DELAY = 120;

    items.forEach((item, i) => {
      const col   = i % cols;
      const row   = Math.floor(i / cols);
      const delay = row * ROW_DELAY + col * COL_DELAY;
      revealOneItem(item, delay);
    });
  };

  // ═══════════════════════════════════════════════
  // アイテムを exit アニメーションで隠す
  // ═══════════════════════════════════════════════
  const EXIT_DURATION = 300;

  const hideItems = (items, onComplete) => {
    if (!items.length) { onComplete?.(); return; }

    items.forEach(item => {
      item.classList.remove('is-show');
      item.classList.add('is-exit');
    });

    setTimeout(() => {
      items.forEach(item => {
        item.classList.remove('is-exit');
        item.style.display = 'none';
      });
      onComplete?.();
    }, EXIT_DURATION);
  };

  // ═══════════════════════════════════════════════
  // 初期化
  // ═══════════════════════════════════════════════
  projectItems.forEach(item => {
    item.style.display = 'none';
  });

  // ═══════════════════════════════════════════════
  // MAP — Leaflet (CARTO Positron / モノトーン)
  // ═══════════════════════════════════════════════
  let map = null;
  const markers = {};

  const initMap = () => {
    if (map || typeof L === 'undefined') return;

    map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: false,          // ページスクロール(Lenis)を邪魔しない
      dragging: !L.Browser.mobile,     // スマホは縦スクロール優先
      minZoom: 8,
      maxZoom: 13,
      zoomSnap: 0.5,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 1
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.fitBounds(FIT_BOUNDS);

    // フリーウェイは郡より手前・ピンより奥
    map.createPane('freeways');
    map.getPane('freeways').style.zIndex = 410;
    map.getPane('freeways').style.pointerEvents = 'none';

    let tilesAdded = false;
    const addTiles = () => {
      if (tilesAdded) return;
      tilesAdded = true;
      L.tileLayer(BASEMAP.tileUrl, {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
          '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
    };

    const loadVectorBase = async () => {
      // 郡（陸地）— LA・オレンジ郡は濃いめ、周辺の郡は薄く破線
      try {
        const res = await fetch(BASEMAP.counties);
        if (!res.ok) throw new Error('counties.geojson not found');
        const geo = await res.json();
        const MAIN = new Set(['Los Angeles', 'Orange']);
        const isMain = f => MAIN.has(f.properties && f.properties.NAME);
        // 陸地の色は LAND を書き換えて調整、線の色はサイトの --white
        const rootStyle = getComputedStyle(document.documentElement);
        const LAND = '#dcdcdc';                                                   // 陸地（LA・OC・周辺すべて同じグレー）
        const LINE = rootStyle.getPropertyValue('--white').trim() || '#ffffff';   // 境界線は白
        L.geoJSON(geo, {
          interactive: false,
          style: f => ({
            fill: true,
            fillColor: LAND,          // LA・OC・周辺エリアすべて同じ色
            fillOpacity: 1,
            color: LINE,              // 境界線
            weight: 0.8,
            opacity: 1,
            dashArray: isMain(f) ? null : '3 4'   // 周辺エリアだけ破線
          })
        }).addTo(map);
      } catch (e) {
        console.warn('[map] counties.geojson を読めなかったのでタイル地図に切り替えます', e);
        addTiles();
        return;
      }

      // フリーウェイ（白線）— 任意
      try {
        const res = await fetch(BASEMAP.freeways);
        if (!res.ok) return;
        const geo = await res.json();
        L.geoJSON(geo, {
          pane: 'freeways',
          interactive: false,
          style: { color: '#ffffff', weight: 2.2, opacity: 1, lineCap: 'round', lineJoin: 'round' }
        }).addTo(map);
      } catch (e) { /* フリーウェイなしで続行 */ }
    };

    if (BASEMAP.mode === 'tiles') addTiles();
    else loadVectorBase();

    // 郡名ラベル
    REGION_LABELS.forEach(r => {
      L.marker([r.lat, r.lng], {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: 'map-region-label' + (r.main ? '' : ' is-near'),
          html: `<span>${r.text}</span>`,
          iconSize: [0, 0]
        })
      }).addTo(map);
    });

    // 地図の空いているところをクリックで選択解除
    map.on('click', () => clearSelection());

    // エリアピン
    AREAS.forEach(area => {
      const hasProjects = projectsGrid.querySelector(`[data-area="${area.id}"]`);
      if (!hasProjects) return;

      const marker = L.marker([area.lat, area.lng], {
        title: area.name,
        alt: area.name,
        keyboard: true,
        riseOnHover: true,
        icon: L.divIcon({
          className: 'map-pin',
          html: `<span class="pin-ring"></span><span class="pin-dot"></span><span class="pin-name">${area.name}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        })
      }).addTo(map);

      marker.on('click', () => selectArea(area.id));
      markers[area.id] = marker;
    });
  };

  // ═══════════════════════════════════════════════
  // エリア選択 / 解除
  // ═══════════════════════════════════════════════
  const setActivePin = (id) => {
    Object.entries(markers).forEach(([key, marker]) => {
      marker.getElement()?.classList.toggle('is-active', key === id);
    });
  };

  const selectArea = (id) => {
    const area = AREAS.find(a => a.id === id);
    if (!area) return;

    setActivePin(id);

    // タイトル（エリア名）をワイプで表示
    mapTitle.hidden = false;
    mapTitle.classList.remove('is-in');
    mapTitleText.textContent = area.name.toUpperCase();
    mapHint.hidden = true;

    // 該当プロジェクトを複製してパネルへ
    mapList.innerHTML = '';
    const cards = [...projectItems]
      .filter(item => item.dataset.area === id && item.dataset.level === 'parent')
      .map(item => {
        const clone = item.cloneNode(true);
        clone.removeAttribute('style');
        clone.classList.remove('is-show', 'is-exit');
        clone.style.display = 'none';
        mapList.appendChild(clone);
        return clone;
      });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mapTitle.classList.add('is-in');
        revealItems(cards, getColumnCount(mapList));
      });
    });

    // スマホ: パネルが地図の下に来るのでスクロールして見せる
    if (window.innerWidth <= 900) {
      setTimeout(() => {
        if (window.__lenis) window.__lenis.scrollTo(mapTitle, { offset: -90, duration: 1.2 });
        else mapTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

  const clearSelection = () => {
    setActivePin(null);
    mapTitle.classList.remove('is-in');
    mapTitle.hidden = true;
    mapList.innerHTML = '';
    mapHint.hidden = false;
  };

  // ═══════════════════════════════════════════════
  // マップビュー 表示 / 非表示
  // ═══════════════════════════════════════════════
  const showMapView = () => {
    // Leaflet が読めなかった場合はサムネイルグリッドにフォールバック
    if (typeof L === 'undefined') {
      revealItems([...projectItems].filter(i => i.dataset.level === 'parent'));
      return;
    }
    mapView.hidden = false;
    initMap();
    map.invalidateSize();
    requestAnimationFrame(() => mapView.classList.add('is-show'));
  };

  const hideMapView = () => {
    if (mapView.hidden) return;
    mapView.classList.remove('is-show');
    clearSelection();
    setTimeout(() => {
      if (!mapView.classList.contains('is-show')) mapView.hidden = true;
    }, EXIT_DURATION);
  };

  // ═══════════════════════════════════════════════
  // サブナビ開閉 (4B: めくれ + フェード)
  // ═══════════════════════════════════════════════
  const openSubNav = () => {
    if (!subNav) return;
    const row = subNav.querySelector('.sub-row');
    if (!row) return;

    // 高さを開く
    subNav.style.transition = 'height 0.5s cubic-bezier(0.4,0,0.2,1)';
    subNav.style.height     = (row.scrollHeight + 16) + 'px';

    // 少し遅れてめくれ+フェード発火
    setTimeout(() => subNav.classList.add('is-open'), 20);
  };

  const closeSubNav = () => {
    if (!subNav) return;
    subNav.classList.remove('is-open');

    setTimeout(() => {
      subNav.style.transition = 'height 0.4s cubic-bezier(0.4,0,0.2,1)';
      subNav.style.height     = '0px';
    }, 20);
  };

  // ═══════════════════════════════════════════════
  // フィルター適用
  //   All       → マップビュー
  //   それ以外  → サムネイルグリッド（従来どおり）
  // ═══════════════════════════════════════════════
  let filterTimer = null;

  const applyFilter = (filterValue, initialLoad = false) => {
    const isAll       = filterValue === 'projects-item';
    const isSubFilter = SUB_FILTERS.has(filterValue);

    clearTimeout(filterTimer);

    if (isAll) {
      hideItems([...projectItems], () => {
        filterTimer = setTimeout(showMapView, initialLoad ? 800 : 80);
      });
      return;
    }

    hideMapView();

    const toShow = [];
    const toHide = [];

    projectItems.forEach(item => {
      const level = item.dataset.level;
      let show = false;
      if (isSubFilter) show = item.classList.contains(filterValue);
      else             show = level === 'parent' && item.classList.contains(filterValue);
      show ? toShow.push(item) : toHide.push(item);
    });

    hideItems(toHide, () => {
      filterTimer = setTimeout(() => {
        revealItems(toShow);
      }, 80);
    });
  };

  // ═══════════════════════════════════════════════
  // 初期表示
  // ═══════════════════════════════════════════════
  applyFilter('projects-item', true);

  // ═══════════════════════════════════════════════
  // フィルターボタン
  // ═══════════════════════════════════════════════
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filterValue === 'residential' || SUB_FILTERS.has(filterValue)) {
        openSubNav();
      } else {
        closeSubNav();
      }

      applyFilter(filterValue);
    });
  });

});
