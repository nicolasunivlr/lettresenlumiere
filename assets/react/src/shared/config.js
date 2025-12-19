const defaultBaseUrl =
  process.env.NODE_ENV === "production" ? "/lettresenlumiere" : "";

const baseUrl = window.appConfig?.apiBaseUrl || defaultBaseUrl;

const config = {
  guestTokenKey: "guest_session_id",
  apiBaseUrl: baseUrl,
  apiEtapes: `${baseUrl}/api/etapes`,
  apiSequences: `${baseUrl}/api/sequences`,
  imagesUrl: `${baseUrl}/images`,
  videosUrl: `${baseUrl}/sequencevideos`,
  audiosUrl: `${baseUrl}/audios`,
  accountProfiles: `${baseUrl}/api/account_profiles`,
  login: `${baseUrl}/api/login`,
  logout: `${baseUrl}/api/logout`,
  check: `${baseUrl}/api/check`, // TODO: remplacer par 'check'
  accountProfilesMe: `${baseUrl}/api/account_profile/me`,
  accountProfileProgress: (accountId) =>
    `${baseUrl}/api/account_profile/${accountId}/progression`,
  progressions: `${baseUrl}/api/progressions`,
};

export { config };
