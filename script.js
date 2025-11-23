const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const resultBox = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

// доступные валюты
const allowedCurrencies = {
    USD: "Доллар",
    RUB: "Рубль",
    KGS: "Сом",
    KZT: "Тенге",
    CNY: "Юань",
    GBP: "Фунт стерлингов",
    EUR: "Евро"
};

let rates = {}; // тут будут курсы (base = USD)

async function loadCurrencies() {
    // создаём список валют
    for (const cur in allowedCurrencies) {
        fromSelect.innerHTML += `<option value="${cur}">${allowedCurrencies[cur]} (${cur})</option>`;
        toSelect.innerHTML += `<option value="${cur}">${allowedCurrencies[cur]} (${cur})</option>`;
    }

    fromSelect.value = "USD";
    toSelect.value = "KGS";

    try {
        // твой API-запрос (база = USD, бесплатно)
        const res = await fetch("https://v6.exchangerate-api.com/v6/81983e72046b879dd6bd98c9/latest/USD");
        const data = await res.json();

        if (!data || !data.conversion_rates) {
            console.error("API error:", data);
            resultBox.textContent = "Ошибка загрузки курсов валют.";
            return;
        }

        rates = data.conversion_rates; // сохраняем курсы
        console.log("Курсы:", rates);

    } catch (e) {
        console.error(e);
        resultBox.textContent = "Ошибка сети или API не отвечает.";
    }
}

function convertCurrency() {
    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (amount <= 0) {
        resultBox.textContent = "Введите корректную сумму.";
        return;
    }

    if (!rates[from] || !rates[to]) {
        resultBox.textContent = "Ошибка: нет данных для выбранных валют.";
        return;
    }

    // база USD, перевод: FROM → USD → TO
    const usdToFrom = rates[from];
    const usdToTo = rates[to];

    const result = amount * (usdToTo / usdToFrom);

    resultBox.textContent =
        `${amount} ${allowedCurrencies[from]} = ${result.toFixed(2)} ${allowedCurrencies[to]}`;
}

convertBtn.addEventListener("click", convertCurrency);

loadCurrencies();
