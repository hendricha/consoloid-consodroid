defineClass('ConsoDroid.Welcome', 'Consoloid.Ui.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: 'ConsoDroid-Welcome'
      }, options));
    },

    setup: function()
    {
      this.get("dialogLauncher").startFromText(__("Show file view"));
      this.__base();
    },

    render: function()
    {
      this.__base();
      this.get("device_info_provider").callAsync(
        "getInfo",
        [],
        {
          success: function(info) {
            this.node.find('.product').text(info.product);
            this.node.find('.operator').text(info.operator);

            if (info.batteryPercentage < 10) {
              this.node.find('.ui.battery.progress').addClass("red");
            }
            this.node.find('.ui.battery.progress .bar')
              .width(info.batteryPercentage + "%")
              .text(info.batteryPercentage + "%");

            var diskPercenteage = (info.diskInfo.size - info.diskInfo.availableSpace) / info.diskInfo.size * 100;
            if (diskPercenteage > 90) {
              this.node.find('.ui.disk.progress').addClass("red");
            }
            this.node.find('.ui.disk.progress .bar')
              .width(diskPercenteage + "%")
              .text(Math.round(diskPercenteage) + "%");

            this.node.find('.disk.info.label').text(__("%availableSpace%MB free out of %size%MB", {
              "%size%": info.diskInfo.size,
              "%availableSpace%": info.diskInfo.availableSpace,
            }));
          }.bind(this),
          error: function(error) {
            console.log(error);
          }
        }
      );
      return this;
    }
  }
);
