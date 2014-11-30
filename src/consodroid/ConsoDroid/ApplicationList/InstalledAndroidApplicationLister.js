defineClass('ConsoDroid.ApplicationList.InstalledAndroidApplicationLister', 'Consoloid.FileList.Server.AuthorizingService',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
      }, options));
    },

    listApplications: function(res)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_LIST_ANDROID_APPLICATIONS, null)) return;

      var listFile = this.container.get("resource_loader").getParameter("consoDroid.installedAndroidApplicationLister.listFile");

      this.fsModule.readFile(listFile, function(err, contents) {
        if (err) {
          return this.sendError(res, err);
        }

        this.sendResult(res, JSON.parse(contents));
      }.bind(this));
    }
  }
);
