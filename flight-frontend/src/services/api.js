import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 15000,

    transformRequest: [(data, headers) => {
        if (!data) return JSON.stringify({});

        if (process.env.NODE_ENV === 'development') {
            console.log('📤 [API] Отправка запроса:', {
                url: headers?.url || 'unknown',
                method: headers?.method || 'unknown',
                data: data
            });
        }

        return JSON.stringify(data);
    }],
    transformResponse: [(data) => {
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.warn('⚠️ Не удалось распарсить ответ как JSON:', data);
            return data;
        }
    }]
});

api.interceptors.request.use(
    config => {
        if (process.env.NODE_ENV === 'development') {
            console.group('🚀 REQUEST');
            console.log('📍 URL:', config.baseURL + config.url);
            console.log('⚙️ Method:', config.method?.toUpperCase());
            console.log('📦 Headers:', config.headers);

            if (config.data) {
                try {
                    const parsed = typeof config.data === 'string'
                        ? JSON.parse(config.data)
                        : config.data;
                    console.log('📋 Body:', parsed);

                    if (parsed.departureDate || parsed.arrivalDate) {
                        console.log('📅 Dates check:', {
                            departure: parsed.departureDate,
                            arrival: parsed.arrivalDate,
                            departureValid: /^\d{4}-\d{2}-\d{2}$/.test(parsed.departureDate),
                            arrivalValid: /^\d{4}-\d{2}-\d{2}$/.test(parsed.arrivalDate)
                        });
                    }
                } catch (e) {
                    console.log('📋 Body (raw):', config.data);
                }
            }
            console.groupEnd();
        }
        return config;
    },
    error => {
        console.error('❌ REQUEST ERROR:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        if (process.env.NODE_ENV === 'development') {
            console.group('✅ RESPONSE');
            console.log('📍 URL:', response.config.url);
            console.log('📊 Status:', response.status, response.statusText);
            console.log('📦 Data:', response.data);
            console.groupEnd();
        }
        return response;
    },
    error => {
        const errorDetails = {
            message: error.message,
            isNetworkError: !error.response,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            responseHeaders: error.response?.headers,
            config: {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                headers: error.config?.headers
            }
        };

        console.group('💥 API ERROR');
        console.error('📛 Message:', errorDetails.message);
        console.error('🌐 Network Error:', errorDetails.isNetworkError);
        console.error('📍 URL:', errorDetails.url);
        console.error('🔢 Status:', errorDetails.status, errorDetails.statusText);

        if (errorDetails.isNetworkError) {
            console.error('🔌 СЕРВЕР НЕ ОТВЕЧАЕТ! Возможные причины:');
            console.error('   • Spring Boot не запущен');
            console.error('   • Неверный URL (проверьте порт 8080)');
            console.error('   • CORS блокирует запрос');
            console.error('   • Брандмауэр/антивирус');
        }

        if (errorDetails.responseData) {
            console.error('📦 Ответ сервера:', errorDetails.responseData);

            if (typeof errorDetails.responseData === 'string' &&
                errorDetails.responseData.includes('Failed to read request')) {
                console.error('⚠️ ️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️......');
                console.error('🔧 ПРИЧИНЫ "Failed to read request":');
                console.error('   1️⃣ Некорректный JSON в теле запроса');
                console.error('   2️⃣ Дата в неверном формате (нужно: "2024-03-31")');
                console.error('   3️⃣ Отсутствует @RequestBody в контроллере');
                console.error('   4️⃣ DTO не имеет пустого конструктора');
                console.error('   5️⃣ Поля DTO не совпадают с JSON (camelCase!)');
            }
        }
        console.groupEnd();

        if (errorDetails.isNetworkError) {
            error.userMessage = '❌ Сервер недоступен. Убедитесь, что Spring Boot запущен на порту 8080.';
        } else if (errorDetails.status === 400) {
            const msg = errorDetails.responseData;
            error.userMessage = typeof msg === 'string'
                ? msg
                : msg?.message || msg?.error || 'Неверные данные. Проверьте формат дат.';
        } else if (errorDetails.status === 401) {
            error.userMessage = '🔐 Требуется авторизация';
        } else if (errorDetails.status === 403) {
            error.userMessage = '🚫 Доступ запрещён';
        } else if (errorDetails.status === 404) {
            error.userMessage = '🔍 Ресурс не найден';
        } else if (errorDetails.status === 409) {
            error.userMessage = '⚠️ Конфликт: возможно, рейс с таким номером уже существует';
        } else if (errorDetails.status >= 500) {
            error.userMessage = '💥 Ошибка сервера. Проверьте логи Spring Boot.';
        } else {
            error.userMessage = errorDetails.message || 'Произошла неизвестная ошибка';
        }

        return Promise.reject(error);
    }
);

export default api;