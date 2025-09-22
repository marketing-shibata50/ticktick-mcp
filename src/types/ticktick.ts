// TickTick API Types
export interface TickTickConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Task {
  id: string;
  title: string;
  content?: string;
  desc?: string;
  allDay?: boolean;
  startDate?: string;
  dueDate?: string;
  timeZone?: string;
  reminders?: string[];
  repeat?: string;
  priority?: number;
  sortOrder?: number;
  items?: TaskItem[];
  progress?: number;
  assignee?: string;
  projectId: string;
  tags?: string[];
  kind?: string;
  createdTime?: string;
  modifiedTime?: string;
  completedTime?: string;
  status?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  status: number;
  completedTime?: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
  inAll?: boolean;
  sortOrder?: number;
  sortType?: string;
  userCount?: number;
  etag?: string;
  modifiedTime?: string;
  closed?: boolean;
  muted?: boolean;
  transferred?: string;
  groupId?: string;
  viewMode?: string;
  notificationOptions?: {
    [key: string]: boolean;
  };
  teamId?: string;
  permission?: string;
  kind?: string;
}

export interface CreateTaskRequest {
  title: string;
  content?: string;
  desc?: string;
  allDay?: boolean;
  startDate?: string;
  dueDate?: string;
  timeZone?: string;
  priority?: number;
  projectId?: string;
  tags?: string[];
  reminders?: string[];
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  content?: string;
  desc?: string;
  allDay?: boolean;
  startDate?: string;
  dueDate?: string;
  timeZone?: string;
  priority?: number;
  projectId?: string;
  tags?: string[];
  reminders?: string[];
  status?: number;
}

export interface CreateProjectRequest {
  name: string;
  color?: string;
  groupId?: string;
}

export interface UpdateProjectRequest {
  id: string;
  name?: string;
  color?: string;
  groupId?: string;
}

export interface TaskFilter {
  projectId?: string;
  completed?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}