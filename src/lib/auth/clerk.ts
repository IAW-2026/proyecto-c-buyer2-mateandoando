export function isServiceTokenValid(token?: string, expected?: string) {
  if (!token || !expected)
    return false

  return token === expected
}

export function withServiceAuth(
  envVar: string,
  handler: (req: Request, ctx: any) => Promise<Response>
) {
  return (req: Request, ctx: any) => {
    const token = req.headers.get('X-Service-Token')

    if (!isServiceTokenValid(token ?? undefined, process.env[envVar])) {
      return new Response('Unauthorized', { status: 401 })
    }
    
    return handler(req, ctx)
  }
}
