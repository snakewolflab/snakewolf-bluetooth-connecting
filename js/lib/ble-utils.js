// Adafruit Bluefruit LE UART ServiceのUUID
export const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
export const UART_RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Write (送信)
export const UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // Notify (受信)

// GPIO, PWM, センサーなどのUUIDは、Bluefruitモジュールの実装によって異なります。
// ここでは仮のUUIDを置いておきますが、実際にはAdafruitのライブラリやファームウェアのコードを確認して正確なものを設定してください。
export const CUSTOM_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0'; // カスタムサービス（GPIO, PWM, センサーなど）
export const GPIO_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1'; // GPIO制御用
export const PWM_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef2'; // PWM制御用
export const SENSOR_DATA_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef3'; // センサーデータ用

// 共通で利用する変数（グローバル変数的に扱うもの）
export let connectedDevice = null;
export let uartTxCharacteristic = null; // 送信用 (RX on Peripheral)
export let uartRxCharacteristic = null; // 受信用 (TX on Peripheral)
export let sensorDataCharacteristic = null; // センサーデータ用

// BLE characteristicへの書き込み関数
export async function writeCharacteristic(characteristic, data) {
    if (!characteristic) {
        console.error('Characteristic is not defined for writing.');
        throw new Error('Characteristic not found.');
    }
    await characteristic.writeValue(data);
}

// 接続されたデバイスや特性をセットする関数
export function setConnectedDevice(device) {
    connectedDevice = device;
}

export function setUartCharacteristics(txChar, rxChar) {
    uartTxCharacteristic = txChar;
    uartRxCharacteristic = rxChar;
}

export function setSensorCharacteristic(char) {
    sensorDataCharacteristic = char;
}

// 接続状態をチェックするユーティリティ関数
export function isDeviceConnected() {
    return connectedDevice && connectedDevice.gatt.connected;
}