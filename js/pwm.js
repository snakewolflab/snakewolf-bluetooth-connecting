import { writeCharacteristic, uartTxCharacteristic, isDeviceConnected } from './lib/ble-utils.js';

export function initPwmSection() {
    const pwmSection = document.getElementById('pwmSection');

    // PWM制御の例 (スライダー)
    // Bluefruitモジュール側でPWMのデューティサイクルを制御するカスタムサービス/特性が必要です。
    // 例: PWMピン3を制御するスライダー
    const pwmControlDiv = document.createElement('div');
    pwmControlDiv.innerHTML = `
        <h3>PWMピン3</h3>
        <input type="range" id="pwm3Slider" min="0" max="255" value="0">
        <span id="pwm3Value">0</span>
    `;
    pwmSection.appendChild(pwmControlDiv);

    const pwm3Slider = document.getElementById('pwm3Slider');
    const pwm3ValueSpan = document.getElementById('pwm3Value');

    pwm3Slider.addEventListener('input', async () => {
        const pwmValue = parseInt(pwm3Slider.value);
        pwm3ValueSpan.textContent = pwmValue;

        if (!isDeviceConnected()) {
            // alert('デバイスが接続されていません。'); // スライダー操作中にアラートは邪魔なのでコメントアウト
            return;
        }

        // BluefruitモジュールにPWM値を送信
        // 例: UART経由で "PWM3_VALUE:128" のようなコマンドを送信
        const command = `PWM3_VALUE:${pwmValue}\n`;
        const encoder = new TextEncoder('utf-8');
        const data = encoder.encode(command);

        try {
            await writeCharacteristic(uartTxCharacteristic, data);
            // console.log('PWM command sent via UART:', command.trim());
        } catch (error) {
            console.error('Failed to control PWM:', error);
            // alert('PWM制御に失敗しました。'); // スライダー操作中にアラートは邪魔なのでコメントアウト
        }
    });
}