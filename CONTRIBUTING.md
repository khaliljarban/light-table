# Contributing to Light table
Thanks for considering contributing.
With the help of contributors like you, Light table will work better for everyone.

## How can I contribute?

### Fire an issue
We can't test Light table on every browser and device. There are always some edge cases in which Light table may not run properly. 
Fire an issue when it doesn't work for you. This not only helps you,  also prevent others from facing the same issue.
**Notes for firing issues:**
- Before you fire an issue, make sure you update to the latest version of each main version. (e.g. v2.9.4 for version 2)
- Provide the OS and browser version.
- Provide a link or your plugin options.


### Submit a pull request
If you know what's wrong or missing and willing to help :heart: :clap: :+1:, follow the following steps:
- Open your command line tool, go to the target directory, clone this project with `git clone https://github.com/khaliljarban/light-table` command.
- Install  ([Grunt](https://gruntjs.com/)).
- Install Grunt plugins:   grunt-contrib-concat, grunt-contrib-uglify, grunt-contrib-clean, grunt-contrib-connect, grunt-contrib-watch
- Make needed changes in "src/js/*.js", "src/css/*.css". 
- Update index.html 
- Test the project
- Run "grunt dist"
- Test dist folder manually

NOTE: If you don't want to get complicated, just make changes to "src/js/*.js", or "src/css/*.sss" and send a pull request.