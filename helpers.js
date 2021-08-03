const docsFilter = function (req, file, cb) {

    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|docx|DOCX|DOC|doc|PDF|pdf|pptx|PPTX|ppt|PPT)$/)) {
        req.fileValidationError = 'Almost all files are allowed!';
        return cb(new Error('Your type of file is not allowed!'), false);
    }
    cb(null, true);
};
exports.docsFilter = docsFilter;