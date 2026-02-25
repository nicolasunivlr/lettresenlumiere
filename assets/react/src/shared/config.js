const defaultBaseUrl =
  process.env.NODE_ENV === "production" ? "/lettresenlumiere" : "";

const baseUrl = window.appConfig?.apiBaseUrl || defaultBaseUrl;

const config = {
  guestTokenKey: "guest_session_id",
  guestProgressTokenKey: "guest_progress_token",
  apiBaseUrl: baseUrl,
  apiEtapes: `${baseUrl}/api/etapes`,
  apiSequences: `${baseUrl}/api/sequences`,
  imagesUrl: `${baseUrl}/images`,
  videosUrl: `${baseUrl}/sequencevideos`,
  audiosUrl: `${baseUrl}/audios`,
  accountProfiles: `${baseUrl}/api/account_profiles`,
  login: `${baseUrl}/api/login`,
  logout: `${baseUrl}/api/logout`,
  register: `${baseUrl}/api/register`,
  check: `${baseUrl}/api/check`, // TODO: remplacer par 'check'
  register: `${baseUrl}/api/register`,
  accountProfilesMe: `${baseUrl}/api/account_profile/me`,
  accountProfileProgress: (accountId) =>
    `${baseUrl}/api/account_profile/${accountId}/progression`,
  accountProfileAllProgressions: (accountId) =>
    `${baseUrl}/api/account-profile/${accountId}/allProgressions`,
  progressions: `${baseUrl}/api/progressions`,
  accountProfileSequenceResults: (accountId, sequenceId) =>
  `${baseUrl}/api/account-profile/${accountId}/sequences/${sequenceId}/results`,
};

export { config };
