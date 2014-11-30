defineClass('ConsoDroid.Context.AndroidApplication', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      return new ConsoDroid.Context.AndroidApplication({
        name: str,
        container: container
      });
    }
  }
);
