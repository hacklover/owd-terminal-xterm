import {ModuleApp} from "@owd-client/core/index"
import terminalStore from './store'
import terminalStoreInstance from './storeInstance/index';
import terminalConfig from '~/../config/terminal-xterm/config.json'

// window components
import WindowXterm from './windows/WindowXterm.vue'
import('xterm/css/xterm.css')

export default class TerminalModule extends ModuleApp {
  loadModule() {
    return {
      name: "terminal-xterm",
      version: "2.0.0-alpha",
      license: "MIT",
      homepage: "https://github.com/hacklover/owd-terminal-xterm",
      author: {
        name: "hacklover",
        url: "https://github.com/hacklover"
      },
      singleton: false,
      config: terminalConfig,
      windows: [
        {
          component: WindowXterm,
          name: "WindowXterm",
          category: "utilities",
          title: "Terminal",
          icon: {
            name: "mdi-console-line",
            offset: {
              y: -1
            }
          },
          menu: true,
          minimized: false,
          resizable: true,
          maximizable: true,
          size: {
            width: 480,
            height: 320
          },
          position: {
            x: -1,
            y: 0,
            z: 0
          },
          theme: {
            noContentSpacing: true
          }
        }
      ]
    }
  }

  loadStore() {
    return terminalStore
  }

  loadStoreInstance(context) {
    return terminalStoreInstance(context)
  }

  loadCommands({store}) {
    return {
      /*
      'help': function (t, args) {
        t.writeln('\r\n\r\nHello there!')
      },
       */
      'xterm': function () {
        store.dispatch('core/window/windowCreate', 'WindowXterm');
      }
    }
  }
}