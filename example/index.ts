import { createServer } from 'node:http'
import cookie from 'cookie'
import { Youch } from '../src/youch.js'
import { getUser } from './get_user.js'
import { readFile } from './flydrive.js'

const HTTP_STATUSES = [
  {
    code: 202,
    pharse: 'Accepted',
  },
  {
    code: 502,
    pharse: 'Bad Gateway',
  },
  {
    code: 400,
    pharse: 'Bad Request',
  },
  {
    code: 409,
    pharse: 'Conflict',
  },
  {
    code: 100,
    pharse: 'Continue',
  },
  {
    code: 201,
    pharse: 'Created',
  },
  {
    code: 417,
    pharse: 'Expectation Failed',
  },
  {
    code: 424,
    pharse: 'Failed Dependency',
  },
  {
    code: 403,
    pharse: 'Forbidden',
  },
  {
    code: 504,
    pharse: 'Gateway Timeout',
  },
  {
    code: 410,
    pharse: 'Gone',
  },
  {
    code: 505,
    pharse: 'HTTP Version Not Supported',
  },
  {
    code: 418,
    pharse: "I'm a teapot",
  },
  {
    code: 419,
    pharse: 'Insufficient Space on Resource',
  },
  {
    code: 507,
    pharse: 'Insufficient Storage',
  },
  {
    code: 500,
    pharse: 'Internal Server Error',
  },
  {
    code: 411,
    pharse: 'Length Required',
  },
  {
    code: 423,
    pharse: 'Locked',
  },
  {
    code: 420,
    pharse: 'Method Failure',
  },
  {
    code: 405,
    pharse: 'Method Not Allowed',
  },
  {
    code: 301,
    pharse: 'Moved Permanently',
  },
  {
    code: 302,
    pharse: 'Moved Temporarily',
  },
  {
    code: 207,
    pharse: 'Multi-Status',
  },
  {
    code: 300,
    pharse: 'Multiple Choices',
  },
  {
    code: 511,
    pharse: 'Network Authentication Required',
  },
  {
    code: 204,
    pharse: 'No Content',
  },
  {
    code: 203,
    pharse: 'Non Authoritative Information',
  },
  {
    code: 406,
    pharse: 'Not Acceptable',
  },
  {
    code: 404,
    pharse: 'Not Found',
  },
  {
    code: 501,
    pharse: 'Not Implemented',
  },
  {
    code: 304,
    pharse: 'Not Modified',
  },
  {
    code: 200,
    pharse: 'OK',
  },
  {
    code: 206,
    pharse: 'Partial Content',
  },
  {
    code: 402,
    pharse: 'Payment Required',
  },
  {
    code: 308,
    pharse: 'Permanent Redirect',
  },
  {
    code: 412,
    pharse: 'Precondition Failed',
  },
  {
    code: 428,
    pharse: 'Precondition Required',
  },
  {
    code: 102,
    pharse: 'Processing',
  },
  {
    code: 103,
    pharse: 'Early Hints',
  },
  {
    code: 426,
    pharse: 'Upgrade Required',
  },
  {
    code: 407,
    pharse: 'Proxy Authentication Required',
  },
  {
    code: 431,
    pharse: 'Request Header Fields Too Large',
  },
  {
    code: 408,
    pharse: 'Request Timeout',
  },
  {
    code: 413,
    pharse: 'Request Entity Too Large',
  },
  {
    code: 414,
    pharse: 'Request-URI Too Long',
  },
  {
    code: 416,
    pharse: 'Requested Range Not Satisfiable',
  },
  {
    code: 205,
    pharse: 'Reset Content',
  },
  {
    code: 303,
    pharse: 'See Other',
  },
  {
    code: 503,
    pharse: 'Service Unavailable',
  },
  {
    code: 101,
    pharse: 'Switching Protocols',
  },
  {
    code: 307,
    pharse: 'Temporary Redirect',
  },
  {
    code: 429,
    pharse: 'Too Many Requests',
  },
  {
    code: 401,
    pharse: 'Unauthorized',
  },
  {
    code: 451,
    pharse: 'Unavailable For Legal Reasons',
  },
  {
    code: 422,
    pharse: 'Unprocessable Entity',
  },
  {
    code: 415,
    pharse: 'Unsupported Media Type',
  },
  {
    code: 305,
    pharse: 'Use Proxy',
  },
  {
    code: 421,
    pharse: 'Misdirected Request',
  },
]

createServer(async (req, res) => {
  try {
    await readFile()
  } catch (error) {
    const statusCode = error.status ?? 500
    const status = HTTP_STATUSES.find((httpStatus) => httpStatus.code === statusCode)
    const youch = new Youch({ title: status?.pharse })
    youch.metadata.group('Request', {
      headers: Object.keys(req.headers).map((header) => {
        return {
          key: header,
          value:
            header === 'cookie' ? { ...cookie.parse(req.headers[header]!) } : req.headers[header],
        }
      }),
    })

    const html = await youch.render(error)
    res.writeHead(statusCode, { 'content-type': 'text/html' })
    res.write(html)
    res.end()
  }
}).listen(3000)
