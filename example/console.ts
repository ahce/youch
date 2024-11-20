import { run as axios } from './axios.js'
import { Youch } from '../src/youch.js'

try {
  await axios()
} catch (error) {
  const youch = new Youch()
  const output = await youch.print(error)
  console.log(output)
}
