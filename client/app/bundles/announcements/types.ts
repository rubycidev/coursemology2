import {
  AnnouncementListData,
  AnnouncementMiniEntity,
} from 'types/course/announcements';
import { EntityStore } from 'types/store';

// Action Names
export const SAVE_ANNOUNCEMENT_LIST = 'system/admin/SAVE_ANNOUNCEMENTS_LIST';

// Action Types
export interface SaveAnnouncementListAction {
  type: typeof SAVE_ANNOUNCEMENT_LIST;
  announcements: AnnouncementListData[];
}

export type GlobalActionType = SaveAnnouncementListAction;

// State Types
export interface GlobalAnnouncementState {
  announcements: EntityStore<AnnouncementMiniEntity>;
}
