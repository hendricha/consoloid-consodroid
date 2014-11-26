require('consoloid-server/Consoloid/Server/Service');
require('consoloid-filelist/Consoloid/FileList/Server/AuthorizingService.js');
require('consoloid-filelist/Consoloid/FileList/Server/MockAccessAuthorizer.js');
require('../APKInstaller.js');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('ConsoDroid.APKInstaller', function() {
  var
    installer,
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
      getParameter: sinon.stub().withArgs("consoDroid.apkInstaller.requestsFolder").returns("/apkInstallerRequests")
    };
    env.addServiceMock("resource_loader", resourceLoader);

    authorizer = {
      authorize: sinon.stub(),
      __self: {
        OPERATION_READ: 0,
        OPERATION_WRITE: 1
      }
    }
    env.addServiceMock("file.access.authorizer", authorizer);

    installer = env.create(ConsoDroid.APKInstaller, { fsModule: fs });

    installer.sendResult = sinon.stub();
    installer.sendError = sinon.stub();
  });

  describe("#install(res, apk)", function() {
    it("should put a new file to the folder containing the path", function() {
      installer.install(res, "/the/path/of/some.apk");

      fs.writeFileSync.calledOnce.should.be.ok;
      fs.writeFileSync.args[0][0].length.should.be.ok;
      fs.writeFileSync.args[0][1].should.equal("/the/path/of/some.apk\n");

      installer.sendResult.calledWith(res, { result: true }).should.be.ok;
    });

    it("should check if apk exists", function() {
      fs.existsSync.returns(false);
      installer.install(res, "/the/path/of/some.apk");

      fs.writeFileSync.called.should.not.be.ok;
      installer.sendError.calledWith(res).should.be.ok;
    });

    it("should always create new files", function() {
      installer.install(res, "/the/path/of/some.apk");
      installer.install(res, "/the/path/of/some.apk");

      fs.writeFileSync.calledTwice.should.be.ok;
      fs.writeFileSync.args[0][0].length.should.be.ok;
      fs.writeFileSync.args[0][1].should.equal("/the/path/of/some.apk\n");
      fs.writeFileSync.args[1][0].length.should.be.ok;
      fs.writeFileSync.args[1][1].should.equal("/the/path/of/some.apk\n");

      fs.writeFileSync.args[0][0].should.not.equal(fs.writeFileSync.args[0][1]);
    });

    it("should send error if reading from file isn't authorized", function() {
      authorizer.authorize.throws();
      installer.install(res, "/the/path/of/some.apk");

      authorizer.authorize.calledWith(Consoloid.FileList.Server.MockAccessAuthorizer.OPERATION_READ).should.be.ok;
      installer.sendError.calledWith(res).should.be.ok;
    });
  });
});
