import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: "Phone Number", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('--- Auth Started ---');
                try {
                    console.log('Connecting to DB...');
                    await connectDB();
                    console.log('DB Connected.');

                    if (!credentials?.phone || !credentials?.password) {
                        console.log('Missing credentials');
                        throw new Error('Please enter phone and password');
                    }

                    console.log('Finding user:', credentials.phone);
                    const user = await User.findOne({ phone: credentials.phone });

                    if (!user) {
                        console.log('User not found');
                        throw new Error('No user found with this phone number');
                    }

                    console.log('Comparing passwords...');
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        console.log('Invalid password');
                        throw new Error('Invalid password');
                    }

                    console.log('Auth successful for:', user.phone);
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        phone: user.phone,
                        role: user.role
                    }
                } catch (error: any) {
                    console.error('Auth error:', error.message);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.phone = user.phone;
                token.id = user.id;
            }
            return token
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.phone = token.phone;
                session.user.id = token.id;
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
