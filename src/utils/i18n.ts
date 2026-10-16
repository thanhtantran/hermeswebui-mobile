import { Language } from '../types';

export const translations = {
  en: {
    appTitle: 'HERMES CONSOLE',
    appSubtitle: 'Terminal multi-server management & status monitor',
    serverCount: 'SERVERS',
    serversSingular: 'SERVER',
    language: 'LANGUAGE',
    backup: 'BACKUP',
    addServer: 'ADD SERVER',
    searchPlaceholder: 'Search host or instance name... [ / ]',
    pingAll: 'PING ALL',
    pinging: 'PINGING...',
    lastChecked: 'Last sweep',
    justNow: 'just now',
    secondsAgo: 's ago',
    minutesAgo: 'm ago',
    never: 'never',
    online: 'ONLINE',
    offline: 'OFFLINE',
    pending: 'PENDING',
    checking: 'PROBING',
    latency: 'LATENCY',
    connect: 'CONNECT',
    edit: 'EDIT',
    delete: 'DELETE',
    credentialsSaved: 'CREDENTIALS SAVED',
    noCredentials: 'NO CREDENTIALS',
    deleteConfirm: 'Delete server record?',
    confirmYes: 'YES, DELETE',
    confirmCancel: 'CANCEL',
    restoreDemo: 'RESTORE ORANGEPI DEMO',
    noServersTitle: 'NO SERVERS REGISTERED',
    noServersDesc: 'No Hermes WebUI hosts configured in this terminal. Add an endpoint or restore the official demo.',
    noSearchMatch: 'No servers match query',
    addFirstServer: 'INITIALIZE FIRST SERVER',
    // Modal
    modalAddTitle: 'ADD HERMES HOST',
    modalEditTitle: 'EDIT HERMES HOST',
    serverNameLabel: 'INSTANCE IDENTIFIER / NAME',
    serverNamePlaceholder: 'e.g. OrangePi Lab, Home Server',
    serverUrlLabel: 'ENDPOINT URL',
    serverUrlPlaceholder: 'https://hermes.orangepi.vn',
    urlNote: 'Requires standard HTTP or HTTPS protocol scheme',
    saveCredsLabel: 'STORE INSTANCE PASSWORD FOR AUTO-LOGIN',
    saveCredsDesc: 'Hermes WebUI requires only password authentication (no username).',
    passwordLabel: 'INSTANCE PASSWORD',
    passwordPlaceholder: 'Enter Hermes password',
    fillDemoBtn: 'USE DEMO PARAMETERS',
    btnCancel: 'CANCEL',
    btnSave: 'COMMIT CHANGES',
    btnAdd: 'REGISTER SERVER',
    // Backup Modal
    backupTitle: 'DATABASE BACKUP & MIGRATION',
    exportTab: 'EXPORT JSON',
    importTab: 'IMPORT JSON',
    exportDesc: 'Copy or download the active Hermes server registry JSON payload:',
    importDesc: 'Paste an exported JSON payload to restore or merge server endpoints:',
    copyJson: 'COPY PAYLOAD',
    copied: 'COPIED TO CLIPBOARD',
    downloadJson: 'DOWNLOAD .JSON',
    importBtn: 'INGEST PAYLOAD',
    // WebView / Session
    backToConsole: 'CONSOLE',
    copyPass: 'COPY PASS',
    copiedShort: 'COPIED',
    autoLoginReady: 'CREDENTIAL READY',
    noCredsSession: 'NO STORED PASSWORD',
    launchDirect: 'OPEN IN NEW TAB',
    reloading: 'RELOADING...',
    loadingFrame: 'INITIALIZING HERMES SESSION...',
    securityNoticeTitle: 'EMBEDDED BROWSER SECURITY NOTICE',
    securityNoticeDesc: 'If this frame remains blank or connection refused, this Hermes host enforces strict X-Frame-Options or CSP frame-ancestors.',
    openTabBtn: 'OPEN HERMES DIRECTLY',
    // About guide
    guideTitle: 'SYSTEM ARCHITECTURE & CREDENTIAL SECURITY',
    guideDesc: 'Hermes instances authenticate using single-tier password protection. All endpoints, credentials, and telemetry records are stored in browser localStorage.',
    demoHost: 'Official Host:',
    demoPass: 'Demo Password:',
  },
  vi: {
    appTitle: 'BẢNG ĐIỀU KHIỂN HERMES',
    appSubtitle: 'Quản trị đa máy chủ & giám sát trạng thái Hermes WebUI',
    serverCount: 'MÁY CHỦ',
    serversSingular: 'MÁY CHỦ',
    language: 'NGÔN NGỮ',
    backup: 'SAO LƯU',
    addServer: 'THÊM MÁY CHỦ',
    searchPlaceholder: 'Tìm kiếm tên máy chủ hoặc URL... [ / ]',
    pingAll: 'KIỂM TRA TẤT CẢ',
    pinging: 'ĐANG KIỂM TRA...',
    lastChecked: 'Kiểm tra gần nhất',
    justNow: 'vừa xong',
    secondsAgo: 'giây trước',
    minutesAgo: 'phút trước',
    never: 'chưa kiểm tra',
    online: 'TRỰC TUYẾN',
    offline: 'NGOẠI TUYẾN',
    pending: 'CHỜ KIỂM TRA',
    checking: 'ĐANG QUÉT',
    latency: 'ĐỘ TRỄ',
    connect: 'KẾT NỐI',
    edit: 'SỬA',
    delete: 'XÓA',
    credentialsSaved: 'ĐÃ LƯU MẬT KHẨU',
    noCredentials: 'CHƯA LƯU MẬT KHẨU',
    deleteConfirm: 'Xác nhận xóa máy chủ này?',
    confirmYes: 'XÓA NGAY',
    confirmCancel: 'HỦY',
    restoreDemo: 'KHÔI PHỤC MẪU ORANGEPI',
    noServersTitle: 'CHƯA CÓ MÁY CHỦ NÀO',
    noServersDesc: 'Chưa có máy chủ Hermes WebUI nào được thiết lập. Hãy thêm máy chủ mới hoặc dùng máy chủ thử nghiệm.',
    noSearchMatch: 'Không tìm thấy máy chủ phù hợp với từ khóa',
    addFirstServer: 'THÊM MÁY CHỦ ĐẦU TIÊN',
    // Modal
    modalAddTitle: 'THÊM MÁY CHỦ HERMES',
    modalEditTitle: 'CHỈNH SỬA MÁY CHỦ',
    serverNameLabel: 'TÊN ĐỊNH DANH MÁY CHỦ',
    serverNamePlaceholder: 'Ví dụ: OrangePi Lab, Máy chủ nhà',
    serverUrlLabel: 'ĐỊA CHỈ URL MÁY CHỦ',
    serverUrlPlaceholder: 'https://hermes.orangepi.vn',
    urlNote: 'Cần bao gồm giao thức chuẩn http:// hoặc https://',
    saveCredsLabel: 'LƯU MẬT KHẨU ĐỂ TỰ ĐỘNG ĐĂNG NHẬP',
    saveCredsDesc: 'Hermes WebUI sử dụng phương thức đăng nhập chỉ với mật khẩu (không cần tên đăng nhập).',
    passwordLabel: 'MẬT KHẨU TRUY CẬP',
    passwordPlaceholder: 'Nhập mật khẩu Hermes',
    fillDemoBtn: 'ĐIỀN THÔNG SỐ DEMO',
    btnCancel: 'HỦY BỎ',
    btnSave: 'LƯU THAY ĐỔI',
    btnAdd: 'LƯU MÁY CHỦ',
    // Backup Modal
    backupTitle: 'SAO LƯU & DI CHUYỂN DỮ LIỆU',
    exportTab: 'XUẤT DỮ LIỆU (JSON)',
    importTab: 'NHẬP DỮ LIỆU (JSON)',
    exportDesc: 'Sao chép hoặc tải về cấu hình các máy chủ Hermes dưới dạng tệp JSON:',
    importDesc: 'Dán đoạn mã JSON để khôi phục hoặc kết hợp danh sách máy chủ:',
    copyJson: 'SAO CHÉP DỮ LIỆU',
    copied: 'ĐÃ SAO CHÉP',
    downloadJson: 'TẢI TỆP .JSON',
    importBtn: 'TIẾP NHẬN DỮ LIỆU',
    // WebView / Session
    backToConsole: 'BẢNG ĐIỀU KHIỂN',
    copyPass: 'CHÉP PASS',
    copiedShort: 'ĐÃ CHÉP',
    autoLoginReady: 'SẴN SÀNG MẬT KHẨU',
    noCredsSession: 'CHƯA LƯU MẬT KHẨU',
    launchDirect: 'MỞ TRONG TAB MỚI',
    reloading: 'ĐANG TẢI LẠI...',
    loadingFrame: 'ĐANG KHỞI TẠO PHIÊN HERMES...',
    securityNoticeTitle: 'LƯU Ý BẢO MẬT TRÌNH DUYỆT EMBED',
    securityNoticeDesc: 'Nếu màn hình không hiển thị hoặc bị từ chối kết nối, máy chủ này có thể đang kích hoạt chính sách bảo vệ X-Frame-Options.',
    openTabBtn: 'MỞ HERMES TRỰC TIẾP TRÊN TRÌNH DUYỆT',
    // About guide
    guideTitle: 'KIẾN TRÚC HỆ THỐNG & BẢO MẬT',
    guideDesc: 'Hermes sử dụng cơ chế đăng nhập bằng mật khẩu trực tiếp. Tất cả cấu hình máy chủ và mật khẩu được mã hóa lưu trữ an toàn trong localStorage của bạn.',
    demoHost: 'Máy chủ thử nghiệm:',
    demoPass: 'Mật khẩu mặc định:',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const LANG_STORAGE_KEY = 'hermes_language';

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'vi' || saved === 'en') {
      return saved;
    }
    // Default to 'en' or browser language detection
    if (navigator.language && navigator.language.startsWith('vi')) {
      return 'vi';
    }
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // silent fallback
  }
}
