import axios from 'axios'
export async function run() {
  await axios('http://localhost:8000')
}
