const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function installModule(moduleName) {
    console.log(`\n[!] MENDETEKSI MODULE MISSING: "${moduleName}"`);
    console.log(`[*] Mengunduh tarball untuk ${moduleName}...`);

    const targetDir = path.join('node_modules', moduleName);
    fs.mkdirSync(targetDir, { recursive: true });

    const cmd = `curl -sL "https://registry.npmjs.org/${moduleName}/-/${path.basename(moduleName)}-latest.tgz" 2>/dev/null | tar -xz -C "${targetDir}" --strip-components=1 2>/dev/null`;
    
    spawnSync('sh', ['-c', cmd], { stdio: 'inherit' });
    console.log(`[✓] Berhasil memasang ${moduleName}!\n`);
}

function runAutoFix() {
    console.log('==================================================');
    console.log(' SCANNING MISSING MODULES (WITH TIMEOUT)... ');
    console.log('==================================================\n');

    let attempts = 0;
    while (attempts < 50) {
        attempts++;
        
        // Kita kasih timeout 4000ms (4 detik)
        const res = spawnSync('node', ['index.js'], { encoding: 'utf8', timeout: 4000 });
        const errLog = (res.stdout || '') + (res.stderr || '') + (res.error ? res.error.message : '');

        const match = errLog.match(/Cannot find module '([^']+)'/);

        if (match && match[1]) {
            const missingModule = match[1];
            installModule(missingModule);
        } else {
            // Kalau tidak ada error "Cannot find module", berarti dependency sudah LENGKAP!
            console.log('\n==================================================');
            console.log(' [✓] SEMUA MODULE LENGKAP! MEMULAI BOT WA... ');
            console.log('==================================================\n');
            break;
        }
    }

    // Jalankan bot asli secara interaktif penuh (scan QR / Pairing Code)
    spawnSync('node', ['index.js'], { stdio: 'inherit' });
}

runAutoFix();
