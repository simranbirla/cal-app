import Nylas from "nylas";

export const nylas = new Nylas({
    apiKey: process.env.NEXT_NYLAS_API_KEY!,
    apiUri: process.env.NEXT_NYLAS_API_URI!
})

export const nylasConfig = {
    clientId: process.env.NEXT_NYLAS_CLIENT_ID!,
    redirectUri: process.env.NEXT_PUBLIC_URL + '/api/oauth/exchange',
    apiKey: process.env.NEXT_NYLAS_API_KEY!,
    apiUri: process.env.NEXT_NYLAS_API_URI!
};
