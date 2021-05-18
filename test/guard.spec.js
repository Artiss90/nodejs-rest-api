const guard = require('../helper/guard')
const { HttpCode } = require('../helper/constants')
const { User } = require('../model/__mocks__/data')
const passport = require('passport')

describe('Unit test: helper/guard', () => {
  const req = { get: jest.fn((header) => `Bearer ${User.token}`), user: User }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((response) => response),
  }
  const next = jest.fn()

  test('run guard with user', () => {
    passport.authenticate = jest.fn((authType, options, callback) => () => {
      callback(null, User)
    })
    guard(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  test('run guard without user', () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, false)
      },
    )
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Unauthorized',
    })
  })

  test('run guard wrong user token', () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, { token: null })
      },
    )
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Unauthorized',
    })
  })
})
