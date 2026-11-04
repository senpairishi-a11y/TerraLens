// ============================================================
// TerraLens - LST, spectral indices and LULC for India
// Paste in code.earthengine.google.com, Run, then Apps > New App
// ============================================================
var APP_NAME = 'TerraLens';
var APP_TAGLINE = 'LST · Spectral indices · LULC for India';
var AUTHOR = 'Krishnananda Deka';
var AUTHOR_TAGLINE = 'GIS · Remote sensing · Web mapping';
var TG_URL = 'https://t.me/terralens_kd';
var TG_HANDLE = '@TERRALENS_KD';
var CITATION = '';
var MIN_N = 30, MIN_R2 = 0.3;
var WARN_VALID = 50, CRIT_VALID = 20;
var FLAG_NAMES = {0: 'Landsat', 1: 'MODIS same day', 2: 'MODIS ±1 day', 3: 'MODIS ±2 days', 4: 'MODIS ±3 days', 255: 'no data'};
var FLAG_TEXT = 'Flag band: 0 = Landsat, 1 = MODIS same day (monthly mode: MODIS monthly mean), 2 = MODIS ±1 day, 3 = ±2 days, 4 = ±3 days, 255 = no data.';
var HEADER_DARK = true;

var ST_UNC_MAX = 4;
var ST_MIN_C = 5, ST_MAX_C = 70;
var DEFAULT_CLOUD = 40;

var VERSION = 'v1.9.3';
var WHATS_NEW = [
  'Cloud-Edge Buffer: ST-DCA now learns the Landsat-ERA5 residual only from clear pixels at least 150 m away (auto-narrowed on cloudy scenes) from clouds and shadows, removing the cold-halo bias',
  'Self-Calibration: ST-DCA hides ~11% of clear pixels in 1 km blocks, measures its own bias and removes it, so no manual tuning is needed on a new AOI',
  'Cross-Scene Harmonization: every scene in a monthly composite is aligned to the month level (ERA5-anchored), so no vertical seam at scene edges',
  'Spectral Covariate Sharpening: 30 m texture now comes from a regression on same-month NDVI, MNDWI, elevation and the annual LST anomaly',
  'Eliminated Edge Cold-Drop in ST-DCA: added Multi-Scale Residual Blending (Local + 8 km Regional) and Scene-Mean Bias Fallback so large cloud gaps never drop to raw cold ERA5 values',
  'Auto-Scaled 30 m Texture Weight (Alpha): dynamically scales the annual clear-sky 30 m thermal prior to each scene so R² stays high and bias stays near zero',
  'Auto-Contrast LST Stretch (2nd–98th percentile): automatically adjusts map colours to your study area so thermal patterns pop out clearly',
  'Simpler, cleaner interface: Custom AOI defaults to transparent outline-only mode, and complex ST-DCA sliders are tucked into an optional settings toggle'
];

var C = {
  primary: '#0b2a40',
  bg: '#ffffff',
  card: '#f6f8fb',
  glass: '#f6f8fb',
  overlay: 'rgba(246,248,251,0.93)',
  line: '#d5dde3',
  title: '#0b3d5c',
  accent: '#0e5a8a',
  warm: '#2b7bb9',
  danger: '#c62828',
  warn: '#e65100',
  link: '#1565c0',
  text: '#263238',
  muted: '#78909c'
};
var QR_N = 29, QR_QUIET = 3;
var QR_RUNS = [[0,0,7],[0,9,1],[0,12,1],[0,16,2],[0,19,2],[0,22,7],[1,0,1],[1,6,1],[1,10,1],[1,12,4],[1,19,1],[1,22,1],[1,28,1],[2,0,1],[2,2,3],[2,6,1],[2,8,3],[2,12,2],[2,15,4],[2,22,1],[2,24,3],[2,28,1],[3,0,1],[3,2,3],[3,6,1],[3,13,2],[3,18,1],[3,22,1],[3,24,3],[3,28,1],[4,0,1],[4,2,3],[4,6,1],[4,8,1],[4,10,6],[4,17,2],[4,22,1],[4,24,3],[4,28,1],[5,0,1],[5,6,1],[5,8,3],[5,12,3],[5,17,1],[5,19,2],[5,22,1],[5,28,1],[6,0,7],[6,8,1],[6,10,1],[6,12,1],[6,14,1],[6,16,1],[6,18,1],[6,20,1],[6,22,7],[7,9,1],[7,12,1],[7,14,2],[7,19,2],[8,1,1],[8,4,1],[8,6,1],[8,8,3],[8,12,4],[8,20,2],[8,23,2],[8,26,1],[9,1,4],[9,7,7],[9,18,2],[9,21,1],[9,23,6],[10,0,3],[10,4,3],[10,9,1],[10,15,5],[10,21,1],[10,24,2],[10,28,1],[11,1,2],[11,7,1],[11,9,2],[11,12,2],[11,15,1],[11,17,5],[11,23,1],[11,25,1],[11,27,2],[12,2,2],[12,6,2],[12,16,3],[12,20,1],[12,23,1],[12,25,1],[12,28,1],[13,2,1],[13,7,1],[13,18,1],[13,20,1],[13,22,1],[13,24,1],[13,26,1],[13,28,1],[14,4,8],[14,13,1],[14,15,3],[14,24,1],[14,28,1],[15,1,1],[15,3,3],[15,11,1],[15,15,1],[15,17,2],[15,20,1],[15,23,1],[15,25,1],[15,27,1],[16,0,1],[16,3,1],[16,6,1],[16,9,1],[16,18,4],[16,23,1],[17,0,2],[17,3,1],[17,5,1],[17,7,1],[17,9,1],[17,13,1],[17,16,2],[17,19,2],[17,22,3],[17,28,1],[18,2,2],[18,5,3],[18,10,1],[18,12,1],[18,14,1],[18,16,1],[18,18,1],[18,23,2],[18,28,1],[19,2,2],[19,5,1],[19,7,2],[19,11,2],[19,14,1],[19,17,2],[19,20,1],[19,24,2],[19,28,1],[20,0,3],[20,4,7],[20,12,6],[20,19,7],[20,28,1],[21,8,1],[21,10,4],[21,15,3],[21,20,1],[21,24,1],[21,26,3],[22,0,7],[22,9,1],[22,13,1],[22,15,1],[22,18,3],[22,22,1],[22,24,1],[22,28,1],[23,0,1],[23,6,1],[23,11,2],[23,14,2],[23,19,2],[23,24,2],[23,27,1],[24,0,1],[24,2,3],[24,6,1],[24,8,3],[24,12,2],[24,16,1],[24,19,6],[25,0,1],[25,2,3],[25,6,1],[25,9,1],[25,13,2],[25,18,1],[25,23,1],[25,26,2],[26,0,1],[26,2,3],[26,6,1],[26,10,2],[26,13,1],[26,15,1],[26,17,5],[26,25,1],[26,27,2],[27,0,1],[27,6,1],[27,8,1],[27,12,1],[27,14,4],[27,20,2],[27,23,1],[27,25,1],[27,27,2],[28,0,7],[28,9,2],[28,13,2],[28,17,1],[28,20,3],[28,24,2],[28,27,1]];

var gaul1 = ee.FeatureCollection('FAO/GAUL/2015/level1').filter(ee.Filter.eq('ADM0_NAME', 'India'));
var gaul2 = ee.FeatureCollection('FAO/GAUL/2015/level2').filter(ee.Filter.eq('ADM0_NAME', 'India'));
var ALL = 'Entire state';

var INDEX_NAMES = ['LST', 'NDVI', 'NDBI', 'BSI', 'NDWI', 'MNDWI', 'EVI', 'SAVI', 'NDMI', 'NBR', 'GNDVI', 'MSAVI', 'UI', 'IBI', 'BUI', 'AWEI'];
var GREEN = ['a50026', 'f46d43', 'fee08b', 'd9ef8b', '66bd63', '006837'];
var WATER = ['8c510a', 'f5f5f5', '2166ac'];
var VIS = {
  LST:   {min: 18,   max: 42,  palette: ['040274','0502ce','30c8e2','3be285','ffd611','ff7700','d23c00','a50000']},
  NDVI:  {min: -0.2, max: 0.9, palette: GREEN},
  NDBI:  {min: -0.5, max: 0.5, palette: ['1a9850', 'ffffbf', 'd73027']},
  BSI:   {min: -0.5, max: 0.5, palette: ['1a9850', 'ffffbf', '8c510a']},
  NDWI:  {min: -0.5, max: 0.8, palette: WATER},
  MNDWI: {min: -0.5, max: 0.8, palette: WATER},
  EVI:   {min: 0,    max: 1,   palette: GREEN},
  SAVI:  {min: 0,    max: 1,   palette: GREEN},
  NDMI:  {min: -0.4, max: 0.6, palette: WATER},
  NBR:   {min: -0.3, max: 0.8, palette: GREEN},
  GNDVI: {min: -0.2, max: 0.9, palette: GREEN},
  MSAVI: {min: 0,    max: 1,   palette: GREEN},
  UI:    {min: -0.5, max: 0.5, palette: ['1a9850', 'ffffbf', 'd73027']},
  IBI:   {min: -0.6, max: 0.4, palette: ['1a9850', 'ffffbf', 'd73027']},
  BUI:   {min: -1,   max: 0.6, palette: ['1a9850', 'ffffbf', 'd73027']},
  AWEI:  {min: -0.5, max: 0.5, palette: WATER}
};
var UNITS = {LST: '°C'};

var LULC = {
  'Dynamic World (10 m)': {
    scale: 10, note: 'Yearly most-common class, 2016 onwards.',
    classes: [[0,'Water','419bdf'],[1,'Trees','397d49'],[2,'Grass','88b053'],[3,'Flooded vegetation','7a87c6'],
              [4,'Crops','e49635'],[5,'Shrub & scrub','dfc35a'],[6,'Built-up','c4281b'],[7,'Bare ground','a59b8f'],[8,'Snow & ice','b39fe1']]},
  'ESA WorldCover (10 m)': {
    scale: 10, note: 'Only 2020 and 2021 exist; the nearest one is used.',
    classes: [[10,'Tree cover','006400'],[20,'Shrubland','ffbb22'],[30,'Grassland','ffff4c'],[40,'Cropland','f096ff'],
              [50,'Built-up','fa0000'],[60,'Bare / sparse veg.','b4b4b4'],[70,'Snow & ice','f0f0f0'],[80,'Water','0064c8'],
              [90,'Herbaceous wetland','0096a0'],[95,'Mangroves','00cf75'],[100,'Moss & lichen','fae6a0']]},
  'MODIS MCD12Q1 (500 m)': {
    scale: 500, note: 'IGBP classes, yearly, 2001 onwards.',
    classes: [[1,'Evergreen needleleaf','05450a'],[2,'Evergreen broadleaf','086a10'],[3,'Deciduous needleleaf','54a708'],
              [4,'Deciduous broadleaf','78d203'],[5,'Mixed forest','009900'],[6,'Closed shrubland','c6b044'],
              [7,'Open shrubland','dcd159'],[8,'Woody savanna','dade48'],[9,'Savanna','fbff13'],[10,'Grassland','b6ff05'],
              [11,'Wetland','27ff87'],[12,'Cropland','c24f44'],[13,'Urban','a5a5a5'],[14,'Crop mosaic','ff6d4c'],
              [15,'Snow & ice','69fff8'],[16,'Barren','f9ffa4'],[17,'Water','1c0dff']]}
};

var places = [];
var stateNames = [];

function pad(n) { return n < 10 ? '0' + n : String(n); }
function merge(a, b) {
  var o = {}, k;
  for (k in a) o[k] = a[k];
  for (k in b) o[k] = b[k];
  return o;
}
function lbl(text, st) {
  return ui.Label(text, merge({backgroundColor: C.card, color: C.text, fontSize: '12px', margin: '6px 0 2px 0'}, st || {}));
}
function card(title) {
  var p = ui.Panel([], null, {backgroundColor: C.glass, border: '1px solid ' + C.line,
                              padding: '10px 12px', margin: '10px 0 0 0'});
  if (title) p.add(ui.Label(title, {fontWeight: 'bold', fontSize: '14px', color: C.title,
                                    backgroundColor: C.card, margin: '0 0 6px 0'}));
  return p;
}
function frame(btn, color, top) {
  btn.style().set({stretch: 'horizontal', margin: '0'});
  return ui.Panel([btn], null, {backgroundColor: color || C.accent, padding: '2px', margin: (top === undefined ? 10 : top) + 'px 0 0 0', stretch: 'horizontal'});
}
function qrThumb() {
  var u = 0.01, tot = QR_N + 2 * QR_QUIET;
  var rects = QR_RUNS.map(function(r) {
    var x0 = (QR_QUIET + r[1]) * u, x1 = (QR_QUIET + r[1] + r[2]) * u;
    var yTop = (tot - QR_QUIET - r[0]) * u, yBot = (tot - QR_QUIET - r[0] - 1) * u;
    return ee.Feature(ee.Geometry.Rectangle([x0, yBot, x1, yTop], 'EPSG:4326', false));
  });
  return ui.Thumbnail({
    image: ee.Image.constant(1).paint(ee.FeatureCollection(rects), 0),
    params: {bbox: [0, 0, tot * u, tot * u], dimensions: (tot * 6) + 'x' + (tot * 6), format: 'png', min: 0, max: 1, palette: ['000000', 'ffffff']},
    style: {margin: '8px 0 4px 0', border: '4px solid white'}});
}
function note(text) { return lbl(text, {fontSize: '11px', color: C.muted, margin: '2px 0', whiteSpace: 'normal'}); }
function parseDays(str, maxDay) {
  var out = [];
  function add(k) { if (k >= 1 && k <= maxDay && out.indexOf(k) < 0) out.push(k); }
  String(str).split(/[\s,;]+/).forEach(function(tok) {
    if (!tok) return;
    var m = tok.match(/^(\d{1,2})-(\d{1,2})$/);
    if (m) {
      var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
      for (var k = Math.min(a, b); k <= Math.max(a, b); k++) add(k);
    } else if (/^\d{1,2}$/.test(tok)) add(parseInt(tok, 10));
  });
  out.sort(function(a, b) { return a - b; });
  return out;
}
function fmt(v, d) { return (v === null || v === undefined || isNaN(v)) ? '-' : Number(v).toFixed(d); }

// ---------------- layout ----------------
ui.root.clear();
var map = ui.Map();
map.setCenter(92.5, 26.2, 7);
map.setOptions('HYBRID');

var dt = map.drawingTools();
try { dt.setLinked(false); dt.setShown(false); } catch (e) {}
var aoiLayer = dt.addLayer([], 'Custom study area (AOI)', '#00e5ff', false);
aoiLayer.setShown(false);
var AOI_COLOR = '00e5ff';
var aoiDisplayLayer = ui.Map.Layer(
  ee.Image(0).updateMask(ee.Image.constant(0)), {}, 'Custom AOI boundary', false, 1
);
map.layers().add(aoiDisplayLayer);
var aoiInteractionMode = 'pan';
var aoiHistory = [[]], aoiRedoStack = [], aoiRestoring = false;

var panel = ui.Panel([], null, {width: '400px', padding: '0', backgroundColor: C.bg});
ui.root.add(ui.SplitPanel(panel, map));

var H = HEADER_DARK
  ? {bg: C.primary, title: 'white', sub: '#bcd7ea', soft: '#9fc3dc', pillBg: 'white', pillText: C.primary, author: '#ffffff', link: '#7fd1ff'}
  : {bg: '#ffffff', title: C.primary, sub: '#546e7a', soft: '#78909c', pillBg: C.primary, pillText: 'white', author: C.primary, link: C.link};
function hdr() { return {backgroundColor: H.bg}; }
panel.add(ui.Panel([
  ui.Label(APP_NAME, {fontSize: '26px', fontWeight: 'bold', color: H.title, backgroundColor: H.bg, margin: '0'}),
  ui.Label(APP_TAGLINE, {fontSize: '12px', color: H.sub, backgroundColor: H.bg, margin: '4px 0 0 0'}),
  ui.Label('Landsat + Multi-Scale 30 m ST-DCA / MODIS LST  |  15 spectral indices  |  LULC & RF', {fontSize: '11px', color: H.soft, backgroundColor: H.bg, margin: '10px 0 0 0', whiteSpace: 'normal'}),
  ui.Panel([
    ui.Label('by ' + AUTHOR, {fontSize: '12px', color: H.author, backgroundColor: H.bg, margin: '10px 14px 0 0'}),
    ui.Label('Join updates', {fontSize: '12px', color: H.link, backgroundColor: H.bg, margin: '10px 0 0 0', textDecoration: 'underline'}, TG_URL)
  ], ui.Panel.Layout.flow('horizontal'), hdr())
], null, {backgroundColor: H.bg, padding: '18px 14px 14px 14px'}));
panel.add(ui.Label(' ', {backgroundColor: C.warm, fontSize: '2px', padding: '0', margin: '0', stretch: 'horizontal'}));

var body = ui.Panel([], null, {backgroundColor: C.bg, padding: '0 10px 12px 10px'});
panel.add(body);

var newCard = card('What\'s new  ·  ' + VERSION);
WHATS_NEW.forEach(function(t) { newCard.add(lbl('• ' + t, {margin: '1px 0', fontSize: '11px', whiteSpace: 'normal'})); });
body.add(newCard);

var areaSourceSelect = ui.Select({
  items: ['State / District', 'Custom study area', 'Uploaded asset (shapefile / CSV)'],
  value: 'State / District', style: {stretch: 'horizontal'}
});
var stateSelect = ui.Select({items: ['Loading...'], placeholder: 'State', style: {stretch: 'horizontal'}});
var districtSelect = ui.Select({items: [ALL], value: ALL, style: {stretch: 'horizontal'}});
var stateLbl = lbl('State');
var districtLbl = lbl('District');
var adminAreaPanel = ui.Panel([stateLbl, stateSelect, districtLbl, districtSelect], null,
  {backgroundColor: C.card, padding: '0'});
var years = [];
for (var y = 2026; y >= 1984; y--) years.push(String(y));
var yearSelect = ui.Select({items: years, value: '2024', style: {stretch: 'horizontal'}});
var keepCheck = ui.Checkbox({label: 'Keep previous layers (to compare)', value: false, style: {backgroundColor: C.card, color: C.text}});

function tx(v) { return String(v === null || v === undefined ? '' : v).replace(/^\s+|\s+$/g, ''); }
var ASSET_SRC = 'Uploaded asset (shapefile / CSV)';
var aoiAssetBox = ui.Textbox({placeholder: 'projects/your-project/assets/my_boundary', style: {stretch: 'horizontal'}});
var aoiAssetColBox = ui.Textbox({placeholder: 'optional column, e.g. NAME', style: {stretch: 'horizontal'}});
var aoiAssetValBox = ui.Textbox({placeholder: 'optional value, e.g. Darrang', style: {stretch: 'horizontal'}});
var aoiAssetBtn = ui.Button({label: 'Load boundary from asset', style: {stretch: 'horizontal'}});
var aoiAssetStatus = lbl('', {whiteSpace: 'normal'});
var assetAreaPanel = ui.Panel([
  note('Upload once in the Code Editor (Assets > NEW > Shape files or CSV), share with "Anyone can read", and paste its path here.'),
  lbl('Asset path'), aoiAssetBox,
  lbl('Only use features where (optional)'), aoiAssetColBox, aoiAssetValBox,
  frame(aoiAssetBtn, C.accent, 8), aoiAssetStatus
], null, {backgroundColor: C.card, padding: '0', shown: false});

var areaCard = card('1. Study Area & Year');
areaCard.add(lbl('Choose study area type'));
areaCard.add(areaSourceSelect);
areaCard.add(adminAreaPanel);
areaCard.add(assetAreaPanel);
areaCard.add(lbl('Year'));
areaCard.add(yearSelect);
areaCard.add(keepCheck);
body.add(areaCard);

var aoiCard = card('Custom Study Area (Draw on Map)');
aoiCard.style().set('shown', false);
aoiCard.add(note('Step 1: Click "Draw polygon" or "Draw rectangle" and draw on the map. Step 2: Click "Use custom study area" to lock it.'));
var aoiPolygonBtn = ui.Button({label: 'Draw polygon', style: {stretch: 'horizontal', margin: '0'}});
var aoiRectangleBtn = ui.Button({label: 'Draw rectangle', style: {stretch: 'horizontal', margin: '0'}});
var aoiEditBtn = ui.Button({label: 'Edit boundary', style: {stretch: 'horizontal', margin: '0'}});
var aoiStopBtn = ui.Button({label: 'Pan / navigate', style: {stretch: 'horizontal', margin: '0'}});
var aoiUndoBtn = ui.Button({label: 'Undo', style: {stretch: 'horizontal', margin: '0'}});
var aoiRedoBtn = ui.Button({label: 'Redo', style: {stretch: 'horizontal', margin: '0'}});
var aoiDeleteBtn = ui.Button({label: 'Delete last', style: {stretch: 'horizontal', margin: '0'}});
var aoiClearBtn = ui.Button({label: 'Clear all', style: {stretch: 'horizontal', margin: '0'}});
var aoiUseBtn = ui.Button({label: 'Use custom study area', style: {stretch: 'horizontal', margin: '0'}});
var aoiExportBtn = ui.Button({label: 'Download boundary SHP', style: {stretch: 'horizontal', margin: '0'}});
var aoiStatus = lbl('No custom boundary yet. Draw a polygon or rectangle on the map.', {whiteSpace: 'normal'});
var aoiFillOpacity = ui.Slider({min: 0, max: 60, value: 0, step: 5, style: {stretch: 'horizontal'}});
var aoiFillOpacityLabel = lbl('AOI fill opacity: 0% (Outline only)', {fontWeight: 'bold'});
var aoiOutlineOnlyCheck = ui.Checkbox({label: 'Transparent fill (outline only — best for viewing LST)', value: true,
  style: {backgroundColor: C.card, color: C.text}});
var aoiDownloadBox = ui.Panel([], null, {backgroundColor: C.bg});
aoiCard.add(ui.Panel([frame(aoiPolygonBtn, C.line, 4), frame(aoiRectangleBtn, C.line, 4)],
  ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
aoiCard.add(ui.Panel([frame(aoiEditBtn, C.line, 4), frame(aoiStopBtn, C.line, 4)],
  ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
aoiCard.add(ui.Panel([frame(aoiUndoBtn, C.line, 4), frame(aoiRedoBtn, C.line, 4)],
  ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
aoiCard.add(ui.Panel([frame(aoiDeleteBtn, C.line, 4), frame(aoiClearBtn, C.line, 4)],
  ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
aoiCard.add(frame(aoiUseBtn, C.accent, 8));
aoiCard.add(aoiStatus);
aoiCard.add(aoiOutlineOnlyCheck);
aoiCard.add(aoiFillOpacityLabel);
aoiCard.add(aoiFillOpacity);
aoiCard.add(frame(aoiExportBtn, C.line, 6));
aoiCard.add(aoiDownloadBox);
body.add(aoiCard);

var navNames = ['LST & Indices', 'LULC', 'Accuracy', 'RF'];
var navBtns = [], navWraps = [];
var tab1 = ui.Panel([], null, {backgroundColor: C.bg, padding: '0'});
var tab2 = ui.Panel([], null, {backgroundColor: C.bg, padding: '0', shown: false});
var tab3 = ui.Panel([], null, {backgroundColor: C.bg, padding: '0', shown: false});
var tab4 = ui.Panel([], null, {backgroundColor: C.bg, padding: '0', shown: false});
var tabs = [tab1, tab2, tab3, tab4];
function showTab(i) {
  tabs.forEach(function(t, k) { t.style().set('shown', k === i); });
  navBtns.forEach(function(b, k) { b.setLabel(navNames[k]); });
  navWraps.forEach(function(w, k) { w.style().set('backgroundColor', k === i ? C.warm : C.line); });
}
function makeNav(i) {
  var b = ui.Button({label: navNames[i], style: {stretch: 'horizontal', margin: '0'}, onClick: function() { showTab(i); }});
  var w = ui.Panel([b], null, {backgroundColor: C.line, padding: '2px', margin: '12px 2px 0 2px', stretch: 'horizontal'});
  navBtns.push(b); navWraps.push(w);
  return w;
}
body.add(ui.Panel([makeNav(0), makeNav(1), makeNav(2), makeNav(3)], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.bg, margin: '0'}));
body.add(tab1); body.add(tab2); body.add(tab3); body.add(tab4);
showTab(0);

// ===== Tab 1: LST & indices =====
var cmdBox = ui.Textbox({placeholder: 'e.g. Darrang June 2024 NDVI LST', style: {stretch: 'horizontal'}});
var cmdBtn = ui.Button({label: 'Go', style: {stretch: 'horizontal'}});
var cmdCard = card('Quick Search Command (Optional)');
cmdCard.add(cmdBox); cmdCard.add(frame(cmdBtn, C.line, 6));
cmdCard.add(note('Try: "Kamrup Metropolitan May 2023 LST NDVI"'));
tab1.add(cmdCard);

var sensorSelect = ui.Select({items: ['Landsat (30 m, 1984+)', 'Sentinel-2 (10 m, 2017+)'],
  value: 'Landsat (30 m, 1984+)', style: {stretch: 'horizontal'}});
var modeSelect = ui.Select({items: ['Monthly composite', 'Selected days'], value: 'Monthly composite', style: {stretch: 'horizontal'}});
var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var monthSelect = ui.Select({items: months, value: '05', style: {stretch: 'horizontal'}});
var daysBox = ui.Textbox({placeholder: 'e.g. 3, 7, 15-20', style: {stretch: 'horizontal', shown: false}});
var daysLabel = lbl('Days of the month (max 15)', {shown: false});
var daysNote = note('Selected-day LST uses Landsat when clear, and fills cloudy pixels with the method chosen below.');
daysNote.style().set('shown', false);
modeSelect.onChange(function(m) {
  var on = (m === 'Selected days');
  if (on) hybridCheck.setValue(true);
  daysBox.style().set('shown', on);
  daysLabel.style().set('shown', on);
  daysNote.style().set('shown', on);
  winLbl.style().set('shown', on);
  winSelect.style().set('shown', on);
  winNote.setValue(on ? 'Each gap pixel takes the MODIS value of the same day, else ±1 day, up to the window you pick.' : 'Monthly mode fills gaps with the MODIS monthly mean.');
});
var timeCard = card('2. Time & Satellite');
timeCard.add(lbl('Satellite')); timeCard.add(sensorSelect);
timeCard.add(note('Note: Sentinel-2 has no thermal band, so choose Landsat when you need LST.'));
timeCard.add(lbl('Time mode')); timeCard.add(modeSelect);
timeCard.add(lbl('Month')); timeCard.add(monthSelect);
timeCard.add(daysLabel); timeCard.add(daysBox); timeCard.add(daysNote);
tab1.add(timeCard);

var checks = {};
var layerCard = card('3. Choose Layers to Map');
for (var i = 0; i < INDEX_NAMES.length; i += 2) {
  var row = ui.Panel([], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card});
  [INDEX_NAMES[i], INDEX_NAMES[i + 1]].forEach(function(n) {
    checks[n] = ui.Checkbox({label: n, value: n === 'LST', style: {width: '150px', backgroundColor: C.card, color: C.text}});
    row.add(checks[n]);
  });
  layerCard.add(row);
}
var autoContrastCheck = ui.Checkbox({
  label: 'Auto-contrast LST map (2–98% stretch so patterns look sharp, not flat)',
  value: true,
  style: {backgroundColor: C.card, color: C.title, fontWeight: 'bold', margin: '8px 0 2px 0'}
});
var separateCheck = ui.Checkbox({label: 'Download a separate file per day (in Selected days mode)', value: false, style: {backgroundColor: C.card, color: C.text}});
layerCard.add(autoContrastCheck);
layerCard.add(separateCheck);
tab1.add(layerCard);

var hybridCheck = ui.Checkbox({label: 'Fill cloudy gaps in LST (Recommended)', value: true, style: {backgroundColor: C.card, color: C.text, fontWeight: 'bold'}});
var fillMethodSelect = ui.Select({
  items: ['ERA5-Land ST-DCA (30 m Texture-Sharpened)', 'MODIS calibrated (1 km)'],
  value: 'ERA5-Land ST-DCA (30 m Texture-Sharpened)', style: {stretch: 'horizontal'}
});
var stDcaSharpenCheck = ui.Checkbox({
  label: 'Keep 30 m land-cover texture in cloud gaps (auto-scaled prior)',
  value: true,
  style: {backgroundColor: C.card, color: C.title, fontWeight: 'bold'}
});
var stDcaAdvCheck = ui.Checkbox({
  label: 'Show advanced ST-DCA settings (smoothing radius & iterations)',
  value: false,
  style: {backgroundColor: C.card, color: C.muted, fontSize: '11px'}
});
var stDcaRadiusSlider = ui.Slider({min: 1000, max: 10000, value: 3000, step: 1000, style: {stretch: 'horizontal'}});
var stDcaRadiusLabel = lbl('Local residual smoothing radius: 3000 m');
stDcaRadiusSlider.onChange(function(v) { stDcaRadiusLabel.setValue('Local residual smoothing radius: ' + v + ' m'); });
var stDcaIterationsSelect = ui.Select({items: ['1', '2', '3', '4', '5'], value: '2', style: {stretch: 'horizontal'}});
var stDcaAdvPanel = ui.Panel([
  stDcaRadiusLabel, stDcaRadiusSlider,
  lbl('Focal-mean iterations'), stDcaIterationsSelect
], null, {backgroundColor: C.card, shown: false});
stDcaAdvCheck.onChange(function(on) { stDcaAdvPanel.style().set('shown', on); });

var stDcaMethodNote = note('How ST-DCA works: Pairs each Landsat scene with the exact ERA5-Land hour (±60 min), blends local (3 km) and regional (8 km) clear-sky residuals with a scene-mean bias fallback (preventing cold edge drops), and adds a 30 m texture prior regressed on NDVI, MNDWI, elevation and annual LST anomaly. Residuals ignore the cloud-edge halo (150 m, auto-narrowed to 60 m on cloudy scenes), and monthly scenes are harmonized to one level.');
var stDcaValidationBtn = ui.Button({label: 'Test ST-DCA Accuracy (Artificial Cloud Test)', style: {stretch: 'horizontal'}});
var stDcaGapSelect = ui.Select({items: ['Small (~300 m)', 'Medium (~1 km blocks)', 'Large (~3 km blocks)'], value: 'Small (~300 m)', style: {stretch: 'horizontal'}});
var stDcaValidationStatus = lbl('Optional: Click above to hide 20% of clear pixels as fake clouds and test how accurately ST-DCA reconstructs them.', {whiteSpace: 'normal', fontSize: '11px', color: C.muted});
var stDcaValidationBox = ui.Panel([], null, {backgroundColor: C.bg});

var satSelect = ui.Select({items: ['Terra (10:30, closest to Landsat)', 'Aqua (13:30)', 'Terra + Aqua (mean)'],
  value: 'Terra (10:30, closest to Landsat)', style: {stretch: 'horizontal'}});
var winSelect = ui.Select({items: ['Same day only', '±1 day', '±2 days', '±3 days'], value: '±1 day', style: {stretch: 'horizontal', shown: false}});
var winLbl = lbl('MODIS window (Selected days mode)', {shown: false});
var winNote = note('Monthly mode fills gaps with the MODIS monthly mean.');
var corrCheck = ui.Checkbox({label: 'Correct MODIS to Landsat (regression)', value: true, style: {backgroundColor: C.card, color: C.text}});

var modisMethodPanel = ui.Panel([
  lbl('MODIS satellite'), satSelect, winLbl, winSelect, winNote, corrCheck,
  note('Fits Landsat = a × MODIS + b on same-date 1 km pairs of this month.')
], null, {backgroundColor: C.card, shown: false});
var stDcaMethodPanel = ui.Panel([
  stDcaSharpenCheck,
  stDcaMethodNote,
  stDcaAdvCheck,
  stDcaAdvPanel,
  lbl('Artificial gap size for the test'), stDcaGapSelect,
  frame(stDcaValidationBtn, C.accent, 8), stDcaValidationStatus, stDcaValidationBox
], null, {backgroundColor: C.card, shown: true});

function updateGapMethodControls() {
  var isStDca = fillMethodSelect.getValue().indexOf('ERA5-Land ST-DCA') === 0;
  modisMethodPanel.style().set('shown', !isStDca);
  stDcaMethodPanel.style().set('shown', isStDca);
}
fillMethodSelect.onChange(updateGapMethodControls);
var fillBox = ui.Panel([], null, {backgroundColor: C.card});
var hybCard = card('4. LST Cloud Gap-Filling');
hybCard.add(hybridCheck);
hybCard.add(lbl('Gap-filling method')); hybCard.add(fillMethodSelect);
hybCard.add(modisMethodPanel);
hybCard.add(stDcaMethodPanel);
hybCard.add(lbl('Fill source breakdown', {fontWeight: 'bold', margin: '8px 0 2px 0'}));
hybCard.add(fillBox);
tab1.add(hybCard);

var cloudSlider = ui.Slider({min: 0, max: 100, value: DEFAULT_CLOUD, step: 5, style: {stretch: 'horizontal'}});
var cloudLbl = lbl('Max cloud cover per scene: ' + DEFAULT_CLOUD + ' %');
cloudSlider.onChange(function(v) { cloudLbl.setValue('Max cloud cover per scene: ' + v + ' %'); });
var dqBox = ui.Panel([], null, {backgroundColor: C.card});
var cloudCard = card('5. Cloud Filter & Data Quality');
cloudCard.add(cloudLbl); cloudCard.add(cloudSlider);
cloudCard.add(note('If your month has very few clear pixels, increase this slider to 70–80% so ST-DCA has more scenes to work with.'));
cloudCard.add(dqBox);
tab1.add(cloudCard);

var goBtn = ui.Button({label: 'Show on Map', style: {stretch: 'horizontal', margin: '8px 0 0 0'}});
var statusSpec = lbl('', {backgroundColor: C.bg, margin: '6px 2px', whiteSpace: 'normal'});
var dlSpec = ui.Panel([], null, {backgroundColor: C.bg});
var qualBox = ui.Panel([], null, {backgroundColor: C.bg});
tab1.add(frame(goBtn)); tab1.add(statusSpec); tab1.add(qualBox); tab1.add(dlSpec);

// ===== Tab 2: LULC =====
var lulcSelect = ui.Select({items: Object.keys(LULC), value: Object.keys(LULC)[0], style: {stretch: 'horizontal'}});
var lulcNote = note(LULC[Object.keys(LULC)[0]].note);
lulcSelect.onChange(function(k) { lulcNote.setValue(LULC[k].note); });
var lulcCard = card('Land use / land cover');
lulcCard.add(lbl('Dataset')); lulcCard.add(lulcSelect); lulcCard.add(lulcNote);
lulcCard.add(note('Uses the year chosen above.'));
tab2.add(lulcCard);
var lulcBtn = ui.Button({label: 'Show LULC', style: {stretch: 'horizontal', margin: '8px 0 0 0'}});
var statusLulc = lbl('', {backgroundColor: C.bg, margin: '6px 2px'});
var tableLulc = ui.Panel([], null, {backgroundColor: C.bg});
var dlLulc = ui.Panel([], null, {backgroundColor: C.bg});
tab2.add(frame(lulcBtn)); tab2.add(statusLulc); tab2.add(tableLulc); tab2.add(dlLulc);

// ===== Tab 3: Accuracy =====
var assetBox = ui.Textbox({placeholder: 'users/yourname/validation_points', style: {stretch: 'horizontal'}});
var propBox = ui.Textbox({placeholder: 'class', value: 'class', style: {stretch: 'horizontal'}});
var accCard = card('Accuracy assessment');
accCard.add(note('Checks the LULC dataset chosen in the LULC tab (same area and year) against your own reference points.'));
accCard.add(lbl('Validation points (asset path of an uploaded shapefile, zip or CSV)')); accCard.add(assetBox);
accCard.add(lbl('Column with the true class code')); accCard.add(propBox);
accCard.add(note('Class codes in your points must match the dataset codes (shown in the LULC table).'));
tab3.add(accCard);
var accBtn = ui.Button({label: 'Calculate accuracy', style: {stretch: 'horizontal', margin: '8px 0 0 0'}});
var statusAcc = lbl('', {backgroundColor: C.bg, margin: '6px 2px'});
var diagAcc = ui.Panel([], null, {backgroundColor: C.bg});
var dlAcc = ui.Panel([], null, {backgroundColor: C.bg});
tab3.add(frame(accBtn)); tab3.add(statusAcc); tab3.add(diagAcc); tab3.add(dlAcc);

// ===== Tab 4: Random Forest =====
var RF_COLORS = ['e41a1c','377eb8','4daf4a','ff7f00','984ea3','a65628','f781bf','ffd92f','00bcd4','8d6e63','607d8b','cddc39'];
var IDX7 = ['NDVI', 'NDBI', 'BSI', 'NDWI', 'MNDWI', 'EVI', 'SAVI'];
var rfClasses = [];
var rfNextCode = 1;

var rfNameBox = ui.Textbox({placeholder: 'class name, e.g. Built-up', style: {stretch: 'horizontal'}});
var rfAddBtn = ui.Button({label: 'Add class', style: {stretch: 'horizontal'}});
var rfShape = ui.Select({items: ['Points', 'Polygons'], value: 'Points', style: {stretch: 'horizontal'}});
var rfList = ui.Panel([], null, {backgroundColor: C.card});
var rfStopBtn = ui.Button({label: 'Stop'});
var rfUndoBtn = ui.Button({label: 'Undo'});
var rfRedoBtn = ui.Button({label: 'Redo'});

var COLOR_OPTIONS = [['Red','e41a1c'],['Blue','377eb8'],['Green','4daf4a'],['Orange','ff7f00'],['Purple','984ea3'],
  ['Brown','a65628'],['Pink','f781bf'],['Yellow','ffd92f'],['Cyan','00bcd4'],['Lime','76ff03'],['Magenta','ff00ff'],
  ['Black','000000'],['White','ffffff'],['Grey','9e9e9e']];
var COLOR_NAMES = COLOR_OPTIONS.map(function(c) { return c[0]; });
var rfColorSel = ui.Select({items: ['Auto'].concat(COLOR_NAMES), value: 'Auto', style: {stretch: 'horizontal'}});
var rfHexBox = ui.Textbox({placeholder: 'or hex code, e.g. #ff5500 (optional)', style: {stretch: 'horizontal'}});
var rfClsCard = card('2. Classes and samples');
rfClsCard.add(note('Study the reference layers from step 1 first. Add a class, press Draw on it, then click on the map.'));
rfClsCard.add(lbl('Class name')); rfClsCard.add(rfNameBox); rfClsCard.add(frame(rfAddBtn, C.line, 6));
rfClsCard.add(lbl('Draw as')); rfClsCard.add(rfShape);
rfClsCard.add(lbl('Point / class colour')); rfClsCard.add(rfColorSel); rfClsCard.add(rfHexBox);
rfClsCard.add(rfList);
rfClsCard.add(ui.Panel([frame(rfUndoBtn, C.line, 8), frame(rfRedoBtn, C.line, 8), frame(rfStopBtn, C.line, 8)],
  ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card, margin: '0'}));
var rfAssetBox = ui.Textbox({placeholder: 'projects/your-project/assets/my_samples', style: {stretch: 'horizontal'}});
var rfAssetColBox = ui.Textbox({placeholder: 'class column, e.g. class', value: 'class', style: {stretch: 'horizontal'}});
var rfAssetBtn = ui.Button({label: 'Import samples from asset', style: {stretch: 'horizontal'}});
rfClsCard.add(lbl('Or import samples from an uploaded file', {fontWeight: 'bold', margin: '12px 0 2px 0'}));
rfClsCard.add(lbl('Asset path')); rfClsCard.add(rfAssetBox);
rfClsCard.add(lbl('Class column')); rfClsCard.add(rfAssetColBox);
rfClsCard.add(frame(rfAssetBtn, C.line, 6));

var rfSensor = ui.Select({items: ['Sentinel-2 (10 m, 2017+)', 'Landsat (30 m, 1984+)'], value: 'Sentinel-2 (10 m, 2017+)', style: {stretch: 'horizontal'}});
var rfFrom = ui.Select({items: months, value: '01', style: {width: '90px'}});
var rfTo = ui.Select({items: months, value: '12', style: {width: '90px'}});
var rfIdx = ui.Checkbox({label: 'Add indices (NDVI, NDBI, BSI, NDWI, MNDWI, EVI, SAVI)', value: true, style: {backgroundColor: C.card, color: C.text}});
var rfDem = ui.Checkbox({label: 'Add elevation & slope (SRTM)', value: false, style: {backgroundColor: C.card, color: C.text}});
var rfCloud = ui.Slider({min: 0, max: 100, value: 70, step: 5, style: {stretch: 'horizontal'}});
var rfCloudLbl = lbl('Max cloud cover per scene: 70 %');
rfCloud.onChange(function(v) { rfCloudLbl.setValue('Max cloud cover per scene: ' + v + ' %'); });
var rfS1 = ui.Checkbox({label: 'Add Sentinel-1 radar (VV, VH)', value: false, style: {backgroundColor: C.card, color: C.text}});
var rfShowBtn = ui.Button({label: 'Load reference layers on map', style: {stretch: 'horizontal'}});
var RF_PREVIEW = [
  ['rgb', 'True colour (RGB)', true],
  ['fcc', 'False colour (NIR, Red, Green)', true],
  ['NDVI', 'NDVI (vegetation)', true],
  ['NDBI', 'NDBI (built-up)', true],
  ['MNDWI', 'MNDWI (water)', true],
  ['BSI', 'BSI (bare soil)', false],
  ['EVI', 'EVI', false],
  ['SAVI', 'SAVI', false]
];
var rfPrevChecks = RF_PREVIEW.map(function(p) {
  return ui.Checkbox({label: p[1], value: p[2], style: {backgroundColor: C.card, color: C.text}});
});
var rfImgCard = card('1. Imagery and reference layers');
rfImgCard.add(lbl('Satellite')); rfImgCard.add(rfSensor);
rfImgCard.add(lbl('Months (median composite)'));
rfImgCard.add(ui.Panel([rfFrom, ui.Label('to', {backgroundColor: C.card, margin: '8px 6px'}), rfTo], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
rfImgCard.add(rfIdx); rfImgCard.add(rfDem); rfImgCard.add(rfS1);
rfImgCard.add(rfCloudLbl); rfImgCard.add(rfCloud);
var rfRaster = {id: null, names: null, vis: null};
var rfRasterBox = ui.Textbox({placeholder: 'projects/your-project/assets/my_raster', style: {stretch: 'horizontal'}});
var rfRasterBtn = ui.Button({label: 'Load raster from asset', style: {stretch: 'horizontal'}});
var rfRasterUse = ui.Checkbox({label: 'Use its bands as Random Forest inputs', value: false, style: {backgroundColor: C.card, color: C.text}});
rfRasterBox.onChange(function() { rfRaster = {id: null, names: null, vis: null}; });
rfImgCard.add(lbl('Extra raster (optional GeoTIFF asset)', {fontWeight: 'bold', margin: '10px 0 2px 0'}));
rfImgCard.add(rfRasterBox); rfImgCard.add(rfRasterUse); rfImgCard.add(frame(rfRasterBtn, C.line, 6));
rfImgCard.add(lbl('Reference layers to load', {fontWeight: 'bold', margin: '10px 0 2px 0'}));
rfPrevChecks.forEach(function(ch) { rfImgCard.add(ch); });
rfImgCard.add(frame(rfShowBtn, C.accent, 8));
tab4.add(rfImgCard);
tab4.add(rfClsCard);

var rfTrees = ui.Textbox({value: '100', style: {width: '90px'}});
var rfSplit = ui.Slider({min: 50, max: 90, value: 70, step: 5, style: {stretch: 'horizontal'}});
var rfSplitLbl = lbl('Training 70 % / test 30 %');
rfSplit.onChange(function(v) { rfSplitLbl.setValue('Training ' + v + ' % / test ' + (100 - v) + ' %'); });
var rfCap = ui.Textbox({value: '1000', style: {width: '90px'}});
var rfRunBtn = ui.Button({label: 'Run Random Forest', style: {stretch: 'horizontal', margin: '8px 0 0 0'}});
var rfSetCard = card('3. Random Forest settings');
rfSetCard.add(ui.Panel([lbl('Trees', {width: '190px'}), rfTrees], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
rfSetCard.add(rfSplitLbl); rfSetCard.add(rfSplit);
rfSetCard.add(ui.Panel([lbl('Max pixels per class (train)', {width: '190px'}), rfCap], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
tab4.add(rfSetCard);
var statusRf = lbl('', {backgroundColor: C.bg, margin: '6px 2px', whiteSpace: 'normal'});
var rfOut = ui.Panel([], null, {backgroundColor: C.bg});
var rfDiag = ui.Panel([], null, {backgroundColor: C.bg});
var rfDl = ui.Panel([], null, {backgroundColor: C.bg});
tab4.add(frame(rfRunBtn)); tab4.add(statusRf); tab4.add(rfDiag); tab4.add(rfOut); tab4.add(rfDl);

var aboutOn = false;
var aboutBtn = ui.Button({label: 'About: method, data sources, limitations'});
var aboutPanel = card('About TerraLens');
aboutPanel.style().set('shown', false);
function aboutHead(t) { return lbl(t, {fontWeight: 'bold', color: C.title, margin: '8px 0 2px 0'}); }
function aboutPara(t) { return wl(t, {fontSize: '11px', margin: '2px 0'}); }
aboutPanel.add(aboutHead('Method'));
aboutPanel.add(aboutPara('• LST: Landsat 5/7/8/9 Collection 2 Level-2 surface temperature (°C) with QA_PIXEL, QA_RADSAT and ST_QA screening.'));
aboutPanel.add(aboutPara('• Multi-Scale Auto-Scaled 30 m ST-DCA: pairs each Landsat scene with the nearest ERA5-Land hourly skin temperature (±60 min), blends local and regional (8 km) clear-sky residuals with a scene-mean bias fallback (preventing cold edge drops in large cloud gaps), and adds a scene-calibrated 30 m spatial anomaly prior (alpha * annual clear-sky high-pass anomaly).'));
aboutBtn.onClick(function() {
  aboutOn = !aboutOn;
  aboutPanel.style().set('shown', aboutOn);
  aboutBtn.setLabel(aboutOn ? 'Hide about' : 'About: method, data sources, limitations');
});
body.add(frame(aboutBtn, C.line, 14));
body.add(aboutPanel);

var joinCard = card('Get updates on Telegram');
joinCard.add(lbl('Scan the QR or tap the button to join the TerraLens channel.', {whiteSpace: 'normal', margin: '0 0 2px 0'}));
joinCard.add(qrThumb());
joinCard.add(ui.Label('Join ' + TG_HANDLE, {backgroundColor: C.primary, color: 'white', fontWeight: 'bold', fontSize: '13px',
  padding: '9px 12px', margin: '8px 0 0 0', textAlign: 'center', stretch: 'horizontal'}, TG_URL));
body.add(joinCard);

var authorCard = ui.Panel([
  ui.Label(' ', {backgroundColor: C.warm, fontSize: '2px', padding: '0', margin: '0', stretch: 'horizontal'}),
  ui.Panel([
    ui.Label('BUILT BY', {fontSize: '11px', fontWeight: 'bold', color: '#9fc3dc', backgroundColor: C.primary, margin: '12px 0 0 0'}),
    ui.Label(AUTHOR, {fontSize: '26px', fontWeight: 'bold', color: 'white', backgroundColor: C.primary, margin: '0'}),
    ui.Label(AUTHOR_TAGLINE, {fontSize: '12px', color: '#e6eff6', backgroundColor: C.primary, margin: '2px 0 12px 0'})
  ], null, {backgroundColor: C.primary, padding: '0 14px'})
], null, {backgroundColor: C.primary, margin: '12px 0 0 0'});
body.add(authorCard);

var legend = ui.Panel([], null, {position: 'bottom-right', padding: '8px 10px', backgroundColor: C.overlay, border: '1px solid ' + C.line});
map.add(legend);
var accBox = ui.Panel([], null, {position: 'top-center', padding: '10px 12px', backgroundColor: C.overlay, border: '1px solid ' + C.line, shown: false});
map.add(ui.Label('TerraLens  ·  built by ' + AUTHOR + '  ·  ' + TG_HANDLE, {position: 'bottom-left', backgroundColor: C.overlay, color: C.primary, fontSize: '11px', fontWeight: 'bold', padding: '6px 10px', border: '1px solid ' + C.line}, TG_URL));
map.add(accBox);

function legendLabel(t, st) { return ui.Label(t, merge({backgroundColor: C.card, color: C.text, margin: '1px 0', fontSize: '11px'}, st || {})); }
function updateLegend(name, customMin, customMax) {
  var v = VIS[name];
  var mn = (customMin !== undefined && customMin !== null) ? Number(customMin).toFixed(1) : String(v.min);
  var mx = (customMax !== undefined && customMax !== null) ? Number(customMax).toFixed(1) : String(v.max);
  legend.clear();
  legend.add(legendLabel(name + (UNITS[name] ? ' (' + UNITS[name] + ')' : ''), {fontWeight: 'bold', fontSize: '12px'}));
  legend.add(ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {bbox: [0, 0, 1, 0.1], dimensions: '200x12', format: 'png', min: 0, max: 1, palette: v.palette},
    style: {stretch: 'horizontal', backgroundColor: C.card}}));
  legend.add(ui.Panel([legendLabel(mn, {margin: '0'}), legendLabel(mx, {margin: '0 0 0 135px'})],
    ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
}
function swatch(color) { return ui.Label(' ', {backgroundColor: '#' + color, padding: '0 9px', margin: '3px 6px 3px 0', border: '1px solid #90a4ae'}); }

function loadDistricts(st, done) {
  districtSelect.items().reset([ALL]);
  districtSelect.setValue(ALL, false);
  gaul2.filter(ee.Filter.eq('ADM1_NAME', st)).aggregate_array('ADM2_NAME').distinct().sort()
    .evaluate(function(list) {
      districtSelect.items().reset([ALL].concat(list));
      districtSelect.setValue(ALL, false);
      if (done) done();
    });
}
gaul1.aggregate_array('ADM1_NAME').distinct().sort().evaluate(function(list) {
  stateNames = list;
  stateSelect.items().reset(list);
  stateSelect.setValue(list.indexOf('Assam') >= 0 ? 'Assam' : list[0]);
});
stateSelect.onChange(function(st) { loadDistricts(st); });
gaul2.reduceColumns(ee.Reducer.toList(2), ['ADM2_NAME', 'ADM1_NAME']).get('list')
  .evaluate(function(l) { places = l || []; });

function aoiOpacityHex() {
  var pct = aoiOutlineOnlyCheck.getValue() ? 0 : Number(aoiFillOpacity.getValue() || 0);
  var alpha = Math.max(0, Math.min(255, Math.round(pct * 255 / 100)));
  return ('0' + alpha.toString(16)).slice(-2).toUpperCase();
}
function aoiUpdateOpacityLabel() {
  var pct = aoiOutlineOnlyCheck.getValue() ? 0 : Number(aoiFillOpacity.getValue() || 0);
  aoiFillOpacityLabel.setValue('AOI fill opacity: ' + pct + '%  (0% = Outline only)');
}
function aoiBringDisplayToFront() {
  try { map.layers().remove(aoiDisplayLayer); } catch (e) {}
  map.layers().add(aoiDisplayLayer);
}
function aoiRenderDisplay() {
  var count = aoiLayer.geometries().length();
  var useCustom = areaSourceSelect.getValue() === 'Custom study area';
  if (!useCustom || !count || aoiInteractionMode !== 'pan') {
    aoiDisplayLayer.setShown(false);
    return;
  }
  var fc = ee.FeatureCollection([ee.Feature(getCustomAoiGeometry(), {name: 'Custom study area'})]);
  var styled = fc.style({color: AOI_COLOR, width: 2, fillColor: AOI_COLOR + aoiOpacityHex()});
  aoiDisplayLayer.setEeObject(styled);
  aoiDisplayLayer.setVisParams({});
  aoiDisplayLayer.setOpacity(1);
  aoiDisplayLayer.setShown(true);
  aoiBringDisplayToFront();
}
function aoiSetPanMode(message) {
  try { dt.stop(); } catch (e) {}
  try { dt.setSelected(null); } catch (e) {}
  aoiInteractionMode = 'pan';
  aoiLayer.setShown(false);
  aoiRenderDisplay();
  if (message) aoiStatus.setValue(message);
  else if (aoiLayer.geometries().length()) aoiStatus.setValue('Pan / navigate mode active. Your custom boundary is retained.');
  else aoiStatus.setValue('No custom boundary yet. Draw a polygon or rectangle on the map.');
}
function setAreaSource(source) {
  var useCustom = source === 'Custom study area';
  var useAsset = source === ASSET_SRC;
  areaSourceSelect.setValue(useCustom ? 'Custom study area' : (useAsset ? ASSET_SRC : 'State / District'), false);
  adminAreaPanel.style().set('shown', !useCustom && !useAsset);
  assetAreaPanel.style().set('shown', useAsset);
  aoiCard.style().set('shown', useCustom);
  try { dt.stop(); } catch (e) {}
  try { dt.setSelected(null); } catch (e) {}
  aoiInteractionMode = 'pan';
  aoiLayer.setShown(false);
  if (useCustom) {
    aoiUpdateSummary();
    aoiRenderDisplay();
  } else {
    aoiDisplayLayer.setShown(false);
  }
}
areaSourceSelect.onChange(function(source) { setAreaSource(source); });

function aoiGeometryList() {
  var list = aoiLayer.geometries(), out = [];
  for (var i = 0; i < list.length(); i++) out.push(list.get(i));
  return out;
}
function aoiSameState(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function aoiPushHistory() {
  if (aoiRestoring) return;
  var state = aoiGeometryList();
  if (aoiHistory.length && aoiSameState(aoiHistory[aoiHistory.length - 1], state)) return;
  aoiHistory.push(state);
  if (aoiHistory.length > 100) aoiHistory.shift();
  aoiRedoStack = [];
}
function aoiRestoreState(state) {
  aoiRestoring = true;
  aoiLayer.geometries().reset(state.slice());
  aoiRestoring = false;
  aoiUpdateSummary();
  aoiRenderDisplay();
}
function getCustomAoiGeometry() {
  return aoiLayer.toGeometry().dissolve(1);
}
function aoiUpdateSummary() {
  var count = aoiLayer.geometries().length();
  if (!count) {
    aoiStatus.setValue('No custom boundary yet. Draw a polygon or rectangle on the map.');
    if (aoiInteractionMode === 'pan') aoiDisplayLayer.setShown(false);
    return;
  }
  aoiStatus.setValue('Calculating custom AOI area... (' + count + ' shape' + (count === 1 ? '' : 's') + ')');
  var geom = getCustomAoiGeometry();
  geom.area(1).divide(1e6).evaluate(function(areaKm2, err) {
    if (areaKm2 === null || areaKm2 === undefined || err) {
      aoiStatus.setValue('Custom AOI contains ' + count + ' shape(s).');
    } else {
      aoiStatus.setValue('Custom AOI ready · ' + count + ' shape(s) · ' + Number(areaKm2).toFixed(2) + ' km². Click “Use custom study area” below.');
    }
  });
}
function aoiStartDrawing(shape) {
  setAreaSource('Custom study area');
  try { dt.stop(); } catch (e) {}
  aoiInteractionMode = 'draw';
  aoiDisplayLayer.setShown(false);
  aoiLayer.setColor('#00e5ff');
  aoiLayer.setShown(true);
  dt.setDrawModes(['point', 'polygon', 'rectangle']);
  dt.setSelected(aoiLayer);
  dt.setShape(shape);
  dt.draw();
  aoiStatus.setValue('Drawing ' + (shape === 'rectangle' ? 'rectangle' : 'polygon') + '. Finish the shape, then click "Use custom study area".');
}
function aoiUndo() {
  aoiSetPanMode();
  if (aoiHistory.length <= 1) { aoiStatus.setValue('Nothing to undo.'); return; }
  aoiRedoStack.push(aoiHistory.pop());
  aoiRestoreState(aoiHistory[aoiHistory.length - 1]);
}
function aoiRedo() {
  aoiSetPanMode();
  if (!aoiRedoStack.length) { aoiStatus.setValue('Nothing to redo.'); return; }
  var state = aoiRedoStack.pop();
  aoiHistory.push(state);
  aoiRestoreState(state);
}
function aoiDeleteLast() {
  aoiSetPanMode();
  var state = aoiGeometryList();
  if (!state.length) { aoiStatus.setValue('There is no custom shape to delete.'); return; }
  aoiRestoring = true;
  aoiLayer.geometries().reset(state.slice(0, -1));
  aoiRestoring = false;
  aoiPushHistory();
  aoiUpdateSummary();
  aoiRenderDisplay();
}
function aoiClearAll() {
  aoiSetPanMode();
  if (!aoiLayer.geometries().length()) { aoiStatus.setValue('The custom study area is already empty.'); return; }
  aoiRestoring = true;
  aoiLayer.geometries().reset([]);
  aoiRestoring = false;
  aoiPushHistory();
  aoiUpdateSummary();
  aoiDisplayLayer.setShown(false);
}
function getArea() {
  if (areaSourceSelect.getValue() === ASSET_SRC) {
    var aid = tx(aoiAssetBox.getValue());
    if (!aid) return null;
    var afc = ee.FeatureCollection(aid);
    var acol = tx(aoiAssetColBox.getValue()), aval = tx(aoiAssetValBox.getValue());
    if (acol && aval) {
      var anum = Number(aval);
      afc = afc.filter(isNaN(anum) ? ee.Filter.eq(acol, aval) : ee.Filter.or(ee.Filter.eq(acol, aval), ee.Filter.eq(acol, anum)));
    }
    return {fc: afc, geom: afc.geometry(), tag: clean(aid.split('/').pop() + (acol && aval ? '_' + aval : ''))};
  }
  if (areaSourceSelect.getValue() === 'Custom study area') {
    if (!aoiLayer.geometries().length()) return null;
    var customGeom = getCustomAoiGeometry();
    var customFc = ee.FeatureCollection([ee.Feature(customGeom, {name: 'Custom study area'})]);
    return {fc: customFc, geom: customGeom, tag: 'Custom_AOI'};
  }
  var st = stateSelect.getValue(), di = districtSelect.getValue();
  if (!st || st === 'Loading...') return null;
  var fc = (di === ALL)
    ? gaul1.filter(ee.Filter.eq('ADM1_NAME', st))
    : gaul2.filter(ee.Filter.and(ee.Filter.eq('ADM1_NAME', st), ee.Filter.eq('ADM2_NAME', di)));
  return {fc: fc, geom: fc.geometry(), tag: (di === ALL ? st : di)};
}

dt.onDraw(function(geometry, layer) {
  if (layer === aoiLayer && !aoiRestoring) { aoiPushHistory(); aoiUpdateSummary(); }
});
dt.onEdit(function(geometry, layer) {
  if (layer === aoiLayer && !aoiRestoring) { aoiPushHistory(); aoiUpdateSummary(); }
});
dt.onErase(function(geometry, layer) {
  if (layer === aoiLayer && !aoiRestoring) { aoiPushHistory(); aoiUpdateSummary(); }
});
aoiAssetBtn.onClick(function() {
  var a = getArea();
  if (!a) { aoiAssetStatus.setValue('Paste the asset path first.'); return; }
  aoiAssetStatus.setValue('Reading the asset...');
  ee.Dictionary({n: a.fc.size(), area: a.geom.area(100)}).evaluate(function(r, err) {
    if (!r) { aoiAssetStatus.setValue('Could not read the asset. ' + (err ? '(' + err + ')' : '')); return; }
    if (!r.n) { aoiAssetStatus.setValue('No features found.'); return; }
    map.centerObject(a.fc);
    map.addLayer(a.fc.style({color: AOI_COLOR, fillColor: '00000000', width: 2}), {}, 'Uploaded boundary');
    aoiAssetStatus.setValue('Loaded ' + r.n + ' feature(s), about ' + fmt(r.area / 1e6, 1) + ' km².');
  });
});
aoiPolygonBtn.onClick(function() { aoiStartDrawing('polygon'); });
aoiRectangleBtn.onClick(function() { aoiStartDrawing('rectangle'); });
aoiEditBtn.onClick(function() {
  if (!aoiLayer.geometries().length()) { aoiStatus.setValue('Draw a boundary before editing it.'); return; }
  try { dt.stop(); } catch (e) {}
  aoiInteractionMode = 'edit';
  aoiDisplayLayer.setShown(false);
  aoiLayer.setShown(true);
  dt.setDrawModes(['point', 'polygon', 'rectangle']);
  dt.setSelected(aoiLayer);
  dt.edit();
  aoiStatus.setValue('Edit mode active. Move boundary vertices on the map.');
});
aoiStopBtn.onClick(function() { aoiSetPanMode('Pan / navigate mode active.'); });
aoiUndoBtn.onClick(aoiUndo);
aoiRedoBtn.onClick(aoiRedo);
aoiDeleteBtn.onClick(aoiDeleteLast);
aoiClearBtn.onClick(aoiClearAll);
aoiUseBtn.onClick(function() {
  if (!aoiLayer.geometries().length()) { aoiStatus.setValue('Draw at least one polygon or rectangle first.'); return; }
  aoiSetPanMode('Custom study area locked and ready! Now click "Show on Map" below.');
  map.centerObject(getCustomAoiGeometry());
  aoiUpdateSummary();
  aoiRenderDisplay();
});
aoiExportBtn.onClick(function() {
  aoiDownloadBox.clear();
  if (!aoiLayer.geometries().length()) { aoiStatus.setValue('Draw a boundary before downloading it.'); return; }
  var customFc = ee.FeatureCollection([ee.Feature(getCustomAoiGeometry(), {name: 'Custom study area'})]);
  boundaryLink(aoiDownloadBox, customFc, 'TerraLens_Custom_AOI');
});
aoiFillOpacity.onChange(function(value) {
  aoiOutlineOnlyCheck.setValue(Number(value) === 0, false);
  aoiUpdateOpacityLabel();
  aoiRenderDisplay();
});
aoiOutlineOnlyCheck.onChange(function(checked) {
  if (checked) aoiFillOpacity.setValue(0, false);
  else if (Number(aoiFillOpacity.getValue()) === 0) aoiFillOpacity.setValue(15, false);
  aoiUpdateOpacityLabel();
  aoiRenderDisplay();
});
aoiUpdateOpacityLabel();

function clean(s) { return s.replace(/[^A-Za-z0-9_]/g, '_'); }

// ---------------- Landsat processing ----------------
var NAMES = ['B', 'G', 'R', 'N', 'S1', 'S2', 'ST'];
var SENSORS = [
  ['LANDSAT/LT05/C02/T1_L2', ['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B7','ST_B6']],
  ['LANDSAT/LE07/C02/T1_L2', ['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B7','ST_B6']],
  ['LANDSAT/LC08/C02/T1_L2', ['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7','ST_B10']],
  ['LANDSAT/LC09/C02/T1_L2', ['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7','ST_B10']]
];
function cloudDefault(c) { return (c === undefined || c === null) ? cloudSlider.getValue() : c; }
function landsatCol(start, end, geom, maxCloud) {
  maxCloud = cloudDefault(maxCloud);
  var merged = ee.ImageCollection([]);
  SENSORS.forEach(function(s) {
    var bands = s[1];
    var raw = ee.ImageCollection(s[0]).filterDate(start, end).filterBounds(geom);
    if (maxCloud < 100) raw = raw.filter(ee.Filter.lte('CLOUD_COVER', maxCloud));
    var col = raw
      .map(function(img) {
        var optical = img.select(bands.slice(0, 6)).multiply(0.0000275).add(-0.2);
        var st = img.select(bands[6]).multiply(0.00341802).add(149.0).subtract(273.15);
        var stq = img.select('ST_QA').multiply(0.01);
        var clear = img.select('QA_PIXEL').bitwiseAnd(31).eq(0)
          .and(img.select('QA_RADSAT').eq(0))
          .and(stq.lt(ST_UNC_MAX))
          .and(st.gt(ST_MIN_C)).and(st.lt(ST_MAX_C));
        return optical.addBands(st).rename(NAMES).updateMask(clear)
          .copyProperties(img, ['system:time_start', 'CLOUD_COVER', 'LANDSAT_PRODUCT_ID', 'SPACECRAFT_ID']);
      });
    merged = merged.merge(col);
  });
  return merged;
}
function landsatComposite(start, end, geom, maxCloud) {
  var col = landsatCol(start, end, geom, maxCloud);
  var empty = ee.Image.constant([0, 0, 0, 0, 0, 0, 0]).rename(NAMES).updateMask(ee.Image.constant(0));
  return ee.Image(ee.Algorithms.If(col.size().gt(0), col.median(), empty));
}
var NAMES6 = ['B', 'G', 'R', 'N', 'S1', 'S2'];
function sentinelCol(start, end, geom, maxCloud) {
  maxCloud = cloudDefault(maxCloud);
  var raw = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterDate(start, end).filterBounds(geom);
  if (maxCloud < 100) raw = raw.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', maxCloud));
  return raw
    .map(function(img) {
      var scl = img.select('SCL');
      var clear = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
      return img.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']).multiply(0.0001).rename(NAMES6).updateMask(clear);
    });
}
function sentinelComposite(start, end, geom, maxCloud) {
  var col = sentinelCol(start, end, geom, maxCloud);
  var empty = ee.Image.constant([0, 0, 0, 0, 0, 0]).rename(NAMES6).updateMask(ee.Image.constant(0));
  return ee.Image(ee.Algorithms.If(col.size().gt(0), col.median(), empty));
}

function addIndices(img, withLST) {
  var e = {B: img.select('B'), G: img.select('G'), R: img.select('R'), N: img.select('N'), S1: img.select('S1'), S2: img.select('S2')};
  var out = [
    img.normalizedDifference(['N', 'R']).rename('NDVI'),
    img.normalizedDifference(['S1', 'N']).rename('NDBI'),
    img.expression('((S1 + R) - (N + B)) / ((S1 + R) + (N + B))', e).rename('BSI'),
    img.normalizedDifference(['G', 'N']).rename('NDWI'),
    img.normalizedDifference(['G', 'S1']).rename('MNDWI'),
    img.expression('2.5 * (N - R) / (N + 6 * R - 7.5 * B + 1)', e).clamp(-1, 1).rename('EVI'),
    img.expression('1.5 * (N - R) / (N + R + 0.5)', e).rename('SAVI'),
    img.normalizedDifference(['N', 'S1']).rename('NDMI'),
    img.normalizedDifference(['N', 'S2']).rename('NBR'),
    img.normalizedDifference(['N', 'G']).rename('GNDVI'),
    img.expression('(2 * N + 1 - sqrt((2 * N + 1) * (2 * N + 1) - 8 * (N - R))) / 2', e).clamp(-1, 1).rename('MSAVI'),
    img.normalizedDifference(['S2', 'N']).rename('UI'),
    img.expression('(2 * S1 / (S1 + N) - (N / (N + R) + G / (G + S1))) / (2 * S1 / (S1 + N) + (N / (N + R) + G / (G + S1)))', e).clamp(-1, 1).rename('IBI'),
    img.normalizedDifference(['S1', 'N']).subtract(img.normalizedDifference(['N', 'R'])).rename('BUI'),
    img.expression('4 * (G - S1) - (0.25 * N + 2.75 * S2)', e).rename('AWEI')
  ];
  if (withLST) out.unshift(img.select('ST').rename('LST'));
  return ee.Image.cat(out);
}

// ---- MODIS daily LST ----
function modisDaily(start, end, geom, sat) {
  var ids = sat === 'aqua' ? ['MODIS/061/MYD11A1'] : (sat === 'both' ? ['MODIS/061/MOD11A1', 'MODIS/061/MYD11A1'] : ['MODIS/061/MOD11A1']);
  var col = ee.ImageCollection([]);
  ids.forEach(function(id) {
    col = col.merge(ee.ImageCollection(id).filterDate(start, end).filterBounds(geom).map(function(img) {
      var good = img.select('QC_Day').bitwiseAnd(3).lte(1);
      return img.select('LST_Day_1km').multiply(0.02).subtract(273.15).updateMask(good).rename('LST');
    }));
  });
  return col;
}
function maskedEmpty(name) { return ee.Image.constant(0).updateMask(ee.Image.constant(0)).rename(name); }
function modisMean(start, end, geom, sat) {
  var col = modisDaily(start, end, geom, sat);
  return ee.Image(ee.Algorithms.If(col.size().gt(0), col.mean(), maskedEmpty('LST')));
}
function modisWindow(d, k, geom, sat) {
  var col = modisDaily(d.advance(-k, 'day'), d.advance(-k + 1, 'day'), geom, sat);
  if (k > 0) col = col.merge(modisDaily(d.advance(k, 'day'), d.advance(k + 1, 'day'), geom, sat));
  return ee.Image(ee.Algorithms.If(col.size().gt(0), col.mean(), maskedEmpty('LST')));
}

// ---- ERA5-Land ST-DCA v1.9.3: cloud-edge buffer, cross-scene harmonization, spectral covariate sharpening ----
var ERA5_ID = 'ECMWF/ERA5_LAND/HOURLY';
var ERA5_TIME_TOLERANCE_MIN = 60;
var ST_DCA_VALID_MIN_FRAC = 0.10;
var ST_DCA_KERNEL_SCALE = 250;
var ST_DCA_EDGE_BUFFER_M = 150;      // Strike 1: preferred cloud/shadow halo (5 Landsat px)
var ST_DCA_EDGE_BUFFER_MIN_M = 60;   // narrower halo used automatically on cloudy scenes
var ST_DCA_CORE_KEEP_FRAC = 0.6;     // wide halo is used only if >= 60% of clear pixels survive it
var ST_DCA_CORE_MIN_FRAC = 0.03;     // if less than 3% of AOI survives erosion, fall back to un-eroded mask
var ST_DCA_HARMONIZE = true;         // Strike 2: align every scene to the month's overall level
var ST_DCA_HARMONIZE_MAX_C = 6;      // cap on the per-scene shift (deg C)
var ST_DCA_SELF_CALIBRATE = true;    // hold-out bias self-calibration
var ST_DCA_CALIB_MIN_PX = 150;       // min hold-out pixels (at 120 m) needed to trust the correction
var ST_DCA_CALIB_MAX_C = 3;          // cap on the correction (deg C)
var ST_DCA_CONTEXT_PAD_M = 5000;      // small AOIs (< 25 km2) borrow context: fits, calibration and covariates use AOI + 5 km pad
var ST_DCA_CONTEXT_MAX_AREA_M2 = 0;      // context pad DISABLED: runs with the pad showed weak self-calibration and cold bias; set to e.g. 25e6 to re-enable for tiny AOIs
function ctxGeom(g) {
  // small AOI: bounding box + pad (non-zero error margin required); large AOI: the AOI itself, no buffer call
  return ee.Geometry(ee.Algorithms.If(g.area(100).lt(ST_DCA_CONTEXT_MAX_AREA_M2),
    g.bounds().buffer(ST_DCA_CONTEXT_PAD_M, 100), g));
}
var COV_NAMES = ['tex_lst', 'tex_ndvi', 'tex_mndwi', 'tex_elev'];

function nearestEra5AtSceneTime(acquisitionDate, geom, targetProjection) {
  var acq = ee.Date(acquisitionDate);
  var eraCol = ee.ImageCollection(ERA5_ID)
    .filterBounds(geom)
    .filterDate(acq.advance(-ERA5_TIME_TOLERANCE_MIN, 'minute'),
                acq.advance(ERA5_TIME_TOLERANCE_MIN + 1, 'minute'));
  var ranked = eraCol.map(function(im) {
    var diffMin = ee.Number(im.get('system:time_start')).subtract(acq.millis()).abs().divide(60000);
    return im.set('abs_time_diff_min', diffMin);
  }).sort('abs_time_diff_min');

  var empty = ee.Image.constant([0, 0, 0]).rename([
    'skin_temperature', 'surface_net_solar_radiation_hourly', 'total_evaporation_hourly'
  ]).updateMask(ee.Image.constant(0));
  var eraProjection = ee.ImageCollection(ERA5_ID).first().select('skin_temperature').projection();
  var matched = ee.Image(ee.Algorithms.If(
    ranked.size().gt(0), ranked.first(), empty.setDefaultProjection(eraProjection)
  ));
  var timeOffsetMin = ee.Number(ee.Algorithms.If(
    ranked.size().gt(0), matched.get('abs_time_diff_min'), -1
  ));

  var eraC = matched.select('skin_temperature').subtract(273.15)
    .rename('ERA5_skin_C').resample('bilinear').reproject({crs: targetProjection});
  var netSolar = matched.select('surface_net_solar_radiation_hourly').divide(3600)
    .rename('ERA5_net_solar_Wm2').resample('bilinear').reproject({crs: targetProjection});
  var totalEvap = matched.select('total_evaporation_hourly').multiply(1000)
    .rename('ERA5_total_evap_mm_h').resample('bilinear').reproject({crs: targetProjection});

  return {image: eraC, netSolar: netSolar, totalEvap: totalEvap,
          count: ranked.size(), timeOffsetMin: timeOffsetMin};
}

// High-pass (local anomaly) of a covariate, same kernel logic as the residual smoothing
function covHighPass(img, kernelProj, radiusM, lo, hi, geom) {
  var m = img.mask().unmask(0).toFloat().reproject({crs: kernelProj});
  var v = img.unmask(0).toFloat().reproject({crs: kernelProj});
  var num = v.focalMean(radiusM, 'circle', 'meters', 1).reproject({crs: kernelProj});
  var den = m.focalMean(radiusM, 'circle', 'meters', 1).reproject({crs: kernelProj});
  var regional = num.resample('bilinear').divide(den.resample('bilinear').max(1e-6));
  return img.subtract(regional).clamp(lo, hi).unmask(0).clip(geom);
}

// Strike 3: 4-band covariate stack = annual LST anomaly + same-month NDVI, MNDWI and elevation anomalies
function buildSpectralCovariates(year, start, end, geom, radiusM) {
  var yStart = ee.Date.fromYMD(year, 1, 1);
  var yEnd = yStart.advance(1, 'year');
  var fallbackProj = ee.Projection('EPSG:4326').atScale(30);
  var kernelProj = fallbackProj.atScale(ST_DCA_KERNEL_SCALE);
  var zero = ee.Image.constant(0).toFloat().clip(geom);

  var annualCol = landsatCol(yStart, yEnd, geom, 75);
  var hasAnnual = annualCol.size().gt(0);
  var annualST = ee.Image(ee.Algorithms.If(hasAnnual, annualCol.select('ST').median(), zero));

  var emptyOpt = ee.Image.constant([0, 0, 0, 0, 0, 0, 0]).rename(NAMES).updateMask(ee.Image.constant(0));
  function optComp(col) { return ee.Image(ee.Algorithms.If(col.size().gt(0), col.median(), emptyOpt)); }
  var annualOpt = optComp(annualCol);
  var monthOpt = optComp(landsatCol(start, end, geom, 75));
  var optImg = monthOpt.unmask(annualOpt);   // same-month optical, annual median only where the month has no clear pixel

  var ndvi = optImg.normalizedDifference(['N', 'R']).rename('NDVI');
  var mndwi = optImg.normalizedDifference(['G', 'S1']).rename('MNDWI');
  var elev = ee.Image('USGS/SRTMGL1_003').select('elevation').toFloat().rename('ELEV');

  var texLst = covHighPass(annualST, kernelProj, radiusM, -5, 5, geom).rename('tex_lst');
  var texNdvi = covHighPass(ndvi, kernelProj, radiusM, -0.6, 0.6, geom).rename('tex_ndvi');
  var texMndwi = covHighPass(mndwi, kernelProj, radiusM, -0.8, 0.8, geom).rename('tex_mndwi');
  var texElev = covHighPass(elev, kernelProj, radiusM, -300, 300, geom).rename('tex_elev');
  return ee.Image.cat([texLst, texNdvi, texMndwi, texElev]);
}

function fillThermalGaps(landsatLST, acquisitionDate, aoiGeom, radiusM, iterations, covariates) {
  var geom = ctxGeom(aoiGeom);   // all fitting runs on AOI + pad; callers clip the output to the AOI
  var targetProjection = landsatLST.projection();
  var kernelProj = targetProjection.atScale(ST_DCA_KERNEL_SCALE);
  var era = nearestEra5AtSceneTime(acquisitionDate, geom, targetProjection);
  var eraC = era.image;
  var zeroInAoi = ee.Image.constant(0).toFloat().clip(geom);

  // Scene-level ERA5 mean over the AOI (footprint-independent anchor for cross-scene harmonization)
  var eraMeanDict = eraC.reduceRegion({
    reducer: ee.Reducer.mean(), geometry: geom, scale: 1000, maxPixels: 1e9, bestEffort: true, tileScale: 4
  });
  var eraMean = ee.Number(ee.Algorithms.If(
    ee.Algorithms.IsEqual(eraMeanDict.get('ERA5_skin_C'), null), -999, eraMeanDict.get('ERA5_skin_C')
  ));

  // ---- Strike 1: Cloud-Edge Buffer ----
  // Residual is estimated only from clear pixels at least 150 m away (auto-narrowed on cloudy scenes) from any cloud, shadow or gap.
  // The original clear LST itself is NOT touched (halo pixels stay in the output).
  var rawResidualFull = landsatLST.subtract(eraC).rename('ST_DCA_raw_offset');
  var clearNow = landsatLST.mask().unmask(0).gt(0).reproject({crs: targetProjection});
  var notClear = clearNow.not();
  var coreWide = clearNow.and(notClear.focalMax({radius: ST_DCA_EDGE_BUFFER_M, kernelType: 'circle', units: 'meters'})
    .reproject({crs: targetProjection}).not()).rename('core_wide');
  var coreNarrow = clearNow.and(notClear.focalMax({radius: ST_DCA_EDGE_BUFFER_MIN_M, kernelType: 'circle', units: 'meters'})
    .reproject({crs: targetProjection}).not()).rename('core_narrow');
  var fracDict = ee.Image.cat([clearNow.rename('clear'), coreWide, coreNarrow]).reduceRegion({
    reducer: ee.Reducer.mean(), geometry: geom, scale: 120, maxPixels: 1e9, bestEffort: true, tileScale: 4
  });
  function fr(k) { return ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(fracDict.get(k), null), 0, fracDict.get(k))); }
  var clearFrac = fr('clear');
  // Adaptive buffer: wide halo only if enough clear pixels survive it, otherwise the narrow halo
  var useWide = ee.Number(ee.Algorithms.If(clearFrac.gt(0), fr('core_wide').divide(clearFrac).gte(ST_DCA_CORE_KEEP_FRAC), 0));
  var coreClear = coreWide.multiply(ee.Image.constant(useWide))
    .add(coreNarrow.multiply(ee.Image.constant(ee.Number(1).subtract(useWide)))).gt(0).rename('core');
  var coreFrac = ee.Number(ee.Algorithms.If(useWide, fr('core_wide'), fr('core_narrow')));
  var useAllClear = coreFrac.lt(ST_DCA_CORE_MIN_FRAC);   // safety net for very cloudy scenes
  var rawResidual = rawResidualFull.updateMask(coreClear.or(ee.Image.constant(useAllClear)))
    .rename('ST_DCA_raw_offset');

  var validResidualMask = rawResidual.mask().gt(0).unmask(0).toFloat().reproject({crs: kernelProj});
  var residualValues = rawResidual.unmask(0).toFloat().reproject({crs: kernelProj});
  var rawNum = residualValues.focalMean(radiusM, 'circle', 'meters', iterations).reproject({crs: kernelProj});
  var rawDen = validResidualMask.focalMean(radiusM, 'circle', 'meters', iterations).reproject({crs: kernelProj});
  var coarseOffset = rawNum.resample('bilinear').unmask(zeroInAoi, false)
    .divide(rawDen.resample('bilinear').unmask(zeroInAoi, false).max(1e-6)).clip(geom);

  // ---- Strike 3: spectral covariate sharpening ----
  // Regress the scene's clear-sky high-pass residual on [annual LST anomaly, NDVI, MNDWI, elevation] anomalies.
  var tex, alpha, bNdvi, bMndwi, bElev;
  if (covariates) {
    var cov = covariates.unmask(0).clip(geom);
    var sceneHighPass = rawResidual.subtract(coarseOffset).rename('hp_y');
    var regIn = ee.Image.cat([cov.select(COV_NAMES), sceneHighPass]).updateMask(sceneHighPass.mask());
    var reg = ee.Dictionary(regIn.reduceRegion({
      reducer: ee.Reducer.linearRegression({numX: 4, numY: 1}),
      geometry: geom, scale: 120, maxPixels: 1e8, bestEffort: true, tileScale: 4
    }));
    var coefRaw = reg.get('coefficients');
    var coefMissing = ee.Algorithms.IsEqual(coefRaw, null);
    var dummyArr = ee.Array([[0], [0], [0], [0.45]]);
    var safeArr = ee.Array(ee.Algorithms.If(coefMissing, dummyArr, coefRaw));
    var coefList = ee.List(ee.Algorithms.If(coefMissing, ee.List([0, 0, 0, 0.45]), safeArr.project([0]).toList()));
    // Sign/size limits keep every coefficient physically plausible (more veg, water, height = cooler)
    var safe = function(i, lo, hi) {
      var n = ee.Number(coefList.get(i));
      return ee.Number(ee.Algorithms.If(n.eq(n), n.max(lo).min(hi), 0));
    };
    alpha = safe(0, 0, 1);
    bNdvi = safe(1, -12, 0);
    bMndwi = safe(2, -8, 0);
    bElev = safe(3, -0.02, 0);
    tex = cov.select('tex_lst').multiply(alpha)
      .add(cov.select('tex_ndvi').multiply(bNdvi))
      .add(cov.select('tex_mndwi').multiply(bMndwi))
      .add(cov.select('tex_elev').multiply(bElev))
      .clamp(-6, 6).rename('tex');
  } else {
    alpha = ee.Number(0); bNdvi = ee.Number(0); bMndwi = ee.Number(0); bElev = ee.Number(0);
    tex = zeroInAoi.rename('tex');
  }

  // Two-scale residual blending (local radius + 8 km regional + scene-mean fallback) as a reusable function
  var broadRadius = Math.max(radiusM * 2.5, 8000);
  function blendResidual(resImg) {
    var vm = resImg.mask().gt(0).unmask(0).toFloat().reproject({crs: kernelProj});
    var base = resImg.subtract(tex).rename('base_res');
    var md = base.reduceRegion({
      reducer: ee.Reducer.mean(), geometry: geom, scale: 250, maxPixels: 1e8, bestEffort: true, tileScale: 4
    });
    var sceneBias = ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(md.get('base_res'), null), 0, md.get('base_res')));
    var sceneImg = ee.Image.constant(sceneBias).toFloat().clip(geom);
    var vals = base.unmask(0).toFloat().reproject({crs: kernelProj});
    var lDen = vm.focalMean(radiusM, 'circle', 'meters', iterations).reproject({crs: kernelProj});
    var lSup = lDen.resample('bilinear').unmask(zeroInAoi, false).clip(geom);
    var lNum = vals.focalMean(radiusM, 'circle', 'meters', iterations).reproject({crs: kernelProj});
    var lMean = lNum.resample('bilinear').unmask(zeroInAoi, false).clip(geom).divide(lSup.max(1e-6));
    var bNum = vals.focalMean(broadRadius, 'circle', 'meters', 2).reproject({crs: kernelProj});
    var bDen = vm.focalMean(broadRadius, 'circle', 'meters', 2).reproject({crs: kernelProj});
    var bSup = bDen.resample('bilinear').unmask(zeroInAoi, false).clip(geom);
    var bMean = bNum.resample('bilinear').unmask(zeroInAoi, false).clip(geom).divide(bSup.max(1e-6));
    var wB = bSup.divide(0.05).clamp(0, 1);
    var regional = bMean.multiply(wB).add(sceneImg.multiply(ee.Image.constant(1).subtract(wB)));
    var wL = lSup.divide(0.10).clamp(0, 1);
    var blended = lMean.multiply(wL).add(regional.multiply(ee.Image.constant(1).subtract(wL)))
      .rename('ST_DCA_offset_smoothed');
    return {blended: blended, localSup: lSup, broadSup: bSup, sceneBias: sceneBias};
  }
  var full = blendResidual(rawResidual);
  var blendedResidual = full.blended;
  var localSup = full.localSup;
  var broadSup = full.broadSup;
  var sceneMeanBiasNum = full.sceneBias;

  // ---- Self-calibration: hide ~11% of clear core pixels in ~1 km blocks, predict them from the rest,
  // measure the mean error and remove it from the gap estimate. Works on any AOI, no manual tuning.
  var biasCorr = ee.Number(0);
  if (ST_DCA_SELF_CALIBRATE) {
    var ll = ee.Image.pixelLonLat();
    var blk = ll.select('longitude').multiply(100).floor().multiply(7)
      .add(ll.select('latitude').multiply(100).floor().multiply(13)).mod(9).eq(0);
    var hold = blk.and(coreClear);
    var fit = blendResidual(rawResidual.updateMask(hold.not()));
    var holdErr = rawResidual.subtract(fit.blended.add(tex)).updateMask(hold).rename('hold_err');
    var hd = holdErr.reduceRegion({
      reducer: ee.Reducer.mean().combine(ee.Reducer.count(), '', true),
      geometry: geom, scale: 120, maxPixels: 1e9, bestEffort: true, tileScale: 4
    });
    var hMean = ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(hd.get('hold_err_mean'), null), 0, hd.get('hold_err_mean')));
    var hCount = ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(hd.get('hold_err_count'), null), 0, hd.get('hold_err_count')));
    biasCorr = ee.Number(ee.Algorithms.If(hCount.gte(ST_DCA_CALIB_MIN_PX),
      hMean.max(-ST_DCA_CALIB_MAX_C).min(ST_DCA_CALIB_MAX_C), 0));
  }

  var hasLocalOrBroad = localSup.gt(1e-3).or(broadSup.gt(1e-3));
  var eraCInAoi = eraC.clip(geom);

  var reconstructed = eraCInAoi.add(blendedResidual).add(tex).add(ee.Image.constant(biasCorr))
    .rename('ST_DCA_estimated').clip(geom);

  var filled = landsatLST.unmask(reconstructed, false).rename('ST_filled').clip(geom);
  var landMask = landsatLST.mask().unmask(zeroInAoi, false).clip(geom).gt(0);
  var eraMask = eraCInAoi.mask().unmask(zeroInAoi, false).clip(geom).gt(0);
  var missingMask = landMask.not();
  var localFillMask = missingMask.and(hasLocalOrBroad).and(eraMask)
    .unmask(0).toByte().rename('ST_DCA_local_fill');
  var eraFallbackMask = missingMask.and(hasLocalOrBroad.not()).and(eraMask)
    .unmask(0).toByte().rename('ST_DCA_era5_fallback');

  return {
    original: landsatLST.rename('ST_original'),
    era5: eraC,
    offset: blendedResidual,
    estimated: reconstructed,
    filled: filled,
    alpha: alpha,
    beta: ee.Dictionary({ndvi: bNdvi, mndwi: bMndwi, elev: bElev}),
    sceneMeanBias: sceneMeanBiasNum,
    biasCorr: biasCorr,
    eraMean: eraMean,
    coreFrac: coreFrac,
    localFillMask: localFillMask,
    eraFallbackMask: eraFallbackMask,
    netSolar: era.netSolar,
    totalEvap: era.totalEvap,
    eraCount: era.count,
    timeOffsetMin: era.timeOffsetMin
  };
}

function fillThermalGapsCollection(year, start, end, geom, maxCloud, radiusM, iterations, useSharpen) {
  // Scenes with too few clear pixels cannot give a usable residual: skip them instead of filling with raw ERA5
  // If no scene passes the cloud slider, retry without it: the 10% AOI valid-pixel guard below is the real quality filter
  var primaryCol = landsatCol(start, end, geom, maxCloud);
  var scenesRaw = ee.ImageCollection(ee.Algorithms.If(primaryCol.size().gt(0), primaryCol, landsatCol(start, end, geom, 100)));
  var scenes = scenesRaw.select('ST').map(function(im) {
    var d = im.select('ST').mask().unmask(0).rename('v').reduceRegion({
      reducer: ee.Reducer.mean(), geometry: geom, scale: 120, maxPixels: 1e9, bestEffort: true, tileScale: 4
    }).get('v');
    return im.set('valid_frac', ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(d, null), 0, d)));
  }).filter(ee.Filter.gte('valid_frac', ST_DCA_VALID_MIN_FRAC));
  var cov = useSharpen ? buildSpectralCovariates(year, start, end, ctxGeom(geom), radiusM) : null;
  var processedRaw = scenes.map(function(scene) {
    var acquisitionDate = ee.Date(scene.get('system:time_start'));
    var dca = fillThermalGaps(scene.select('ST'), acquisitionDate, geom, radiusM, iterations, cov);
    return dca.filled.rename('ST_filled')
      .addBands(dca.original)
      .addBands(dca.era5.rename('ERA5_skin_C'))
      .addBands(dca.offset.rename('ST_DCA_offset'))
      .addBands(dca.netSolar)
      .addBands(dca.totalEvap)
      .addBands(dca.localFillMask)
      .addBands(dca.eraFallbackMask)
      .set('era5_time_offset_min', dca.timeOffsetMin)
      .set('era_mean_c', dca.eraMean)
      .copyProperties(scene, ['system:time_start', 'CLOUD_COVER', 'LANDSAT_PRODUCT_ID']);
  });

  // ---- Strike 2: Cross-Scene Radiometric Harmonization ----
  // Each scene is shifted by (month mean ERA5 skin temp - its own ERA5 skin temp over the AOI), so scenes from
  // different dates sit at the same overall level and no vertical seam appears at scene footprint edges.
  // ERA5 covers the whole AOI, so the shift is not biased by which part of the AOI a scene happens to cover.
  var eraOk = processedRaw.filter(ee.Filter.gt('era_mean_c', -100));
  var monthEra = ee.Number(ee.Algorithms.If(eraOk.size().gt(0), eraOk.aggregate_mean('era_mean_c'), -999));
  var processed = processedRaw.map(function(im) {
    var em = ee.Number(im.get('era_mean_c'));
    var shift = ee.Number(ee.Algorithms.If(
      em.gt(-100).and(monthEra.gt(-100)), monthEra.subtract(em), 0
    )).max(-ST_DCA_HARMONIZE_MAX_C).min(ST_DCA_HARMONIZE_MAX_C);
    if (!ST_DCA_HARMONIZE) { shift = ee.Number(0); }
    var harmonized = im.select('ST_filled').add(shift).rename('ST_filled');
    return im.addBands(harmonized, null, true).set('harmonize_shift_c', shift);
  });

  var fallbackProjection = ee.Projection('EPSG:4326').atScale(30);
  var empty = ee.Image.constant([0, 0, 0, 0, 0, 0, 0, 0]).rename([
    'ST_filled', 'ST_original', 'ERA5_skin_C', 'ST_DCA_offset',
    'ERA5_net_solar_Wm2', 'ERA5_total_evap_mm_h',
    'ST_DCA_local_fill', 'ST_DCA_era5_fallback'
  ]).updateMask(ee.Image.constant(0)).setDefaultProjection(fallbackProjection);
  var composite = ee.Image(ee.Algorithms.If(processed.size().gt(0), processed.median(), empty));
  var matched = processed.filter(ee.Filter.gte('era5_time_offset_min', 0));
  var localFillCount = ee.Image(ee.Algorithms.If(processed.size().gt(0),
    processed.select('ST_DCA_local_fill').sum(),
    ee.Image.constant(0).rename('ST_DCA_local_fill').setDefaultProjection(fallbackProjection)));
  var eraFallbackCount = ee.Image(ee.Algorithms.If(processed.size().gt(0),
    processed.select('ST_DCA_era5_fallback').sum(),
    ee.Image.constant(0).rename('ST_DCA_era5_fallback').setDefaultProjection(fallbackProjection)));
  return {
    filled: composite.select('ST_filled').rename('ST').clip(geom),
    original: composite.select('ST_original').clip(geom),
    era5: composite.select('ERA5_skin_C').clip(geom),
    offset: composite.select('ST_DCA_offset').clip(geom),
    netSolar: composite.select('ERA5_net_solar_Wm2').clip(geom),
    totalEvap: composite.select('ERA5_total_evap_mm_h').clip(geom),
    localFillCount: localFillCount,
    eraFallbackCount: eraFallbackCount,
    landsatSceneCount: scenes.size(),
    eraMatchedSceneCount: matched.size(),
    meanTimeOffsetMin: matched.aggregate_mean('era5_time_offset_min'),
    maxTimeOffsetMin: matched.aggregate_max('era5_time_offset_min'),
    timeOffsets: processed.aggregate_array('era5_time_offset_min')
  };
}

function pseudoValidationMetrics(prediction, truth, geom, scale) {
  var commonMask = prediction.mask().rename('paired_mask').and(truth.mask().rename('paired_mask'));
  var pairedTruth = truth.updateMask(commonMask);
  var pairedPrediction = prediction.updateMask(commonMask);
  var err = pairedPrediction.subtract(pairedTruth).rename('err');
  var statsImage = ee.Image.cat([
    err.abs().rename('abs_err'), err.pow(2).rename('sq_err'), err.rename('err'),
    pairedTruth.rename('truth'), pairedTruth.pow(2).rename('truth_sq'),
    ee.Image.constant(1).rename('n').updateMask(commonMask)
  ]);
  var sums = ee.Dictionary(statsImage.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: geom, scale: scale,
    maxPixels: 3e6, bestEffort: true, tileScale: 4
  }));
  function safeSum(key) {
    var value = sums.get(key, 0);
    return ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(value, null), 0, value));
  }
  var n = safeSum('n');
  var sse = safeSum('sq_err');
  var sst = ee.Number(ee.Algorithms.If(n.gt(0),
    safeSum('truth_sq').subtract(safeSum('truth').pow(2).divide(n)), 0));
  var valid = n.gt(0);
  return ee.Dictionary({
    n: n,
    mae_c: ee.Algorithms.If(valid, safeSum('abs_err').divide(n), null),
    rmse_c: ee.Algorithms.If(valid, sse.divide(n).sqrt(), null),
    bias_c: ee.Algorithms.If(valid, safeSum('err').divide(n), null),
    r2: ee.Algorithms.If(sst.gt(0), ee.Number(1).subtract(sse.divide(sst)), null)
  });
}

function runStDcaPseudoValidation() {
  stDcaValidationBox.clear();
  stDcaValidationStatus.setValue('Searching for the clearest Landsat scene in the selected AOI and month...');
  var a = getArea();
  if (!a) { stDcaValidationStatus.setValue('Select an area or draw a custom AOI first.'); return; }
  var year = parseInt(yearSelect.getValue(), 10);
  var month = parseInt(monthSelect.getValue(), 10);
  var start = ee.Date.fromYMD(year, month, 1);
  var end = start.advance(1, 'month');
  // Scene-level CLOUD_COVER covers the whole 185 km scene, not your AOI. The best scene is picked below by AOI-specific valid pixels, so no slider prefilter here.
  var candidates = landsatCol(start, end, a.geom, 100);
  candidates.size().evaluate(function(count, err) {
    if (err || !count) {
      stDcaValidationStatus.setValue('No quality-screened Landsat scene is available for this AOI and month. ' + (err || ''));
      return;
    }
    var scoredCandidates = candidates.map(function(im) {
      var validFraction = im.select('ST').mask().unmask(0).rename('valid')
        .reduceRegion({reducer: ee.Reducer.mean(), geometry: a.geom, scale: 30,
          maxPixels: 3e6, bestEffort: true, tileScale: 4}).get('valid');
      return im.set('valid_lST_fraction', validFraction);
    }).sort('valid_lST_fraction', false);
    var scene = ee.Image(scoredCandidates.first());
    var truthFull = scene.select('ST').rename('LST_truth');
    var targetProjection = truthFull.projection();
    var validFractionImage = truthFull.mask().unmask(0, false).rename('valid')
      .reduceRegion({reducer: ee.Reducer.mean(), geometry: a.geom, scale: 30,
        maxPixels: 3e6, bestEffort: true, tileScale: 4});
    validFractionImage.evaluate(function(v, e2) {
      if (!v || e2 || v.valid === null || v.valid < ST_DCA_VALID_MIN_FRAC) {
        var pct = v && v.valid !== null ? (100 * v.valid).toFixed(1) : 'unknown';
        stDcaValidationStatus.setValue('The best scene has only ' + pct + '% valid Landsat LST coverage in this AOI (needs at least 10%).');
        return;
      }
      stDcaValidationStatus.setValue('Creating distributed 20% artificial cloud patches and testing ST-DCA reconstruction...');
      var gapChoice = stDcaGapSelect.getValue();
      var gapCfg = {'Small (~300 m)': {s: 180, r: 240, blocks: false}, 'Medium (~1 km blocks)': {s: 1000, r: 0, blocks: true},
        'Large (~3 km blocks)': {s: 3000, r: 0, blocks: true}}[gapChoice] || {s: 180, r: 240, blocks: false};
      var pseudoField, percentile;
      if (gapCfg.blocks) {
        // Medium and large gaps: random square blocks on a coarse grid; a uniform random value >= 0.8 hides 20% of the blocks
        pseudoField = ee.Image.random(1862).reproject({crs: targetProjection.atScale(gapCfg.s)}).rename('pseudo_cloud_field');
        percentile = ee.Number(0.8);
      } else {
        pseudoField = ee.Image.random(1862).reproject({crs: targetProjection, scale: gapCfg.s})
          .focalMean(gapCfg.r, 'circle', 'meters', 1).rename('pseudo_cloud_field');
        var pctDict = pseudoField.reduceRegion({
          reducer: ee.Reducer.percentile([80]), geometry: a.geom, scale: gapCfg.s,
          maxPixels: 1e9, bestEffort: true, tileScale: 4
        });
        percentile = ee.Number(ee.Algorithms.If(pctDict.values().size().gt(0), pctDict.values().get(0), 0.5));
      }
      var validMask = truthFull.mask().unmask(0, false).gt(0);
      var pseudoCloud = pseudoField.gte(percentile).and(validMask).unmask(0, false).rename('pseudo_cloud');
      var maskedScene = truthFull.updateMask(pseudoCloud.not()).rename('ST');
      var acquisitionDate = ee.Date(scene.get('system:time_start'));
      var radiusM = Number(stDcaRadiusSlider.getValue());
      var tex = stDcaSharpenCheck.getValue() ? buildSpectralCovariates(year, start, end, ctxGeom(a.geom), radiusM) : null;
      var dca = fillThermalGaps(maskedScene, acquisitionDate, a.geom,
        radiusM, parseInt(stDcaIterationsSelect.getValue(), 10), tex);
      var hiddenTruth = truthFull.updateMask(pseudoCloud).rename('truth');
      var stDcaPrediction = dca.filled.updateMask(pseudoCloud).rename('prediction');
      var era5Prediction = dca.era5.updateMask(pseudoCloud).rename('prediction');
      // ---- Simple baselines evaluated on the same withheld pixels ----
      // Baseline A: ERA5 plus one scene-mean offset (mean Landsat minus ERA5 over the visible pixels)
      var offDict = maskedScene.subtract(dca.era5).rename('off').reduceRegion({
        reducer: ee.Reducer.mean(), geometry: a.geom, scale: 30, maxPixels: 3e6, bestEffort: true, tileScale: 4
      });
      var sceneOffset = ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(offDict.get('off'), null), 0, offDict.get('off')));
      var offsetPrediction = dca.era5.add(ee.Image.constant(sceneOffset)).updateMask(pseudoCloud).rename('prediction');
      // Baseline B: spatial interpolation of the visible Landsat LST (Gaussian-weighted normalised convolution,
      // 1.5 km radius, 500 m sigma); the scene mean is used where no visible pixel is within reach
      var p90 = targetProjection.atScale(90);
      var visMaskF = maskedScene.mask().unmask(0).toFloat().reproject({crs: p90});
      var visValF = maskedScene.unmask(0).toFloat().reproject({crs: p90});
      var gSigma = Math.max(500, 0.6 * gapCfg.s), gRadius = Math.max(1500, 3 * gSigma);
      var gKernel = ee.Kernel.gaussian({radius: gRadius, sigma: gSigma, units: 'meters', normalize: false});
      var iNum = visValF.convolve(gKernel).reproject({crs: p90}).resample('bilinear');
      var iDen = visMaskF.convolve(gKernel).reproject({crs: p90}).resample('bilinear');
      var lstMeanDict = maskedScene.rename('ST').reduceRegion({
        reducer: ee.Reducer.mean(), geometry: a.geom, scale: 30, maxPixels: 3e6, bestEffort: true, tileScale: 4
      });
      var sceneMeanLst = ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(lstMeanDict.get('ST'), null), 0, lstMeanDict.get('ST')));
      var interpPrediction = iNum.divide(iDen.max(1e-9))
        .where(iDen.lt(0.02), ee.Image.constant(sceneMeanLst))
        .updateMask(pseudoCloud).rename('prediction');
      var scale = gapCfg.s > 200 ? 60 : 30;   // medium and large gaps are sampled at 60 m to stay within the compute limit
      var dcaMetrics = pseudoValidationMetrics(stDcaPrediction, hiddenTruth, a.geom, scale);
      var eraMetrics = pseudoValidationMetrics(era5Prediction, hiddenTruth, a.geom, scale);
      var offsetMetrics = pseudoValidationMetrics(offsetPrediction, hiddenTruth, a.geom, scale);
      var interpMetrics = pseudoValidationMetrics(interpPrediction, hiddenTruth, a.geom, scale);
      var cloudFraction = pseudoCloud.unmask(0).reduceRegion({reducer: ee.Reducer.mean(),
        geometry: a.geom, scale: 180, maxPixels: 1e9, bestEffort: true, tileScale: 4}).get('pseudo_cloud');
      var report = ee.Dictionary({
        app_version: APP_NAME + ' ' + VERSION,
        study_area: a.tag,
        year: year,
        month: month,
        landsat_product_id: scene.get('LANDSAT_PRODUCT_ID'),
        acquisition_utc: acquisitionDate.format("YYYY-MM-dd'T'HH:mm:ss", 'UTC'),
        scene_cloud_cover_pct: scene.get('CLOUD_COVER'),
        valid_landsat_fraction: v.valid,
        pseudo_cloud_fraction: cloudFraction,
        era5_nearest_time_offset_min: dca.timeOffsetMin,
        alpha_weight: dca.alpha,
        beta: dca.beta,
        bias_correction_c: dca.biasCorr,
        core_fraction: dca.coreFrac,
        scene_mean_bias_c: dca.sceneMeanBias,
        st_dca: dcaMetrics,
        era5_raw: eraMetrics,
        gap_label: gapChoice
      });
      // Baselines are evaluated in a second request so that one request does not hit the compute time limit
      var baseReport = ee.Dictionary({base_offset: offsetMetrics, base_interp: interpMetrics, base_offset_value_c: sceneOffset});
      report.evaluate(function(r, e3) {
        stDcaValidationBox.clear();
        if (!r || e3) {
          stDcaValidationStatus.setValue('Pseudo-cloud validation failed: ' + (e3 || 'Check AOI size.'));
          return;
        }
        stDcaValidationStatus.setValue('Validation complete! See how ST-DCA compares against raw ERA5-Land below:');
        var t = card('Artificial-Gap Validation Results');
        t.add(wl('Landsat scene: ' + (r.landsat_product_id || 'ID unavailable')));
        t.add(wl('Acquisition (UTC): ' + r.acquisition_utc + ' (ERA5 diff: ' + Number(r.era5_nearest_time_offset_min).toFixed(1) + ' min)'));
        t.add(wl('Clear-sky: ' + (100 * r.valid_landsat_fraction).toFixed(1) + '%  ·  Test gap: ' + (100 * Number(r.pseudo_cloud_fraction || 0)).toFixed(1) + '%  ·  Alpha: ' + Number(r.alpha_weight || 0.45).toFixed(2)));
        if (r.beta) { t.add(wl('Covariate weights: NDVI ' + Number(r.beta.ndvi).toFixed(2) + '  ·  MNDWI ' + Number(r.beta.mndwi).toFixed(2) + '  ·  Elev ' + Number(r.beta.elev).toFixed(4) + ' per m  ·  Self-calibration: ' + Number(r.bias_correction_c || 0).toFixed(2) + ' °C  ·  Gap size: ' + (r.gap_label || 'Small (~300 m)') + '  ·  Edge-safe clear: ' + (100 * Number(r.core_fraction || 0)).toFixed(1) + '%', {fontSize: '11px', color: C.muted})); }
        t.add(lbl('1. Your ST-DCA Reconstruction', {fontWeight: 'bold', color: C.accent, margin: '8px 0 2px 0'}));
        ['mae_c', 'rmse_c', 'bias_c', 'r2', 'n'].forEach(function(k) {
          t.add(wl(k.toUpperCase() + ': ' + (r.st_dca[k] === null ? 'not available' :
            (k === 'n' ? Math.round(r.st_dca[k]) + ' px' : Number(r.st_dca[k]).toFixed(3) + (k === 'r2' ? '' : ' °C'))), {fontWeight: k === 'rmse_c' || k === 'r2' ? 'bold' : 'normal'}));
        });
        t.add(lbl('2. Unadjusted ERA5-Land Baseline', {fontWeight: 'bold', color: C.muted, margin: '8px 0 2px 0'}));
        ['mae_c', 'rmse_c', 'bias_c', 'r2', 'n'].forEach(function(k) {
          t.add(wl(k.toUpperCase() + ': ' + (r.era5_raw[k] === null ? 'not available' :
            (k === 'n' ? Math.round(r.era5_raw[k]) + ' px' : Number(r.era5_raw[k]).toFixed(3) + (k === 'r2' ? '' : ' °C')))));
        });
        if (!r.st_dca.n) {
          t.add(wl('No withheld pixels were created for this gap size (the AOI is too small, or the random blocks missed the clear area). Try a smaller gap size or a larger AOI.', {color: C.muted}));
        }
        stDcaValidationBox.add(t);

        map.addLayer(pseudoCloud.selfMask(), {palette: ['ff00ff']}, 'Validation: Artificial cloud mask', false);
        map.addLayer(hiddenTruth, VIS.LST, 'Validation: Hidden clear-sky Landsat truth', false);
        map.addLayer(stDcaPrediction, VIS.LST, 'Validation: ST-DCA predictions', false);
        map.addLayer(stDcaPrediction.subtract(hiddenTruth).rename('ST_DCA_error'),
          {min: -5, max: 5, palette: ['313695','74add1','ffffbf','f46d43','a50026']},
          'Validation: ST-DCA error (°C)', false);
        stDcaValidationStatus.setValue('Main metrics ready. Computing the simple baselines A and B...');
        baseReport.evaluate(function(rb, eb) {
          var baseOk = !!rb && !eb;
          var bo = (baseOk && rb.base_offset) ? rb.base_offset : {};
          var bi = (baseOk && rb.base_interp) ? rb.base_interp : {};
          var offVal = baseOk ? rb.base_offset_value_c : null;
          if (baseOk) {
            [['3. Baseline A: ERA5 + scene-mean offset (' + (offVal === null ? 'n/a' : Number(offVal).toFixed(2) + ' °C') + ')', bo],
             ['4. Baseline B: spatial interpolation of visible Landsat LST', bi]].forEach(function(b) {
              t.add(lbl(b[0], {fontWeight: 'bold', color: C.muted, margin: '8px 0 2px 0'}));
              ['mae_c', 'rmse_c', 'bias_c', 'r2', 'n'].forEach(function(k) {
                t.add(wl(k.toUpperCase() + ': ' + (!b[1] || b[1][k] === undefined || b[1][k] === null ? 'not available' :
                  (k === 'n' ? Math.round(b[1][k]) + ' px' : Number(b[1][k]).toFixed(3) + (k === 'r2' ? '' : ' °C')))));
              });
            });
          } else {
            t.add(wl('Baselines A and B could not be computed: ' + (eb || 'try a smaller AOI or a smaller gap size.'), {color: C.muted}));
          }
          stDcaValidationStatus.setValue('Validation complete! See how ST-DCA compares against raw ERA5-Land and the simple baselines below:');
        csvLink(stDcaValidationBox, ee.FeatureCollection([ee.Feature(null, {
          app_version: r.app_version, study_area: r.study_area, year: r.year, month: r.month,
          landsat_product_id: r.landsat_product_id, acquisition_utc: r.acquisition_utc,
          valid_landsat_fraction: r.valid_landsat_fraction, pseudo_cloud_fraction: r.pseudo_cloud_fraction,
          era5_nearest_time_offset_min: r.era5_nearest_time_offset_min,
          alpha_texture_weight: r.alpha_weight,
          beta_ndvi: r.beta ? r.beta.ndvi : null, beta_mndwi: r.beta ? r.beta.mndwi : null, beta_elev: r.beta ? r.beta.elev : null,
          edge_safe_clear_fraction: r.core_fraction,
          scene_mean_bias_c: r.scene_mean_bias_c,
          st_dca_n: r.st_dca.n, st_dca_mae_c: r.st_dca.mae_c, st_dca_rmse_c: r.st_dca.rmse_c,
          st_dca_bias_c: r.st_dca.bias_c, st_dca_r2: r.st_dca.r2,
          era5_raw_n: r.era5_raw.n, era5_raw_mae_c: r.era5_raw.mae_c, era5_raw_rmse_c: r.era5_raw.rmse_c,
          era5_raw_bias_c: r.era5_raw.bias_c, era5_raw_r2: r.era5_raw.r2,
          gap_size: r.gap_label,
          base_offset_value_c: offVal,
          base_offset_mae_c: (bo.mae_c === undefined ? null : bo.mae_c), base_offset_rmse_c: (bo.rmse_c === undefined ? null : bo.rmse_c),
          base_offset_bias_c: (bo.bias_c === undefined ? null : bo.bias_c), base_offset_r2: (bo.r2 === undefined ? null : bo.r2),
          base_interp_mae_c: (bi.mae_c === undefined ? null : bi.mae_c), base_interp_rmse_c: (bi.rmse_c === undefined ? null : bi.rmse_c),
          base_interp_bias_c: (bi.bias_c === undefined ? null : bi.bias_c), base_interp_r2: (bi.r2 === undefined ? null : bi.r2)
        })]), 'TerraLens_ST_DCA_validation', 'Download validation metrics CSV');
        });
      });
    });
  });
}
stDcaValidationBtn.onClick(runStDcaPseudoValidation);

// ---- MODIS -> Landsat calibration ----
var NZ_DEFAULTS = ee.Dictionary({n: 0, x: 0, y: 0, xx: 0, yy: 0, xy: 0, r: 0, ra: 0, rr: 0, wa: 0, ww: 0});
function nz(d, k) {
  var v = NZ_DEFAULTS.combine(ee.Dictionary(d), true).get(k);
  return ee.Number(ee.Algorithms.If(ee.Algorithms.IsEqual(v, null), 0, v));
}
function fitFrom(s) {
  var n = nz(s, 'n'), Sx = nz(s, 'x'), Sy = nz(s, 'y'), Sxx = nz(s, 'xx'), Syy = nz(s, 'yy'), Sxy = nz(s, 'xy');
  var den = n.multiply(Sxx).subtract(Sx.multiply(Sx));
  var varY = n.multiply(Syy).subtract(Sy.multiply(Sy));
  var cov = n.multiply(Sxy).subtract(Sx.multiply(Sy));
  var okDen = den.gt(1e-6);
  var slope = ee.Number(ee.Algorithms.If(okDen, cov.divide(den), 1));
  var offset = ee.Number(ee.Algorithms.If(n.gt(0), Sy.subtract(slope.multiply(Sx)).divide(n), 0));
  var r2 = ee.Number(ee.Algorithms.If(okDen.and(varY.gt(1e-6)), cov.multiply(cov).divide(den.multiply(varY)), 0));
  var bias = ee.Number(ee.Algorithms.If(n.gt(0), Sy.subtract(Sx).divide(n), 0));
  return {n: n, Sx: Sx, Sy: Sy, Sxx: Sxx, Syy: Syy, Sxy: Sxy, slope: slope, offset: offset, r2: r2, bias: bias};
}
function rmseOf(f, a, b) {
  var sse = f.Syy.subtract(f.Sxy.multiply(a).multiply(2)).subtract(f.Sy.multiply(b).multiply(2))
    .add(a.multiply(a).multiply(f.Sxx)).add(a.multiply(b).multiply(f.Sx).multiply(2)).add(f.n.multiply(b).multiply(b));
  return ee.Number(ee.Algorithms.If(f.n.gt(0), sse.divide(f.n).max(0).sqrt(), 0));
}
function pickCorr(f, corrOn) {
  var useLinear = f.n.gte(MIN_N).and(f.r2.gte(MIN_R2)).and(f.slope.gte(0.4)).and(f.slope.lte(1.8));
  var useBias = f.n.gte(5);
  var mode = corrOn ? ee.Number(ee.Algorithms.If(useLinear, 2, ee.Algorithms.If(useBias, 1, 0))) : ee.Number(0);
  var a = ee.Number(ee.Algorithms.If(mode.eq(2), f.slope, 1));
  var b = ee.Number(ee.Algorithms.If(mode.eq(2), f.offset, ee.Algorithms.If(mode.eq(1), f.bias, 0)));
  return {mode: mode, a: a, b: b};
}
function calibrate(year, month, geom, sat, maxCloud, corrOn) {
  var start = ee.Date.fromYMD(year, month, 1), end = start.advance(1, 'month');
  var proj = ee.Projection('EPSG:4326').atScale(30);
  var grid = {crs: 'EPSG:3857', scale: 1000};
  var lcol = landsatCol(start, end, geom, maxCloud).select('ST')
    .map(function(img) { return img.set('dkey', img.date().format('YYYY-MM-dd')); });
  var dkeys = lcol.aggregate_array('dkey').distinct();
  var testCell = ee.Image.random(11).reproject(grid).lt(0.3);

  var pairs = ee.ImageCollection(dkeys.map(function(dk) {
    var d = ee.Date(dk);
    var lday = lcol.filter(ee.Filter.eq('dkey', dk)).median().rename('y');
    var cover = lday.mask().toFloat().setDefaultProjection(proj)
      .reduceResolution({reducer: ee.Reducer.mean(), maxPixels: 2048}).reproject(grid);
    var l = lday.setDefaultProjection(proj)
      .reduceResolution({reducer: ee.Reducer.mean(), maxPixels: 2048}).reproject(grid)
      .updateMask(cover.gte(0.5));
    var m = modisMean(d, d.advance(1, 'day'), geom, sat).rename('x').reproject(grid);
    var both = m.mask().and(l.mask());
    return ee.Image.cat([m, l]).updateMask(both).toFloat();
  }));

  function statImg(im) {
    var x = im.select('x'), y = im.select('y');
    return ee.Image.cat([x, y, x.multiply(x), y.multiply(y), x.multiply(y), ee.Image.constant(1).updateMask(x.mask())])
      .rename(['x', 'y', 'xx', 'yy', 'xy', 'n']);
  }
  function sumsOf(col) {
    return ee.Dictionary(col.sum().reduceRegion({reducer: ee.Reducer.sum(), geometry: geom, crs: 'EPSG:3857', scale: 1000,
      maxPixels: 1e9, tileScale: 4}));
  }
  var fAll = fitFrom(sumsOf(pairs.map(statImg)));
  var cAll = pickCorr(fAll, corrOn);

  var fTr = fitFrom(sumsOf(pairs.map(function(im) { return statImg(im.updateMask(testCell.not())); })));
  var cTr = pickCorr(fTr, corrOn);
  var vs = sumsOf(pairs.map(function(im) {
    var t = im.updateMask(testCell);
    var x = t.select('x'), y = t.select('y');
    var r = y.subtract(x.multiply(cTr.a).add(cTr.b));
    var w = y.subtract(x);
    return ee.Image.cat([r, r.abs(), r.multiply(r), w.abs(), w.multiply(w), ee.Image.constant(1).updateMask(x.mask())])
      .rename(['r', 'ra', 'rr', 'wa', 'ww', 'n']);
  }));
  var nv = nz(vs, 'n');
  function per(k) { return ee.Number(ee.Algorithms.If(nv.gt(0), nz(vs, k).divide(nv), 0)); }

  return {a: cAll.a, b: cAll.b, report: ee.Dictionary({
    n: fAll.n, n_dates: dkeys.size(), r2: fAll.r2, rmse_raw: rmseOf(fAll, ee.Number(1), ee.Number(0)),
    rmse_applied: rmseOf(fAll, cAll.a, cAll.b), bias: fAll.bias, slope: fAll.slope, offset: fAll.offset,
    mode: cAll.mode, a: cAll.a, b: cAll.b,
    val_n: nv, val_mae_raw: per('wa'), val_mae_corr: per('ra'),
    val_rmse_raw: per('ww').sqrt(), val_rmse_corr: per('rr').sqrt(), val_bias_corr: per('r')})};
}

function buildStack(year, month, day, geom, hybrid, isS2, cfg) {
  var daily = (day !== null);
  var start = ee.Date.fromYMD(year, month, daily ? day : 1);
  var end = start.advance(1, daily ? 'day' : 'month');
  if (isS2) {
    var s2 = addIndices(sentinelComposite(start, end, geom, cfg.maxCloud), false).clip(geom);
    return {stack: s2, flag: ee.Image.constant(255).toByte().where(s2.select('NDVI').mask(), 0).clip(geom).rename('flag')};
  }
  var stack = addIndices(landsatComposite(start, end, geom, cfg.maxCloud), true).clip(geom);
  var land = stack.select('LST');
  var baseFlag = ee.Image.constant(255).toByte().where(land.mask(), 0).rename('flag');
  if (!hybrid) return {stack: stack, flag: baseFlag.clip(geom)};

  if (cfg.fillMethod === 'ST-DCA') {
    var dca = fillThermalGapsCollection(year, start, end, geom, cfg.maxCloud,
      cfg.stDcaRadiusM, cfg.stDcaIterations, cfg.stDcaSharpen);
    var projectionCol = landsatCol(start, end, geom, cfg.maxCloud).select('ST');
    var fallbackProjection = ee.Projection('EPSG:4326').atScale(30);
    var outputProjection = ee.Algorithms.If(projectionCol.size().gt(0),
      ee.Image(projectionCol.first()).projection(), fallbackProjection);
    var dcaFilled = dca.filled.rename('LST').setDefaultProjection(outputProjection);
    var dcaOriginal = dca.original.setDefaultProjection(outputProjection);
    var dcaEra5 = dca.era5.setDefaultProjection(outputProjection);
    var dcaOffset = dca.offset.setDefaultProjection(outputProjection);
    var dcaNetSolar = dca.netSolar.setDefaultProjection(outputProjection);
    var dcaTotalEvap = dca.totalEvap.setDefaultProjection(outputProjection);
    var localFillCount = dca.localFillCount.setDefaultProjection(outputProjection);
    var eraFallbackCount = dca.eraFallbackCount.setDefaultProjection(outputProjection);
    var landValid = land.setDefaultProjection(outputProjection).mask().unmask(0);
    var hasLocalFill = localFillCount.gt(eraFallbackCount).and(localFillCount.gt(0));
    var hasEraFallback = eraFallbackCount.gte(localFillCount).and(eraFallbackCount.gt(0));
    var flagDca = ee.Image.constant(255).toByte().clip(geom)
      .where(landValid.gt(0), 0)
      .where(landValid.eq(0).and(hasLocalFill), 1)
      .where(landValid.eq(0).and(hasEraFallback), 2)
      .rename('flag');
    var stDcaStack = stack.addBands(dcaFilled.clip(geom), null, true);
    return {
      stack: stDcaStack,
      flag: flagDca,
      original: dcaOriginal.clip(geom),
      era5: dcaEra5.clip(geom),
      offset: dcaOffset.clip(geom),
      netSolar: dcaNetSolar.clip(geom),
      totalEvap: dcaTotalEvap.clip(geom),
      landsatSceneCount: dca.landsatSceneCount,
      eraMatchedSceneCount: dca.eraMatchedSceneCount,
      meanTimeOffsetMin: dca.meanTimeOffsetMin,
      maxTimeOffsetMin: dca.maxTimeOffsetMin,
      timeOffsets: dca.timeOffsets
    };
  }

  if (!cfg.modisOK) return {stack: stack, flag: baseFlag.clip(geom)};
  var filled = land;
  var flag = baseFlag;
  if (daily) {
    for (var k = 0; k <= cfg.win; k++) {
      var m = modisWindow(start, k, geom, cfg.sat).multiply(cfg.a).add(cfg.b).resample('bilinear');
      flag = flag.where(filled.mask().not().and(m.mask()), k + 1);
      filled = filled.unmask(m);
    }
  } else {
    var mm = modisMean(start, end, geom, cfg.sat).multiply(cfg.a).add(cfg.b).resample('bilinear');
    flag = flag.where(filled.mask().not().and(mm.mask()), 1);
    filled = filled.unmask(mm);
  }
  filled = filled.clip(geom).rename('LST');
  return {stack: stack.addBands(filled, null, true), flag: flag.clip(geom)};
}

function addLink(target, text, url) { target.add(ui.Label(text, {color: C.link, textDecoration: 'underline', backgroundColor: C.bg, margin: '3px 2px'}, url)); }
function addErr(target, text) { target.add(ui.Label(text, {color: C.danger, fontSize: '12px', backgroundColor: C.bg})); }
function computeScale(areaM2, bandsPerFile, bytesPerPixel, minScale) {
  var pixels = 32e6 / bytesPerPixel / bandsPerFile;
  return Math.max(minScale, Math.ceil(Math.sqrt(areaM2 / pixels) / 10) * 10);
}
function makeTif(target, geom, img, fileName, scale, attempt, text) {
  img.getDownloadURL({name: fileName, region: geom, scale: scale, format: 'GEO_TIFF', crs: 'EPSG:4326'},
    function(url, err) {
      if (url) addLink(target, 'Download: ' + text + ' (' + scale + ' m)', url);
      else if (attempt < 8 && /size|must be less|too large|exceed/i.test(String(err))) {
        makeTif(target, geom, img, fileName, Math.ceil(scale * 1.4 / 10) * 10, attempt + 1, text);
      } else addErr(target, 'GeoTIFF failed: ' + err);
    });
}
function boundaryLink(target, fc, label) {
  fc.getDownloadURL('SHP', null, label + '_boundary', function(url, err) {
    if (url) addLink(target, 'Download: Boundary shapefile', url); else addErr(target, 'Shapefile failed: ' + err);
  });
}
function csvLink(target, fcol, fileName, text) {
  fcol.getDownloadURL('CSV', null, fileName, function(url, err) {
    if (url) addLink(target, 'Download: ' + text, url); else addErr(target, 'CSV failed: ' + err);
  });
}

function pct(x, tot) { return tot > 0 ? (x / tot * 100) : 0; }
function modisSatKey() {
  var v = satSelect.getValue();
  return v.indexOf('Aqua') === 0 ? 'aqua' : (v.indexOf('Terra +') === 0 ? 'both' : 'terra');
}
function modisWin() {
  var v = winSelect.getValue();
  return v === 'Same day only' ? 0 : parseInt(v.charAt(1), 10);
}

function renderDq(list, entries, sName, hybridUsed, sourceNames, fillMethodLabel) {
  dqBox.clear(); fillBox.clear();
  sourceNames = sourceNames || FLAG_NAMES;
  fillMethodLabel = fillMethodLabel || 'MODIS gap filling';
  var worst = 100, any = false;
  list.forEach(function(h, i) {
    var cnt = {}, tot = 0;
    Object.keys(h || {}).forEach(function(k) { var v = Math.round(Number(k)); cnt[v] = (cnt[v] || 0) + h[k]; tot += h[k]; });
    if (tot <= 0) return;
    any = true;
    var tag = entries[i].day === null ? 'This month' : 'Day ' + pad(entries[i].day);
    var landP = pct(cnt[0] || 0, tot), noneP = pct(cnt[255] || 0, tot);
    worst = Math.min(worst, landP);
    dqBox.add(wl(tag + ': valid ' + sName + ' pixels in AOI: ' + fmt(landP, 1) + ' %' +
      (hybridUsed ? ' -> ' + fmt(100 - noneP, 1) + ' % after ' + fillMethodLabel : ''), {fontWeight: 'bold', margin: '3px 0'}));
    if (hybridUsed) {
      var parts = [];
      [0, 1, 2, 3, 4].forEach(function(c) { if (cnt[c]) parts.push((sourceNames[c] || FLAG_NAMES[c]) + ' ' + fmt(pct(cnt[c], tot), 1) + ' %'); });
      parts.push('no data ' + fmt(noneP, 1) + ' %');
      fillBox.add(wl(tag + ': ' + parts.join('  ·  '), {fontSize: '11px', margin: '3px 0'}));
    }
  });
  if (!any) {
    dqBox.add(wl('No valid pixels at all for this selection. Try another month, a higher cloud limit, or another area.', {color: C.danger, fontWeight: 'bold'}));
    return;
  }
  if (worst < CRIT_VALID) {
    dqBox.add(wl('Low clear-sky coverage (' + fmt(worst, 0) + '%): most of the map is reconstructed using ' +
      (hybridUsed ? fillMethodLabel : 'available data') + '.',
      {color: C.warn, fontWeight: 'bold', margin: '4px 0 0 0'}));
  }
}

function renderQuality(q, err, info) {
  qualBox.clear();
  var t = card('Quality report (MODIS vs Landsat)');
  if (!q) { t.add(wl('Quality report could not be computed. ' + (err || ''), {color: C.danger})); qualBox.add(t); return; }
  function row(k, v) {
    t.add(ui.Panel([ui.Label(k, {backgroundColor: C.card, width: '175px', fontSize: '12px', margin: '2px 0'}),
      ui.Label(v, {backgroundColor: C.card, fontSize: '12px', fontWeight: 'bold', margin: '2px 0'})],
      ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
  }
  var n = Math.round(q.n || 0), mode = Math.round(q.mode || 0);
  row('Landsat dates paired', String(Math.round(q.n_dates || 0)));
  row('n (same-date 1 km pairs)', String(n));
  if (n > 0) {
    row('R²', fmt(q.r2, 3));
    row('RMSE before to after', fmt(q.rmse_raw, 2) + ' to ' + fmt(q.rmse_applied, 2) + ' °C');
    row('Bias (Landsat − MODIS)', fmt(q.bias, 2) + ' °C');
    row('Slope (a)', fmt(q.slope, 3));
    row('Offset (b)', fmt(q.offset, 2) + ' °C');
  }
  var vn = Math.round(q.val_n || 0);
  t.add(lbl('Hold-out validation (30 % of 1 km cells)', {fontWeight: 'bold', margin: '8px 0 2px 0'}));
  row('Test pairs', String(vn));
  if (vn > 0) {
    row('MAE raw to corrected', fmt(q.val_mae_raw, 2) + ' to ' + fmt(q.val_mae_corr, 2) + ' °C');
    row('RMSE raw to corrected', fmt(q.val_rmse_raw, 2) + ' to ' + fmt(q.val_rmse_corr, 2) + ' °C');
    row('Bias after correction', fmt(q.val_bias_corr, 2) + ' °C');
  }
  var props = {app: APP_NAME + ' ' + VERSION, area: info.area, year: info.yr, month: info.mo, modis_satellite: info.sat};
  Object.keys(q).forEach(function(k) { props[k] = q[k]; });
  csvLink(t, ee.FeatureCollection([ee.Feature(null, props)]), info.label + '_quality_report', 'Quality report CSV');
  qualBox.add(t);
}

function runSpectral() {
  dlSpec.clear(); dqBox.clear(); fillBox.clear(); qualBox.clear();
  var a = getArea();
  if (!a) { statusSpec.setValue('Select a State / District or draw a custom study area first.'); return; }
  var yr = parseInt(yearSelect.getValue(), 10);
  var mo = parseInt(monthSelect.getValue(), 10);
  var hybrid = hybridCheck.getValue();
  var selected = INDEX_NAMES.filter(function(n) { return checks[n].getValue(); });
  var daily = (modeSelect.getValue() === 'Selected days');
  var isS2 = (sensorSelect.getValue().indexOf('Sentinel') === 0);
  var s2Note = '';
  if (isS2) {
    if (yr < 2017) { statusSpec.setValue('Sentinel-2 data starts in 2017. Pick a later year or use Landsat.'); return; }
    if (selected.indexOf('LST') >= 0) {
      selected = selected.filter(function(n) { return n !== 'LST'; });
      s2Note = ' LST skipped (Sentinel-2 has no thermal band).';
    }
  }
  if (selected.length === 0) {
    statusSpec.setValue(isS2 ? 'Sentinel-2 cannot give LST. Tick NDVI or another index.' : 'Tick at least one layer.');
    return;
  }

  var dayList = [];
  if (daily) {
    var maxDay = new Date(yr, mo, 0).getDate();
    dayList = parseDays(daysBox.getValue(), maxDay);
    if (dayList.length === 0) { statusSpec.setValue('Enter days like 3, 7, 15-20 (this month has ' + maxDay + ' days).'); return; }
    if (dayList.length > 15) { statusSpec.setValue('Please choose up to 15 days at a time.'); return; }
  }
  var entries = daily
    ? dayList.map(function(d) { return {day: d, suf: '_d' + pad(d)}; })
    : [{day: null, suf: ''}];
  var label = clean(a.tag + '_' + yr + '_' + monthSelect.getValue() + (daily ? '_days' : '') + (isS2 ? '_S2' : ''));

  var cloud = cloudSlider.getValue();
  var satKey = modisSatKey(), win = modisWin(), corrOn = corrCheck.getValue();
  var wantLST = selected.indexOf('LST') >= 0;
  var fillMethod = fillMethodSelect.getValue().indexOf('ERA5-Land ST-DCA') === 0 ? 'ST-DCA' : 'MODIS';
  var useLSTFill = hybrid && !isS2 && wantLST;
  var useStDca = useLSTFill && fillMethod === 'ST-DCA';
  var useModis = useLSTFill && fillMethod === 'MODIS';
  var modisOK = useModis && yr >= 2000 && !(satKey === 'aqua' && yr < 2003);
  var calib = modisOK ? calibrate(yr, mo, a.geom, satKey, cloud, corrOn) : null;
  var stDcaRadiusM = Number(stDcaRadiusSlider.getValue());
  var stDcaIterations = parseInt(stDcaIterationsSelect.getValue(), 10);
  var stDcaSharpen = stDcaSharpenCheck.getValue();
  var cfg = {
    maxCloud: cloud, sat: satKey, win: win, modisOK: modisOK,
    fillMethod: fillMethod,
    stDcaRadiusM: stDcaRadiusM, stDcaIterations: stDcaIterations,
    stDcaSharpen: stDcaSharpen,
    a: calib ? calib.a : 1, b: calib ? calib.b : 0
  };
  var satText = satKey === 'aqua' ? 'Aqua (MYD11A1)' : (satKey === 'both' ? 'Terra + Aqua' : 'Terra (MOD11A1)');

  if (!keepCheck.getValue()) resetMapLayers();
  map.centerObject(a.fc);
  var all = null, names = [], groups = [], flagNames = [], flagImgs = [], flagStatList = [], stDcaCounts = [], stDcaMatched = [], stDcaOffsets = [];
  var firstLstLayer = null, firstLstImage = null;
  var fScale = isS2 ? 100 : 120;
  entries.forEach(function(en, ei) {
    var nm = selected.map(function(n) { return n + en.suf; });
    var built = buildStack(yr, mo, en.day, a.geom, useLSTFill, isS2, cfg);
    var lay = built.stack.select(selected).rename(nm);
    all = all ? all.addBands(lay) : lay;
    names = names.concat(nm);
    var grp = nm.slice();
    if (wantLST && !isS2) {
      var fn = 'LST_fill_source' + en.suf;
      flagNames.push(fn); flagImgs.push(built.flag.rename(fn).toFloat()); grp.push(fn);
    }
    groups.push(grp);
    flagStatList.push(built.flag.reduceRegion({reducer: ee.Reducer.frequencyHistogram(), geometry: a.geom, scale: fScale,
      bestEffort: true, maxPixels: 1e9, tileScale: 4}).get('flag'));
    if (useStDca && built.landsatSceneCount !== undefined) { stDcaCounts.push(built.landsatSceneCount); stDcaMatched.push(built.eraMatchedSceneCount); stDcaOffsets.push(built.timeOffsets); }
    selected.forEach(function(n, si) {
      var lyr = map.addLayer(lay.select(n + en.suf), VIS[n], n + en.suf + ' ' + label, ei === 0 && si === 0);
      if (ei === 0 && n === 'LST') {
        firstLstLayer = lyr;
        firstLstImage = lay.select(n + en.suf);
      }
    });
    if (useStDca) {
      map.addLayer(built.original, VIS.LST, 'Original clear Landsat LST' + en.suf + ' ' + label, false);
      map.addLayer(built.era5, {min: 10, max: 40, palette: ['313695','74add1','ffffbf','f46d43','a50026']},
        'ERA5-Land hourly skin-temperature proxy' + en.suf + ' ' + label, false);
    }
    if (useLSTFill && (useStDca || modisOK)) {
      var flagVis = useStDca
        ? {min: 0, max: 2, palette: ['1a9850', 'ff9800', '6a51a3']}
        : {min: 0, max: 4, palette: ['1a9850', '2166ac', '67a9cf', 'a6cee3', 'd1e5f0']};
      var flagTitle = useStDca
        ? 'LST source flag' + en.suf + ' (0 Landsat, 1 ST-DCA, 2 Scene-Bias Fallback) ' + label
        : 'LST source flag' + en.suf + ' (0 Landsat, 1-4 MODIS) ' + label;
      map.addLayer(built.flag.updateMask(built.flag.lt(255)), flagVis, flagTitle, false);
    }
  });
  flagImgs.forEach(function(f) { all = all.addBands(f); });
  map.addLayer(a.fc.style({color: AOI_COLOR, fillColor: '00000000', width: 2}), {}, 'Boundary ' + label);
  aoiRenderDisplay();
  updateLegend(selected[0]);

  if (firstLstLayer && firstLstImage && autoContrastCheck.getValue()) {
    firstLstImage.reduceRegion({
      reducer: ee.Reducer.percentile([2, 98]),
      geometry: a.geom,
      scale: 120,
      maxPixels: 1e8,
      bestEffort: true,
      tileScale: 4
    }).evaluate(function(st) {
      if (!st) return;
      var lo = null, hi = null;
      Object.keys(st).forEach(function(k) {
        if (/p2$/.test(k) && st[k] !== null) lo = st[k];
        if (/p98$/.test(k) && st[k] !== null) hi = st[k];
      });
      if (lo !== null && hi !== null && hi > lo + 0.5) {
        var padLo = Math.floor((lo - 0.5) * 10) / 10;
        var padHi = Math.ceil((hi + 0.5) * 10) / 10;
        firstLstLayer.setVisParams({min: padLo, max: padHi, palette: VIS.LST.palette});
        if (selected[0] === 'LST') updateLegend('LST', padLo, padHi);
      }
    });
  }

  var msg = s2Note;
  if (useStDca) msg += ' Using Multi-Scale Auto-Scaled 30 m ST-DCA gap filling.';
  statusSpec.setValue('Loading map layers...' + msg);

  ee.List(flagStatList).evaluate(function(list, err) {
    if (!list) { dqBox.add(wl('Valid-pixel check failed. ' + (err || ''), {color: C.danger})); return; }
    var srcNames = useStDca
      ? {0: 'Landsat clear', 1: 'ST-DCA multi-scale 30 m', 2: 'Scene-bias + 30 m prior'}
      : FLAG_NAMES;
    var fillLabel = useStDca ? 'ST-DCA gap filling' : 'MODIS gap filling';
    renderDq(list, entries, isS2 ? 'Sentinel-2' : 'Landsat', useStDca || modisOK, srcNames, fillLabel);
  });
  if (useStDca) {
    var stDcaReport = card('ST-DCA Processing Summary');
    stDcaReport.add(note('Matching Landsat scenes to ERA5-Land hourly skin temperature + multi-scale residual + 30 m texture...'));
    ee.List(stDcaCounts).evaluate(function(counts, err) {
      ee.List(stDcaMatched).evaluate(function(matchedCounts, err2) {
        ee.List(stDcaOffsets).evaluate(function(offsetLists, err3) {
          stDcaReport.clear();
          stDcaReport.add(ui.Label('ST-DCA Processing Summary', {fontWeight: 'bold', fontSize: '14px', color: C.title, backgroundColor: C.card}));
          if (!counts || !matchedCounts || !offsetLists) {
            stDcaReport.add(wl('Could not retrieve time-match diagnostics.', {color: C.danger}));
          } else {
            counts.forEach(function(n, i) {
              var tag = entries[i].day === null ? 'Monthly composite' : 'Day ' + pad(entries[i].day);
              var matchedN = matchedCounts[i] || 0;
              var offsets = (offsetLists[i] || []).filter(function(x) { return x >= 0; });
              var meanOffset = offsets.length ? offsets.reduce(function(a, b) { return a + b; }, 0) / offsets.length : null;
              var maxOffset = offsets.length ? Math.max.apply(null, offsets) : null;
              stDcaReport.add(wl(tag + ': ' + n + ' Landsat scene(s) paired with ' + matchedN + ' ERA5 hourly image(s)', {fontSize: '11px', fontWeight: 'bold'}));
              stDcaReport.add(wl('Overpass time match: ' + (meanOffset === null ? 'N/A' : meanOffset.toFixed(1) + ' min mean diff (max ' + maxOffset.toFixed(1) + ' min)'), {fontSize: '11px', color: C.muted}));
            });
          }
          stDcaReport.add(note('Multi-Scale 30 m Texture Sharpening: ' + (stDcaSharpen ? 'ON' : 'OFF') + ' · Local radius: ' + stDcaRadiusM + ' m + 8 km Regional blend.'));
          qualBox.add(stDcaReport);
        });
      });
    });
  }
  if (calib) {
    qualBox.add(lbl('Calculating quality report...', {backgroundColor: C.bg, fontSize: '11px'}));
    calib.report.evaluate(function(q, err) {
      renderQuality(q, err, {corrOn: corrOn, sat: satText, area: a.tag, yr: yr, mo: mo, label: label});
    });
  }

  var settings = {app: APP_NAME + ' ' + VERSION, created_utc: new Date().toISOString(), area: a.tag, year: yr, month: mo,
    mode: daily ? 'selected days' : 'monthly composite', days: daily ? dayList.join(' ') : '',
    sensor: isS2 ? 'Sentinel-2 L2A' : 'Landsat 5/7/8/9 C2 L2', layers: selected.join(' '), max_cloud_pct: cloud,
    hybrid_requested: useLSTFill,
    gap_fill_method: useStDca ? 'ERA5-Land ST-DCA (Multi-Scale Auto-Scaled 30 m)' : (useModis ? 'MODIS calibrated' : 'none')};

  var dlNames = names.concat(flagNames);
  var prep = lbl('Preparing download links...', {backgroundColor: C.bg, fontSize: '11px'});
  dlSpec.add(prep);
  a.geom.bounds().area(100).evaluate(function(areaM2) {
    dlSpec.remove(prep);
    var sep = separateCheck.getValue() && daily;
    var maxBands = sep ? Math.max.apply(null, groups.map(function(g) { return g.length; })) : dlNames.length;
    var scale = computeScale(areaM2, maxBands, 4, isS2 ? 10 : 30);
    dlSpec.add(lbl('Downloads  (resolution auto-set to ' + scale + ' m)', {backgroundColor: C.bg, fontWeight: 'bold'}));
    if (sep) {
      groups.forEach(function(g, gi) {
        makeTif(dlSpec, a.geom, all.select(g).toFloat(), label + '_d' + pad(dayList[gi]), scale, 0, 'Day ' + pad(dayList[gi]) + ' GeoTIFF');
      });
    } else {
      makeTif(dlSpec, a.geom, all.select(dlNames).toFloat(), label + '_stack', scale, 0,
        (daily ? 'All days stack GeoTIFF (' + dlNames.length + ' bands)' : dlNames.join('+') + ' GeoTIFF'));
    }
    if (!sep && names.indexOf('LST') >= 0 && dlNames.length > 2) {
      var lstBands = ['LST'].concat(flagNames);
      makeTif(dlSpec, a.geom, all.select(lstBands).toFloat(), label + '_LST_only', scale, 0,
        'LST + flag only GeoTIFF (lighter and faster)');
    }
    boundaryLink(dlSpec, a.fc, label);
    var stats = all.select(names).reduceRegion({
      reducer: ee.Reducer.mean().combine(ee.Reducer.min(), '', true).combine(ee.Reducer.max(), '', true)
        .combine(ee.Reducer.stdDev(), '', true),
      geometry: a.geom, scale: Math.max(scale, 100), bestEffort: true, maxPixels: 1e10});
    csvLink(dlSpec, ee.FeatureCollection([ee.Feature(null, stats).set('area', label)]), label + '_stats', 'Stats CSV (mean / min / max / std)');
    csvLink(dlSpec, ee.FeatureCollection([ee.Feature(null, settings)]), label + '_settings', 'Settings record CSV');
  });
}
goBtn.onClick(runSpectral);

// ---------------- Tab 2: LULC ----------------
function getLulc(key, yr, geom) {
  var empty = ee.Image.constant(0).updateMask(ee.Image.constant(0)).rename('label');
  var img, s = ee.Date.fromYMD(yr, 1, 1), extra = '';
  if (key.indexOf('Dynamic') === 0) {
    var col = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1').filterDate(s, s.advance(1, 'year'))
      .filterBounds(geom).select('label');
    img = ee.Image(ee.Algorithms.If(col.size().gt(0), col.mode(), empty));
  } else if (key.indexOf('ESA') === 0) {
    var wy = yr >= 2021 ? 2021 : 2020;
    img = ee.ImageCollection(wy === 2021 ? 'ESA/WorldCover/v200' : 'ESA/WorldCover/v100').first().select('Map');
    extra = ' Showing ' + wy + '.';
  } else {
    var c2 = ee.ImageCollection('MODIS/061/MCD12Q1').filterDate(s, s.advance(1, 'year')).select('LC_Type1');
    img = ee.Image(ee.Algorithms.If(c2.size().gt(0), c2.first(), empty));
  }
  return {img: img.rename('label').clip(geom), extra: extra};
}

function runLulc() {
  dlLulc.clear(); tableLulc.clear();
  var a = getArea();
  if (!a) { statusLulc.setValue('Select a State / District or draw a custom study area first.'); return; }
  var yr = parseInt(yearSelect.getValue(), 10);
  var key = lulcSelect.getValue(), def = LULC[key];
  if (key.indexOf('Dynamic') === 0 && yr < 2016) { statusLulc.setValue('Dynamic World starts in 2016.'); return; }
  if (key.indexOf('MODIS') === 0 && yr < 2001) { statusLulc.setValue('MODIS land cover starts in 2001.'); return; }

  var lu = getLulc(key, yr, a.geom);
  var codes = def.classes.map(function(c) { return c[0]; });
  var idx = codes.map(function(c, i) { return i; });
  var pal = def.classes.map(function(c) { return c[2]; });
  var label = clean(a.tag + '_' + key.split(' (')[0] + '_' + yr);

  if (!keepCheck.getValue()) resetMapLayers();
  map.centerObject(a.fc);
  map.addLayer(lu.img.remap(codes, idx), {min: 0, max: Math.max(codes.length - 1, 1), palette: pal}, key.split(' (')[0] + ' ' + yr, true);
  map.addLayer(a.fc.style({color: AOI_COLOR, fillColor: '00000000', width: 2}), {}, 'Boundary ' + label);
  aoiRenderDisplay();
  legend.clear();
  statusLulc.setValue('Calculating class areas... ' + lu.extra);

  ee.Image.pixelArea().divide(1e6).addBands(lu.img).reduceRegion({
    reducer: ee.Reducer.sum().group({groupField: 1, groupName: 'label'}),
    geometry: a.geom, scale: Math.max(def.scale, 30), maxPixels: 1e10, bestEffort: true, tileScale: 4
  }).evaluate(function(r, err) {
    if (!r) { statusLulc.setValue('No data for this area/year. ' + (err || '')); return; }
    var info = {};
    def.classes.forEach(function(c) { info[c[0]] = c; });
    var rows = (r.groups || []).map(function(g) { return {code: g.label, area: g.sum}; })
      .filter(function(g) { return info[g.code]; })
      .sort(function(p, q) { return q.area - p.area; });
    var total = rows.reduce(function(s, g) { return s + g.area; }, 0);
    statusLulc.setValue('Class areas (approx., computed at ' + Math.max(def.scale, 30) + ' m). ' + lu.extra);

    var t = card('Class areas');
    var csvFeats = [];
    rows.forEach(function(g) {
      var c = info[g.code];
      var pct = total > 0 ? g.area / total * 100 : 0;
      t.add(ui.Panel([swatch(c[2]),
        ui.Label(c[0] + '  ' + c[1], {backgroundColor: C.card, width: '175px', fontSize: '12px', margin: '3px 0'}),
        ui.Label(g.area.toFixed(1) + ' km²', {backgroundColor: C.card, width: '80px', fontSize: '12px', margin: '3px 0', textAlign: 'right'}),
        ui.Label(pct.toFixed(1) + '%', {backgroundColor: C.card, width: '45px', fontSize: '12px', margin: '3px 0', textAlign: 'right'})
      ], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
      csvFeats.push(ee.Feature(null, {class_code: c[0], class_name: c[1], area_km2: Number(g.area.toFixed(3)), percent: Number(pct.toFixed(2))}));
    });
    tableLulc.add(t);

    legend.add(legendLabel(key.split(' (')[0] + ' ' + yr, {fontWeight: 'bold', fontSize: '12px'}));
    rows.forEach(function(g) {
      var c = info[g.code];
      legend.add(ui.Panel([swatch(c[2]), legendLabel(c[1])], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
    });

    dlLulc.add(lbl('Downloads', {backgroundColor: C.bg, fontWeight: 'bold'}));
    a.geom.bounds().area(100).evaluate(function(areaM2) {
      var scale = computeScale(areaM2, 1, 1, def.scale);
      makeTif(dlLulc, a.geom, lu.img.toByte(), label, scale, 0, 'LULC GeoTIFF (class codes)');
      boundaryLink(dlLulc, a.fc, label);
      if (csvFeats.length) csvLink(dlLulc, ee.FeatureCollection(csvFeats), label + '_areas', 'Class area table CSV');
    });
  });
}
lulcBtn.onClick(runLulc);

// ---------------- Tab 3: Accuracy ----------------
function cell(text, st) {
  return ui.Label(String(text), merge({width: '46px', fontSize: '11px', textAlign: 'center', margin: '1px',
    padding: '3px 0', backgroundColor: '#ffffff', color: C.text}, st || {}));
}
function closeBtn() {
  return ui.Button({label: 'Close', onClick: function() { accBox.style().set('shown', false); }});
}
function cname(names, code) { return names[code] ? names[code] : ('class ' + code); }
function num(v) { return (v === null || v === undefined || isNaN(v)) ? null : Number(v); }
function wl(text, st) { return lbl(text, merge({whiteSpace: 'normal'}, st || {})); }

function diagnose(r, codes) {
  var M = r.matrix, n = codes.length, total = 0, diag = 0, i, j;
  for (i = 0; i < n; i++) for (j = 0; j < n; j++) { total += M[i][j]; if (i === j) diag += M[i][j]; }
  var pairs = [], weak = [], small = [];
  for (i = 0; i < n; i++) {
    var rs = 0, cs = 0;
    for (j = 0; j < n; j++) { rs += M[i][j]; cs += M[j][i]; }
    for (j = i + 1; j < n; j++) {
      var s = M[i][j] + M[j][i];
      if (s > 0) pairs.push({a: i, b: j, ab: M[i][j], ba: M[j][i], sum: s});
    }
    var pa = num(r.pa[i]), ua = num(r.ua[i]);
    var lowPA = (rs > 0 && pa !== null && pa < 0.7), lowUA = (cs > 0 && ua !== null && ua < 0.7);
    if (lowPA || lowUA) weak.push({i: i, pa: pa, ua: ua, lowPA: lowPA, lowUA: lowUA});
    if (rs > 0 && rs < 20) small.push({i: i, n: rs});
  }
  pairs.sort(function(p, q) { return q.sum - p.sum; });
  return {total: total, diag: diag, errors: total - diag, pairs: pairs, weak: weak, small: small};
}

function renderDiagnosis(target, r, codes, names) {
  target.clear();
  var d = diagnose(r, codes);
  var t = card('Confusion Diagnosis');
  if (d.total === 0 || d.errors === 0) { target.add(t); return; }
  t.add(wl('OA ' + fmt(r.oa * 100, 1) + ' %, Kappa ' + fmt(r.kappa, 3) + '. ' + d.errors + ' of ' + d.total + ' points are wrong.', {fontWeight: 'bold'}));
  d.pairs.slice(0, 5).forEach(function(p) {
    var A = cname(names, codes[p.a]), B = cname(names, codes[p.b]);
    t.add(wl(A + ' vs ' + B + ':  ' + p.sum + ' wrong', {margin: '3px 0 0 0'}));
  });
  target.add(t);
}

function showAccuracy(r, def, key, yr, a, label, dlTarget, diagTarget) {
  var codes = def.classes.map(function(c) { return c[0]; });
  var names = {};
  def.classes.forEach(function(c) { names[c[0]] = c[1]; });
  var M = r.matrix, act = [];
  codes.forEach(function(c, i) {
    var rs = 0, cs = 0;
    M[i].forEach(function(v) { rs += v; });
    M.forEach(function(row) { cs += row[i]; });
    if (rs + cs > 0) act.push(i);
  });
  var hd = {fontWeight: 'bold', backgroundColor: '#dcebf4'};
  accBox.clear();
  accBox.add(ui.Label('Accuracy: ' + key.split(' (')[0] + ' ' + yr, {fontWeight: 'bold', fontSize: '15px', color: C.title, backgroundColor: C.card}));
  accBox.add(ui.Label('Overall accuracy: ' + fmt(r.oa * 100, 1) + ' %     Kappa: ' + fmt(r.kappa, 3) + '     Points: ' + r.n,
    {fontWeight: 'bold', fontSize: '13px', color: C.accent, backgroundColor: C.card}));

  accBox.add(ui.Panel([cell('', hd)].concat(act.map(function(i) { return cell(codes[i], hd); })).concat([cell("PA %", hd)]),
    ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
  act.forEach(function(i) {
    var rowCells = [cell(codes[i], hd)];
    act.forEach(function(j) {
      rowCells.push(cell(M[i][j], i === j ? {backgroundColor: '#d9f2e3', fontWeight: 'bold'} : {}));
    });
    rowCells.push(cell(fmt(r.pa[i] * 100, 1), {backgroundColor: '#eef2f5'}));
    accBox.add(ui.Panel(rowCells, ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
  });
  accBox.add(ui.Panel([cell('UA %', hd)].concat(act.map(function(j) { return cell(fmt(r.ua[j] * 100, 1), {backgroundColor: '#eef2f5'}); })),
    ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
  accBox.add(closeBtn());
  accBox.style().set('shown', true);

  renderDiagnosis(diagTarget, r, codes, names);
  dlTarget.add(lbl('Downloads', {backgroundColor: C.bg, fontWeight: 'bold'}));
  csvLink(dlTarget, ee.FeatureCollection([ee.Feature(null, {dataset: key, year: yr, overall_accuracy_pct: Number(fmt(r.oa * 100, 2)),
    kappa: Number(fmt(r.kappa, 4)), points: r.n})]), label + '_accuracy_summary', 'Accuracy summary CSV');
}

function runAccuracy() {
  dlAcc.clear(); diagAcc.clear();
  accBox.style().set('shown', false);
  var a = getArea();
  if (!a) { statusAcc.setValue('Select a State / District or draw a custom study area first.'); return; }
  var assetId = String(assetBox.getValue() || '').replace(/^\s+|\s+$/g, '');
  var prop = String(propBox.getValue() || '').replace(/^\s+|\s+$/g, '');
  if (!assetId || !prop) { statusAcc.setValue('Enter the asset path and class column name.'); return; }
  var yr = parseInt(yearSelect.getValue(), 10);
  var key = lulcSelect.getValue(), def = LULC[key];
  var lu = getLulc(key, yr, a.geom);
  var codes = def.classes.map(function(c) { return c[0]; });
  var label = clean(a.tag + '_' + key.split(' (')[0] + '_' + yr);

  var pts = ee.FeatureCollection(assetId).filterBounds(a.geom)
    .map(function(f) { return ee.Feature(f.geometry(), {truth: ee.Number(f.get(prop)).toInt()}); });
  var sampled = lu.img.sampleRegions({collection: pts, properties: ['truth'], scale: def.scale, tileScale: 4})
    .filter(ee.Filter.notNull(['label', 'truth']));
  var cm = sampled.errorMatrix('truth', 'label', codes);
  var res = ee.Dictionary({
    n: sampled.size(), oa: cm.accuracy(), kappa: cm.kappa(), matrix: cm.array(),
    pa: cm.producersAccuracy().toList().flatten(), ua: cm.consumersAccuracy().toList().flatten()});
  statusAcc.setValue('Calculating... (' + key + ', ' + yr + ')');
  res.evaluate(function(r, err) {
    if (!r) { statusAcc.setValue('Could not calculate. ' + (err ? '(' + err + ')' : '')); return; }
    statusAcc.setValue('Done. Results box is on the map.');
    showAccuracy(r, def, key, yr, a, label, dlAcc, diagAcc);
  });
}
accBtn.onClick(runAccuracy);

// ---------------- Tab 4: Random Forest ----------------
function rfRefreshCounts() {
  rfClasses.forEach(function(c) { c.countLbl.setValue(String(c.layer.geometries().length())); });
}
var rfHist = [], rfRedoStack = [], rfRestoring = false;
function rfState() {
  var st = {};
  rfClasses.forEach(function(k) {
    var g = k.layer.geometries(), arr = [];
    for (var q = 0; q < g.length(); q++) arr.push(g.get(q));
    st[k.code] = arr;
  });
  return st;
}
function rfSameState(a, b) {
  var ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (var i = 0; i < ka.length; i++) {
    var x = a[ka[i]], y = b[ka[i]];
    if (!y || x.length !== y.length) return false;
    for (var j = 0; j < x.length; j++) if (x[j] !== y[j]) return false;
  }
  return true;
}
function rfPush() {
  if (rfRestoring) return;
  var st = rfState();
  if (rfHist.length && rfSameState(rfHist[rfHist.length - 1], st)) return;
  rfHist.push(st);
  rfRedoStack = [];
  if (rfHist.length > 60) rfHist.shift();
}
function rfApply(st) {
  rfRestoring = true;
  rfClasses.forEach(function(k) { k.layer.geometries().reset(st[k.code] || []); });
  rfRestoring = false;
  rfRefreshCounts();
}
function rfUndo() {
  try { dt.stop(); } catch (e) {}
  if (rfHist.length < 2) { statusRf.setValue('Nothing to undo.'); return; }
  rfRedoStack.push(rfHist.pop());
  rfApply(rfHist[rfHist.length - 1]);
  statusRf.setValue('Undone.');
}
function rfRedoDo() {
  try { dt.stop(); } catch (e) {}
  if (!rfRedoStack.length) { statusRf.setValue('Nothing to redo.'); return; }
  var st = rfRedoStack.pop();
  rfHist.push(st);
  rfApply(st);
  statusRf.setValue('Redone.');
}
function rfOnChange(geometry, layer) {
  if (layer && !rfClasses.some(function(k) { return k.layer === layer; })) return;
  rfRefreshCounts();
  rfPush();
}
try { dt.onDraw(rfOnChange); dt.onEdit(rfOnChange); dt.onErase(rfOnChange); } catch (e) {}
rfUndoBtn.onClick(rfUndo);
rfRedoBtn.onClick(rfRedoDo);

function rfSnapshot() {
  rfClasses.forEach(function(k) {
    var g = k.layer.geometries(), arr = [];
    for (var q = 0; q < g.length(); q++) arr.push(g.get(q));
    k.saved = arr;
  });
}
function rfRestore() {
  rfClasses.forEach(function(k) {
    if (!k.saved) return;
    try { dt.layers().remove(k.layer); } catch (e) {}
    k.layer = dt.addLayer(k.saved, k.layerName, '#' + k.color, true);
  });
  rfRefreshCounts();
}
function resetMapLayers() {
  if (aoiInteractionMode !== 'pan') aoiSetPanMode();
  else { try { dt.stop(); } catch (e) {} }
  rfSnapshot();
  map.layers().reset();
  map.layers().add(aoiDisplayLayer);
  rfRestore();
  aoiRenderDisplay();
}
function rfPickColor() {
  var hx = String(rfHexBox.getValue() || '').replace(/^\s+|\s+$/g, '').replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(hx)) return hx.toLowerCase();
  var sel = rfColorSel.getValue();
  for (var i = 0; i < COLOR_OPTIONS.length; i++) if (COLOR_OPTIONS[i][0] === sel) return COLOR_OPTIONS[i][1];
  var used = rfClasses.map(function(k) { return k.color; });
  for (var j = 0; j < RF_COLORS.length; j++) if (used.indexOf(RF_COLORS[j]) < 0) return RF_COLORS[j];
  return RF_COLORS[(rfNextCode - 1) % RF_COLORS.length];
}
function rfApplyColor(k, hex) {
  k.color = hex;
  k.sw.style().set('backgroundColor', '#' + hex);
  k.layer.setColor('#' + hex);
}

function rfAddClass() {
  var name = String(rfNameBox.getValue() || '').replace(/^\s+|\s+$/g, '');
  if (!name) { statusRf.setValue('Type a class name first.'); return; }
  if (rfClasses.length >= 12) { statusRf.setValue('Maximum 12 classes.'); return; }
  var color = rfPickColor();
  var layerName = 'RF ' + rfNextCode + ' ' + name;
  var layer = dt.addLayer([], layerName, '#' + color, true);
  var k = {code: rfNextCode, name: name, color: color, layer: layer, layerName: layerName, saved: null};
  rfNextCode++;
  k.countLbl = ui.Label('0', {backgroundColor: C.card, width: '30px', fontSize: '12px', margin: '6px 0', textAlign: 'right'});
  var drawBtn = ui.Button({label: 'Draw', style: {margin: '2px 2px'}});
  var moveBtn = ui.Button({label: 'Move', style: {margin: '2px 2px'}});
  var delBtn = ui.Button({label: 'Delete', style: {margin: '2px 2px'}});
  k.sw = swatch(color);
  var colSel = ui.Select({items: COLOR_NAMES, placeholder: 'colour', style: {width: '74px', margin: '2px 2px'}});
  COLOR_OPTIONS.forEach(function(c) { if (c[1] === color) colSel.setValue(c[0], false); });
  colSel.onChange(function(v) {
    COLOR_OPTIONS.forEach(function(c) { if (c[0] === v) rfApplyColor(k, c[1]); });
  });
  var row = ui.Panel([
    ui.Panel([k.sw,
      ui.Label(k.code + '  ' + name, {backgroundColor: C.card, width: '150px', fontSize: '12px', margin: '6px 0'}),
      k.countLbl, colSel], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}),
    ui.Panel([drawBtn, moveBtn, delBtn], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card})
  ], null, {backgroundColor: C.card, margin: '4px 0 8px 0'});
  drawBtn.onClick(function() {
    dt.stop();
    dt.setDrawModes(['point', 'polygon']);
    dt.setSelected(k.layer);
    dt.setShape(rfShape.getValue() === 'Points' ? 'point' : 'polygon');
    dt.draw();
    statusRf.setValue('Drawing ' + rfShape.getValue().toLowerCase() + ' for "' + k.name + '".');
  });
  moveBtn.onClick(function() {
    dt.stop();
    dt.setSelected(k.layer);
    statusRf.setValue('Move mode for "' + k.name + '".');
  });
  delBtn.onClick(function() {
    dt.stop();
    dt.layers().remove(k.layer);
    rfClasses.splice(rfClasses.indexOf(k), 1);
    rfList.remove(row);
    rfPush();
  });
  rfClasses.push(k);
  rfList.add(row);
  rfPush();
  rfNameBox.setValue(''); rfHexBox.setValue('');
  statusRf.setValue('Class "' + name + '" added.');
}
rfAddBtn.onClick(rfAddClass);
rfStopBtn.onClick(function() { dt.stop(); rfRefreshCounts(); statusRf.setValue('Drawing stopped.'); });

function rfBandList() {
  var b = NAMES6.slice();
  if (rfIdx.getValue()) b = b.concat(IDX7);
  if (rfDem.getValue()) b = b.concat(['ELEV', 'SLOPE']);
  if (rfS1.getValue()) b = b.concat(['VV', 'VH']);
  if (rfRasterUse.getValue() && rfRaster.names) b = b.concat(rfRaster.names.map(function(n) { return 'X_' + n; }));
  return b;
}
function s1Composite(start, end, geom) {
  var col = ee.ImageCollection('COPERNICUS/S1_GRD').filterDate(start, end).filterBounds(geom)
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .select(['VV', 'VH']);
  var empty = ee.Image.constant([0, 0]).rename(['VV', 'VH']).updateMask(ee.Image.constant(0));
  return ee.Image(ee.Algorithms.If(col.size().gt(0), col.median(), empty));
}
function rfComposite(geom) {
  var yr = parseInt(yearSelect.getValue(), 10);
  var m1 = parseInt(rfFrom.getValue(), 10), m2 = parseInt(rfTo.getValue(), 10);
  var s0 = ee.Date.fromYMD(yr, m1, 1), e0 = ee.Date.fromYMD(yr, m2, 1).advance(1, 'month');
  var isS2 = (rfSensor.getValue().indexOf('Sentinel') === 0);
  var cl = rfCloud.getValue();
  var base = isS2 ? sentinelComposite(s0, e0, geom, cl) : landsatComposite(s0, e0, geom, cl).select(NAMES6);
  var img = base;
  if (rfIdx.getValue()) img = img.addBands(addIndices(base, false));
  if (rfS1.getValue()) img = img.addBands(s1Composite(s0, e0, geom));
  if (rfDem.getValue()) {
    var dem = ee.Image('USGS/SRTMGL1_003');
    img = img.addBands(dem.rename('ELEV')).addBands(ee.Terrain.slope(dem).rename('SLOPE'));
  }
  if (rfRasterUse.getValue() && rfRaster.id) {
    img = img.addBands(ee.Image(rfRaster.id).rename(rfRaster.names.map(function(n) { return 'X_' + n; })));
  }
  return {img: img.clip(geom), base: base.clip(geom), isS2: isS2, scale: isS2 ? 10 : 30};
}
function rfCheckInputs() {
  if (rfRasterUse.getValue() && !rfRaster.id) return 'Press "Load raster from asset" first.';
  var yr = parseInt(yearSelect.getValue(), 10);
  var isS2 = (rfSensor.getValue().indexOf('Sentinel') === 0);
  if (isS2 && yr < 2017) return 'Sentinel-2 starts in 2017.';
  if (rfS1.getValue() && yr < 2015) return 'Sentinel-1 data is only reliable from 2015.';
  if (parseInt(rfTo.getValue(), 10) < parseInt(rfFrom.getValue(), 10)) return 'The end month must not be before the start month.';
  return null;
}

rfShowBtn.onClick(function() {
  var a = getArea();
  if (!a) { statusRf.setValue('Select a State / District or draw a custom study area first.'); return; }
  var bad = rfCheckInputs();
  if (bad) { statusRf.setValue(bad); return; }
  var chosen = RF_PREVIEW.filter(function(p, i) { return rfPrevChecks[i].getValue(); });
  if (!chosen.length) { statusRf.setValue('Tick at least one reference layer to load.'); return; }
  var c = rfComposite(a.geom);
  var ind = addIndices(c.base, false);
  resetMapLayers();
  map.centerObject(a.fc);
  var loaded = [], first = true;
  chosen.forEach(function(p) {
    var key = p[0];
    if (key === 'rgb') map.addLayer(c.base, {bands: ['R', 'G', 'B'], min: 0, max: 0.3, gamma: 1.2}, p[1], first);
    else if (key === 'fcc') map.addLayer(c.base, {bands: ['N', 'R', 'G'], min: 0, max: 0.5, gamma: 1.2}, p[1], first);
    else {
      var v = VIS[key];
      map.addLayer(ind.select(key), {min: v.min, max: v.max, palette: v.palette}, p[1], first);
      loaded.push(key);
    }
    first = false;
  });
  map.addLayer(a.fc.style({color: AOI_COLOR, fillColor: '00000000', width: 2}), {}, 'Boundary');
  aoiRenderDisplay();
  statusRf.setValue('Reference layers loaded.');
});

function rfAreas(img, def, geom, scale, target) {
  var info = {};
  def.classes.forEach(function(c) { info[c[0]] = c; });
  ee.Image.pixelArea().divide(1e6).addBands(img).reduceRegion({
    reducer: ee.Reducer.sum().group({groupField: 1, groupName: 'label'}),
    geometry: geom, scale: Math.max(scale, 30), maxPixels: 1e10, bestEffort: true, tileScale: 4
  }).evaluate(function(r) {
    if (!r) return;
    var rows = (r.groups || []).map(function(g) { return {code: g.label, area: g.sum}; })
      .filter(function(g) { return info[g.code]; }).sort(function(p, q) { return q.area - p.area; });
    var total = rows.reduce(function(sum, g) { return sum + g.area; }, 0);
    var t = card('Class areas (approx.)');
    rows.forEach(function(g) {
      var c = info[g.code], pct = total > 0 ? g.area / total * 100 : 0;
      t.add(ui.Panel([swatch(c[2]),
        ui.Label(c[0] + '  ' + c[1], {backgroundColor: C.card, width: '175px', fontSize: '12px', margin: '3px 0'}),
        ui.Label(g.area.toFixed(1) + ' km²', {backgroundColor: C.card, width: '80px', fontSize: '12px', margin: '3px 0', textAlign: 'right'}),
        ui.Label(pct.toFixed(1) + '%', {backgroundColor: C.card, width: '45px', fontSize: '12px', margin: '3px 0', textAlign: 'right'})
      ], ui.Panel.Layout.flow('horizontal'), {backgroundColor: C.card}));
    });
    target.add(t);
  });
}

function rfRun() {
  rfOut.clear(); rfDl.clear(); rfDiag.clear();
  accBox.style().set('shown', false);
  try { dt.stop(); } catch (e) {}
  rfRefreshCounts();
  var a = getArea();
  if (!a) { statusRf.setValue('Select a State / District or draw a custom study area first.'); return; }
  var bad = rfCheckInputs();
  if (bad) { statusRf.setValue(bad); return; }
  var used = rfClasses.filter(function(k) { return k.layer.geometries().length() > 0; });
  if (used.length < 2) { statusRf.setValue('Add at least 2 classes and draw samples for each.'); return; }
  var tiny = used.filter(function(k) { return k.layer.geometries().length() < 2; });
  if (tiny.length) {
    statusRf.setValue('Each class needs at least 2 points / polygons.');
    return;
  }
  var trees = parseInt(rfTrees.getValue(), 10) || 100;
  trees = Math.max(10, Math.min(500, trees));
  var split = parseInt(rfSplit.getValue(), 10) / 100;
  var cap = Math.max(50, parseInt(rfCap.getValue(), 10) || 1000);
  var capTest = Math.ceil(cap * (1 - split) / split);

  var yr = parseInt(yearSelect.getValue(), 10);
  var c = rfComposite(a.geom);
  var bands = rfBandList();
  var stack = c.img.select(bands);
  var codes = used.map(function(k) { return k.code; });
  var idx = codes.map(function(v, i) { return i; });
  var def = {classes: used.map(function(k) { return [k.code, k.name, k.color]; })};
  var label = clean(a.tag + '_RF_' + yr);

  var train = null, test = null, allFeats = [];
  used.forEach(function(k, ci) {
    var feats = [], g = k.layer.geometries();
    for (var q = 0; q < g.length(); q++) {
      var f = ee.Feature(g.get(q), {lc: k.code, class_name: k.name});
      feats.push(f); allFeats.push(f);
    }
    var nF = feats.length;
    var nTr = Math.max(1, Math.min(nF - 1, Math.round(nF * split)));
    var order = feats.map(function(f, i) {
      var h = Math.sin((i + 1) * 12.9898 + (ci + 1) * 78.233) * 43758.5453;
      return {f: f, r: h - Math.floor(h)};
    }).sort(function(p, q) { return p.r - q.r; });
    var trF = order.slice(0, nTr).map(function(o) { return o.f; });
    var teF = order.slice(nTr).map(function(o) { return o.f; });
    function samp(list, n) {
      return stack.sampleRegions({collection: ee.FeatureCollection(list), properties: ['lc'], scale: c.scale, tileScale: 4})
        .filter(ee.Filter.notNull(bands)).randomColumn('r2', 7).limit(n, 'r2');
    }
    var trS = samp(trF, cap);
    var teS = samp(teF, capTest);
    train = train ? train.merge(trS) : trS;
    test = test ? test.merge(teS) : teS;
  });

  var clf = ee.Classifier.smileRandomForest({numberOfTrees: trees, seed: 7})
    .train({features: train, classProperty: 'lc', inputProperties: bands});
  var classified = stack.classify(clf).rename('label').clip(a.geom);

  if (!keepCheck.getValue()) resetMapLayers();
  map.centerObject(a.fc);
  map.addLayer(classified.remap(codes, idx), {min: 0, max: Math.max(codes.length - 1, 1), palette: def.classes.map(function(k) { return k[2]; })},
    'RF classification ' + yr, true);
  map.addLayer(a.fc.style({color: AOI_COLOR, fillColor: '00000000', width: 2}), {}, 'Boundary ' + label);
  aoiRenderDisplay();

  var cm = test.classify(clf).errorMatrix('lc', 'classification', codes);
  var res = ee.Dictionary({
    n: test.size(), nTrain: train.size(), oa: cm.accuracy(), kappa: cm.kappa(), matrix: cm.array(),
    pa: cm.producersAccuracy().toList().flatten(), ua: cm.consumersAccuracy().toList().flatten()});

  statusRf.setValue('Training ' + trees + ' trees...');
  res.evaluate(function(r, err) {
    if (!r) { statusRf.setValue('Could not train / test. ' + (err ? '(' + err + ')' : '')); return; }
    statusRf.setValue('Done. Held-out test points: ' + r.n + '.');
    showAccuracy(r, def, 'Random Forest (own samples)', yr, a, label, rfDl, rfDiag);
    rfAreas(classified, def, a.geom, c.scale, rfOut);
  });
}
rfRunBtn.onClick(rfRun);

rfRasterBtn.onClick(function() {
  var id = tx(rfRasterBox.getValue());
  if (!id) { statusRf.setValue('Paste the raster asset path first.'); return; }
  var im = ee.Image(id);
  ee.Dictionary({names: im.bandNames()}).evaluate(function(r) {
    if (!r || !r.names) { statusRf.setValue('Could not read the raster.'); return; }
    rfRaster = {id: id, names: r.names, vis: {min: 0, max: 1, palette: ['000000', 'ffffff']}};
    statusRf.setValue('Raster loaded: ' + r.names.length + ' band(s).');
  });
});

function rfGeoms(g) {
  var out = [];
  if (!g) return out;
  if (g.type === 'Point') out.push(ee.Geometry.Point(g.coordinates));
  else if (g.type === 'MultiPoint') g.coordinates.forEach(function(c) { out.push(ee.Geometry.Point(c)); });
  else if (g.type === 'Polygon') out.push(ee.Geometry.Polygon(g.coordinates, null, false));
  else if (g.type === 'MultiPolygon') g.coordinates.forEach(function(c) { out.push(ee.Geometry.Polygon(c, null, false)); });
  return out;
}
rfAssetBtn.onClick(function() {
  var id = tx(rfAssetBox.getValue()), col = tx(rfAssetColBox.getValue());
  if (!id || !col) { statusRf.setValue('Enter the asset path and class column name.'); return; }
  var a = getArea();
  var fc = ee.FeatureCollection(id);
  if (a) fc = fc.filterBounds(a.geom);
  ee.Dictionary({n: fc.size(), fc: fc.limit(2000).select([col])}).evaluate(function(r) {
    if (!r || !r.fc) { statusRf.setValue('Could not read the asset.'); return; }
    var feats = r.fc.features || [], groups = {}, order = [];
    feats.forEach(function(f) {
      var v = f.properties ? f.properties[col] : null;
      if (v === null || v === undefined) return;
      var key = String(v);
      if (!groups[key]) { groups[key] = []; order.push(key); }
      rfGeoms(f.geometry).forEach(function(g) { groups[key].push(g); });
    });
    rfRestoring = true;
    order.forEach(function(n) {
      var k = rfClasses.filter(function(x) { return x.name === n; })[0];
      if (!k) { rfNameBox.setValue(n); rfAddClass(); k = rfClasses[rfClasses.length - 1]; }
      var cur = [], gl = k.layer.geometries();
      for (var q = 0; q < gl.length(); q++) cur.push(gl.get(q));
      k.layer.geometries().reset(cur.concat(groups[n]));
    });
    rfRestoring = false;
    rfRefreshCounts();
    rfPush();
    statusRf.setValue('Imported ' + feats.length + ' sample feature(s).');
  });
});

function norm(s) { return ' ' + String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/^\s+|\s+$/g, '') + ' '; }
function applyCommand(text) {
  var t = norm(text), raw = String(text).toLowerCase();
  if (places.length === 0 || stateNames.length === 0) return;
  var stFound = null, bestS = 0;
  stateNames.forEach(function(s) {
    var n = norm(s);
    if (t.indexOf(n) >= 0 && n.length > bestS) { stFound = s; bestS = n.length; }
  });
  var dFound = null, dState = null, bestD = 0;
  places.forEach(function(p) {
    var n = norm(p[0]);
    if (t.indexOf(n) >= 0 && n.length > bestD && (!stFound || p[1] === stFound)) { dFound = p[0]; dState = p[1]; bestD = n.length; }
  });
  var st = dFound ? dState : stFound;
  if (!st) return;
  var ym = t.match(/\b(19[89]\d|20[0-4]\d)\b/);
  if (ym) yearSelect.setValue(ym[1], false);
  setAreaSource('State / District');
  stateSelect.setValue(st, false);
  showTab(0);
  loadDistricts(st, function() {
    if (dFound) districtSelect.setValue(dFound, false);
    runSpectral();
  });
}
cmdBtn.onClick(function() { applyCommand(cmdBox.getValue()); });
