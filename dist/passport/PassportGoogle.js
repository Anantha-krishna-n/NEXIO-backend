"use strict";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { UserRepository } from "../../repositories/IUserRepository";
// const userRepository = new UserRepository();
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await userRepository.findByGoogleId(profile.id);
//         if (!user) {
//           user = await userRepository.create({
//             name: profile.displayName,
//             email: profile.emails?.[0]?.value || "",
//             googleId: profile.id,
//           });
//         }
//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );
// passport.serializeUser((user: any, done) => done(null, user.id));
// passport.deserializeUser((id, done) => {
//   userRepository.findByGoogleId(id).then((user) => done(null, user));
// });
// export default passport
