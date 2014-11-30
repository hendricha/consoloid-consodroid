require('consoloid-server/Consoloid/Server/Service');
require('consoloid-filelist/Consoloid/FileList/Server/AuthorizingService.js');
require('../InstalledAndroidApplicationLister.js');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('ConsoDroid.ApplicationList.InstalledAndroidApplicationLister', function() {
  var
    appListJson,
    service,
    asnycQueue,
    fs,
    res;

  describe("#listApplications(res)", function() {
    beforeEach(function() {
      env.addServiceMock('resource_loader', {
        getParameter: sinon.stub().returns("/android/application/list")
      });

      appListJson = JSON.stringify(["hu.hendricha.consodroid", "hu.uniobuda.nik.bab03t", "com.dsemu.drastic"]);

      fs = {
        readFile: sinon.stub().yields(null, appListJson),
      };

      res = {};

      authorizer = {
        authorize: sinon.stub(),
        __self: {
          OPERATION_LIST_ANDROID_APPLICATIONS: 2,
        }
      }
      env.addServiceMock("file.access.authorizer", authorizer);

      service = env.create(ConsoDroid.ApplicationList.InstalledAndroidApplicationLister, { fsModule: fs });

      service.sendResult = sinon.stub();
      service.sendError = sinon.stub();
    });

    it("should authorize operation, and read the application list and then callback with its contents", function() {
      service.listApplications(res);

      authorizer.authorize.calledOnce.should.be.ok;
      authorizer.authorize.calledWith(authorizer.__self.OPERATION_LIST_ANDROID_APPLICATIONS, null).should.be.ok;

      fs.readFile.calledOnce.should.be.ok;
      fs.readFile.calledWith("/android/application/list").should.be.ok;

      service.sendResult.calledWith(res, ["hu.hendricha.consodroid", "hu.uniobuda.nik.bab03t", "com.dsemu.drastic"]).should.be.ok;

      service.sendError.should.not.be.called;
    });

  });
});
