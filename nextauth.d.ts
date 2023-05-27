// nextauth.d.ts
import { SessionUser } from "@globals/types";
declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: SessionUser;
    }
}