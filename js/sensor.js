import { sensorDataCharacteristic } from './lib/ble-utils.js';

const sensorDataDiv = document.getElementById('sensorData');

export function initSensorSection() {
    // センサー表示用の初期UI設定などがあればここに記述
}

export function handleSensorNotifications(event) {
    const value = event.target.value;
    // ここでセンサーデータの解析と表示を行います。
    // 例として、バイトデータをそのまま表示
    let hexString = '';
    for (let i = 0; i < value.byteLength; i++) {
        hexString += '0x' + value.getUint8(i).toString(16).padStart(2, '0') + ' ';
    }
    sensorDataDiv.textContent = `受信データ (HEX): ${hexString.trim()}`;

    // 実際のセンサーデータに応じて解析例:
    // 例えば、加速度計 (X, Y, Z) のような3軸データの場合:
    // if (value.byteLength >= 6) { // 各軸2バイト (Int16) の場合
    //     const accX = value.getInt16(0, true); // trueはリトルエンディアン
    //     const accY = value.getInt16(2, true);
    //     const accZ = value.getInt16(4, true);
    //     sensorDataDiv.textContent = `加速度計: X=${accX}, Y=${accY}, Z=${accZ}`;
    // }
}