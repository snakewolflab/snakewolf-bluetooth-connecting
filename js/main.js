import { 
    UART_SERVICE_UUID, CUSTOM_SERVICE_UUID, SENSOR_DATA_CHARACTERISTIC_UUID,
    setConnectedDevice, setUartCharacteristics, setSensorCharacteristic,
    uartTxCharacteristic, uartRxCharacteristic, sensorDataCharacteristic, isDeviceConnected
} from './lib/ble-utils.js';
import { initUartSection, handleUartNotifications, sendUartData } from './uart.js';
import { initGpioSection } from './gpio.js';
import { initPwmSection } from './pwm.js';
import { initSensorSection, handleSensorNotifications } from './sensor.js';
import { initJoystickSection, sendJoystickData } from './joystick.js';

const connectButton = document.getElementById('connectButton');
const statusDiv = document.getElementById('status');

// 各セクションのDOM要素
const uartSection = document.getElementById('uartSection');
const gpioSection = document.getElementById('gpioSection');
const pwmSection = document.getElementById('pwmSection');
const sensorSection = document.getElementById('sensorSection');
const joystickSection = document.getElementById('joystickSection');

// ページロード時に各セクションのUIを初期化
document.addEventListener('DOMContentLoaded', () => {
    initUartSection();
    initGpioSection();
    initPwmSection();
    initSensorSection();
    initJoystickSection();

    // 初期状態では各セクションを非表示
    uartSection.classList.add('hidden');
    gpioSection.classList.add('hidden');
    pwmSection.classList.add('hidden');
    sensorSection.classList.add('hidden');
    joystickSection.classList.add('hidden');
});


// 接続ボタンのイベントリスナー
connectButton.addEventListener('click', async () => {
    try {
        statusDiv.textContent = 'デバイスを検索中...';
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [UART_SERVICE_UUID] }], // UARTサービスを持つデバイスをフィルタ
            optionalServices: [CUSTOM_SERVICE_UUID] // 必要に応じて他のカスタムサービスも追加
        });

        setConnectedDevice(device); // 接続されたデバイスをセット

        statusDiv.textContent = '接続中...';
        const server = await device.gatt.connect();
        statusDiv.textContent = '接続済み';
        console.log('Connected to device:', device.name);

        // 接続が切断されたときのイベントリスナー
        device.addEventListener('gattserverdisconnected', onDisconnected);

        // UARTサービスにアクセス
        const uartService = await server.getPrimaryService(UART_SERVICE_UUID);
        const txChar = await uartService.getCharacteristic(UART_RX_CHARACTERISTIC_UUID); // 送信
        const rxChar = await uartService.getCharacteristic(UART_TX_CHARACTERISTIC_UUID); // 受信
        setUartCharacteristics(txChar, rxChar);

        // UART受信の通知を有効にする
        await uartRxCharacteristic.startNotifications();
        uartRxCharacteristic.addEventListener('characteristicvaluechanged', handleUartNotifications);
        console.log('UART notifications started.');

        // センサーサービスにアクセス (もしあれば)
        try {
            const customService = await server.getPrimaryService(CUSTOM_SERVICE_UUID);
            const sensorChar = await customService.getCharacteristic(SENSOR_DATA_CHARACTERISTIC_UUID);
            setSensorCharacteristic(sensorChar);
            await sensorDataCharacteristic.startNotifications();
            sensorDataCharacteristic.addEventListener('characteristicvaluechanged', handleSensorNotifications);
            console.log('Sensor notifications started.');
            sensorSection.classList.remove('hidden'); // センサーセクションを表示
        } catch (error) {
            console.warn('Custom service or sensor characteristic not found:', error);
            sensorSection.classList.add('hidden'); // センサーセクションを非表示にする
        }

        // 各セクションを表示
        uartSection.classList.remove('hidden');
        gpioSection.classList.remove('hidden');
        pwmSection.classList.remove('hidden');
        joystickSection.classList.remove('hidden');

    } catch (error) {
        statusDiv.textContent = `接続エラー: ${error.message}`;
        console.error('Bluetooth connection error:', error);
        // エラー時は各セクションを非表示にする
        uartSection.classList.add('hidden');
        gpioSection.classList.add('hidden');
        pwmSection.classList.add('hidden');
        sensorSection.classList.add('hidden');
        joystickSection.classList.add('hidden');
    }
});

// デバイス切断時の処理
function onDisconnected() {
    statusDiv.textContent = '切断されました';
    console.log('Device disconnected.');
    uartSection.classList.add('hidden');
    gpioSection.classList.add('hidden');
    pwmSection.classList.add('hidden');
    sensorSection.classList.add('hidden');
    joystickSection.classList.add('hidden');

    // 接続状態をリセット
    setConnectedDevice(null);
    setUartCharacteristics(null, null);
    setSensorCharacteristic(null);
}