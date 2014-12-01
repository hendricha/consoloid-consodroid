require('consoloid-server/Consoloid/Server/Service');
require('consoloid-filelist/Consoloid/FileList/Server/AuthorizingService.js');
require('consoloid-filelist/Consoloid/FileList/Server/MockAccessAuthorizer.js');
require('../APKManager.js');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('ConsoDroid.APKManager', function() {
  var
    manager,
    resourceLoader,
    res = {},
    authorizer,
    fs;

  beforeEach(function() {
    fs = {
      writeFileSync: sinon.stub(),
      existsSync: sinon.stub().returns(true)
    };

    resourceLoader = {
      getParameter: sinon.stub().withArgs("consoDroid.apkManager.requestsFolder").returns("/apkManagerRequests")
    };
    env.addServiceMock("resource_loader", resourceLoader);

    authorizer = {
      authorize: sinon.stub(),
      __self: {
        OPERATION_FILE_READ: 0,
        OPERATION_UNINSTALL_ANDROID_APPLICATIONS: 3
      }
    }
    env.addServiceMock("file.access.authorizer", authorizer);

    manager = env.create(ConsoDroid.APKManager, { fsModule: fs });

    manager.sendResult = sinon.stub();
    manager.sendError = sinon.stub();
  });

  describe("#install(res, apk)", function() {
    it("should put a new file to the folder containing the path", function() {
      manager.install(res, "/the/path/of/some.apk");

      fs.writeFileSync.calledOnce.should.be.ok;
      fs.writeFileSync.args[0][0].length.should.be.ok;
      fs.writeFileSync.args[0][0].indexOf("install-").should.equal(20);
      fs.writeFileSync.args[0][1].should.equal("/the/path/of/some.apk\n");

      manager.sendResult.calledWith(res, { result: true }).should.be.ok;
    });

    it("should check if apk exists", function() {
      fs.existsSync.returns(false);
      manager.install(res, "/the/path/of/some.apk");

      fs.writeFileSync.called.should.not.be.ok;
      manager.sendError.calledWith(res).should.be.ok;
    });

    it("should always create new files", function() {
      manager.install(res, "/the/path/of/some.apk");
      manager.install(res, "/the/path/of/some.apk");

      fs.writeFileSync.calledTwice.should.be.ok;
      fs.writeFileSync.args[0][0].length.should.be.ok;
      fs.writeFileSync.args[0][1].should.equal("/the/path/of/some.apk\n");
      fs.writeFileSync.args[1][0].length.should.be.ok;
      fs.writeFileSync.args[1][1].should.equal("/the/path/of/some.apk\n");

      fs.writeFileSync.args[0][0].should.not.equal(fs.writeFileSync.args[0][1]);
    });

    it("should send error if reading from file isn't authorized", function() {
      authorizer.authorize.throws();
      manager.install(res, "/the/path/of/some.apk");

      authorizer.authorize.calledWith(Consoloid.FileList.Server.MockAccessAuthorizer.OPERATION_FILE_READ).should.be.ok;
      manager.sendError.calledWith(res).should.be.ok;
    });
  });

  describe("#uninstall(res, packageName)", function() {
    it("should put a new file to the folder containing the path", function() {
      manager.uninstall(res, "some.package");

      fs.writeFileSync.calledOnce.should.be.ok;
      fs.writeFileSync.args[0][0].length.should.be.ok;
      fs.writeFileSync.args[0][0].indexOf("uninstall-").should.equal(20);
      fs.writeFileSync.args[0][1].should.equal("some.package\n");

      manager.sendResult.calledWith(res, { result: true }).should.be.ok;
    });

    it("should always create new files", function() {
      manager.uninstall(res, "some.package");
      manager.uninstall(res, "some.package");

      fs.writeFileSync.calledTwice.should.be.ok;
      fs.writeFileSync.args[0][0].length.should.be.ok;
      fs.writeFileSync.args[0][1].should.equal("some.package\n");
      fs.writeFileSync.args[1][0].length.should.be.ok;
      fs.writeFileSync.args[1][1].should.equal("some.package\n");

      fs.writeFileSync.args[0][0].should.not.equal(fs.writeFileSync.args[0][1]);
    });

    it("should send error if user isn't authorized", function() {
      authorizer.authorize.throws();
      manager.uninstall(res, "some.package");

      authorizer.authorize.calledWith(authorizer.__self.OPERATION_UNINSTALL_ANDROID_APPLICATIONS).should.be.ok;
      manager.sendError.calledWith(res).should.be.ok;
    });
  });
});
