/*eslint no-underscore-dangle:0 */
window.__karma__.loaded = function () {};

var tests = Object.keys(window.__karma__.files)
    .filter(function (file) { return file.indexOf('.test.js') > 0; });


Promise.all(tests.map(function (test) {
    return System.import(test);
})).then(function () {
    window.__karma__.start();
});
