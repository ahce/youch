import pg from 'pg'
const client = new pg.Client({
  user: 'postgres',
})
await client.connect()

export async function run() {
  await client.query('SELECT * FROM users;')
}
