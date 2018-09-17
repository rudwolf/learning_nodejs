module.exports.startChat = function(application, req, res) {
    var formData = req.body;
    req.assert('login', 'Name or Nickname is required').notEmpty();
    req.assert('login', 'Name or Nickname must contain between 3 or 15 characters').len(3, 15);

    var errors = req.validationErrors();

    if(errors) {
        res.render('index', {validation: errors});
        return;
    }

    application.get('io').emit('clientMsg',{
        nickname: formData.login,
        msg: ' has just joined this chat!'
    });
    
    res.render('chat', {formData: formData});
};