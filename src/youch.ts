/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorParser } from 'youch-core'
import type { Parser, SourceLoader, Transformer } from 'youch-core/types'

import { Metadata } from './metadata.js'
import { Templates } from './templates.js'
import type { YouchOptions } from './types.js'

/**
 * Youch exposes the API to render errors to HTML output
 */
export class Youch {
  #options: YouchOptions
  #errorParser = new ErrorParser()

  constructor(options?: YouchOptions) {
    this.#options = options ?? {}
  }

  /**
   * Manage templates used for converting error to the HTML
   * output
   */
  templates = new Templates(false)

  /**
   * Define metadata to be displayed alongside the error output
   */
  metadata = new Metadata()

  /**
   * Define custom implementation for loading the source code
   * of a stack frame.
   */
  defineSourceLoader(loader: SourceLoader): this {
    this.#errorParser.defineSourceLoader(loader)
    return this
  }

  /**
   * Define a custom parser. Parsers are executed before the
   * error gets parsed and provides you with an option to
   * modify the error
   */
  useParser(parser: Parser): this {
    this.#errorParser.useParser(parser)
    return this
  }

  /**
   * Define a custom transformer. Transformers are executed
   * after the error has been parsed and can mutate the
   * properties of the parsed error.
   */
  useTransformer(transformer: Transformer): this {
    this.#errorParser.useTransformer(transformer)
    return this
  }

  /**
   * Render error to HTML
   */
  async render(error: unknown) {
    const parsedError = await new ErrorParser().parse(error)
    return this.templates.render({
      title: this.#options.title ?? 'An error occurred',
      ide: this.#options.ide ?? process.env.IDE ?? 'vscode',
      error: parsedError,
      metadata: this.metadata,
    })
  }
}
