'use babel'

import { Emitter } from 'atom'
import { getBreakpoint, getBreakpoints, getBreakpointByID } from './store-helper'

export default class Debugger extends Emitter {
  constructor (store, connection, addOutputMessage) {
    super()

    this._connection = connection
    this._addOutputMessage = addOutputMessage
    this._store = store
    this._stopPromise = null

    this.updateState = this.updateState.bind(this)
  }

  dispose () {
    this.stop()
  }

  /**
   * Starts a new debugging session.
   * @param  {object} config The config used to start the debugger.
   * @param  {string} file   The file to debug
   * @return {Promise}
   */
  start (config, file) {
    if (this.isStarted()) {
      return Promise.resolve()
    }

    this.emit('start', {})

    this._store.dispatch({ type: 'SET_STATE', state: 'starting' })

    // start the debugger
    this._addOutputMessage('debug', `Starting delve with config "${config.name}"\n`)

    return this._connection.start({ config, file })
      .then((session) => {
        this._addOutputMessage('debug', `Started delve with config "${config.name}"\n`)
        this._store.dispatch({ type: 'SET_STATE', state: 'started' })

        this._session = session

        return Promise.all(
          getBreakpoints(this._store).map((bp) => {
            return this.addBreakpoint(bp.file, bp.line)
          })
        ).then(() => {
          // TODO if !config.stopOnEntry
          return this.resume()
        })
      })
      .catch((err) => {
        this._addOutputMessage('debug', `Failed to start delve with config "${config.name}"\r\n  Error: ${err}\n`)
        return this.stop()
      })
  }

  /**
   * Stops a debugging session.
   * @return {Promise}
   */
  stop () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }
    if (!this._session) {
      return Promise.resolve()
    }
    if (!this._stopPromise) {
      // the debugger is currently running the program
      // so halt it before we can stop it
      const requiresHalt = this.isBusy()
      this._stopPromise = this._session.stop(requiresHalt)
        .then(() => {
          this._store.dispatch({ type: 'STOP' })
          this._stopPromise = null
        })
    }
    return this._stopPromise
  }

  /**
   * Adds a new breakpoint to the given file and line
   * @param {string} file
   * @param {number} line
   * @return {Promise}
   */
  addBreakpoint (file, line) {
    if (!this.isStarted()) {
      this._store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file, line, state: 'notStarted' } })
      return Promise.resolve()
    }

    const bp = getBreakpoint(this._store, file, line)
    if (bp && bp.state === 'busy') {
      // already being added
      return Promise.resolve()
    }

    const fileAndLine = `${file}:${line + 1}`
    this._addOutputMessage('debug', `Adding breakpoint @ ${fileAndLine}\n`)
    this._store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file, line, state: 'busy' } })
    return this._addBreakpoint(file, line)
      .then(({ id: delveID }) => {
        this._addOutputMessage('debug', `Added breakpoint @ ${fileAndLine}\n`)
        this._store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file, line, delveID, state: 'valid' } })
      })
      .catch((err) => {
        this._addOutputMessage('debug', `Adding breakpoint @ ${fileAndLine} failed!\r\n  Error: ${err}\n`)
        this._store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file, line, state: 'invalid', message: err } })
      })
  }
  _addBreakpoint (file, line) {
    return this._session.addBreakpoint({ file, line })
  }

  /**
   * Removes a breakpoint set on the given file and line
   * @param {string} file
   * @param {number} line
   * @return {Promise}
   */
  removeBreakpoint (id) {
    const bp = getBreakpointByID(this._store, id)
    if (!bp) {
      return Promise.resolve()
    }
    const { state, file, line } = bp

    const done = () => {
      this._store.dispatch({ type: 'REMOVE_BREAKPOINT', bp: { id, state: 'removed' } })
    }

    if (state === 'invalid' || !this.isStarted()) {
      return Promise.resolve().then(done)
    }

    const fileAndLine = `${file}:${line + 1}`
    this._addOutputMessage('debug', `Removing breakpoint @ ${fileAndLine}\n`)
    this._store.dispatch({ type: 'REMOVE_BREAKPOINT', bp: { id, state: 'busy' } })
    return this._removeBreakpoint(bp)
      .then(() => this._addOutputMessage('debug', `Removed breakpoint @ ${fileAndLine}\n`))
      .then(done)
      .catch((err) => {
        this._addOutputMessage('debug', `Removing breakpoint @ ${fileAndLine} failed!\r\n  Error: ${err}\n`)
        this._store.dispatch({ type: 'REMOVE_BREAKPOINT', bp: { id, state: 'invalid', message: err } })
      })
  }
  _removeBreakpoint (bp) {
    return this._session.removeBreakpoint({ id: bp.delveID })
  }

  /**
   * Adds or removes a breakpoint for the given file and line.
   * @param {string} file
   * @param {number} line
   * @return {Promise}
   */
  toggleBreakpoint (file, line) {
    const bp = getBreakpoint(this._store, file, line)
    if (!bp) {
      return this.addBreakpoint(file, line)
    }
    return this.removeBreakpoint(bp.id)
  }

  updateBreakpointLine (id, newLine) {
    // remove and add the breakpoint, this also updates the store correctly
    const bp = getBreakpointByID(this._store, id)
    this.removeBreakpoint(id).then(() => this.addBreakpoint(bp.file, newLine))
  }

  /**
   * Resumes the current debugger.
   * @return {Promise}
   */
  resume () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.resume()
    ).then(this.updateState)
  }

  /**
   * Step the current debugger to the next line.
   * @return {Promise}
   */
  next () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.next()
    ).then(this.updateState)
  }

  /**
   * Step the current debugger into the current function/instruction.
   * @return {Promise}
   */
  stepIn () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.stepIn()
    ).then(this.updateState)
  }

  /**
   * Step the current debugger out of the current function/instruction.
   * @return {Promise}
   */
  stepOut () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.stepOut()
    ).then(this.updateState)
  }

  updateState (newState) {
    if (newState.exited) {
      return this.stop()
    }
    return this.getGoroutines() // get the new goroutines
      .then(() => this.selectGoroutine(newState.goroutineID)) // select the current goroutine
      .then(() => this.selectStacktrace(0)) // reselect the first stacktrace entry
  }

  /**
   * Restarts the current debugger.
   * @return {Promise}
   */
  restart () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }
    return this._session.restart().then(() => {
      this._store.dispatch({ type: 'RESTART' })
      // immediately start the execution (like "start" does)
      this.resume()
    })
  }

  /**
   * Selects the given stacktrace of the current debugger.
   * @param  {number} index The selected index within the stacktrace
   * @return {Promise}
   */
  selectStacktrace (index) {
    if (this._store.getState().delve.selectedStacktrace === index) {
      // no need to change
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.selectStacktrace({ index })
    ).then(() => {
      this._store.dispatch({ type: 'SET_SELECTED_STACKTRACE', index })
    })
  }

  /**
   * Selects the given goroutine of the current debugger.
   * @param  {string|number} id The id of the selected goroutine
   * @return {Promise}
   */
  selectGoroutine (id) {
    if (!this.isStarted()) {
      return Promise.resolve()
    }
    if (this._store.getState().delve.selectedGoroutine === id) {
      // no need to change
      return this.getStacktrace(id)
    }

    return this._busy(
      () => this._session.selectGoroutine({ id })
    ).then(() => {
      this._store.dispatch({ type: 'SET_SELECTED_GOROUTINE', id })
      return this.getStacktrace(id)
    })
  }

  getStacktrace (goroutineID) {
    if (!this.isStarted()) {
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.getStacktrace({ goroutineID })
    ).then((stacktrace) => {
      this._store.dispatch({ type: 'UPDATE_STACKTRACE', stacktrace })
    })
  }

  getGoroutines () {
    if (!this.isStarted()) {
      return Promise.resolve()
    }

    return this._busy(
      () => this._session.getGoroutines()
    ).then((goroutines) => {
      this._store.dispatch({ type: 'UPDATE_GOROUTINES', goroutines })
    })
  }

  _busy (fn) {
    this._store.dispatch({ type: 'SET_STATE', state: 'busy' })
    return fn().then((v) => {
      this._store.dispatch({ type: 'SET_STATE', state: 'waiting' })
      return v
    })
  }

  /**
   * Loads the variables for the given path.
   * @param  {string} path     The path of the variable to load
   * @param  {object} variable The variable
   * @return {Promise}
   */
  loadVariable (path, variable) {
    this._store.dispatch({ type: 'SET_STATE', state: 'busy' })
    return this._session.loadVariable({ path, variable }).then((variables) => {
      this._store.dispatch({
        type: 'UPDATE_VARIABLES',
        // updating variable at this path ...
        path,
        // ... resulted in the following variables
        variables,
        // add it to current selected stacktrace entry
        stacktraceIndex: this._store.getState().delve.selectedStacktrace,
        state: 'waiting'
      })
    })
  }

  /**
   * Returns `true` if the given debugger is started, `false` otherwise.
   * @return {boolean}
   */
  isStarted () {
    const state = this.getState()
    return state !== 'notStarted' && state !== 'starting'
  }

  isBusy () {
    return this.getState() === 'busy'
  }

  getState () {
    return this._store.getState().delve.state
  }
}
