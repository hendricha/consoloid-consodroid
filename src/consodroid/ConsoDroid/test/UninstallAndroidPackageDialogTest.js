require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/Expression");
require("consoloid-console/Consoloid/Ui/MultiStateDialog");
require("consoloid-console/Consoloid/Ui/Volatile/Dialog");
require("consoloid-filelist/Consoloid/FileList/Dialog/FileOperation/Abstract");
require("../UninstallAndroidPackageDialog");

require('consoloid-server/Consoloid/Server/Service');
require('consoloid-filelist/Consoloid/FileList/Server/AuthorizingService.js');
require("consoloid-filelist/Consoloid/FileList/Server/BasicOperations");

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('ConsoDroid.UninstallAndroidPackageDialog', function() {
  var
  dialog,
  expr,
  manager,
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

    manager = {
      callAsync: sinon.stub()
    };
    env.addServiceMock('apk_manager', manager);

    dialog = env.create(ConsoDroid.UninstallAndroidPackageDialog, {
      __addToVolatileContainer: sinon.stub(),
      render: sinon.stub()
    });
  });

  describe("#handleArguments(args, expression)", function() {
    it("should atempt to uninstall package", function() {
      dialog.handleArguments({ package: { value: "some.package" } }, expr);

      manager.callAsync.firstCall.calledWith('uninstall', ["some.package"]).should.be.true;

      manager.callAsync.args[0][2].success({ result: true });

      manager.callAsync.calledOnce.should.be.true;

      dialog.activeState.should.equal("success");
    });
  });
});
