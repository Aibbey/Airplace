export async function discordRequest(endpoint, token, options) {
    const url = 'https://discord.com/api/v10/' + endpoint;

    if (options.body) options.body = JSON.stringify(options.body);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${token}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        ...options
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    return res;
}

export async function registerCommands(appId, token, commands) {
    const endpoint = `applications/${appId}/commands`;

    try {
        await discordRequest(endpoint, token, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
}
