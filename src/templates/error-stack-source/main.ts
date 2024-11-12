/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { extname } from 'node:path'
import type { ParsedError, StackFrame } from 'youch-core/types'
import { highlightText, type ShjLanguage } from '@speed-highlight/core'

import { BaseComponent } from '../../component.js'

/**
 * Known languages where we expect the errors to happen. All other source
 * files will be rendered as plain text with no color highlighting.
 */
const LANGS_MAP: Record<string, ShjLanguage> = {
  '.tsx': 'ts',
  '.jsx': 'js',
  '.js': 'js',
  '.ts': 'ts',
  '.css': 'css',
  '.json': 'json',
  '.html': 'html',
  '.astro': 'ts',
  '.vue': 'ts',
}

/**
 * Pretty prints the stack frame source code with syntax
 * highlighting.
 */
export class ErrorStackSource extends BaseComponent<{
  error: ParsedError
  frame: StackFrame
}> {
  cssFile = new URL('./style.css', import.meta.url)

  async render(props: ErrorStackSource['$props']): Promise<string> {
    const frame = props.frame

    /**
     * Do not render the source code when the frame type is
     * native or we are missing the source/filename
     */
    if (frame.type === 'native' || !frame.source || !frame.fileName) {
      return ''
    }

    /**
     * Choose the language based on the file extension, or fallback
     * to the plain language.
     */
    const language = LANGS_MAP[extname(frame.fileName)] ?? 'plain'

    /**
     * Get the margin top value for the highlighted line. We compute this
     * by getting the highlighted line index * (the height of the line)
     */
    const highlightMarginTop = `${
      frame.source.findIndex((chunk) => {
        return chunk.lineNumber === frame.lineNumber
      }) * 24
    }px`

    /**
     * HTML fragment for the highlighted line
     */
    const highlight = `<div class="line-highlight" style="margin-top: ${highlightMarginTop}"></div>`

    /**
     * Highlighting code snippet
     */
    let code = await highlightText(
      frame.source.map((chunk) => chunk.chunk).join('\n'),
      language,
      true
    )

    /**
     * Since we pull a fragment of lines from the source file, they do not
     * always start from the first line. Therefore, we will have to make
     * some modifications to show the correct line number.
     *
     * For example: If the error happened on line number 40, then the first
     * line in the code snippet might be 35 and hence the line numbers in
     * the highlighted text should start from 35.
     */
    code = code.replace(
      '<div class="shj-numbers">',
      `<div class="shj-numbers" style="counter-set: line ${frame.source[0].lineNumber - 1}">`
    )

    return `<pre><code class="shj-lang-js">${highlight}${code}</code></pre>`
  }
}
