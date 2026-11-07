const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function start() {
    console.log('[-] MEMULAI KONEKSI WA & MEMBUAT QR CODE...');
    const { state, saveCreds } = await useMultiFileAuthState('session_test');
    
    const socket = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    });

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log('\n========================================');
            console.log(' SUCCESS! SCAN QR DI BAWAH INI:');
            console.log('========================================\n');
        }
        if (connection === 'open') {
            console.log('\n[✓] BERHASIL LOGGED IN KE WHATSAPP!\n');
            process.exit(0);
        }
    });
}

start();
