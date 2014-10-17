require('consoloid-server/Consoloid/Server/Service');
require('consoloid-filelist/Consoloid/FileList/Server/MockAccessAuthorizer.js');
require('../AccessAuthorizer.js');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('ConsoDroid.AccessAuthorizer', function() {
  var
    authorizer,
    resourceLoader,
    socket,
    fs;

  beforeEach(function() {
    fs = {
      writeFileSync: sinon.stub(),
      readFileSync: sinon.stub(),
      existsSync: sinon.stub().returns(true),
    };

    resourceLoader = {
      getParameter: sinon.stub()
    };
    resourceLoader.getParameter.withArgs("file.list.defaultFolder").returns("/the/public/path");
    resourceLoader.getParameter.withArgs("file.accessAuthorizer.accessControlFolder").returns("/accessControlPath");
    env.addServiceMock("resource_loader", resourceLoader);

    socket = {
      handshake: {
        address: {
          address: "IP.ADD.RE.SS"
        }
      }
    };

    authorizer = env.create(ConsoDroid.AccessAuthorizer, { fsModule: fs });
  });

  describe("#authorize(operation, path)", function() {
    it("should put the access control file to the correct place with the client address if it does not exist yet", function() {
      fs.existsSync.returns(false);
      authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_READ, "/the/public/path/some.file", socket);

      fs.existsSync.calledWith("/accessControlPath/IP.ADD.RE.SS").should.be.ok;
      fs.writeFileSync.calledWith("/accessControlPath/IP.ADD.RE.SS", "").should.be.ok;
    });

    it("should allow only reading from the public folder when user is not authorized", function() {
      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_READ, "/the/public/path/some.file", socket);
      }).should.not.throwError();

      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_WRITE, "/the/public/path/some.file", socket);
      }).should.throwError();
    });

    it("should not allow reading and wrting from non pulbic folder when user is not authorized", function() {
      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_READ, "/some/other/path", socket);
      }).should.throwError();

      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_WRITE, "/some/other/path", socket);
      }).should.throwError();
    });

    it("should allow reading and writing to any folder if access control file has the right content", function() {
      fs.readFileSync.returns("true");
      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_READ, "/some/other/path", socket);
      }).should.not.throwError();

      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_WRITE, "/some/other/path", socket);
      }).should.not.throwError();

      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_READ, "/the/public/path/some.file", socket);
      }).should.not.throwError();

      (function() {
        authorizer.authorize(ConsoDroid.AccessAuthorizer.OPERATION_WRITE, "/the/public/path/some.file", socket);
      }).should.not.throwError();
    });
  });
});
