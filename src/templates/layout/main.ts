/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseComponent } from '../../component.js'

/**
 * Layout component renders the HTML structure for the document
 * along with the styles for the global elements.
 *
 * You can define a custom Layout if you want to modify the HTML
 * structure or the CSS variables for the colors.
 */
export class Layout extends BaseComponent<{
  title: string
  children: () => string | Promise<string>
}> {
  cssFile = new URL('./style.css', import.meta.url)
  scriptFile = new URL('./script.js', import.meta.url)

  async render(props: Layout['$props']): Promise<string> {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title}</title>
        <!-- STYLES -->
        <!-- SCRIPTS -->
      </head>
      <body>
        <div id="layout">
          ${await props.children()}
        </div>
      </body>
    </html>`
  }
}
