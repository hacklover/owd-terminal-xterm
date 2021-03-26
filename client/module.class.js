import {ModuleApp} from '@owd-client/core'

import terminalStore from './store'
import terminalStoreInstance from './storeInstance/index';

export default class TerminalModule extends ModuleApp {
  constructor(context) {
    super(context)
  }

  loadAssets() {
    require('xterm/css/xterm.css')
  }

  loadStore() {
    return terminalStore
  }

  loadStoreInstance(context) {
    return terminalStoreInstance(context)
  }

  loadCommands({store}) {
    return {
      'help': function (t, args) {
        t.writeln('\r\n\r\nHello there!')
      },
      'xterm': function () {
        store.dispatch('core/window/windowCreate', 'WindowXterm');
      }
    }
  }
}