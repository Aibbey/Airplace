import { betterAuth } from "better-auth"

export const auth = betterAuth({ 
    socialProviders: {
        discord: { 
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            redirectUri: `${process.env.URL_API}/api/auth/callback/discord`,
            scopes: ["identify", "email"],
        }, 
    },
})
