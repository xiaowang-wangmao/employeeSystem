
export interface AppState {
  sideCollapsed: boolean;
  isMobile: boolean;
  theme: 'dark' | 'light';
  layout: string;
  contentWidth: string;
  fixedHeader: boolean;
  fixedSidebar: boolean;
  autoHideHeader: boolean;
  color: string;
  weak: boolean;
  multiTab: boolean;
  _antLocale: any;
}

export interface LoadingState {
  layout: {
    loading: boolean;
    tip: string;
  };
}

export interface IAuthority {
  rules: Array<string>;
}

export interface State { }

export interface InjectionState extends State {
  appState: AppState;
}
