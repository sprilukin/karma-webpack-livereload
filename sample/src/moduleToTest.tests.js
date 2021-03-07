const moduleToTest = require('./moduleToTest');

it("should test moduleToTest", function() {
    expect(moduleToTest(1, 1)).toBe(2);
});
