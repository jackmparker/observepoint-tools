export const TOOL_NAMES = {
    BULK_EMAIL: {
        DISPLAY_NAME: 'BULK EMAIL EDITOR',
        PATH: '/bulk-email',
        TITLE: 'Bulk Email Editor',
        DESCRIPTION: 'Use this tool to add or remove email addresses in bulk to audits, journeys, and rules. The option to filter by folder or domain is also available to allow for targeted additions or removals.'
    },
    BULK_ITEM_DELETER: {
        DISPLAY_NAME: 'BULK ITEM DELETER',
        PATH: '/bulk-delete',
        TITLE: 'Bulk Item Deleter',
        DESCRIPTION: 'Quickly select the audits, journeys, and rules you wish to remove from an account and delete them with just one click.'
    },
    BULK_LABEL_DELETER: {
        DISPLAY_NAME: 'BULK LABEL DELETER',
        PATH: '/bulk-label-deleter',
        TITLE: 'Bulk Label Deleter',
        DESCRIPTION: 'Shows a list of all labels and allows for simple checkbox selection of which to delete.'
    },
    RUN_IDS: {
        DISPLAY_NAME: 'GET RUN IDs',
        PATH: '/run-ids',
        TITLE: 'Get Run IDs',
        DESCRIPTION: 'Easily get all the most recent run IDs from a list of domains or folders. Perfect for working with FatKat.'
    },
    TAG_LIST: {
        DISPLAY_NAME: 'OBSERVEPOINT TAG DATABASE',
        PATH: '/tag-list',
        TITLE: 'Tag Database',
        DESCRIPTION: 'Use this to get a full list of all tags in the ObservePoint tag database. Optionally download a CSV.'
    },
    BEARER_TOKEN: {
        DISPLAY_NAME: 'BEARER TOKEN GENERATOR',
        PATH: '/bearer-token',
        TITLE: 'Bearer Token Generator',
        DESCRIPTION: 'Use your ObservePoint login credentials to generate a bearer token for the current day.'
    },
    CHROME_ENGINE: {
        DISPLAY_NAME: 'CHROME ENGINE TOGGLER',
        PATH: '/chrome-engine-toggler',
        TITLE: 'Chrome Engine Toggler',
        DESCRIPTION: 'Easily enable or disable the new Chrome engines in bulk for your web audits or web journeys. Options to filter by folder or domain are included.'
    },
    FOLDER_DOMAIN_IDS : {
        DISPLAY_NAME: 'RETRIEVE FOLDER & DOMAIN IDs',
        PATH: '/folder-domain-ids',
        TITLE: 'Retrieve Folder & Domain IDs',
        DESCRIPTION: 'Retrieve all folder and domain IDs in an account.'
    },
    AGGREGATED_AUDIT_REPORTS : {
        DISPLAY_NAME: 'AGGREGATED AUDIT REPORTS',
        PATH: '/audit-reports',
        TITLE: 'Aggregated Audit Reports',
        DESCRIPTION: 'Known as "FatKat" to the ObservePoint consultants, this tool will aggregate the data from multiple audits into a single report. Options include specifying specific tags and variables.'
    }
}

export const ITEM_TYPES = {
    AUDIT: 'audit',
    WEB_JOURNEY: 'web-journey',
    APP: 'app',
    APP_JOURNEY: 'app-journey',
    RULE: 'rule',
    LABELS: 'labels',
    FOLDERS: 'folders',
    DOMAINS: 'domains'
}