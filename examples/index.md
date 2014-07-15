# 演示文档

---

````javascript
seajs.use('index', function(querystring){
    var a = querystring.stringify({a:'b',c:'d'});
    console.log(a);
    var b = querystring.parse(a);
    console.log(b);

    var c = querystring.stringify({a:'b',c:[1,2,3]});
    console.log(c);
});
````
