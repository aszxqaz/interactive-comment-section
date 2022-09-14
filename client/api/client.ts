function createFetcher(baseURL?: string) {
  return function <T>(endpoint: string, config: RequestInit = {}) {
    const _config = {
      method: config.body ? "POST" : "GET",
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    }

    if(config.body) {
      config.body = JSON.stringify(config.body)
    }

    return fetch(`${endpoint}`, config).then<T>(async res => {
      const json = await res.json()
      if (res.ok) return json
      return Promise.reject(json)
    })
  }
}

export const mfetch = createFetcher()