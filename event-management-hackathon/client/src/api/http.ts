export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path.startsWith('http') ? path : `/api${path}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}
