import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superadmin = await User.create(payload);
    console.log("Super Admin Created Successfuly! \n");
    console.log(superadmin);
  } catch (error) {
    console.log(error);
  }
};
