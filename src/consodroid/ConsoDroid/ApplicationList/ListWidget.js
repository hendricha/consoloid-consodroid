defineClass('ConsoDroid.ApplicationList.ListWidget', 'Consoloid.Ui.List.Widget',
  {
    __constructor: function(options)
    {
      this.__base(options);

      console.log(this.__self.index);

      var path = this.container.get("resource_loader").getParameter("consoDroid.installedAndroidApplicationLister.listFile");
      this.get("client_file_watcher_container").watch(this, path, "Application List " + this.__self.index++ );
    },

    watcherEventHappened: function(event, filename)
    {
      this.dataSource.unreadyData();
      this.render();
    },
  }, {
    index: 0
  }
);
