const http = require('http');
const fs = require('fs');
const path = require('path');

// process.env.PORT මඟින් Hosting සර්වර් එකේ Port එක කෙලින්ම ලබාගනියි (Render සඳහා අත්‍යවශ්‍යයි)
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'jobs.json');

// Database එකක් වෙනුවට jobs සේව් කරන්න json ෆයිල් එකක් හදාගැනීම
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const server = http.createServer((req, res) => {
    // 1. මුල් පිටුව (HTML) ලෝඩ් කිරීම
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    // 2. CSS ෆයිල් එක ලෝඩ් කිරීම
    else if (req.method === 'GET' && req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'style.css'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    // 3. දැනට සේව් වෙලා තියෙන Jobs ලිස්ට් එක ලබාගැනීම (API)
    else if (req.method === 'GET' && req.url === '/api/jobs') {
        fs.readFile(DATA_FILE, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    // 4. අලුත් Job එකක් සේව් කිරීම (API)
    else if (req.method === 'POST' && req.url === '/api/jobs') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const newJob = JSON.parse(body);
            fs.readFile(DATA_FILE, (err, data) => {
                const jobs = JSON.parse(data);
                jobs.unshift(newJob); // අලුත් එක උඩටම දානවා
                fs.writeFile(DATA_FILE, JSON.stringify(jobs, null, 2), () => {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Success' }));
                });
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server එක සුපිරියටම වැඩ! URL එක: http://localhost:${PORT}`);
});