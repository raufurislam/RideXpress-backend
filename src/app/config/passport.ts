/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import bcryptjs from "bcryptjs";
import { envVars } from "./env";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        // if (!isUserExist) {
        //     return done(null, false, { message: "User does not exist" })
        // }

        if (!isUserExist) {
          return done("User does not exist");
        }

        if (!isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
          return done("User is not verified");
        }

        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.SUSPENDED
        ) {
          // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
          return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
          return done("User is deleted");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
          });
        }

        // if (isGoogleAuthenticated) {
        //     return done("You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.")
        // }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { mesaage: "No email found" });
        }

        let isUserExist = await User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
          // done("User is not verified")
          return done(null, false, { message: "User is not verified" });
        }

        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.SUSPENDED)
        ) {
          // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
          done(`User is ${isUserExist.isActive}`);
        }

        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: "User is deleted" });
          // done("User is deleted")
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.RIDER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

// frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token

// Bridge == Google -> user db store -> token
//Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
//Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
