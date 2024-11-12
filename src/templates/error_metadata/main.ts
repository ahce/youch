/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dump, themes } from '@poppinss/dumper/html'

import { Metadata } from '../../metadata.js'
import { ErrorMetadataRow } from '../../types.js'
import { BaseComponent } from '../../component.js'

const PRIMITIVES = ['string', 'boolean', 'number', 'undefined']

/**
 * Displays the error metadata as cards
 */
export class ErrorMetadata extends BaseComponent<{
  metadata: Metadata
}> {
  /**
   * Formats the error row value
   */
  #formatRowValue(value: any, dumpValue?: boolean) {
    if (dumpValue === true) {
      return dump(value, { styles: themes.cssVariables })
    }

    if (PRIMITIVES.includes(typeof value) || value === null) {
      return value
    }

    return dump(value, { styles: themes.cssVariables })
  }

  /**
   * Returns HTML fragment with HTML table containing rows
   * metadata section rows
   */
  #renderRows(rows: ErrorMetadataRow[]) {
    return `<table class="card-table">
      <tbody>
        ${rows
          .map((row) => {
            return `<tr>
            <td class="table-key">${row.key}</td>
            <td class="table-value">
              ${this.#formatRowValue(row.value, row.dump)}
            </td>
          </tr>`
          })
          .join('\n')}
      </tbody>
    </table>`
  }

  /**
   * Renders each section with its rows inside a table
   */
  #renderSection(section: string, rows: ErrorMetadataRow | ErrorMetadataRow[]) {
    return `<div>
      <h4 class="card-subtitle">${section}</h4>
      ${Array.isArray(rows) ? this.#renderRows(rows) : this.#formatRowValue(rows.value, rows.dump)}
    </div>`
  }

  /**
   * Renders each group as a card
   */
  #renderGroup(
    group: string,
    sections: { [section: string]: ErrorMetadataRow | ErrorMetadataRow[] }
  ) {
    return `<div class="card">
      <div class="card-heading">
        <h3 class="card-title">${group}</h3>
      </div>
      <div class="card-body">
        ${Object.keys(sections)
          .map((section) => {
            return this.#renderSection(section, sections[section])
          })
          .join('\n')}
      </div>
    </div>`
  }

  /**
   * Renders erorr metadata groups
   */
  async render(props: ErrorMetadata['$props']): Promise<string> {
    const groups = props.metadata.toJSON()
    return `<section>
      ${Object.keys(groups)
        .map((group) => {
          return this.#renderGroup(group, groups[group])
        })
        .join('\n')}
    </section>`
  }
}
