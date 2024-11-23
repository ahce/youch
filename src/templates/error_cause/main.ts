/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dump, themes } from '@poppinss/dumper/html'
import { dump as dumpCli } from '@poppinss/dumper/console'

import { colors } from '../../helpers.js'
import { BaseComponent } from '../../component.js'
import { publicDirURL } from '../../public_dir.js'
import type { ErrorCauseProps } from '../../types.js'

/**
 * Displays the Error cause as a formatted value
 */
export class ErrorCause extends BaseComponent<ErrorCauseProps> {
  cssFile = new URL('./error_cause/style.css', publicDirURL)

  /**
   * The toHTML method is used to output the HTML for the
   * web view
   */
  async toHTML(props: ErrorCause['$props']): Promise<string> {
    if (!props.error.cause) {
      return ''
    }

    return `<section>
      <div class="card">
        <div class="card-heading">
          <div>
            <h3 class="card-title">
              Error Cause
            </h3>
          </div>
        </div>
        <div class="card-body">
          <div id="error-cause">
            ${dump(props.error.cause, {
              cspNonce: props.cspNonce,
              styles: themes.cssVariables,
              inspectObjectPrototype: false,
              inspectStaticMembers: false,
              inspectArrayPrototype: false,
            })}
          </div>
        </div>
      </div>
    </section>`
  }

  /**
   * The toANSI method is used to output the text for the console
   */
  async toANSI(props: ErrorCauseProps) {
    if (!props.error.cause) {
      return ''
    }

    /**
     * Relying on "YOUCH_CAUSE" environment variable to decide
     * how deep the properties should be displayed
     */
    let depth = process.env.YOUCH_CAUSE ? Number(process.env.YOUCH_CAUSE) : 2
    if (Number.isNaN(depth)) {
      depth = 2
    }

    return `\n\n${colors.red('[CAUSE]')}\n${dumpCli(props.error.cause, {
      depth,
      inspectObjectPrototype: false,
      inspectStaticMembers: false,
      inspectArrayPrototype: false,
    })}`
  }
}
