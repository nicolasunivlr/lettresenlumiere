const defaultBaseUrl =
  process.env.NODE_ENV === "production" ? "/lettresenlumiere" : "";

const baseUrl = window.appConfig?.apiBaseUrl || defaultBaseUrl;

const config = {
  apiBaseUrl: baseUrl,
  apiEtapes: `${baseUrl}/api/etapes`,
  apiSequences: `${baseUrl}/api/sequences`,
  imagesUrl: `${baseUrl}/images`,
  videosUrl: `${baseUrl}/sequencevideos`,
  audiosUrl: `${baseUrl}/audios`,
  accountProfiles: `${baseUrl}/api/account_profiles`,
};

export { config };
