'use babel'
/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

import etch from 'etch'
import EtchComponent from './etch-component'
import EtchStoreComponent from './etch-store-component'

import { elementPropInHierarcy, shortenPath } from './utils'

export class Stacktrace extends EtchComponent {
  render () {
    const { selectedStacktrace, stacktrace = [] } = this.props
    const items = stacktrace.map((st, index) => {
      const className = selectedStacktrace === index ? 'selected' : null
      const file = shortenPath(st.file)
      return <div key={index} className={className} dataset={{ index }} onclick={this.handleStacktraceClick}>
        <div>{st.func}</div>
        <div>@ {file}: {st.line + 1}</div>
      </div>
    })
    return <div className='go-debug-panel-stacktrace'>{items}</div>
  }

  handleStacktraceClick (ev) {
    const index = elementPropInHierarcy(ev.target, 'dataset.index')
    if (index) {
      this.props.dbg.selectStacktrace(+index)
    }
  }
}
Stacktrace.bindFns = ['handleStacktraceClick']

export const StacktraceContainer = EtchStoreComponent.create(
  Stacktrace,
  (state) => {
    const { delve } = state
    return {
      stacktrace: delve.stacktrace,
      selectedStacktrace: delve.selectedStacktrace
    }
  }
)
