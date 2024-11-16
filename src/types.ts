/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ParsedError, StackFrame } from 'youch-core/types'
import type { Metadata } from './metadata.js'

export * from 'youch-core/types'

/**
 * Props accepted by the Layout component
 */
export type LayoutProps = {
  title: string
  children: () => string | Promise<string>
}

/**
 * Props accepted by the Error stack source component
 */
export type ErrorStackSourceProps = {
  error: ParsedError
  frame: StackFrame
}

/**
 * Props accepted by the Error stack component
 */
export type ErrorStackProps = {
  error: ParsedError
  ide: string
  sourceCodeRenderer: (error: ParsedError, frame: StackFrame) => Promise<string>
}

/**
 * Props accepted by the Error info component
 */
export type ErrorInfoProps = {
  title: string
  error: ParsedError
}

/**
 * Props accepted by the Error cause component
 */
export type ErrorCauseProps = {
  error: ParsedError
}

/**
 * Props accepted by the Error metadata component
 */
export type ErrorMetadataProps = {
  metadata: Metadata
}

/**
 * Error metadata row represents a key-value pair
 */
export type ErrorMetadataRow = {
  key: string
  dump?: boolean
  value: any
}

/**
 * Representation of Error metadata groups. Each group is
 * a collection of named sections
 */
export type ErrorMetadataGroups = {
  [group: string]: {
    [section: string]: ErrorMetadataRow | ErrorMetadataRow[]
  }
}

/**
 * Set of options accepted by the Youch class constructor
 */
export type YouchOptions = {
  /**
   * Define the offset to skip certain stack frames from
   * the top
   */
  offset?: number

  /**
   * Define the error title. It could be the HTTP status
   * text
   */
  title?: string

  /**
   * Define the name of the IDE in which to open the files when
   * the filename anchor tag is clicked.
   *
   * Following is the list of supported editors
   *
   * - textmate
   * - macvim
   * - emacs
   * - sublime
   * - phpstorm
   * - atom
   * - vscode
   *
   * You can also specify the URL for the editor via the `ide` property. Make
   * sure to specify the placeholders for the filename and the line number
   * as follows.
   *
   * someprotocol://file/%f:%l
   *
   * - %f is the filename placeholder
   * - %l is the line number placeholder
   */
  ide?: string
}
