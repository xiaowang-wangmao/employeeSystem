// import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
// import { CacheTypeEnum } from '/@/enums/cacheEnum';
// import projectSetting from '/@/settings/projectSetting';
// import { TOKEN_KEY } from '/@/enums/cacheEnum';

// const { permissionCacheType } = projectSetting;
// const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

// export function getToken() {
//   return getAuthCache(TOKEN_KEY);
//   // return '';
// }


// export function setAuthCache(key: BasicKeys, value) {
//   const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
//   return fn(key, value, true);
// }

// export function clearAuthCache(immediate = true) {
//   const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
//   return fn(immediate);
// }
