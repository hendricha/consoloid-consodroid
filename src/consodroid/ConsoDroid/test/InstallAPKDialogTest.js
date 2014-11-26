require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/Expression");
require("consoloid-console/Consoloid/Ui/MultiStateDialog");
require("consoloid-console/Consoloid/Ui/Volatile/Dialog");
require("consoloid-filelist/Consoloid/FileList/Dialog/FileOperation/Abstract");
require("../InstallAPKDialog");

require('consoloid-server/Consoloid/Server/Service');
require('consoloid-filelist/Consoloid/FileList/Server/AuthorizingService.js');
require("consoloid-filelist/Consoloid/FileList/Server/BasicOperations");

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('ConsoDroid.InstallAPKDialog', function() {
  var
  dialog,
  expr,
  installer,
  remoteOperations;

  beforeEach(function() {
    env.addServiceMock('translator', {
      trans: function(str) {
        return str;
      }
    });

    expr = {
      getTextWithArguments: sinon.stub()
    };

    env.addServiceMock('resource_loader', {
      getParameter: sinon.stub()
    });

    installer = {
      callAsync: sinon.stub()
    };
    env.addServiceMock('apk_installer', installer);

    remoteOperations = {
      callAsync: sinon.stub()
    };
    env.addServiceMock('server_operations', remoteOperations);

    dialog = env.create(ConsoDroid.InstallAPKDialog, {
      __addToVolatileContainer: sinon.stub(),
      render: sinon.stub()
    });
  });

  describe("#handleArguments(args, expression)", function() {
    it("should atempt to install apk", function() {
      dialog.handleArguments({ apk: { value: "/something/somefile" } }, expr);

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefile']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      installer.callAsync.firstCall.calledWith('install', ['/something/somefile']).should.be.true;

      installer.callAsync.args[0][2].success({ result: true });

      remoteOperations.callAsync.calledOnce.should.be.true;
      installer.callAsync.calledOnce.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should be able to handle non existing path", function() {
      dialog.handleArguments({ apk: { value: "/something/somefile" }, recursively: { value: false }  }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefile']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.calledOnce.should.be.true;
      installer.callAsync.called.should.not.be.ok;

      dialog.activeState.should.equal("error");
    });

    it("should be able to handle not file path", function() {
      dialog.handleArguments({ apk: { value: "/something/somefile" }, recursively: { value: false }  }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefile']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FOLDER });

      remoteOperations.callAsync.calledOnce.should.be.true;
      installer.callAsync.called.should.not.be.ok;

      dialog.activeState.should.equal("error");
    });
  });
});
