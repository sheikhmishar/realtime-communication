const assert = /** @type {import('assert')} */ (chai.assert)

describe('Views: script', () => {
  describe('Method: inputHasErrors', () => {
    const _inputHasErrors = /** @type {import ('./script').inputHasErrors} */ (inputHasErrors)

    it('Should Pass', () => assert.ok(!_inputHasErrors('pagol')))
    it('Should Return: Username cannot have /', () =>
      assert.strictEqual(_inputHasErrors('pagol/'), 'Username cannot have /'))
    it('Should Return: Username cannot have .', () =>
      assert.strictEqual(_inputHasErrors('pagol.'), 'Username cannot have .'))
    it("Should Return: Username cannot have '", () =>
      assert.strictEqual(_inputHasErrors("pagol'"), "Username cannot have '"))
    it('Should Return: Username cannot have "', () =>
      assert.strictEqual(_inputHasErrors('pagol"'), 'Username cannot have "'))
  })

  describe('Method: intitiateConnection', () => {
    const _intitiateConnection = /** @type {import ('./script').intitiateConnection} */ (intitiateConnection)

    it('Should Not Establish Connection and Return Invalid Socket', () =>
      assert.ok(
        io.connect('ws://localhost:5000/unknown', { reconnectionAttempts: 2 })
          .disconnected
      ))
    it('Should Establish Connection and Return Valid Socket', () =>
      _intitiateConnection().once('connect', () => assert.ok(true)))
  })
})
