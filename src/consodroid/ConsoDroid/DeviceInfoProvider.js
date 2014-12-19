defineClass('ConsoDroid.DeviceInfoProvider', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
      }, options));
    },

    getInfo: function(res)
    {
      var infoFile = this.container.get("resource_loader").getParameter("consoDroid.deviceInfoProvider.infoFile");

      this.fsModule.readFile(infoFile, function(err, contents) {
        if (err) {
          return this.sendError(res, err);
        }

        this.sendResult(res, JSON.parse(contents));
      }.bind(this));
    }
  }
);
