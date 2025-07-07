import { writeCharacteristic, uartTxCharacteristic } from './lib/ble-utils.js';

const uartReceive = document.getElementById('uartReceive');
const uartSendInput = document.getElementById('uartSendInput');
const uartSendButton = document.getElementById('uartSendButton');

export function initUartSection() {
    // UI要素へのイベントリスナー設定
    uartSendButton.addEventListener('click', sendUartData);
}

export function handleUartNotifications(event) {
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const receivedString = decoder.decode(value);
    uartReceive.value += receivedString;
    uartReceive.scrollTop = uartReceive.scrollHeight; // スクロールを一番下へ
}

export async function sendUartData() {
    if (!uartTxCharacteristic) {
        alert('デバイスが接続されていません。');
        return;
    }
    const text = uartSendInput.value + '\n'; // 改行を追加
    const encoder = new TextEncoder('utf-8');
    const data = encoder.encode(text);
    try {
        await writeCharacteristic(uartTxCharacteristic, data);
        console.log('Sent (UART):', text.trim());
        uartSendInput.value = ''; // 送信後に入力欄をクリア
    } catch (error) {
        console.error('UART send error:', error);
        alert('送信に失敗しました。');
    }
}