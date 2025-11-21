import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();

export const signIn = {
    social: (opts: {
        provider: string;
        callbackURL?: string;
        errorCallbackURL?: string;
    }) => {
        return console.log(process.env.URL_API as string);
    },
};

export const useSession = authClient.useSession;