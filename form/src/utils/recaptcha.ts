export const getRecaptchaToken = (action: string) =>
  new Promise((resolve, reject) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.grecaptcha.ready(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.grecaptcha
        .execute("6Ldwb4InAAAAAP8Z6U1JnGq3WQ9pguOtWGh3kuHL", { action })
        .then(resolve)
        .catch(reject)
    )
  ) as Promise<string>;
