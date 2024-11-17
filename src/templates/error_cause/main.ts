/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dump, themes } from '@poppinss/dumper/html'

import { BaseComponent } from '../../component.js'
import { publicDirURL } from '../../public_dir.js'
import type { ErrorCauseProps } from '../../types.js'

/**
 * Displays the Error cause as a formatted value
 */
export class ErrorCause extends BaseComponent<ErrorCauseProps> {
  cssFile = new URL('./error_cause/style.css', publicDirURL)

  async render(props: ErrorCause['$props']): Promise<string> {
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
            })}
          </div>
        </div>
      </div>
    </section>`
  }
}
