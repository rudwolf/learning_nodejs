function NewsDAO(conn) {
    this._conn = conn;
}

NewsDAO.prototype.getAll = function( callback){
    sqlQry = 'select * from news';
    this._conn.query(sqlQry, callback);
};

NewsDAO.prototype.getSingle = function(callback){
    sqlQry = 'select * from news where id = 1';
    this._conn.query(sqlQry, callback);
};

NewsDAO.prototype.save = function(news_body, callback){
    //console.log(news_body);
    this._conn.query('insert into news set ?', news_body, callback);
};

module.exports = function(app) {
    return NewsDAO;    
};