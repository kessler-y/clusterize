clusterize
==========

a simple node cluster helper

```
clusterize(function() {
    console.log('worker');
}, 0.5);
 
on a 4 cores system will (eventually) print 'worker' twice;
```