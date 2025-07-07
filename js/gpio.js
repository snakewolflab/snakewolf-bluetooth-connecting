import { writeCharacteristic, uartTxCharacteristic, isDeviceConnected } from './lib/ble-utils.js';

export function initGpioSection() {
    const gpioSection = document.getElementById('gpioSection');

    // GPIO制御の例 (トグルボタン)
    // Bluefruitモジュール側でGPIOの状態を制御するカスタムサービス/特性が必要です。
    // 例: Digital Pin 2を制御するボタン
    const gpioControlDiv = document.createElement('div');
    gpioControlDiv.innerHTML = `
        <h3>デジタルピン2</h3>
        <button id="gpio2Toggle">トグル (現在の状態: OFF)</button>
    `;
    gpioSection.appendChild(gpioControlDiv);

    const gpio2ToggleButton = document.getElementById('gpio2Toggle');
    let gpio2State = false; // false = OFF, true = ON

    gpio2ToggleButton.addEventListener('click', async () => {
        if (!isDeviceConnected()) {
            alert('デバイスが接続されていません。');
            return;
        }

        gpio2State = !gpio2State;
        gpio2ToggleButton.textContent = `トグル (現在の状態: ${gpio2State ? 'ON' : 'OFF'})`;

        // BluefruitモジュールにGPIOの状態を送信
        // 例: UART経由で "GPIO2_ON" または "GPIO2_OFF" というコマンドを送信
        const command = gpio2State ? 'GPIO2_ON\n' : 'GPIO2_OFF\n';
        const encoder = new TextEncoder('utf-8');
        const data = encoder.encode(command);

        try {
            await writeCharacteristic(uartTxCharacteristic, data);
            console.log('GPIO command sent via UART:', command.trim());
        } catch (error) {
            console.error('Failed to control GPIO:', error);
            alert('GPIO制御に失敗しました。');
            gpio2State = !gpio2State; // 状態を元に戻す
            gpio2ToggleButton.textContent = `トグル (現在の状態: ${gpio2State ? 'ON' : 'OFF'})`;
        }
    });
}