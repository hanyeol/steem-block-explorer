// Steem RPC API endpoints
const RPC_NODES = [
  'https://api.steemit.com',
  'https://api.steemitstage.com',
];

let currentNodeIndex = 0;

/**
 * Make RPC call to Steem API
 */
const rpcCall = async (method, params = []) => {
  const node = RPC_NODES[currentNodeIndex];

  try {
    const response = await fetch(node, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result;
  } catch (error) {
    // Try next node on failure
    currentNodeIndex = (currentNodeIndex + 1) % RPC_NODES.length;
    throw error;
  }
};

/**
 * Get dynamic global properties (includes latest block number)
 */
export const getDynamicGlobalProperties = async () => {
  return await rpcCall('condenser_api.get_dynamic_global_properties');
};

/**
 * Get latest block number
 */
export const getLatestBlockNum = async () => {
  const props = await getDynamicGlobalProperties();
  return props.head_block_number;
};

/**
 * Get block information by block number
 */
export const getBlock = async (blockNum) => {
  return await rpcCall('condenser_api.get_block', [blockNum]);
};

/**
 * Get multiple blocks
 */
export const getBlocks = async (startBlock, count = 20) => {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(getBlock(startBlock - i));
  }
  const blocks = await Promise.all(promises);
  return blocks.filter(block => block !== null);
};

/**
 * Get account information
 */
export const getAccount = async (username) => {
  const accounts = await rpcCall('condenser_api.get_accounts', [[username]]);
  return accounts[0] || null;
};

/**
 * Get transaction from block
 */
export const getTransaction = async (blockNum, txIndex) => {
  const block = await getBlock(blockNum);
  return block?.transactions[txIndex] || null;
};

/**
 * Get witness schedule (active witnesses)
 */
export const getWitnessSchedule = async () => {
  return await rpcCall('condenser_api.get_witness_schedule');
};

/**
 * Get witnesses by vote (top witnesses)
 */
export const getWitnessesByVote = async (limit = 100) => {
  return await rpcCall('condenser_api.get_witnesses_by_vote', ['', limit]);
};

/**
 * Get active witnesses (currently producing blocks)
 */
export const getActiveWitnesses = async () => {
  const schedule = await getWitnessSchedule();
  return schedule.current_shuffled_witnesses || [];
};

/**
 * Get discussions by created (latest posts)
 */
export const getLatestPosts = async (limit = 10) => {
  return await rpcCall('condenser_api.get_discussions_by_created', [{
    tag: '',
    limit
  }]);
};
