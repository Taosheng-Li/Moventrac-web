import { cookies } from 'next/headers'

export function getTokenFromCookies(): string | undefined {
  return cookies().get('moventrac_token')?.value
}

