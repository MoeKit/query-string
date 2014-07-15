var qs = require('index');
var expect = require('expect');

var normalCases = [
    [ 'foo=bar', { 'foo': 'bar' }, 'foo=bar' ]
    ,
    [ 'foo=1&bar=2', { 'foo': '1', 'bar': '2' }, 'foo=1&bar=2' ]
    ,
    [ 'foo%3Dbaz=bar', { 'foo=baz': 'bar' }, 'foo%3Dbaz=bar' ]
    ,
    [ 'foo=baz=bar', { 'foo': 'baz=bar'}, 'foo=baz%3Dbar' ]
    ,
    [ ' foo = bar ', { 'foo': 'bar' }, 'foo=bar' ]
    ,
    [ 'foo', { 'foo': '' }, 'foo=' ]
    ,
    [ 'foo=', { 'foo': '' }, 'foo=' ]
    ,
    [ 'foo=&bar=2', { 'foo': '', bar: '2' }, 'foo=&bar=2' ]
];

var arrayCases = [
    [ 'foo=1&foo=2', { 'foo': ['1', '2'] } ]
    ,
    [ 'foo[]=1&foo[]=2', { 'foo': ['1', '2'] } ]
    ,
    [ 'foo%5B%5D=1&foo%5B%5D=2', { 'foo': ['1', '2'] } ]
    ,
    [ 'foo=1&foo%5B%5D=2&foo[]=3', { 'foo': ['1', '2', '3'] } ]
    ,
    [ 'foo[]=1', { foo: ['1'] } ]
];

var separatorCases = [
    [ ',', ':', 'foo:1,bar:2', { 'foo': '1', 'bar': '2' }, 'foo:1,bar:2' ]
    ,
    [ ';;', '::', 'foo::1;;foo::2', { 'foo': ['1', '2'] }, 'foo::1;;foo::2' ]
    ,
    [ ';', ':', 'foo:1&bar:2;bar:2', { 'foo': '1&bar:2', 'bar': '2' }, 'foo:1%26bar%3A2;bar:2' ]
    ,
    [ ';', ':', 'foo%3Abaz:bar', { 'foo:baz': 'bar' }, 'foo%3Abaz:bar' ]
    ,
    [ ';', ':', 'foo:baz:bar', { 'foo': 'baz:bar' }, 'foo:baz%3Abar' ]
];

var weirdCases = [
    [ '', { } ]
    ,
    [ '&', { '': ['', ''] } ]
    ,
    [
        'weird+field=q1%212%22%27w%245%267%2Fz8%29%3F',
        { 'weird field': 'q1!2"\'w$5&7/z8)?' }
    ]
    ,
    [ 'foo=%E9%9B%95', { 'foo': '雕' } ]
    ,
    [ 'foo=中文', { 'foo': '中文' } ]
    ,
    [
        'hasOwnProperty=1&toString=2',
        { 'hasOwnProperty': '1', 'toString': '2' }
    ]
];

var weirdObjects = [
    [ null, '' ]
    ,
    [
        {},
        ''
    ]
    ,
    [ undefined, '' ]
    ,
    [ 'string', '' ]
    ,
    [ '', '' ]
    ,
    [ function () {
    }, '' ]
    ,
    [ document, '' ]
    ,
    [ document.lastChild, '' ]
    ,
    [
        { regexp: /./g },
        'regexp='
    ]
    ,
    [
        { regexp: new RegExp('.', 'g') },
        'regexp='
    ]
    ,
    [
        { fn: function () {
        } },
        'fn='
    ]
    ,
    [
        { fn: new Function('') },
        'fn='
    ]
    ,
    [
        { 'math': Math },
        'math='
    ]
    ,
    [
        { d: new Date() },
        'd='
    ]
    ,
    [
        { d: Date },
        'd='
    ]
    ,
    [
        { f: new Boolean(false), t: new Boolean(true) },
        'f=&t='
    ]
    ,
    [
        { f: false, t: true },
        'f=false&t=true'
    ]
];

// Sets some bad thing, hia hia...
// Object.prototype['notExisted'] = 1;


describe('QueryString.parse', function () {

    it('should deserialize a query string to an object.', function () {
        for (var i = 0; i < normalCases.length; i++) {
            expect(qs.parse(normalCases[i][0])).to.eql(normalCases[i][1]);
        }
    });

    it('should work properly when the key is array.', function () {
        for (var i = 0; i < arrayCases.length; i++) {
            expect(qs.parse(arrayCases[i][0])).to.eql(arrayCases[i][1]);
        }
    });

    it('should work properly when sep and eq are overridden.', function () {
        for (var i = 0; i < separatorCases.length; i++) {
            var t = separatorCases[i];
            expect(qs.parse(t[2], t[0], t[1])).to.eql(t[3]);
        }
    });

    it('should work properly when the query string is weird.', function () {
        for (var i = 0; i < weirdCases.length; i++) {
            expect(qs.parse(weirdCases[i][0])).to.eql(weirdCases[i][1]);
        }

        var ex;
        try {
            qs.parse('foo=%u96D5');
        } catch (x) {
            ex = x;
        }
        expect(ex).not.to.be(undefined);
    });

    it('should trim ^? and ^&', function() {
        expect(qs.parse('?a=b&c=d').a).to.eql('b');
        expect(qs.parse('&a=b&c=d').a).to.eql('b');
    });

});


describe('QueryString.stringify', function () {

    it('should serialize an object to a query string.', function () {
        for (var i = 0; i < normalCases.length; i++) {
            expect(qs.stringify(normalCases[i][1])).to.eql(normalCases[i][2]);
        }
    });

    it('should work properly when the key is array.', function () {

        expect(qs.stringify({ foo: ['1', '2'] })).to.eql('foo=1&foo=2');

        expect(qs.stringify({ foo: ['1', '2'] }, null, null, true))
            .to.eql('foo%5B%5D=1&foo%5B%5D=2');

    });

    it('should work properly when sep and eq are overridden.', function () {
        for (var i = 0; i < separatorCases.length; i++) {
            var t = separatorCases[i];
            expect(qs.stringify(t[3], t[0], t[1])).to.eql(t[4]);
        }
    });

    it('should work properly when the object is weird.', function () {
        for (var i = 0; i < weirdObjects.length; i++) {
            expect(qs.stringify(weirdObjects[i][0])).to.eql(weirdObjects[i][1]);
        }
    });

});

