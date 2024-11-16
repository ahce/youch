/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dump, themes } from '@poppinss/dumper/html'
import type { ParsedError, StackFrame } from 'youch-core/types'

import { BaseComponent } from '../../component.js'
import { ErrorStackProps } from '../../types.js'

/**
 * Known editors and their URLs to open the file within
 * the code editor
 */
const EDITORS: Record<string, string> = {
  textmate: 'txmt://open?url=file://%f&line=%l',
  macvim: 'mvim://open?url=file://%f&line=%l',
  emacs: 'emacs://open?url=file://%f&line=%l',
  sublime: 'subl://open?url=file://%f&line=%l',
  phpstorm: 'phpstorm://open?file=%f&line=%l',
  atom: 'atom://core/open/file?filename=%f&line=%l',
  vscode: 'vscode://file/%f:%l',
}

/**
 * Displays the formatted and raw error stack along with the
 * source code for individual stack frames
 */
export class ErrorStack extends BaseComponent<ErrorStackProps> {
  cssFile = new URL('./style.css', import.meta.url)
  scriptFile = new URL('./script.js', import.meta.url)

  /**
   * Light weight HTML escape helper
   */
  #htmlEscape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/\\"/g, '&bsol;&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  /**
   * Returns the file's relative name from the CWD
   */
  #getRelativeFileName(filePath: string) {
    return filePath.replace(`${process.cwd()}/`, '')
  }

  /**
   * Returns the index of the frame that should be expanded by
   * default
   */
  #getFirstExpandedFrameIndex(frames: StackFrame[]) {
    /**
     * Finding the first app frame that should be expanded by default
     */
    let expandAtIndex = frames.findIndex((frame) => frame.type === 'app')

    /**
     * In-case there is no app frame, we will expand one of the module's
     * frame.
     */
    if (expandAtIndex === -1) {
      expandAtIndex = frames.findIndex((frame) => frame.type === 'module')
    }

    return expandAtIndex
  }

  /**
   * Returns the link to open the file within known code
   * editors
   */
  #getEditorLink(ide: string, frame: StackFrame): { href?: string; text: string } {
    const editorURL = EDITORS[ide] || ide
    if (!editorURL || frame.type === 'native') {
      return {
        text: this.#getRelativeFileName(frame.fileName!),
      }
    }

    return {
      href: editorURL.replace('%f', frame.fileName!).replace('%l', String(frame.lineNumber)),
      text: this.#getRelativeFileName(frame.fileName!),
    }
  }

  /**
   * Returns the HTML fragment for the frame location
   */
  #renderFrameLocation(frame: StackFrame, id: string, ide: string) {
    const { text, href } = this.#getEditorLink(ide, frame)
    const fileName = `<a ${href ? `href="${href}"` : ''} class="stack-frame-filepath" title="${text}">
      ${this.#htmlEscape(text)}
    </a>`
    const functionName = frame.functionName
      ? `<span>in <code title="${frame.functionName}">
        ${this.#htmlEscape(frame.functionName)}
      </code></span>`
      : ''
    const loc = `<span>at line <code>${frame.lineNumber}:${frame.columnNumber}</code></span>`

    if (frame.type === 'native') {
      return `<div class="stack-frame-location">
        ${fileName} ${functionName} ${loc}
      </div>`
    }
    return `<button class="stack-frame-location" onclick="toggleFrameSource(event, '${id}')">
      ${fileName} ${functionName} ${loc}
    </button>`
  }

  /**
   * Returns HTML fragment for the stack frame
   */
  async #renderStackFrame(
    frame: StackFrame,
    index: number,
    expandAtIndex: number,
    props: ErrorStackProps
  ) {
    const id = `frame-${index + 1}`
    const label = frame.type === 'app' ? '<span class="frame-label">In App</span>' : ''
    const expandedClass = expandAtIndex === index ? 'expanded' : ''

    return `<li class="stack-frame ${expandedClass} stack-frame-${frame.type}" id="${id}">
      <div class="stack-frame-contents">
        ${this.#renderFrameLocation(frame, id, props.ide)}
        <div class="stack-frame-extras">${label}</div>
      </div>
      <div class="stack-frame-source">
        ${await props.sourceCodeRenderer(props.error, frame)}
      </div>
    </li>`
  }

  async render(props: ErrorStackProps): Promise<string> {
    const frames = await Promise.all(
      props.error.frames.map((frame, index) => {
        return this.#renderStackFrame(
          frame,
          index,
          this.#getFirstExpandedFrameIndex(props.error.frames),
          props
        )
      })
    )

    return `<section>
      <div class="card">
        <div class="card-heading">
          <div>
            <h3 class="card-title">
              Stack Trace
            </h3>
          </div>
          <div>
            <div class="toggle-switch">
              <button onclick="showFormattedFrames(this)" class="active"> Pretty </button>
              <button onclick="showRawFrames(this)"> Raw </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div id="stack-frames-formatted" class="visible">
            <ul id="stack-frames">
              ${frames.join('\n')}
            </ul>
          </div>
          <div id="stack-frames-raw">
            ${dump(props.error.raw, { styles: themes.cssVariables, expand: true })}
          </div>
        </div>
      </div>
    </section>`
  }
}
