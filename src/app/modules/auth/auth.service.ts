import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

// const changePassword = async (
//   oldPassword: string,
//   newPassword: string,
//   decodedToken: JwtPayload
// ) => {
//   const user = await User.findById(decodedToken.userId);

//   const isOldPasswordMatch = await bcryptjs.compare(
//     oldPassword,
//     user!.password as string
//   );

//   if (!isOldPasswordMatch) {
//     throw new AppError(
//       httpStatus.UNAUTHORIZED,
//       "Old Password Does not matched"
//     );
//   }

//   user!.password = await bcryptjs.hash(
//     newPassword,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );

//   user!.save();
// };

export const AuthServices = {
  getNewAccessToken,
  // changePassword,
  //   resetPassword,
  //   setPassword,
};
