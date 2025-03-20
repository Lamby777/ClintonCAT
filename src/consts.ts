const WIKI_BASE_URL: string = 'https://wiki.rossmanngroup.com';
export const WIKI_PAGES_ROOT_URL: string = `${WIKI_BASE_URL}/wiki`;
export const INDEX_PHP_URL: string = `${WIKI_BASE_URL}/index.php`;
export const API_URL: string = `${WIKI_BASE_URL}/api.php`;

/// Preload and edit intro IDs to be interpolated into the URL when starting a new article
export const PRELOADS_AND_EDITINTROS: Record<string, { preload: string; editintro: string }> = {
    company: { preload: 'Template%3ASample%2FCompany', editintro: 'Template%3ASample%2FCompany%2FHelp' },
    incident: { preload: 'Project%3ASample%2FIncident', editintro: 'Project%3ASample%2FIncident%2FHelp' },
    product: { preload: 'Project%3ASample%2FProduct', editintro: 'Project%3ASample%2FProduct%2FHelp' },
    productLine: { preload: 'Project%3ASample%2FProduct_line', editintro: 'Project%3ASample%2FProduct_line%2FHelp' },

    // might go unused, see issue ticket #45
    theme: { preload: 'Project%3ASample%2FTheme', editintro: 'Project%3ASample%2FTheme%2FHelp' },
};
