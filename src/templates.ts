/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ParsedError } from 'youch-core/types'
import { createScript, createStyleSheet } from '@poppinss/dumper/html'

import { Metadata } from './metadata.js'
import { BaseComponent } from './component.js'
import { Header } from './templates/header/main.js'
import { Layout } from './templates/layout/main.js'
import { ErrorInfo } from './templates/error-info/main.js'
import { ErrorCause } from './templates/error-cause/main.js'
import { ErrorStack } from './templates/error-stack/main.js'
import { ErrorMetadata } from './templates/error_metadata/main.js'
import { ErrorStackSource } from './templates/error-stack-source/main.js'
import type {
  LayoutProps,
  ErrorInfoProps,
  ErrorCauseProps,
  ErrorStackProps,
  ErrorMetadataProps,
  ErrorStackSourceProps,
} from './types.js'

/**
 * Collection of known templates. Only these templates can be
 * rendered using the Templates collection
 */
export type KnownTemplates = {
  header: BaseComponent
  layout: BaseComponent<LayoutProps>
  errorInfo: BaseComponent<ErrorInfoProps>
  errorStack: BaseComponent<ErrorStackProps>
  errorStackSource: BaseComponent<ErrorStackSourceProps>
  errorCause: BaseComponent<ErrorCauseProps>
  errorMetadata: BaseComponent<ErrorMetadataProps>
}

/**
 * A super lightweight templates collection that allows composing
 * HTML using TypeScript based components with the ability to
 * override the component for a pre-defined template.
 *
 * @example
 * ```ts
 * const templates = new Templates()
 * const html = templates.render(
 *   {
 *     title: 'Internal server error',
 *     error: await new ErrorParser().parse(error)
 *   }
 * )
 *
 * // Override a template
 * class MyHeader extends BaseComponent {
 *   async render() {}
 * }
 *
 * templates.use('header', new MyHeader(templates.devMode))
 * ```
 */
export class Templates {
  #knownTemplates: KnownTemplates
  #styles: Map<string, string> = new Map([['global', createStyleSheet()]])
  #scripts: Map<string, string> = new Map([['global', createScript()]])

  constructor(public devMode: boolean) {
    this.#knownTemplates = {
      layout: new Layout(devMode),
      header: new Header(devMode),
      errorInfo: new ErrorInfo(devMode),
      errorStack: new ErrorStack(devMode),
      errorStackSource: new ErrorStackSource(devMode),
      errorCause: new ErrorCause(devMode),
      errorMetadata: new ErrorMetadata(devMode),
    }
  }

  /**
   * Returns a collection of style and script tags to dump
   * inside the document HEAD.
   */
  #getStylesAndScripts() {
    /**
     * Keeping injected styles separate from the rest of the
     * styles and scripts, so that we can append them at
     * the end
     */
    let injectedStyles: string = ''
    const styles: string[] = []
    const scripts: string[] = []

    this.#styles.forEach((bucket, name) => {
      if (name === 'injected') {
        injectedStyles = `<style id="${name}-styles">${bucket}</style>`
      } else {
        styles.push(`<style id="${name}-styles">${bucket}</style>`)
      }
    })
    this.#scripts.forEach((bucket, name) => {
      scripts.push(`<script id="${name}-script">${bucket}</script>`)
    })

    return { styles: `${styles.join('\n')}\n${injectedStyles}`, scripts: scripts.join('\n') }
  }

  /**
   * Collects styles and scripts for components as we render
   * them.
   */
  async #collectStylesAndScripts(templateName: keyof KnownTemplates) {
    /**
     * Collect styles only once for a given template
     */
    if (!this.#styles.has(templateName)) {
      const styles = await this.#knownTemplates[templateName].getStyles()
      if (styles) {
        this.#styles.set(templateName, styles)
      }
    }

    /**
     * Collect script only once for a given template
     */
    if (!this.#scripts.has(templateName)) {
      const script = await this.#knownTemplates[templateName].getScript()
      if (script) {
        this.#scripts.set(templateName, script)
      }
    }
  }

  /**
   * Renders a known template by its name
   */
  async #renderTmpl<K extends keyof KnownTemplates>(
    templateName: K,
    props: KnownTemplates[K]['$props']
  ): Promise<string> {
    const component: BaseComponent<any> = this.#knownTemplates[templateName]
    if (!component) {
      throw new Error(`Invalid template "${templateName}"`)
    }

    await this.#collectStylesAndScripts(templateName)
    return component.render(props)
  }

  /**
   * Define a custom component to be used in place of the default component.
   * Overriding components allows you control the HTML layout, styles and
   * the frontend scripts of an HTML fragment.
   */
  use<K extends keyof KnownTemplates>(templateName: K, component: KnownTemplates[K]): this {
    this.#knownTemplates[templateName] = component
    return this
  }

  /**
   * Inject custom styles to the document. Injected styles are
   * always placed after the global and the components style
   * tags.
   */
  injectStyles(cssFragment: string): this {
    let injectedStyles = this.#styles.get('injected') ?? ''
    injectedStyles += `\n${cssFragment}`
    this.#styles.set('injected', injectedStyles)
    return this
  }

  /**
   * Returns the HTML output for the given parsed error
   */
  async render(props: { title: string; ide?: string; error: ParsedError; metadata: Metadata }) {
    const html = await this.#renderTmpl('layout', {
      title: props.title,
      children: async () => {
        const header = await this.#renderTmpl('header', undefined)
        const info = await this.#renderTmpl('errorInfo', props)
        const stackTrace = await this.#renderTmpl('errorStack', {
          ide: process.env.EDITOR ?? 'vscode',
          sourceCodeRenderer: (error, frame) => {
            return this.#renderTmpl('errorStackSource', { error, frame })
          },
          ...props,
        })
        const cause = await this.#renderTmpl('errorCause', props)
        const metadata = await this.#renderTmpl('errorMetadata', props)
        return `${header}${info}${stackTrace}${cause}${metadata}`
      },
    })

    const { scripts, styles } = this.#getStylesAndScripts()
    return html.replace('<!-- STYLES -->', styles).replace('<!-- SCRIPTS -->', scripts)
  }
}
