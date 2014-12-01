defineClass('ConsoDroid.APKManager', 'Consoloid.FileList.Server.AuthorizingService',
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
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_READ, apk)) return;

      if (!this.fsModule.existsSync(apk)) {
        this.sendError(this.res, "FILEEXISTS");
        return;
      }

      this.__createFile("install", apk);

      this._respond(null, { result: true });
    },

    __createFile: function(operationType, package)
    {
      var requestsFolderPath = this.get('resource_loader').getParameter('consoDroid.apkManager.requestsFolder');
      var current_date = (new Date()).valueOf().toString();
      var hash = this.cryptoModule.createHash('sha1').update(current_date + package).digest('hex');
      this.fsModule.writeFileSync(requestsFolderPath + "/" + operationType + "-" + hash, package + "\n");
    },

    uninstall: function(res, package)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_UNINSTALL_ANDROID_APPLICATIONS, package)) return;
      this.__createFile("uninstall", package);

      this._respond(null, { result: true });
    }
  }
);
