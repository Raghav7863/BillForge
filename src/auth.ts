import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Business from "@/models/Business";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ==========================================
    // GOOGLE
    // ==========================================

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ==========================================
    // EMAIL + PASSWORD
    // ==========================================

    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("========== AUTHORIZE START ==========");

        try {
          console.log("Credentials received:", {
            email: credentials?.email,
            hasPassword: !!credentials?.password,
          });

          if (
            !credentials?.email ||
            !credentials?.password
          ) {
            console.log("Missing credentials");
            throw new Error(
              "Email and password are required"
            );
          }

          await connectDB();

          console.log("Database connected");

          const user = await User.findOne({
            email: credentials.email,
          });

          console.log("User found:", !!user);

          if (!user) {
            console.log("USER NOT FOUND");

            throw new Error(
              "Invalid email or password"
            );
          }

          console.log("User ID:", user._id.toString());
          console.log("User verified:", user.isVerified);
          console.log("Has password:", !!user.password);
          console.log("Business ID:", user.businessId);

          if (!user.password) {
            throw new Error(
              "This account uses Google login. Please continue with Google."
            );
          }

          const passwordMatch =
            await bcrypt.compare(
              credentials.password as string,
              user.password
            );

          console.log(
            "Password match:",
            passwordMatch
          );

          if (!passwordMatch) {
            throw new Error(
              "Invalid email or password"
            );
          }

          if (!user.isVerified) {
            console.log(
              "USER IS NOT VERIFIED"
            );

            throw new Error(
              "Please verify your email first"
            );
          }

          console.log(
            "AUTHORIZE SUCCESS"
          );

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
            isVerified: user.isVerified,
            businessId: user.businessId
              ? user.businessId.toString()
              : null,
          };
        } catch (error) {
          console.error(
            "AUTHORIZE ERROR:",
            error
          );

          throw error;
        }
      }

    }),
  ],

  // ==========================================
  // SESSION
  // ==========================================

  session: {
    strategy: "jwt",
  },

  // ==========================================
  // CALLBACKS
  // ==========================================

  callbacks: {
    // ========================================
    // SIGN IN
    // ========================================

    async signIn({ user, account }) {
      try {
        // ======================================
        // CREDENTIALS LOGIN
        // ======================================

        if (account?.provider === "credentials") {
          return true;
        }

        // ======================================
        // GOOGLE LOGIN
        // ======================================

        if (account?.provider !== "google") {
          return true;
        }

        await connectDB();

        // Google must provide email
        if (!user.email) {
          throw new Error(
            "Google account did not provide an email"
          );
        }

        console.log(
          "Google login:",
          user.email
        );

        // ======================================
        // FIND USER
        // ======================================

        let dbUser = await User.findOne({
          email: user.email,
        });

        // ======================================
        // CREATE USER IF NEW
        // ======================================

        if (!dbUser) {
          console.log(
            "Creating Google user..."
          );

          dbUser = await User.create({
            name: user.name || "",
            email: user.email,
            image: user.image || "",
            password: null,
            isVerified: true,
            provider: "google",
          });

          console.log(
            "Google user created:",
            dbUser._id.toString()
          );
        }

        // ======================================
        // CREATE BUSINESS
        // ======================================

        if (!dbUser.businessId) {
          console.log(
            "Creating business..."
          );

          const business =
            await Business.create({
              name: "",
              logo: "",

              email: dbUser.email,

              address: "",
              gstin: "",

              currency: "INR",

              invoicePrefix: "INV",

              // IMPORTANT:
              // Use MongoDB User _id
              // NOT user.id
              ownerId: dbUser._id,
            });

          console.log(
            "Business created:",
            business._id.toString()
          );

          // ====================================
          // CONNECT BUSINESS TO USER
          // ====================================

          dbUser.businessId =
            business._id;

          await dbUser.save();

          console.log(
            "Business connected to user"
          );
        } else {
          console.log(
            "User already has business:",
            dbUser.businessId.toString()
          );
        }

        return true;

      } catch (error) {
        console.error(
          "================================"
        );

        console.error(
          "GOOGLE SIGN-IN ERROR:"
        );

        console.error(error);

        console.error(
          "================================"
        );

        // IMPORTANT:
        // Throw the real error while debugging
        throw error;
      }
    },

    // ========================================
    // JWT
    // ========================================

    async jwt({ token, user }) {
      // This runs when the user first logs in

      if (user?.email) {
        await connectDB();

        const dbUser = await User.findOne({
          email: user.email,
        });

        if (dbUser) {
          token.id =
            dbUser._id.toString();

          token.email =
            dbUser.email;

          token.name =
            dbUser.name;

          token.image =
            dbUser.image;

          token.isVerified =
            dbUser.isVerified;

          // ADD BUSINESS ID TO JWT
          token.businessId =
            dbUser.businessId
              ? dbUser.businessId.toString()
              : null;
        }
      }

      return token;
    },

    // ========================================
    // SESSION
    // ========================================

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.email =
          token.email as string;

        session.user.name =
          token.name as string;

        session.user.image =
          token.image as string;

        session.user.isVerified =
          token.isVerified as boolean;

        // ADD BUSINESS ID TO SESSION
        session.user.businessId =
          token.businessId as string;
      }

      return session;
    },
  },

  // ==========================================
  // CUSTOM LOGIN PAGE
  // ==========================================

  pages: {
    signIn: "/login",
  },
});