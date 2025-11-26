import { BUSINESS_KEYWORDS } from './businessKeywords';

export const extractUsernames = (data) => {
  let list = [];
  const items = Array.isArray(data) ? data : 
                data.relationships_following || 
                data.relationships_followers || 
                Object.values(data)[0] || [];

  items.forEach(item => {
      let foundUsername = item.string_list_data?.[0]?.value;
      let foundTimestamp = item.string_list_data?.[0]?.timestamp;
      
      if (!foundUsername && item.title) foundUsername = item.title;
      if (!foundUsername && item.media_list_data?.[0]?.value) foundUsername = item.media_list_data[0].value;

      if (foundUsername) {
          list.push({
              username: foundUsername,
              timestamp: foundTimestamp ? (foundTimestamp < 10000000000 ? foundTimestamp * 1000 : foundTimestamp) : Date.now()
          });
      }
  });
  return list;
};

export const isLikelyBusiness = (username) => {
  const lower = username.toLowerCase();
  
  return BUSINESS_KEYWORDS.some(keyword => {
      // 1. Check if keyword is a distinct segment (e.g. "shop_alex" or "alex.shop")
      if (lower.startsWith(keyword + '_') || lower.startsWith(keyword + '.')) return true;
      if (lower.endsWith('_' + keyword) || lower.endsWith('.' + keyword)) return true;
      
      // 2. Check if keyword is in the middle (e.g. "alex_shop_usa")
      if (lower.includes('_' + keyword + '_') || lower.includes('.' + keyword + '.')) return true;

      // 3. Strict containment for longer, distinct words (4+ chars)
      // (e.g. "university" inside "harvarduniversity" is safe to flag)
      // (e.g. "fit" inside "profit" is NOT safe, so we skip short words here)
      if (keyword.length > 3 && lower.includes(keyword)) return true;

      return false;
  });
};