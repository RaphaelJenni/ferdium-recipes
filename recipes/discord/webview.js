const _path = _interopRequireDefault(require('path'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

module.exports = (Ferdium, settings) => {
  const getMessages = () => {
    let directCount = 0;
    const directCountPerServer = document.querySelectorAll(
      '[class*="lowerBadge-"] [class*="numberBadge-"]',
    );

    for (const directCountBadge of directCountPerServer) {
      directCount += Ferdium.safeParseInt(directCountBadge.textContent);
    }

    const indirectCountPerServer = document.querySelectorAll(
      '[class*="modeUnread-"]',
    ).length;

    Ferdium.setBadge(directCount, indirectCountPerServer);
  };

  Ferdium.loop(getMessages);

  Ferdium.injectCSS(_path.default.join(__dirname, 'service.css'));

  // TODO: This whole block is duplicated between the 'discord' and 'skype' recipes - reuse
  document.addEventListener(
    'click',
    event => {
      const link = event.target.closest('a[href^="http"]');
      const button = event.target.closest('button[title^="http"]');

      if (link || button) {
        const url = link
          ? link.getAttribute('href')
          : button.getAttribute('title');

        if (url.includes('views/imgpsh_fullsize_anim')) {
          event.preventDefault();
          event.stopPropagation();
          // TODO: Can we send an ipc event 'open-browser-window' to open the child window? (see the slack recipe for how to send an ipc message)
          // TODO: Can we change the slack recipe to add a clickHandler for screensharing/video calls? (https://github.com/ferdium/ferdium-app/issues/1697)
          let win = new Ferdium.BrowserWindow({
            width: 800,
            height: window.innerHeight,
            minWidth: 600,
            webPreferences: {
              partition: `persist:service-${settings.id}`,
              // TODO: Aren't these needed here?
              // contextIsolation: false,
            },
          });
          win.loadURL(url);
          win.on('closed', () => {
            win = null;
          });
        }
      }
    },
    true,
  );
};
