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

      throw new Error(__("Unauthorized file access"));
    },

    __sessionIsAuthorized: function(socket)
    {
      var accessControlPath = this.get('resource_loader').getParameter('file.accessAuthorizer.accessControlFolder');
      var address = socket.handshake ? socket.handshake.address.address : socket._peername.address;

      var accessControlFile = (accessControlPath + "/" + address)
      if (!this.fsModule.existsSync(accessControlFile)) {
        this.fsModule.writeFileSync(accessControlFile, "");
      }

      if (this.fsModule.readFileSync(accessControlFile).toString().indexOf("true") == 0) {
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
