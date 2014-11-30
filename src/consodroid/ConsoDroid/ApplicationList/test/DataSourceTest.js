require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Ui/List/DataSource/Base');
require('consoloid-console/Consoloid/Ui/List/DataSource/Array');
require('consoloid-console/Consoloid/Interpreter/Token');
require('consoloid-console/Consoloid/Interpreter/Tokenizable');
require('consoloid-console/Consoloid/Context/Object');
require('../../Context/AndroidApplication.js');

require('../DataSource.js');
describeUnitTest('ConsoDroid.ApplicationList.DataSource', function() {
  var
  dataSource,
  applicationList,
  callback,
  context;

  beforeEach(function() {
    context = {
      add: sinon.stub()
    };
    env.addServiceMock("context", context);

    applicationList = {
      callAsync: sinon.stub()
    };
    env.addServiceMock("installed_android_application_list", applicationList);

    dataSource = env.create(ConsoDroid.ApplicationList.DataSource, { });

    callback = sinon.stub();
  });

  describe("#setFilterValues(callback, filterValues, fromIndex, toIndex)", function() {
    beforeEach(function() {
      dataSource.setFilterValues(callback, {}, 0, 3);
    });

    it("should get data from server if it isn't ready yet", function() {
      applicationList.callAsync.calledOnce.should.be.ok;
      applicationList.callAsync.calledWith('listApplications', []);

      applicationList.callAsync.args[0][2].success(["hu.hendricha.consodroid", "hu.uniobuda.nik.bab03t"]);

      callback.calledWith(undefined, { data: ["hu.hendricha.consodroid", "hu.uniobuda.nik.bab03t"], count: 2 }).should.be.ok;

      dataSource.setFilterValues(callback, {}, 0, 1);

      applicationList.callAsync.calledOnce.should.be.ok;
      callback.calledTwice.should.be.ok;
    });

    it("should add all apps to the context", function() {
      applicationList.callAsync.args[0][2].success(["hu.hendricha.consodroid", "hu.uniobuda.nik.bab03t"]);

      context.add.args[0][0].name.should.equal("hu.hendricha.consodroid");
      (context.add.args[0][0] instanceof(ConsoDroid.Context.AndroidApplication)).should.be.ok;

      context.add.args[1][0].name.should.equal("hu.uniobuda.nik.bab03t");
      (context.add.args[1][0] instanceof(ConsoDroid.Context.AndroidApplication)).should.be.ok;
    });

    it("should work with remote error", function() {
      applicationList.callAsync.args[0][2].error("OMG, THE ERRORS! THEY ARE MULTIPLYING!");

      callback.calledWith("OMG, THE ERRORS! THEY ARE MULTIPLYING!").should.be.ok;
    });

    it("should sort data in case insensitive alphabetical order", function() {
      applicationList.callAsync.args[0][2].success(["hu.hendricha.consodroid", "com.dsemu.drastic"]);

      callback.calledWith(undefined, { data: ["com.dsemu.drastic", "hu.hendricha.consodroid"], count: 2 }).should.be.ok;
    });
  });
});
