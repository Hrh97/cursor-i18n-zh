const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Cursor 的用户数据目录随平台不同：
//   macOS   ~/Library/Application Support/Cursor/User
//   Windows %APPDATA%\Cursor\User
//   Linux   $XDG_CONFIG_HOME/Cursor/User（默认 ~/.config）
// 旧版本把 macOS 路径写死，导致 Windows 上写到了
// C:\Users\<用户>\Library\Application Support\Cursor\User 这个无效目录。
function resolveCursorUserDir() {
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Cursor', 'User');
  }
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'Cursor', 'User');
  }
  const configHome = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(configHome, 'Cursor', 'User');
}

const CURSOR_USER_DIR = resolveCursorUserDir();

const LOCALE_PATH = path.join(CURSOR_USER_DIR, 'locale.json');
const SETTINGS_PATH = path.join(CURSOR_USER_DIR, 'settings.json');
const LANG_PACK_ID = 'MS-CEINTL.VSCODE-LANGUAGE-PACK-ZH-HANS';

function readJsonSafe(filePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function configureDisplayLanguage() {
  writeJson(LOCALE_PATH, { locale: 'zh-cn' });
  return LOCALE_PATH;
}

function ensureLanguagePackInstalled() {
  const extDir = path.join(os.homedir(), '.cursor', 'extensions');
  if (!fs.existsSync(extDir)) {
    return { installed: false, hint: '扩展目录不存在，请在 Cursor 中搜索并安装「Chinese (Simplified) Language Pack」' };
  }

  const installed = fs.readdirSync(extDir).some((name) => name.toLowerCase().includes('language-pack-zh-hans'));
  if (installed) {
    return { installed: true, hint: '中文语言包已安装' };
  }

  try {
    execSync(
      'cursor --install-extension MS-CEINTL.VSCODE-LANGUAGE-PACK-ZH-HANS',
      { stdio: 'pipe', timeout: 60000 }
    );
    return { installed: true, hint: '已通过 CLI 安装中文语言包' };
  } catch {
    return {
      installed: false,
      hint: '请手动在 Cursor 扩展市场搜索「Chinese (Simplified) Language Pack」并安装',
    };
  }
}

function configureLocale() {
  const results = [];

  const langPack = ensureLanguagePackInstalled();
  results.push(langPack);

  const localePath = configureDisplayLanguage();
  results.push({ localePath, locale: 'zh-cn' });

  const settings = readJsonSafe(SETTINGS_PATH);
  if (!settings['locale']) {
    settings['locale'] = 'zh-cn';
    writeJson(SETTINGS_PATH, settings);
    results.push({ settingsUpdated: true });
  } else {
    results.push({ settingsUpdated: false, existingLocale: settings['locale'] });
  }

  return results;
}

module.exports = {
  CURSOR_USER_DIR,
  LOCALE_PATH,
  LANG_PACK_ID,
  configureLocale,
  configureDisplayLanguage,
  ensureLanguagePackInstalled,
};
