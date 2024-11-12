/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Metadata } from '../src/metadata.js'

test.group('Metadata', () => {
  test('define a metadata group', ({ expect }) => {
    const metadata = new Metadata()
    metadata.group('Request', {
      headers: [
        {
          key: 'host',
          value: 'localhost:3000',
        },
      ],
    })

    expect(metadata.toJSON()).toEqual({
      Request: {
        headers: [
          {
            key: 'host',
            value: 'localhost:3000',
          },
        ],
      },
    })
  })

  test('merge new sections within existing group', ({ expect }) => {
    const metadata = new Metadata()
    metadata.group('Request', {
      headers: [
        {
          key: 'host',
          value: 'localhost:3000',
        },
      ],
    })
    metadata.group('Request', {
      body: {
        key: 'root',
        value: {
          id: 1,
        },
      },
    })

    expect(metadata.toJSON()).toEqual({
      Request: {
        headers: [
          {
            key: 'host',
            value: 'localhost:3000',
          },
        ],
        body: {
          key: 'root',
          value: {
            id: 1,
          },
        },
      },
    })
  })

  test('merge rows within existing group section', ({ expect }) => {
    const metadata = new Metadata()
    metadata.group('Request', {
      headers: [
        {
          key: 'host',
          value: 'localhost:3000',
        },
      ],
    })
    metadata.group('Request', {
      headers: [
        {
          key: 'connection',
          value: 'keep-alive',
        },
      ],
    })

    expect(metadata.toJSON()).toEqual({
      Request: {
        headers: [
          {
            key: 'host',
            value: 'localhost:3000',
          },
          {
            key: 'connection',
            value: 'keep-alive',
          },
        ],
      },
    })
  })

  test('convert existing section to an array when new sections are merged', ({ expect }) => {
    const metadata = new Metadata()
    metadata.group('Request', {
      headers: {
        key: 'host',
        value: 'localhost:3000',
      },
    })
    metadata.group('Request', {
      headers: {
        key: 'connection',
        value: 'keep-alive',
      },
    })

    expect(metadata.toJSON()).toEqual({
      Request: {
        headers: [
          {
            key: 'host',
            value: 'localhost:3000',
          },
          {
            key: 'connection',
            value: 'keep-alive',
          },
        ],
      },
    })
  })
})
