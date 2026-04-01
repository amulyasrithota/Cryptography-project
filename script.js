function show(type) {
    let html = "";

    if (type === "vigenere") {
        html = `
        <h3>Vigenère Cipher</h3>
        <input id="text" placeholder="Enter Text"><br>
        <input id="key" placeholder="Enter Key (alphabets only)"><br>
        <button class="action" onclick="vigenereEncrypt()">Encrypt</button>
        <button class="action" onclick="vigenereDecrypt()">Decrypt</button>
        <p id="output"></p>
        `;
    }

    else if (type === "rail") {
        html = `
        <h3>Rail Fence Cipher</h3>
        <input id="text" placeholder="Enter Text"><br>
        <input id="key" placeholder="Enter Rails (number)"><br>
        <button class="action" onclick="railEncrypt()">Encrypt</button>
        <button class="action" onclick="railDecrypt()">Decrypt</button>
        <p id="output"></p>
        `;
    }

    else if (type === "rsa") {
        html = `
        <h3>RSA Algorithm</h3>
        <input id="p" placeholder="Enter prime p"><br>
        <input id="q" placeholder="Enter prime q"><br>
        <input id="e" placeholder="Enter e (optional)"><br>
        <input id="msg" placeholder="Enter message"><br>
        <button class="action" onclick="rsaProcess()">Run RSA</button>
        <p id="output"></p>
        `;
    }

    document.getElementById("content").innerHTML = html;
}

// 🔐 Vigenere
function isAlphabet(str) {
    return /^[A-Za-z]+$/.test(str);
}

function vigenereEncrypt() {
    let text = document.getElementById("text").value;
    let key = document.getElementById("key").value;

    if (!isAlphabet(text) || !isAlphabet(key)) {
        alert("Only alphabets allowed!");
        return;
    }

    text = text.toUpperCase();
    key = key.toUpperCase();

    let result = "";

    for (let i = 0; i < text.length; i++) {
        let t = text.charCodeAt(i) - 65;
        let k = key.charCodeAt(i % key.length) - 65;
        result += String.fromCharCode((t + k) % 26 + 65);
    }

    document.getElementById("output").innerText = result;
}

function vigenereDecrypt() {
    let text = document.getElementById("text").value;
    let key = document.getElementById("key").value;

    if (!isAlphabet(text) || !isAlphabet(key)) {
        alert("Only alphabets allowed!");
        return;
    }

    text = text.toUpperCase();
    key = key.toUpperCase();

    let result = "";

    for (let i = 0; i < text.length; i++) {
        let t = text.charCodeAt(i) - 65;
        let k = key.charCodeAt(i % key.length) - 65;
        result += String.fromCharCode((t - k + 26) % 26 + 65);
    }

    document.getElementById("output").innerText = result;
}

// 🚆 Rail Fence
function railEncrypt() {
    let text = document.getElementById("text").value;
    let key = parseInt(document.getElementById("key").value);

    if (isNaN(key) || key < 2) {
        alert("Enter valid rails >= 2");
        return;
    }

    let rail = Array.from({ length: key }, () => Array(text.length).fill('\n'));

    let dirDown = false, row = 0, col = 0;

    for (let i = 0; i < text.length; i++) {
        if (row === 0 || row === key - 1) dirDown = !dirDown;

        rail[row][col++] = text[i];
        row += dirDown ? 1 : -1;
    }

    let result = "";
    for (let i = 0; i < key; i++)
        for (let j = 0; j < text.length; j++)
            if (rail[i][j] !== '\n') result += rail[i][j];

    document.getElementById("output").innerText = result;
}

function railDecrypt() {
    let text = document.getElementById("text").value;
    let key = parseInt(document.getElementById("key").value);

    if (isNaN(key) || key < 2) {
        alert("Enter valid rails >= 2");
        return;
    }

    let rail = Array.from({ length: key }, () => Array(text.length).fill('\n'));

    let dirDown, row = 0, col = 0;

    for (let i = 0; i < text.length; i++) {
        if (row === 0) dirDown = true;
        if (row === key - 1) dirDown = false;

        rail[row][col++] = '*';
        row += dirDown ? 1 : -1;
    }

    let index = 0;
    for (let i = 0; i < key; i++)
        for (let j = 0; j < text.length; j++)
            if (rail[i][j] === '*' && index < text.length)
                rail[i][j] = text[index++];

    let result = "";
    row = 0; col = 0;

    for (let i = 0; i < text.length; i++) {
        if (row === 0) dirDown = true;
        if (row === key - 1) dirDown = false;

        result += rail[row][col++];
        row += dirDown ? 1 : -1;
    }

    document.getElementById("output").innerText = result;
}

// 🔐 RSA

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0)
            return false;
    }
    return true;
}

function gcd(a, b) {
    while (b != 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function generateE(phi) {
    for (let i = 2; i < phi; i++) {
        if (gcd(i, phi) === 1) return i;
    }
}

function modInverse(e, phi) {
    for (let d = 1; d < phi; d++) {
        if ((e * d) % phi === 1) return d;
    }
}

function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;

    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function rsaProcess() {
    let p = parseInt(document.getElementById("p").value);
    let q = parseInt(document.getElementById("q").value);
    let eInput = document.getElementById("e").value;
    let msg = parseInt(document.getElementById("msg").value);

    if (isNaN(p) || isNaN(q) || isNaN(msg)) {
        alert("Enter valid numbers!");
        return;
    }

    // ✅ Prime validation
    if (!isPrime(p) || !isPrime(q)) {
        alert("p and q must be prime numbers!");
        return;
    }

    let n = p * q;
    let phi = (p - 1) * (q - 1);

    let e = eInput ? parseInt(eInput) : generateE(phi);

    if (gcd(e, phi) !== 1) {
        alert("e must be coprime with φ(n)");
        return;
    }

    let d = modInverse(e, phi);

    let cipher = modPow(msg, e, n);
    let decrypted = modPow(cipher, d, n);

    document.getElementById("output").innerHTML =
        `n = ${n}<br>
         φ(n) = ${phi}<br>
         e = ${e}<br>
         d = ${d}<br><br>
         Cipher = ${cipher}<br>
         Decrypted = ${decrypted}`;
}
