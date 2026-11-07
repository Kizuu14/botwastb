const http = require('http');
const os = require('os');

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    const freeMem = (os.freemem() / (1024 * 1024)).toFixed(2);
    const totalMem = (os.totalmem() / (1024 * 1024)).toFixed(2);
    const uptime = (os.uptime() / 3600).toFixed(2);

    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>STB Mini Map Dashboard</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="refresh" content="5">
            <style>
                body { font-family: monospace; background: #121212; color: #00ff66; padding: 20px; }
                .card { background: #1e1e1e; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #333; }
                h2 { margin-top: 0; color: #fff; font-size: 1.2rem; }
            </style>
        </head>
        <body>
            <h2>ðŸ¤– STB WhatsApp Bot Status</h2>
            <div class="card">
                <p><b>Status Bot:</b> <span style="color: #00ff66;">â— RUNNING</span></p>
                <p><b>Free RAM:</b> ${freeMem} MB / ${totalMem} MB</p>
                <p><b>Uptime STB:</b> ${uptime} Jam</p>
                <p><b>Waktu Server:</b> ${new Date().toLocaleTimeString()}</p>
            </div>
            <p style="font-size: 0.8rem; color: #777;">Halaman otomatis refresh tiap 5 detik.</p>
        </body>
        </html>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Dashboard aktif! Buka di HP: http://192.168.100.60:${PORT}`);
});
