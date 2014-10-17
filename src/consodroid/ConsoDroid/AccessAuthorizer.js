defineClass('ConsoDroid.AccessAuthorizer', 'Consoloid.FileList.Server.MockAccessAuthorizer',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
      }, options));
    },

    authorize: function(operation, path, socket)
    {
      if (this.__sessionIsAuthorized(socket)) {
        return;
      }

      if ((operation == this.__self.OPERATION_READ) && this.__pathIsPublic(path)) {
        return;
      }

      throw new Error("Unauthorized file access");
    },

    __sessionIsAuthorized: function(socket)
    {
      var accessControlPath = this.get('resource_loader').getParameter('file.accessAuthorizer.accessControlFolder');
      var accessControlFile = (accessControlPath + "/" + socket.handshake.address.address)
      if (!this.fsModule.existsSync(accessControlFile)) {
        this.fsModule.writeFileSync(accessControlFile, "");
      }

      if (this.fsModule.readFileSync(accessControlFile) == "true") {
        return true;
      }

      return false;
    },

    __pathIsPublic: function(path)
    {
      var publicPath = this.get('resource_loader').getParameter('file.list.defaultFolder');
      return path.indexOf(publicPath) == 0;
    }
  }
);
