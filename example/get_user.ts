// import pg from 'pg'
import axios from 'axios'

// const { Client } = pg
// const client = new Client({
//   user: 'postgres',
// })
// await client.connect()

export async function getUser() {
  await axios('http://localhost:8000')
}
