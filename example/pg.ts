/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pg from 'pg'

export async function run() {
  const client = new pg.Client({ user: 'postgres' })
  await client.connect()

  await client.query('SELECT * FROM users;')

  await client.end()
}
