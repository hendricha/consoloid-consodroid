defineClass('ConsoDroid.InstallAPKDialog', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
{
  handleArguments: function(args, expression)
  {
    this.__base(args, expression);

    this.describe(this.arguments.apk.value, function() {
      this.showError(this.get("translator").trans("Path did not exist."));
    }.bind(this), function() {
        this.get("apk_manager").callAsync("install", [ this.arguments.apk.value ], {
        success: function(data) {
          this.showSuccess();
        }.bind(this),
        error: this.showError.bind(this)
      });
    }.bind(this), function() {
      this.showError(this.get("translator").trans("Path is not a file."));
    }.bind(this));
  },
}
);
