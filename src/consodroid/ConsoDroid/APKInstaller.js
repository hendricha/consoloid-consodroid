defineClass('ConsoDroid.APKInstaller', 'Consoloid.FileList.Server.AuthorizingService',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
        cryptoModule: require("crypto")
      }, options));
    },

    install: function(res, apk)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_READ, apk)) return;

      if (!this.fsModule.existsSync(apk)) {
        this.sendError(this.res, "FILEEXISTS");
        return;
      }
      var requestsFolderPath = this.get('resource_loader').getParameter('consoDroid.apkInstaller.requestsFolder');
      var current_date = (new Date()).valueOf().toString();
      var hash = this.cryptoModule.createHash('sha1').update(current_date + apk).digest('hex');
      this.fsModule.writeFileSync(requestsFolderPath + "/" + hash, apk);

      this._respond(null, { result: true });
    }
  }
);
