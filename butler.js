    var RemoteStorage = require('remotestoragejs');
    var config = require('./butler-config');
    var remoteStorage = new RemoteStorage({
        logging: true  // optinally enable debug logs (defaults to false)
    });
    global.remoteStorage = remoteStorage;
    remoteStorage.on('ready', beginApp);
    
    RemoteStorage.Discover(config.userAddress, function (storageURL, storageAPI) {
        console.log('- configuring remote', config.userAddress, storageURL, storageAPI);
        remoteStorage.remote.configure(userAddress, storageURL, storageAPI, config.token);
    });
```

#### on connected

Although you can start using remoteStorage as soon as the ready event files, these events tell us whether/when we've connected to the remote storage target. When we've connected, all changes we make will be automatically synced with our remote.

```javascript
    remoteStorage.on('connected', function() {
        console.log('- connected to remote (syncing will take place)');
    });

    remoteStorage.on('not-connected', function() {
        console.log('- not connected to remote (changes are local-only)');
    });
```    


## Module

#### include

Now let's include our `feeds` module. If the file was placed in our project as `src/remotestorage-feeds.js`, then this is how we'd include it.

```javascript
    require('./src/remotestorage-feeds.js');
```

Currently the modules attach themselves to the global `remotesStorage` object directly, which is why we needed to make it global earlier.

#### claim access

We'll need to claim access to our module in order to use it:

```javascript
    remoteStorage.access.claim('feeds', 'rw');
```

#### on change

To become alerted to our modules change event's (which occurs when our module data has been updated either locally or remotely), we do the following.

```javascript
    remoteStorage.feeds.rssAtom.on('change', function (event) {
        console.log('- received change event: ', event);
    });
```


## Using our module

Now that all of the initialization is in place, let's create the function which will be called when `remoteStorage` fires the `'ready'` event.

```javascript
    function beginApp {
        // create a feed record
        remoteStorage.feeds.rssAtom.create({
            url: 'testurl',
            title: 'this is a test'
        })
        .then(function (feed) {
            console.log('- feed created ', feed);

            // retrieve all feeds
            remoteStorage.feeds.rssAtom.getAll()
            .then(function (feeds) {
                console.log('- all feeds', feeds);
            }, function (error) {
                console.log('*** error fetching all feeds', error);
            });
        });
    }
```


## Complete script

Here's our final script.

```javascript
// initialize remoteStorage
var RemoteStorage = require('remotestoragejs');
var remoteStorage = new RemoteStorage({
    logging: true  // optinally enable debug logs (defaults to false)
});
global.remoteStorage = remoteStorage;

remoteStorage.on('ready', beginApp);

// configure remote
var userAddress = ''; // fill me in
var token = ''; // fill me in
    
RemoteStorage.Discover(userAddress, function (storageURL, storageAPI) {
    console.log('- configuring remote', userAddress, storageURL, storageAPI);
    remoteStorage.remote.configure(userAddress, storageURL, storageAPI, token);
});

remoteStorage.on('connected', function() {
  console.log('- connected to remote (syncing will take place)');
});

remoteStorage.on('not-connected', function() {
  console.log('- not connected to remote (changes are local-only)');
});

// initialize module
require('./src/remotestorage-feeds.js');
remoteStorage.access.claim('feeds', 'rw');

remoteStorage.feeds.rssAtom.on('change', function (event) {
    console.log('- received change event: ', event);
});

function beginApp() {
    // create a feed record
    remoteStorage.feeds.rssAtom.create({
        url: 'testurl',
        title: 'this is a test'
    })
    .then(function (feed) {
        console.log('- feed created ', feed);
        // retrieve all feeds
        remoteStorage.feeds.rssAtom.getAll()
        .then(function (feeds) {
            console.log('- all feeds', feeds);
        }, function (error) {
            console.log('*** error fetching all feeds', error);
        });
    });
}
```


