import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Validate environment variables at startup
function validateEnvVars() {
  const missing: string[] = [];
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    missing.push("GOOGLE_CLIENT_ID");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    missing.push("GOOGLE_CLIENT_SECRET");
  }
  if (!process.env.NEXTAUTH_SECRET) {
    missing.push("NEXTAUTH_SECRET");
  }
  if (!process.env.NEXTAUTH_URL) {
    missing.push("NEXTAUTH_URL");
  }
  
  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(", ")}. Please check your Vercel environment variables configuration.`;
    console.error("❌ NextAuth Configuration Error:", errorMsg);
    // In production, we still want to log but not crash the build
    if (process.env.NODE_ENV === "development") {
      throw new Error(errorMsg);
    }
  } else {
    console.log("✅ NextAuth environment variables validated successfully");
  }
}

// Validate on module load (only in server environment)
if (typeof window === "undefined") {
  validateEnvVars();
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/auth-code-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

