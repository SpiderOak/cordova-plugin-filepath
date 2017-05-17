var fs = require("fs");
var path = require("path");
var Q;
var glob;

module.exports = function (context) {
    console.log("Detecting broken symlinks.");

    Q = context.requireCordovaModule("q");
    glob = context.requireCordovaModule("glob");

    var deferred = Q.defer();

    glob("platforms/android/src/org/crosswalk/engine/XWalkFileChooser.java", function (err, files) {
        if (err) {
            deferred.reject(err);
        } else {
            files.forEach(function (file) {
                fs.readFile(file, 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    if (/hiddentao/.test(data)) {
                        deferred.resolve();
						return deferred.promise;
                    }
                    var result = data.replace(/if \(results != null\)/g, '            results = Uri.parse(com.hiddentao.cordova.filepath.FilePath.getPath(mActivity, results));\n            if (results != null)');

                    fs.writeFile(file, result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            }
        }
    });
    return deferred.promise;
}