import { writeCharacteristic, uartTxCharacteristic, isDeviceConnected } from './lib/ble-utils.js';

const joystickCanvas = document.getElementById('joystickCanvas');
const joystickOutput = document.getElementById('joystickOutput');
const ctx = joystickCanvas.getContext('2d');

let joystickX = 0;
let joystickY = 0;
let isDragging = false;

export function initJoystickSection() {
    drawJoystick();

    joystickCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateJoystickPosition(e);
    });

    joystickCanvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateJoystickPosition(e);
        }
    });

    joystickCanvas.addEventListener('mouseup', () => {
        isDragging = false;
        joystickX = 0;
        joystickY = 0;
        drawJoystick();
        sendJoystickData(joystickX, joystickY); // 離したときに中央値を送信
    });

    joystickCanvas.addEventListener('mouseleave', () => {
        if (isDragging) { // キャンバス外に出た場合もリセット
            isDragging = false;
            joystickX = 0;
            joystickY = 0;
            drawJoystick();
            sendJoystickData(joystickX, joystickY);
        }
    });
}


function drawJoystick() {
    ctx.clearRect(0, 0, joystickCanvas.width, joystickCanvas.height);
    ctx.beginPath();
    ctx.arc(joystickCanvas.width / 2, joystickCanvas.height / 2, 80, 0, Math.PI * 2);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(joystickX + joystickCanvas.width / 2, joystickY + joystickCanvas.height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#007bff';
    ctx.fill();
}

function updateJoystickPosition(e) {
    const rect = joystickCanvas.getBoundingClientRect();
    const centerX = joystickCanvas.width / 2;
    const centerY = joystickCanvas.height / 2;
    let x = e.clientX - rect.left - centerX;
    let y = e.clientY - rect.top - centerY;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 80; // 外円の半径

    if (distance > maxDistance) {
        const angle = Math.atan2(y, x);
        x = maxDistance * Math.cos(angle);
        y = maxDistance * Math.sin(angle);
    }

    joystickX = x;
    joystickY = y;
    drawJoystick();
    joystickOutput.textContent = `X: ${Math.round(joystickX)}, Y: ${Math.round(joystickY)}`;
    sendJoystickData(joystickX, joystickY);
}

export async function sendJoystickData(x, y) {
    if (!isDeviceConnected()) {
        // console.warn('デバイスが接続されていません。ジョイスティックデータを送信できません。');
        return;
    }

    // 例: UART経由でテキストとして送信する場合
    const textData = `J ${Math.round(x)},${Math.round(y)}\n`;
    const encoder = new TextEncoder('utf-8');
    const data = encoder.encode(textData);

    try {
        await writeCharacteristic(uartTxCharacteristic, data);
        // console.log('Joystick data sent via UART:', textData.trim());
    } catch (error) {
        console.error('Failed to send joystick data:', error);
    }
}