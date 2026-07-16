import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // AUTH_SECRET must be set in Vercel env vars for sessions to persist
  // If missing, sessions expire on every cold start (main cause of re-login issue)
  secret: process.env.AUTH_SECRET ?? "nexdesk-fallback-secret-32chars!!",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email    = (credentials.email    as string).toLowerCase().trim();
        const password = (credentials.password as string);
        // Add your admin accounts here
        const ADMINS: Record<string, string> = {
          "admin@techvault.com": "demo123",
        };
        if (ADMINS[email] === password) {
          return { id: "1", name: "Admin", email };
        }
        return null;
      },
    }),
  ],
  pages:   { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.email = user.email; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id    = token.id    as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
})
