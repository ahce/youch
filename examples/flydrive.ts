/*
 * youch
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'

const disk = new Disk(
  new S3Driver({
    credentials: {
      accessKeyId: 'aninvalidaccesskeyidis32charlong',
      secretAccessKey: 'aninvalidaccesskeysecretandis41characterslong',
    },

    /**
     * Make sure the endpoint does not include the
     * bucket name
     */
    endpoint: 'https://b7d56a259a224b185a70dd6e6f77d9c3.r2.cloudflarestorage.com',
    region: 'auto',
    supportsACL: false,

    bucket: 'R2_BUCKET',
    visibility: 'private',
  })
)

export async function run() {
  await disk.get('some-file-name')
}
