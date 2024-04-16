export const ENV = {
  API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  TITLE: import.meta.env.VITE_APP_TITLE,
  COPYRIGHT: {
    NAME: import.meta.env.VITE_COPYRIGHT_NAME,
    YEAR: Number(import.meta.env.VITE_COPYRIGHT_YEAR)
  },
  BUILD: {
    COMMIT: import.meta.env.VITE_BUILD_COMMIT,
    BRANCH: import.meta.env.VITE_BUILD_BRANCH
  }
}
