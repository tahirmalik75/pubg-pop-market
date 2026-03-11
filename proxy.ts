import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function proxy(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // Protect dashboard - only admins allowed
        if (path.startsWith('/dashboard') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        // Add other protected routes here
    ]
}
