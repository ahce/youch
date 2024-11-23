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
import { YouchANSIOptions, YouchHTMLOptions, YouchJSONOptions } from './types.js'

/**
 * Youch exposes the API to render errors to HTML output
 */
export class Youch {
  #errorParser = new ErrorParser()

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
   * Parses error to JSON
   */
  async toJSON(error: unknown, options?: YouchJSONOptions) {
    options = { ...options }
    return new ErrorParser({ offset: options.offset }).parse(error)
  }

  /**
   * Render error to HTML
   */
  async toHTML(error: unknown, options?: YouchHTMLOptions) {
    options = { ...options }

    const parsedError = await new ErrorParser({ offset: options.offset }).parse(error)
    return this.templates.toHTML({
      title: options.title ?? 'An error has occurred',
      ide: options.ide ?? process.env.IDE ?? 'vscode',
      cspNonce: options.cspNonce,
      error: parsedError,
      metadata: this.metadata,
    })
  }

  /**
   * Render error to ANSI output
   */
  async toANSI(error: unknown, options?: YouchANSIOptions) {
    options = { ...options }
    const parsedError = await new ErrorParser({ offset: options.offset }).parse(error)

    return this.templates.toANSI({
      title: '',
      error: parsedError,
      metadata: this.metadata,
    })
  }
}
