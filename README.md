# Rotonde/client

**Rotonde** is a decentralized social network based on an equally *decentralized* application. The two parts of the application are as follows:

- The [client](https://github.com/Rotonde/rotonde-client), the core of the application.
- The [portal](https://github.com/Rotonde/rotonde-portal), the user files, settings and customization.

The client, or *Rotonde Core*, is what contributors need to make improvements on the inner systems of the application. This separation allows for a simpler onboarding and updating flow, where the latest client revision will be seeded automatically (read-only), while the [portal](https://github.com/Rotonde/rotonde-portal) source is all that any simple user needs to maintain.

# WARNING: This is a fork!

I made this fork to improve the new-user experience and potentially the developer experience as well. Notable changes:

1) Using Vue.js instead of handcrafting HTML via vanilla JS
2) Auto-detecting when a user just forked the site and generating all needed assets
3) Using a box model for CSS
4) Reducing the functionality of the operator box in favor of in-place editing

## Setup

### For a new user

- Open @fugi's portal in Beaker
    - dat://65499eed49c2cd528461067ff1d231f062fbcc0e72dd73c6541cef03fd12441a/
- Select "Fork this site", name it your desired username and make the description your bio
- Open your library and click share to get the hash of your feed
- Share your user site hash with people, and paste theirs to follow them.
- **EXTRA** If you already have an instance of the previous version of Rotonde, copy/paste your portal.json and move it into your site root.
- Enjoy!

### For developers

That goal of this tutorial is to have both a local client and portal.

- Clone both repositories in your `~/Sites`
- Create two sites using the [Beaker Browser](https://beakerbrowser.com) and point them to the user/client repositories.
- Update the `portal/index.html` file with your client site hash, found in the Beaker address bar or the *Share* button.
- Update the `client/dat.json` with the client site hash, and the `portal/dat.json` with the portal hash.
- Enjoy!

## Commands

- `dat://000` will follow a portal.
- `undat://000` will unfollow a portal.
- `filter @neauoire` will show your mentions.
- `clear_filter` will clear the filtered feed.
- `edit:name Some_name` will change your display name.
- `edit:desc Some_name` will change your display description.
- `edit:site Some_name` will change your display site.
- `edit:0` will edit your first entry.
- `delete:0` will delete your first entry.

## Runes

- `@` means you seed each other.
- `~` means that they do not see you mention them.
- `$` means that they are a service or a bot.

## Icon

To change your display icon, update the SVG file located at `media/content/icon.svg`. The icon should be a square file for it to display properly. Keep it small. If you update your SVG manually, don't forget to go to *Library -> (Your Rotonde Site)* and press *Review Changes -> Publish*, otherwise your changes wont be seen by anyone!

## Rich content

- `TEXT >> MEDIA_NAME.jpg`, will connect a media filename from `media/content/MEDIA_NAME.jpg`.
