RemoteStorage.defineModule('irc', function(privClient, pubClient) {

  function setConfig(pwd, config) {
    privClient.storeFile('application/json', 'irc-config', 
        sjcl.encrypt(pwd, JSON.stringify(config)));
  }
  function getConfig(pwd) {
    return privClient.getFile('irc-config').then(function(a) {
      a.data = sjcl.decrypt(pwd, a.data);
      return a;
    });
  }
  return {
    exports: {
      setConfig: setConfig,
      getConfig: getConfig
    }
  };
});