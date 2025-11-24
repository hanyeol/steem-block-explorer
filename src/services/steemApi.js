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
    // Use list_witnesses with by_vote_name order
    // start: [votes, account_name] - use very large number to start from top
    const result = await rpcCall('database_api', 'list_witnesses', {
      start: ["999999999999", ""],
      limit,
      order: 'by_vote_name'
    });

    return result.witnesses || [];
  } catch (error) {
    console.error('Failed to fetch witnesses by vote:', error);
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
 * Using tags_api which includes pending_payout_value and other metadata
 */
export const getDiscussions = async (sortBy = 'trending', query = {}) => {
  try {
    const limit = query.limit || 20;

    // Map sortBy to tags_api method name (full method name including prefix)
    let method;
    switch (sortBy) {
      case 'trending':
        method = 'tags_api.get_discussions_by_trending';
        break;
      case 'created':
        method = 'tags_api.get_discussions_by_created';
        break;
      case 'hot':
        method = 'tags_api.get_discussions_by_hot';
        break;
      default:
        method = 'tags_api.get_discussions_by_trending';
    }

    // Build params object with pagination support
    const params = {
      tag: query.tag || '',
      limit,
      truncate_body: query.truncate_body || 0
    };

    // Add pagination parameters if provided
    if (query.start_author) {
      params.start_author = query.start_author;
    }
    if (query.start_permlink) {
      params.start_permlink = query.start_permlink;
    }

    // Use direct method call format for tags_api
    const response = await fetch(RPC_NODES[currentNodeIndex], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: 1,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result?.discussions || data.result || [];
  } catch (error) {
    console.error(`Failed to fetch ${sortBy} discussions:`, error);
    return [];
  }
};
