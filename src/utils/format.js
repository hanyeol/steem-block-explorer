const localeMap = {
  ko: 'ko-KR',
  ja: 'ja-JP',
  en: 'en-US',
};

export const formatTimestampWithLocale = (timestamp, language = 'en') => {
  if (!timestamp) return 'N/A';

  const locale = localeMap[language] || language || 'en-US';
  return new Date(`${timestamp}Z`).toLocaleString(locale);
};
