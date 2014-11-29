defineClass('ConsoDroid.ApplicationList.InstalledAndroidApplicationLister', 'Consoloid.FileList.Server.AuthorizingService',
  {
    listApplications: function(res)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_LIST_ANDROID_APPLICATIONS, null)) return;

      var listFile = this.container.get("resource_loader").getParameter("consoDroid.installedAndroidApplicationLister.listFile");
      this.fsModule.readFile(listFile, function(err, contents) {
        if (err) {
          return this.sendError(err);
        }

        this.sendResult(JSON.parse(contents));
      }.bind(this));
    }
  }
);
