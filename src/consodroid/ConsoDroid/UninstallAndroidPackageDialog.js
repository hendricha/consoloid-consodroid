defineClass('ConsoDroid.UninstallAndroidPackageDialog', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
{
  handleArguments: function(args, expression)
  {
    this.__base(args, expression);
    this.get("apk_manager").callAsync("uninstall", [ this.arguments.package.entity.packageName ], {
      success: function(data) {
        this.showSuccess();
      }.bind(this),
      error: this.showError.bind(this)
    });
  },
}
);
