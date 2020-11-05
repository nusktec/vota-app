/**
 * Created by revelation on 05/11/2020.
 * Reedax.IO Technologies Limited *
 * Developer Revelation A.F *
 */
let express = require('express');
let router = express.Router();
let fs = require('fs');
let sha1 = require('sha1');
let md5 = require('md5');
const moveFile = require('move-file');
let util = require("../utils/utils");
let fileUpload = require('express-fileupload');

//configure file uploads
router.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
    debug: false,
    abortOnLimit: true,
    useTempFiles: true,
}));

/* image  user. */
router.all('/image', function (req, res, next) {
    //check if body is empty
    (async () => {
        if (!req.files.image) {
            util.Jwr(res, false, {url: null}, "Uploading Unsuccessful !");
            return;
        }
        if (req.files.image.mimetype.split("/")[0] !== 'image') {
            util.Jwr(res, false, {url: null}, "Uploading Unsuccessful, File format mis-matched url acceptable format !");
            return;
        }
        let filename = "assets/images/" + req.files.image.md5 + ".jpg";
        await moveFile(req.files.image.tempFilePath, 'public/' + filename);
        util.Jwr(res, true, {url: req.get('host') + "/" + filename}, "Uploaded !");
    })().catch(err => {
        util.Jwr(res, false, {url: null, err: err}, "Uploading Unsuccessful 0400");
    });
});

/* pdf user. */
router.all('/pdf', function (req, res, next) {
    //check if body is empty
    (async () => {
        if (!req.files.pdf) {
            util.Jwr(res, false, {url: null}, "Uploading Unsuccessful !");
            return;
        }
        if (req.files.pdf.mimetype !== 'application/pdf') {
            util.Jwr(res, false, {url: null}, "Uploading Unsuccessful, File format mis-matched url acceptable format !");
            return;
        }
        let filename = "assets/documents/" + req.files.pdf.md5 + ".pdf";
        await moveFile(req.files.pdf.tempFilePath, 'public/' + filename);
        util.Jwr(res, true, {url: req.get('host') + "/" + filename}, "Uploaded !");
    })().catch(err => {
        util.Jwr(res, false, {url: null}, "Uploading Unsuccessful 0400");
    });
});

/* mp4 user. */
router.all('/video', function (req, res, next) {
    //check if body is empty
    (async () => {
        if (!req.files.video) {
            util.Jwr(res, false, {url: null}, "Uploading Unsuccessful !");
            return;
        }
        if (req.files.video.mimetype.split("/")[0] !== 'video') {
            util.Jwr(res, false, {url: null}, "Uploading Unsuccessful, File format mis-matched url acceptable format !");
            return;
        }
        let filename = "assets/videos/" + req.files.video.md5 + ".pdf";
        await moveFile(req.files.video.tempFilePath, 'public/' + filename);
        util.Jwr(res, true, {url: req.get('host') + "/" + filename}, "Uploaded !");
    })().catch(err => {
        util.Jwr(res, false, {url: null}, "Uploading Unsuccessful 0400");
    });
});

router.all('/delete', function (req, res, next) {
    //check if body is empty
    (async () => {
        let d = req.body;
        if (d) {
            //fs.unlinkSync("assets/" + d.path);
            await fs.unlinkSync("public/assets/" + d.path);
        }
        util.Jwr(res, true, {url: null}, "Deleted !");
    })().catch(err => {
        util.Jwr(res, false, {url: null, error: err}, "Unable to delete 0400");
    });
});

module.exports = router;