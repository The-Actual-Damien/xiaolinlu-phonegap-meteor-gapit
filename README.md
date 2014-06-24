#Meteor GapIt: PhoneGap plugin

*Alpha. Work in progress.* This repository is a component of Meteor GapIt, a solution for wrapping Meteor applications in PhoneGap without using an iframe.

##Installation

    $ phonegap plugin add https://github.com/chriswessels/phonegap-meteor-gapit.git

##Sample index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="format-detection" content="telephone=no" />
    <!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/browse/CB-4323 -->
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
    <link rel="stylesheet" type="text/css" href="css/index.css" />
    <script type="text/javascript">
    __GapItOptions__ = {
      meteorUrl: 'http://telescope.meteor.com'
    };
    </script>
    <script type="text/javascript" src="phonegap.js"></script>
    <script type="text/javascript" src="meteor-gapit.js"></script>
    <title></title>
  </head>
  <body>
    <p>Please wait, loading application...</p>
  </body>
</html>
```

##Contributions

1. Fork this repository.
1. Make your changes, ideally documenting your new code with in-context comments.
1. Submit a pull request with a sane commit message.

##License

The code for this project is released under the MIT License. Please see the `LICENSE` file.
