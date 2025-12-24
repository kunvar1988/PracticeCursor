import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/app/lib/supabaseServer";
import { randomUUID } from "crypto";

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

// Helper function to determine environment
function getEnvironment(): string {
  // Check Vercel environment first (if deployed on Vercel)
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV; // 'development', 'preview', or 'production'
  }
  
  // Check NODE_ENV
  if (process.env.NODE_ENV === "development") {
    return "local";
  }
  if (process.env.NODE_ENV === "production") {
    return "production";
  }
  
  // Check NEXTAUTH_URL to determine if local
  const nextAuthUrl = process.env.NEXTAUTH_URL || "";
  if (nextAuthUrl.includes("localhost") || nextAuthUrl.includes("127.0.0.1")) {
    return "local";
  }
  
  // Default fallback
  return "production";
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Get Supabase client
        const supabase = await createClient();
        
        // Check if user already exists by provider_id (Google user ID)
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id, provider_id")
          .eq("provider_id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is expected for new users
          console.error("Error checking user existence:", fetchError);
          // Continue with sign-in even if there's an error
          return true;
        }

        if (existingUser) {
          // User exists, update last_login and environment
          const environment = getEnvironment();
          const { error: updateError } = await supabase
            .from("users")
            .update({ 
              last_login: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              // Update other fields in case they changed
              name: user.name || null,
              email: user.email || null,
              image: user.image || null,
              environment: environment, // Update environment on each login
            })
            .eq("provider_id", user.id);

          if (updateError) {
            console.error("Error updating user:", updateError);
          }
        } else {
          // New user, insert into database with UUID
          const environment = getEnvironment();
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              id: randomUUID(),
              provider_id: user.id, // Store Google user ID in provider_id
              name: user.name || null,
              email: user.email || null,
              image: user.image || null,
              environment: environment, // Track where user was created
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Error inserting user:", insertError);
            // Continue with sign-in even if database insert fails
          } else {
            console.log("✅ New user created in database:", user.email);
          }
        }

        return true; // Allow sign-in to proceed
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Return true to allow sign-in even if database operation fails
        return true;
      }
    },
    async session({ session, token }) {
      // Add user ID (UUID from database) to session
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Get the UUID from database by looking up the provider_id
        try {
          const supabase = await createClient();
          const { data: dbUser, error } = await supabase
            .from("users")
            .select("id")
            .eq("provider_id", user.id)
            .single();
          
          if (!error && dbUser) {
            // Use the UUID from database as the token subject
            token.sub = dbUser.id;
          } else {
            // Fallback to provider ID if database lookup fails
            token.sub = user.id;
          }
        } catch (error) {
          console.error("Error fetching user UUID:", error);
          // Fallback to provider ID
          token.sub = user.id;
        }
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

