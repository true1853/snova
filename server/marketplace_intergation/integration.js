// integration.js

// Импортируем подключение к базе данных
const pool = require('./db');
// Импортируем функцию из server.js
const { startServer } = require('./server');
const axios = require('axios');

/**
 * Клиент для работы с Ozon Seller API.
 */
class OzonSellerApiClient {
    /**
     * @param {string} clientId - Client-Id из личного кабинета Ozon.
     * @param {string} apiKey - API Key из личного кабинета Ozon.
     * @param {string} baseUrl - Базовый URL API (по умолчанию https://api-seller.ozon.ru).
     */
    constructor(clientId, apiKey, baseUrl = 'https://api-seller.ozon.ru') {
        this.clientId = clientId;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: 15000,
            headers: {
                'Client-Id': this.clientId,
                'Api-Key': this.apiKey,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Универсальный метод для отправки запроса к API.
     * @param {string} method - HTTP метод (GET, POST и т.д.).
     * @param {string} endpoint - Конечная точка API.
     * @param {Object} data - Тело запроса.
     * @param {Object} params - Параметры запроса.
     * @returns {Promise<Object>} - Ответ API.
     */
    async sendRequest(method, endpoint, data = {}, params = {}) {
        try {
            const response = await this.axiosInstance.request({
                method,
                url: endpoint,
                data,
                params
            });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при выполнении запроса ${method} ${endpoint}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /**
     * Обновление остатков товаров через метод POST /v2/products/stocks.
     * @param {Array<Object>} stocks - Массив объектов с полями: offer_id, stock, warehouse_id.
     * @returns {Promise<Object>} - Ответ API.
     */
    async updateStocks(stocks) {
        const endpoint = '/v2/products/stocks';
        const data = { stocks };
        return await this.sendRequest('POST', endpoint, data);
    }

    /**
     * Получение информации о товарах через метод POST /v2/product/info.
     * @param {Array<string>} offerIds - Массив идентификаторов товаров.
     * @returns {Promise<Object>} - Ответ API с информацией о товарах.
     */
    async getProducts(offerIds) {
        const endpoint = '/v2/product/info';
        const data = { offer_ids: offerIds };
        return await this.sendRequest('POST', endpoint, data);
    }
}

// Данные для Ozon API (используйте реальные учетные данные)
const clientId = "29172425-1716974992467@advertising.performance.ozon.ru";
const apiKey = "21682002-3dac-4be2-9fc4-c221e9bc0d48";

// Инициализируем клиента
const ozonClient = new OzonSellerApiClient(clientId, apiKey);

/**
 * Функция для обновления остатков товаров в Ozon.
 * Предполагается, что в таблице products есть поля:
 *   - offer_id: идентификатор товара,
 *   - stock: актуальное количество,
 *   - warehouse_id: идентификатор склада.
 */
async function updateProductStocks() {
    try {
        // Пример запроса к БД. Измените имя таблицы и поля в соответствии с вашей схемой.
        const res = await pool.query('SELECT offer_id, stock, warehouse_id FROM products');
        const products = res.rows;
        
        // Формируем массив данных для обновления остатков в Ozon.
        const stocks = products.map(product => ({
            offer_id: product.offer_id,
            stock: product.stock,
            warehouse_id: product.warehouse_id
        }));

        console.log("Отправляем следующие данные для обновления остатков:", stocks);
        const apiResponse = await ozonClient.updateStocks(stocks);
        console.log("Ответ Ozon API при обновлении остатков:");
        console.log(JSON.stringify(apiResponse, null, 4));
    } catch (error) {
        console.error("Ошибка при обновлении остатков:", error);
    } finally {
        // Завершаем соединение с БД
        pool.end();
    }
}

/**
 * Функция для получения информации о товарах из Ozon.
 * Передаём массив offer_id и выводим полученные данные.
 */
async function fetchProductsInfo() {
    // Пример: получаем информацию для товаров с указанными offer_id.
    const offerIds = ["test_product_1", "test_product_2"]; // замените на реальные идентификаторы
    try {
        const productsInfo = await ozonClient.getProducts(offerIds);
        console.log("Полученная информация о товарах:");
        console.log(JSON.stringify(productsInfo, null, 4));
    } catch (error) {
        console.error("Ошибка при получении информации о товарах:", error.message);
    }
}

// Вызываем функцию из server.js (например, старт сервера)
startServer();

// Запускаем обновление остатков и получение информации о товарах
(async () => {
    await updateProductStocks();
    await fetchProductsInfo();
})();
