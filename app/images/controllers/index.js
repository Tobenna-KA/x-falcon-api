let fs  = require('fs')
let path = require('path')
let formidable = require('formidable')
let im = require('imagemagick')
let User = require('../../user/models')

module.exports.image = {
    NEW_PROFILE_IMAGE: (req, res) => {
        try {
            let form = new formidable.IncomingForm()
            let new_path = path.join(__basedir, 'public') + '/images/'
            let old_path = ''
            let image_path = ''

            form.parse(req, function (err, fields, files) {
                console.log(err)
                if (err) throw err;
                //TODO add id Mongodb OBJECT ID verification
                console.log(fields)
                if (!fields._id || fields._id === 'undefined') return res.status(200).send({
                    auth: true,
                    error: {message: 'Invalid user id'}
                })
                old_path = files.file.path
                // Read the file
                fs.readFile(old_path, function (err, data) {
                    if (err) throw err;
                    console.log('File read!');

                    fs.exists(new_path, async function (exist) {
                        let image_folder = 'public/images/' + fields._id + '/'
                        let promise = new Promise(function (resolve, reject) {
                            do {
                                // console.log(exist, 'exist')
                                new_path = path.join(__basedir, 'public') + '/images/' + fields._id + '/' + files.file.name
                                exist = fs.existsSync(new_path)
                                let mkdirp = require('mkdirp');
                                image_path = '/images/' + fields._id + '/' + files.file.name
                                if (!exist) {
                                    if (!fs.existsSync(image_folder))
                                        mkdirp(image_folder, (err) => {
                                            if (err) reject()
                                            exist = true
                                            resolve()
                                        })
                                    else {
                                        if (err) reject()
                                        exist = true
                                        resolve()
                                    }
                                } else {
                                    fs.unlink(new_path, function (err) {// Delete the file
                                        if (err) throw err;
                                        exist = true
                                        resolve()
                                    });
                                }
                            } while (!exist)
                            if (exist) resolve()
                        })
                        promise.then(() => {
                            // Write the file
                            if (exist)
                                fs.writeFile(new_path, data, function (err) {
                                    if (err) throw err;
                                    // write file to uploads/thumbs folder
                                    im.resize({
                                        srcPath: new_path,
                                        dstPath: new_path,
                                        width: 150
                                    }, function (err, stdout, stderr) {
                                        if (err) throw err;

                                        User.findByIdAndUpdate(fields._id, {
                                            $set: {
                                                profileImg: image_path
                                            }
                                        }, {new: true}, (err, user) => {
                                            // console.log(err, admin)
                                            fs.unlink(old_path, function (err) {// Delete the file
                                                if (err) throw err;
                                                res.status(200).send({
                                                    auth: true,
                                                    error: false,
                                                    message: 'Success!!',
                                                    image_path,
                                                    _id: fields._id
                                                })
                                            });
                                        })
                                    });
                                });
                            else res.status(200).send({auth: true, error: {message: 'Folder does not exist'}})
                        })
                        promise.catch(() => {
                            res.status(200).send({auth: true, error: {message: 'Folder does not exist'}})
                        })

                    })
                });
            })
        } catch (e) {
            console.log(e)
            res.status(200).send({auth: true, error: {'message': 'Something went wrong'}})
        }
    },
    NEW_PROFILE_IMAGE_2: (fields, files, id, callback) => {
        let new_path = path.join(__basedir, 'public') + '/images/'
        let old_path = ''
        let image_path = ''

        //TODO add id Mongodb OBJECT ID verification
        if(!id || id === 'undefined' || !fields.for) callback(false)
        old_path = files.file.path
        // Read the file
        fs.readFile(old_path, function (err, data) {
            if (err) callback(false)

            fs.exists(new_path, async function(exist){
                let image_folder = 'public/images/'+ id + '/'
                let promise = new Promise(function (resolve, reject) {
                    do {
                        new_path = path.join(__basedir, 'public') + '/images/'+ id + '/' + files.file.name
                        exist = fs.existsSync(new_path)
                        let mkdirp = require('mkdirp');
                        image_path = '/images/'+ id + '/' + files.file.name
                        if(!exist){
                            if(!fs.existsSync(image_folder))
                                mkdirp(image_folder, (err) => {
                                    if(err) reject()
                                    exist = true
                                    resolve()
                                })
                            else {
                                if(err) reject()
                                exist = true
                                resolve()
                            }
                        } else {
                            fs.unlink(new_path, function (err) {// Delete the file
                                if (err) reject();
                                exist = true
                                resolve()
                            });
                        }
                    } while(!exist)
                    if(exist) resolve()
                })
                promise.then(() => {
                    // Write the file
                    if(exist)
                        fs.writeFile(new_path, data, function (err) {
                            if (err) callback(false);
                            im.resize({
                                srcPath: new_path,
                                dstPath: new_path,
                                width:   150
                            }, function(err, stdout, stderr) {
                                User.findByIdAndUpdate(id, {
                                    $set: {
                                        profileImg: image_path
                                    }
                                }, {new: true}, (err, user) => {
                                    // console.log(err, admin)
                                    fs.unlink(old_path, function (err) {// Delete the file
                                        if (err) return false
                                        return callback(image_path)
                                    })
                                });
                            })
                        })
                    else callback(false)
                })
                promise.catch(() => {
                    callback(false)
                })

            })
        });
    }
}
