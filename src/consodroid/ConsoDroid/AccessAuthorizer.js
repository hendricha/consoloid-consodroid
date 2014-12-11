defineClass('ConsoDroid.AccessAuthorizer', 'Consoloid.FileList.Server.MockAccessAuthorizer',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
      }, options));
    },

    authorize: function(operation, object, socket)
    {
      if (this.__sessionIsAuthorized(socket)) {
        return;
      }

      if ((operation == this.__self.OPERATION_FILE_READ) && this.__pathIsPublic(object)) {
        return;
      }

      switch(operation) {
        case this.__self.OPERATION_FILE_READ:
        case this.__self.OPERATION_FILE_WRITE:
          throw new Error(__("Unauthorized file access"));

        case this.__self.OPERATION_LIST_ANDROID_APPLICATIONS:
        case this.__self.OPERATION_UNINSTALL_ANDROID_APPLICATIONS:
          throw new Error(__("Listing and uninstalling Android applications is unauthorized"));

        default:
          throw new Error(__("Unknown operation requested authorization"));
      }
    },

    __sessionIsAuthorized: function(socket)
    {
      var accessControlPath = this.get('resource_loader').getParameter('file.accessAuthorizer.accessControlFolder');

      var address = socket.handshake ? socket.handshake.address.address : (socket.remoteAddress || socket._peername.address);

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
  },
  {
    OPERATION_LIST_ANDROID_APPLICATIONS: 2,
    OPERATION_UNINSTALL_ANDROID_APPLICATIONS: 3
  }
);
