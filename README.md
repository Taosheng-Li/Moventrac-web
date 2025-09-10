# Moventrac Web

Next.js + TailwindCSS + shadcn/ui（待集成）实现的公开首页 + 登录/注册 + 个人中心 + 运动记录 Dashboard。

## 开发

1. Environment variables

Create `./.env.local`:

```
NEXT_PUBLIC_API_BASE=http://localhost:3000/api/
```

2. Install and run (needs network):

```
npm install
npm run dev -- -p 3001
```

3. Backend

Ensure Moventrac backend runs at `http://localhost:3000/api/`.

## Features

- `/` Marketing landing (login/signup CTAs)
- `/login` Login (stores JWT to httpOnly cookie)
- `/register` Signup
- `/profile` Profile + summary stats
- `/records` Records (filters, delete, refresh, details modal)

Protected routes `/profile` and `/records` via `middleware.ts` with cookie-based guard.

## shadcn/ui

Currently using lightweight shadcn-style components. To import official shadcn/ui components:

```
npx shadcn@latest init
npx shadcn@latest add button card table dialog ...
```

Then replace current primitives with shadcn/ui components for richer UX.
