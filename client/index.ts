import {ModuleApp} from "@owd-client/core/index"
import terminalStore from './store'
import terminalStoreInstance from './storeInstance/index';
import terminalConfig from '~/../config/terminal-xterm/config.json'

// window components
import WindowXterm from './windows/WindowXterm.vue'
import('xterm/css/xterm.css')

export default class TerminalModule extends ModuleApp {
  setup() {
    return {
      name: "terminal-xterm",
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

  setupStore() {
    return terminalStore
  }

  setupStoreInstance(context) {
    return terminalStoreInstance(context)
  }

  setupCommands({store}) {
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