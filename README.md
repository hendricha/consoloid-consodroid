ConsoDroid Consoloid Application
================================

This is the Consoloid application part of the ConsoDroid project. Consoloid is a node.js based web application framework, that can be used for creating Post-WIMP applications. ConsoDroid is an Android application, that let's you start this node.js application from your Android mobile device.

To start this app manually run the following, after installing the required node modules with npm.

```
node run.js
```

Git pre-push hook
=================

The repo comes with a pre-push for git, that runs the unit tests automatically. To activate it, just run

```
ln -s .pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```
