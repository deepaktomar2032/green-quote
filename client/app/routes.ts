import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
    index('routes/home.tsx'),
    route('login', 'routes/login/login.tsx'),
    route('signup', 'routes/signup/signup.tsx'),
    route('quotes', 'routes/quotes/quotes.tsx'),
    route('quotes/new', 'routes/quotes-new/quotes-new.tsx'),
    route('quotes/:id', 'routes/quotes-id/quotes-id.tsx'),
    route('admin/quotes', 'routes/admin-quotes/admin-quotes.tsx')
] satisfies RouteConfig
