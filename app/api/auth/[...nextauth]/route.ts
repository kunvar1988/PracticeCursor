import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/app/lib/supabaseServer";
import { randomUUID } from "crypto";

// Validate environment variables at runtime (not during build)
// This function is called when the route handler is actually invoked, not at module load time
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
    // Only throw in development to help with local debugging
    // In production/build, we'll let NextAuth handle the error gracefully
    if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
      throw new Error(errorMsg);
    }
  } else {
    console.log("✅ NextAuth environment variables validated successfully");
  }
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

// Note: We don't validate at module load time to avoid build failures
// Validation will happen at runtime when the route handler is actually invoked
// NextAuth will handle missing environment variables gracefully

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
        const environment = getEnvironment();
        
        // Check if user already exists by provider_id AND environment
        // This allows the same user to have separate entries for local and production
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id, provider_id, environment")
          .eq("provider_id", user.id)
          .eq("environment", environment)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is expected for new users in this environment
          console.error("[NextAuth] Error checking user existence:", {
            error: fetchError,
            code: fetchError.code,
            message: fetchError.message,
            userEmail: user.email,
            providerId: user.id,
            environment,
            timestamp: new Date().toISOString(),
          });
          // Continue with sign-in even if there's an error
          return true;
        }

        if (existingUser) {
          // User exists in this environment, update last_login
          const { error: updateError } = await supabase
            .from("users")
            .update({ 
              last_login: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              // Update other fields in case they changed
              name: user.name || null,
              email: user.email || null,
              image: user.image || null,
            })
            .eq("provider_id", user.id)
            .eq("environment", environment);

          if (updateError) {
            console.error("[NextAuth] Error updating user:", {
              error: updateError,
              code: updateError.code,
              message: updateError.message,
              userEmail: user.email,
              providerId: user.id,
              environment,
              timestamp: new Date().toISOString(),
            });
          } else {
            console.log("[NextAuth] User updated successfully:", {
              userEmail: user.email,
              providerId: user.id,
              environment,
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          // New user in this environment, insert into database with UUID
          // This creates a separate entry for local vs production
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              id: randomUUID(),
              provider_id: user.id, // Store Google user ID in provider_id
              name: user.name || null,
              email: user.email || null,
              image: user.image || null,
              environment: environment, // Track which environment this entry is for
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
            });

          if (insertError) {
            console.error("[NextAuth] Error inserting user:", {
              error: insertError,
              code: insertError.code,
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
              userEmail: user.email,
              providerId: user.id,
              environment,
              timestamp: new Date().toISOString(),
            });
            // Continue with sign-in even if database insert fails
          } else {
            console.log("[NextAuth] ✅ New user created in database:", {
              userEmail: user.email,
              providerId: user.id,
              environment,
              timestamp: new Date().toISOString(),
            });
          }
        }

        return true; // Allow sign-in to proceed
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error("[NextAuth] Error in signIn callback:", {
          error,
          message: errorMessage,
          stack: errorStack,
          userEmail: user?.email,
          providerId: user?.id,
          timestamp: new Date().toISOString(),
        });
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
        // Get the UUID from database by looking up the provider_id AND environment
        // This ensures we get the correct entry for the current environment
        try {
          const supabase = await createClient();
          const environment = getEnvironment();
          const { data: dbUser, error } = await supabase
            .from("users")
            .select("id")
            .eq("provider_id", user.id)
            .eq("environment", environment)
            .single();
          
          if (!error && dbUser) {
            // Use the UUID from database as the token subject
            token.sub = dbUser.id;
            token.environment = environment; // Store environment in token for reference
          } else {
            // Fallback to provider ID if database lookup fails
            console.warn("[NextAuth] User not found in database, using provider ID:", {
              providerId: user.id,
              environment,
              timestamp: new Date().toISOString(),
            });
            token.sub = user.id;
            token.environment = environment;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          const environment = getEnvironment();
          console.error("[NextAuth] Error fetching user UUID:", {
            error,
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            providerId: user.id,
            environment,
            timestamp: new Date().toISOString(),
          });
          // Fallback to provider ID
          token.sub = user.id;
          token.environment = environment;
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
  // Ensure cookies work in production (Vercel uses HTTPS)
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") === true || process.env.NODE_ENV === "production",
};

// Create NextAuth handler
// Note: We don't validate env vars at module load time to prevent build failures
// NextAuth will handle missing environment variables gracefully at runtime
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

