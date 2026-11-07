const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_bot');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
        const phoneNumber = await question('\n[?] Masukkan nomor WhatsApp-mu (pake format 628xxx): ');
        const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        setTimeout(async () => {
            const code = await sock.requestPairingCode(cleanedNumber);
            console.log(`\n========================================`);
            console.log(` KODE PAIRING WHATSAPP KAMU: ${code}`);
            console.log(`========================================\n`);
            console.log('[-] Buka WA di HP -> Perangkat Tertaut -> Tautkan dengan Kode');
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('\n[✓] BERHASIL TERHUBUNG DENGAN WHATSAPP!\n');
            process.exit(0);
        }
    });
}

startBot();
