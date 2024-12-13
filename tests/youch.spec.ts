/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { JSDOM } from 'jsdom'
import { test } from '@japa/runner'
import { Youch } from '../src/youch.js'
import { stripAnsi } from '../src/helpers.js'

test.group('Youch', () => {
  test('convert error toJSON', async ({ assert }) => {
    const parsedError = await new Youch().toJSON(new Error('Something went wrong'))
    assert.equal(parsedError.message, 'Something went wrong')
    assert.equal(parsedError.frames[0].lineNumber, 17)
  })

  test('apply parser to the error', async ({ assert }) => {
    const parsedError = await new Youch()
      .useParser((source) => {
        return new Error('Wrapped', { cause: source })
      })
      .toJSON(new Error('Something went wrong'))

    assert.equal(parsedError.message, 'Wrapped')
    assert.equal((parsedError.cause as any).message, 'Something went wrong')
    assert.equal(parsedError.frames[0].lineNumber, 25)
  })

  test('apply transformer to the error', async ({ assert }) => {
    const parsedError = await new Youch()
      .useTransformer((error) => {
        error.frames = error.frames.filter((frame) => {
          return frame.type === 'app'
        })
      })
      .toJSON(new Error('Something went wrong'))

    assert.lengthOf(parsedError.frames, 1)
  })

  test('convert error to ANSI output', async ({ assert }) => {
    const output = await new Youch().toANSI(new Error('Something went wrong'))
    assert.include(stripAnsi(output), 'at Object.executor (tests/youch.spec.ts:45:45)')
  })

  test('convert error to HTML output', async ({ assert }) => {
    const output = await new Youch().toHTML(new Error('Something went wrong'))
    assert.include(output, 'at Object.executor (tests/youch.spec.ts:51:45)')
  })

  test('display request URL, method and headers as metadata', async ({ assert }) => {
    const html = await new Youch().toHTML(new Error('Something went wrong'), {
      request: {
        url: '/',
        method: 'GET',
        headers: {
          host: 'localhost:3000',
        },
      },
    })

    const { window } = new JSDOM(html)
    const sections: { title: string; contents: string }[] = []
    window.document.querySelectorAll('.card-subtitle').forEach((node) => {
      sections.push({
        title: node.textContent!,
        contents: node.nextElementSibling!.textContent!.replace(/[\s]+/g, ''),
      })
    })

    assert.deepEqual(sections, [
      {
        contents: '/',
        title: 'url',
      },
      {
        contents: 'GET',
        title: 'method',
      },
      {
        contents: `hostlocalhost:3000`,
        title: 'headers',
      },
    ])
  })
})
