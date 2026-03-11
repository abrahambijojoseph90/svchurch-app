import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkLoginRateLimit } from "@/lib/security";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Rate limit login attempts
        const ip =
          req?.headers?.["x-forwarded-for"]?.toString() || "unknown";
        if (!checkLoginRateLimit(ip)) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.active) {
          return null;
        }

        // OAuth-only users cannot log in with credentials
        if (user.provider !== "credentials" || !user.password) {
          return null;
        }

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error(
            "Account temporarily locked. Please try again later."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Increment login attempts
          const attempts = user.loginAttempts + 1;
          const lockout = attempts >= 5 ? new Date(Date.now() + 15 * 60_000) : null;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: attempts,
              lockedUntil: lockout,
            },
          });
          return null;
        }

        // Successful login — reset attempts and update lastLogin
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date(),
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        // Check if user exists by email or googleId
        let existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Link Google account if not already linked
          if (!existingUser.googleId && account.providerAccountId) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: account.providerAccountId,
                avatar: user.image || existingUser.avatar,
                provider: existingUser.provider === "credentials" ? "credentials" : "google",
                lastLogin: new Date(),
              },
            });
          } else {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLogin: new Date(),
                avatar: user.image || existingUser.avatar,
              },
            });
          }

          if (!existingUser.active) return false;
        } else {
          // Create new user as CONTRIBUTOR
          existingUser = await prisma.user.create({
            data: {
              name: user.name || "Church Member",
              email,
              googleId: account.providerAccountId,
              avatar: user.image || null,
              provider: "google",
              role: "CONTRIBUTOR",
              active: true,
              lastLogin: new Date(),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // For credentials provider, user already has id and role
        if (account?.provider === "credentials") {
          token.id = user.id;
          token.role = (user as unknown as { role: string }).role;
          token.avatar = user.image;
        } else if (account?.provider === "google") {
          // For Google provider, look up the user in the DB
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, role: true, avatar: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.avatar = dbUser.avatar;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { avatar: string | null }).avatar = (token.avatar as string) || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
