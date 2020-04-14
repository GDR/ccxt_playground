// @ts-ignore
import * as ccxt from "ccxt";
// @ts-ignore
import * as dotenv from "dotenv";

const config = dotenv.config().parsed;

console.log(config);
async function sleep(sleepTime) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, sleepTime);
    })
}

async function run() {
    const symbol = "BTC/USD_LEVERAGE";

    const currencyCom = new ccxt["currencycom"]({
        apiKey: config["apiKey"],
        secret: config["secret"],
    });

    const markets = await currencyCom.loadMarkets(true);

    console.log(markets[symbol]);

    const balance = await currencyCom.fetchBalance();
    const settings = await currencyCom.privateGetLeverageSettings({symbol: symbol});
    const usdAccount = balance.info.balances.find(i => i.asset = 'USD');
    const params = {
        'leverage': settings.value, // from 1 to 500
        'accountId': usdAccount.accountId,
    };
    let limitOrderBuy = await currencyCom.createOrder(symbol, 'market', 'buy', 0.01, 6850, params);

    console.log(limitOrderBuy);
    const tradingPositions = await currencyCom.privateGetTradingPositions();
    console.log(tradingPositions);
}

run();
