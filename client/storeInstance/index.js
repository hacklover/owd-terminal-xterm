import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import LocalEchoController from 'xterm-addon-local-echo';

export default function ({ terminal }) {
  return {
    state: {
      window: null,
      instance: null,
      instanceFit: null,
      instanceLocalEcho: null
    },

    mutations: {
      SET_WINDOW(state, window) {
        state.window = window
      },
      SET_INSTANCE(state, instance) {
        // map execCommand method
        instance.execCommand = (command, args) => {
          return terminal.execCommand(state.instance, command, args)
        }

        // assign window to xterm instance
        instance.window = state.window

        state.instance = instance
      },
      SET_INSTANCE_FIT(state, fit) {
        state.instanceFit = fit
      },
      SET_INSTANCE_LOCAL_ECHO(state, localEcho) {
        state.instanceLocalEcho = localEcho
      }
    },

    actions: {
      async create({commit,dispatch,rootState}, window) {
        const consoleId = window.uniqueName

        const xtermOptions = rootState['terminal-xterm'].options
        const xterm = new Terminal(xtermOptions)

        if (xterm) {
          // spawn xterm
          xterm.open(document.getElementById(consoleId))

          // fit addon
          const xtermFitAddon = new FitAddon()
          xterm.loadAddon(xtermFitAddon)

          // web links addon
          xterm.loadAddon(new WebLinksAddon())

          // local echo addon
          const xtermLocalEcho = new LocalEchoController()
          xterm.loadAddon(xtermLocalEcho)

          // set window
          commit('SET_WINDOW', window.instance)

          // set plugin instances
          commit('SET_INSTANCE_FIT', xtermFitAddon)
          commit('SET_INSTANCE_LOCAL_ECHO', xtermLocalEcho)

          // set xterm instance
          commit('SET_INSTANCE', xterm)

          await dispatch('reset')
        }
      },
      destroy({state}) {
        if (!state.instance) {
          return console.error('Unable to destroy terminal')
        }

        state.instance.destroy()
      },
      async read({state, rootState}) {
        state.instanceLocalEcho
          .read(
            rootState['terminal-xterm'].options.prompt + ' ',
            rootState['terminal-xterm'].options.prompt + ' ',
            async (xterm, input) => {
              const args = input.split(' ')

              if (args.length > 0) {
                if (terminal.hasCommand(args[0])) {
                  const commandName = args[0]

                  // remove first command from args array
                  args.shift()

                  await terminal.execCommand(xterm, commandName, args)
                }
              }
            }
          )
      },
      focus({state}) {
        if (!state.instance) {
          return console.error('Unable to focus terminal')
        }

        state.instance.focus()
      },
      blur({state}) {
        if (!state.instance) {
          return console.error('Unable to blur terminal')
        }

        state.instance.blur()
      },
      fit({state}) {
        state.instanceFit.fit()
      },
      async reset({state, dispatch, rootGetters}) {
        if (!state.instance) {
          return false
        }

        state.instance.reset()
        state.instance.writeln(rootGetters['terminal-xterm/greeting'])

        await dispatch('read')
      }
    }
  }
}