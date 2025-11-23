// Steem RPC API endpoints
const RPC_NODES = [
  '/rpc',
];

let currentNodeIndex = 0;

/**
 * Make RPC call to Steem API using the new call format
 */
const rpcCall = async (api, method, params = {}) => {
  const node = RPC_NODES[currentNodeIndex];

  try {
    const response = await fetch(node, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: [api, method, params],
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
  try {
    return await rpcCall('database_api', 'get_dynamic_global_properties', {});
  } catch (error) {
    console.error('Failed to fetch dynamic global properties:', error);
    throw error;
  }
};

/**
 * Get latest block number
 */
export const getLatestBlockNum = async () => {
  try {
    const props = await getDynamicGlobalProperties();
    return props.head_block_number;
  } catch (error) {
    console.error('Failed to fetch latest block number:', error);
    throw error;
  }
};

/**
 * Get block information by block number
 */
export const getBlock = async (blockNum) => {
  try {
    return await rpcCall('block_api', 'get_block', { block_num: blockNum });
  } catch (error) {
    console.error(`Failed to fetch block ${blockNum}:`, error);
    return null;
  }
};

/**
 * Get multiple blocks
 */
export const getBlocks = async (startBlock, count = 20) => {
  try {
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(getBlock(startBlock + i));
    }
    const blocks = await Promise.all(promises);

    const result = blocks
      .filter(block => block !== null && block !== undefined)
      .map((block, index) => {
        // Handle different response formats
        let blockData;
        if (block.block) {
          // API returns {block: {...}}
          blockData = { ...block.block };
        } else {
          // API returns flat block object
          blockData = { ...block };
        }

        // Add block_num if it doesn't exist
        if (!blockData.block_num) {
          blockData.block_num = startBlock + index;
        }

        // Generate block_id if it doesn't exist
        if (!blockData.block_id) {
          blockData.block_id = `block_${startBlock + index}`;
        }

        return blockData;
      })
      .filter(block => block && block.timestamp);

    return result;
  } catch (error) {
    console.error('Failed to fetch blocks:', error);
    return [];
  }
};

/**
 * Get account information
 */
export const getAccount = async (username) => {
  try {
    const result = await rpcCall('database_api', 'find_accounts', { accounts: [username] });
    return result.accounts?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch account ${username}:`, error);
    return null;
  }
};

/**
 * Get transaction from block
 */
export const getTransaction = async (blockNum, txIndex) => {
  try {
    const result = await getBlock(blockNum);
    return result?.block?.transactions[txIndex] || null;
  } catch (error) {
    console.error(`Failed to fetch transaction ${txIndex} from block ${blockNum}:`, error);
    return null;
  }
};

/**
 * Get witness schedule (active witnesses)
 */
export const getWitnessSchedule = async () => {
  try {
    return await rpcCall('database_api', 'get_witness_schedule', {});
  } catch (error) {
    console.error('Failed to fetch witness schedule:', error);
    throw error;
  }
};

/**
 * Get witnesses by vote (top witnesses)
 */
export const getWitnessesByVote = async (limit = 100) => {
  try {
    // First get active witness names
    const activeResult = await rpcCall('database_api', 'get_active_witnesses', {});
    const witnessNames = activeResult.witnesses.filter(w => w).slice(0, limit);

    // Then get detailed info for each witness
    const detailResult = await rpcCall('database_api', 'find_witnesses', {
      owners: witnessNames
    });

    return detailResult.witnesses || [];
  } catch (error) {
    console.error('Failed to fetch witnesses by vote:', error);
    return [];
  }
};

/**
 * Get active witnesses (currently producing blocks)
 */
export const getActiveWitnesses = async () => {
  try {
    const result = await rpcCall('database_api', 'get_active_witnesses', {});
    return result.witnesses.filter(w => w);
  } catch (error) {
    console.error('Failed to fetch active witnesses:', error);
    return [];
  }
};

/**
 * Get discussions by created (latest posts)
 * Note: Using list_comments with database_api
 */
export const getLatestPosts = async (limit = 10) => {
  try {
    const result = await rpcCall('database_api', 'list_comments', {
      start: [],
      limit,
      order: 'by_permlink'
    });
    return result.comments || [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
};

/**
 * Get discussions by various sorting options
 * Using database_api list_comments method with by_permlink order
 */
export const getDiscussions = async (sortBy = 'trending', query = {}) => {
  try {
    const limit = query.limit || 50; // Request more to filter later

    // Use by_permlink which only requires empty start array
    const result = await rpcCall('database_api', 'list_comments', {
      start: [],
      limit,
      order: 'by_permlink'
    });

    // Filter to get only root posts (not replies)
    const posts = result?.comments || [];
    const rootPosts = posts.filter(post => post.parent_author === '');

    // Sort based on sortBy parameter
    let sortedPosts = [...rootPosts];
    switch (sortBy) {
      case 'trending':
        // Sort by pending payout (higher is better)
        sortedPosts.sort((a, b) => {
          const aValue = parseFloat(a.pending_payout_value?.amount || 0);
          const bValue = parseFloat(b.pending_payout_value?.amount || 0);
          return bValue - aValue;
        });
        break;
      case 'created':
        // Sort by creation time (newest first)
        sortedPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      case 'hot':
        // Sort by net votes (most voted first)
        sortedPosts.sort((a, b) => (b.net_votes || 0) - (a.net_votes || 0));
        break;
    }

    // Return only requested limit
    return sortedPosts.slice(0, query.limit || 20);
  } catch (error) {
    console.error(`Failed to fetch ${sortBy} discussions:`, error);
    return [];
  }
};
