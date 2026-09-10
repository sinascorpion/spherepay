import { createBotSphere } from './sphere';

const UCT_COIN_ID = '7fc5d3a3c480c8606d25b381ed64e9c79560ec0243628691c978f40226d06c86';

async function main() {
  console.log('--- Initializing Bot Wallet ---');
  const { sphere, identity } = await createBotSphere();
  console.log('Bot chainPubkey:', identity.chainPubkey);
  console.log('Bot directAddress:', identity.directAddress);

  console.log('\n--- Checking Initial Balance ---');
  const initialAssets = await sphere.payments.assets();
  console.log('Initial Assets:', initialAssets);

  console.log('\n--- Requesting Faucet Mint (100 UCT) with coinId:', UCT_COIN_ID, '---');
  try {
    const mintResult = await sphere.payments.mint(UCT_COIN_ID, 10000000000n);
    console.log('Mint Result:', JSON.stringify(mintResult, null, 2));

    console.log('\n--- Checking Balance After Mint ---');
    const updatedAssets = await sphere.payments.assets();
    console.log('Updated Assets:', updatedAssets);
  } catch (err: any) {
    console.error('Mint error:', err?.message || err);
  }

  await sphere.destroy();
  console.log('\nWallet cleanly shut down.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
