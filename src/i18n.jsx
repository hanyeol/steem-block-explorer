/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      blocks: 'Blocks',
      witnesses: 'Witnesses',
      posts: 'Posts',
      language: 'Language',
    },
    common: {
      time: 'Time',
      transactions: 'Transactions',
      witness: 'Witness',
      blockNumber: 'Block Number',
      size: 'Size',
      search: 'Search',
      loading: 'Loading...',
      page: 'Page',
      latestBlock: 'Latest Block',
      none: 'None',
    },
    searchBar: {
      placeholder: 'Search by block number or account...',
      button: 'Search',
    },
    dashboard: {
      title: 'Dashboard',
      loading: 'Loading data...',
      stats: {
        latestBlock: 'Latest Block',
        currentSupply: 'Current Supply',
        virtualSupply: 'Virtual Supply',
        totalVesting: 'Total Vesting Shares',
        steemPerVests: 'VESTS Price',
      },
      recentBlocks: 'Recent Blocks',
      emptyBlocks: 'No block information available.',
    },
    blockList: {
      title: 'Latest Blocks',
      latest: 'Latest Block: {num}',
    },
    blocksPage: {
      title: 'Explore Blocks',
      searchPlaceholder: 'Search block number...',
      searchButton: 'Search',
      infoLatest: 'Latest Block: #{num}',
      infoPage: 'Page {current} / {total}',
      txCount: 'Transactions',
      blockSize: 'Size',
      empty: 'Failed to load block info.',
      paginationPrev: 'Prev',
      paginationNext: 'Next',
      loading: 'Loading blocks...',
    },
    blockDetail: {
      info: 'Block Information',
      time: 'Time',
      witness: 'Witness',
      transactionCount: 'Transaction Count',
      prevHash: 'Previous Block Hash',
      merkle: 'Transaction Merkle Root',
      transactions: 'Transactions ({count})',
      noTransactions: 'No transactions in this block',
      rawJson: 'Raw JSON Data',
    },
    witnesses: {
      title: 'Witnesses',
      loading: 'Loading witnesses...',
      total: 'Total {count} witnesses',
      votes: 'Votes',
      price: 'Price',
      blockSize: 'Block Size',
      accountCreation: 'Account Creation Fee',
      website: 'Website',
      signingKey: 'Signing Key',
      active: 'Active',
      top20: 'Top 20',
      timeshare: 'Timeshare',
    },
    posts: {
      title: 'Posts',
      loading: 'Loading posts...',
      trending: 'Trending',
      latest: 'Latest',
      hot: 'Hot',
      empty: 'No posts on chain.',
      votes: 'votes',
      replies: 'replies',
      loadMore: 'Load More',
      loadingMore: 'Loading...',
    },
  },
  ko: {
    sidebar: {
      dashboard: '대시보드',
      blocks: '블록',
      witnesses: '증인',
      posts: '포스트',
      language: '언어',
    },
    common: {
      time: '시간',
      transactions: '트랜잭션',
      witness: '증인',
      blockNumber: '블록 번호',
      size: '크기',
      search: '검색',
      loading: '데이터를 불러오는 중...',
      page: '페이지',
      latestBlock: '최신 블록',
      none: '없음',
    },
    searchBar: {
      placeholder: '블록 번호 또는 계정으로 검색...',
      button: '검색',
    },
    dashboard: {
      title: '대시보드',
      loading: '데이터를 불러오는 중...',
      stats: {
        latestBlock: '최신 블록',
        currentSupply: '현재 공급량',
        virtualSupply: '가상 공급량',
        totalVesting: '총 베스팅 지분',
        steemPerVests: 'VESTS 가격',
      },
      recentBlocks: '최근 블록',
      emptyBlocks: '블록 정보가 없습니다.',
    },
    blockList: {
      title: '최근 블록',
      latest: '최신 블록: {num}',
    },
    blocksPage: {
      title: '블록 탐색',
      searchPlaceholder: '블록 번호 검색...',
      searchButton: '검색',
      infoLatest: '최신 블록: #{num}',
      infoPage: '페이지 {current} / {total}',
      txCount: '트랜잭션',
      blockSize: '크기',
      empty: '블록 정보를 불러오지 못했습니다.',
      paginationPrev: '← 이전',
      paginationNext: '다음 →',
      loading: '블록 데이터를 불러오는 중...',
    },
    blockDetail: {
      info: '블록 정보',
      time: '시간',
      witness: '증인',
      transactionCount: '트랜잭션 수',
      prevHash: '이전 블록 해시',
      merkle: '트랜잭션 머클 루트',
      transactions: '트랜잭션 ({count})',
      noTransactions: '트랜잭션이 없습니다',
      rawJson: '원본 JSON 데이터',
    },
    witnesses: {
      title: '증인 목록',
      loading: '증인 데이터를 불러오는 중...',
      total: '총 {count}명의 증인',
      votes: '투표',
      price: '가격',
      blockSize: '블록 크기',
      accountCreation: '계정 생성 수수료',
      website: '웹사이트',
      signingKey: '서명 키',
      active: '활성',
      top20: 'Top 20',
      timeshare: '타임쉐어',
    },
    posts: {
      title: '포스트',
      loading: '포스트 데이터를 불러오는 중...',
      trending: '트렌딩',
      latest: '최신',
      hot: '인기',
      empty: '현재 체인에 포스트가 없습니다.',
      votes: '투표',
      replies: '댓글',
      loadMore: '더 불러오기',
      loadingMore: '불러오는 중...',
    },
  },
  ja: {
    sidebar: {
      dashboard: 'ダッシュボード',
      blocks: 'ブロック',
      witnesses: '証人',
      posts: '投稿',
      language: '言語',
    },
    common: {
      time: '時間',
      transactions: 'トランザクション',
      witness: '証人',
      blockNumber: 'ブロック番号',
      size: 'サイズ',
      search: '検索',
      loading: '読み込み中...',
      page: 'ページ',
      latestBlock: '最新ブロック',
      none: 'なし',
    },
    searchBar: {
      placeholder: 'ブロック番号またはアカウントで検索...',
      button: '検索',
    },
    dashboard: {
      title: 'ダッシュボード',
      loading: 'データを読み込み中...',
      stats: {
        latestBlock: '最新ブロック',
        currentSupply: '現在の供給量',
        virtualSupply: '仮想供給量',
        totalVesting: '総ベスティングシェア',
        steemPerVests: 'VESTS 価格',
      },
      recentBlocks: '最新ブロック',
      emptyBlocks: 'ブロック情報がありません。',
    },
    blockList: {
      title: '最新ブロック',
      latest: '最新ブロック: {num}',
    },
    blocksPage: {
      title: 'ブロック検索',
      searchPlaceholder: 'ブロック番号を検索...',
      searchButton: '検索',
      infoLatest: '最新ブロック: #{num}',
      infoPage: 'ページ {current} / {total}',
      txCount: 'トランザクション',
      blockSize: 'サイズ',
      empty: 'ブロック情報を取得できませんでした。',
      paginationPrev: '← 前へ',
      paginationNext: '次へ →',
      loading: 'ブロックを読み込み中...',
    },
    blockDetail: {
      info: 'ブロック情報',
      time: '時間',
      witness: '証人',
      transactionCount: 'トランザクション数',
      prevHash: '前のブロックハッシュ',
      merkle: 'トランザクション マークルルート',
      transactions: 'トランザクション ({count})',
      noTransactions: 'トランザクションがありません',
      rawJson: 'RAW JSON データ',
    },
    witnesses: {
      title: '証人一覧',
      loading: '証人データを読み込み中...',
      total: '合計 {count} 名の証人',
      votes: '投票',
      price: '価格',
      blockSize: 'ブロックサイズ',
      accountCreation: 'アカウント作成手数料',
      website: 'ウェブサイト',
      signingKey: '署名キー',
      active: 'アクティブ',
      top20: 'トップ20',
      timeshare: 'タイムシェア',
    },
    posts: {
      title: '投稿',
      loading: '投稿を読み込み中...',
      trending: 'トレンド',
      latest: '最新',
      hot: '人気',
      empty: 'チェーンに投稿がありません。',
      votes: '票',
      replies: '返信',
      loadMore: 'さらに読み込む',
      loadingMore: '読み込み中...',
    },
  },
};

const LanguageContext = createContext({
  language: 'en',
  t: (key, params) => key + JSON.stringify(params),
  setLanguage: () => {},
});

const getNested = (obj, path) => path.split('.').reduce((acc, key) => acc && acc[key] !== undefined ? acc[key] : undefined, obj);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = window.localStorage.getItem('language');
    if (stored && translations[stored]) return stored;
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', language);
    }
  }, [language]);

  const t = useMemo(() => (key, params = {}) => {
    const value = getNested(translations[language], key) ?? getNested(translations.en, key) ?? key;
    if (typeof value !== 'string') return value;
    return value.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`));
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);

export const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
];
