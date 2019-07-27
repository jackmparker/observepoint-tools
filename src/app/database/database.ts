import { IToolsModel } from '../interfaces/interfaces';
import { TOOL_NAMES } from '../constants/constants';

export const tools: IToolsModel[] = [
    {
      name: TOOL_NAMES.BULK_EMAIL.DISPLAY_NAME,
      path: TOOL_NAMES.BULK_EMAIL.PATH,
      description: TOOL_NAMES.BULK_EMAIL.DESCRIPTION,
      title: TOOL_NAMES.BULK_EMAIL.TITLE
    },
    {
      name: TOOL_NAMES.BULK_ITEM_DELETER.DISPLAY_NAME,
      path: TOOL_NAMES.BULK_ITEM_DELETER.PATH,
      description: TOOL_NAMES.BULK_ITEM_DELETER.DESCRIPTION,
      title: TOOL_NAMES.BULK_ITEM_DELETER.TITLE
    },
    {
      name: TOOL_NAMES.BULK_LABEL_DELETER.DISPLAY_NAME,
      path: TOOL_NAMES.BULK_LABEL_DELETER.PATH,
      description: TOOL_NAMES.BULK_LABEL_DELETER.DESCRIPTION,
      title: TOOL_NAMES.BULK_LABEL_DELETER.TITLE
    },
    {
      name: TOOL_NAMES.RUN_IDS.DISPLAY_NAME,
      path: TOOL_NAMES.RUN_IDS.PATH,
      description: TOOL_NAMES.RUN_IDS.DESCRIPTION,
      title: TOOL_NAMES.RUN_IDS.TITLE
    },
    {
      name: TOOL_NAMES.TAG_LIST.DISPLAY_NAME,
      path: TOOL_NAMES.TAG_LIST.PATH,
      description: TOOL_NAMES.TAG_LIST.DESCRIPTION,
      title: TOOL_NAMES.TAG_LIST.TITLE
    },
    {
      name: TOOL_NAMES.BEARER_TOKEN.DISPLAY_NAME,
      path: TOOL_NAMES.BEARER_TOKEN.PATH,
      description: TOOL_NAMES.BEARER_TOKEN.DESCRIPTION,
      title: TOOL_NAMES.BEARER_TOKEN.TITLE
    },
    {
      name: TOOL_NAMES.CHROME_ENGINE.DISPLAY_NAME,
      path: TOOL_NAMES.CHROME_ENGINE.PATH,
      description: TOOL_NAMES.CHROME_ENGINE.DESCRIPTION,
      title: TOOL_NAMES.CHROME_ENGINE.TITLE
    }
];