defineClass('ConsoDroid.ApplicationList.DataSource', 'Consoloid.Ui.List.DataSource.Array',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        data: [],
        dataReady: false
      }, options));
    },

    _setFilterValues: function(callback, filterValues)
    {
      if (!this.dataReady) {
        this.get("installed_android_application_lister").callAsync(
          "listApplications",
          [],
          {
            success: function(data) {
              this.data = data;
              this.dataReady = true;
              this.__addContextObjects();
              this.__generateFilteredIndexes(filterValues);
              callback(undefined);
            }.bind(this),
            error: function(error) {
              callback(error);
            }
          }
        );
        return;
      }

      this.__generateFilteredIndexes(filterValues);
      callback(undefined);
    },

    __addContextObjects: function()
    {
      var
      context = this.container.get('context');
      this.data.forEach(function(item) {
        context.add(this.create('ConsoDroid.Context.AndroidApplication', {
          name: item.label,
          packageName: item.name,
          container: this.container
        }));
      }.bind(this));
    },

    __generateFilteredIndexes: function(filterValues)
    {
      this.filteredDataIndexes = [];
      this.data.forEach(function(item, index) {
        this.filteredDataIndexes.push(index);
      }.bind(this));

      this.__sortIndexes();
    },

    __sortIndexes: function()
    {
      this.filteredDataIndexes
        .sort(function(a, b) {
          return this.data[a].label < this.data[b].label ? -1 : +1;
        }.bind(this));
    },
  }
);
