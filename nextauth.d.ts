// nextauth.d.ts
import { SessionUser } from "@globalTypes/types";
declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: SessionUser;
    }
}