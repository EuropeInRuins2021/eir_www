const DISCORD_INVITE_CODE = 'J96DekM';

function getDiscordData(sheetName, index) {
    let api = 'https://discord.com/api/v6/invites/' + DISCORD_INVITE_CODE + '?with_counts=true';

    return fetch(api)
        .then(response => response.json())
        .then(json => {
            return {
                'online': json['approximate_presence_count'],
                'total': json['approximate_member_count'],
            }
        })
        .catch(error => console.log('Error loading discord data'));
}

function renderDiscordWidget() {
    document.querySelector(`#discord-widget .invite-link`).setAttribute('href', 'https://discord.com/invite/' + DISCORD_INVITE_CODE);
    getDiscordData().then(members => {
        if (members.total) {
            document.querySelector(`#discord-widget .members-online-count`).innerHTML = members.online;
            document.querySelector(`#discord-widget .members-total-count`).innerHTML = members.total;
        }
    })
}

document.addEventListener("DOMContentLoaded", function (event) {
    renderDiscordWidget();
});
