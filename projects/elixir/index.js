const abi = require('./abi.json');
const sdk = require('@defillama/sdk');

const VERTEXMANAGER_CONTRACT = '0x052Ab3fd33cADF9D9f227254252da3f996431f75';

const BTC = '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f';
const USDC = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
const ETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const ARB = '0x912CE59144191C1204E64559FE8253a0e49E6548';
const USDT = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';

const pools = {
    // BTC Spot
    1: [BTC, USDC],
    // BTC Perp
    2: [USDC],
    // ETH Spot
    3: [ETH, USDC],
    // ETH Perp
    4: [USDC],
    // ARB Spot
    5: [ARB, USDC],
    // ARB Perp
    6: [USDC],
    // BNB Perp
    8: [USDC],
    // XRP Perp
    10: [USDC],
    // SOL Perp
    12: [USDC],
    // MATIC Perp
    14: [USDC],
    // SUI Perp
    16: [USDC],
    // OP Perp
    18: [USDC],
    // APT Perp
    20: [USDC],
    // LTC Perp
    22: [USDC],
    // BCH Perp
    24: [USDC],
    // COMP Perp
    26: [USDC],
    // MKR Perp
    28: [USDC],
    // mPEPE Perp
    30: [USDC],
    // USDT Spot
    31: [USDT, USDC],
    // DOGE Perp
    34: [USDC],
    // LINK Perp
    36: [USDC],
    // DYDX Perp
    38: [USDC],
    // CRV Perp
    40: [USDC]
};

async function tvl(_, _1, _2, { api }) {
    let calls = [];

    Object.entries(pools).forEach(async([key, value]) => {
        for (let i = 0; i < value.length; i++) {
            calls.push({
                target: VERTEXMANAGER_CONTRACT,
                params: [key, value[i]],
            });
        }
      });

    let balances = (await sdk.api.abi.multiCall({
        calls: calls,
        abi: abi.getPoolToken,
        chain: 'arbitrum'
    })).output.map(t => t.output[1]);

    api.addTokens(calls.map(t => t.params[1]), balances)
}

module.exports = {
    start: 145808650,
    methodology: 'Counts the active amount of tokens deposited in pools.',
    arbitrum: {
        tvl,
    }
};
