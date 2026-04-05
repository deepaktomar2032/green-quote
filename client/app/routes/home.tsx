import { redirect } from 'react-router'

import { isLoggedIn } from '~/utils/auth'

export function clientLoader() {
    if (isLoggedIn()) return redirect('/quotes')
    return redirect('/login')
}

export default function Home() {
    return null
}
